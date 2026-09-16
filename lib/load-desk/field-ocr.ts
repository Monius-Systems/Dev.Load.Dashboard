import type { Worker } from 'tesseract.js';

// Full-page sparse OCR skips values inside boxed table cells and digits that
// touch a cell border. For the supported layouts, find printed labels and
// re-read the value rows next to them, one table cell at a time.

export const FIELD_OCR_MARKER = '--- FIELD OCR ---';

export type OcrWord = {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
};
type Rect = { x0: number; y0: number; x1: number; y1: number };
type Region = {
  key: string;
  rect: Rect;
  mode: 'line' | 'block';
  /** Split at printed cell borders and read each cell separately. */
  cells?: boolean;
  /**
   * The row ends in a number of at least this many digits. It is kept only
   * when readings at two scales agree; otherwise the field stays empty.
   */
  confirmDigits?: number;
  /**
   * Just the figure on the row, with the printed label left outside it. Read
   * on its own the reader can be told there are only digits in there, which
   * is what stops a 5 coming back as an S. Absent when the label could not be
   * located, and the whole row is read instead.
   */
  valueRect?: Rect;
};

/** A word that is printed wording rather than a figure that was misread. */
const isLabel = (word: OcrWord) => {
  const letters = (word.text.match(/[A-Za-z]/g) ?? []).length;
  const digits = (word.text.match(/\d/g) ?? []).length;
  return letters > 0 && letters >= digits;
};

/**
 * Where the printed label on a row ends, so the figure after it can be read by
 * itself. Null when no wording is found on the row — then the row is read whole
 * as it always was, rather than guessing where to cut it.
 */
function labelEnd(
  words: OcrWord[],
  rect: Rect,
  middle: number,
  pitch: number,
): number | null {
  const ends = words
    .filter(
      (word) =>
        Math.abs(center(word) - middle) < pitch * 0.5 &&
        word.bbox.x1 > rect.x0 &&
        word.bbox.x0 < rect.x1 &&
        isLabel(word),
    )
    .map((word) => word.bbox.x1);
  if (!ends.length) return null;
  const end = Math.max(...ends);
  // Leave room for the figure; a label running the whole width is not one.
  return end < rect.x1 - pitch ? end : null;
}

const center = (word: OcrWord) => (word.bbox.y0 + word.bbox.y1) / 2;
const height = (word: OcrWord) => word.bbox.y1 - word.bbox.y0;

function find(
  words: OcrWord[],
  pattern: RegExp,
  where: (word: OcrWord) => boolean = () => true,
) {
  return words.find((word) => pattern.test(word.text) && where(word));
}

function ontarioRegions(words: OcrWord[], width: number): Region[] {
  const regions: Region[] = [];
  const location = find(words, /^Location$/i);
  if (location) {
    const h = height(location);
    regions.push({
      key: 'PLANT ADDRESS',
      mode: 'block',
      rect: {
        x0: location.bbox.x0 - h,
        y0: location.bbox.y1 + h * 0.2,
        x1: location.bbox.x0 + h * 24,
        y1: location.bbox.y1 + h * 6.8,
      },
    });
  }
  // The value row under "Product: | Product Description: | Weight:".
  const header =
    find(words, /^Weight:?$/i, (word) => word.bbox.x0 > width * 0.6) ??
    find(words, /^Description:?$/i);
  if (header) {
    const h = height(header);
    regions.push({
      key: 'PRODUCT ROW',
      mode: 'line',
      cells: true,
      rect: {
        x0: width * 0.02,
        y0: header.bbox.y1 + h * 0.5,
        x1: width * 0.99,
        y1: header.bbox.y1 + h * 2.7,
      },
    });
  }
  // Scale box rows are evenly spaced; measure the pitch from Gross to Net.
  const right = (word: OcrWord) => word.bbox.x0 > width * 0.6;
  const gross = find(words, /^Gross:?$/i, right);
  const net = find(words, /^Net:?$/i, right);
  if (gross && net && center(net) > center(gross)) {
    const pitch = (center(net) - center(gross)) / 2;
    const row = (key: string, middle: number): Region => ({
      key,
      mode: 'line',
      cells: true,
      rect: {
        x0: gross.bbox.x0 - pitch * 0.3,
        y0: middle - pitch * 0.6,
        x1: width * 0.99,
        y1: middle + pitch * 0.6,
      },
    });
    regions.push(row('TODAY ROW', center(gross) - pitch * 3.4));
    regions.push(row('WEIGHMASTER ROW', center(net) + pitch * 2.35));
  }
  return regions;
}

