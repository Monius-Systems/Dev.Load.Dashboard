import { normalizeKey, normalizeName } from '../profiles.ts';
import { ticketDay } from '../ticket-date.ts';
import { printedNumber } from '../printed-number.ts';
import { fragmentFits } from './fit.ts';
import { isNumberField, type Ticket } from '../types.ts';
import {
  ADVISORY_SOURCES,
  CRITICAL_FIELDS,
  DERIVATION_SOURCES,
  DERIVED_CONFIDENCE_CAP,
  FIELD_ORDER,
  MIN_SELECTING_FRAGMENT,
  UNVERIFIED_FRAME_CONFIDENCE_CAP,
  VERIFIED_SOURCES,
  combinedWeight,
  evidenceWeight,
  fieldClass,
  reachesThreshold,
  recoveredConfidence,
  type FieldClass,
  SILENT_FIELDS,
} from './policy.ts';
import {
  UNKNOWN_FRAME,
  type ClippedEdge,
  type Evidence,
  type FieldResolution,
  type ObservedField,
  type ObservedTicket,
  type PaperFrame,
  type ReviewReason,
  type TicketRecovery,
} from './contract.ts';

// Pass 2: deciding what the ticket carries, from what was seen on the paper
// and what the workspace knows.
//
// The rule the whole file is built around is that the app would rather hand a
// person a half-read weight than hand an invoice a whole invented one. So
// every path through here ends in one of five places, and only two of them
// put a value on the ticket without a person looking: the print was read
// whole, or the missing part was derived from something that cannot disagree
// with it — the rest of the same ticket, the vendor's own layout, or enough
// independent record of the same prose that guessing does not come into it.
//
// Nothing here reads a clock, a random number or a store. The same
// observation and the same evidence give the same resolution, today and in
// the audit six months from now, which is the only way a value on an invoice
// can be traced back to the paper it came off.

/** Who the ticket belongs to, so evidence tied elsewhere is left out of it. */
export type RecoveryContext = {
  vendor: string | null;
  customer?: string | null;
  project?: string | null;
};

// --- reading what is on the paper -----------------------------------------

/**
 * The print with its damage markers taken off the ends.
 *
 * A reader hands back "17254464_" for a number whose last digits ran off the
 * sheet, and the underscore is a mark meaning "there was more", not a
 * character that was printed. It is stripped before anything is compared, and
 * `visible_text` keeps the reader's string exactly, because the review screen
 * should show what the reader saw.
 */
const stripPlaceholders = (text: string) =>
  text.replace(/^[\s_.-]+/, '').replace(/[\s_.-]+$/, '');

/**
 * A printed weight as a number, or null when the characters are not one.
 *
 * Commas, spaces and a currency sign are printing, not value. Anything else
 * left over means the field was not read, and a field that was not read gets
 * no number at all rather than whatever `Number` makes of it.
 */
const numberFrom = (text: string): number | null => printedNumber(text);

/**
 * The print as the ticket would store it, or null when it is not a value this
 * field can hold.
 *
 * The date goes through `ticketDay` like every other date in the app. The
 * reader is asked for it as printed — "9/14/26" — and the app files it as
 * "2026-09-14", so a date read whole has to leave here in the shape
 * `ticketFromExtraction` would have put it in; anything else and the resolver
 * would overwrite a filed date with the printer's wording and the invoice
 * would carry it. It also settles the layer's own disagreement with itself: a
 * recovered date was already ISO, and an exact one was not.
 *
 * A day the calendar has not got comes back null from `ticketDay` and is
 * handled the way an unreadable weight is — not read, no value, the print
 * kept — which leaves "2026-02-31" where it has always been: in the undated
 * batch, with review asking somebody to read the date off the paper.
 */
const coerce = (field: keyof Ticket, text: string): string | number | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (fieldClass(field) === 'date') return ticketDay(trimmed);
  return isNumberField(field) ? numberFrom(trimmed) : trimmed;
};

/**
 * Whether a fragment of print could be part of a candidate.
 *
 * The side the print ran off decides where the fragment has to sit: text cut
 * off on the left ends the candidate, text cut off on the right begins it.
 * A field the reader called partial without naming a side — torn, smudged —
 * only has to appear somewhere in it. An empty fragment constrains nothing,
 * which is why an empty one is never allowed to select on its own.
 */
function fits(fragment: string, candidate: string, edge: ClippedEdge | null): boolean {
  if (!fragment) return true;
  return fragmentFits(fragment, candidate, edge);
}

/** Separators are printing too: "2026-09-14" and "2026/09/14" are one day. */
const dateKey = (text: string) => text.replace(/\s+/g, '').replace(/[-.]/g, '/');

/**
 * The ways one day gets printed on a delivery ticket, so a surviving corner
 * of a date can be checked against a day without guessing which way round the
 * printer wrote it.
 */
