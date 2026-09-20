import type { ClientProfile, CustomerProfile, TruckProfile } from '../profiles.ts';
import { printedNumber } from '../printed-number.ts';
import { isNumberField, type SavedRecord, type Ticket } from '../types.ts';
import {
  applyRecovery,
  confirmField,
  fieldClass,
  FIELD_ORDER,
  resolveTicket,
  reviewIssues,
  UNKNOWN_FRAME,
  unresolvedCritical,
  type FieldResolution,
  type ObservedTicket,
  type PaperFrame,
  type TicketRecovery,
} from './index.ts';
import { batchEvidence, buildMemory, memoryEvidence } from './memory.ts';
import { vendorEvidence } from './vendors.ts';

// The recovery layer as the queue uses it: one call that takes a ticket as it
// was read and hands back the ticket as it stands, with the record of how it
// got there.
//
// It lives here rather than in load-desk.tsx because none of it is about the
// screen. Which evidence is gathered, in what order, and what a reviewer's
// click does to the record are decisions that can be got wrong quietly, and a
// decision worth testing does not belong inside a three-thousand-line
// component. Nothing here touches the network, a store or a clock: the caller
// hands over the workspace's records and profiles and gets the same answer
// every time for the same paper.

/** Everything one ticket's recovery is worked out from. */
export type RecoverInput = {
  /** Pass 1: the ticket as the reader saw it, damage included. */
  observed: ObservedTicket;
  /** Where the sheet's edges stood in the photograph; absent for a PDF page. */
  paper: PaperFrame | undefined;
  /** The exact-only ticket, from `ticketFromExtraction`: nothing completed. */
  extracted: Ticket;
  /** The workspace's saved tickets. Tenant-scoped by the API; passed straight in. */
  records: SavedRecord[];
  profiles: {
    customers: CustomerProfile[];
    trucks: TruckProfile[];
    clients: ClientProfile[];
  };
  /** The customer profile this ticket matched, when it matched one. */
  customer: CustomerProfile | null;
  /** The rest of the upload, for batch context. The ticket itself may be among them. */
  others?: { ticket: Ticket; observed?: ObservedTicket }[];
};

/**
 * A field as printed, whole, or nothing.
 *
 * The context a piece of evidence is tied to has to be something the paper
 * actually says, or the tie is worthless: a customer read off a half-printed
 * name would scope the workspace's memory to a customer that may not be this
 * ticket's at all.
 */
const wholeField = (observed: ObservedTicket, field: keyof Ticket): string | null => {
  const seen = observed.fields[field];
  if (!seen || seen.partial || seen.clipped_edge !== null) return null;
  const visible = seen.visible?.trim();
  return visible ? visible : null;
};

/**
 * One ticket, resolved: the value each field carries and the record of why.
 *
 * The order the evidence is gathered in is the order it is trusted in, and
 * every piece is scoped to this ticket's vendor, customer and project before
 * the resolver weighs it — the same context the memory was queried with, so
 * nothing learned on one job can be spent on another.
 */
export function recoverTicket(input: RecoverInput): {
  ticket: Ticket;
  recovery: TicketRecovery;
} {
  const { observed, extracted, records, profiles, customer, others } = input;
  const vendor = vendorEvidence(observed);
  const context = {
    vendor: vendor.vendor,
    customer: customer?.name ?? wholeField(observed, 'customer_name'),
    project: wholeField(observed, 'project_name'),
  };
  const memory = memoryEvidence(buildMemory(records, profiles), observed, context);
  const batch = batchEvidence(others ?? [], observed);
  const recovery = resolveTicket(
    observed,
    input.paper ?? UNKNOWN_FRAME,
    [...vendor.evidence, ...memory, ...batch],
    context,
  );
  return { ticket: applyRecovery(extracted, recovery), recovery };
}

/**
 * How sure the app is of a field another ticket of the same order filled in.
 *
 * The same figure the resolver gives anything that reaches its threshold, and
 * no more: a sister page is good evidence about a shared job and no evidence
 * at all about which of the two pages is the odd one out.
 */
const SAME_ORDER_CONFIDENCE = 0.75;

/**
 * What `fillFromSameOrder` did, written into the record.
 *
 * The fill has always happened and has never been visible anywhere but a
 * sentence appended to the note. It is the same kind of claim the recovery
 * layer makes about every other field — this value was not on this paper —
 * and so it belongs in the same place, where a reviewer can see it on the
 * field and an audit can find it a year later. The fill itself is untouched:
 * this only records it.
 */
export function noteSameOrderFill(
  recovery: TicketRecovery,
  filled: (keyof Ticket)[],
  fromTicket: Ticket,
  values: Partial<Ticket>,
): TicketRecovery {
  if (!filled.length) return recovery;
  const from = fromTicket.ticket_number?.trim() || 'another ticket';
  const order = fromTicket.order_number?.trim() ?? '';
  const fields = { ...recovery.fields };
  for (const field of filled) {
    const previous = recovery.fields[field];
    fields[field] = {
      status: 'recovered',
      value: values[field] ?? null,
      visible_text: previous?.visible_text ?? null,
      source: 'batch_context',
      confidence: SAME_ORDER_CONFIDENCE,
      source_clipped: false,
      clipped_edge: null,
      evidence: [
        `Filled from ticket ${from} with the same order number ${order}`,
      ],
    };
  }
  return { ...recovery, fields };
}