function heidelbergRegions(words: OcrWord[], width: number): Region[] {
  const left = (word: OcrWord) => word.bbox.x0 < width * 0.55;
  const ordered = find(words, /^Ordered/i, left);
  const remaining = find(words, /^Remaining/i, left);
  if (!ordered || !remaining || center(remaining) <= center(ordered)) return [];
  const pitch = center(remaining) - center(ordered);
  // The dispatch box ends just after the last number on its "Today" row; the
  // carrier column ("License :") shares that row further right.
  const today = find(words, /^Today/i, left);
  const todayEnd = today
    ? words
        .filter(
          (word) =>
            Math.abs(center(word) - center(today)) < pitch * 0.5 &&
            word.bbox.x0 >= today.bbox.x0 &&
            /^\d+(?:\.\d+)?$/.test(word.text),
        )
        .reduce((end, word) => Math.max(end, word.bbox.x1), 0)
    : 0;
  const x1 =
    todayEnd > ordered.bbox.x1 + pitch * 4
      ? todayEnd + pitch * 0.6
      : ordered.bbox.x0 + pitch * 14;
  const row = (key: string, middle: number, confirmDigits: number): Region => {
    const rect = {
      x0: ordered.bbox.x0 - pitch * 0.3,
      y0: middle - pitch * 0.5,
      x1,
      y1: middle + pitch * 0.5,
    };
    const end = labelEnd(words, rect, middle, pitch);
    return {
      key,
      mode: 'line',
      confirmDigits,
      rect,
      ...(end === null
        ? {}
        : { valueRect: { ...rect, x0: end + pitch * 0.15 } }),
    };
  };
  return [
    row('DISPATCH ROW', center(ordered) - pitch, 5),
    row('ORDERED ROW', center(ordered), 1),
    row('REMAINING ROW', center(remaining), 1),
  ];
}

/** Label-anchored value regions for a page's recognized words. */
export function fieldRegions(words: OcrWord[], width: number): Region[] {
  if (words.some((word) => /Heidelberg|^BOL$/i.test(word.text))) {
    return heidelbergRegions(words, width);
  }
  return words.some((word) => /^(Ontario|Location)$/i.test(word.text))
    ? ontarioRegions(words, width)
    : [];
}

function blankCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);
  return { canvas, context };
}

/** Crops a region with a white margin, scaled up for OCR. Exported for checks. */
export function prepareRegion(
  source: HTMLCanvasElement,
  { rect }: Pick<Region, 'rect'>,
  { scale = 2 } = {},
) {
  const pad = 16;
  const x0 = Math.max(0, Math.floor(rect.x0));
  const y0 = Math.max(0, Math.floor(rect.y0));
  const w = Math.min(source.width, Math.ceil(rect.x1)) - x0;
  const h = Math.min(source.height, Math.ceil(rect.y1)) - y0;
  if (w <= 4 || h <= 4) return null;
  const { canvas, context } = blankCanvas(w * scale + pad * 2, h * scale + pad * 2);
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, x0, y0, w, h, pad, pad, w * scale, h * scale);
  return canvas;
}

/**
 * Splits a boxed table row at its printed borders. Returns one image per
 * non-empty cell, cropped inside the borders so rules never touch glyphs.
 */
