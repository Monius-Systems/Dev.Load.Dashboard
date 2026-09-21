// The shape of a read ticket, shared by the server route that asks the model
// for it and the browser that turns the answer into a Ticket.
//
// Pass 1 is an OBSERVATION, not an answer. The model used to be asked what the
// ticket said, and it told us: a project printed "STR/WBERRY RD" came back
// "STRAWBERRY RD", and by the time the value reached a batch there was nothing
// left to say it had ever been damaged. A ticket number missing its last digit
// came back with a last digit, and that one went on an invoice.
//
// So the model is now asked what is on the paper — the ink, character for
// character — separately from what it makes of it, and the app decides. The
// flat `ExtractedTicket` the rest of Load Desk already works in is derived from
// that observation here, and carries a field only when the reader saw the whole
// of it: `observedToExtracted` is where the guarantee lives, so a completion
// cannot reach `ticketFromExtraction` however the prompt is worded or however
// the model behaves.
//
// Nothing here talks to the network or the DOM, so the schema, the prompt and
// the mapping onto the app's own ticket fields are all covered by tests.

import { printedNumber } from './printed-number.ts';
import { ticketDay } from './ticket-date.ts';
import type {
  ClippedEdge,
  EdgeState,
  ObservedField,
  ObservedTicket,
  PaperFrame,
} from './recovery/contract.ts';
import { emptyTicket, type Ticket } from './types.ts';

/** The model that reads the tickets. One place, so it is one edit to change. */
export const EXTRACTION_MODEL = 'gpt-5.6-luna';

/** Exactly the fields asked for, in the order they read on the ticket. */
export type ExtractedTicket = {
  company: string | null;
  bol: string | null;
  date: string | null;
  location: string | null;
  customer_number: string | null;
  customer: string | null;
  project: string | null;
  project_location: string | null;
  product_number: string | null;
  product: string | null;
  gross_weight: number | null;
  tare_weight: number | null;
  net_weight: number | null;
  net_tons: number | null;
  carrier: string | null;
};

export const EXTRACTION_FIELDS = [
  'company',
  'bol',
  'date',
  'location',
  'customer_number',
  'customer',
  'project',
  'project_location',
  'product_number',
  'product',
  'gross_weight',
  'tare_weight',
  'net_weight',
  'net_tons',
  'carrier',
] as const;

/**
 * Every field Pass 1 observes, and the app's own field each one is about.
 *
 * The keys are the words on the ticket, which is what the model is looking at;
 * the values are `Ticket`'s names, which is what everything downstream speaks.
 * Keeping the two apart in one table is what lets the observation be keyed by
 * the app's names without the prompt having to know them.
 *
 * The four past the original fifteen are the ones the vendor rules need to
 * cross-check a damaged field against the rest of the paper. The name printed
 * beside the weights is not asked for: nothing is billed on it, and it was
 * one more box the reader could get wrong.
 */
export const OBSERVED_FIELDS = {
  company: 'plant_name',
  bol: 'ticket_number',
  date: 'ticket_date',
  location: 'plant_address',
  plant_number: 'plant_code',
  customer_number: 'customer_id',
  customer: 'customer_name',
  order_number: 'order_number',
  reference_ticket: 'dispatch_number',
  project: 'project_name',
  project_location: 'project_address',
  product_number: 'product_code',
  product: 'product_description',
  gross_weight: 'gross_lb',
  tare_weight: 'tare_lb',
  net_weight: 'net_lb',
  net_tons: 'net_tons',
  carrier: 'carrier_name',
  vehicle: 'vehicle_id',
} as const satisfies Record<string, keyof Ticket>;

/** The answer keys of Pass 1, as the model is asked for them. */
export type ObservedFieldName = keyof typeof OBSERVED_FIELDS;

export const OBSERVED_FIELD_NAMES = Object.keys(OBSERVED_FIELDS) as ObservedFieldName[];