function printedDays(iso: string): string[] {
  const [year, month, day] = iso.split('-');
  return [
    `${Number(month)}/${Number(day)}/${year}`,
    `${month}/${day}/${year}`,
    `${Number(month)}/${Number(day)}/${year.slice(2)}`,
    `${month}/${day}/${year.slice(2)}`,
    `${year}-${month}-${day}`,
  ];
}

const dateFragmentFits = (fragment: string, iso: string, edge: ClippedEdge | null) => {
  if (!fragment) return true;
  if (ticketDay(fragment) === iso) return true;
  const key = dateKey(fragment);
  return printedDays(iso).some((form) => fits(key, dateKey(form), edge));
};

// --- weighing the evidence ------------------------------------------------

/**
 * Two evidence items are the same item when everything about them is the
 * same. Vendor rules and workspace memory are gathered independently and both
 * notice the same fact now and then; counting it twice would let one fact
 * clear a threshold meant to take two.
 */
const evidenceKey = (item: Evidence) =>
  [
    item.source,
    item.strength,
    item.candidate,
    item.note,
    item.context?.vendor ?? '',
    item.context?.customer ?? '',
    item.context?.project ?? '',
  ].join('\u0000');

/**
 * Why a piece of evidence does not apply to this ticket, or null when it
 * does. Evidence with nothing tied to it applies anywhere; evidence tied to a
 * customer, a project or a vendor is worth nothing outside it, and a ticket
 * whose customer is not known yet is outside every one of them.
 */
function contextMismatch(item: Evidence, context: RecoveryContext): string | null {
  const tie = item.context;
  if (!tie) return null;
  if (tie.vendor != null && tie.vendor !== context.vendor) return 'a different vendor';
  if (
    tie.customer != null &&
    normalizeName(tie.customer) !== normalizeName(context.customer ?? '')
  ) {
    return 'a different customer';
  }
  if (
    tie.project != null &&
    normalizeName(tie.project) !== normalizeName(context.project ?? '')
  ) {
    return 'a different project';
  }
  return null;
}

/** Values that fit, listed for the review screen: deduped and in one order. */
const candidateList = (items: readonly Evidence[]): string[] =>
  [
    ...new Set(
      items
        .filter((item) => !ADVISORY_SOURCES.has(item.source))
        .map((item) => item.candidate.trim())
        .filter(Boolean),
    ),
  ].sort();

/** Heaviest first, then alphabetically, so the same bundle always ranks alike. */
const byAuthority = (a: Evidence, b: Evidence) =>
  Number(VERIFIED_SOURCES.has(b.source)) - Number(VERIFIED_SOURCES.has(a.source)) ||
  evidenceWeight(b) - evidenceWeight(a) ||
  a.source.localeCompare(b.source) ||
  a.candidate.localeCompare(b.candidate);

const leadEvidence = (items: readonly Evidence[]) => [...items].sort(byAuthority)[0];

/** The spelling to write down: the one a checked source uses, capitals and all. */
const bestSpelling = (items: readonly Evidence[]) => leadEvidence(items).candidate.trim();

const hasStrongDerivation = (items: readonly Evidence[]) =>
  items.some((item) => item.strength === 'strong' && DERIVATION_SOURCES.has(item.source));

/** Whether a candidate says the same thing as a value already standing. */
function sameValue(
  field: keyof Ticket,
  cls: FieldClass,
  candidate: string,
  standing: string | number | null,
): boolean {
  if (standing === null) return false;
  const standingText = String(standing);
  if (cls === 'date') {
    const day = ticketDay(candidate);
    // Evidence that names no day at all is not a second opinion about which
    // day it is, so it cannot contradict one.
    return day === null || day === ticketDay(standingText);
  }
  if (isNumberField(field)) {
    const value = numberFrom(candidate);
    return value === null || value === standing;
  }
  if (cls === 'identifier') return normalizeKey(candidate) === normalizeKey(standingText);
  return normalizeName(candidate) === normalizeName(standingText);
}

// --- resolving one field --------------------------------------------------

type Draft = {
  status: FieldResolution['status'];
  value: string | number | null;
  source: FieldResolution['source'];
  confidence: number;
  reason?: ReviewReason;
  candidates?: string[];
};

/**
 * What a field that is waiting for a person carries in the meantime.
 *
 * For prose, the fragment that was printed, so the reviewer reads the ticket
 * rather than a blank. For anything a machine will do arithmetic on, nothing
 * at all: a number a digit short looks exactly like a number, and the moment
 * it sits in a numeric column some total picks it up.
 */
const holdingValue = (cls: FieldClass, visible: string | null) =>
  cls === 'text' ? visible : null;

/**
 * What one field is, given what the reader saw of it and everything on file.
 *
 * `paper` is the frame the clipping is judged against: the same missing
 * characters mean "the printer cut this off, complete it if you can" when the
 * sheet's edge is in the picture and "take the photograph again" when it is
 * not.
 */
