import { test } from 'node:test';
import assert from 'node:assert/strict';
import { batchDate, batchInvoiceFor, needsReview } from '../lib/load-desk/records.ts';
import { emptyTicket, type SavedRecord } from '../lib/load-desk/types.ts';

let nextId = 0;
const saved = (
  ticketDate: string | null,
  invoiceNumber: string,
  patch: Partial<SavedRecord> = {},
): SavedRecord => ({
  id: ++nextId,
  saved_at: '2026-01-06T12:00:00.000Z',
  ticket: { ...emptyTicket(), ticket_date: ticketDate },
  invoice: {
    invoice_number: invoiceNumber,
    invoice_date: ticketDate ?? '',
    return_date: '',
    truck_number: '',
    bill_to: { name: '', address_lines: ['', ''], phone: '' },
  },
  source: {
    file_name: 'ticket.jpg',
    sha256: 'a'.repeat(64),
    size: 1,
    type: 'image/jpeg',
    kind: 'upload',
  },
  original_stored: true,
  ocr_text: '',
  invoice_batch_id: `batch-${ticketDate ?? 'undated'}`,
  ...patch,
});

void test('a ticket photographed for a date joins that date’s batch', () => {
  const monday = saved('2026-01-06', 'DRAFT-2026-01-06');
  const joined = batchInvoiceFor([monday], '2026-01-06');
  assert.equal(joined.invoice_number, 'DRAFT-2026-01-06');
  assert.equal(joined.batch_id, monday.invoice_batch_id);
});

void test('the first ticket of a date opens a batch of its own', () => {
  const monday = saved('2026-01-06', 'DRAFT-2026-01-06');
  const tuesday = batchInvoiceFor([monday], '2026-01-07');
  assert.equal(tuesday.invoice_number, 'DRAFT-2026-01-07');
  assert.notEqual(tuesday.batch_id, monday.invoice_batch_id);
});

void test('a batch already invoiced keeps its real number', () => {
  // Once the batch has been billed, later tickets for that date join the
  // invoice rather than starting a second one behind its back.
  const billed = saved('2026-01-06', '1042');
  assert.equal(batchInvoiceFor([billed], '2026-01-06').invoice_number, '1042');
});

void test('a ticket whose date could not be read is still filed somewhere', () => {
  // Never dropped for want of a date: it goes somewhere visible and fixable.
  const undated = batchInvoiceFor([], null);
  assert.equal(undated.invoice_number, 'DRAFT-undated');
  assert.equal(batchDate(saved(null, 'DRAFT-undated')), 'undated');
  assert.equal(batchDate(saved('  ', 'DRAFT-undated')), 'undated');
  // And a second undated scan joins the first rather than piling up batches.
  const first = saved(null, 'DRAFT-undated');
  assert.equal(batchInvoiceFor([first], null).batch_id, first.invoice_batch_id);
});

void test('a ticket is waiting until somebody has checked it', () => {
  assert.equal(needsReview(saved('2026-01-06', 'DRAFT-2026-01-06')), true);
  assert.equal(
    needsReview(saved('2026-01-06', 'DRAFT-2026-01-06', { reviewed_at: null })),
    true,
  );
  assert.equal(
    needsReview(
      saved('2026-01-06', 'DRAFT-2026-01-06', {
        reviewed_at: '2026-01-07T09:00:00.000Z',
      }),
    ),
    false,
  );
});