/** What each field is, in the model's own terms. Descriptions, not rules. */
const FIELD_NOTES: Record<ObservedFieldName, string> = {
  company: 'the company issuing the load ticket',
  bol: 'the BOL or ticket number',
  date: 'the ticket date, as printed',
  location: 'the issuing plant or terminal, e.g. THORNTON',
  plant_number: 'the plant or terminal code, where one is printed',
  customer_number: 'the customer number',
  customer: 'the material customer',
  order_number: 'the order, job or sales-order number, where one is printed',
  reference_ticket: 'a dispatch, reference or related ticket number, where one is printed',
  project: 'the project or job site name',
  project_location: 'the job site address, city, state and ZIP',
  product_number: 'the product code',
  product: 'the product description, e.g. IN #53',
  gross_weight: 'the gross weight, as printed, commas and units included',
  tare_weight: 'the tare weight, as printed, commas and units included',
  net_weight: 'the net weight, as printed, commas and units included',
  net_tons: 'the net tons, as printed',
  carrier: 'the trucking or transport company',
  vehicle: 'the truck, tractor or vehicle number',
};

/**
 * The fields whose print is a figure rather than a phrase, and where a model
 * that was told to answer in strings sometimes answers with a number anyway.
 * Only these tolerate a bare number as the observed print.
 */
const NUMERIC_ANSWER: ReadonlySet<ObservedFieldName> = new Set([
  'gross_weight',
  'tare_weight',
  'net_weight',
  'net_tons',
]);

/**
 * The fields nobody may finish from context: identifiers and weights, where a
 * plausible completion is indistinguishable from the real thing and lands on
 * an invoice. The prompt says so; `readObserved` makes sure of it.
 */
const GUARDED_FIELDS: ReadonlySet<keyof Ticket> = new Set<keyof Ticket>([
  'ticket_number',
  'customer_id',
  'product_code',
  'order_number',
  'dispatch_number',
  'vehicle_id',
  'plant_code',
  'gross_lb',
  'tare_lb',
  'net_lb',
  'net_tons',
]);

const CLIPPED_EDGES = ['left', 'right', 'top', 'bottom'] as const;

/**
 * A JSON Schema node. Loose on purpose: this is what goes over the wire to the
 * Responses API, not a type the app reasons in.
 */
type SchemaNode = { type: string | string[]; [key: string]: unknown };

/** One field, as the model must answer it: what is there, and what you make of it. */
const observationOf = (note: string): SchemaNode => ({
  type: 'object',
  additionalProperties: false,
  required: ['visible', 'proposed', 'clipped_edge', 'partial', 'print'],
  properties: {
    visible: {
      type: ['string', 'null'],
      description: `The ink for ${note}, exactly as printed: character for character, damage included, never completed and never corrected. Null when none of it is on the paper.`,
    },
    proposed: {
      type: ['string', 'null'],
      description: `Your own reading of ${note}, which may complete or correct the print. Null whenever you will not stand behind a completion, and always null for an identifier, a weight, a tonnage or the date with a character missing.`,
    },
    clipped_edge: {
      type: ['string', 'null'],
      enum: [...CLIPPED_EDGES, null],
      description:
        'The side the print runs off — the edge of the paper or the edge of the picture — or null when nothing of it is cut off.',
    },
    partial: {
      type: 'boolean',
      description:
        'True when characters are missing: cut off, torn away, smudged out or otherwise not on the paper.',
    },
    print: {
      type: 'string',
      enum: ['clear', 'faded'],
      description:
        'clear when every character is crisp and unambiguous. faded when any character is faint, smudged, broken, over-printed, doubled, or had to be inferred from its shape or context rather than simply read.',
    },
  },
});

const paperEdge = (side: string): SchemaNode => ({
  type: ['boolean', 'null'],
  description: `True when the ${side} edge of the physical sheet is visible in the picture, false when the sheet runs off the picture on the ${side}, null when you cannot tell.`,
});

/**
 * The structured output the model must answer with. Strict, every property
 * required at every level and nothing optional anywhere — the Responses API's
 * strict mode allows no optional keys, so "the reader had nothing to say" is
 * carried by a null rather than by an absent key. An absent key and an
 * unreadable field are different things, and only one of them is news.
 */
