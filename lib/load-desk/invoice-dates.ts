import { invoiceKey } from './records.ts';
import type { RecordEdit } from './record-input.ts';
import type { SavedRecord } from './types.ts';

// An invoice is dated by its tickets. Loads count on the ticket date
// everywhere (Home, customers, fleet, invoice lines), so when an invoice date
// changes, the tickets dated with it must change too.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * A change to a saved ticket that moves its invoice date also moves the
 * ticket date, when the ticket was dated with the invoice and its own date is
 * not being changed in the same edit.
 */
export function withInvoiceDate(previous: SavedRecord | undefined, edit: RecordEdit): RecordEdit {
  const next = edit.invoice.invoice_date;
  if (!previous || !ISO_DATE.test(next) || next === previous.invoice.invoice_date) return edit;
  const ticketDate = previous.ticket.ticket_date;
  if (ticketDate !== previous.invoice.invoice_date || edit.ticket.ticket_date !== ticketDate) {
    return edit;
  }
  return { ...edit, ticket: { ...edit.ticket, ticket_date: next } };
}

/**
 * Saved tickets left behind by an invoice date changed before ticket dates
 * followed it: every ticket on the invoice was edited after saving and shares
 * one ticket date that differs from the invoice date. Returns those tickets
 * dated with their invoice; tickets that are consistent are not returned.
 */
export function staleTicketDates(records: SavedRecord[]): SavedRecord[] {
  const invoices = new Map<string, SavedRecord[]>();
  for (const record of records) {
    const key = invoiceKey(record.invoice.invoice_number);
    if (key) invoices.set(key, [...(invoices.get(key) ?? []), record]);
  }
  const repaired: SavedRecord[] = [];
  for (const lines of invoices.values()) {
    const invoiceDate = lines[0].invoice.invoice_date;
    const ticketDates = new Set(lines.map((record) => record.ticket.ticket_date));
    const [ticketDate] = ticketDates;
    if (
      !ISO_DATE.test(invoiceDate) ||
      lines.some((record) => record.invoice.invoice_date !== invoiceDate || !record.edited_at) ||
      ticketDates.size !== 1 ||
      ticketDate === invoiceDate
    ) {
      continue;
    }
    for (const record of lines) {
      repaired.push({ ...record, ticket: { ...record.ticket, ticket_date: invoiceDate } });
    }
  }
  return repaired;
}