export function resolveField(
  field: keyof Ticket,
  observed: ObservedField | undefined,
  paper: PaperFrame,
  evidence: readonly Evidence[],
  context: RecoveryContext,
): FieldResolution {
  const cls = fieldClass(field);
  const notes: string[] = [];

  const seen = new Set<string>();
  const applicable: Evidence[] = [];
  for (const item of evidence) {
    if (item.field !== field) continue;
    const key = evidenceKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    const mismatch = contextMismatch(item, context);
    if (mismatch) notes.push(`Not applied: ${item.note} — ${mismatch}.`);
    else applicable.push(item);
  }

  const visible = observed?.visible ?? null;
  const proposedRaw = observed?.proposed?.trim() ?? '';
  const proposed = proposedRaw || null;
  const edge = observed?.clipped_edge ?? null;
  const fragment = stripPlaceholders(visible ?? '');
  const isPartial = observed?.partial === true || edge !== null;

  const finish = (draft: Draft): FieldResolution => ({
    status: draft.status,
    value: draft.value,
    visible_text: visible,
    source: draft.source,
    source_clipped:
      edge !== null && (paper[edge] === 'inside' || paper[edge] === 'unknown'),
    clipped_edge: edge,
    confidence: draft.confidence,
    evidence: boundedNotes(notes),
    ...(draft.reason ? { reason: draft.reason } : {}),
    ...(draft.candidates?.length ? { candidates: boundedCandidates(draft.candidates) } : {}),
  });

  // (a) The sheet runs off the picture on the side the print stops. Nothing
  // on file is allowed near this: the missing characters are not lost, they
  // are outside the frame, and one more photograph brings them back. Filling
  // it in from history would turn a retake into a permanent invention.
  if (edge !== null && paper[edge] === 'cut') {
    notes.push(
      `The sheet runs off the ${edge} of the picture, so the missing print was cut off by the camera rather than the printer: take the photograph again.`,
    );
    for (const item of applicable) {
      notes.push(`Not applied: ${item.note} — a camera crop is never recovered.`);
    }
    return {
      ...finish({
        status: 'needs_review',
        value: holdingValue(cls, visible),
        source: null,
        confidence: 0,
        reason: 'camera_crop',
        candidates: candidateList(applicable),
      }),
      // The camera did this, not the printer, so the field is not source
      // clipped however the detector reads the rest of the sheet.
      source_clipped: false,
    };
  }

  // (b) No sheet edge was found on the clipped side. The clipping is taken at
  // face value so the field is still recoverable, but the frame was never
  // confirmed, and the confidence and the notes both say so.
  const frameUnverified = edge !== null && paper[edge] === 'unknown';
  if (frameUnverified) {
    notes.push(
      `No sheet edge was found on the ${edge} of the picture, so nothing confirms the printer cut this off rather than the camera.`,
    );
  }
  const capConfidence = (value: number) =>
    frameUnverified ? Math.min(UNVERIFIED_FRAME_CONFIDENCE_CAP, value) : value;

  // The field was read whole.
  if (fragment && !isPartial) {
    const value = coerce(field, proposed ?? fragment);
    if (value === null) {
      notes.push(`The print "${fragment}" is not a value this field can hold.`);
      return finish({
        status: 'needs_review',
        value: null,
        source: null,
        confidence: 0,
        reason: 'not_read',
        candidates: candidateList(applicable),
      });
    }
    // (4, d) A value read whole still has to survive the sources that cannot
    // merely be out of date. A machine timestamp naming another day is not a
    // stale record, it is the same ticket disagreeing with itself. A profile
    // spelling the customer differently is not: the print stands (g), and the
    // existing near-match flow is where spelling gets settled.
    const disputes = applicable.filter(
      (item) =>
        item.strength === 'strong' &&
        DERIVATION_SOURCES.has(item.source) &&
        !sameValue(field, cls, item.candidate, value),
    );
    for (const item of applicable) {
      // (g) A record that merely remembers the field differently is out of
      // date, not a contradiction; the ink wins and nobody is stopped.
      const agrees = disputes.includes(item) || sameValue(field, cls, item.candidate, value);
      notes.push(agrees ? item.note : `Not applied: ${item.note} — the printed value stands.`);
    }
    if (disputes.length) {
      return finish({
        status: 'needs_review',
        value: holdingValue(cls, visible),
        source: null,
        confidence: 0,
        reason: 'conflicting_evidence',
        // The print as it was printed, not as the ticket would file it: the
        // reviewer is being asked which of these the paper means, and the
        // paper says "9/15/26".
        candidates: [...new Set([fragment, ...disputes.map((d) => d.candidate.trim())])].sort(),
      });
    }
    return finish({ status: 'exact', value, source: 'visible', confidence: 1 });
  }

  // (h) Nothing was printed and nothing says characters are missing: the
  // field was simply not on this ticket. What the workspace knows about it is
  // recorded and then left alone — filling a blank from history is inventing
  // a reading, not recovering one.
  if (!fragment && !isPartial) {
    for (const item of applicable) {
      notes.push(
        `Not applied: ${item.note} — the field was not printed on the ticket, so there is nothing to complete.`,
      );
    }
    if (proposed) {
      notes.push(
        `The reader proposed "${proposed}" where nothing was printed and nothing on file supports it.`,
      );
      return finish({
        status: 'needs_review',
        value: null,
        source: null,
        confidence: 0,
        reason: 'unsupported_proposal',
      });
    }
    return finish({ status: 'missing', value: null, source: null, confidence: 0 });
  }

  // From here the field is partly there: characters are missing, and the
  // question is whether anything is entitled to supply them.
  if (cls === 'date') {
    return finish(resolveDate(fragment, edge, proposed, applicable, notes, capConfidence));
  }
  if (cls === 'text') {
    return finish(
      resolveText(fragment, edge, proposed, applicable, notes, capConfidence, visible),
    );
  }
  return finish(
    resolveDerived(field, cls, fragment, edge, proposed, applicable, notes, capConfidence),
  );
}

