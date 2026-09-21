import { ticketDay } from '../../ticket-date.ts';
import type { Ticket } from '../../types.ts';
import type { Evidence, ObservedTicket } from '../contract.ts';
import {
  anyText,
  isPartial,
  strongestPerCandidate,
  timestampDay,
  wholeText,
} from './generic.ts';

// What a Heidelberg Materials ticket says twice.
//
// The layout is known well enough to read one box off another: the scale
// prints its own timestamp in an encoded form the rest of the world does not
// use, and the plant line carries the vendor's name beside a plant code. Both
// are facts about this vendor's paper, so they are kept in this file and
// tagged with the vendor when they are emitted — a rule that is true of
// Thornton's tickets must never be applied to a ticket nobody recognised.
//
// Everything arithmetic — gross, tare, net, tons — is true of every scale
// ticket and lives in generic.ts. This file adds only what the layout knows.

const MONTHS: Record<string, number> = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
};

/** The scale's own stamp: two-digit year, month in letters, two-digit day. */
const MACHINE_STAMP = /^(\d{2})([A-Za-z]{3})(\d{2})\b/;

/**
 * The day a Heidelberg machine timestamp encodes: "26SEP14 12:02" is the 14th
 * of September 2026, printed year first.
 *
 * The order is the trap. Read left to right by anything that expects a date,
 * "26SEP14" is the 26th of September 2014, which is a perfectly plausible day
 * and the wrong one by twelve years. Only the vendor's layout says which end
 * the year is on, which is exactly why this rule is not in generic.ts.
 *
 * The result is handed to `ticketDay` rather than trusted: a stamp the scan
 * turned into 30FEB is not a day the calendar has got, and a day the calendar
 * has not got is a misread, not a date.
 */
export function machineStampDay(stamp: string): string | null {
  const match = MACHINE_STAMP.exec(stamp.trim());
  if (!match) return null;
  const month = MONTHS[match[2].toUpperCase()];
  if (!month) return null;
  return ticketDay(`20${match[1]}-${month}-${match[3]}`);
}

/** An hour and a minute printed beside the date, which a date box never has. */
const TIME_OF_DAY = /\b\d{1,2}:\d{2}(:\d{2})?\b/;

/**
 * The dates this ticket's own stamps support.
 *
 * A stamp the scale printed dates the load, and it is the one thing on the
 * sheet strong enough for the resolver to date a ticket whose date box was
 * lost. So the question this rule has to answer honestly is not what day a
 * string names but whether the scale printed it.
 *
 * One thing says it did. The encoded form is unmistakable: nothing but the
 * machine writes the year first in letters, so "26SEP14" is strong however it
 * arrives. A slashed date is not the scale's on this paper, with or without
 * a time of day beside it: the date box sits next to the Time In and Time
 * Out boxes ("12/13/2025 Time In: Time Out: 8:33"), and a reader that hands
 * the two back as one timestamp is echoing the date box — the very field
 * that may have been misread — not reporting a second printing of the day.
 * A slashed date is therefore offered as moderate, which corroborates a
 * date that was read without being able to confirm or invent one. It used
 * to be strong when timed, and a date box misread 13 for 15 confirmed
 * itself through its own echo.
 *
 * A stamp that names a day the calendar has not got gives nothing at all.
 *
 * When two stamps name two different days, both are emitted. It is not this
 * file's business to pick; a ticket carrying two dates is a ticket a person
 * should look at, and the resolver surfaces the disagreement. When they name
 * the same day they are collapsed to the strongest reading of it, because two
 * stamps of one day are one day, not two reasons to believe it.
 */
function dateEvidence(observed: ObservedTicket): Evidence[] {
  const evidence: Evidence[] = [];
  for (const stamp of observed.timestamps) {
    const printed = stamp.trim();
    const encoded = machineStampDay(printed);
    const day = encoded ?? timestampDay(printed);
    if (!day) continue;
    const timed = TIME_OF_DAY.test(printed);
    evidence.push({
      field: 'ticket_date',
      candidate: day,
      source: 'vendor_rule',
      strength: encoded ? 'strong' : 'moderate',
      note: encoded
        ? `Machine timestamp ${printed} encodes ${day}.`
        : timed
          ? `"${printed}" names ${day}, but on this paper a slashed date beside a time is the date box and the time box read together, not the scale's stamp.`
          : `Date ${printed} is printed among the timestamps and names ${day}, with no time of day to mark it as the scale's.`,
    });
  }
  return strongestPerCandidate(evidence);
}

