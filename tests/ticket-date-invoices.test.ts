import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupByTicketDate, joinsInvoiceFor } from '../lib/load-desk/records.ts';

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
