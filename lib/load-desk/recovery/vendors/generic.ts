import { ticketDay } from '../../ticket-date.ts';
import type { Ticket } from '../../types.ts';
import type { Evidence, ObservedField, ObservedTicket } from '../contract.ts';

// The redundancy every scale ticket has, whoever printed it.
//
// A weight is printed twice — in pounds and in tons — and three times over, in
// gross, tare and net, which are one subtraction apart. So a weight the camera
// lost is usually still on the paper, in another box, and the app can say so
// without knowing whose paper it is. These rules read nothing but the
// observation in front of them: no vendor layout, no customer on file, no
// ticket that came before. That is what makes them safe to run on a ticket
// whose issuer was never recognised, and it is why they live apart from the
// vendor profiles rather than inside one of them.
//
// Nothing here decides anything. Each rule offers a candidate with the
// strength it honestly has — an arithmetic identity on the same ticket is
// strong, a conversion that has already lost precision is moderate — and the
// resolver weighs them. A rule that cannot be honest emits nothing at all.

/**
 * The text of a field as the reader gave it: the ink first, the reader's own
 * reading only when there was no ink to quote.
 *
 * `proposed` is a suggestion and never a value in its own right (contract.ts),
 * but for reading a vendor's name off a field it is better than nothing; for
 * anything arithmetic the callers below go through `wholeText`, which refuses
 * a field the reader said was incomplete.
 */
export function observedText(field: ObservedField | undefined): string | null {
  const text = field?.visible?.trim() || field?.proposed?.trim() || '';
  return text || null;
}

/** Whatever was read for a field, whole or not. For detection, not arithmetic. */
export const anyText = (
  observed: ObservedTicket,
  name: keyof Ticket,
): string | null => observedText(observed.fields[name]);

/**
 * The text of a field the reader saw all of, and null for one it did not.
 *
 * The single gate every derivation below passes through. A gross weight with
 * its last digit off the page is not a number: subtracting a tare from it
 * would invent a net that was never weighed, and print it with the same
 * confidence as one that was. A field the reader marked partial, or clipped at
 * any edge, is therefore not a source of evidence — only ever a field that
 * needs some.
 */
export function wholeText(
  observed: ObservedTicket,
  name: keyof Ticket,
): string | null {
  const field = observed.fields[name];
  if (!field || field.partial || field.clipped_edge) return null;
  return observedText(field);
}

/** Whether the reader said characters are missing from a field it did read. */
export function isPartial(
  observed: ObservedTicket,
  name: keyof Ticket,
): boolean {
  const field = observed.fields[name];
  return Boolean(field && (field.partial || field.clipped_edge));
}

const NUMBER_PRINT = /^-?\d+(\.\d+)?$/;

/**
 * A printed number as a number, and null for anything that is not one.
 *
 * Weights print with thousands separators and the odd stray mark beside them
 * ("27400 * 13.70*" is one real line of OCR), so the commas and spaces come
 * out and the rest has to be digits. Anything else — a letter the scan left
 * in, an empty string, a lone minus — is not a number that was weighed, and a
 * rule with nothing to work from is better than one working from NaN.
 */
