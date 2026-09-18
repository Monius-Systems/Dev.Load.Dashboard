import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  claimFinalize,
  completeSession,
  extracted,
  isTerminal,
  noteTicket,
  openSession,
  readyToFinalize,
  releaseFinalize,
  unfinished,
} from '../lib/load-desk/upload-session.ts';
import {
  batchInvoiceFor,
  isPendingInvoiceNumber,
  numbersByTicketDate,
  recordBatch,
} from '../lib/load-desk/records.ts';
import { emptyTicket, type SavedRecord } from '../lib/load-desk/types.ts';

let nextId = 0;
const saved = (
  ticketDate: string | null,
  invoiceNumber: string,
  batchId?: string,
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
  invoice_batch_id: batchId ?? `batch-${ticketDate ?? 'undated'}`,
});

void test('a page that is still being read holds the numbering back', () => {
  const session = openSession('upload-1');
  noteTicket(session, 'a', 'extracted');
  noteTicket(session, 'b', 'extracting');
  assert.deepEqual(unfinished(session), ['b']);
  assert.equal(readyToFinalize(session), false, 'b is still in the reader');
  assert.equal(claimFinalize(session), false, 'so nothing may be numbered yet');
  noteTicket(session, 'b', 'extracted');
  assert.deepEqual(unfinished(session), []);
  assert.equal(claimFinalize(session), true);
});

void test('extracted is not numbered', () => {
  // The distinction the whole barrier rests on: a page can be read, filed and
  // on the screen while its siblings are still being read, and it has no
  // invoice number until they are done.
  const session = openSession('upload-1');
  noteTicket(session, 'a', 'extracted');
  noteTicket(session, 'b', 'queued');
  assert.deepEqual(extracted(session), ['a'], 'a is read');
  assert.equal(readyToFinalize(session), false, 'and still has no number');
});

void test('a page that failed stops holding the upload open', () => {
  // Otherwise one unreadable scan leaves every other ticket of the morning
  // waiting for a number that never comes.
  const session = openSession('upload-1');
  noteTicket(session, 'a', 'extracted');
  noteTicket(session, 'b', 'failed');
  noteTicket(session, 'c', 'skipped');
  assert.deepEqual(unfinished(session), []);
  assert.equal(readyToFinalize(session), true);
  assert.deepEqual(
    extracted(session),
    ['a'],
    'only what came through is numbered',
  );
  for (const terminal of ['extracted', 'failed', 'skipped'] as const) {
    assert.equal(isTerminal(terminal), true, terminal);
  }
  for (const working of ['queued', 'uploading', 'extracting'] as const) {
    assert.equal(isTerminal(working), false, working);
  }
});

void test('only one caller ever numbers an upload', () => {
  // Every page finishing asks, because any of them might be the last. The
  // second one to ask is told no, so a run of numbers is never handed out twice.
  const session = openSession('upload-1');
  noteTicket(session, 'a', 'extracted');
  noteTicket(session, 'b', 'extracted');
  assert.equal(claimFinalize(session), true, 'the first caller takes it');
  assert.equal(claimFinalize(session), false, 'the second is refused');
  completeSession(session);
  assert.equal(claimFinalize(session), false, 'and so is anything after');
});

void test('a failed write hands the upload back to be numbered again', () => {
  const session = openSession('upload-1');
  noteTicket(session, 'a', 'extracted');
  assert.equal(claimFinalize(session), true);
  releaseFinalize(session);
  assert.equal(claimFinalize(session), true, 'it can be tried again');
  completeSession(session);
  releaseFinalize(session);
  assert.equal(
    claimFinalize(session),
    false,
    'but a finished upload is finished',
  );
});

void test('an upload of nothing is not numbered', () => {
  assert.equal(readyToFinalize(openSession('upload-1')), false);
  assert.equal(claimFinalize(openSession('upload-1')), false);
});

/**
 * One upload, run end to end: pages are filed as they are read, in whatever
 * order the reader finishes them, and the numbers are handed out once.
 *
 * `order` is the order extraction completes in, which is what used to decide
 * the numbers and must now decide nothing.
 */
