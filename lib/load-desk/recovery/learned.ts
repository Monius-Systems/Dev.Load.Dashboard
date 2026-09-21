import type { TicketRecovery } from './contract.ts';
import { printedDays } from './printed-days.ts';

// What is learned from a person typing over a misread, and what of it may
// be shared.
//
// A date the reader read as 12/18/2025, typed over as 12/15/2025, says one
// thing worth keeping beyond this ticket: on this vendor's paper the reader
// read an 8 where a 5 was printed. That is a fact about the reader, not
// about anyone's customer, and the whole deployment is better for knowing
// it — so it is the one thing that leaves the workspace: two characters,
// the field's kind and the vendor, counted. Everything else a person types
// stays where it was typed.

export type Misread = {
  vendor: string;
  field: 'date' | 'number' | 'weight';
  read: string;
  actual: string;
};

/** The digits of a printed date in the shape the app compares, or null. */
function dateDigits(printed: string): string | null {
  const m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/.exec(printed.trim());
  if (!m) return null;
  const year = m[3].length === 2 ? `20${m[3]}` : m[3].padStart(4, '0');
  return `${m[1].padStart(2, '0')}${m[2].padStart(2, '0')}${year}`;
}

/**
 * The one character a person changed, when they changed exactly one. Two or
 * more, and it was not a misread digit but another value, from which no
 * pair is learned: the point is what the reader gets wrong, not what people
 * type.
 */
export function singleCharacterChange(read: string, actual: string): [string, string] | null {
  if (read.length !== actual.length) return null;
  let found: [string, string] | null = null;
  for (let i = 0; i < read.length; i++) {
    if (read[i] === actual[i]) continue;
    if (found) return null;
    found = [read[i], actual[i]];
  }
  return found;
}

/**
 * The misread a typed date teaches, or null: the record's own print for the
 * date against the day typed, one digit apart.
 */
export function dateMisread(recovery: TicketRecovery | undefined, iso: string): Misread | null {
  const printed = recovery?.fields.ticket_date?.visible_text?.trim();
  if (!printed || !recovery?.vendor) return null;
  const read = dateDigits(printed);
  const actual = dateDigits(printedDays(iso)[1]);
  if (!read || !actual) return null;
  const change = singleCharacterChange(read, actual);
  return change ? { vendor: recovery.vendor, field: 'date', read: change[0], actual: change[1] } : null;
}

/**
 * The misread a typed number or weight teaches, or null.
 */
export function figureMisread(
  recovery: TicketRecovery | undefined,
  field: 'ticket_number' | 'gross_lb' | 'tare_lb' | 'net_lb' | 'net_tons',
  typed: string | number,
): Misread | null {
  const printed = recovery?.fields[field]?.visible_text?.replace(/[^0-9A-Za-z.]/g, '');
  if (!printed || !recovery?.vendor) return null;
  const actual = String(typed).replace(/[^0-9A-Za-z.]/g, '');
  const change = singleCharacterChange(printed, actual);
  if (!change || change[0] === '.' || change[1] === '.') return null;
  return {
    vendor: recovery.vendor,
    field: field === 'ticket_number' ? 'number' : 'weight',
    read: change[0],
    actual: change[1],
  };
}
