import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampOffset, coverScale, sourceRect } from '../lib/crop-box.ts';

const FRAME = 280;
const near = (a: number, b: number, what: string) =>
  assert.ok(Math.abs(a - b) < 0.0001, `${what}: ${a} is not ${b}`);

void test('zoom 1 fills the window from the picture’s shorter side', () => {
  assert.equal(coverScale({ width: 800, height: 400 }, FRAME), FRAME / 400);
  assert.equal(coverScale({ width: 400, height: 800 }, FRAME), FRAME / 400);
  assert.equal(coverScale({ width: 400, height: 400 }, FRAME), FRAME / 400);
});

void test('a picture with no size does not divide by zero', () => {
  assert.equal(coverScale({ width: 0, height: 0 }, FRAME), 1);
});

void test('the shorter side has nowhere to move at zoom 1', () => {
  const natural = { width: 800, height: 400 };
  const draw = coverScale(natural, FRAME);
  const held = clampOffset({ x: 999, y: 999 }, natural, FRAME, draw);
  // Wide picture: room across, none up and down.
  assert.ok(held.x > 0);
  assert.equal(held.y, 0);
});

void test('the picture can never be pulled off an edge of the window', () => {
  const natural = { width: 800, height: 400 };
  const draw = coverScale(natural, FRAME) * 2;
  for (const wanted of [
    { x: 9999, y: 9999 },
    { x: -9999, y: -9999 },
    { x: 40, y: -9999 },
  ]) {
    const held = clampOffset(wanted, natural, FRAME, draw);
    const rect = sourceRect(natural, FRAME, draw, held);
    assert.ok(rect.x >= -0.0001, `left edge: ${rect.x}`);
    assert.ok(rect.y >= -0.0001, `top edge: ${rect.y}`);
    assert.ok(rect.x + rect.size <= natural.width + 0.0001, 'right edge');
    assert.ok(rect.y + rect.size <= natural.height + 0.0001, 'bottom edge');
  }
});

void test('at zoom 1 the window holds the whole shorter side, centred', () => {
  const natural = { width: 800, height: 400 };
  const draw = coverScale(natural, FRAME);
  const rect = sourceRect(natural, FRAME, draw, { x: 0, y: 0 });
  near(rect.size, 400, 'size');
  near(rect.y, 0, 'y');
  near(rect.x, 200, 'x');
});

void test('zooming in takes a smaller square out of the original', () => {
  const natural = { width: 800, height: 400 };
  const draw = coverScale(natural, FRAME) * 2;
  const rect = sourceRect(natural, FRAME, draw, { x: 0, y: 0 });
  near(rect.size, 200, 'size');
  near(rect.x, 300, 'x');
  near(rect.y, 100, 'y');
});

void test('the square kept is always square, so the icon is never stretched', () => {
  const natural = { width: 1600, height: 900 };
  for (const zoom of [1, 1.5, 3, 5]) {
    const draw = coverScale(natural, FRAME) * zoom;
    const held = clampOffset({ x: 120, y: -80 }, natural, FRAME, draw);
    const rect = sourceRect(natural, FRAME, draw, held);
    near(rect.size, FRAME / draw, `zoom ${zoom} size`);
    assert.ok(rect.size <= Math.min(natural.width, natural.height) + 0.0001);
  }
});

void test('dragging right shows what was to the left of the window', () => {
  const natural = { width: 800, height: 400 };
  const draw = coverScale(natural, FRAME);
  const middle = sourceRect(natural, FRAME, draw, { x: 0, y: 0 });
  const dragged = sourceRect(natural, FRAME, draw, { x: 70, y: 0 });
  assert.ok(dragged.x < middle.x);
});
