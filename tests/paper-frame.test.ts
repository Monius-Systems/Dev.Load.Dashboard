import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clippedAtBottom,
  PAPER_EDGE_AT_BORDER,
  paperFrameOf,
  scannerConfig,
  withinFrame,
  type Quad,
} from '../lib/scanner/geometry.ts';
import { UNKNOWN_FRAME } from '../lib/load-desk/recovery/contract.ts';

// Where the paper stands in the picture, which is the difference between a
// ticket number the printer ran off the sheet and one the photographer cut
// off. The first has to be recovered from evidence; the second wants nothing
// but another photograph.

/** A quad from its edges, in the 0-1 space the detector reports. */
const quad = (left: number, top: number, right: number, bottom: number): Quad => [
  { x: left, y: top },
  { x: right, y: top },
  { x: right, y: bottom },
  { x: left, y: bottom },
];

const inside = quad(0.1, 0.06, 0.9, 0.74);

void test('a sheet well inside the picture has all four edges in view', () => {
  assert.deepEqual(paperFrameOf(inside), {
    detected: true,
    left: 'inside',
    right: 'inside',
    top: 'inside',
    bottom: 'inside',
  });
});

void test('a ticket photographed to fill the frame is in the picture, corners and all', () => {
  // The app asks for the ticket to fill the frame, so this is what nearly
  // every good photograph looks like: corners within a percent of the border.
  // Every one of them was found, so every edge is in view. Reporting these as
  // cut is what made a well-framed ticket read as a retake.
  const filling = quad(0.008, 0.01, 0.992, 0.99);
  assert.deepEqual(paperFrameOf(filling), {
    detected: true, left: 'inside', right: 'inside', top: 'inside', bottom: 'inside',
  });
  // Inside the old live-guidance margin is still inside the picture.
  const m = scannerConfig.frameMargin;
  assert.deepEqual(paperFrameOf(quad(m / 2, m / 2, 1 - m / 2, 1 - m / 2)), {
    detected: true, left: 'inside', right: 'inside', top: 'inside', bottom: 'inside',
  });
});

void test('each side is cut on its own, and only that side', () => {
  const near = PAPER_EDGE_AT_BORDER / 2;
  assert.deepEqual(paperFrameOf(quad(near, 0.06, 0.9, 0.74)), {
    detected: true, left: 'cut', right: 'inside', top: 'inside', bottom: 'inside',
  });
  assert.deepEqual(paperFrameOf(quad(0.1, 0.06, 1 - near, 0.74)), {
    detected: true, left: 'inside', right: 'cut', top: 'inside', bottom: 'inside',
  });
  assert.deepEqual(paperFrameOf(quad(0.1, near, 0.9, 0.74)), {
    detected: true, left: 'inside', right: 'inside', top: 'cut', bottom: 'inside',
  });
});

void test('a ticket held close and running off the bottom is cut only there', () => {
  // The product rule: everything billed is printed in the top half, so this is
  // a good photograph and the frame has to say so precisely rather than
  // reporting the sheet as generally clipped.
  const halfTicket = quad(0.04, 0.04, 0.96, 1);
  assert.deepEqual(paperFrameOf(halfTicket), {
    detected: true, left: 'inside', right: 'inside', top: 'inside', bottom: 'cut',
  });
});

void test('corners the detector reports outside the picture are cut, not clamped away', () => {
  // A quad fitted to a sheet that overruns the frame comes back with corners
  // past 0 and 1. Every side of it is off the picture and every side says so.
  assert.deepEqual(paperFrameOf(quad(-0.2, -0.1, 1.3, 1.4)), {
    detected: true, left: 'cut', right: 'cut', top: 'cut', bottom: 'cut',
  });
  // Exactly on the border counts as cut: the sheet is against it and nothing
  // can be said about what is past it.
  const m = PAPER_EDGE_AT_BORDER;
  const onTheLine = paperFrameOf(quad(m, m, 1 - m, 1 - m));
  assert.deepEqual(onTheLine, {
    detected: true, left: 'cut', right: 'cut', top: 'cut', bottom: 'cut',
  });
});

void test('no sheet found says nothing about any side', () => {
  assert.deepEqual(paperFrameOf(null), UNKNOWN_FRAME);
  assert.deepEqual(paperFrameOf(undefined), UNKNOWN_FRAME);
  assert.equal(paperFrameOf(null).detected, false);
});

void test('the frame agrees with the coaching the camera already gives', () => {
  // Two readings of the same corners, and a photograph the scanner calls well
  // framed must never be reported as cut off at the top or the sides.
  for (const corners of [inside, quad(0.04, 0.04, 0.96, 1), quad(0.02, 0.02, 0.98, 0.97)]) {
    const frame = paperFrameOf(corners);
    assert.equal(
      withinFrame(corners),
      frame.top === 'inside' && frame.left === 'inside' && frame.right === 'inside',
    );
    assert.equal(clippedAtBottom(corners), frame.bottom === 'cut');
  }
});
