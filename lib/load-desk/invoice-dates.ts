import { ticketDay } from './ticket-date.ts';
import type { InvoiceDraft, SavedRecord, Ticket } from './types.ts';

// An invoice is dated by its ticket. Whatever date is read off the ticket, or
// typed onto it afterwards, is the date of the invoice that ticket is billed
// on — there is no second date to keep in step and no way to set one. Loads
// count on the ticket date everywhere (Home, customers, fleet, invoice lines),
// and a bill that says a different day than the ticket it is for is wrong.

/**
 * Anything holding a ticket and its invoice, dated from the ticket.
 *
 * The one exception is a ticket with no day read off it: nothing was printed
 * where the date should be, or what was printed came back as a day the
 * calendar has not got. Either way there is nothing to date the invoice from,
 * so what it has stands until the ticket's date is entered — and entering it
 * brings the invoice with it. A misread is never carried onto the invoice:
 * those tickets are waiting in the undated batch on no invoice at all, and a
 * draft stamped "2026-02-31" would be a bill for a day that never happened.
 */
export function datedFromTicket<T extends { ticket: Ticket; invoice: InvoiceDraft }>(
  value: T,
): T {
  const date = ticketDay(value.ticket.ticket_date);
  if (!date || date === value.invoice.invoice_date) return value;
  return { ...value, invoice: { ...value.invoice, invoice_date: date } };
}

/**
 * Saved tickets whose invoice carries a date that is not the ticket's — filed
 * before the rule was enforced, when a ticket kept the day it was photographed
 * rather than the day on it. Returns them dated from their tickets; records
 * that already agree are not returned.
 */
export function staleInvoiceDates(records: SavedRecord[]): SavedRecord[] {
  const repaired: SavedRecord[] = [];
  for (const record of records) {
    const dated = datedFromTicket(record);
    if (dated !== record) repaired.push(dated);
  }
  return repaired;
}
