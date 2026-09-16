// Turning a photograph of a ticket into something that reads like a scan.
//
// OCR expects what a flatbed gives it: white paper, black print, the same
// everywhere on the page. A phone gives none of that. Paper photographed in a
// yard or a cab comes out grey, one corner is in the truck's shadow and the
// other has sun on it, and a carbon copy's print is barely darker than the
// sheet it is on. Handed that, Tesseract reads little or nothing — not because
// the picture is unreadable, but because the page it is looking for is not the
// page it was given.
//
// So the lighting is measured and divided out before anything else: paper
// becomes paper again, wherever it was standing, and the print is whatever is
// darker than the paper around it. Everything here is plain arithmetic over
// the pixels, so it runs in the browser, in a worker, and under the tests.

/** ImageData, structurally — so this runs under Node in the tests too. */
export type Pixels = {
  /** Pinned to a plain ArrayBuffer so the result is an ImageData's own shape. */
  data: Uint8ClampedArray<ArrayBuffer>;
  width: number;
  height: number;
};

/**
 * What the picture should be made to look like.
 * - `auto`: flattened and stretched grey. What OCR reads best, and the default.
 * - `grey`: flattened grey, gentler, for a ticket whose print is faint.
 * - `bw`: pure black on white, for a carbon copy or a faded thermal ticket.
 * - `original`: the photograph, untouched.
 */
export const DOCUMENT_FILTERS = ['auto', 'grey', 'bw', 'original'] as const;
export type DocumentFilter = (typeof DOCUMENT_FILTERS)[number];

/** Side of the square the paper brightness is measured over, in pixels. */
const TILE = 24;
/**
 * Within one tile, the brightness the paper sits at. Print is the dark
 * minority of a tile, so a high percentile lands on the sheet rather than on
 * the ink — and staying below the very top ignores a specular highlight.
 */
const PAPER_PERCENTILE = 0.8;
/** Ink is this much darker than the paper beside it, for `bw`. */
const INK_RATIO = 0.84;
/**
 * And this many levels darker in plain terms. Deep in a shadow the paper is
 * dark enough that a ratio alone lets the sensor's own noise across, which
 * prints as a spray of black speckles where the light was worst.
 */
const MIN_INK_GAP = 12;
/**
 * A patch this much darker than the best-lit paper on the page has no signal
 * left in it — only sensor noise — so `bw` leaves it blank rather than printing
 * the noise as a spray of black. Relative, so a whole ticket shot in poor light
 * is still read; it is only a patch far darker than the rest that is given up on.
 */
const DEAD_SHADOW = 0.2;

const luminance = (data: Uint8ClampedArray, at: number) =>
  (data[at] * 299 + data[at + 1] * 587 + data[at + 2] * 114) / 1000;

/** The grey of every pixel, which everything below is measured from. */
function greyOf({ data, width, height }: Pixels) {
  const grey = new Uint8ClampedArray(width * height);
  for (let i = 0; i < grey.length; i++) grey[i] = luminance(data, i * 4);
  return grey;
}

/**
 * How bright the paper is across the page: one reading per tile, smoothed so
 * the tiles do not print as squares. Dividing by this is what removes a
 * shadow, a gradient, or a photo taken under one warm bulb.
 */
function paperField(grey: Uint8ClampedArray, width: number, height: number) {
  const cols = Math.max(1, Math.ceil(width / TILE));
  const rows = Math.max(1, Math.ceil(height / TILE));
  const field = new Float32Array(cols * rows);
  const histogram = new Uint32Array(256);
  for (let ty = 0; ty < rows; ty++) {
    for (let tx = 0; tx < cols; tx++) {
      histogram.fill(0);
      const endX = Math.min(width, (tx + 1) * TILE);
      const endY = Math.min(height, (ty + 1) * TILE);
      let count = 0;
      for (let y = ty * TILE; y < endY; y++) {
        for (let x = tx * TILE; x < endX; x++) {
          histogram[grey[y * width + x]]++;
          count++;
        }
      }
      let seen = 0;
      let value = 255;
      const target = count * PAPER_PERCENTILE;
      for (let v = 0; v < 256; v++) {
        seen += histogram[v];
        if (seen >= target) {
          value = v;
          break;
        }
      }
      // Never zero: this is about to be divided by.
      field[ty * cols + tx] = Math.max(1, value);
    }
  }
  return { field: smooth(smooth(field, cols, rows), cols, rows), cols, rows };
}

