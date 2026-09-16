import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fieldRegions, type OcrWord } from '../lib/load-desk/field-ocr.ts';

/** A word as the page pass reports it, at (x, y) with a width and height. */
const word = (text: string, x: number, y: number, w = text.length * 11, h = 20): OcrWord => ({
  text,
  bbox: { x0: x, y0: y - h / 2, x1: x + w, y1: y + h / 2 },
});

/**
 * The dispatch block of a Heidelberg ticket: a label on the left of each row
 * and the figure away to the right.
 *
 *   Dispatch:          858820
 *   Ordered Loads:     70
 *   Remaining Loads:   62
 *   Today:  188.53  Loads: 9.00
 */
const page = (): OcrWord[] => [
  word('Heidelberg', 60, 40),
  word('Dispatch:', 60, 300),
  word('858820', 300, 300),
  word('Ordered', 60, 340),
  word('Loads:', 150, 340),
  word('70', 300, 340),
  word('Remaining', 60, 380),
  word('Loads:', 170, 380),
  word('62', 300, 380),
  word('Today:', 60, 420),
  word('188.53', 200, 420),
];

const byKey = (regions: ReturnType<typeof fieldRegions>, key: string) =>
  regions.find((region) => region.key === key);

void test('each figure row gets a box holding the figure and not its label', () => {
  const regions = fieldRegions(page(), 800);
  for (const [key, label] of [
    ['DISPATCH ROW', 'Dispatch:'],
    ['ORDERED ROW', 'Loads:'],
    ['REMAINING ROW', 'Loads:'],
  ] as const) {
    const region = byKey(regions, key);
    assert.ok(region, `${key} should be read`);
    assert.ok(region.valueRect, `${key} should have a figure box`);
    const labelRight = page().find(
      (w) => w.text === label && Math.abs((w.bbox.y0 + w.bbox.y1) / 2 - (region.rect.y0 + region.rect.y1) / 2) < 20,
    )!.bbox.x1;
    // The figure box starts past the wording, and still reaches the number.
    assert.ok(
      region.valueRect.x0 >= labelRight,
      `${key} figure box should start after "${label}"`,
    );
    assert.ok(region.valueRect.x0 < 300, `${key} figure box should still contain the number`);
    assert.equal(region.valueRect.x1, region.rect.x1, 'it ends where the row ends');
  }
});

void test('a row whose label cannot be found is read whole, as before', () => {
  // The page pass missed the wording on the dispatch row: no figure box, so
  // the reader falls back to the whole row rather than cutting it blind.
  const missing = page().filter((w) => w.text !== 'Dispatch:');
  const region = byKey(fieldRegions(missing, 800), 'DISPATCH ROW');
  assert.ok(region, 'the row is still read');
  assert.equal(region.valueRect, undefined, 'no figure box is guessed at');
});

void test('a figure the page pass misread is not mistaken for a label', () => {
  // "858820" read as "85882O" is still a figure, so the box must not start
  // after it — that would cut the value out of its own row.
  const misread = page().map((w) => (w.text === '858820' ? word('85882O', 300, 300) : w));
  const region = byKey(fieldRegions(misread, 800), 'DISPATCH ROW');
  assert.ok(region?.valueRect);
  assert.ok(region.valueRect.x0 < 300, 'the figure box still contains the figure');
});