export const EXTRACTION_SCHEMA: {
  type: 'object';
  additionalProperties: false;
  required: string[];
  properties: Record<string, SchemaNode>;
} = {
  type: 'object',
  additionalProperties: false,
  required: [...OBSERVED_FIELD_NAMES, 'timestamps', 'branding', 'paper_edges'],
  properties: {
    ...(Object.fromEntries(
      OBSERVED_FIELD_NAMES.map((name) => [name, observationOf(FIELD_NOTES[name])]),
    ) as Record<ObservedFieldName, SchemaNode>),
    timestamps: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Every timestamp printed anywhere on the ticket, verbatim and in the order they appear ("26SEP14 12:02", "09/14/26 12:02:11"). Do not convert, reformat or interpret them. Empty when none are printed.',
    },
    branding: {
      type: ['string', 'null'],
      description: "The issuer's branding as printed: the letterhead, logo wording or form name.",
    },
    paper_edges: {
      type: 'object',
      additionalProperties: false,
      required: ['left', 'right', 'top', 'bottom'],
      description:
        'Which edges of the physical sheet are visible in the picture. This is about the paper, not about the print on it.',
      properties: {
        left: paperEdge('left'),
        right: paperEdge('right'),
        top: paperEdge('top'),
        bottom: paperEdge('bottom'),
      },
    },
  },
};

export const EXTRACTION_INSTRUCTIONS = `You are reading one construction or material load ticket from a photograph.
On this pass you OBSERVE the paper. You do not decide what the ticket says: the application decides that afterwards, from this observation and from what it already knows. Your reading is evidence, never a value.

These are real-world documents. Print fades, paper tears, dot-matrix ribbons run dry, and the printer itself often lays a line down so far across that the end of it is not on the paper at all. A value can therefore be incomplete on the sheet even when the whole sheet is in the picture, and that is worth knowing precisely.

For every field answer with four things:

visible — the ink, exactly as printed. Character for character, with the damage in it. Keep the commas, the units, the punctuation and the case as printed. Never complete it, never correct it, never tidy it. If the print reads "STR/WBERRY RD AND IN-2", visible is "STR/WBERRY RD AND IN-2". If it reads "17254464" and the next character is off the edge, visible is "17254464". Null only when none of the field is on the paper.

proposed — your own reading, separately. Here you may complete or correct what you saw: "STRAWBERRY RD AND IN-2". Leave it null whenever you would be guessing.
proposed MUST be null when any character is missing from: the BOL or ticket number, the customer number, the product number, the order number, the reference or dispatch number, any weight, the tonnage, or the date. A missing digit is never inferred, however strongly the rest of the ticket suggests one. Say what you saw and stop.

clipped_edge — 'left', 'right', 'top' or 'bottom' when the field's print runs off an edge, otherwise null. Say which edge: the application distinguishes print the printer put past the edge of the paper from print the camera cut off, and it can only do that if you say where it went.

partial — true when characters of the field are missing for any reason: clipped, torn, smudged out, or faded past reading.

print — clear when every character of the field is crisp and unambiguous; faded when any character is faint, smudged, broken, over-printed, doubled, or had to be inferred from its shape or from context rather than simply read. Be strict about this on the date, the BOL, the customer number and the weights: a reading off faded print is checked before it is billed, a reading off clear print is not.

A digit you are not certain of is a digit you cannot read. Never pick the likeliest digit: put a ? in visible where it stands — "12/1?/2025", "17253313?4", "277?0" — and set partial to true. This matters most for the date, the BOL or ticket number, the customer number and the weights: a wrong digit there bills the wrong day or the wrong load, and a ? is asked about while a wrong digit is not. Faded, smudged, broken or overprinted digits are ? digits.

Also report, once for the whole ticket:

timestamps — every timestamp printed anywhere on the sheet, verbatim and in the order they appear. Machine timestamps, weigh times, print times, all of them. Do not convert them, do not reformat them, do not work a date out of them.

branding — the issuer's branding as printed: the letterhead, the logo wording, the form name.

paper_edges — for each of left, right, top and bottom, whether that edge of the physical sheet is visible in the picture. True if you can see the edge of the paper on that side, false if the sheet runs off the picture there, null if you cannot tell. This is about the paper, not about the print.

Reading the weights: report Gross, Tare and Net each as printed, in their own field, and never work one out from the other two. A weight nobody can read is null, and three figures that do not balance are worth knowing about.
Gross - Tare = Net Weight and Net Weight / 2000 ≈ Net Tons are checks, not licence. Use them to confirm a digit you can actually see; if the arithmetic disagrees with the print, the print stands and the disagreement is reported.

Company means the company issuing the load ticket. Customer means the material customer. Carrier means the trucking or transport company. Project and Project Location are separate fields.

Ignore everything else on the ticket. Return only the requested structured data.`;

