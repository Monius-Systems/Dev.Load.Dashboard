import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  batchDate,
  batchesByRecency,
  batchInvoiceFor,
  isPendingInvoiceNumber,
  needsReview,
  numbersByTicketDate,
  shownInvoiceNumber,
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
  const monday = saved('2026-01-06', '1042');
  const joined = batchInvoiceFor([monday], '2026-01-06');
  assert.equal(joined.invoice_number, '1042');
  assert.equal(joined.batch_id, monday.invoice_batch_id);
});

void test('the first ticket of a date opens a batch with no number yet', () => {
  // The leak this closes: the batch took whatever number was free the moment the
  // page came out of the reader, so the page photographed first took the lower
  // number whatever day was printed on it. A batch is filed waiting for its
  // number, and the numbering runs once the whole upload is in.
  const monday = saved('2026-01-06', '1042');
  const tuesday = batchInvoiceFor([monday], '2026-01-07');
  assert.equal(isPendingInvoiceNumber(tuesday.invoice_number), true, 'waiting');
  assert.equal(shownInvoiceNumber(tuesday.invoice_number), '', 'nothing to show yet');
  assert.notEqual(tuesday.batch_id, monday.invoice_batch_id);
  assert.equal(tuesday.opened, true, 'this upload opened it, so it numbers it');
});

void test('two dates waiting for numbers are still two invoices', () => {
  // Invoices are the saved tickets that share a number, so a mark that did not
  // name its own batch would key a day's tickets onto another day's bill.
  const monday = batchInvoiceFor([], '2026-01-06');
  const tuesday = batchInvoiceFor(
    [saved('2026-01-06', monday.invoice_number)],
    '2026-01-07',
  );
  assert.notEqual(monday.invoice_number, tuesday.invoice_number);
});

void test('a workspace with no invoices yet also files before numbering', () => {
  assert.equal(
    isPendingInvoiceNumber(batchInvoiceFor([], '2026-01-06').invoice_number),
    true,
  );
});

void test('a batch already invoiced keeps its real number', () => {
  // Once the batch has been billed, later tickets for that date join the
  // invoice rather than starting a second one behind its back.
  const billed = saved('2026-01-06', '1042');
  assert.equal(batchInvoiceFor([billed], '2026-01-06').invoice_number, '1042');
});