/** A 3x3 average over the tile readings, edges held. */
function smooth(field: Float32Array, cols: number, rows: number) {
  const out = new Float32Array(field.length);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let sum = 0;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const sx = x + dx;
          const sy = y + dy;
          if (sx < 0 || sy < 0 || sx >= cols || sy >= rows) continue;
          sum += field[sy * cols + sx];
          n++;
        }
      }
      out[y * cols + x] = sum / n;
    }
  }
  return out;
}

/** The paper brightness under one pixel, read smoothly between tile centres. */
function paperAt(
  field: Float32Array,
  cols: number,
  rows: number,
  x: number,
  y: number,
) {
  const fx = Math.min(cols - 1, Math.max(0, x / TILE - 0.5));
  const fy = Math.min(rows - 1, Math.max(0, y / TILE - 0.5));
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const x1 = Math.min(cols - 1, x0 + 1);
  const y1 = Math.min(rows - 1, y0 + 1);
  const tx = fx - x0;
  const ty = fy - y0;
  const top = field[y0 * cols + x0] * (1 - tx) + field[y0 * cols + x1] * tx;
  const bottom = field[y1 * cols + x0] * (1 - tx) + field[y1 * cols + x1] * tx;
  return top * (1 - ty) + bottom * ty;
}

/** 1 2 1 / 2 4 2 / 1 2 1 weights: the eight kernel entries around the centre. */
const SOFTEN = [
  [-1, -1, 1], [0, -1, 2], [1, -1, 1],
  [-1, 0, 2], [1, 0, 2],
  [-1, 1, 1], [0, 1, 2], [1, 1, 1],
] as const;

/**
 * A gentle 3x3 Gaussian. Weighted towards the pixel itself on purpose: a flat
 * average over nine pixels takes the gaps out of small print and prints a line
 * of text as one black bar.
 */
function soften(grey: Uint8ClampedArray, width: number, height: number) {
  const out = new Uint8ClampedArray(grey.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = grey[y * width + x] * 4;
      for (const [dx, dy, weight] of SOFTEN) {
        const sy = Math.min(height - 1, Math.max(0, y + dy));
        const sx = Math.min(width - 1, Math.max(0, x + dx));
        sum += grey[sy * width + sx] * weight;
      }
      out[y * width + x] = sum / 16;
    }
  }
  return out;
}

/** The value at a position in a distribution, 0 to 1 through the histogram. */
function percentile(histogram: Uint32Array, count: number, at: number) {
  let seen = 0;
  const target = count * at;
  for (let v = 0; v < 256; v++) {
    seen += histogram[v];
    if (seen >= target) return v;
  }
  return 255;
}

/**
 * The photograph as a page: lighting divided out, then the range of what is
 * left pulled back over black-to-white. Returns new pixels; the input is left
 * as it was, because the original photo is what gets stored.
 */
