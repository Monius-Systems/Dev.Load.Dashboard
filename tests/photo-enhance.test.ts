import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  enhanceDocument,
  needsEnhancing,
  type Pixels,
} from '../lib/scanner/enhance.ts';

const W = 480;
const H = 640;

/** Rows of print on a sheet, lit by `light` across the frame. */
function ticket({
  paper,
  ink,
  light = () => 1,
}: {
  paper: number;
  ink: number;
  light?: (x: number, y: number) => number;
}) {
  const data = new Uint8ClampedArray(W * H * 4);
  const isInk = (x: number, y: number) => {
    if (x < 40 || x > W - 40) return false;
    const row = Math.floor((y - 50) / 26);
    if (row < 0 || row > 19 || (y - 50) % 26 > 11) return false;
    return ((x >> 2) + row * 3) % 3 !== 0;
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const value = (isInk(x, y) ? ink : paper) * light(x / W, y / H);
      const at = (y * W + x) * 4;
      data[at] = data[at + 1] = data[at + 2] = value;
      data[at + 3] = 255;
    }
  }
  return { image: { data, width: W, height: H } as Pixels, isInk };
}

/**
 * The gap between paper and print in the worst quarter of the page — what OCR
 * has to work with where the light is poorest — and how much the paper itself
 * varies across the page.
 */
function readability(image: Pixels, isInk: (x: number, y: number) => boolean) {
  const quarters = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ].map(([qx, qy]) => {
    let paperSum = 0;
    let paperN = 0;
    let inkSum = 0;
    let inkN = 0;
    for (let y = (qy * H) / 2; y < ((qy + 1) * H) / 2; y++) {
      for (let x = (qx * W) / 2; x < ((qx + 1) * W) / 2; x++) {
        const value = image.data[(y * W + x) * 4];
        if (isInk(x, y)) {
          inkSum += value;
          inkN++;
        } else {
          paperSum += value;
          paperN++;
        }
      }
    }
    return { paper: paperN ? paperSum / paperN : 0, ink: inkN ? inkSum / inkN : 0 };
  });
  return {
    worstGap: Math.min(...quarters.map((q) => q.paper - q.ink)),
    paperSpread:
      Math.max(...quarters.map((q) => q.paper)) -
      Math.min(...quarters.map((q) => q.paper)),
  };
}

void test('a ticket half in shadow comes out evenly lit, with the print still dark', () => {
  // A truck's shadow across the corner: the darkest corner keeps barely a
  // quarter of the light of the brightest.
  const { image, isInk } = ticket({
    paper: 235,
    ink: 55,
    light: (x, y) => 1 - 0.62 * Math.max(0, x + y - 0.5),
  });
  const before = readability(image, isInk);
  const after = readability(enhanceDocument(image, 'auto'), isInk);

  assert.ok(
    before.worstGap < 80,
    `the shadowed corner should start hard to read, was ${before.worstGap}`,
  );
  assert.ok(
    after.worstGap > 200,
    `every corner should end easy to read, was ${after.worstGap}`,
  );
  // The paper is the same paper everywhere once the lighting is divided out.
  assert.ok(
    after.paperSpread < 20,
    `paper should be even across the page, spread was ${after.paperSpread}`,
  );
});

void test('a carbon copy whose print is barely darker than the sheet separates', () => {
  const { image, isInk } = ticket({
    paper: 185,
    ink: 132,
    light: (_x, y) => 1 - 0.25 * y,
  });
  assert.ok(readability(image, isInk).worstGap < 60);
  assert.ok(readability(enhanceDocument(image, 'auto'), isInk).worstGap > 200);
});

void test('a page that is already a clean scan is left alone', () => {
  const { image } = ticket({ paper: 250, ink: 30 });
  // Nothing about the lighting is in the way, so nothing has to be done to it.
  assert.ok(needsEnhancing(image) < 0.05, 'a flatbed scan needs no enhancing');
});

void test('a photograph is recognised as needing the work', () => {
  const shadowed = ticket({
    paper: 235,
    ink: 55,
    light: (x, y) => 1 - 0.62 * Math.max(0, x + y - 0.5),
  }).image;
  const dim = ticket({ paper: 150, ink: 60 }).image;
  assert.ok(needsEnhancing(shadowed) > 0.5, 'uneven light is worth fixing');
  assert.ok(needsEnhancing(dim) > 0.1, 'a dim sheet is worth fixing');
});

void test('enhancing twice does not eat the print', () => {
  const { image, isInk } = ticket({
    paper: 235,
    ink: 55,
    light: (x, y) => 1 - 0.62 * Math.max(0, x + y - 0.5),
  });
  const once = enhanceDocument(image, 'auto');
  const twice = enhanceDocument(once, 'auto');
  // The scanner enhances what it captures and the reader enhances what it is
  // given; a photo that goes through both must not come out worse.
  assert.ok(
    readability(twice, isInk).worstGap >= readability(once, isInk).worstGap - 5,
    'a second pass must not undo the first',
  );
});

void test('black and white keeps the print and drops the shadow', () => {
  const { image, isInk } = ticket({
    paper: 200,
    ink: 90,
    light: (x, y) => 1 - 0.5 * Math.max(0, x + y - 0.6),
  });
  const bw = enhanceDocument(image, 'bw');
  const values = new Set(Array.from({ length: W * H }, (_, at) => bw.data[at * 4]));
  assert.deepEqual([...values].sort((a, b) => a - b), [0, 255], 'only black and white');
  const { worstGap } = readability(bw, isInk);
  assert.ok(worstGap > 180, `print should survive everywhere, was ${worstGap}`);
});

void test('the untouched photograph is available, and is a copy', () => {
  const { image } = ticket({ paper: 200, ink: 60 });
  const same = enhanceDocument(image, 'original');
  assert.deepEqual(same.data.slice(0, 64), image.data.slice(0, 64));
  same.data[0] = 7;
  assert.notEqual(image.data[0], 7, 'the original pixels must not be written to');
});
