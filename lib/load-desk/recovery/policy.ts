import { NUMBER_FIELDS, TEXT_FIELDS, type Ticket } from '../types.ts';
import type { Evidence, EvidenceSource } from './contract.ts';

// What the app is allowed to fill in that was not on the paper, and how much
// it takes before it will.
//
// These are judgement calls, not machinery, so they live apart from the
// resolver that applies them: someone arguing about whether a customer's
// address may be completed from a profile, or how many sources it takes, has
// one short file to read. Every number below is a decision about when the app
// is permitted to be wrong, and the answer is nearly always "not from one
// weak source, and never for a number".
//
// The shape of the policy is the same everywhere: what was SEEN constrains
// what may be DECIDED. Evidence that does not fit the print is thrown away
// before it is weighed, so no amount of history can talk the app out of the
// ink on the ticket.

export type FieldClass = 'text' | 'identifier' | 'weight' | 'date' | 'other';

/**
 * Every field the ticket has, in the order the app declares them.
 *
 * Resolution walks this rather than an object's key order, so the same inputs
 * give the same output whatever order the reader or the evidence arrived in.
 */
export const FIELD_ORDER: readonly (keyof Ticket)[] = [
  ...TEXT_FIELDS,
  ...NUMBER_FIELDS,
];

// Names, addresses and descriptions: prose a person recognises, where a
// profile or a reviewed ticket really can say what the cut-off part said.
const TEXT_CLASS = new Set<keyof Ticket>([
  'plant_name',
  'plant_address',
  'customer_name',
  'project_name',
  'project_address',
  'product_description',
  'carrier_name',
  'weighmaster',
  'delivery_status',
  'other_charge',
]);

// Numbers and codes that name one thing exactly. A digit short is a different
// ticket, a different customer, a different order — so these are never
// completed from a family resemblance.
const IDENTIFIER_CLASS = new Set<keyof Ticket>([
  'ticket_number',
  'customer_id',
  'product_code',
  'order_number',
  'po_number',
  'dispatch_number',
  'carrier_id',
  'vehicle_id',
  'plant_code',
]);

// The quantities an invoice multiplies by a rate. A wrong one bills wrong
// money, so they are held to the identifier standard and then some.
const WEIGHT_CLASS = new Set<keyof Ticket>([
  'gross_lb',
  'tare_lb',
  'net_lb',
  'gross_tons',
  'tare_tons',
  'net_tons',
]);

/**
 * How much risk a field carries when the app gets it wrong, which is what
 * decides whether it may be completed from evidence at all.
 */
export function fieldClass(field: keyof Ticket): FieldClass {
  if (field === 'ticket_date') return 'date';
  if (TEXT_CLASS.has(field)) return 'text';
  if (IDENTIFIER_CLASS.has(field)) return 'identifier';
  if (WEIGHT_CLASS.has(field)) return 'weight';
  return 'other';
}

/**
 * The fields a reviewed save cannot go out without.
 *
 * These are the ones an invoice is built from and the ones a dispute is
 * settled by: which ticket, whose, when, and how much. A ticket may be saved
 * with a weighmaster nobody could read; it may not be saved with a net weight
 * the app is unsure of.
 */
export const CRITICAL_FIELDS: readonly (keyof Ticket)[] = [
  'ticket_number',
  'ticket_date',
  'customer_name',
  'customer_id',
  'product_code',
  'gross_lb',
  'tare_lb',
  'net_lb',
  'net_tons',
];

/**
 * The fields that may be completed from what the workspace knows.
 *
 * Exactly the prose fields. A profile can tell you that the customer whose
 * name ends "ARKHAM, IL" is Markham; it cannot tell you that the ticket
 * number ending "4464" is 17254464, because nothing about the workspace makes
 * one completion truer than another. Identifiers, weights and the date are
 * completed only by derivation from the same ticket or a rule of the vendor's
 * layout — see `DERIVATION_SOURCES`.
 */
export const RECOVERABLE_FROM_CONTEXT: ReadonlySet<keyof Ticket> = TEXT_CLASS;

type Strength = Evidence['strength'];

/**
 * What one piece of evidence is worth.
 *
 * The scale is set by `RECOVER_THRESHOLD` being 1: a single strong source
 * that is checked against reality — the same ticket, the vendor's own layout
 * — is worth a whole point on its own, a strong profile or reviewed ticket
 * most of one, and everything softer a fraction, so that soft evidence has to
 * arrive from two different directions before it counts.
 *
 * Two rows are deliberately incapable of deciding anything by themselves.
 * `model_proposed` is the reader's own guess, and the whole point of this
 * layer is that the reader's guesses are suggestions, not readings, so its
 * best offer is 0.2 — enough to be recorded as agreeing with a value that
 * stood on its own merits, never enough to stand one up. `batch_context`
 * tops out at 0.4 because "the ticket before it in the pile said so" is how
 * a whole upload comes to share one wrong customer.
 *
 * `visible` is zero because the print is not evidence about itself: it is the
 * thing the evidence has to fit.
 */
export const EVIDENCE_WEIGHTS: Readonly<
  Record<EvidenceSource, Readonly<Record<Strength, number>>>