/** How much of one field's print is kept. Long enough for a job-site address. */
const MAX_FIELD_CHARS = 200;
const MAX_BRANDING_CHARS = 120;
const MAX_TIMESTAMP_CHARS = 64;
/** A ticket prints a handful of times; a list longer than this is a runaway. */
const MAX_TIMESTAMPS = 10;

/**
 * A string as it will be kept: whitespace normalised and bounded, and nothing
 * else touched. Normalising the spacing is the only liberty taken with
 * `visible`, because a photograph's line wrapping is not the paper's.
 */
const clean = (value: unknown, limit: number): string | null => {
  if (typeof value !== 'string') return null;
  const text = value.replace(/\s+/g, ' ').trim();
  if (!text || text.toLowerCase() === 'null') return null;
  return text.length > limit ? text.slice(0, limit) : text;
};

const trimmed = (value: unknown): string | null => clean(value, MAX_FIELD_CHARS);

const finite = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  // The ink as printed — "45,440", "27140 * 13.57 *" — read as the number it
  // carries (see printed-number.ts), and null for print that carries none.
  if (typeof value === 'string') return printedNumber(value);
  return null;
};

const edgeOf = (value: unknown): ClippedEdge | null =>
  typeof value === 'string' && (CLIPPED_EDGES as readonly string[]).includes(value)
    ? (value as ClippedEdge)
    : null;

/**
 * The print of one field. A weight answered as a bare number is taken as the
 * digits it is; a carrier answered as a number is not a carrier's name, and is
 * dropped the way it always was.
 */
const printOf = (value: unknown, numeric: boolean): string | null =>
  numeric && typeof value === 'number' && Number.isFinite(value)
    ? String(value)
    : trimmed(value);

/**
 * One field of the answer as an observation.
 *
 * A model still answering the old flat shape — a bare string where an object
 * is now asked for — is read as ink seen whole, which is exactly what the flat
 * answer used to mean. Anything else is an unreadable field, not a crash.
 */
function observeField(name: ObservedFieldName, value: unknown): ObservedField {
  const numeric = NUMERIC_ANSWER.has(name);
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  const visible = printOf(source ? source.visible : value, numeric);
  const clipped_edge = source ? edgeOf(source.clipped_edge) : null;
  // Print that ran off an edge is print with characters missing, whatever the
  // reader ticked. The contract has clipped_edge as one of the reasons a field
  // is partial, so the two are never allowed to contradict each other here.
  // A "?" in the print is the reader saying a character is there and cannot
  // be made out: that is print with a character missing, whatever it ticked.
  const partial =
    clipped_edge !== null ||
    (source ? source.partial === true : false) ||
    (visible !== null && visible.includes('?'));
  let proposed = source ? printOf(source.proposed, numeric) : null;
  // The prompt forbids completing an identifier or a weight. This is the same
  // rule again, in code, because a prompt is a request and this is not.
  if (partial && proposed !== visible && GUARDED_FIELDS.has(OBSERVED_FIELDS[name])) {
    proposed = null;
  }
  const faded = source ? source.print === 'faded' : false;
  return { visible, proposed, clipped_edge, partial, ...(faded ? { faded: true } : {}) };
}