/**
 * (d) A date with part of it missing.
 *
 * Only the ticket's own machine timestamps and the vendor's documented layout
 * may say what the rest of it was, and only when the day they name could have
 * been printed the way the surviving corner reads. Everything else on file —
 * the day the batch was uploaded, the day the last ticket for this customer
 * was dated — is left out entirely, because a date is the one field where
 * being close is being wrong, and a ticket dated into the wrong month is
 * invoiced into the wrong month.
 */
function resolveDate(
  fragment: string,
  edge: ClippedEdge | null,
  proposed: string | null,
  applicable: readonly Evidence[],
  notes: string[],
  capConfidence: (value: number) => number,
): Draft {
  const authoritative = applicable.filter(
    (item) => item.strength === 'strong' && DERIVATION_SOURCES.has(item.source),
  );
  const fitting = authoritative.filter((item) => {
    const day = ticketDay(item.candidate);
    return day !== null && dateFragmentFits(fragment, day, edge);
  });
  for (const item of applicable) {
    notes.push(
      fitting.includes(item)
        ? item.note
        : `Not applied: ${item.note} — only the ticket's own timestamps and the vendor's layout may complete a date${fragment ? `, and it must fit the printed "${fragment}"` : ''}.`,
    );
  }

  const days = [...new Set(fitting.map((item) => ticketDay(item.candidate)!))].sort();
  if (days.length > 1) {
    return {
      status: 'needs_review',
      value: null,
      source: null,
      confidence: 0,
      reason: 'conflicting_evidence',
      candidates: days,
    };
  }
  if (days.length === 0) {
    if (proposed) {
      notes.push(`The reader proposed "${proposed}", which nothing on file supports.`);
    }
    return {
      status: 'needs_review',
      value: null,
      source: null,
      confidence: 0,
      reason: proposed && !applicable.length ? 'unsupported_proposal' : 'insufficient_evidence',
      candidates: candidateList(applicable),
    };
  }

  // One day fits the print — but only if nothing else on file names another.
  // A weak record disagreeing is still two sources disagreeing about the one
  // field an invoice is filed under, and that is a question for a person.
  const day = days[0];
  const otherDays = [
    ...new Set(
      applicable
        .filter((item) => !ADVISORY_SOURCES.has(item.source))
        .map((item) => ticketDay(item.candidate))
        .filter((other): other is string => other !== null && other !== day),
    ),
  ];
  if (otherDays.length) {
    return {
      status: 'needs_review',
      value: null,
      source: null,
      confidence: 0,
      reason: 'conflicting_evidence',
      candidates: [day, ...otherDays].sort(),
    };
  }

  const contributing = fitting.filter((item) => ticketDay(item.candidate) === day);
  return {
    status: 'recovered',
    value: day,
    source: leadEvidence(contributing).source,
    confidence: capConfidence(
      Math.min(DERIVED_CONFIDENCE_CAP, recoveredConfidence(combinedWeight(contributing))),
    ),
  };
}

/**
 * (c) An identifier or a weight with characters missing.
 *
 * Nothing on file completes one of these. A customer number that begins the
 * same is a different customer's number; a weight that starts "45,4" is any
 * of a hundred weights, and the one the workspace has seen most often is the
 * most expensive way to be wrong. The single exception is a value the ticket
 * itself or the vendor's layout yields whole — gross minus tare, a total
 * repeated in tons — and even then only when the digits that did print are
 * where that value says they should be.
 *
 * Everything the workspace offered is still listed, so a reviewer can pick
 * one in a click. Listing is not adopting.
 */