> = {
  visible: { strong: 0, moderate: 0, weak: 0 },
  model_proposed: { strong: 0.2, moderate: 0.15, weak: 0.1 },
  same_ticket: { strong: 1, moderate: 0.6, weak: 0.3 },
  vendor_rule: { strong: 1, moderate: 0.6, weak: 0.3 },
  user_correction: { strong: 0.9, moderate: 0.6, weak: 0.3 },
  verified_profile: { strong: 0.8, moderate: 0.5, weak: 0.25 },
  verified_history: { strong: 0.7, moderate: 0.45, weak: 0.2 },
  historical_relationship: { strong: 0.5, moderate: 0.3, weak: 0.15 },
  // Strong is a scan agreeing with itself (see memory.ts, consensus): worth
  // more than a single sighting, and still short of the point on its own.
  batch_context: { strong: 0.6, moderate: 0.25, weak: 0.1 },
  user_confirmed: { strong: 1.5, moderate: 1.5, weak: 1.5 },
};

export const evidenceWeight = (item: Pick<Evidence, 'source' | 'strength'>): number =>
  EVIDENCE_WEIGHTS[item.source][item.strength];

/**
 * The combined weight a completion needs before the app writes it down.
 *
 * One point, reached either by two independent sources agreeing or by one
 * strong source that has been checked by a person or by the ticket itself.
 */
export const RECOVER_THRESHOLD = 1;

/**
 * How many different kinds of source it takes when no single one is strong
 * and verified. Two, so that one stale profile cannot carry a field alone.
 */
export const INDEPENDENT_SOURCES_REQUIRED = 2;

/**
 * Sources that somebody or something has checked against the world: a person
 * reviewed the ticket, a person corrected it, the profile is maintained, the
 * fact came off this very ticket or off the vendor's documented layout. One
 * of these, at strong, may carry a text field by itself.
 */
export const VERIFIED_SOURCES: ReadonlySet<EvidenceSource> = new Set<EvidenceSource>([
  'same_ticket',
  'vendor_rule',
  'verified_profile',
  'verified_history',
  'user_correction',
  'user_confirmed',
]);

/**
 * Sources that derive a value rather than remember one: the rest of this
 * ticket (gross minus tare), and a rule of the vendor's layout (the machine
 * timestamp carries the date). These are the only sources allowed to complete
 * an identifier, a weight or the date, and the only ones whose disagreement
 * with the print counts as a conflict rather than a stale record.
 */
export const DERIVATION_SOURCES: ReadonlySet<EvidenceSource> = new Set<EvidenceSource>([
  'same_ticket',
  'vendor_rule',
]);

/** Evidence that never stands a value up on its own, whatever its strength. */
export const ADVISORY_SOURCES: ReadonlySet<EvidenceSource> = new Set<EvidenceSource>([
  'visible',
  'model_proposed',
]);

/**
 * Whether a bundle of evidence for one value clears the bar.
 *
 * Either road may be taken: enough weight from at least two different kinds
 * of source, or one strong source of the kind that has been checked. The
 * reader's own proposal is excluded from both counts before this is asked, so
 * neither road can be walked by a guess.
 */
export function reachesThreshold(items: readonly Evidence[]): boolean {
  const counted = items.filter((item) => !ADVISORY_SOURCES.has(item.source));
  const weight = counted.reduce((sum, item) => sum + evidenceWeight(item), 0);
  const sources = new Set(counted.map((item) => item.source));
  if (weight >= RECOVER_THRESHOLD && sources.size >= INDEPENDENT_SOURCES_REQUIRED) {
    return true;
  }
  return counted.some(
    (item) => item.strength === 'strong' && VERIFIED_SOURCES.has(item.source),
  );
}

/** The weight of a bundle, with the reader's own suggestion left out of it. */
export const combinedWeight = (items: readonly Evidence[]): number =>
  items
    .filter((item) => !ADVISORY_SOURCES.has(item.source))
    .reduce((sum, item) => sum + evidenceWeight(item), 0);

/**
 * How sure the app is of something it filled in, from the weight behind it.
 *
 * `0.5 + 0.5 * w / (w + 1)`: at the threshold of one point this is 0.75, and
 * it climbs towards but never reaches certainty however much evidence piles
 * up — 0.875 at three points, capped at 0.99. The floor of 0.5 is there
 * because nothing gets this far without clearing the threshold, so a recovered
 * value is never reported as a coin toss; the ceiling is there because a value
 * that was not on the paper is never as good as one that was, and only `exact`
 * and a person's own confirmation are allowed to be 1.
 */
export const recoveredConfidence = (weight: number): number =>
  Math.min(0.99, 0.5 + (0.5 * weight) / (weight + 1));

/**
 * The most the app will claim for a value it worked out rather than read: a
 * derived weight or date is arithmetic over other readings, and those
 * readings could themselves be wrong.
 */
export const DERIVED_CONFIDENCE_CAP = 0.9;

/**
 * The most the app will claim when no sheet edge was found on the clipped
 * side. The print stops, but nothing in the picture says whether the printer
 * stopped it or the photographer did, so the recovery is offered with the
 * doubt attached.
 */
export const UNVERIFIED_FRAME_CONFIDENCE_CAP = 0.85;

/**
 * The shortest piece of print that may be used to pick between candidates.
 *
 * Two characters match too much: "HA" fits Hammond, Graham and Markham alike,
 * and picking the heaviest of those is guessing with extra steps. Three is
 * where a fragment starts to mean something, and even then it usually comes
 * back ambiguous, which is the right answer.
 */
export const MIN_SELECTING_FRAGMENT = 3;
