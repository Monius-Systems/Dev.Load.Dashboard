import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  groupByTicketDate,
  invoiceKey,
  openingInvoiceNumber,
  joinsInvoiceFor,
  numbersForWaitingBatches,
  ticketDateValue,
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

void test('a ticket without a date is held apart, after every dated one', () => {
  // It used to be given the date of the ticket before it and billed on that
  // day's invoice without anyone being told. A ticket with no date is not
  // ready to invoice: it waits, together with the others like it.
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
    ['2026-09-12', [4]],
    ['2026-09-13', [2]],
    [null, [1, 3, 5]],
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
  // The leak: with no series to continue, both dates came back as "" and keyed
  // to the same invoice — so a day's tickets were billed on another day's.
  const numbers = ['DRAFT-2026-01-05'];
  const first = openingInvoiceNumber(numbers);
  numbers.push(first);
  const second = openingInvoiceNumber(numbers);
  assert.notEqual(invoiceKey(first), invoiceKey(second));
  assert.ok(first.trim(), 'an invoice number is never blank');
  assert.ok(second.trim(), 'an invoice number is never blank');
});

void test('a batch opens on a real number, never a draft named for its date', () => {
  // What the review screen shows is what the invoice will carry. A workspace
  // with nothing to follow starts the series; the old drafts left over from
  // before this are skipped rather than continued.
  assert.equal(openingInvoiceNumber([]), '1');
  assert.equal(openingInvoiceNumber(['DRAFT-2026-01-05']), '1');
  assert.ok(!/draft/i.test(openingInvoiceNumber(['DRAFT-x'])), 'no draft number');
});