function resolveDerived(
  field: keyof Ticket,
  cls: FieldClass,
  fragment: string,
  edge: ClippedEdge | null,
  proposed: string | null,
  applicable: readonly Evidence[],
  notes: string[],
  capConfidence: (value: number) => number,
): Draft {
  const fragmentKey = normalizeKey(fragment);
  const fitting = applicable.filter((item) => {
    if (item.strength !== 'strong' || !DERIVATION_SOURCES.has(item.source)) return false;
    const key = normalizeKey(item.candidate);
    if (!key || key.length < fragmentKey.length) return false;
    if (isNumberField(field) && numberFrom(item.candidate) === null) return false;
    return fits(fragmentKey, key, edge);
  });
  for (const item of applicable) {
    notes.push(
      fitting.includes(item)
        ? item.note
        : `Not applied: ${item.note} — a partly printed ${cls === 'weight' ? 'weight' : 'number'} is only completed by the ticket's own arithmetic or the vendor's layout, and only when it fits the digits that printed.`,
    );
  }

  const values = [...new Set(fitting.map((item) => normalizeKey(item.candidate)))];
  if (values.length > 1) {
    return {
      status: 'needs_review',
      value: null,
      source: null,
      confidence: 0,
      reason: 'conflicting_evidence',
      candidates: candidateList(fitting),
    };
  }
  if (values.length === 1) {
    const lead = leadEvidence(fitting);
    const value = coerce(field, lead.candidate);
    if (value !== null) {
      if (proposed && !sameValue(field, cls, proposed, value)) {
        notes.push(`The reader proposed "${proposed}" instead; the derived value stands.`);
      }
      return {
        status: 'recovered',
        value,
        source: lead.source,
        confidence: capConfidence(
          Math.min(DERIVED_CONFIDENCE_CAP, recoveredConfidence(combinedWeight(fitting))),
        ),
      };
    }
  }

  // (c) The reader's own completion of a number is recorded and refused. It
  // is the most confident-looking wrong answer this app can produce.
  if (proposed) {
    notes.push(
      `The reader proposed "${proposed}", which nothing on the ticket or on file supports.`,
    );
  }
  return {
    status: 'needs_review',
    value: null,
    source: null,
    confidence: 0,
    reason: cls === 'other' ? 'insufficient_evidence' : 'partial_numeric',
    candidates: candidateList(applicable),
  };
}

/**
 * (e, f) Prose with part of it missing.
 *
 * This is the one place the app completes what it did not read, because a
 * customer's name is a thing the workspace genuinely knows and "ARKHAM, IL"
 * genuinely is Markham. The safeguards are all about the difference between
 * knowing and matching: a candidate has to fit the surviving print on the
 * right side of it, a fragment too short to mean anything picks nothing, one
 * candidate has to be clearly ahead of the next, and enough independent
 * record has to stand behind it that no single stale row decides.
 */
