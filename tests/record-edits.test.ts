import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyRecordEdit,
  MAX_EDITS,
  parseRecordEdits,
  type RecordEdit,
} from '../lib/load-desk/record-input.ts';
import { findInvoiceClash, recordBatch } from '../lib/load-desk/records.ts';
import { emptyTicket, type InvoiceDraft, type SavedRecord } from '../lib/load-desk/types.ts';

const invoice = (invoiceNumber: string): InvoiceDraft => ({
  invoice_number: invoiceNumber,
  invoice_date: '2026-09-14',
  return_date: '',
  truck_number: '3211',
  bill_to: { name: 'ILLINOIS BULK CARRIER', address_lines: ['700 E. Joe Orr Rd.', 'Chicago Heights, IL 60411'], phone: '' },
});

const saved = (id: number, invoiceNumber: string, batch?: string): SavedRecord => ({
  id,
  saved_at: '2026-09-14T15:00:00.000Z',
  ticket: { ...emptyTicket(), ticket_number: `T${id}`, net_lb: 45_820 },
  invoice: invoice(invoiceNumber),
  source: { file_name: `ticket-${id}.pdf`, sha256: 'a'.repeat(64), size: 10, type: 'application/pdf', kind: 'upload' },
  original_stored: true,
  ocr_text: 'text',
  customer_profile_id: null,
  truck_id: null,
  ...(batch ? { invoice_batch_id: batch } : {}),
});

const edit = (id: number, invoiceNumber: string): RecordEdit => ({
  id,
  ticket: { ...emptyTicket(), ticket_number: `T${id}`, rate: 150 },
  invoice: invoice(invoiceNumber),
  ocr_text: 'corrected',
  customer_profile_id: 4,
  truck_id: null,
});

void test('valid edits are accepted with trimmed invoice numbers', () => {
  const parsed = parseRecordEdits([{ ...edit(1, '  INV-7 '), truck_id: undefined }]);
  assert.ok('value' in parsed);
  assert.equal(parsed.value[0].invoice.invoice_number, 'INV-7');
  assert.equal(parsed.value[0].truck_id, null);
  assert.equal(parsed.value[0].customer_profile_id, 4);
});

void test('edits that are empty, repeated, too many or malformed are refused', () => {
  assert.ok('error' in parseRecordEdits([]));
  assert.ok('error' in parseRecordEdits('nope'));
  assert.ok('error' in parseRecordEdits([edit(1, 'A'), edit(1, 'A')]));
  assert.ok('error' in parseRecordEdits([{ ...edit(1, 'A'), id: -3 }]));
  assert.ok('error' in parseRecordEdits([{ ...edit(1, 'A'), ticket: { net_lb: 'heavy' } }]));
  assert.ok('error' in parseRecordEdits([{ ...edit(1, 'A'), invoice: { ...invoice(' '), invoice_number: ' ' } }]));
  assert.ok('error' in parseRecordEdits([{ ...edit(1, 'A'), ocr_text: 'x'.repeat(200_001) }]));
  const many = Array.from({ length: MAX_EDITS + 1 }, (_, index) => edit(index + 1, 'A'));
  assert.ok('error' in parseRecordEdits(many));
});

void test('applying an edit keeps the source, upload and first save time', () => {
  const record = saved(9, 'INV-1', 'batch-1');
  const next = applyRecordEdit(record, edit(9, 'INV-2'), '2026-09-15T12:00:00.000Z');
  assert.equal(next.id, 9);
  assert.deepEqual(next.source, record.source);
  assert.equal(next.saved_at, record.saved_at);
  assert.equal(next.invoice_batch_id, 'batch-1');
  assert.equal(next.original_stored, true);
  assert.equal(next.invoice.invoice_number, 'INV-2');
  assert.equal(next.ticket.rate, 150);
  assert.equal(next.ocr_text, 'corrected');
  assert.equal(next.edited_at, '2026-09-15T12:00:00.000Z');
});

void test('older tickets without an upload group by invoice number', () => {
  assert.equal(recordBatch(saved(1, ' Inv-9 ')), 'invoice:inv-9');
  assert.equal(recordBatch(saved(1, 'INV-9', 'batch-3')), 'batch-3');
});

void test('an invoice number used by another upload is a clash', () => {
  const records = [saved(1, 'INV-1', 'a'), saved(2, 'INV-1', 'a'), saved(3, 'INV-2', 'b')];
  // Renumbering both tickets of upload a to a free number is fine.
  assert.equal(
    findInvoiceClash(records, [
      { id: 1, invoiceNumber: 'INV-5', batchId: 'a' },
      { id: 2, invoiceNumber: 'INV-5', batchId: 'a' },
    ]),
    null,
  );
  // Editing one ticket of upload a while keeping its number is fine.
  assert.equal(findInvoiceClash(records, [{ id: 1, invoiceNumber: 'inv-1 ', batchId: 'a' }]), null);
  // Taking upload b's number is refused.
  assert.equal(findInvoiceClash(records, [{ id: 1, invoiceNumber: ' INV-2', batchId: 'a' }]), 'INV-2');
  // A new ticket from another upload cannot reuse upload a's number.
  assert.equal(findInvoiceClash(records, [{ id: null, invoiceNumber: 'INV-1', batchId: 'c' }]), 'INV-1');
  // Moving upload b's only ticket off its number frees it for nobody else in the same change.
  assert.equal(findInvoiceClash(records, [{ id: 3, invoiceNumber: 'INV-3', batchId: 'b' }]), null);
});

void test('legacy tickets on the same invoice do not clash with each other', () => {
  const records = [saved(1, 'OLD-1'), saved(2, 'OLD-1')];
  assert.equal(
    findInvoiceClash(records, [{ id: 1, invoiceNumber: 'OLD-1', batchId: recordBatch(records[0]) }]),
    null,
  );
});
