import { test } from 'node:test';
import assert from 'node:assert/strict';
import { staleTicketDates, withInvoiceDate } from '../lib/load-desk/invoice-dates.ts';
import { customerNameFor, type CustomerProfile } from '../lib/load-desk/profiles.ts';
import type { RecordEdit } from '../lib/load-desk/record-input.ts';
import { emptyTicket, type SavedRecord } from '../lib/load-desk/types.ts';

let nextId = 0;
const saved = (
  invoiceNumber: string,
  invoiceDate: string,
  ticketDate: string | null,
  editedAt?: string,
): SavedRecord =>
  ({
    id: ++nextId,
    saved_at: '2026-09-04T15:00:00.000Z',
    edited_at: editedAt,
    ticket: { ...emptyTicket(), ticket_date: ticketDate, customer_name: 'K FIVE CONST CORE' },
    invoice: {
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate,
      return_date: '',
      truck_number: '',
      bill_to: { name: 'ILLINOIS BULK CARRIER', address_lines: ['', ''], phone: '' },
    },
    ocr_text: '',
    customer_profile_id: null,
    truck_id: null,
  }) as unknown as SavedRecord;

const editOf = (record: SavedRecord, patch: { invoiceDate?: string; ticketDate?: string | null }): RecordEdit => ({
  id: record.id,
  ticket: { ...record.ticket, ticket_date: patch.ticketDate === undefined ? record.ticket.ticket_date : patch.ticketDate },
  invoice: { ...record.invoice, invoice_date: patch.invoiceDate ?? record.invoice.invoice_date },
  ocr_text: record.ocr_text,
  customer_profile_id: record.customer_profile_id ?? null,
  truck_id: record.truck_id ?? null,
});

void test('changing the invoice date moves a ticket dated with the invoice', () => {
  const record = saved('1001', '2026-09-02', '2026-09-02');
  const edit = withInvoiceDate(record, editOf(record, { invoiceDate: '2026-09-05' }));
  assert.equal(edit.ticket.ticket_date, '2026-09-05');
  assert.equal(edit.invoice.invoice_date, '2026-09-05');
});

void test('a ticket with its own date, or a ticket date changed in the same edit, is kept', () => {
  const other = saved('1001', '2026-09-02', '2026-09-01');
  assert.equal(withInvoiceDate(other, editOf(other, { invoiceDate: '2026-09-05' })).ticket.ticket_date, '2026-09-01');

  const both = saved('1001', '2026-09-02', '2026-09-02');
  const edit = withInvoiceDate(both, editOf(both, { invoiceDate: '2026-09-05', ticketDate: '2026-09-03' }));
  assert.equal(edit.ticket.ticket_date, '2026-09-03');

  const unchanged = saved('1001', '2026-09-02', '2026-09-02');
  const same = editOf(unchanged, {});
  assert.equal(withInvoiceDate(unchanged, same), same);
  assert.equal(withInvoiceDate(undefined, same), same);
});

void test('an invoice whose date was edited before the fix gets its ticket dates repaired', () => {
  const stale = [
    saved('1002', '2026-09-10', '2026-09-03', '2026-09-15T10:00:00.000Z'),
    saved('1002', '2026-09-10', '2026-09-03', '2026-09-15T10:00:00.000Z'),
  ];
  const consistent = saved('1001', '2026-09-02', '2026-09-02', '2026-09-15T10:00:00.000Z');
  const neverEdited = saved('1003', '2026-09-15', '2026-09-04');
  const mixedDates = [
    saved('1004', '2026-09-12', '2026-09-01', '2026-09-15T10:00:00.000Z'),
    saved('1004', '2026-09-12', '2026-09-02', '2026-09-15T10:00:00.000Z'),
  ];
  const repaired = staleTicketDates([...stale, consistent, neverEdited, ...mixedDates]);
  assert.deepEqual(
    repaired.map((record) => [record.id, record.ticket.ticket_date]),
    stale.map((record) => [record.id, '2026-09-10']),
  );
  assert.equal(staleTicketDates(repaired.length ? [...repaired, consistent] : []).length, 0);
});

void test('invoice lines use the customer profile name, not the scanned one', () => {
  const customers = [
    { id: 7, name: 'K FIVE CONST CORP', ticket_customer_ids: ['60311115'], ticket_names: [], flat_rate: null, fuel_charge: null, notes: '', created_at: '' },
  ] as CustomerProfile[];
  const chosen = { ticket: { ...emptyTicket(), customer_name: 'K FIVE CONST CORE' }, customer_profile_id: 7 };
  assert.equal(customerNameFor(chosen, customers), 'K FIVE CONST CORP');
  const matched = { ticket: { ...emptyTicket(), customer_id: '60311115', customer_name: 'K FIVE CONST CORE' }, customer_profile_id: null };
  assert.equal(customerNameFor(matched, customers), 'K FIVE CONST CORP');
  const unknown = { ticket: { ...emptyTicket(), customer_name: 'WITECH COMPANY INC' }, customer_profile_id: null };
  assert.equal(customerNameFor(unknown, customers), 'WITECH COMPANY INC');
});