void test('a ticket whose date could not be read is still filed somewhere', () => {
  // Never dropped for want of a date: it goes somewhere visible and fixable.
  const undated = batchInvoiceFor([saved('2026-01-06', '1042')], null);
  assert.equal(isPendingInvoiceNumber(undated.invoice_number), true);
  assert.equal(batchDate(saved(null, '1043')), 'undated');
  assert.equal(batchDate(saved('  ', '1043')), 'undated');
  // And a second undated scan joins the first rather than piling up batches.
  const first = saved(null, '1043');
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

void test('an upload’s numbers are put into ticket-date order afterwards', () => {
  // Invoice 1 is already on file for the 15th of December. Two more dates are
  // uploaded, the January one photographed first — so it was filed first and
  // took the lower number. Once both are in, the run is put right: the 19th of
  // December takes 2 and the 6th of January takes 3.
  const december15 = saved('2025-12-15', '1');
  const january6 = saved('2026-01-06', '2');
  const december19 = saved('2025-12-19', '3');
  const wanted = numbersByTicketDate(
    [december15, january6, december19],
    [january6.invoice_batch_id!, december19.invoice_batch_id!],
  );
  assert.equal(wanted.get(december19.invoice_batch_id!), '2', 'the 19th of December');
  assert.equal(wanted.get(january6.invoice_batch_id!), '3', 'the 6th of January');
  assert.equal(wanted.has(december15.invoice_batch_id!), false, 'invoice 1 does not move');
});

void test('however many dates are uploaded, the run follows them', () => {
  const onFile = saved('2025-12-15', '1');
  const uploaded = [
    saved('2026-02-10', 'x'),
    saved('2025-12-19', 'x'),
    saved('2026-01-06', 'x'),
    saved('2025-12-31', 'x'),
  ];
  const wanted = numbersByTicketDate(
    [onFile, ...uploaded],
    uploaded.map((record) => record.invoice_batch_id!),
  );
  assert.deepEqual(
    [...wanted].map(([batch, number]) => [batch, number]).sort(),
    [
      ['batch-2025-12-19', '2'],
      ['batch-2025-12-31', '3'],
      ['batch-2026-01-06', '4'],
      ['batch-2026-02-10', '5'],
    ].sort(),
  );
});

void test('every ticket of a renumbered date moves together', () => {
  // Two pages of one day's scan are one invoice, so they take one number.
  const first = saved('2026-01-06', '2');
  const second = saved('2026-01-06', '2');
  const older = saved('2025-12-19', '3');
  const wanted = numbersByTicketDate(
    [saved('2025-12-15', '1'), first, second, older],
    [first.invoice_batch_id!, second.invoice_batch_id!, older.invoice_batch_id!],
  );
  assert.equal(wanted.get(older.invoice_batch_id!), '2');
  assert.equal(wanted.get(first.invoice_batch_id!), '3');
  assert.equal(wanted.get(second.invoice_batch_id!), '3', 'both pages, one number');
});

void test('a prefix and its padding survive being put in order', () => {
  const onFile = saved('2025-12-15', 'INV-0099');
  const later = saved('2026-01-06', 'INV-0100');
  const earlier = saved('2025-12-19', 'INV-0101');
  const wanted = numbersByTicketDate(
    [onFile, later, earlier],
    [later.invoice_batch_id!, earlier.invoice_batch_id!],
  );
  assert.equal(wanted.get(earlier.invoice_batch_id!), 'INV-0100');
  assert.equal(wanted.get(later.invoice_batch_id!), 'INV-0101');
});


void test('a ticket joining an invoice already on file does not renumber it', () => {
  // The leak: a ticket photographed for a date that was already invoiced was
  // filed into that invoice's batch, and the batch then went in with the
  // upload's own to be put in date order — so invoice 1, already sent, came
  // back as invoice 2 and this morning's upload held number 1. An invoice on
  // file keeps its number; only the batches an upload opened move.
  const sent = saved('2025-12-15', '1');
  const joined = saved('2025-12-15', '1');
  const older = saved('2025-12-10', '2');
  const opened = batchInvoiceFor([sent], '2025-12-15');
  assert.equal(opened.opened, false, 'the 15th was filed already');
  assert.equal(
    batchInvoiceFor([sent], '2025-12-10').opened,
    true,
    'the 10th opens a batch of its own',
  );
  const wanted = numbersByTicketDate(
    [sent, joined, older],
    // Only what this upload opened: the 15th joined an invoice already numbered.
    [older.invoice_batch_id!],
  );
  assert.equal(wanted.get(older.invoice_batch_id!), '2', 'the new date follows the ledger');
  assert.equal(wanted.has(sent.invoice_batch_id!), false, 'invoice 1 does not move');
});

void test('an upload of ten dates is numbered by date whatever order it arrived in', () => {
  const onFile = saved('2026-03-10', '25');
  const jumbled = [
    '2026-03-18', '2026-03-12', '2026-03-25', '2026-03-11', '2026-03-20',
    '2026-04-02', '2026-03-31', '2026-03-13', '2026-04-01', '2026-03-09',
  ];
  const uploaded = jumbled.map((date) => saved(date, 'x'));
  const wanted = numbersByTicketDate(
    [onFile, ...uploaded],
    uploaded.map((record) => record.invoice_batch_id!),
  );
  const oldestFirst = [...jumbled].sort((a, b) => a.localeCompare(b));
  assert.deepEqual(
    oldestFirst.map((date) => wanted.get(`batch-${date}`)),
    oldestFirst.map((_, index) => String(26 + index)),
  );
  // The 9th of March is older than the invoice on file; it still follows it,
  // because an invoice already numbered is not renumbered behind its back.
  assert.equal(wanted.get('batch-2026-03-09'), '26');
  assert.equal(new Set(wanted.values()).size, jumbled.length, 'no number twice');
});

void test('a ticket date written as it is on the paper is placed by its day', () => {
  // A record whose date reached it as M/D/YYYY rather than ISO: as text the
  // January one sorts first, and it used to take the lower number.
  const onFile = saved('12/15/2025', '1');
  const january = saved('1/6/2026', '2');
  const december = saved('12/19/2025', '3');
  const wanted = numbersByTicketDate(
    [onFile, january, december],
    [january.invoice_batch_id!, december.invoice_batch_id!],
  );
  assert.equal(wanted.get(december.invoice_batch_id!), '2');
  assert.equal(wanted.get(january.invoice_batch_id!), '3');
});