const edgeStateOf = (value: unknown): EdgeState =>
  value === true ? 'inside' : value === false ? 'cut' : 'unknown';

/**
 * What the reader said about the sheet's own edges. Null when it said nothing
 * usable: an all-null answer is "I cannot tell", which is not evidence and is
 * not worth carrying beside the detector's own view of the same picture.
 */
function readPaperEdges(value: unknown): PaperFrame | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const frame = {
    left: edgeStateOf(source.left),
    right: edgeStateOf(source.right),
    top: edgeStateOf(source.top),
    bottom: edgeStateOf(source.bottom),
  };
  const said = Object.values(frame).some((state) => state !== 'unknown');
  return said ? { detected: true, ...frame } : null;
}

/** Every timestamp the reader saw, as printed, bounded in both directions. */
function readTimestamps(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const stamps: string[] = [];
  for (const item of value) {
    if (stamps.length === MAX_TIMESTAMPS) break;
    const stamp = clean(item, MAX_TIMESTAMP_CHARS);
    if (stamp) stamps.push(stamp);
  }
  return stamps;
}

/**
 * The model's answer as an observation, keyed by the app's own field names,
 * with every field present and of the right type whatever came back.
 */
export function readObserved(value: unknown): ObservedTicket {
  const source = (
    value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  ) as Record<string, unknown>;
  const fields: Partial<Record<keyof Ticket, ObservedField>> = {};
  for (const name of OBSERVED_FIELD_NAMES) {
    fields[OBSERVED_FIELDS[name]] = observeField(name, source[name]);
  }
  return {
    fields,
    timestamps: readTimestamps(source.timestamps),
    branding: clean(source.branding, MAX_BRANDING_CHARS),
    paper_edges: readPaperEdges(source.paper_edges),
  };
}

/**
 * The one gate between what was seen and what the app may act on: a field is
 * worth something here only when the reader saw the whole of it, whole and
 * uncut. Everything else is null and goes on to the recovery layer, where a
 * value has to be argued for from evidence.
 */
const whole = (field: ObservedField | undefined): string | null =>
  !field || field.partial || field.clipped_edge !== null
    ? null
    : (field.proposed ?? field.visible);

/**
 * The exact-only flat view of an observation: the fields the rest of Load Desk
 * has always been handed, carrying only what was read whole from the paper.
 *
 * This is why `ticketFromExtraction` can never be given a completion. It is not
 * a matter of how the prompt is worded — a partial or clipped field arrives
 * here as null however confidently the reader proposed something for it.
 */
export function observedToExtracted(observed: ObservedTicket): ExtractedTicket {
  const at = (name: ObservedFieldName) => whole(observed.fields[OBSERVED_FIELDS[name]]);
  return {
    company: at('company'),
    bol: at('bol'),
    date: at('date'),
    location: at('location'),
    customer_number: at('customer_number'),
    customer: at('customer'),
    project: at('project'),
    project_location: at('project_location'),
    product_number: at('product_number'),
    product: at('product'),
    gross_weight: finite(at('gross_weight')),
    tare_weight: finite(at('tare_weight')),
    net_weight: finite(at('net_weight')),
    net_tons: finite(at('net_tons')),
    carrier: at('carrier'),
  };
}

/**
 * An observation that has already been read — by the route, before it was
 * sent — taken as it is, or null for anything that is not one.
 *
 * The route answers with the observation keyed by the app's own field names,
 * not with the model's raw answer, and the two are not the same shape.
 * Running `readObserved` over the route's answer looked for the model's keys
 * on an object that has none of them and produced an observation with every
 * field null: every ticket, read perfectly on the server, arrived in the
 * browser blank. So what comes off the wire is checked for the shape of an
 * observation and taken whole, and only something that is not one — an older
 * route still answering the flat fields, a reply that is not JSON — goes
 * through the reader.
 */