export function enhanceDocument(
  image: Pixels,
  filter: DocumentFilter = 'auto',
): Pixels {
  const { width, height } = image;
  const out = new Uint8ClampedArray(image.data.length);
  if (filter === 'original' || width < 2 * TILE || height < 2 * TILE) {
    out.set(image.data);
    return { data: out, width, height };
  }
  const grey = greyOf(image);
  const { field, cols, rows } = paperField(grey, width, height);

  if (filter === 'bw') {
    // Deciding ink pixel by pixel turns noise into speckle, so the comparison
    // is made against the average of each pixel's neighbours, the way any
    // adaptive threshold blurs before it cuts.
    const soft = soften(grey, width, height);
    let brightest = 1;
    for (const value of field) if (value > brightest) brightest = value;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const at = y * width + x;
        const paper = paperAt(field, cols, rows, x, y);
        const ink =
          paper > brightest * DEAD_SHADOW &&
          soft[at] < paper * INK_RATIO &&
          paper - soft[at] > MIN_INK_GAP;
        const value = ink ? 0 : 255;
        out[at * 4] = out[at * 4 + 1] = out[at * 4 + 2] = value;
        out[at * 4 + 3] = 255;
      }
    }
    return { data: out, width, height };
  }

  // Flatten: every pixel against the paper beside it rather than against the
  // brightest corner of the photograph. Only the grey filters need this, so it
  // is done after `bw` has already returned.
  const flat = new Uint8ClampedArray(width * height);
  const histogram = new Uint32Array(256);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const at = y * width + x;
      flat[at] = Math.min(255, (grey[at] * 255) / paperAt(field, cols, rows, x, y));
      histogram[flat[at]]++;
    }
  }

  // Stretch: the darkest print to black and the paper to white. The white
  // point is taken well inside the distribution because most of a ticket is
  // paper, so that percentile is the sheet itself.
  const count = width * height;
  const black = percentile(histogram, count, filter === 'grey' ? 0.005 : 0.02);
  const white = Math.max(
    black + 24,
    percentile(histogram, count, filter === 'grey' ? 0.9 : 0.75),
  );
  const span = white - black;
  const curve = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v++) {
    curve[v] = Math.max(0, Math.min(255, ((v - black) * 255) / span));
  }
  for (let at = 0; at < count; at++) {
    const value = curve[flat[at]];
    out[at * 4] = out[at * 4 + 1] = out[at * 4 + 2] = value;
    out[at * 4 + 3] = 255;
  }
  return { data: out, width, height };
}

/**
 * How far from a clean scan this picture is, 0 (already one) to 1 (a photo
 * with the light all over the place). A page rendered from a PDF needs none of
 * this, and enhancing it anyway only adds noise.
 */
export function needsEnhancing(image: Pixels): number {
  const { width, height } = image;
  if (width < 2 * TILE || height < 2 * TILE) return 0;
  const grey = greyOf(image);
  const { field } = paperField(grey, width, height);
  let low = 255;
  let high = 0;
  for (const value of field) {
    if (value < low) low = value;
    if (value > high) high = value;
  }
  // A scan's paper is bright and even. Either a dim sheet or an uneven one
  // means the lighting, not the printing, is what is in the way.
  const unevenness = high > 0 ? (high - low) / high : 0;
  const dimness = Math.max(0, (235 - high) / 235);
  return Math.min(1, Math.max(unevenness, dimness));
}

/**
 * The size OCR reads a page best at. Tesseract is tuned for about 300 dots per
 * inch and falls off badly below 150; a letter page at 2750 pixels on its long
 * edge is 250, which is what the PDF path already renders at. Photographs
 * arrive at anything from a chat-app thumbnail to a 48-megapixel still, so they
 * are brought to the same place before they are read.
 */
export const OCR_LONG_EDGE = 2750;
/** Past this there is no detail left to reveal, only pixels to chew through. */
const MAX_UPSCALE = 3;

/**
 * How much to scale a page by before reading it: up when the print would
 * otherwise be too small to resolve, down when the picture is larger than the
 * reader can use. 1 means leave it alone.
 */
export function ocrScale(width: number, height: number): number {
  const edge = Math.max(width, height);
  if (edge <= 0) return 1;
  const scale = OCR_LONG_EDGE / edge;
  if (scale > 1) return Math.min(scale, MAX_UPSCALE);
  // Shrinking is only worth doing when there is a real saving in it.
  return scale < 0.9 ? scale : 1;
}
