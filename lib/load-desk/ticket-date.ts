// The one place the app decides whether a ticket has a date.
//
// A scan gives back three kinds of answer: a date, nothing at all, and
// something that looks like a date but is not one — "2026-02-31" off a smudged
// 21, "13/4/26" where the month and day came back the wrong way round, a year
// the reader invented a digit for. The third kind is the dangerous one,
// because it reads as a date everywhere that only asks whether the field is
// filled in: it opened a batch of its own, kept a draft mark forever because
// `numbersForWaitingBatches` could not place a day it had not got, and sat
// there looking like an invoice that was merely late.
//
// So both of the last two are answered the same way here — no day — and every
// caller routes on that single answer. A ticket nobody can date waits in the
// holding batch for somebody to read the date off the paper. Nothing is
// guessed: not the month from the day, not the century from two digits that
// were never printed, and not the day from the ticket before it in the pile.

const ISO_DATE = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
const SLASHED_DATE = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})$/;

const pad2 = (value: number) => String(value).padStart(2, '0');

const MONTHS: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, SEPT: 9, OCT: 10, NOV: 11, DEC: 12,
};
/** "September 17, 2026", "Sep 17 2026", "17 September 2026": some printers write the month out. */
const MONTH_FIRST = /^([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})$/;
const DAY_FIRST = /^(\d{1,2})\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})$/;
function wordedDate(text: string): [number, number, number] | null {
  const first = MONTH_FIRST.exec(text);
  const [name, day, year] = first
    ? [first[1], first[2], first[3]]
    : (() => {
        const m = DAY_FIRST.exec(text);
        return m ? [m[2], m[1], m[3]] : ['', '', ''];
      })();
  if (!name) return null;
  const key = name.toUpperCase();
  const month = MONTHS[key] ?? MONTHS[key.slice(0, 3)];
  if (!month || !(key.length <= 4 || FULL_MONTHS[month - 1].startsWith(key))) return null;
  return [Number(year), month, Number(day)];
}
const FULL_MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

/**
 * The year, month and day a written date names, or null when it names none.
 *
 * Both shapes a date reaches the app in are read: the ISO date it is stored
 * as, and the M/D/YY it is printed in, so a date that came in through another
 * door is still understood. A two-digit year is this century's, which is the
 * only reading a delivery ticket has.
 *
 * The date is then built and checked against itself: `Date.UTC` rolls
 * February 31st forward into March rather than refusing it, so a date that
 * does not come back as the one asked for is a day the calendar has not got,
 * and is a misread rather than a date.
 */
function dayParts(value: string | null | undefined) {
  const text = value?.trim();
  if (!text) return null;
  const iso = ISO_DATE.exec(text);
  const slashed = iso ? null : SLASHED_DATE.exec(text);
  const worded = iso || slashed ? null : wordedDate(text);
  if (!iso && !slashed && !worded) return null;
  const [year, month, day] = iso
    ? [Number(iso[1]), Number(iso[2]), Number(iso[3])]
    : slashed
      ? [
          Number(slashed[3].length === 2 ? `20${slashed[3]}` : slashed[3]),
          Number(slashed[1]),
          Number(slashed[2]),
        ]
      : worded!;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day, time: date.getTime() };
}

/**
 * The day a ticket date names, as a number to order days by.
 *
 * Dates are put in order as days, never as the text they are written in.
 * "1/6/2026" sorts before "12/19/2025" as a string, which is how January's
 * tickets came to be invoiced ahead of December's.
 *
 * Null for a blank date and for one the calendar has not got — a misread has
 * no position in a run of days, so it is treated as an undated ticket.
 */
export const ticketDateValue = (value: string | null | undefined): number | null =>
  dayParts(value)?.time ?? null;

/**
 * The day a ticket is dated, as the ISO date the app files it under, or null
 * when the ticket has no date anyone can read.
 *
 * This is the question every caller is really asking — not "is the field
 * filled in" but "is there a day to file this ticket on" — and the answer is
 * the filing key as well, so a date that arrived written some other way files
 * with the rest of its day instead of opening a batch beside it.
 */
export function ticketDay(value: string | null | undefined): string | null {
  const parts = dayParts(value);
  if (!parts) return null;
  return `${String(parts.year).padStart(4, '0')}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

/**
 * Whether a date was written on the ticket but could not be read as a day.
 *
 * Worth saying out loud where a missing date and an unreadable one are handled
 * together: both wait in the same batch, but one asks the reviewer to find the
 * date and the other to check what the scan made of it.
 */
export const isUnreadableDate = (value: string | null | undefined): boolean =>
  Boolean(value?.trim()) && ticketDay(value) === null;
