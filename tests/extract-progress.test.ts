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

void test('repeated 0-100% recognition passes still move forward', () => {
  const { updates, tracker } = track();
  for (const status of ['loading tesseract core', 'initializing api']) {
    tracker.engine(status, 0);
    tracker.engine(status, 1);
  }
  tracker.step(1, 'render', 1);
  tracker.step(1, 'page', 0);
  tracker.step(1, 'page', 1);
  tracker.step(1, 'fields', 0.5);
  tracker.step(1, 'tables', 0);
  tracker.step(1, 'tables', 1);
  const fractions = updates.map((update) => update.fraction);
  for (let index = 1; index < fractions.length; index++) {
    assert.ok(fractions[index] >= fractions[index - 1], `went backwards at ${index}`);
  }
  assert.equal(updates.at(-1)!.fraction, 1);
  assert.equal(updates.at(-1)!.label, 'Checking weights');
});

void test('engine start-up fills only its share and ignores other statuses', () => {
  const { updates, tracker } = track();
  tracker.engine('initializing api', 1);
  assert.ok(Math.abs(updates.at(-1)!.fraction - START_SHARE) < 1e-9);
  tracker.engine('recognizing text', 0.9);
  assert.equal(updates.length, 1);
});

void test('a later progress event that is lower never lowers the bar', () => {
  const { updates, tracker } = track();
  tracker.step(1, 'tables', 1);
  tracker.step(1, 'page', 0);
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
