import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MIN_SIDE, movedBox, resizedBox, wholeOf } from '../lib/crop-box.ts';

const picture = { width: 400, height: 300 };

void test('a free box opens on the whole picture', () => {
  assert.deepEqual(wholeOf(400, 300, false), { x: 0, y: 0, w: 400, h: 300 });
});

void test('a square box opens on the largest square, centred', () => {
  assert.deepEqual(wholeOf(400, 300, true), { x: 50, y: 0, w: 300, h: 300 });
  assert.deepEqual(wholeOf(300, 400, true), { x: 0, y: 50, w: 300, h: 300 });
});

void test('dragging the box moves it and stops at the edges', () => {
  const start = { x: 100, y: 100, w: 100, h: 100 };
  assert.deepEqual(movedBox(start, 30, -40, picture), { x: 130, y: 60, w: 100, h: 100 });
  // Past the top left corner, and past the bottom right one.
  assert.deepEqual(movedBox(start, -999, -999, picture), { x: 0, y: 0, w: 100, h: 100 });
  assert.deepEqual(movedBox(start, 999, 999, picture), { x: 300, y: 200, w: 100, h: 100 });
});

void test('the corner opposite the one being dragged does not move', () => {
  const start = { x: 100, y: 100, w: 100, h: 100 };
  // South-east out: the north-west corner stays at (100, 100).
  const se = resizedBox(start, 'se', 50, 40, picture, false);
  assert.deepEqual(se, { x: 100, y: 100, w: 150, h: 140 });
  // North-west in: the south-east corner stays at (200, 200).
  const nw = resizedBox(start, 'nw', 20, 10, picture, false);
  assert.equal(nw.x + nw.w, 200);
  assert.equal(nw.y + nw.h, 200);
});

void test('a corner cannot be dragged out of the picture', () => {
  const start = { x: 100, y: 100, w: 100, h: 100 };
  const se = resizedBox(start, 'se', 999, 999, picture, false);
  assert.equal(se.x + se.w, picture.width);
  assert.equal(se.y + se.h, picture.height);
  const nw = resizedBox(start, 'nw', -999, -999, picture, false);
  assert.equal(nw.x, 0);
  assert.equal(nw.y, 0);
});

void test('a box cannot be shrunk past the size of its own corners', () => {
  const start = { x: 100, y: 100, w: 100, h: 100 };
  const se = resizedBox(start, 'se', -999, -999, picture, false);
  assert.equal(se.w, MIN_SIDE);
  assert.equal(se.h, MIN_SIDE);
  const nw = resizedBox(start, 'nw', 999, 999, picture, false);
  assert.equal(nw.w, MIN_SIDE);
  assert.equal(nw.h, MIN_SIDE);
  // And still anchored to the corner that was not dragged.
  assert.equal(nw.x + nw.w, 200);
  assert.equal(nw.y + nw.h, 200);
});

void test('a square box stays square however it is dragged', () => {
  const start = { x: 100, y: 100, w: 100, h: 100 };
  for (const corner of ['nw', 'ne', 'sw', 'se'] as const) {
    for (const [dx, dy] of [
      [60, 10],
      [10, 60],
      [-30, -70],
      [999, 20],
      [-999, -999],
    ]) {
      const box = resizedBox(start, corner, dx, dy, picture, true);
      assert.equal(box.w, box.h, `${corner} ${dx},${dy} is not square`);
      assert.ok(box.w >= MIN_SIDE, `${corner} ${dx},${dy} is under the floor`);
      assert.ok(box.x >= 0 && box.y >= 0, `${corner} ${dx},${dy} left the picture`);
      assert.ok(
        box.x + box.w <= picture.width + 0.001 && box.y + box.h <= picture.height + 0.001,
        `${corner} ${dx},${dy} ran past the far edge`,
      );
    }
  }
});

void test('a square box keeps the corner that was not dragged', () => {
  const start = { x: 100, y: 100, w: 100, h: 100 };
  const nw = resizedBox(start, 'nw', -40, -40, picture, true);
  assert.equal(nw.x + nw.w, 200);
  assert.equal(nw.y + nw.h, 200);
  const ne = resizedBox(start, 'ne', 40, -40, picture, true);
  assert.equal(ne.x, 100);
  assert.equal(ne.y + ne.h, 200);
});