export function tableCells(row: HTMLCanvasElement): HTMLCanvasElement[] {
  const { width, height } = row;
  const { data } = row
    .getContext('2d', { willReadFrequently: true })!
    .getImageData(0, 0, width, height);
  const dark = (x: number, y: number) => data[(y * width + x) * 4] < 150;
  const bands = (cover: number[], limit: number) => {
    const found: [number, number][] = [];
    let start = -1;
    for (let at = 0; at <= cover.length; at++) {
      const on = at < cover.length && cover[at] >= limit;
      if (on && start < 0) start = at;
      if (!on && start >= 0) {
        found.push([start, at]);
        start = -1;
      }
    }
    return found;
  };

  const rowCover = Array.from({ length: height }, (_, y) => {
    let count = 0;
    for (let x = 0; x < width; x++) if (dark(x, y)) count++;
    return count;
  });
  // Scanned rules are often faint and broken, so a partial run still counts.
  const horizontal = bands(rowCover, width * 0.35);
  const top = horizontal.filter(([, end]) => end <= height / 2).at(-1)?.[1] ?? 0;
  const bottom = horizontal.find(([start]) => start >= height / 2)?.[0] ?? height;
  if (bottom - top < 12) return [row];

  const columnCover = Array.from({ length: width }, (_, x) => {
    let count = 0;
    for (let y = top; y < bottom; y++) if (dark(x, y)) count++;
    return count;
  });
  const vertical = bands(columnCover, (bottom - top) * 0.7);
  const edges: [number, number][] = [[0, 0], ...vertical, [width, width]];
  const margin = 4;
  const cells: HTMLCanvasElement[] = [];
  for (let index = 0; index < edges.length - 1; index++) {
    const x0 = edges[index][1] + margin;
    const x1 = edges[index + 1][0] - margin;
    const y0 = top + margin;
    const y1 = bottom - margin;
    if (x1 - x0 < 16) continue;
    let ink = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (dark(x, y)) ink++;
    if (ink < 30) continue;
    const { canvas, context } = blankCanvas(x1 - x0 + 32, y1 - y0 + 32);
    context.drawImage(row, x0, y0, x1 - x0, y1 - y0, 16, 16, x1 - x0, y1 - y0);
    cells.push(canvas);
  }
  return cells.length ? cells : [row];
}

/**
 * Clears table rules without erasing glyphs they cross: a pixel on a long
 * straight run is cleared only where the run is thin at that point.
 */
function removeThinRules(canvas: HTMLCanvasElement) {
  const { width, height } = canvas;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  const image = context.getImageData(0, 0, width, height);
  const { data } = image;
  const dark = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < width && y < height && data[(y * width + x) * 4] < 160;
  const maxThickness = 9;
  const thickness = (x: number, y: number, horizontal: boolean) => {
    let extent = 1;
    for (const direction of [1, -1]) {
      for (let step = 1; step <= maxThickness; step++) {
        const next = horizontal
          ? dark(x, y + direction * step)
          : dark(x + direction * step, y);
        if (!next) break;
        extent++;
      }
    }
    return extent;
  };
  const clear: number[] = [];
  const scan = (horizontal: boolean) => {
    const outer = horizontal ? height : width;
    const inner = horizontal ? width : height;
    const minimum = horizontal ? Math.max(40, width * 0.25) : height * 0.6;
    for (let a = 0; a < outer; a++) {
      let start = 0;
      for (let b = 0; b <= inner; b++) {
        const x = horizontal ? b : a;
        const y = horizontal ? a : b;
        if (b < inner && dark(x, y)) continue;
        if (b - start > minimum) {
          for (let at = start; at < b; at++) {
            const px = horizontal ? at : a;
            const py = horizontal ? a : at;
            if (thickness(px, py, horizontal) <= maxThickness) {
              clear.push(py * width + px);
            }
          }
        }
        start = b + 1;
      }
    }
  };
  scan(true);
  scan(false);
  for (const pixel of clear) {
    data[pixel * 4] = data[pixel * 4 + 1] = data[pixel * 4 + 2] = 255;
  }
  context.putImageData(image, 0, 0);
}

/**
 * Removes rules, then crops tightly around the remaining ink with a white
 * margin. Returns null when nothing but specks remain. Exported for checks.
 */
export function isolateInk(source: HTMLCanvasElement) {
  const { width, height } = source;
  const { canvas: work, context } = blankCanvas(width, height);
  context.drawImage(source, 0, 0);
  removeThinRules(work);
  const { data } = context.getImageData(0, 0, width, height);
  const dark = (x: number, y: number) => data[(y * width + x) * 4] < 160;
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Ignore isolated specks left by scanning and rule removal.
      if (!dark(x, y) || !(dark(Math.min(x + 1, width - 1), y) || dark(x, Math.min(y + 1, height - 1)))) continue;
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
  }
  if (x1 - x0 < 6 || y1 - y0 < 6) {
    work.width = work.height = 0;
    return null;
  }
  const margin = 20;
  const { canvas } = blankCanvas(x1 - x0 + 1 + margin * 2, y1 - y0 + 1 + margin * 2);
  canvas
    .getContext('2d')!
    .drawImage(work, x0, y0, x1 - x0 + 1, y1 - y0 + 1, margin, margin, x1 - x0 + 1, y1 - y0 + 1);
  work.width = work.height = 0;
  return canvas;
}

