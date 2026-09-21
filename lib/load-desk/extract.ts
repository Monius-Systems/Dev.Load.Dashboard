import {
  createFileProgress,
  type FileProgress,
} from './extract-progress';
import { rectifyPage } from '../scanner/rectify';
import type { ObservedTicket, PaperFrame } from './recovery/contract';
import {
  observedFromWire,
  observedToExtracted,
  type ExtractedTicket,
} from './ticket-extraction';

/**
 * Reading a ticket. Each page is cut down to the ticket itself, sized, and sent
 * to the model behind /api/extract, which looks at the picture and answers with
 * the fields. The key stays on the server; the browser only ever posts an image.
 *
 * One ticket per PDF page, as before.
 */

/**
 * The longest edge of the picture the model is sent. Past about this the model
 * gains no detail it can use and the upload only takes longer, and every ticket
 * comes through here, so it is worth not sending a 48-megapixel still.
 */
const MODEL_LONG_EDGE = 2048;
/** PDF pages are rendered at this many dots per inch before being sent. */
const PDF_DPI = 200;

export type ExtractedPage = {
  page: number;
  /** What the read produced, kept on the record as the read of this ticket. */
  text: string;
  /**
   * The fields the model returned, and only the ones it saw whole. Absent for
   * a plain-text ticket file.
   */
  extracted?: ExtractedTicket;
  /**
   * The same read, field by field, with the damage still in it: the ink as
   * printed beside what the reader made of it. The recovery layer works from
   * this; `extracted` is what is safe to act on without it.
   */
  observed?: ObservedTicket;
  /**
   * Where the edges of the sheet stood in the photograph, from the document
   * detector. Absent for a PDF page, which is not a photograph of anything and
   * has no edges to lose. Without it, print missing off one side of a field
   * cannot be told from print the camera cut off.
   */
  paper?: PaperFrame;
};

const canvasOf = (width: number, height: number) =>
  Object.assign(document.createElement('canvas'), { width, height });

const blobOf = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not prepare the page'))),
      'image/jpeg',
      0.9,
    ),
  );

/** The page at the size the model is sent, never enlarged past what it has. */
function sizedForModel(page: HTMLCanvasElement) {
  const edge = Math.max(page.width, page.height);
  const scale = edge > MODEL_LONG_EDGE ? MODEL_LONG_EDGE / edge : 1;
  if (scale === 1) return page;
  const out = canvasOf(
    Math.max(1, Math.round(page.width * scale)),
    Math.max(1, Math.round(page.height * scale)),
  );
  const context = out.getContext('2d')!;
  context.imageSmoothingQuality = 'high';
  context.drawImage(page, 0, 0, out.width, out.height);
  return out;
}

/** What one page's read gives back: the observation, and the safe view of it. */
type PageReading = { extracted: ExtractedTicket; observed: ObservedTicket };

/**
 * Posts one page to the reader and returns what it answered.
 *
 * The observation is read here rather than the flat answer being taken as
 * given, so the exact-only rule is applied on this side of the wire too: a
 * browser that reached an older route, or a route that answered without the
 * observation, still gets a reading nothing was completed in.
 */
/**
 * How many times one page is sent before the read is given up on, and how
 * long to wait between goes. The model takes several seconds over a page,
 * and a phone's connection beside a truck does not always last that long:
 * Safari reports the dropped request as "Load failed", and a scan of two
 * tickets lost one of them to it. A request that dies on the wire, or that
 * the server turns away for a moment (a 502, a 503, a 429), is sent again,
 * with a pause that grows; a request the server refuses on its merits — a
 * 400, a 401, a 413 — is not, because it will be refused again.
 */
// The first go again is almost at once: the usual failure is Safari sending
// the second page down a connection the server closed after the long first
// one, and reporting the reset as "Load failed" rather than trying again as
// other browsers do. A fresh request opens a fresh connection.
const READ_ATTEMPTS = 4;
const READ_BACKOFF_MS = [300, 1500, 4000];
const RETRY_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Posts one image, sending it again when the wire or the server lets it down. */
async function postImage(image: Blob): Promise<Response> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < READ_ATTEMPTS; attempt++) {
    if (attempt > 0) await pause(READ_BACKOFF_MS[Math.min(attempt - 1, READ_BACKOFF_MS.length - 1)]);
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': image.type || 'image/jpeg' },
        body: image,
      });
      if (!RETRY_STATUSES.has(response.status) || attempt === READ_ATTEMPTS - 1) return response;
      lastError = new Error(`The reader answered ${response.status}.`);
    } catch (error) {
      // A TypeError is the fetch itself failing — no network, a dropped
      // connection, the page put away mid-request — and is worth another go.
      lastError = error;
    }
  }
  throw new Error(
    'The reader could not be reached. Check the connection and tap Process tickets again.',
    { cause: lastError },
  );
}