/**
 * The plant name, when the plant line lost it.
 *
 * On these tickets the plant NAME is the vendor: "Plant: U857" sits under the
 * branding, and the name printed there is Heidelberg Materials whichever
 * plant it is. So a whole plant code beside a plant name the reader only half
 * read is worth a candidate — but only when the branding itself said
 * Heidelberg, because the code alone is a weak tell and completing a name
 * from a weak tell is how a ticket ends up filed under the wrong supplier.
 *
 * Moderate, not strong: the name is the vendor's, not the plant's, and a
 * reviewer should still be shown it. The city line under it (`plant_address`)
 * is not derivable at all — U857 is Thornton only because somebody knows that,
 * which is a fact for workspace memory and not for this file.
 */
function plantEvidence(observed: ObservedTicket): Evidence[] {
  const branding = (observed.branding ?? '').toLowerCase();
  const code = wholeText(observed, 'plant_code');
  if (
    !branding.includes('heidelberg') ||
    !code ||
    !isPartial(observed, 'plant_name')
  ) {
    return [];
  }
  return [
    {
      field: 'plant_name',
      candidate: 'Heidelberg Materials',
      source: 'vendor_rule',
      strength: 'moderate',
      note: `Branding reads Heidelberg and plant ${code} is whole, so the half-read plant name is Heidelberg Materials.`,
    },
  ];
}

// Deliberately absent: customer id -> customer name. "60311596" is WITECH
// COMPANY INC because this workspace has hauled for them before, not because
// the layout says so, and a ticket from a customer nobody has hauled for
// would get somebody else's name from a rule written here. That pairing is
// workspace memory's to make; please do not add a guess at it in this file.

export const HEIDELBERG = {
  id: 'heidelberg',
  name: 'Heidelberg Materials',

  /**
   * How sure this ticket is Heidelberg's.
   *
   * The name in the branding or on the plant line settles it. The layout tells
   * on their own do not and must not: a ten-digit BOL beginning 17 and a
   * letter-and-three-digits plant code are Heidelberg's habits, but they are
   * habits, and together they come to 0.3 — under the floor, so a ticket
   * carrying only those falls to the generic path rather than being read under
   * rules that were never shown to apply to it.
   */
  detect(observed: ObservedTicket): number {
    const branding = (observed.branding ?? '').toLowerCase();
    const plantName = (anyText(observed, 'plant_name') ?? '').toLowerCase();
    const named =
      branding.includes('heidelberg') || plantName.includes('heidelberg');
    const bol = (anyText(observed, 'ticket_number') ?? '').replace(/\D/g, '');
    const plantCode = (anyText(observed, 'plant_code') ?? '')
      .trim()
      .toUpperCase();
    const score =
      (named ? 0.95 : 0) +
      (/^17\d{8}$/.test(bol) ? 0.2 : 0) +
      (/^[A-Z]\d{3}$/.test(plantCode) ? 0.1 : 0);
    // Rounded because the tells are added: 0.2 + 0.1 comes out of binary
    // floating point as 0.30000000000000004, and a score that is written into
    // a log and compared against a floor should be the number it reads as.
    return Math.min(Math.round(score * 100) / 100, 1);
  },

  redundantEvidence: (observed: ObservedTicket): Evidence[] => [
    ...dateEvidence(observed),
    ...plantEvidence(observed),
  ],

  /**
   * The date is laid down by the dot-matrix ribbon in the side margin, and
   * it is faint on every sheet whether or not the reader says so: one such
   * date has been read as the 13th, the 11th and the 18th for the 15th, the
   * print called clear each time. So the date is never taken on the reader's
   * word alone here. The encoded stamp or the plant's run of ticket numbers
   * confirms it; failing those, it is asked for.
   */
  faintPrint: ['ticket_date'] as const satisfies readonly (keyof Ticket)[],

  redundantSources: {
    ticket_date: ['explicit date field', 'machine timestamp'],
    net_lb: ['net weight', 'gross − tare', 'net tons × 2000'],
    net_tons: ['net tons', 'net weight ÷ 2000'],
    plant_name: ['branding', 'plant line'],
  } satisfies Partial<Record<keyof Ticket, string[]>>,
};
