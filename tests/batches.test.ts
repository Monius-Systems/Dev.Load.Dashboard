import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  batchDate,
  batchesByRecency,
  batchInvoiceFor,
  invoiceMoveFor,
  isPendingInvoiceNumber,
  isUndatedBatch,
  UNDATED_BATCH,
  needsReview,
  numbersByTicketDate,
  numbersInDateOrder,
  seriesStartFor,
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

void test('a ticket whose date could not be read waits in the holding batch', () => {
  // Never dropped for want of a date: it goes somewhere visible and fixable —
  // but not onto an invoice, and never onto a number. Nobody can bill a day
  // nobody knows.
  const undated = batchInvoiceFor([saved('2026-01-06', '1042')], null);
  assert.equal(isUndatedBatch(undated.batch_id), true);
  assert.equal(isPendingInvoiceNumber(undated.invoice_number), true);
  assert.equal(batchDate(saved(null, '1043')), 'undated');
  assert.equal(batchDate(saved('  ', '1043')), 'undated');
  // A second undated scan joins the first rather than piling up batches.
  const first = saved(null, '1043', { invoice_batch_id: UNDATED_BATCH });
  const second = batchInvoiceFor([first], null);
  assert.equal(second.batch_id, UNDATED_BATCH);
  assert.equal(second.opened, false);
  // And it never takes a number an earlier undated ticket was given under the
  // old rule: the mark, always.
  assert.equal(isPendingInvoiceNumber(second.invoice_number), true);
});

void test('the holding batch is left out of the numbering', () => {
  // An upload of the 6th, the 7th and a page with no date: two invoices, and
  // the undated page waits with no number, so none is burnt on it.
  const jan6 = saved('2026-01-06', 'x');
  const jan7 = saved('2026-01-07', 'x');
  const lost = saved(null, 'DRAFT-batch-undated', { invoice_batch_id: UNDATED_BATCH });
  const wanted = numbersByTicketDate(
    [saved('2026-01-01', '5'), jan6, jan7, lost],
    [jan6.invoice_batch_id!, jan7.invoice_batch_id!, UNDATED_BATCH],
  );
  assert.equal(wanted.get(jan6.invoice_batch_id!), '6');
  assert.equal(wanted.get(jan7.invoice_batch_id!), '7');
  assert.equal(wanted.has(UNDATED_BATCH), false, 'no number for the undated');
});

