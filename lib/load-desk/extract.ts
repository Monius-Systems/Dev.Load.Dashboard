import {
  createFileProgress,
  type FileProgress,
  type PageStep,
} from './extract-progress';
import { readFieldRegions, type OcrWord } from './field-ocr';
import { readingRows } from './ocr-lines';
import { TABLE_OCR_MARKER } from './parser';
import { enhanceDocument, needsEnhancing, ocrScale } from '../scanner/enhance';
import { rectifyPage } from '../scanner/rectify';
/**
 * Local OCR: ticket bytes never leave the browser. One ticket per PDF page.
 * `progress` hears how much of this file is done (0 to 1) and the current step.
 */
export async function extractPages(
  blob: Blob,
  type: string,
  progress: (update: FileProgress) => void,
) {
  const tracker = createFileProgress(progress);
  if (type === 'text/plain') {
    const text = await blob.text();
    tracker.done();
    return [{ text, page: 1 }];
  }
  // The pass Tesseract's "recognizing text" events currently belong to.
  let pass: { page: number; step: PageStep } | null = null;
  const { createWorker, PSM } = await import('tesseract.js');
  const worker = await createWorker('eng', 1, {
    workerPath: '/ocr/worker.min.js',
    corePath: '/ocr',
    langPath: '/ocr',
    // The production server never serves *.gz files by their own name (it
    // treats them as precompressed variants), so the gzipped language data is
    // stored as eng.traineddata. Tesseract detects the gzip bytes itself.
    gzip: false,
    logger: (event) => {
      if (event.status !== 'recognizing text') {
        tracker.engine(event.status, event.progress);
      } else if (pass) {
        tracker.step(pass.page, pass.step, event.progress);
      }
    },
  });
  try {
    const sparse = () =>
      worker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT });
    await sparse();
    const recognize = async (image: Blob | HTMLCanvasElement) => {
      const { data } = await worker.recognize(image, {}, { blocks: true });
      const words: OcrWord[] = (data.blocks ?? []).flatMap((block) =>
        block.paragraphs.flatMap((paragraph) =>
          paragraph.lines.flatMap((line) => line.words),
        ),
      );
      return { text: readingRows(data.blocks) || data.text, words };
    };
    /** Full page, label-anchored boxed values, then a pass without table rules. */
    const readCanvas = async (canvas: HTMLCanvasElement, page: number) => {
      // Sized for the reader, then made to look like a scan, before anything
      // tries to read it.
      resizeForReading(canvas);
      readAsPaper(canvas);
      pass = { page, step: 'page' };
      const first = await recognize(canvas);
      // Field regions report per region; their many small passes would jitter.
      pass = null;
      const fields = await readFieldRegions(
        worker,
        { line: PSM.SINGLE_LINE, block: PSM.SINGLE_BLOCK },
        canvas,
        first.words,
        (done, total) => tracker.step(page, 'fields', total ? done / total : 1),
      );
      await sparse();
      removeTableRules(canvas);
      pass = { page, step: 'tables' };
      const tables = await recognize(canvas);
      pass = null;
      tracker.step(page, 'tables', 1);
      return [first.text, TABLE_OCR_MARKER, tables.text, fields]
        .filter(Boolean)
        .join('\n');
    };
    if (type !== 'application/pdf') {
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(blob);
      } catch {
        // Formats the browser cannot decode (such as TIFF) go straight to OCR.
        pass = { page: 1, step: 'page' };
        const text = (await recognize(blob)).text;
        tracker.done();
        return [{ text, page: 1 }];
      }
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      try {
        canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
        bitmap.close();
        // A photograph is a scene with a ticket somewhere in it. Cut it down to
        // the ticket and straighten it, exactly as the camera in Load Desk
        // does, before anything tries to read it. Fails safe: a picture no
        // sheet can be found in is read whole, as it always was.
        await rectifyPage(canvas);
        tracker.step(1, 'render', 1);
        const text = await readCanvas(canvas, 1);
        tracker.done();
        return [{ text, page: 1 }];
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
      const pages = [];
      for (let page = 1; page <= pdf.numPages; page++) {
        tracker.step(page, 'render', 0);
        const source = await pdf.getPage(page);
        const viewport = source.getViewport({ scale: 250 / 72 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        try {
          await source.render({ canvas, viewport }).promise;
          tracker.step(page, 'render', 1);
          pages.push({ text: await readCanvas(canvas, page), page });
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
  } finally {
    await worker.terminate();
  }
}

/**
 * Brings a page to the size the reader works best at. A thumbnail is enlarged
 * so the print has pixels to be recognised in; a full sensor photograph is
 * brought down so it is not spent chewing through detail that OCR cannot use.
 */
function resizeForReading(canvas: HTMLCanvasElement) {
  const scale = ocrScale(canvas.width, canvas.height);
  if (scale === 1) return;
  const width = Math.max(1, Math.round(canvas.width * scale));
  const height = Math.max(1, Math.round(canvas.height * scale));
  const scaled = document.createElement('canvas');
  scaled.width = width;
  scaled.height = height;
  const context = scaled.getContext('2d')!;
  context.imageSmoothingQuality = 'high';
  context.drawImage(canvas, 0, 0, width, height);
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')!.drawImage(scaled, 0, 0);
  scaled.width = scaled.height = 0;
}

/**
 * How uneven the lighting has to be before it is worth flattening. A page
 * rendered from a PDF scores zero and is left exactly as it was.
 */
const ENHANCE_FROM = 0.08;

/**
 * Photographs read as photographs: grey paper, a shadow across one corner, and
 * print only a little darker than the sheet. OCR is built for a flatbed, so the
 * lighting is divided out first and the range stretched back to black on white.
 * Without this a phone photo of a ticket can come back with nothing on it at
 * all — and the table-rule pass below, which calls anything under 160 ink,
 * would erase a dim photo's paper along with its print.
 *
 * This works on the copy the reader holds; the picture that was stored is not
 * touched.
 */
function readAsPaper(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')!;
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  if (needsEnhancing(pixels) <= ENHANCE_FROM) return;
  const paper = enhanceDocument(pixels, 'auto');
  context.putImageData(new ImageData(paper.data, paper.width, paper.height), 0, 0);
}

function removeTableRules(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')!;
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = pixels;
  const dark = (x: number, y: number) => data[(y * width + x) * 4] < 160;
  const clear = (x: number, y: number) => {
    const offset = (y * width + x) * 4;
    data[offset] = data[offset + 1] = data[offset + 2] = 255;
  };
  for (let y = 0; y < height; y++) {
    let start = 0;
    for (let x = 0; x <= width; x++) {
      if (x < width && dark(x, y)) continue;
      if (x - start > width * 0.06)
        for (let at = start; at < x; at++) clear(at, y);
      start = x + 1;
    }
  }
  for (let x = 0; x < width; x++) {
    let start = 0;
    for (let y = 0; y <= height; y++) {
      if (y < height && dark(x, y)) continue;
      if (y - start > height * 0.025)
        for (let at = start; at < y; at++) clear(x, at);
      start = y + 1;
    }
  }
  context.putImageData(pixels, 0, 0);
}
