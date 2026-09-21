import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  batchPercent,
  createFileProgress,
  PAGE_STEPS,
  START_SHARE,
  type FileProgress,
} from '../lib/load-desk/extract-progress.ts';

const track = () => {
  const updates: FileProgress[] = [];
  return { updates, tracker: createFileProgress((update) => updates.push(update)) };
};

void test('page step shares add up to one page', () => {
  const total = PAGE_STEPS.reduce((sum, [, share]) => sum + share, 0);
  assert.ok(Math.abs(total - 1) < 1e-9);
});

void test('a page opening then being read only moves forward', () => {
  const { updates, tracker } = track();
  tracker.step(1, 'render', 0);
  tracker.step(1, 'render', 1);
  tracker.step(1, 'read', 0.1);
  tracker.step(1, 'read', 1);
  const fractions = updates.map((update) => update.fraction);
  for (let index = 1; index < fractions.length; index++) {
    assert.ok(fractions[index] >= fractions[index - 1], `went backwards at ${index}`);
  }
  assert.equal(updates.at(-1)!.fraction, 1);
  assert.equal(updates.at(-1)!.label, 'Reading the ticket');
});

void test('nothing is reserved before the first page now the reading is remote', () => {
  assert.equal(START_SHARE, 0);
});

void test('a later progress event that is lower never lowers the bar', () => {
  const { updates, tracker } = track();
  tracker.step(1, 'read', 1);
  tracker.step(1, 'render', 0);
  assert.equal(updates[1].fraction, updates[0].fraction);
});

void test('multi-page files split the work evenly and name the page', () => {
  const { updates, tracker } = track();
  tracker.setPages(4);
  tracker.step(2, 'render', 0);
  const pageTwoStart = START_SHARE + (1 - START_SHARE) / 4;
  assert.ok(Math.abs(updates.at(-1)!.fraction - pageTwoStart) < 1e-9);
  assert.equal(updates.at(-1)!.label, 'Opening page · page 2 of 4');
  tracker.done();
  assert.equal(updates.at(-1)!.fraction, 1);
});

void test('batch percent covers every file and stays within 0-100', () => {
  assert.equal(batchPercent(0, 1, 0), 0);
  assert.equal(batchPercent(0, 1, 0.456), 45);
  assert.equal(batchPercent(1, 2, 0.5), 75);
  assert.equal(batchPercent(2, 3, 1), 100);
  assert.equal(batchPercent(5, 3, 1), 100);
  assert.equal(batchPercent(0, 0, 1), 0);
  assert.equal(batchPercent(0, 2, Number.NaN), 0);
});

void test('the bar keeps moving through the wait for the model, and never past the step', async () => {
  const seen: number[] = [];
  const tracker = createFileProgress((update) => seen.push(update.fraction));
  tracker.step(1, 'read', 0.1);
  const at = seen.at(-1)!;
  // Paced to a short "expected" read so the test can watch it move.
  const stop = tracker.creep(1, 'read', 0.1, 200);
  await new Promise((resolve) => setTimeout(resolve, 500));
  stop();
  const moved = seen.slice(seen.indexOf(at) + 1);
  assert.ok(moved.length >= 2, 'it moved more than once');
  for (let i = 1; i < moved.length; i++) assert.ok(moved[i] >= moved[i - 1], 'never backwards');
  assert.ok(moved.at(-1)! > at, 'it got somewhere');
  const readShare = 0.15 + 0.85 * 0.95;
  assert.ok(moved.at(-1)! <= readShare + 1e-9, 'never past most of the step');
  // Stopped: nothing more arrives, and the real completion still lands at the end.
  const count = seen.length;
  await new Promise((resolve) => setTimeout(resolve, 200));
  assert.equal(seen.length, count);
  tracker.step(1, 'read', 1);
  assert.equal(seen.at(-1), 1);
});
