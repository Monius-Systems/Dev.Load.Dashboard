import { csvCell, lineTotal } from './format.ts';
import { validateTicket } from './validate.ts';
import type { InvoiceDraft, SavedRecord } from './types.ts';

// Invoices are not stored separately: saved tickets that carry the same
// invoice number are the lines of one invoice.

export const invoiceKey = (invoiceNumber: string) =>
  invoiceNumber.trim().toLowerCase();

/** Print order on an invoice: ticket date, then the order saved. */
export const byTicketDate = (a: SavedRecord, b: SavedRecord) =>
  (a.ticket.ticket_date ?? '').localeCompare(b.ticket.ticket_date ?? '') ||
  a.id - b.id;

const round2 = (value: number) => Math.round(value * 100) / 100;

export const recordTons = (record: SavedRecord) =>
  record.ticket.net_tons ??
  (record.ticket.net_lb === null ? 0 : record.ticket.net_lb / 2000);

/**
 * Splits an upload into one invoice per ticket date, oldest date first. A
 * ticket whose date was not read joins the ticket before it (usually the
 * previous page), or the earliest-listed date when it comes first. Without any
 * dates the whole upload is one group with a null date.
 */
export function groupByTicketDate<T>(
  items: T[],
  dateOf: (item: T) => string | null,
): { date: string | null; items: T[] }[] {
  const dates = items.map((item) => dateOf(item)?.trim() || null);
  const groups = new Map<string | null, T[]>();
  let previous = dates.find((date) => date !== null) ?? null;
  for (const [index, item] of items.entries()) {
    const date = dates[index] ?? previous;
    previous = date;
    groups.set(date, [...(groups.get(date) ?? []), item]);
  }
  return [...groups]
    .map(([date, grouped]) => ({ date, items: grouped }))
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
}

/**
 * The upload a saved ticket belongs to. Tickets saved before uploads were
 * recorded are grouped by their invoice number instead.
 */
export const recordBatch = (record: SavedRecord) =>
  record.invoice_batch_id ?? `invoice:${invoiceKey(record.invoice.invoice_number)}`;

/**
 * The invoice number the changes would take from another upload, or null.
 * Tickets from one upload share an invoice number; no other upload may use it.
 * `id` is the saved ticket being changed, or null for one not saved yet.
 */
export function findInvoiceClash(
  records: SavedRecord[],
  changes: { id: number | null; invoiceNumber: string; batchId: string }[],
): string | null {
  const changing = new Set(changes.map((change) => change.id));
  for (const change of changes) {
    const key = invoiceKey(change.invoiceNumber);
    const taken = records.some(
      (record) =>
        !changing.has(record.id) &&
        invoiceKey(record.invoice.invoice_number) === key &&
        recordBatch(record) !== change.batchId,
    );
    if (taken) return change.invoiceNumber.trim();
  }
  return null;
}

const NUMBERED = /^(.*?)(\d+)$/;

/**
 * The invoice number after the latest numbered invoice, keeping its prefix
 * and zero padding: "2" → "3", "INV-0099" → "INV-0100". It is one past the
 * highest number with that prefix, so it never repeats one in use. Draft
 * numbers ("DRAFT-…") and numbers without trailing digits are skipped.
 * Returns null before the first numbered invoice, so that one is typed in.
 */
export function nextInvoiceNumber(numbersOldestFirst: string[]): string | null {
  const numbered = numbersOldestFirst
    .map((number) => number.trim())
    .filter((number) => !/^draft/i.test(number) && NUMBERED.test(number));
  const latest = numbered.at(-1);
  if (!latest) return null;
  const [, prefix, digits] = latest.match(NUMBERED)!;
  let highest = 0;
  for (const number of numbered) {
    const [, otherPrefix, otherDigits] = number.match(NUMBERED)!;
    if (otherPrefix.toLowerCase() === prefix.toLowerCase()) {
      highest = Math.max(highest, Number(otherDigits));
    }
  }
  return `${prefix}${String(highest + 1).padStart(digits.length, '0')}`;
}

/** Every saved ticket on an invoice, in print order. */
export function invoiceLines(
  records: SavedRecord[],
  invoiceNumber: string,
): SavedRecord[] {
  const key = invoiceKey(invoiceNumber);
  return records
    .filter((record) => invoiceKey(record.invoice.invoice_number) === key)
    .sort(byTicketDate);
}

export type InvoiceGroup = {
  key: string;
  invoice: InvoiceDraft;
  records: SavedRecord[];
  tons: number;
  /** Sum of line totals for lines that have a rate. */
  total: number;
  needsRate: boolean;
  firstTicketDate: string | null;
  lastTicketDate: string | null;
};