void test('a real series is still continued', () => {
  // Once a numbered invoice exists, the next batch takes the next number.
  assert.equal(openingInvoiceNumber(['1041', '1042']), '1043');
  assert.equal(openingInvoiceNumber(['DRAFT-2026-01-05', '1042']), '1043');
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

void test('an undated batch is never numbered', () => {
  // A ticket cannot be billed for a day nobody knows. The batch waits without
  // a number, and the dated batches are numbered as if it were not there, so
  // no number is burnt on it and none is taken out of the middle of the run.
  const assigned = numbersForWaitingBatches(
    ['20'],
    waiting([
      ['batch-undated', null],
      ['batch-2026-09-12', '2026-09-12'],
      ['batch-blank', '   '],
      ['batch-2026-09-13', '2026-09-13'],
    ]),
  );
  assert.deepEqual(
    [...assigned],
    [
      ['batch-2026-09-12', '21'],
      ['batch-2026-09-13', '22'],
    ],
  );
  assert.equal(assigned.has('batch-undated'), false);
  assert.equal(assigned.has('batch-blank'), false);
});

void test('with no series to continue the numbering starts', () => {
  // Every batch leaves here with a real number, so none reaches the review
  // screen blank or as a draft named for its date.
  const assigned = numbersForWaitingBatches(
    ['DRAFT-2026-09-12'],
    waiting([
      ['batch-2026-09-13', '2026-09-13'],
      ['batch-2026-09-12', '2026-09-12'],
    ]),
  );
  assert.deepEqual(
    [...assigned],
    [
      ['batch-2026-09-12', '1'],
      ['batch-2026-09-13', '2'],
    ],
  );
});


/** Oldest day first, for reading the expected run off a jumbled upload. */
const byDay = (a: string, b: string) => ticketDateValue(a)! - ticketDateValue(b)!;

/**
 * The numbers an upload of these ticket dates comes out with, keyed by date.
 *
 * `uploaded` is the order the pictures arrived in — which is the one thing that
 * must make no difference to the answer.
 */
const numbersFor = (onFile: string[], uploaded: string[]) => {
  const assigned = numbersForWaitingBatches(
    onFile,
    waiting(uploaded.map((date) => [`batch-${date}`, date])),
  );
  return Object.fromEntries(
    [...assigned].map(([batchId, number]) => [batchId.replace('batch-', ''), number]),
  );
};

void test('a date is placed by the day it names, not by the text it is written in', () => {
  assert.equal(
    ticketDateValue('2025-12-19')! < ticketDateValue('2026-01-06')!,
    true,
    'December 2025 before January 2026',
  );
  // The comparison the app must never make: as text, "1/6/2026" sorts first.
  const [december, january] = ['12/19/2025', '1/6/2026'];
  assert.equal(december < january, false, 'the string order is the wrong one');
  assert.equal(
    ticketDateValue(december)! < ticketDateValue(january)!,
    true,
    'the day order is the right one',
  );
  assert.equal(ticketDateValue('2026-01-06'), Date.UTC(2026, 0, 6));
  assert.equal(ticketDateValue('1/6/26'), Date.UTC(2026, 0, 6));
  assert.equal(ticketDateValue(null), null);
  assert.equal(ticketDateValue('  '), null);
  assert.equal(ticketDateValue('2026-02-31'), null, 'a day the calendar has not got');
  assert.equal(ticketDateValue('sometime'), null);
});

void test('tickets uploaded oldest first are numbered oldest first', () => {
  assert.deepEqual(numbersFor(['1'], ['2025-12-19', '2026-01-06']), {
    '2025-12-19': '2',
    '2026-01-06': '3',
  });
});

void test('tickets uploaded newest first are still numbered oldest first', () => {
  // The case from the yard: the January ticket was photographed first, and it
  // must not take the number the December one belongs on.
  assert.deepEqual(numbersFor(['1'], ['2026-01-06', '2025-12-19']), {
    '2025-12-19': '2',
    '2026-01-06': '3',
  });
});

void test('however the upload is shuffled the numbering comes out the same', () => {
  const dates = ['2026-03-18', '2026-03-12', '2026-03-25', '2026-03-11', '2026-03-20'];
  const expected = {
    '2026-03-11': '26',
    '2026-03-12': '27',
    '2026-03-18': '28',
    '2026-03-20': '29',
    '2026-03-25': '30',
  };
  assert.deepEqual(numbersFor(['25'], dates), expected, 'as uploaded');
  assert.deepEqual(numbersFor(['25'], [...dates].reverse()), expected, 'reversed');
  const inDateOrder = [...dates].sort(byDay);
  assert.deepEqual(numbersFor(['25'], inDateOrder), expected, 'oldest first');
  assert.deepEqual(
    numbersFor(['25'], [...inDateOrder].reverse()),
    expected,
    'newest first',
  );
});

void test('an upload spanning months runs through the months in order', () => {
  assert.deepEqual(
    numbersFor(['1000'], ['2026-03-02', '2026-01-30', '2026-02-14', '2026-01-05']),
    {
      '2026-01-05': '1001',
      '2026-01-30': '1002',
      '2026-02-14': '1003',
      '2026-03-02': '1004',
    },
  );
});

void test('an upload spanning years runs through the years in order', () => {
  // Every month sorted as text puts 2026-01 behind 2025-12 only because the
  // years are ISO; written as they are on the paper the text order inverts.
  assert.deepEqual(
    numbersFor(['1'], ['1/6/2026', '12/19/2025', '12/31/2025', '1/2/2027']),
    { '12/19/2025': '2', '12/31/2025': '3', '1/6/2026': '4', '1/2/2027': '5' },
  );
});

void test('a day\u2019s tickets are one invoice however many pages there are', () => {
  // Three tickets for the 19th and one for the 6th: two invoices, not four.
  const assigned = numbersForWaitingBatches(
    ['1'],
    waiting([
      ['batch-2026-01-06', '2026-01-06'],
      ['batch-2025-12-19', '2025-12-19'],
      ['batch-2025-12-19', '2025-12-19'],
      ['batch-2025-12-19', '2025-12-19'],
    ]),
  );
  assert.equal(assigned.size, 2, 'two invoices');
  assert.equal(assigned.get('batch-2025-12-19'), '2');
  assert.equal(assigned.get('batch-2026-01-06'), '3');
});

void test('a batch follows the highest number on file, not the last one read', () => {
  // The ledger is not in number order in the list handed over; the series still
  // continues after the highest invoice in it.
  assert.deepEqual(numbersFor(['25', '3', '17'], ['2026-04-01']), { '2026-04-01': '26' });
  assert.deepEqual(numbersFor([], ['2026-04-02', '2026-04-01']), {
    '2026-04-01': '1',
    '2026-04-02': '2',
  });
});

void test('a number already on file is never handed out a second time', () => {
  // Two uploads finishing together both read the ledger before either wrote to
  // it, so the series worked out from it overlaps what is already there.
  const assigned = numbersForWaitingBatches(
    ['1', '3', '2'],
    waiting([
      ['batch-a', '2026-04-01'],
      ['batch-b', '2026-04-02'],
    ]),
  );
  assert.deepEqual([...assigned], [['batch-a', '4'], ['batch-b', '5']]);
  assert.equal(new Set(assigned.values()).size, 2, 'no two batches share one');
});

void test('a dozen dates uploaded in a jumble read in order afterwards', () => {
  const jumbled = [
    '2026-05-09', '2025-11-02', '2026-01-17', '2026-05-01', '2025-12-25',
    '2026-02-28', '2025-11-30', '2026-03-03', '2026-01-01', '2026-04-15',
    '2025-12-01', '2026-02-02',
  ];
  const assigned = numbersFor(['1041'], jumbled);
  const oldestFirst = [...jumbled].sort(byDay);
  assert.deepEqual(
    oldestFirst.map((date) => assigned[date]),
    oldestFirst.map((_, index) => String(1042 + index)),
    'the numbers climb with the dates',
  );
  assert.equal(
    new Set(Object.values(assigned)).size,
    jumbled.length,
    'one number each, none repeated',
  );
});
