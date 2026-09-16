import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  invoiceGroups,
  invoiceLines,
  invoicesCsv,
  recordMatches,
  ticketStatus,
} from '../lib/load-desk/records.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

let nextId = 0;
const record = (
  invoiceNumber: string,
  ticket: Partial<Ticket>,
  invoiceDate = '2026-09-14',
): SavedRecord => ({
  id: ++nextId,
  saved_at: '2026-09-14T15:00:00.000Z',
  ticket: { ...emptyTicket(), ...ticket },
  invoice: {
    invoice_number: invoiceNumber,
    invoice_date: invoiceDate,
    return_date: '',
    truck_number: '3211',
    bill_to: {
      name: 'ILLINOIS BULK CARRIER',
      address_lines: ['', ''],
      phone: '',
    },
  },
  source: {
    file_name: 'Trucking Loads.pdf',
    sha256: 'abc',
    size: 1,
    type: 'application/pdf',
    kind: 'upload',
  },
  original_stored: true,
  ocr_text: '',
});

const ontario = record('2271', {
  ticket_number: '5113819',
  ticket_date: '2025-04-01',
  customer_name: 'Ontario Trap Rock - US',
  net_tons: 22.39,
  rate: 175,
});
const witech = record('2271', {
  ticket_number: '1725172271',
  ticket_date: '2025-01-07',
  customer_name: 'WITECH COMPANY INC',
  project_address: '31480 EDISON RD, NEW CARLISLE, IN 46552 US',
  net_lb: 45820,
  rate: 150,
  fuel_charge: 20,
});
const draft = record(
  'draft-1725193636',
  { ticket_number: '1725193636', ticket_date: '2025-04-01', net_tons: 22.84 },
  '2026-09-15',
);

void test('tickets with one invoice number form one invoice in print order', () => {
  const groups = invoiceGroups([ontario, witech, draft]);
  assert.deepEqual(
    groups.map((group) => group.invoice.invoice_number),
    ['draft-1725193636', '2271'],
    'newest invoice date first',
  );
  const combined = groups[1];
  assert.deepEqual(
    combined.records.map((r) => r.ticket.ticket_number),
    ['1725172271', '5113819'],
  );
  assert.equal(combined.tons, 45.3);
  assert.equal(combined.total, 345);
  assert.equal(combined.needsRate, false);
  assert.equal(combined.firstTicketDate, '2025-01-07');
  assert.equal(combined.lastTicketDate, '2025-04-01');
  assert.equal(groups[0].needsRate, true);
  assert.equal(groups[0].total, 0);
});

void test('invoice lookup ignores case and surrounding spaces', () => {
  assert.equal(invoiceLines([ontario, witech, draft], ' DRAFT-1725193636 ').length, 1);
  assert.equal(invoiceLines([ontario, witech, draft], '2271').length, 2);
});

void test('search matches every word across ticket, invoice and destination', () => {
  assert.equal(recordMatches(witech, 'witech carlisle'), true);
  assert.equal(recordMatches(witech, '2271 3211'), true);
  assert.equal(recordMatches(witech, 'witech chicago'), false);
  assert.equal(recordMatches(witech, '  '), true);
});

void test('ticket status follows validation', () => {
  assert.equal(ticketStatus(draft), 'needs_review');
});

void test('invoice CSV has one row per invoice', () => {
  const lines = invoicesCsv(invoiceGroups([ontario, witech])).split('\r\n');
  assert.equal(lines.length, 2);
  assert.match(lines[0], /^invoice_number,invoice_date,/);
  assert.match(lines[1], /^2271,2026-09-14,,3211,ILLINOIS BULK CARRIER,2,1725172271; 5113819,/);
  assert.match(lines[1], /,45\.3,345,rated$/);
});