export function isObservedTicket(value: unknown): value is ObservedTicket {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const source = value as Record<string, unknown>;
  const fields = source.fields;
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return false;
  if (!Array.isArray(source.timestamps)) return false;
  return Object.values(fields as Record<string, unknown>).every(
    (field) =>
      !!field &&
      typeof field === 'object' &&
      'visible' in field &&
      'partial' in field &&
      'clipped_edge' in field,
  );
}

/**
 * What the route answered with, as an observation: taken whole when it is
 * one, read as a model answer when it is not.
 */
export const observedFromWire = (value: unknown): ObservedTicket =>
  isObservedTicket(value) ? value : readObserved(value);

/**
 * The model's answer as the flat reading the app works in. Unchanged in what it
 * promises — every field present, tidied, never trusted blindly — and now
 * derived from the observation, so a field the reader could not see the whole
 * of comes back null instead of coming back finished.
 */
export const readExtracted = (value: unknown): ExtractedTicket =>
  observedToExtracted(readObserved(value));

/** Pounds as the tons printed beside them, to the hundredth. */
const tonsOf = (pounds: number | null) =>
  pounds === null ? null : Math.round((pounds / 2000) * 100) / 100;

/**
 * M/D/YYYY, M/D/YY or an ISO date, as the ISO date the app stores, and null
 * for anything that is not a day.
 *
 * The calendar check applies whichever shape the model answered in. It used to
 * be run only on the slashed dates, so a model that answered "2026-02-31" in
 * ISO had it taken at face value and the ticket went off to open a batch for
 * a day that does not exist. The ticket goes to the batch waiting for dates
 * instead, where a person reads the date off the original.
 */
export const extractedDate = (printed: string | null): string | null =>
  ticketDay(printed);

/**
 * The model's answer as one of the app's tickets. Only the fields asked for are
 * filled; everything else on a Ticket stays null and is entered in review,
 * exactly as it is for a field the reader could not make out.
 *
 * Net tons are worked out from the pounds when the model gave one and not the
 * other, and left as read when it gave both — the invoice is billed on them,
 * so a figure that came off the ticket is never quietly replaced by a sum.
 *
 * Gross and tare are carried across as read, and their tons worked out from
 * their pounds, the same way the browser's own reader does it. Nothing balances
 * them against net here: the three weights are what the paper says, and where
 * they do not add up `validateTicket` says so in review rather than a sum
 * quietly replacing whichever figure was wrong.
 */
export function ticketFromExtraction(extracted: ExtractedTicket): Ticket {
  const ticket = emptyTicket();
  ticket.plant_name = extracted.company;
  ticket.plant_address = extracted.location;
  ticket.ticket_number = extracted.bol;
  ticket.ticket_date = extractedDate(extracted.date);
  ticket.customer_id = extracted.customer_number;
  ticket.customer_name = extracted.customer;
  ticket.project_name = extracted.project;
  ticket.project_address = extracted.project_location;
  ticket.product_code = extracted.product_number;
  ticket.product_description = extracted.product;
  ticket.gross_lb = extracted.gross_weight;
  ticket.tare_lb = extracted.tare_weight;
  ticket.gross_tons = tonsOf(extracted.gross_weight);
  ticket.tare_tons = tonsOf(extracted.tare_weight);
  ticket.net_lb = extracted.net_weight;
  ticket.net_tons = extracted.net_tons ?? tonsOf(extracted.net_weight);
  ticket.carrier_name = extracted.carrier;
  return ticket;
}

/**
 * Where the model's own two figures disagree: pounds over two thousand should
 * be the tons printed beside them. Half a hundredweight of slack covers the
 * rounding on the ticket itself. The message is shown in review rather than
 * either figure being corrected, because only the paper knows which is right.
 */
export function weightDisagreement(extracted: ExtractedTicket): string | null {
  const { net_weight: pounds, net_tons: tons } = extracted;
  if (pounds === null || tons === null) return null;
  if (Math.abs(pounds / 2000 - tons) <= 0.011) return null;
  return `The ticket reads ${pounds} lb and ${tons} tons, which do not agree. Check both against the original.`;
}
