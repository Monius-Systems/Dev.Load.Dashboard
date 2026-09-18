// The shape of a read ticket, shared by the server route that asks the model
// for it and the browser that turns the answer into a Ticket.
//
// Nothing here talks to the network or the DOM, so the schema, the prompt and
// the mapping onto the app's own ticket fields are all covered by tests.

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

const text = { type: ['string', 'null'] } as const;
const number = { type: ['number', 'null'] } as const;

/**
 * The structured output the model must answer with. Strict, and every property
 * required, so a field the model cannot read comes back null rather than
 * missing — an absent key and an unreadable one are different things.
 */
export const EXTRACTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [...EXTRACTION_FIELDS],
  properties: {
    company: { ...text, description: 'The company issuing the load ticket.' },
    bol: { ...text, description: 'BOL or ticket number, digits only, never invented.' },
    date: { ...text, description: 'The ticket date as printed, e.g. 12/15/2025.' },
    location: { ...text, description: 'The issuing plant or terminal, e.g. THORNTON.' },
    customer_number: { ...text, description: 'Customer number, never invented.' },
    customer: { ...text, description: 'The material customer.' },
    project: { ...text, description: 'The project or job site name.' },
    project_location: { ...text, description: 'The job site address, city, state and ZIP.' },
    product_number: { ...text, description: 'Product code, never invented.' },
    product: { ...text, description: 'Product description, e.g. IN #53.' },
    gross_weight: {
      ...number,
      description: 'Gross weight in pounds, a number without commas.',
    },
    tare_weight: {
      ...number,
      description: 'Tare weight in pounds, a number without commas.',
    },
    net_weight: { ...number, description: 'Net weight in pounds, a number without commas.' },
    net_tons: { ...number, description: 'Net tons as a number.' },
    carrier: { ...text, description: 'The trucking or transport company.' },
  },
} as const;

export const EXTRACTION_INSTRUCTIONS = `You are an expert document extraction system for construction and material load tickets.
Examine the ticket image visually and extract the requested operational fields.
These tickets are real-world documents and may contain faded print, cropped characters, damaged text, poor lighting, skew, wrinkles, or incomplete letters.
Do not perform literal OCR only.
Use visual evidence, surrounding text, ticket structure, geographic context, common road/project naming, customer names, material descriptions, and semantic context to determine the most likely intended text.
When a word is partially damaged but the intended value is strongly supported, return the complete corrected value.
Example:
Visible:
STR/WBERRY RD AND IN-2
Return:
STRAWBERRY RD AND IN-2
Do not make aggressive guesses with numeric identifiers.
For BOL, Customer #, and Product #, if a digit cannot reasonably be determined from the image, do not invent it.
Gross Weight, Tare Weight and Net Weight must each be returned in pounds as a number without commas.
Net Tons must be returned as a numeric value.
Read Gross and Tare from the weights printed on the ticket, alongside Net.
Return each of them as printed, and do not work one out from the other two: a
weight nobody can read is null, and three figures that do not balance are worth
knowing about.
Use:
Gross - Tare = Net Weight
as supporting evidence for reading a damaged digit in any of the three.
Also use:
Net Weight / 2000 ≈ Net Tons
as a validation check.
Company means the company issuing the load ticket.
Customer means the material customer.
Carrier means the trucking/transport company.
Project and Project Location are separate fields.
Ignore all other information on the ticket.
Return only the requested structured data.`;

const trimmed = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean && clean.toLowerCase() !== 'null' ? clean : null;
};

const finite = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  // A model that answers "45,440" despite being asked not to is still usable.
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[$,\s]/g, ''));
    return Number.isFinite(parsed) && value.trim() ? parsed : null;
  }
  return null;
};

/** The model's answer, with every field present and of the right type. */
export function readExtracted(value: unknown): ExtractedTicket {
  const source = (value ?? {}) as Record<string, unknown>;
  return {
    company: trimmed(source.company),
    bol: trimmed(source.bol),
    date: trimmed(source.date),
    location: trimmed(source.location),
    customer_number: trimmed(source.customer_number),
    customer: trimmed(source.customer),
    project: trimmed(source.project),
    project_location: trimmed(source.project_location),
    product_number: trimmed(source.product_number),
    product: trimmed(source.product),
    gross_weight: finite(source.gross_weight),
    tare_weight: finite(source.tare_weight),
    net_weight: finite(source.net_weight),
    net_tons: finite(source.net_tons),
    carrier: trimmed(source.carrier),
  };
}

/** Pounds as the tons printed beside them, to the hundredth. */
const tonsOf = (pounds: number | null) =>
  pounds === null ? null : Math.round((pounds / 2000) * 100) / 100;

/** M/D/YYYY, M/D/YY or an ISO date, as the ISO date the app stores. */
export function extractedDate(printed: string | null): string | null {
  if (!printed) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(printed);
  if (iso) return printed;
  const slashed = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/.exec(printed);
  if (!slashed) return null;
  const [, month, day, year] = slashed;
  const full = year.length === 2 ? `20${year}` : year.padStart(4, '0');
  const date = `${full}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  // A date the calendar does not have is a misread, not a date.
  return Number.isNaN(Date.parse(date)) ? null : date;
}

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