/** Invoices built from saved tickets, newest invoice date first. */
export function invoiceGroups(records: SavedRecord[]): InvoiceGroup[] {
  const grouped = new Map<string, SavedRecord[]>();
  for (const record of records) {
    const key = invoiceKey(record.invoice.invoice_number);
    grouped.set(key, [...(grouped.get(key) ?? []), record]);
  }
  return [...grouped.entries()]
    .map(([key, items]) => {
      const lines = [...items].sort(byTicketDate);
      const latest = items.reduce((a, b) => (b.id > a.id ? b : a));
      const totals = lines.map((record) => lineTotal(record.ticket));
      const dates = lines
        .map((record) => record.ticket.ticket_date)
        .filter((date): date is string => Boolean(date));
      return {
        key,
        invoice: latest.invoice,
        records: lines,
        tons: round2(lines.reduce((sum, record) => sum + recordTons(record), 0)),
        total: round2(
          totals.reduce<number>((sum, value) => sum + (value ?? 0), 0),
        ),
        needsRate: totals.some((value) => value === null),
        firstTicketDate: dates[0] ?? null,
        lastTicketDate: dates.at(-1) ?? null,
      };
    })
    .sort(
      (a, b) =>
        b.invoice.invoice_date.localeCompare(a.invoice.invoice_date) ||
        Math.max(...b.records.map((r) => r.id)) -
          Math.max(...a.records.map((r) => r.id)),
    );
}

/** Photographed and read, but nobody has checked it against the picture yet. */
export const needsReview = (record: SavedRecord) => !record.reviewed_at;

/** The date a ticket is filed under; undated scans have a batch of their own. */
export const batchDate = (record: Pick<SavedRecord, 'ticket'>) =>
  record.ticket.ticket_date?.trim() || 'undated';

/**
 * The invoice a ticket photographed for `ticketDate` belongs on: the one the
 * other tickets of that date are already on, or a new draft named for the date.
 *
 * A draft number rather than the next real one on purpose. The next number in
 * the series is claimed when the batch is actually invoiced, so a week of
 * scanning does not burn a run of invoice numbers that were never sent, and
 * nextInvoiceNumber already knows to skip anything starting "DRAFT".
 */
export function batchInvoiceFor(
  records: SavedRecord[],
  ticketDate: string | null,
): { invoice_number: string; batch_id: string } {
  const date = ticketDate?.trim() || 'undated';
  const existing = records.find((record) => batchDate(record) === date);
  return existing
    ? {
        invoice_number: existing.invoice.invoice_number,
        batch_id: recordBatch(existing),
      }
    : { invoice_number: `DRAFT-${date}`, batch_id: `batch-${date}` };
}

export const ticketStatus = (record: SavedRecord) =>
  validateTicket(record.ticket).length ? 'needs_review' : 'valid';

/** Every search word must appear in the ticket, invoice, truck or bill-to. */
export function recordMatches(record: SavedRecord, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const { ticket, invoice } = record;
  const text = [
    ticket.ticket_number,
    ticket.customer_name,
    ticket.customer_id,
    ticket.project_name,
    ticket.project_address,
    ticket.product_code,
    ticket.product_description,
    ticket.plant_name,
    ticket.vehicle_id,
    invoice.invoice_number,
    invoice.truck_number,
    invoice.bill_to.name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return terms.every((term) => text.includes(term));
}

const INVOICE_COLUMNS: [string, (group: InvoiceGroup) => string | number | null][] = [
  ['invoice_number', (g) => g.invoice.invoice_number],
  ['invoice_date', (g) => g.invoice.invoice_date],
  ['return_date', (g) => g.invoice.return_date || null],
  ['truck_number', (g) => g.invoice.truck_number || null],
  ['bill_to', (g) => g.invoice.bill_to.name],
  ['tickets', (g) => g.records.length],
  ['ticket_numbers', (g) => g.records.map((r) => r.ticket.ticket_number ?? '').join('; ')],
  [
    'customers',
    (g) => [...new Set(g.records.map((r) => r.ticket.customer_name ?? ''))].join('; '),
  ],
  ['first_ticket_date', (g) => g.firstTicketDate],
  ['last_ticket_date', (g) => g.lastTicketDate],
  ['net_tons', (g) => g.tons],
  ['total', (g) => g.total],
  ['status', (g) => (g.needsRate ? 'draft' : 'rated')],
];

export function invoicesCsv(groups: InvoiceGroup[]): string {
  const rows = groups.map((group) =>
    INVOICE_COLUMNS.map(([, read]) => csvCell(read(group))).join(','),
  );
  return [INVOICE_COLUMNS.map(([name]) => name).join(','), ...rows].join('\r\n');
}