void test('entering the date takes a ticket out of the holding batch', () => {
  // Alone there or not, it leaves: the holding batch is not an invoice to
  // stay on. Onto the invoice already filed for that day, or one of its own.
  const jan6 = saved('2026-01-06', '6');
  assert.equal(
    invoiceMoveFor({ batchId: UNDATED_BATCH, date: '2026-01-06' }, [jan6]).kind,
    'join',
    'the day is filed already',
  );
  const opened = invoiceMoveFor({ batchId: UNDATED_BATCH, date: '2026-01-09' }, [jan6]);
  assert.equal(opened.kind, 'open', 'nothing filed for the day, and nobody left behind');
  if (opened.kind === 'open') assert.equal(opened.invoiceNumber, '7');
  // Still no date: still waiting.
  assert.equal(invoiceMoveFor({ batchId: UNDATED_BATCH, date: null }, [jan6]).kind, 'stay');
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
  // By batch on both sides, so the comparison is about which number each day
  // got and not about the order the map happened to hand them back in.
  const byBatch = (a: string[], b: string[]) => a[0]!.localeCompare(b[0]!);
  assert.deepEqual(
    [...wanted].map(([batch, number]) => [batch, number]).sort(byBatch),
    [
      ['batch-2025-12-19', '2'],
      ['batch-2025-12-31', '3'],
      ['batch-2026-01-06', '4'],
      ['batch-2026-02-10', '5'],
    ].sort(byBatch),
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


// A ticket belongs on the invoice of its date. These are what happens when the
// date on a ticket is corrected in review, from what is already filed.

void test('a ticket re-dated to a day already filed joins that day\u2019s invoice', () => {
  // Scanned as 1/1, corrected to 1/2, and 1/2 already has an invoice: the
  // ticket goes onto it, with its number and its invoice details.
  const jan1 = saved('2026-01-01', '5');
  const jan2 = saved('2026-01-02', '6');
  const ticket = saved('2026-01-01', '5');
  const move = invoiceMoveFor(
    { batchId: ticket.invoice_batch_id!, date: '2026-01-02' },
    [jan1, jan2],
  );
  assert.equal(move.kind, 'join');
  if (move.kind !== 'join') return;
  assert.equal(move.batchId, jan2.invoice_batch_id);
  assert.equal(move.invoice.invoice_number, '6');
});

void test('a ticket re-dated to a day not yet filed opens an invoice of its own', () => {
  // Corrected to the 3rd, which nothing is filed for, while the 1st keeps its
  // other ticket: a new invoice on the next number, never the middle of the run.
  const jan1 = saved('2026-01-01', '5');
  const jan2 = saved('2026-01-02', '6');
  const ticket = saved('2026-01-01', '5');
  const move = invoiceMoveFor(
    { batchId: ticket.invoice_batch_id!, date: '2026-01-03' },
    [jan1, jan2],
  );
  assert.equal(move.kind, 'open');
  if (move.kind !== 'open') return;
  assert.equal(move.batchId, 'batch-2026-01-03');
  assert.equal(move.invoiceNumber, '7', 'after the highest on file');
});

void test('the only ticket on an invoice re-dates the invoice with it', () => {
  // Nothing filed for the new day and nobody left behind: this is the same
  // invoice with its date corrected, and it keeps its number.
  const alone = saved('2026-01-01', '5');
  const other = saved('2026-01-10', '6');
  const move = invoiceMoveFor(
    { batchId: alone.invoice_batch_id!, date: '2026-01-02' },
    [other],
  );
  assert.equal(move.kind, 'stay');
});

void test('a ticket already on the invoice of its date does not move', () => {
  const a = saved('2026-01-01', '5');
  const b = saved('2026-01-01', '5');
  assert.equal(
    invoiceMoveFor({ batchId: a.invoice_batch_id!, date: '2026-01-01' }, [b]).kind,
    'stay',
    'with company',
  );
  assert.equal(
    invoiceMoveFor({ batchId: a.invoice_batch_id!, date: '2026-01-01' }, []).kind,
    'stay',
    'alone',
  );
});

void test('unsaved tickets in the queue count as company left behind', () => {
  // Two tickets read together, neither saved yet, and the first is re-dated
  // before saving: it must not drag the second's invoice to a day it is not.
  const move = invoiceMoveFor(
    { batchId: 'upload-1', date: '2026-01-02' },
    [saved('2025-12-31', '4')],
    [{ batchId: 'upload-1', date: '2026-01-01' }],
  );
  assert.equal(move.kind, 'open');
});

void test('a move never takes a number that is in use', () => {
  const move = invoiceMoveFor(
    { batchId: 'batch-2026-01-01', date: '2026-01-03' },
    [saved('2026-01-01', '5'), saved('2026-01-05', '9'), saved('2026-01-04', '7')],
  );
  assert.equal(move.kind, 'open');
  if (move.kind === 'open') assert.equal(move.invoiceNumber, '10');
});

void test('a date the calendar has not got waits with the undated', () => {
  // The dangerous answer off a scan is not a blank, which is obvious, but a
  // line that comes back looking like a date and is not one: a smudged 21
  // read as the 31st of February, a month past twelve. Filed on the text it
  // was written in, it opened a batch of its own that nothing could ever
  // number — `numbersForWaitingBatches` places batches by the day they name,
  // and this one names none — so it sat on a draft mark indefinitely, looking
  // like an invoice that was merely running late. It waits where the blanks
  // wait instead, and asks the same thing of whoever is reviewing.
  const jan6 = saved('2026-01-06', '1042');
  for (const misread of ['2026-02-31', '2026-13-05', '13/02/2026', 'sometime']) {
    const batch = batchInvoiceFor([jan6], misread);
    assert.equal(isUndatedBatch(batch.batch_id), true, misread);
    assert.equal(isPendingInvoiceNumber(batch.invoice_number), true, misread);
    assert.equal(batchDate(saved(misread, '1043')), 'undated', misread);
  }
  // And a second one joins the first rather than piling up batches beside it.
  const first = saved('2026-02-31', 'DRAFT-batch-undated', {
    invoice_batch_id: UNDATED_BATCH,
  });
  const second = batchInvoiceFor([first], '2026-04-31');
  assert.equal(second.batch_id, UNDATED_BATCH);
  assert.equal(second.opened, false);
});

void test('correcting a misread date takes the ticket out of the holding batch', () => {
  // The correction is a real day, so the ticket leaves for the invoice of
  // that day — exactly as it does when the date box was empty. A correction
  // that is still not a day does not move it: there is nowhere to move it to.
  const jan6 = saved('2026-01-06', '6');
  assert.equal(
    invoiceMoveFor({ batchId: UNDATED_BATCH, date: '2026-01-06' }, [jan6]).kind,
    'join',
  );
  assert.equal(
    invoiceMoveFor({ batchId: UNDATED_BATCH, date: '2026-02-31' }, [jan6]).kind,
    'stay',
  );
});

void test('one day written two ways is one batch, not two', () => {
  // Batches are keyed by the day a date names, so a record that reached the
  // app as M/D/YYYY joins the tickets already filed for that day instead of
  // opening a second invoice for the same date beside them.
  const jan6 = saved('2026-01-06', '1042');
  const joined = batchInvoiceFor([jan6], '1/6/2026');
  assert.equal(joined.invoice_number, '1042');
  assert.equal(joined.opened, false);
  assert.equal(batchDate(saved('1/6/2026', '1043')), '2026-01-06');
});

// --- the ledger in date order -------------------------------------------

void test('an older ticket uploaded later takes the lower number, and the newer moves along', () => {
  // Invoice 1 was given to the 1st of January. Then the 31st of December
  // arrives: it takes 1, and January becomes 2 — the books read in date
  // order, whatever order the paper arrived in.
  const january = saved('2026-01-01', '1', { invoice_batch_id: 'batch-2026-01-01' });
  const december = saved('2025-12-31', 'DRAFT-batch-2025-12-31', { invoice_batch_id: 'batch-2025-12-31' });
  const byBatchId = (a: [string, string], b: [string, string]) => a[0].localeCompare(b[0]);
  const wanted = numbersInDateOrder([january, december]);
  assert.deepEqual([...wanted].sort(byBatchId), [
    ['batch-2025-12-31', '1'],
    ['batch-2026-01-01', '2'],
  ]);
});

void test('a ledger already in date order is left exactly as it is', () => {
  const a = saved('2025-12-31', '1', { invoice_batch_id: 'batch-2025-12-31' });
  const b = saved('2026-01-01', '2', { invoice_batch_id: 'batch-2026-01-01' });
  const c = saved('2026-01-06', '3', { invoice_batch_id: 'batch-2026-01-06' });
  assert.equal(numbersInDateOrder([a, b, c]).size, 0);
});

void test('the same pool of numbers is permuted, prefix and padding kept, and new batches take new numbers', () => {
  const a = saved('2026-01-06', 'INV-0010', { invoice_batch_id: 'batch-2026-01-06' });
  const b = saved('2026-01-02', 'INV-0012', { invoice_batch_id: 'batch-2026-01-02' });
  const c = saved('2026-01-04', 'INV-0011', { invoice_batch_id: 'batch-2026-01-04' });
  const fresh = saved('2026-01-08', 'DRAFT-batch-2026-01-08', { invoice_batch_id: 'batch-2026-01-08' });
  const byBatchId = (x: [string, string], y: [string, string]) => x[0].localeCompare(y[0]);
  const wanted = numbersInDateOrder([a, b, c, fresh]);
  assert.deepEqual([...wanted].sort(byBatchId), [
    ['batch-2026-01-02', 'INV-0010'],
    ['batch-2026-01-06', 'INV-0012'],
    ['batch-2026-01-08', 'INV-0013'],
  ]);
  assert.equal(wanted.has('batch-2026-01-04'), false, 'INV-0011 on the 4th is already in its place');
});

void test('two invoices on one day keep their order; the undated batch and a hand-typed number are left alone', () => {
  const first = saved('2026-01-06', '5', { invoice_batch_id: 'batch-a' });
  const second = saved('2026-01-06', '6', { invoice_batch_id: 'batch-b' });
  const undated = saved(null, 'DRAFT-batch-undated', { invoice_batch_id: UNDATED_BATCH });
  const typed = saved('2025-01-01', 'SPECIAL', { invoice_batch_id: 'batch-special' });
  const wanted = numbersInDateOrder([first, second, undated, typed]);
  assert.equal(wanted.size, 0);
});

void test('deleting an invoice closes the gap: 3 becomes 2', () => {
  const one = saved('2026-01-02', '1', { invoice_batch_id: 'batch-2026-01-02' });
  const three = saved('2026-01-06', '3', { invoice_batch_id: 'batch-2026-01-06' });
  const four = saved('2026-01-08', '4', { invoice_batch_id: 'batch-2026-01-08' });
  // Invoice 2 has been deleted.
  const wanted = numbersInDateOrder([one, three, four]);
  const byBatchId = (a: [string, string], b: [string, string]) => a[0].localeCompare(b[0]);
  assert.deepEqual([...wanted].sort(byBatchId), [
    ['batch-2026-01-06', '2'],
    ['batch-2026-01-08', '3'],
  ]);
  // A ledger starting at INV-0010 with a gap after it closes up from there.
  const a = saved('2026-01-02', 'INV-0010', { invoice_batch_id: 'batch-a' });
  const b = saved('2026-01-04', 'INV-0014', { invoice_batch_id: 'batch-b' });
  assert.deepEqual([...numbersInDateOrder([a, b])], [['batch-b', 'INV-0011']]);
  // Nothing numbered yet: the first invoice starts the books.
  const fresh = saved('2026-01-02', 'DRAFT-batch-x', { invoice_batch_id: 'batch-x' });
  assert.deepEqual([...numbersInDateOrder([fresh])], [['batch-x', '1']]);
});

void test('a number typed onto an invoice is where the series starts, and the run keeps it', () => {
  const dec = saved('2025-12-31', '1', { invoice_batch_id: 'batch-2025-12-31' });
  const jan = saved('2026-01-02', '2', { invoice_batch_id: 'batch-2026-01-02' });
  const feb = saved('2026-02-01', '3', { invoice_batch_id: 'batch-2026-02-01' });
  // 1001 typed onto the oldest invoice: the series starts at 1001.
  assert.equal(seriesStartFor([dec, jan, feb], 'batch-2025-12-31', '1001'), '1001');
  // 1003 typed onto the third-oldest: the series starts at 1001 as well.
  assert.equal(seriesStartFor([dec, jan, feb], 'batch-2026-02-01', '1003'), '1001');
  assert.equal(seriesStartFor([dec, jan, feb], 'batch-2026-02-01', 'INV-0003'), 'INV-0001', 'prefix and padding as typed');
  // 2 typed onto the third-oldest cannot be a gapless series: the nearest
  // one, from 1, and the invoice takes its place's number.
  assert.equal(seriesStartFor([dec, jan, feb], 'batch-2026-02-01', '2'), '1', 'a start below 1 is 1');
  assert.equal(seriesStartFor([dec, jan, feb], 'batch-2026-02-01', 'INV-0002'), 'INV-0001');
  assert.equal(seriesStartFor([dec, jan, feb], 'batch-2026-02-01', 'SPECIAL'), null);
  // An invoice being filed now is counted in its place: the oldest of the
  // four, so 2043 typed onto it is where the series starts.
  assert.equal(
    seriesStartFor([dec, jan, feb], 'batch-new', '2043', [{ batchId: 'batch-new', date: '2025-12-01' }]),
    '2043',
  );
  assert.equal(
    seriesStartFor([dec, jan, feb], 'batch-new', '2043', [{ batchId: 'batch-new', date: '2026-03-01' }]),
    '2040',
  );
  // And with the start set, the date-order run keeps what was typed — it
  // used to put 1001 back to 1, then 3 or 4, the moment the ledger was looked at.
  const byBatchId = (a: [string, string], b: [string, string]) => a[0].localeCompare(b[0]);
  assert.deepEqual([...numbersInDateOrder([dec, jan, feb], '1001')].sort(byBatchId), [
    ['batch-2025-12-31', '1001'],
    ['batch-2026-01-02', '1002'],
    ['batch-2026-02-01', '1003'],
  ]);
  // A number another invoice holds is not refused: 2 typed onto the oldest
  // starts the series at 2, and the rest move along behind it.
  assert.equal(seriesStartFor([dec, jan, feb], 'batch-2025-12-31', '2'), '2');
  assert.deepEqual([...numbersInDateOrder([dec, jan, feb], '2')].sort(byBatchId), [
    ['batch-2025-12-31', '2'],
    ['batch-2026-01-02', '3'],
    ['batch-2026-02-01', '4'],
  ]);
  // No start: the lowest on file, as before.
  assert.equal(numbersInDateOrder([dec, jan, feb], null).size, 0);
  assert.equal(numbersInDateOrder([dec, jan, feb], '   ').size, 0);
});
