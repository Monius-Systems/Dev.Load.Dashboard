import { test } from 'node:test';
import assert from 'node:assert/strict';
import { datedFromTicket, staleInvoiceDates } from '../lib/load-desk/invoice-dates.ts';
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

void test('an invoice is dated by its ticket, whatever date it was given', () => {
  const record = saved('1001', '2026-09-15', '2026-09-02');
  assert.equal(datedFromTicket(record).invoice.invoice_date, '2026-09-02');

  // An edit sent from any page comes out dated the same way.
  const edit = datedFromTicket(editOf(record, { invoiceDate: '2026-09-15' }));
  assert.equal(edit.invoice.invoice_date, '2026-09-02');

  // Correcting the ticket's date is what moves the invoice.
  const moved = datedFromTicket(editOf(record, { ticketDate: '2026-09-03' }));
  assert.equal(moved.invoice.invoice_date, '2026-09-03');
});

void test('a ticket with no date of its own leaves the invoice date alone', () => {
  const undated = saved('1001', '2026-09-15', null);
  assert.equal(datedFromTicket(undated), undated);

  const blank = saved('1001', '2026-09-15', '   ');
  assert.equal(datedFromTicket(blank).invoice.invoice_date, '2026-09-15');

  // A day the calendar has not got is a misread, not a date. The ticket is
  // waiting in the undated batch on no invoice; dating a draft "2026-02-31"
  // would be putting a day that never happened on a bill.
  const misread = saved('1001', '2026-09-15', '2026-02-31');
  assert.equal(datedFromTicket(misread).invoice.invoice_date, '2026-09-15');
  assert.equal(datedFromTicket(saved('1001', '2026-09-15', '13/02/2026')).invoice.invoice_date, '2026-09-15');
  assert.equal(datedFromTicket(saved('1001', '2026-09-15', 'sometime')).invoice.invoice_date, '2026-09-15');
});

void test('a date written some other way still dates the invoice', () => {
  // The app files and orders by the day a date names, not the text it is
  // written in, so a record that came in as M/D/YYYY batches under the 2nd.
  // Its invoice used to keep whatever date it arrived with, which left the
  // bill saying one day and the batch holding it saying another.
  const slashed = saved('1001', '2026-09-15', '09/02/2026');
  assert.equal(datedFromTicket(slashed).invoice.invoice_date, '2026-09-02');
});

void test('invoices filed with the day they were photographed are repaired', () => {
  const stale = [
    saved('1002', '2026-09-15', '2026-09-03'),
    saved('1002', '2026-09-15', '2026-09-03'),
  ];
  const consistent = saved('1001', '2026-09-02', '2026-09-02');
  const undated = saved('1003', '2026-09-15', null);
  const repaired = staleInvoiceDates([...stale, consistent, undated]);
  assert.deepEqual(
    repaired.map((record) => [record.id, record.invoice.invoice_date]),
    stale.map((record) => [record.id, '2026-09-03']),
  );
  // Once repaired there is nothing left to repair.
  assert.equal(staleInvoiceDates([...repaired, consistent, undated]).length, 0);
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