async function readPage(page: HTMLCanvasElement): Promise<PageReading> {
  const sized = sizedForModel(page);
  const image = await blobOf(sized);
  if (sized !== page) sized.width = sized.height = 0;
  const response = await postImage(image);
  const answer = (await response.json().catch(() => null)) as
    | { extracted?: unknown; observed?: unknown; error?: string }
    | null;
  if (!response.ok) throw new Error(answer?.error || 'The ticket could not be read.');
  // The route has already read the model's answer; what arrives here is the
  // observation itself, and is taken as one. Only an older route, answering
  // with the flat fields alone, goes through the reader.
  const observed = observedFromWire(answer?.observed ?? answer?.extracted);
  return { extracted: observedToExtracted(observed), observed };
}

/** One ticket per page. `progress` hears how much of this file is done. */
export async function extractPages(
  blob: Blob,
  type: string,
  progress: (update: FileProgress) => void,
): Promise<ExtractedPage[]> {
  const tracker = createFileProgress(progress);
  if (type === 'text/plain') {
    const text = await blob.text();
    tracker.done();
    return [{ text, page: 1 }];
  }
  const finish = (page: number, read: PageReading, paper?: PaperFrame): ExtractedPage => ({
    page,
    extracted: read.extracted,
    observed: read.observed,
    paper,
    // What "What the scan read" shows, and what is stored on the record: the
    // observation with the damage still in it, not the flat view with the
    // damaged fields taken out. A ticket that came back mostly blank is only
    // explicable from what the reader actually saw of it.
    // Compact, not indented: this string is stored on every record and sent
    // back with every list of records, so its bytes are paid for on every
    // page load, and the two-space indent was a third of them.
    text: JSON.stringify(read.observed ?? read.extracted),
  });

  if (type !== 'application/pdf') {
    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(blob);
    } catch {
      throw new Error('This file could not be opened as an image.');
    }
    const canvas = canvasOf(bitmap.width, bitmap.height);
    try {
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
      bitmap.close();
      tracker.step(1, 'render', 0.4);
      // A photograph is a scene with a ticket somewhere in it. Cut it down to
      // the ticket and straighten it, exactly as the camera in Load Desk does.
      // Fails safe: a picture no sheet can be found in is sent whole.
      //
      // Where the sheet's edges stood is kept before the crop throws them
      // away: it is the difference between a field the printer ran off the
      // paper and one this photograph simply missed.
      const { paper } = await rectifyPage(canvas);
      tracker.step(1, 'render', 1);
      tracker.step(1, 'read', 0.1);
      const stopCreep = tracker.creep(1, 'read', 0.1);
      let read: PageReading;
      try {
        read = await readPage(canvas);
      } finally {
        stopCreep();
      }
      tracker.step(1, 'read', 1);
      tracker.done();
      return [finish(1, read, paper)];
    } finally {
      canvas.width = canvas.height = 0;
    }
  }

  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/ocr/pdf.worker.min.mjs';
  const loading = pdfjs.getDocument({
    data: new Uint8Array(await blob.arrayBuffer()),
  });
  const pdf = await loading.promise;
  try {
    tracker.setPages(pdf.numPages);
    const pages: ExtractedPage[] = [];
    for (let page = 1; page <= pdf.numPages; page++) {
      tracker.step(page, 'render', 0);
      const source = await pdf.getPage(page);
      const viewport = source.getViewport({ scale: PDF_DPI / 72 });
      const canvas = canvasOf(Math.ceil(viewport.width), Math.ceil(viewport.height));
      try {
        await source.render({ canvas, viewport }).promise;
        tracker.step(page, 'render', 1);
        tracker.step(page, 'read', 0.1);
        const stopCreep = tracker.creep(page, 'read', 0.1);
        let read: PageReading;
        try {
          read = await readPage(canvas);
        } finally {
          stopCreep();
        }
        pages.push(finish(page, read));
        tracker.step(page, 'read', 1);
      } finally {
        canvas.width = canvas.height = 0;
        source.cleanup();
      }
    }
    tracker.done();
    return pages;
  } finally {
    await loading.destroy();
  }
}
