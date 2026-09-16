import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseTicket } from '../lib/load-desk/parser.ts';
import { fillFromSameOrder } from '../lib/load-desk/same-order.ts';
import { emptyTicket } from '../lib/load-desk/types.ts';

// Browser OCR of three Heidelberg scans for one job (Markham plant). The third
// prints the customer a little above its label and drops the order's colon.
const markham = (page: number) =>
  parseTicket(
    readFileSync(
      new URL(`./fixtures/heidelberg-markham-${page}.txt`, import.meta.url),
      'utf8',
    ),
  ).ticket;

for (const [page, ticketNumber] of [
  [1, '1725440632'],
  [2, '1725441484'],
  [3, '1725442113'],
] as const) {
  void test(`Markham scan ${page} reads customer, order, project and destination`, () => {
    const ticket = markham(page);
    assert.equal(ticket.ticket_number, ticketNumber);
    assert.equal(ticket.customer_id, '60311115');
    assert.match(ticket.customer_name ?? '', /^K FIVE CONST COR/);
    assert.equal(ticket.order_number, '6100307876');
    assert.equal(ticket.project_name, '2026 Markham Plant');
    assert.equal(ticket.project_address, '16222 Western Ave, MARKHAM, IL 60428 US');
    assert.equal(ticket.po_number, 'Markham HMA Plant 2026');
  });
}

void test('a project line starting with PROJECT still reads as before', () => {
  const { ticket } = parseTicket(
    [
      'Heidelberg Materials',
      'BOL 1725172271',
      'Customer: 60311596 WITECH COMPANY INC',
      'Order : 6100208257',
      'PROJECT PRESTO - New Carlisle',
      '31480 EDISON RD',
      'NEW CARLISLE.IN 46552 US',
      'P.O. : NON UNION',
    ].join('\n'),
  );
  assert.equal(ticket.project_name, 'PROJECT PRESTO - New Carlisle');
  assert.equal(ticket.project_address, '31480 EDISON RD, NEW CARLISLE, IN 46552 US');
  assert.equal(ticket.order_number, '6100208257');
});

void test('"Ordered" is not read as the order number', () => {
  const { ticket } = parseTicket('Heidelberg Materials\nBOL 1725172271\nOrdered: 8');
  assert.equal(ticket.order_number, null);
});

void test('missing job fields are filled from a ticket with the same order', () => {
  const full = {
    ...emptyTicket(),
    order_number: '6100307876',
    customer_id: '60311115',
    customer_name: 'K FIVE CONST CORE',
    project_name: '2026 Markham Plant',
    project_address: '16222 Western Ave, MARKHAM, IL 60428 US',
  };
  const partial = { ...emptyTicket(), order_number: '6100307876', project_name: 'Typed by hand' };
  const otherJob = { ...emptyTicket(), order_number: '999' };
  const [first, second, third] = fillFromSameOrder([full, partial, otherJob]);
  assert.deepEqual(first.filled, []);
  assert.equal(first.ticket, full);
  assert.deepEqual(second.filled, ['customer number', 'customer name', 'destination address']);
  assert.equal(second.ticket.customer_name, 'K FIVE CONST CORE');
  assert.equal(second.ticket.project_name, 'Typed by hand');
  assert.deepEqual(third.filled, []);
  assert.equal(third.ticket.customer_id, null);
});