/** What the resolver decided about one field, or nothing to say. */
export const reviewState = (
  recovery: TicketRecovery | undefined,
  field: keyof Ticket,
): FieldResolution | null => recovery?.fields[field] ?? null;

/** The fields the photographer cut off, which no evidence may paper over. */
export const cameraCropFields = (recovery: TicketRecovery): (keyof Ticket)[] =>
  FIELD_ORDER.filter((field) => recovery.fields[field]?.reason === 'camera_crop');

/**
 * Whether leaving a field blank is a decision a reviewer may take.
 *
 * Only for the classes where blank is a real answer: a number, a code or a
 * date that is not on the paper is not there, and saying so out loud is
 * better than a save that will not go through. Prose keeps whatever fragment
 * printed, so there is nothing to leave empty.
 */
export const canLeaveEmpty = (field: keyof Ticket): boolean =>
  fieldClass(field) !== 'text';

/** The label and reason the resolver gives one unsettled field. */
const LINE = /^Needs confirmation: (.+?) — ([^;]+)/;

/**
 * The fields blocking a save, with the words the resolver uses for them.
 *
 * The labels and the reasons are the resolver's own, read back off
 * `reviewIssues` rather than kept in a second table here: two tables would
 * drift, and the sentence on the save button would then name a field
 * differently from the list of issues directly above it. `reviewIssues` walks
 * the declared field order and says one line per unsettled field, so the
 * lines pair with the fields in that same order; a field it says nothing
 * about — one the camera cut off, which blocks the save without being an
 * issue of the print — falls back to its own name.
 */
function blockingWords(recovery: TicketRecovery): { label: string; why: string }[] {
  const spoken = FIELD_ORDER.filter((field) => {
    const resolution = recovery.fields[field];
    if (!resolution) return false;
    return (
      resolution.status === 'needs_review' ||
      (resolution.status === 'missing' && resolution.source_clipped)
    );
  });
  const lines = reviewIssues(recovery);
  const said = new Map<keyof Ticket, { label: string; why: string }>();
  if (lines.length === spoken.length) {
    spoken.forEach((field, index) => {
      const parts = LINE.exec(lines[index]!);
      if (parts) said.set(field, { label: parts[1]!, why: parts[2]!.trim() });
    });
  }
  return unresolvedCritical(recovery).map(
    (field) =>
      said.get(field) ?? {
        label: field.replace(/_/g, ' '),
        why: 'the sheet ran off the photograph: take the picture again',
      },
  );
}

/** "a, b and c", the way a person would say a short list out loud. */
const spokenList = (items: string[]): string =>
  items.length <= 1
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/**
 * Why this ticket cannot be saved yet, in one sentence, naming the fields.
 *
 * Null when nothing blocks. The reasons are de-duplicated because several
 * fields off the same cut-off edge have one story between them, and a save
 * button that says the same thing three times reads as a fault in the app
 * rather than a fault on the paper.
 */
export function unresolvedMessage(recovery: TicketRecovery): string | null {
  const blocking = blockingWords(recovery);
  if (!blocking.length) return null;
  const labels = spokenList(blocking.map((item) => item.label));
  const why = spokenList([...new Set(blocking.map((item) => item.why))]);
  return `Confirm the ${labels} against the original before saving: ${why}.`;
}

/**
 * One field as a person settled it in review.
 *
 * A pass-through to `confirmField`, so the review screen has one module to
 * import and every decision a reviewer takes — accepting a candidate, typing
 * over it, leaving it empty on purpose — goes down the same road and is
 * recorded the same way.
 */
export const confirmValue = (
  recovery: TicketRecovery,
  field: keyof Ticket,
  value: string | number | null,
  how: 'accepted' | 'edited',
): TicketRecovery => confirmField(recovery, field, value, how);

/**
 * A candidate as the field's box should receive it, or null when it is not a
 * value for that field at all.
 *
 * Candidates are display text — a weight disputed by the ticket's own
 * arithmetic is listed as the print, "68,000". The box coerces a number field
 * with Number(), which makes NaN of a comma and then null of the NaN, and a
 * reviewer who accepted a weight would find it empty and marked "Left empty by
 * reviewer". So the print is reduced to its digits here, the way the resolver
 * reads a printed number, and anything that is not a number is refused rather
 * than written as nothing. Text goes through as it is.
 */
export function acceptableValue(field: keyof Ticket, candidate: string): string | null {
  const text = candidate.trim();
  if (!text) return null;
  if (!isNumberField(field)) return text;
  const value = printedNumber(text);
  return value === null ? null : String(value);
}
