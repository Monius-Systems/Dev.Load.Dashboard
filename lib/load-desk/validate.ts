import { isUnreadableDate } from './ticket-date.ts';
import { rateTypeOf, type Ticket } from './types.ts';

// Port of load_ticket_mvp/validate.py.
export const WEIGHT_TOLERANCE_LB = 20;
export const TON_TOLERANCE = 0.05;

/** The only issue on a ticket that is otherwise ready: it has no rate yet. */
export const RATE_MISSING_ISSUE = 'Rate is missing';

/** An hourly ticket without hours yet. */
export const HOURS_MISSING_ISSUE =
  'Hours are missing for the hourly rate; invoice remains a draft';

/** Issues that only keep an invoice line a draft; the ticket itself is fine. */
export const RATING_ISSUES: ReadonlySet<string> = new Set([
  RATE_MISSING_ISSUE,
  HOURS_MISSING_ISSUE,
]);

export function validateTicket(ticket: Ticket): string[] {
  const issues: string[] = [];
  const required: [string, string | number | null][] = [
    ['ticket number', ticket.ticket_number],
    ['ticket date', ticket.ticket_date],
    ['customer name', ticket.customer_name],
    ['net weight', ticket.net_lb],
  ];
  for (const [label, value] of required) {
    if (value === null || value === '') {
      issues.push(`Missing required field: ${label}`);
    }
  }
  // A date that came off the scan as something the calendar has not got. The
  // ticket is waiting in the undated batch either way, but a reviewer looking
  // at a filled-in date field needs telling why it is not being taken: what
  // is in the box is what the reader made of the paper, not a day.
  if (isUnreadableDate(ticket.ticket_date)) {
    issues.push(
      `The ticket date could not be read as a day: "${ticket.ticket_date!.trim()}". Enter it from the original.`,
    );
  }

  const { gross_lb, tare_lb, net_lb, net_tons } = ticket;
  if (gross_lb !== null && tare_lb !== null && net_lb !== null) {
    const difference = Math.abs(gross_lb - tare_lb - net_lb);
    if (difference > WEIGHT_TOLERANCE_LB) {
      issues.push(
        `Weight arithmetic differs by ${difference.toLocaleString('en-US')} lb`,
      );
    }
  }
  if (
    net_lb !== null &&
    net_tons !== null &&
    Math.abs(net_lb / 2000 - net_tons) > TON_TOLERANCE
  ) {
    issues.push('Net tons do not match net pounds / 2,000');
  }
  // Printed on every ticket of these layouts. OCR leaves a value empty rather
  // than guessing when it cannot read it reliably, so point the reviewer to it.
  // Heidelberg dispatch number, ordered and remaining loads, delivery status,
  // weighmaster and other charge are not needed for invoicing, so they are not
  // flagged.
  const expected: [string, string | number | null][] =
    ticket.plant_name === 'Ontario Trap Rock'
      ? [['product', ticket.product_code]]
      : [];
  for (const [label, value] of expected) {
    if (value === null || value === '') {
      issues.push(`Not read from the scan: ${label}. Enter it from the original.`);
    }
  }
  if (ticket.rate === null) {
    issues.push(RATE_MISSING_ISSUE);
  } else if (rateTypeOf(ticket) === 'hourly' && ticket.hours == null) {
    issues.push(HOURS_MISSING_ISSUE);
  }
  return issues;
}