export function printedNumber(text: string | null | undefined): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[,\s]/g, '');
  if (!NUMBER_PRINT.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

/** The day a printed timestamp names, or null: "09/14/2026 12:02" -> 2026-09-14. */
export function timestampDay(stamp: string | null | undefined): string | null {
  const first = stamp?.trim().split(/[\sT]/)[0];
  return ticketDay(first);
}

const poundText = (value: number) => String(Math.round(value));
const tonText = (value: number) => String(Math.round(value * 100) / 100);

/** A weight the reader saw whole: the print to quote, and the number to use. */
type PrintedWeight = { text: string; value: number };

function wholeWeight(
  observed: ObservedTicket,
  name: keyof Ticket,
): PrintedWeight | null {
  const text = wholeText(observed, name);
  const value = printedNumber(text);
  return text !== null && value !== null && value >= 0 ? { text, value } : null;
}

/**
 * The weights one ticket's own arithmetic supports.
 *
 * Gross, tare and net are three readings of two weighings, so any two of them
 * give the third exactly — strong evidence, and the only kind that should ever
 * complete a number nobody can read. The tons columns are the same weights
 * rounded to two places: pounds give tons back exactly, but tons give pounds
 * back only to the nearest twenty, so that direction is offered as moderate
 * and the resolver is left to refuse it against visible digits.
 *
 * A derivation that comes out at or below zero is dropped rather than offered:
 * a tare heavier than the gross means one of them was misread, and the ticket
 * wants a person, not a negative weight.
 */
function weightEvidence(observed: ObservedTicket): Evidence[] {
  const evidence: Evidence[] = [];
  const gross = wholeWeight(observed, 'gross_lb');
  const tare = wholeWeight(observed, 'tare_lb');
  const net = wholeWeight(observed, 'net_lb');
  const netTons = wholeWeight(observed, 'net_tons');

  if (gross && tare && gross.value - tare.value > 0) {
    evidence.push({
      field: 'net_lb',
      candidate: poundText(gross.value - tare.value),
      source: 'same_ticket',
      strength: 'strong',
      note: `Gross ${gross.text} less tare ${tare.text} on the same ticket leaves net ${poundText(gross.value - tare.value)} lb.`,
    });
  }
  if (tare && net && tare.value + net.value > 0) {
    evidence.push({
      field: 'gross_lb',
      candidate: poundText(tare.value + net.value),
      source: 'same_ticket',
      strength: 'strong',
      note: `Tare ${tare.text} plus net ${net.text} on the same ticket makes gross ${poundText(tare.value + net.value)} lb.`,
    });
  }
  if (gross && net && gross.value - net.value > 0) {
    evidence.push({
      field: 'tare_lb',
      candidate: poundText(gross.value - net.value),
      source: 'same_ticket',
      strength: 'strong',
      note: `Gross ${gross.text} less net ${net.text} on the same ticket leaves tare ${poundText(gross.value - net.value)} lb.`,
    });
  }
  if (net && net.value > 0) {
    evidence.push({
      field: 'net_tons',
      candidate: tonText(net.value / 2000),
      source: 'same_ticket',
      strength: 'strong',
      note: `Net ${net.text} lb on the same ticket is ${tonText(net.value / 2000)} tons.`,
    });
  }
  if (netTons && netTons.value > 0) {
    evidence.push({
      field: 'net_lb',
      candidate: poundText(netTons.value * 2000),
      source: 'same_ticket',
      strength: 'moderate',
      note: `Net ${netTons.text} tons on the same ticket is about ${poundText(netTons.value * 2000)} lb, to the rounding of the tons column.`,
    });
  }
  if (net && netTons && Math.abs(net.value / 2000 - netTons.value) <= 0.011) {
    const agreement = `Net ${net.text} lb and ${netTons.text} tons are the same weight printed twice, and agree.`;
    evidence.push({
      field: 'net_lb',
      candidate: poundText(net.value),
      source: 'same_ticket',
      strength: 'moderate',
      note: agreement,
    });
    evidence.push({
      field: 'net_tons',
      candidate: tonText(netTons.value),
      source: 'same_ticket',
      strength: 'moderate',
      note: agreement,
    });
  }
  return evidence;
}

/**
 * The days the ticket's own timestamps name.
 *
 * A timestamp with no label on it may be the weigh-in, the weigh-out or the
 * hour the office printed the sheet, and a print time can fall on the next day
 * from the load. So a day read off one is offered as moderate: enough to
 * corroborate a date that was read, or to put a candidate in front of a
 * reviewer, and deliberately not enough for the resolver to date a ticket on
 * its own. A vendor whose layout says which stamp is the scale's can say so
 * with its own rule; this one cannot.
 *
 * Two stamps naming one day are one piece of evidence, not two, so the same
 * day is offered once.
 */
function timestampDateEvidence(observed: ObservedTicket): Evidence[] {
  const evidence: Evidence[] = [];
  const seen = new Set<string>();
  for (const stamp of observed.timestamps) {
    const day = timestampDay(stamp);
    if (!day || seen.has(day)) continue;
    seen.add(day);
    evidence.push({
      field: 'ticket_date',
      candidate: day,
      source: 'same_ticket',
      strength: 'moderate',
      note: `Timestamp "${stamp.trim()}" printed on the ticket names ${day}, which may be the load or the printing.`,
    });
  }
  return evidence;
}

const STRENGTH_ORDER = { weak: 1, moderate: 2, strong: 3 } as const;

/**
 * One fact, one piece of evidence.
 *
 * Two rules reading the same printing — the vendor's rule and the generic one
 * both reading one timestamp, or a net derived from gross minus tare and again
 * from the tons column — put two items in front of the resolver for the same
 * field and the same value. The resolver builds confidence by counting sources
 * that agree, so a single stamp counted twice reads as two sources
 * corroborating each other when it is one piece of paper saying one thing.
 *
 * So items for the same field and candidate are collapsed to the strongest
 * one. Strength is not summed, because nothing new was learned; the order is
 * the order of first appearance, so the list a reviewer reads is the same
 * every time and the item kept is the one whose rule saw the most.
 */
export function strongestPerCandidate(evidence: Evidence[]): Evidence[] {
  const kept = new Map<string, Evidence>();
  for (const item of evidence) {
    const key = `${item.field}\u0000${item.candidate}`;
    const held = kept.get(key);
    if (
      !held ||
      STRENGTH_ORDER[item.strength] > STRENGTH_ORDER[held.strength]
    ) {
      kept.set(key, item);
    }
  }
  return [...kept.values()];
}

/**
 * Everything one ticket can say about itself without a vendor.
 *
 * Product code and description are the obvious missing pair — 56001222 is
 * "052CA06 GRADE 8" on every Thornton ticket — but that is a fact about a
 * catalogue, not about this sheet of paper, so it belongs to workspace memory
 * and not here. Nothing in this file may reach outside the observation.
 */
export const genericEvidence = (observed: ObservedTicket): Evidence[] => [
  ...weightEvidence(observed),
  ...timestampDateEvidence(observed),
];

/**
 * How the review screen words the redundancy any ticket carries, for a ticket
 * whose vendor was not recognised and which therefore has no profile of its
 * own to ask.
 */
export const GENERIC_REDUNDANT_SOURCES: Partial<
  Record<keyof Ticket, string[]>
> = {
  gross_lb: ['gross weight', 'tare + net'],
  tare_lb: ['tare weight', 'gross − net'],
  net_lb: ['net weight', 'gross − tare', 'net tons × 2000'],
  net_tons: ['net tons', 'net weight ÷ 2000'],
  ticket_date: ['date field', 'printed timestamps'],
};
