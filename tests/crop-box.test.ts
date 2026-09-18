import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clampOffset,
  coverScale,
  sourceRect,
  sourceRectFromBoxes,
} from '../lib/crop-box.ts';

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

void test('the picture can be moved until the window is at its very edge', () => {
  // The complaint: zoomed in, the picture stopped short of its own edges. That
  // is what a window measured wrongly does — the room to move is worked out
  // from the window's size, so a window believed to be wider than it really is
  // holds the picture back from an edge it could have reached.
  const natural = { width: 1600, height: 900 };
  for (const frame of [280, 240, 187.5]) {
    for (const zoom of [1, 2, 4]) {
      const draw = coverScale(natural, frame) * zoom;
      const where = `window ${frame} at zoom ${zoom}`;
      const left = clampOffset({ x: 9999, y: 0 }, natural, frame, draw);
      near(sourceRect(natural, frame, draw, left).x, 0, `${where}: left edge`);
      const right = clampOffset({ x: -9999, y: 0 }, natural, frame, draw);
      const far = sourceRect(natural, frame, draw, right);
      near(far.x + far.size, natural.width, `${where}: right edge`);
    }
  }
});

void test('the same framing cuts the same square whatever size the window is', () => {
  // The window is measured rather than assumed, so every sum is in terms of
  // whatever size it really is. A narrower dialog shows a smaller window onto
  // the same picture, not a different part of it — which is what cutting with
  // one size while framing with another did.
  const natural = { width: 1600, height: 900 };
  for (const zoom of [1, 2.5]) {
    const big = sourceRect(natural, 280, coverScale(natural, 280) * zoom, { x: 0, y: 0 });
    const small = sourceRect(
      natural,
      187.5,
      coverScale(natural, 187.5) * zoom,
      { x: 0, y: 0 },
    );
    near(small.size, big.size, `zoom ${zoom}: size`);
    near(small.x, big.x, `zoom ${zoom}: x`);
    near(small.y, big.y, `zoom ${zoom}: y`);
  }
});

void test('zooming in opens up room to move up and down', () => {
  // A wide picture really has none at zoom 1 — its height exactly spans the
  // window — but zooming in has to give it some.
  const natural = { width: 1600, height: 900 };
  const frame = 280;
  const flat = clampOffset({ x: 0, y: 99 }, natural, frame, coverScale(natural, frame));
  assert.equal(flat.y, 0, 'nothing to move at zoom 1');
  const zoomed = clampOffset(
    { x: 0, y: 99 },
    natural,
    frame,
    coverScale(natural, frame) * 2,
  );
  assert.ok(zoomed.y > 0, 'zoomed in there is room up and down');
});

/** The two boxes the browser lays out for a picture framed this way. */
const boxes = (
  natural: { width: number; height: number },
  frame: number,
  drawScale: number,
  offset: { x: number; y: number },
) => ({
  frame: { left: 0, top: 0, width: frame, height: frame },
  // Centred on the window, then dragged: what the cropper's CSS now produces.
  picture: {
    left: frame / 2 - (natural.width * drawScale) / 2 + offset.x,
    top: frame / 2 - (natural.height * drawScale) / 2 + offset.y,
    width: natural.width * drawScale,
    height: natural.height * drawScale,
  },
});

void test('the square measured off the screen is the square the sums describe', () => {
  // The leak: the picture was laid out in a box that clips what it holds, and
  // an oversized one centred in such a box is pushed back to its top-left
  // corner instead. The window then showed the left of a wide photograph while
  // the sums cut its middle, so a saved icon was the middle of the picture
  // however it had been dragged. Measuring cannot drift from what is shown.
  const natural = { width: 1600, height: 900 };
  for (const frame of [280, 187.5]) {
    for (const zoom of [1, 2, 3.5]) {
      for (const wanted of [
        { x: 0, y: 0 },
        { x: 9999, y: 0 },
        { x: -9999, y: 40 },
      ]) {
        const draw = coverScale(natural, frame) * zoom;
        const held = clampOffset(wanted, natural, frame, draw);
        const { frame: window, picture } = boxes(natural, frame, draw, held);
        const measured = sourceRectFromBoxes(window, picture, natural)!;
        const sums = sourceRect(natural, frame, draw, held);
        const where = `window ${frame} at zoom ${zoom}, offset ${wanted.x},${wanted.y}`;
        near(measured.x, sums.x, `${where}: x`);
        near(measured.y, sums.y, `${where}: y`);
        near(measured.size, sums.size, `${where}: size`);
      }
    }
  }
});

void test('a picture pushed into a corner is cut from that corner, not the middle', () => {
  // The layout that caused it, measured: the picture sitting at the window's
  // top-left rather than centred on it. What is cut follows the picture.
  const natural = { width: 1600, height: 900 };
  const frame = 280;
  const draw = coverScale(natural, frame);
  const cornered = sourceRectFromBoxes(
    { left: 0, top: 0, width: frame, height: frame },
    {
      left: 0,
      top: 0,
      width: natural.width * draw,
      height: natural.height * draw,
    },
    natural,
  )!;
  near(cornered.x, 0, 'the left of the picture');
  near(cornered.size, 900, 'the window holds its full height');
  const centred = sourceRect(natural, frame, draw, { x: 0, y: 0 });
  near(centred.x, 350, 'where the sums alone would have cut');
});

void test('nothing is measured off a picture that has not been laid out', () => {
  const empty = { left: 0, top: 0, width: 0, height: 0 };
  const frame = { left: 0, top: 0, width: 280, height: 280 };
  assert.equal(
    sourceRectFromBoxes(frame, empty, { width: 800, height: 600 }),
    null,
  );
  assert.equal(
    sourceRectFromBoxes(
      frame,
      { ...empty, width: 100 },
      { width: 0, height: 0 },
    ),
    null,
  );
});