function resolveText(
  fragment: string,
  edge: ClippedEdge | null,
  proposed: string | null,
  applicable: readonly Evidence[],
  notes: string[],
  capConfidence: (value: number) => number,
  visible: string | null,
): Draft {
  const held = visible;
  const fragmentKey = normalizeName(fragment);
  const pool = applicable.filter(
    (item) => !ADVISORY_SOURCES.has(item.source) && item.candidate.trim(),
  );

  // (h) Nothing of the field printed, but the reader says it was cut off.
  // Only the ticket's own evidence may fill that in; a name taken from
  // history alone would be a name this ticket never carried.
  const usable =
    fragmentKey === ''
      ? pool.filter(
          (item) => item.strength === 'strong' && DERIVATION_SOURCES.has(item.source),
        )
      : pool;

  // A fragment of one or two characters fits half the workspace. There is no
  // honest way to choose between what it fits, so it does not choose.
  if (fragmentKey && fragmentKey.replace(/ /g, '').length < MIN_SELECTING_FRAGMENT) {
    notes.push(
      `Only "${fragment}" printed, which is too little to tell one value on file from another.`,
    );
    for (const item of applicable) notes.push(`Not applied: ${item.note}.`);
    return {
      status: 'needs_review',
      value: held,
      source: null,
      confidence: 0,
      reason: 'insufficient_evidence',
      candidates: candidateList(pool),
    };
  }

  // A candidate that is the fragment, letter for letter, completes nothing:
  // it is the print again, from a ticket that was saved as it stood.
  const compatible = usable.filter(
    (item) =>
      normalizeName(item.candidate) !== fragmentKey &&
      fits(fragmentKey, normalizeName(item.candidate), edge),
  );
  for (const item of applicable) {
    if (compatible.includes(item)) {
      notes.push(item.note);
    } else if (item.source === 'model_proposed') {
      continue;
    } else if (fragmentKey === '' && pool.includes(item)) {
      notes.push(
        `Not applied: ${item.note} — nothing of this field printed, so only the ticket's own evidence may complete it.`,
      );
    } else {
      notes.push(
        `Not applied: ${item.note} — "${item.candidate.trim()}" does not fit the printed "${fragment}".`,
      );
    }
  }

  const groups = new Map<string, Evidence[]>();
  for (const item of compatible) {
    const key = normalizeName(item.candidate);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  if (groups.size === 0) {
    if (proposed) {
      notes.push(`The reader proposed "${proposed}", which nothing on file supports.`);
      return {
        status: 'needs_review',
        value: held,
        source: null,
        confidence: 0,
        reason: pool.length ? 'insufficient_evidence' : 'unsupported_proposal',
        candidates: candidateList(pool),
      };
    }
    return {
      status: 'needs_review',
      value: held,
      source: null,
      confidence: 0,
      reason: 'insufficient_evidence',
      candidates: candidateList(pool),
    };
  }

  const ranked = [...groups.entries()]
    .map(([key, items]) => ({ key, items, weight: combinedWeight(items) }))
    .sort((a, b) => b.weight - a.weight || a.key.localeCompare(b.key));
  const [top, second] = ranked;
  const all = candidateList(compatible);

  // (4) Two sources that derive rather than remember are not allowed to
  // disagree quietly, however far apart their weights land.
  const disputed =
    ranked.length > 1 &&
    hasStrongDerivation(top.items) &&
    ranked.slice(1).some((group) => hasStrongDerivation(group.items));
  if (disputed) {
    return {
      status: 'needs_review',
      value: held,
      source: null,
      confidence: 0,
      reason: 'conflicting_evidence',
      candidates: all,
    };
  }

  if (reachesThreshold(top.items)) {
    // Clearly ahead means twice the next candidate. Anything closer is the
    // app preferring one plausible name over another, which is guessing with
    // a number attached to it.
    if (second && top.weight <= second.weight * 2) {
      return {
        status: 'needs_review',
        value: held,
        source: null,
        confidence: 0,
        reason: 'ambiguous_candidates',
        candidates: all,
      };
    }
    const value = bestSpelling(top.items);
    if (proposed && normalizeName(proposed) === top.key) {
      notes.push(`The reader proposed "${proposed}", which agrees.`);
    }
    return {
      status: 'recovered',
      value,
      source: leadEvidence(top.items).source,
      confidence: capConfidence(recoveredConfidence(top.weight)),
    };
  }

  if (proposed) notes.push(`The reader proposed "${proposed}", which nothing on file carries.`);
  return {
    status: 'needs_review',
    value: held,
    source: null,
    confidence: 0,
    reason: 'insufficient_evidence',
    candidates: all,
  };
}

// --- resolving the ticket -------------------------------------------------

/**
 * The frame the resolver judges clipping against, from the document detector
 * and the reader together.
 *
 * The contract is explicit that neither alone is trusted to say a clipped
 * field is the printer's doing, so an edge counts as `inside` only when both
 * put it in the picture, and one of them calling it `cut` is enough to make
 * it a retake. The cautious reading is always the one that sends a person
 * back to the paper rather than the one that lets the app fill something in.
 */
export function mergeFrames(detected: PaperFrame, read: PaperFrame | null): PaperFrame {
  if (!read) return { ...detected };
  const side = (edge: ClippedEdge) => {
    if (detected[edge] === 'cut') return 'cut' as const;
    // The detector found this edge of the sheet in the picture. The reader
    // saying the sheet runs off there is a weaker witness — asked whether the
    // paper's edge is visible on a side where the print stops dead, a vision
    // model answers for the print as often as for the paper — so it lowers
    // the frame to unknown, where recovery goes ahead with its confidence
    // capped and the doubt on the record, rather than to cut, where every
    // field on that side was thrown out as a retake.
    if (detected[edge] === 'inside') {
      return read[edge] === 'inside' ? ('inside' as const) : ('unknown' as const);
    }
    // No sheet found. The reader's word was believed here at first — a
    // reader saying the sheet ran off sent the ticket back for a photograph
    // — and it sent back tickets that were whole in the picture, with the
    // carrier's name plainly printed up to where the printer stopped. A
    // vision model asked about the paper's edge answers for the print's
    // edge, so its "cut" is not a crop; it is doubt, and doubt is unknown:
    // recovery goes ahead with its confidence capped and the doubt on the
    // record. Only the detector, which finds the paper itself, may call a
    // side cut, and the camera refuses a genuine crop before it is ever read.
    return 'unknown' as const;
  };
  return {
    detected: detected.detected || read.detected,
    left: side('left'),
    right: side('right'),
    top: side('top'),
    bottom: side('bottom'),
  };
}

/** A recovery record with nothing decided yet. */
export const emptyRecovery = (paper?: PaperFrame): TicketRecovery => ({
  version: 1,
  vendor: null,
  // Copied rather than held: the caller's frame — and `UNKNOWN_FRAME`, which
  // is frozen — belong to whoever handed them over, and a record that aliases
  // one would change under the queue item it was stored beside.
  paper: { ...(paper ?? UNKNOWN_FRAME) },
  fields: {},
});

/**
 * Every field the reader saw or the workspace has something to say about,
 * resolved.
 *
 * Fields are walked in the app's own declared order rather than whatever
 * order the reader or the evidence arrived in, so two runs over the same
 * inputs produce the same record character for character.
 */
export function resolveTicket(
  observed: ObservedTicket,
  paper: PaperFrame,
  evidence: readonly Evidence[],
  context: RecoveryContext,
): TicketRecovery {
  const frame = mergeFrames(paper, observed.paper_edges);
  const wanted = new Set<keyof Ticket>([
    ...(Object.keys(observed.fields) as (keyof Ticket)[]),
    ...evidence.map((item) => item.field),
  ]);
  const fields: TicketRecovery['fields'] = {};
  for (const field of FIELD_ORDER) {
    if (!wanted.has(field)) continue;
    fields[field] = resolveField(field, observed.fields[field], frame, evidence, context);
  }
  return { version: 1, vendor: context.vendor, paper: frame, fields };
}

/**
 * The ticket with everything the resolver settled written into it.
 *
 * A field still waiting for a person keeps its printed fragment when it is
 * prose and gets nothing at all when it is a number, a code or the date — the
 * point of the whole layer is that a half-read weight never reaches a column
 * something multiplies by a rate. Fields the resolver had nothing to say
 * about are left exactly as they were.
 */
export function applyRecovery(ticket: Ticket, recovery: TicketRecovery): Ticket {
  const next: Record<string, string | number | null> = { ...ticket };
  for (const field of FIELD_ORDER) {
    const resolution = recovery.fields[field];
    if (!resolution) continue;
    const cls = fieldClass(field);
    if (
      resolution.status === 'exact' ||
      resolution.status === 'recovered' ||
      resolution.status === 'confirmed'
    ) {
      next[field] = resolution.value;
    } else if (resolution.status === 'needs_review') {
      next[field] = cls === 'text' ? resolution.visible_text : null;
    } else {
      next[field] = null;
    }
  }
  return next as Ticket;
}

/**
 * How a reviewer's own note opens, so the last one can be found and replaced.
 * Both wordings share it deliberately: a person who accepts and then edits has
 * made one decision, not two.
 */
const REVIEWER_NOTE = 'A reviewer';

/**
 * As many notes as a stored recovery record is allowed to carry. The record
 * travels with the ticket through the save, where it is checked against this
 * same ceiling, so a field somebody worked over must not be able to grow past
 * it and take the save down with it.
 */
const MAX_EVIDENCE_NOTES = 20;
/** One note may be this long on the record; the validator refuses longer. */
const MAX_NOTE_CHARS = 300;

/**
 * The notes as the record may carry them: at most `MAX_EVIDENCE_NOTES`, each
 * at most `MAX_NOTE_CHARS`.
 *
 * The bounds are the validator's (record-input.ts), and it refuses rather
 * than trims — so a field the workspace had a great deal to say about, a
 * short fragment that fits thirty job sites, produced a record the server
 * would not store, and the ticket could not be saved at all. What is kept is
 * the first of them, in the order they were weighed, and one line saying how
 * many more there were; the resolution itself is unchanged by the trimming.
 */
/** The validator's bounds on the candidate list: ten of them, two hundred characters each. */
const MAX_CANDIDATES = 10;
const MAX_CANDIDATE_CHARS = 200;

/** The candidates as the record may carry them; the first ten, each cut to fit. */
const boundedCandidates = (candidates: string[]): string[] =>
  candidates
    .slice(0, MAX_CANDIDATES)
    .map((value) =>
      value.length > MAX_CANDIDATE_CHARS ? `${value.slice(0, MAX_CANDIDATE_CHARS - 1)}…` : value,
    );

function boundedNotes(notes: string[]): string[] {
  const clipped = notes.map((note) =>
    note.length > MAX_NOTE_CHARS ? `${note.slice(0, MAX_NOTE_CHARS - 1)}…` : note,
  );
  if (clipped.length <= MAX_EVIDENCE_NOTES) return clipped;
  const kept = clipped.slice(0, MAX_EVIDENCE_NOTES - 1);
  return [...kept, `…and ${clipped.length - kept.length} more.`];
}

/**
 * One field as a person settled it in review, which ends the question.
 *
 * Accepting and editing are both recorded, and both keep the print that was
 * seen beside the value, because the reason to store any of this is that
 * somebody may ask in a year where a number on an invoice came from.
 */
export function confirmField(
  recovery: TicketRecovery,
  field: keyof Ticket,
  value: string | number | null,
  how: 'accepted' | 'edited',
): TicketRecovery {
  const previous = recovery.fields[field];
  const shown = value === null ? 'nothing' : `"${value}"`;
  const note =
    how === 'accepted'
      ? `${REVIEWER_NOTE} accepted ${shown} for this field.`
      : `${REVIEWER_NOTE} typed ${shown} for this field.`;
  // The review screen confirms on every keystroke, so this runs again for
  // every character of a name somebody retypes. What is worth keeping is the
  // decision, not the typing: the earlier reviewer note is replaced rather
  // than stacked, and the evidence the resolver weighed is kept beneath it.
  const weighed = (previous?.evidence ?? []).filter(
    (line) => !line.startsWith(REVIEWER_NOTE),
  );
  const kept = weighed.slice(Math.max(0, weighed.length - (MAX_EVIDENCE_NOTES - 1)));
  const resolution: FieldResolution = {
    status: 'confirmed',
    value,
    visible_text: previous?.visible_text ?? null,
    source: 'user_confirmed',
    source_clipped: previous?.source_clipped ?? false,
    clipped_edge: previous?.clipped_edge ?? null,
    confidence: 1,
    evidence: [...kept, note],
    confirmed_by_user: true,
    ...(previous?.candidates?.length ? { candidates: previous.candidates } : {}),
  };
  return { ...recovery, fields: { ...recovery.fields, [field]: resolution } };
}

/**
 * The fields a reviewed save cannot go out without that are not settled.
 *
 * A critical field waiting for a person blocks; so does one that came back
 * empty because the print ran off the sheet, because "nothing was read" and
 * "nothing was there" are the same blank on the screen and only one of them
 * is safe to bill.
 */
export const unresolvedCritical = (recovery: TicketRecovery): (keyof Ticket)[] =>
  CRITICAL_FIELDS.filter((field) => {
    const resolution = recovery.fields[field];
    if (!resolution) return false;
    if (resolution.status === 'needs_review') return true;
    return (
      resolution.status === 'missing' &&
      (resolution.source_clipped || resolution.reason === 'camera_crop')
    );
  }).sort((a, b) => FIELD_ORDER.indexOf(a) - FIELD_ORDER.indexOf(b));

export const blocksSave = (recovery: TicketRecovery): boolean =>
  unresolvedCritical(recovery).length > 0;

const FIELD_LABELS: Partial<Record<keyof Ticket, string>> = {
  ticket_number: 'ticket number',
  ticket_date: 'ticket date',
  customer_id: 'customer number',
  carrier_id: 'carrier number',
  vehicle_id: 'truck number',
  po_number: 'PO number',
  gross_lb: 'gross weight',
  tare_lb: 'tare weight',
  net_lb: 'net weight',
  gross_tons: 'gross tons',
  tare_tons: 'tare tons',
  net_tons: 'net tons',
  today_tons: "today's tons",
  today_loads: "today's loads",
};

const fieldLabel = (field: keyof Ticket) =>
  FIELD_LABELS[field] ?? field.replace(/_/g, ' ');

const REASON_TEXT: Record<ReviewReason, string> = {
  partial_numeric: 'part of the print was cut off',
  insufficient_evidence: 'part of the print is missing and nothing on file completes it',
  ambiguous_candidates: 'more than one value on file fits what printed',
  conflicting_evidence: 'two sources disagree',
  camera_crop: 'the sheet ran off the photograph: take the picture again',
  unsupported_proposal: 'the reader suggested a completion nothing supports',
  not_read: 'what printed could not be read as a value',
};

/**
 * The unsettled fields as lines a person can act on.
 *
 * Written the way the rest of the ticket's issues are written, because these
 * join them: what is wrong, what was actually printed, and what the workspace
 * had to offer. Recovered fields say nothing — they are settled, and the
 * evidence behind them is on the field itself for anyone who wants it.
 */
export function reviewIssues(recovery: TicketRecovery): string[] {
  const lines: string[] = [];
  for (const field of FIELD_ORDER) {
    const resolution = recovery.fields[field];
    if (!resolution || SILENT_FIELDS.has(field)) continue;
    const unsettled =
      resolution.status === 'needs_review' ||
      (resolution.status === 'missing' && resolution.source_clipped);
    if (!unsettled) continue;
    const why =
      resolution.reason !== undefined
        ? REASON_TEXT[resolution.reason]
        : 'the print ran off the sheet and nothing of it was read';
    const printed = resolution.visible_text?.trim();
    const offered = resolution.candidates?.length
      ? `; on file: ${resolution.candidates.map((value) => `"${value}"`).join(', ')}`
      : '';
    lines.push(
      `Needs confirmation: ${fieldLabel(field)} — ${why}${printed ? `; visible "${printed}"` : ''}${offered}`,
    );
  }
  return lines;
}