/** Trailing standalone number of a row reading, ignoring cell borders. */
const trailingNumber = (text: string) =>
  /(?:^|\s)(\d+)$/.exec(text.replace(/[|[\]]/g, ' ').trim())?.[1] ?? null;

/** Reads one rect at two scales; the answer only counts when both agree. */
async function readAtTwoScales(
  worker: Worker,
  source: HTMLCanvasElement,
  rect: Rect,
) {
  const readings: (string | null)[] = [];
  for (const scale of [2, 3]) {
    const canvas = prepareRegion(source, { rect }, { scale });
    const ink = canvas && isolateInk(canvas);
    if (canvas) canvas.width = canvas.height = 0;
    if (!ink) return null;
    const { data } = await worker.recognize(ink);
    ink.width = ink.height = 0;
    readings.push(trailingNumber(data.text.split('\n').join(' ')));
  }
  // A number crossed by a table rule can read differently at each scale;
  // an empty field is flagged for review, a wrong one would not be.
  const [first, second] = readings;
  return first && first === second ? first : null;
}

async function readConfirmedNumber(
  worker: Worker,
  psm: { line: string; block: string },
  source: HTMLCanvasElement,
  region: Region & { confirmDigits: number },
) {
  await worker.setParameters({ tessedit_pageseg_mode: psm.line as never });
  // The figure by itself, with the reader told it is looking at digits. This
  // is what removes the whole 0/O, 1/I, 5/S, 8/B family of misreadings rather
  // than repairing them afterwards. The wording on the row is left out of the
  // crop, because under a digits-only alphabet a label reads as nonsense
  // figures that could be mistaken for the value.
  if (region.valueRect) {
    try {
      await worker.setParameters({ tessedit_char_whitelist: '0123456789' });
      const digits = await readAtTwoScales(worker, source, region.valueRect);
      if (digits && digits.length >= region.confirmDigits) return digits;
    } finally {
      // Cleared before anything reads words again, whatever happened above.
      await worker.setParameters({ tessedit_char_whitelist: '' });
    }
  }
  // Failing that, the whole row as before: a label that could not be found, a
  // figure that ran into it, or a crop that came out empty.
  const whole = await readAtTwoScales(worker, source, region.rect);
  return whole && whole.length >= region.confirmDigits ? whole : '';
}

async function readRegion(
  worker: Worker,
  psm: { line: string; block: string },
  source: HTMLCanvasElement,
  region: Region,
) {
  if (region.confirmDigits) {
    return readConfirmedNumber(worker, psm, source, {
      ...region,
      confirmDigits: region.confirmDigits,
    });
  }
  const canvas = prepareRegion(source, region);
  if (!canvas) return '';
  // Block regions (addresses) have no rules; boxed rows lose their borders
  // and are cropped to the ink so Tesseract never reads a rule as text.
  const images =
    region.mode === 'block'
      ? [canvas]
      : (region.cells ? tableCells(canvas) : [canvas])
          .map(isolateInk)
          .filter((image): image is HTMLCanvasElement => image !== null);
  try {
    await worker.setParameters({
      // Single cells read best as a block; whole rows as a line.
      tessedit_pageseg_mode: (region.mode === 'line' && !region.cells
        ? psm.line
        : psm.block) as never,
    });
    const parts: string[] = [];
    for (const image of images) {
      const { data } = await worker.recognize(image);
      const text = data.text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join(region.mode === 'line' ? ' ' : ' | ');
      if (text) parts.push(text);
    }
    return parts.join(' | ');
  } finally {
    for (const image of new Set([canvas, ...images])) {
      image.width = image.height = 0;
    }
  }
}

/**
 * Returns a FIELD OCR section ("KEY: text" lines) for the page, or '' when the
 * layout is not recognized. Changes the worker's page segmentation mode.
 * `onRegion` hears how many regions are read so far, out of how many.
 */
export async function readFieldRegions(
  worker: Worker,
  psm: { line: string; block: string },
  canvas: HTMLCanvasElement,
  words: OcrWord[],
  onRegion?: (done: number, total: number) => void,
) {
  const lines: string[] = [];
  const regions = fieldRegions(words, canvas.width);
  onRegion?.(0, regions.length);
  for (const [index, region] of regions.entries()) {
    const text = await readRegion(worker, psm, canvas, region);
    if (text) lines.push(`${region.key}: ${text}`);
    onRegion?.(index + 1, regions.length);
  }
  return lines.length ? `${FIELD_OCR_MARKER}\n${lines.join('\n')}` : '';
}