function runUpload(onFile: SavedRecord[], dates: string[], order: number[]) {
  const session = openSession('upload-1');
  for (const [index] of dates.entries())
    noteTicket(session, `page-${index}`, 'queued');
  const records = [...onFile];
  const opened = new Set<string>();

  for (const index of order) {
    noteTicket(session, `page-${index}`, 'extracting');
    // Filed the moment it is read: a photograph taken beside a truck survives
    // the app closing. No number is claimed here.
    const batch = batchInvoiceFor(records, dates[index]);
    if (batch.opened) opened.add(batch.batch_id);
    records.push(saved(dates[index], batch.invoice_number, batch.batch_id));
    noteTicket(session, `page-${index}`, 'extracted');
    // Asked at every page, and refused until the last one.
    if (!readyToFinalize(session)) {
      assert.ok(
        records.every(
          (record) =>
            !opened.has(recordBatch(record)) ||
            isPendingInvoiceNumber(record.invoice.invoice_number),
        ),
        'no batch of this upload is numbered while a page is still being read',
      );
    }
  }

  assert.equal(claimFinalize(session), true, 'the barrier opens exactly once');
  const wanted = numbersByTicketDate(records, [...opened]);
  completeSession(session);
  return Object.fromEntries(
    [...wanted].map(([batchId, number]) => [
      batchId.replace('batch-', ''),
      number,
    ]),
  );
}

void test('the page that finishes first does not take the first number', () => {
  // The case: invoice 1 is on file for the 15th of December, two tickets are
  // uploaded together, and the January one happens to finish extraction first.
  const numbers = runUpload(
    [saved('2025-12-15', '1')],
    ['2026-01-06', '2025-12-19'],
    [0, 1],
  );
  assert.deepEqual(numbers, { '2025-12-19': '2', '2026-01-06': '3' });
});

void test('the same upload finishing in the other order comes out the same', () => {
  const numbers = runUpload(
    [saved('2025-12-15', '1')],
    ['2026-01-06', '2025-12-19'],
    [1, 0],
  );
  assert.deepEqual(numbers, { '2025-12-19': '2', '2026-01-06': '3' });
});

void test('however the reader finishes, the numbering is identical', () => {
  // Ten dates across two years, and every completion order tried against the
  // one answer. Completion order decides nothing.
  const dates = [
    '2026-03-18',
    '2025-12-19',
    '2026-03-12',
    '2026-01-06',
    '2026-03-25',
    '2025-12-31',
    '2026-03-11',
    '2027-01-02',
    '2026-03-20',
    '2026-02-14',
  ];
  const expected = {
    '2025-12-19': '26',
    '2025-12-31': '27',
    '2026-01-06': '28',
    '2026-02-14': '29',
    '2026-03-11': '30',
    '2026-03-12': '31',
    '2026-03-18': '32',
    '2026-03-20': '33',
    '2026-03-25': '34',
    '2027-01-02': '35',
  };
  const onFile = () => [saved('2026-03-10', '25')];
  const inOrder = dates.map((_, index) => index);
  const orders = [
    inOrder,
    [...inOrder].reverse(),
    [4, 0, 9, 2, 7, 1, 8, 3, 6, 5],
    [7, 3, 1, 9, 5, 0, 8, 2, 6, 4],
    [9, 8, 0, 1, 7, 6, 2, 3, 5, 4],
  ];
  for (const order of orders) {
    assert.deepEqual(
      runUpload(onFile(), dates, order),
      expected,
      `finished in the order ${order.join(',')}`,
    );
  }
});

void test('several pages of one day are one invoice however they finish', () => {
  const numbers = runUpload(
    [saved('2025-12-15', '1')],
    ['2026-01-06', '2025-12-19', '2025-12-19', '2025-12-19'],
    [0, 2, 3, 1],
  );
  assert.deepEqual(numbers, { '2025-12-19': '2', '2026-01-06': '3' });
});

void test('a hundred pages finishing in a jumble still read in order', () => {
  const dates = Array.from({ length: 100 }, (_, index) => {
    const day = new Date(Date.UTC(2026, 0, 1 + index));
    return day.toISOString().slice(0, 10);
  });
  // A shuffle nothing can mistake for the order they were queued in.
  const order = dates
    .map((_, index) => index)
    .sort((a, b) => ((a * 37) % 100) - ((b * 37) % 100));
  const numbers = runUpload([saved('2025-12-31', '1000')], dates, order);
  assert.deepEqual(
    [...dates].sort((a, b) => a.localeCompare(b)).map((date) => numbers[date]),
    dates.map((_, index) => String(1001 + index)),
  );
});
