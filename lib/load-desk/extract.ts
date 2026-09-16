import {
  createFileProgress,
  type FileProgress,
} from './extract-progress';
import { rectifyPage } from '../scanner/rectify';
import { readExtracted, type ExtractedTicket } from './ticket-extraction';

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
  /** The fields the model returned. Absent for a plain-text ticket file. */
  extracted?: ExtractedTicket;
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

/** Posts one page to the reader and returns the fields it answered with. */
async function readPage(page: HTMLCanvasElement): Promise<ExtractedTicket> {
  const sized = sizedForModel(page);
  const image = await blobOf(sized);
  if (sized !== page) sized.width = sized.height = 0;
  const response = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': image.type || 'image/jpeg' },
    body: image,
  });
  const answer = (await response.json().catch(() => null)) as
    | { extracted?: unknown; error?: string }
    | null;
  if (!response.ok) throw new Error(answer?.error || 'The ticket could not be read.');
  return readExtracted(answer?.extracted);
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
  const finish = (page: number, extracted: ExtractedTicket): ExtractedPage => ({
    page,
    extracted,
    text: JSON.stringify(extracted, null, 2),
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
      await rectifyPage(canvas);
      tracker.step(1, 'render', 1);
      tracker.step(1, 'read', 0.1);
      const extracted = await readPage(canvas);
      tracker.step(1, 'read', 1);
      tracker.done();
      return [finish(1, extracted)];
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
        pages.push(finish(page, await readPage(canvas)));
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
