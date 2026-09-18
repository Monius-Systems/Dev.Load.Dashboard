import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  groupByTicketDate,
  invoiceKey,
  invoiceNumberForDate,
  joinsInvoiceFor,
  numbersForWaitingBatches,
} from '../lib/load-desk/records.ts';

/** Batches as the queue hands them over: a batch per date, tickets in it. */
const waiting = (batches: [string, string | null][]) =>
  batches.map(([batchId, ticketDate]) => ({ batchId, ticketDate }));

type Page = { page: number; date: string | null };
const dateOf = (item: Page) => item.date;
const pages = (groups: { date: string | null; items: Page[] }[]) =>
  groups.map((group) => [group.date, group.items.map((item) => item.page)]);

void test('one upload with one ticket date stays one invoice', () => {
  const groups = groupByTicketDate(
    [
      { page: 1, date: '2026-09-12' },
      { page: 2, date: '2026-09-12' },
    ],
    dateOf,
  );
  assert.deepEqual(pages(groups), [['2026-09-12', [1, 2]]]);
});

void test('tickets from different dates become invoices in date order', () => {
  const groups = groupByTicketDate(
    [
      { page: 1, date: '2026-09-14' },
      { page: 2, date: '2026-09-12' },
      { page: 3, date: '2026-09-14' },
      { page: 4, date: '2026-09-13' },
    ],
    dateOf,
  );
  assert.deepEqual(pages(groups), [
    ['2026-09-12', [2]],
    ['2026-09-13', [4]],
    ['2026-09-14', [1, 3]],
  ]);
});

void test('a ticket without a date joins the ticket before it', () => {
  const groups = groupByTicketDate(
    [
      { page: 1, date: null },
      { page: 2, date: '2026-09-13' },
      { page: 3, date: ' ' },
      { page: 4, date: '2026-09-12' },
      { page: 5, date: null },
    ],
    dateOf,
  );
  assert.deepEqual(pages(groups), [
    ['2026-09-12', [4, 5]],
    ['2026-09-13', [1, 2, 3]],
  ]);
});

void test('an upload without any dates is one group', () => {
  const groups = groupByTicketDate(
    [
      { page: 1, date: null },
      { page: 2, date: null },
    ],
    dateOf,
  );
  assert.deepEqual(pages(groups), [[null, [1, 2]]]);
  assert.deepEqual(groupByTicketDate([], dateOf), []);
});

void test('a ticket for another date does not join an invoice', () => {
  // The leak: "Add tickets to this invoice" took whatever it was given, so a
  // ticket photographed on a different day was billed on an older invoice.
  assert.equal(joinsInvoiceFor('2026-09-14', '2026-09-15'), false);
  assert.equal(joinsInvoiceFor('2026-09-14', '2026-09-13'), false);
  assert.equal(joinsInvoiceFor('2026-09-14', '2026-09-14'), true);
  assert.equal(joinsInvoiceFor('2026-09-14', ' 2026-09-14 '), true, 'spacing is not a date');
});

void test('a ticket whose date could not be read still joins', () => {
  // It has nothing to disagree with: this is page two of a scan that lost its
  // date line, and it belongs with the page before it.
  assert.equal(joinsInvoiceFor('2026-09-14', null), true);
  assert.equal(joinsInvoiceFor('2026-09-14', '   '), true);
});

void test('an invoice with no date of its own takes the first ticket', () => {
  assert.equal(joinsInvoiceFor(null, '2026-09-15'), true);
  assert.equal(joinsInvoiceFor('', '2026-09-15'), true);
});

void test('two dates never share an invoice, even before the first numbered one', () => {
  // The leak: with only drafts saved, nextInvoiceNumber has no series to
  // continue, both dates came back as "" and keyed to the same invoice — so a
  // day's tickets were billed on another day's.
  const numbers = ['DRAFT-2026-01-05'];
  const first = invoiceNumberForDate(numbers, '2026-01-06');
  numbers.push(first);
  const second = invoiceNumberForDate(numbers, '2026-01-07');
  assert.notEqual(invoiceKey(first), invoiceKey(second));
  assert.ok(first.trim(), 'an invoice number is never blank');
  assert.ok(second.trim(), 'an invoice number is never blank');
});

void test('a date opens a draft named for itself when there is no series yet', () => {
  assert.equal(invoiceNumberForDate([], '2026-01-06'), 'DRAFT-2026-01-06');
  assert.equal(invoiceNumberForDate(['DRAFT-x'], null), 'DRAFT-undated');
});

void test('a real series is still continued', () => {
  // Once a numbered invoice exists, the next date takes the next number.
  assert.equal(invoiceNumberForDate(['1041', '1042'], '2026-01-06'), '1043');
  assert.equal(invoiceNumberForDate(['DRAFT-2026-01-05', '1042'], '2026-01-07'), '1043');
});

void test('waiting batches take their numbers in ticket-date order', () => {
  // The leak: numbered as the pages came out of the reader, so a scan whose
  // newest ticket was photographed first put the higher date on the lower
  // number and the books no longer read in order.
  const assigned = numbersForWaitingBatches(
    ['1041', '1042'],
    waiting([
      ['batch-2026-09-14', '2026-09-14'],
      ['batch-2026-09-12', '2026-09-12'],
      ['batch-2026-09-13', '2026-09-13'],
    ]),
  );
  assert.deepEqual(
    [...assigned],
    [
      ['batch-2026-09-12', '1043'],
      ['batch-2026-09-13', '1044'],
      ['batch-2026-09-14', '1045'],
    ],
  );
});

void test('the oldest waiting date follows the last invoice on file', () => {
  const assigned = numbersForWaitingBatches(['INV-0099'], waiting([['batch-a', '2026-02-02']]));
  assert.equal(assigned.get('batch-a'), 'INV-0100', 'the prefix and padding are kept');
});

void test('every ticket of a batch shares the batch number', () => {
  // Two pages of one day's scan are one invoice, so the batch is numbered once.
  const assigned = numbersForWaitingBatches(
    ['7'],
    waiting([
      ['batch-2026-09-12', '2026-09-12'],
      ['batch-2026-09-12', '2026-09-12'],
    ]),
  );
  assert.deepEqual([...assigned], [['batch-2026-09-12', '8']]);
});

void test('an undated batch is numbered after every dated one', () => {
  // It has no place in a run of dates, so it does not take a number out of the
  // middle of one.
  const assigned = numbersForWaitingBatches(
    ['20'],
    waiting([
      ['batch-undated', null],
      ['batch-2026-09-12', '2026-09-12'],
    ]),
  );
  assert.deepEqual(
    [...assigned],
    [
      ['batch-2026-09-12', '21'],
      ['batch-undated', '22'],
    ],
  );
});

void test('two undated batches keep the order they arrived in', () => {
  const assigned = numbersForWaitingBatches(
    ['3'],
    waiting([
      ['batch-second', '   '],
      ['batch-first', null],
    ]),
  );
  assert.deepEqual(
    [...assigned],
    [
      ['batch-second', '4'],
      ['batch-first', '5'],
    ],
  );
});

void test('with no series to continue nothing is numbered', () => {
  // A workspace whose only invoices are drafts waits for the first real number
  // to be typed in, rather than inventing one.
  const assigned = numbersForWaitingBatches(
    ['DRAFT-2026-09-12'],
    waiting([['batch-2026-09-12', '2026-09-12']]),
  );
  assert.equal(assigned.size, 0);
  assert.equal(numbersForWaitingBatches([], waiting([['batch-a', '2026-09-12']])).size, 0);
});
