import { test } from 'node:test';
import assert from 'node:assert/strict';
import { printedNumber } from '../lib/load-desk/printed-number.ts';
import { readObserved, observedToExtracted } from '../lib/load-desk/ticket-extraction.ts';
import { resolveTicket, UNKNOWN_FRAME } from '../lib/load-desk/recovery/index.ts';
import { acceptableValue } from '../lib/load-desk/recovery/queue.ts';

// A weight as a scale prints it is a number, marks and all. A tare read
// whole as "27600 *" went to review as unreadable on every ticket, because
// the mark beside it is on every ticket.

void test('the marks a scale prints around a figure are not the figure', () => {
  assert.equal(printedNumber('27600 *'), 27600);
  assert.equal(printedNumber('27600*'), 27600);
  assert.equal(printedNumber('27,600 *'), 27600);
  assert.equal(printedNumber('27600 #'), 27600);
  assert.equal(printedNumber('27600 lb'), 27600);
  assert.equal(printedNumber('27600 LBS'), 27600);
  assert.equal(printedNumber('13.80 *'), 13.8);
  assert.equal(printedNumber('$ 68 000'), 68000);
  assert.equal(printedNumber('45,440'), 45440);
  assert.equal(printedNumber('22.31'), 22.31);
});

void test('pounds with their tons beside them are the pounds, when the two agree', () => {
  // "27140 * 13.57 *" is how the tare line prints; the tons vouch for the pounds.
  assert.equal(printedNumber('27140 * 13.57 *'), 27140);
  assert.equal(printedNumber('27140 13.57'), 27140);
  assert.equal(printedNumber('45,960 * 22.98'), 45960);
  // A pair that disagrees is a misread of one or the other, and refused.
  assert.equal(printedNumber('27140 * 99.00 *'), null);
  assert.equal(printedNumber('27140 * 13.9'), null, 'a hundredweight out is out');
});

void test('print that carries no number is still none', () => {
  assert.equal(printedNumber('abc'), null);
  assert.equal(printedNumber(''), null);
  assert.equal(printedNumber(null), null);
  assert.equal(printedNumber('*'), null);
  assert.equal(printedNumber('17254464_'), null, 'a placeholder is not a digit');
  assert.equal(printedNumber('1 2 3 abc'), null);
});

void test('a tare read whole with its mark is an exact tare, end to end', () => {
  const observed = readObserved({
    tare_weight: { visible: '27600 *', proposed: null, clipped_edge: null, partial: false },
    gross_weight: { visible: '73,100 * 36.55', proposed: null, clipped_edge: null, partial: false },
    net_weight: { visible: '45500', proposed: null, clipped_edge: null, partial: false },
  });
  assert.equal(observedToExtracted(observed).tare_weight, 27600);
  assert.equal(observedToExtracted(observed).gross_weight, 73100);
  const recovery = resolveTicket(observed, UNKNOWN_FRAME, [], { vendor: null });
  assert.equal(recovery.fields.tare_lb?.status, 'exact');
  assert.equal(recovery.fields.tare_lb?.value, 27600);
  assert.equal(recovery.fields.tare_lb?.visible_text, '27600 *', 'the print is kept as printed');
  assert.equal(recovery.fields.gross_lb?.status, 'exact');
  assert.equal(recovery.fields.gross_lb?.value, 73100);
});

void test('accepting a candidate printed with its mark hands the box the number', () => {
  assert.equal(acceptableValue('tare_lb', '27600 *'), '27600');
  assert.equal(acceptableValue('net_lb', '27140 * 13.57 *'), '27140');
  assert.equal(acceptableValue('net_lb', '27140 * 99.00'), null);
});
