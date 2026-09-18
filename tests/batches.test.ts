import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  batchDate,
  batchesByRecency,
  batchInvoiceFor,
  needsReview,
} from '../lib/load-desk/records.ts';
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

void test('batches are ordered by when they were last added to, not by ticket date', () => {
  // A ticket from January, photographed this morning. The pile being worked
  // through is the one just added to, so it heads the list even though two
  // newer ticket dates are already on file.
  const records = [
    saved('2026-09-15', '1001', { saved_at: '2026-09-15T09:00:00.000Z' }),
    saved('2026-09-16', '1002', { saved_at: '2026-09-16T09:00:00.000Z' }),
    saved('2026-01-04', '1003', { saved_at: '2026-09-18T08:00:00.000Z' }),
  ];
  assert.deepEqual(
    batchesByRecency(records).map((batch) => batch.date),
    ['2026-01-04', '2026-09-16', '2026-09-15'],
  );
});

void test('a batch is as recent as the newest ticket in it', () => {
  // The January batch was opened long ago and added to today; it is judged by
  // the ticket that went in today, not by the one that opened it.
  const records = [
    saved('2026-01-04', '1001', { saved_at: '2026-01-04T09:00:00.000Z' }),
    saved('2026-01-04', '1001', { saved_at: '2026-09-18T08:00:00.000Z' }),
    saved('2026-09-16', '1002', { saved_at: '2026-09-16T09:00:00.000Z' }),
  ];
  assert.deepEqual(
    batchesByRecency(records).map((batch) => batch.date),
    ['2026-01-04', '2026-09-16'],
  );
});

void test('two batches saved in the same second keep the order they went in', () => {
  const at = '2026-09-18T08:00:00.000Z';
  const first = saved('2026-09-01', '1001', { saved_at: at });
  const second = saved('2026-09-02', '1002', { saved_at: at });
  assert.ok(second.id > first.id);
  assert.deepEqual(
    batchesByRecency([first, second]).map((batch) => batch.date),
    ['2026-09-02', '2026-09-01'],
  );
});
