// Finding the ticket inside an uploaded picture and straightening it.
//
// The camera in Load Desk has always done this: it detects the sheet, corrects
// the perspective, and hands the reader a page. A picture that arrives any
// other way — photographed with the phone's own camera app, sent through a
// chat, dropped in from a folder — never had it done, so the reader was given
// the whole scene: the ticket, the countertop it was lying on, and whatever
// else was in frame. Tesseract reads a speckled worktop as enthusiastically as
// it reads print, and the sheet itself ends up a fraction of the pixels.
//
// This is the same detector and the same warp the camera uses, over the same
// worker. Everything here fails safe: if the worker will not start, if nothing
// that looks like a sheet is found, or if anything at all goes wrong, the
// picture is left exactly as it arrived and reading carries on as before.

import { UNKNOWN_FRAME, type PaperFrame } from '../load-desk/recovery/contract.ts';
import { paperFrameOf, scannerConfig, type Quad } from './geometry.ts';

type Reply = {
  id: number;
  detection?: { corners: Quad; confidence: number } | null;
  image?: ImageData;
  error?: string;
  ready?: boolean;
};

/** Long enough for a big warp on a slow phone, short enough not to hang a page. */
const REPLY_TIMEOUT_MS = 20_000;
/**
 * The sheet has to be a believable share of the picture. A "document" filling
 * a twentieth of the frame is a shadow or a label, and cropping to it would
 * throw the ticket away — the one outcome worse than not cropping at all.
 */
const MIN_PAGE_AREA = 0.12;

let worker: Worker | null = null;
let ready: Promise<boolean> | null = null;
let sequence = 0;

/**
 * Starts the vision worker once per page, and remembers if it cannot start.
 *
 * The worker is OpenCV — ten megabytes of it — and it is reached only from
 * here, only in a browser, only once a picture is being read. It used to be
 * imported at the top of this file, which made it part of this module for every
 * environment the module is built for: the server built its own copy of the
 * worker and shipped it inside the Worker script, where nothing could ever run
 * it. Loaded on demand instead, behind a check the bundler resolves at build
 * time (`import.meta.env.SSR` is a constant in each environment), so the server
 * build does not contain the import at all and OpenCV exists only in the
 * browser's own bundle, fetched when a scan first needs it.
 */
function start(): Promise<boolean> {
  ready ??= (async () => {
    // Never on the server, and the bundler drops the import along with the
    // branch: there is no worker to start where there is no page to read on.
    if (import.meta.env.SSR || typeof window === 'undefined') return false;
    let ScannerWorker: new () => Worker;
    try {
      ({ default: ScannerWorker } = await import('./scanner.worker.ts?worker'));
    } catch {
      return false;
    }
    return new Promise<boolean>((resolve) => {
      try {
        worker = new ScannerWorker();
      } catch {
        resolve(false);
        return;
      }
      const timer = setTimeout(() => resolve(false), REPLY_TIMEOUT_MS);
      worker.addEventListener('message', function first(event: MessageEvent<Reply>) {
        if (!event.data?.ready) return;
        worker?.removeEventListener('message', first);
        clearTimeout(timer);
        resolve(true);
      });
      worker.addEventListener('error', () => {
        clearTimeout(timer);
        resolve(false);
      });
    });
  })();
  return ready;
}

/** One request to the worker, with a timeout so a page is never left hanging. */
function ask(
  kind: 'detect' | 'crop',
  image: ImageData,
  corners?: Quad,
): Promise<Reply> {
  return new Promise((resolve, reject) => {
    const target = worker;
    if (!target) {
      reject(new Error('Document processing unavailable'));
      return;
    }
    const id = ++sequence;
    const timer = setTimeout(() => {
      target.removeEventListener('message', onMessage);
      reject(new Error('Document processing timed out'));
    }, REPLY_TIMEOUT_MS);
    function onMessage(event: MessageEvent<Reply>) {
      if (event.data?.id !== id) return;
      target!.removeEventListener('message', onMessage);
      clearTimeout(timer);
      if (event.data.error) reject(new Error(event.data.error));
      else resolve(event.data);
    }
    target.addEventListener('message', onMessage);
    target.postMessage({ id, kind, image, corners }, [image.data.buffer]);
  });
}

const surface = (width: number, height: number) =>
  Object.assign(document.createElement('canvas'), { width, height });

