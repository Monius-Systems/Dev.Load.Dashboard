import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clippedAtBottom,
  guidance,
  scannerConfig,
  withinFrame,
  type Detection,
  type Quad,
} from '../lib/scanner/geometry.ts';

/** A quad from its edges, in the 0-1 space the detector reports. */
const quad = (left: number, top: number, right: number, bottom: number): Quad => [
  { x: left, y: top },
  { x: right, y: top },
  { x: right, y: bottom },
  { x: left, y: bottom },
];

const seen = (corners: Quad, patch: Partial<Detection> = {}): Detection => {
  const width = corners[1].x - corners[0].x;
  const height = corners[2].y - corners[1].y;
  return {
    corners,
    confidence: 0.9,
    area: width * height,
    sharpness: 200,
    brightness: 180,
    darkFraction: 0.05,
    glareFraction: 0.01,
    perspective: 1.05,
    ...patch,
  };
};

// A letter page held close, filling the frame, cut off at the bottom: what a
// ticket looks like when the fields are big enough to read.
const halfTicket = quad(0.04, 0.04, 0.96, 1);
// The same page, all of it in view.
const wholeTicket = quad(0.1, 0.06, 0.9, 0.74);

void test('a ticket running off the bottom of the frame is ready to photograph', () => {
  assert.equal(guidance(seen(halfTicket), 2400, 3200), 'Hold still...');
});

void test('the whole ticket in view is still ready to photograph', () => {
  assert.equal(guidance(seen(wholeTicket), 2400, 3200), 'Hold still...');
});

void test('a ticket off the top or the side is still too close', () => {
  // The number, date, customer and weights are printed at the top, so losing
  // the top or a side loses the thing the photograph is for.
  assert.equal(guidance(seen(quad(0.04, 0, 0.96, 0.9)), 2400, 3200), 'Move back');
  assert.equal(guidance(seen(quad(0, 0.04, 0.9, 0.9)), 2400, 3200), 'Move back');
  assert.equal(guidance(seen(quad(0.1, 0.04, 1, 0.9)), 2400, 3200), 'Move back');
});

void test('too close only counts when the whole sheet is in the frame', () => {
  // A sheet inside the frame and bigger than maxArea really is too close.
  const huge = quad(0.02, 0.02, 0.98, 0.97);
  assert.ok(!clippedAtBottom(huge), 'this one is inside the frame');
  assert.ok(seen(huge).area > scannerConfig.maxArea);
  assert.equal(guidance(seen(huge), 2400, 3200), 'Move back');
  // Clipped at the bottom, the same size is what was asked for.
  assert.ok(clippedAtBottom(halfTicket));
  assert.equal(guidance(seen(halfTicket), 2400, 3200), 'Hold still...');
});

void test('framing does not excuse a photo that cannot be read', () => {
  // Everything else guidance checks still applies to a clipped ticket.
  assert.equal(guidance(seen(halfTicket, { brightness: 20 }), 2400, 3200), 'More light needed');
  assert.equal(guidance(seen(halfTicket, { glareFraction: 0.5 }), 2400, 3200), 'Reduce glare');
  assert.equal(guidance(seen(halfTicket, { perspective: 3 }), 2400, 3200), 'Hold phone straighter');
  assert.equal(guidance(seen(halfTicket, { confidence: 0.1 }), 2400, 3200), 'Find ticket');
});

void test('a ticket too small in the frame is still move closer', () => {
  assert.equal(guidance(seen(quad(0.4, 0.4, 0.6, 0.6)), 2400, 3200), 'Move closer');
});

void test('withinFrame is about the three edges that matter', () => {
  assert.ok(withinFrame(halfTicket));
  assert.ok(withinFrame(wholeTicket));
  assert.ok(!withinFrame(quad(0.04, 0.001, 0.96, 1)), 'the top must be in view');
  assert.ok(!withinFrame(quad(0.001, 0.04, 0.96, 1)), 'the left must be in view');
});