/** The picture at a smaller size, for the detector to look at. */
function analysisOf(page: HTMLCanvasElement) {
  const scale = Math.min(
    1,
    scannerConfig.analysisSize / Math.max(page.width, page.height),
  );
  const small = surface(
    Math.max(1, Math.round(page.width * scale)),
    Math.max(1, Math.round(page.height * scale)),
  );
  small.getContext('2d')!.drawImage(page, 0, 0, small.width, small.height);
  return small;
}

/** The area of a quad in the 0-1 space the detector works in. */
function areaOf(corners: Quad) {
  let twice = 0;
  for (let i = 0; i < 4; i++) {
    const a = corners[i];
    const b = corners[(i + 1) % 4];
    twice += a.x * b.y - b.x * a.y;
  }
  return Math.abs(twice) / 2;
}

/** A detection worth acting on, or null: below these it is not a sheet. */
function trustworthy(detection: { corners: Quad; confidence: number } | null | undefined) {
  if (!detection) return null;
  if (detection.confidence < scannerConfig.minConfidence) return null;
  if (areaOf(detection.corners) < MIN_PAGE_AREA) return null;
  return detection;
}

/**
 * Looks for the sheet in one picture, at analysis size. The detector never
 * sees the full-resolution photograph: it is looking for four corners, which
 * a 720-pixel copy carries as well as a 2600-pixel one and a great deal
 * faster, and the answer is in the 0-1 space either way.
 */
async function detectIn(page: HTMLCanvasElement) {
  const small = analysisOf(page);
  try {
    const context = small.getContext('2d')!;
    const reply = await ask('detect', context.getImageData(0, 0, small.width, small.height));
    return trustworthy(reply.detection);
  } finally {
    small.width = small.height = 0;
  }
}

/** The picture on a canvas of its own, so the worker's transfer is never the caller's. */
function canvasOf(image: ImageData) {
  const page = surface(image.width, image.height);
  page.getContext('2d')!.putImageData(image, 0, 0);
  return page;
}

/**
 * Where the edges of the sheet stand in one picture, and nothing else: no
 * warp, no crop, nothing written back. The camera asks this of the photograph
 * it has just taken, to tell the person the ticket ran off the frame while
 * they are still standing over it and a retake costs a second.
 *
 * Fails open, the way everything else here does. A worker that will not start,
 * a picture with no sheet in it, or any error at all is UNKNOWN_FRAME, which
 * says nothing and so blocks nothing.
 */
export async function detectPaperFrame(
  source: HTMLCanvasElement | ImageData,
): Promise<PaperFrame> {
  // `instanceof ImageData` would be a ReferenceError where there is no DOM,
  // and this module is built for the server as well as the browser.
  const own = !('getContext' in source);
  const page = own ? canvasOf(source as ImageData) : (source as HTMLCanvasElement);
  try {
    if (!page.width || !page.height) return UNKNOWN_FRAME;
    if (!(await start())) return UNKNOWN_FRAME;
    const detection = await detectIn(page);
    return detection ? paperFrameOf(detection.corners) : UNKNOWN_FRAME;
  } catch {
    return UNKNOWN_FRAME;
  } finally {
    if (own) page.width = page.height = 0;
  }
}

/**
 * Replaces `page` with just the ticket in it, straightened. Returns whether it
 * found one, and where the sheet's own edges stood in the picture before it was
 * cut down — the crop throws that away, and it is the only evidence there is
 * for whether print missing off one side was the camera's doing or the
 * printer's. The canvas is only written to once a corrected page is in hand,
 * so a picture is never left half-processed.
 */
export async function rectifyPage(
  page: HTMLCanvasElement,
): Promise<{ found: boolean; paper: PaperFrame }> {
  // Every failure is the same failure here: read the picture as it came, and
  // say nothing about its edges rather than something that is not known.
  const unread = { found: false, paper: UNKNOWN_FRAME };
  if (!page.width || !page.height) return unread;
  try {
    if (!(await start())) return unread;
    const detection = await detectIn(page);
    if (!detection) return unread;
    const paper = paperFrameOf(detection.corners);
    const full = page.getContext('2d')!.getImageData(0, 0, page.width, page.height);
    const corrected = (await ask('crop', full, detection.corners)).image;
    if (!corrected?.width || !corrected.height) return { found: false, paper };
    page.width = corrected.width;
    page.height = corrected.height;
    page.getContext('2d')!.putImageData(corrected, 0, 0);
    return { found: true, paper };
  } catch {
    return unread;
  }
}
