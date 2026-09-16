import { FIELD_OCR_MARKER } from './field-ocr.ts';
import { emptyTicket, type Ticket } from './types.ts';
import { WEIGHT_TOLERANCE_LB } from './validate.ts';

// Parsers for the supported vendor layouts: Heidelberg Materials and Ontario
// Trap Rock. Browser OCR text holds a full-page pass, a table pass and
// label-anchored FIELD OCR rows (see extract.ts). Field rows win, then the
// first pass, then the table pass. Add one parser per vendor layout.

export const TABLE_OCR_MARKER = '--- TABLE OCR PASS ---';

const EDGE_NOISE = /^[\s:|*=]+|[\s:|*=]+$/g;

function search(pattern: RegExp, text: string): string | null {
  const value = pattern.exec(text)?.[1]?.replace(EDGE_NOISE, '');
  return value ? value : null;
}

/** OCR often reads 0 as O/D and 1 as I/l inside numbers. */
function digitString(value: string | null | undefined): string | null {
  if (!value) return null;
  const found = value
    .replace(/[OoDd]/g, '0')
    .replace(/[Il]/g, '1')
    .replace(/\D/g, '');
  return found || null;
}

function weight(label: string, text: string): number | null {
  const found = digitString(
    search(new RegExp(`${label}\\s*:?\\s*([0-9OoDdIl]{4,7})`, 'i'), text),
  );
  return found === null ? null : Number(found);
}

const pad2 = (value: string | number) => String(value).padStart(2, '0');

function isoDate(value: string | null): string | null {
  const match = value?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (!match) return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const year = match[3].length === 2 ? 2000 + Number(match[3]) : match[3];
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function normalizeTime(value: string | null): string | null {
  const match = value?.match(/^(\d{1,2}):(\d{2})/);
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return null;
  let hour = Number(match[1]);
  const period = value?.match(/(am|pm)/i)?.[1]?.toLowerCase();
  if (period) {
    if (hour < 1 || hour > 12) return null;
    hour = (hour % 12) + (period === 'pm' ? 12 : 0);
  }
  return `${pad2(hour)}:${match[2]}`;
}

const tons = (pounds: number | null) =>
  pounds ? Math.round((pounds / 2000) * 100) / 100 : null;

/** "NEW CARLISLE.IN 46552" -> "NEW CARLISLE, IN 46552". */
const cityStateZip = (value: string) =>
  value.replace(/([A-Za-z])\s*[.,]\s*([A-Z]{2}\s+\d{5})/g, '$1, $2');

/** Boxed-row OCR: drop leftover cell borders and normalize quotes. */
const cleanRow = (value: string) =>
  value
    .replace(/[|[\]{}_]/g, ' ')
    .replace(/[“”″]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/**
 * The job site printed between the order and P.O. lines of a Heidelberg
 * ticket: a name ("PROJECT PRESTO - New Carlisle", "2026 Markham Plant"),
 * then the street and the city line. OCR noise lines are skipped.
 */
function heidelbergSite(text: string): { name: string | null; address: string | null } {
  const lines = text.split('\n');
  const order = lines.findIndex((line) => /^\s*Order\b/i.test(line));
  if (order < 0) return { name: null, address: null };
  const block: string[] = [];
  for (const line of lines.slice(order + 1, order + 9)) {
    const value = line.replace(EDGE_NOISE, '').trim();
    if (!/[A-Za-z0-9]{2}/.test(value)) continue;
    if (/^(?:P\.?\s*O\b|Product\b|UNIT\b|Material\b|Customer\b)/i.test(value)) break;
    block.push(value);
  }
  const city = block.findIndex((line) => /[A-Za-z][ .,]*[A-Z]{2}\s+\d{5}\b/.test(line));
  // The line above the city is where the load went. Plenty of job sites have
  // no street number — they are a crossroads ("STRAWBERRY RD AND IN-2") or a
  // stretch of highway — so a leading number is only asked for when that line
  // is the *only* one above the city and could as easily be the site's name.
  const street =
    city > 0 && (city > 1 || /^\d+\s+[A-Za-z]/.test(block[city - 1]))
      ? city - 1
      : -1;
  const nameLines = street >= 0 ? block.slice(0, street) : city < 0 ? block.slice(0, 1) : [];
  const name = nameLines.join(' ').replace(/\s+-\s+/g, ' - ').trim();
  return {
    name: name || null,
    address:
      street >= 0 ? cityStateZip(`${block[street]}, ${block[city]}`) : null,
  };
}

export function parseHeidelberg(text: string): Ticket {
  text = text.replace(/\r/g, '');
  const compact = text.replace(/[ \t]+/g, ' ');
  const ticket = emptyTicket();

  ticket.plant_code = search(/Plant\s*:\s*([A-Z0-9-]+)/i, compact);
  ticket.plant_name = /Heidelberg/i.test(compact)
    ? 'Heidelberg Materials'
    : null;
  const street = /^\s*(\d{2,6})\s+(.+?\b(?:St|Ave|Rd|Dr|Blvd)\.)\s*$/m.exec(
    text,
  );
  const city = /^\s*([A-Z][A-Z .]*?)\s*,\s*([A-Z]{2})\s+(\d{5})\s*$/m.exec(text);
  if (street && city) {
    // A speck before a direction letter reads as a digit: "8S." -> "S.".
    const road = street[2].replace(/(^|\s)\d([NSEW]\.)/g, '$1$2');
    ticket.plant_address = `${street[1]} ${road}, ${city[1]}, ${city[2]} ${city[3]}`;
  }
  ticket.ticket_number = search(/\bBOL\s+([A-Z0-9-]{6,})/i, compact);
  ticket.ticket_date = isoDate(
    search(/^\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\b/m, text),
  );
  // Same-line values only: on scans an empty "Time In:" is followed by the
  // plant address, which must not be read as a time.
  ticket.time_in = normalizeTime(search(/Time\s*In\s*:[ \t]*([^\n]+)/i, text));
  ticket.time_out = normalizeTime(
    search(/Time\s*Out\s*:[ \t]*([0-9: ]+)/i, text),
  );

  // The value can print a little above or below its label, so OCR puts it on
  // the line before or after an empty "Customer:".
  const customer =
    /Customer\s*:\s*([0-9OIl]{5,})\s+([^\n]+)/i.exec(text) ??
    /^\s*([0-9OIl]{6,})\s+([A-Za-z][^\n]*)\n\s*Customer\s*:?\s*$/im.exec(text) ??
    /^\s*Customer\s*:?\s*\n\s*([0-9OIl]{6,})\s+([A-Za-z][^\n]*)$/im.exec(text);
  if (customer) {
    ticket.customer_id = digitString(customer[1]);
    ticket.customer_name = customer[2].trim();
  }
  // Scans sometimes lose the colon: "Order 6100307876". "Ordered" is not it.
  ticket.order_number = search(
    /\bOrder\b[ \t]*[:;.]?[ \t]*([A-Z0-9-]*\d[A-Z0-9-]*)/i,
    text,
  );
  const site = heidelbergSite(text);
  ticket.project_name = site.name;
  ticket.project_address =
    search(/Ship\s*To\s*:[ \t]*([^\n]+)/i, text) ?? site.address;
  ticket.po_number = search(/\bP\.[ \t]?O\.?[ \t]*[:#]?[ \t]*([^\n]+)/i, text);

  const product = /Product\s*:?\s*([A-Z0-9-]+)[ \t]*\n?[ \t]*([^\n]+)/i.exec(
    text,
  );
  if (product) {
    ticket.product_code = product[1];
    ticket.product_description = product[2].trim();
  }

  ticket.gross_lb = weight('(?:Gross|\\bross)', text);
  ticket.tare_lb = weight('(?:Tare|\\bare|\\barc)', text);
  ticket.net_lb = weight('(?:Net|\\bet)', text);
  ticket.gross_tons = tons(ticket.gross_lb);
  ticket.tare_tons = tons(ticket.tare_lb);
  ticket.net_tons = tons(ticket.net_lb);

  ticket.dispatch_number = digitString(
    search(
      /Dispatc\S*\s*:?\s*(?:Ordered\s+Loads\s*:\s*)?([0-9OIl]{5,})/i,
      text,
    ),
  );
  const loads = (label: string) => {
    const value = search(new RegExp(`${label}\\s+Loads\\s*:?[ \\t]*(\\d+)\\b`, 'i'), text);
    return value === null ? null : Number(value);
  };
  ticket.ordered_loads = loads('Ordered');
  ticket.remaining_loads = loads('Remaining');
  const today = /Today\s*:?\s*(\d+\.\d{2})\s*Loads\s*:?\s*(\d+(?:\.\d+)?)/i.exec(
    text,
  );
  if (today) {
    ticket.today_tons = Number(today[1]);
    ticket.today_loads = Number(today[2]);
  }
  ticket.delivery_status = search(
    /P\s*[/I]\s*D\s*status\s*:?\s*([^\n]+)/i,
    text,
  );
  const carrier =
    /(?:C|['`]?)arrier[ \t]*[:;]?[ \t]*([0-9OIl]+)\s+([^\n]+)/i.exec(text);
  if (carrier) {
    ticket.carrier_id = digitString(carrier[1]);
    ticket.carrier_name = carrier[2].trim();
  }
  ticket.vehicle_id = search(/Vehicle\s*:\s*([A-Z0-9-]+)/i, text);
  ticket.weighmaster = search(/Weighmaster\s*:\s*([^\n]+)/i, text)?.replace(
    /[:;.]$/,
    '',
  ) ?? null;
  ticket.other_charge = search(/Other\s*Chrg\s*:?[ \t]*([^\n]+)/i, text);
  return ticket;
}

/** Ontario Trap Rock scale tickets; quantities are never treated as load counts. */
export function parseOntario(text: string): Ticket {
  const ticket = emptyTicket();
  ticket.plant_name = 'Ontario Trap Rock';
  ticket.plant_code = search(/Location\s*#\s*:?\s*(\d+)/i, text);
  ticket.ticket_number =
    search(/Ticket\s*No\.?\s*:[ \t]*(\d+)/i, text) ??
    search(/\b(\d{6,10})\b/, text.split(/\bDate/i)[0]);
  ticket.ticket_date = isoDate(
    search(/\bDate\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i, text),
  );
  ticket.time_in = normalizeTime(
    search(/Check In\s*:?\s*(\d{1,2}:\d{2}\s*(?:am|pm)?)/i, text),
  );
  ticket.time_out = normalizeTime(
    search(/Ticket Out\s*:?\s*(\d{1,2}:\d{2}\s*(?:am|pm)?)/i, text),
  );
  const customer =
    /Customer\s*:?\s*[^\w\n]*(\d+)\s+(.+?)(?=Total Minutes|$)/im.exec(text);
  if (customer) {
    ticket.customer_id = customer[1];
    ticket.customer_name = customer[2].trim().replace(/\s+-\s+/g, ' - ');
  }
  const order = /^Order\s*:\s*(\S+)\s+([^\n]+)/im.exec(text);
  if (order) {
    ticket.order_number = order[1];
    ticket.project_name = order[2].trim();
    // The order description is the delivery site on these tickets.
    ticket.project_address = ticket.project_name;
  }
  ticket.po_number = search(
    /P\.?O\.?\s*#?\s*:\s*(.+?)(?=Dispatch Order|$)/im,
    text,
  );
  ticket.dispatch_number = search(/Dispatch Order\s*:?\s*(\d+)/i, text);
  const product =
    /Product\s*:?\s*Product Description\s*:\s*Weight\s*:\s*\n\s*(\S+)\s+(.+?)\s+(\d+\.\d+)\s+Ton/im.exec(
      text,
    );
  if (product) {
    ticket.product_code = product[1];
    ticket.product_description = product[2];
    ticket.net_tons = Number(product[3]);
  }
  ticket.vehicle_id = search(/Vehicle\s*:\s*([A-Z0-9-]+)/i, text);
  ticket.carrier_id = search(/Carrier[ \t]*[:;.]?[ \t]*(\d+)/i, text);
  ticket.carrier_name = search(
    /Broker\s*:?[ \t]*(\S+(?:[ \t]\S+)*?)(?=[ \t]+IDOT|[ \t]*$)/im,
    text,
  );
  ticket.weighmaster = search(/Weighmaster\s*:\s*([^\n]+)/i, text);
  for (const label of ['gross', 'tare', 'net'] as const) {
    ticket[`${label}_lb`] = weight(label, text);
    const printedTons = search(
      new RegExp(`${label}\\s*:?\\s*[0-9,]+\\s+(\\d+\\.\\d+)`, 'i'),
      text,
    );
    ticket[`${label}_tons`] = printedTons
      ? Number(printedTons)
      : (ticket[`${label}_tons`] ?? tons(ticket[`${label}_lb`]));
  }
  ticket.today_tons =
    Number(search(/Today Qty\s*:\s*[| ]*(\d+\.\d+)/i, text)) || null;
  ticket.today_loads =
    Number(search(/\bLoads\s*:\s*[| ]*(\d+)/i, text)) || null;
  return ticket;
}

type Layout = 'ontario' | 'heidelberg';

function fieldRows(section: string): Record<string, string> {
  const rows: Record<string, string> = {};
  for (const line of section.split('\n')) {
    const match = /^([A-Z][A-Z ]*[A-Z]):[ \t]?(.*)$/.exec(line.trim());
    if (match) rows[match[1]] = match[2].trim();
  }
  return rows;
}

function applyFieldRows(
  ticket: Ticket,
  rows: Record<string, string>,
  layout: Layout,
) {
  const row = (key: string) => (rows[key] ? cleanRow(rows[key]) : '');
  if (layout === 'ontario') {
    if (rows['PLANT ADDRESS']) {
      const address = rows['PLANT ADDRESS']
        .split('|')
        .map((part) => part.replace(/^[\s,]+|[\s,]+$/g, ''))
        .filter(Boolean)
        .join(', ');
      if (address) ticket.plant_address = address;
    }
    const product = /^(\S+)\s+(.+?)\s+(\d{1,3}\.\d{2})\s*Tons?\b/i.exec(
      row('PRODUCT ROW'),
    );
    if (product) {
      ticket.product_code = product[1];
      ticket.product_description = product[2];
    }
    const today = /(\d+\.\d{2})\D*?Loads?\W*(\d+)\b/i.exec(row('TODAY ROW'));
    if (today) {
      ticket.today_tons = Number(today[1]);
      ticket.today_loads = Number(today[2]);
    }
    const weighmaster = /Weighmaster\W*(\S.*)$/i.exec(row('WEIGHMASTER ROW'));
    if (weighmaster) ticket.weighmaster = weighmaster[1].trim();
    return;
  }
  const lastNumber = (value: string, minDigits: number) => {
    const token = value.split(' ').at(-1);
    const digits = digitString(token);
    return token && digits && digits.length >= minDigits && /^[\dOIl.]+$/.test(token)
      ? digits
      : null;
  };
  const dispatch = lastNumber(row('DISPATCH ROW'), 5);
  if (dispatch) ticket.dispatch_number = dispatch;
  const ordered = lastNumber(row('ORDERED ROW'), 1);
  if (ordered) ticket.ordered_loads = Number(ordered);
  const remaining = lastNumber(row('REMAINING ROW'), 1);
  if (remaining) ticket.remaining_loads = Number(remaining);
}

type WeightCandidate = { lb: number; tons: number | null };

function weightCandidates(label: string, text: string): WeightCandidate[] {
  const pattern = new RegExp(
    `${label}\\s*:?\\s*([0-9OoDdIl]{4,7})(?![0-9])(?:[ \\t]*\\*?[ \\t]*(\\d{1,3}\\.\\d{2}))?`,
    'gi',
  );
  const candidates: WeightCandidate[] = [];
  for (const match of text.matchAll(pattern)) {
    if ((match[1].match(/\d/g)?.length ?? 0) < 4) continue;
    const pounds = Number(digitString(match[1]));
    const printed = match[2] ? Number(match[2]) : null;
    // Printed tons are rounded to hundredths; a disagreeing pair is a misread.
    if (printed !== null && Math.abs(pounds / 2000 - printed) > 0.0051) continue;
    candidates.push({ lb: pounds, tons: printed });
  }
  return candidates;
}

/**
 * OCR passes can disagree on a digit. Pick the gross/tare/net readings that
 * balance and agree with their printed tons, preferring confirmed readings.
 */
function reconcileWeights(ticket: Ticket, text: string) {
  const gross = weightCandidates('(?:Gross|\\bross)', text);
  const tare = weightCandidates('(?:Tare|\\bare|\\barc)', text);
  const net = weightCandidates('(?:Net|\\bet)', text);
  let best: { set: WeightCandidate[]; score: number } | null = null;
  for (const g of gross) {
    for (const t of tare) {
      for (const n of net) {
        if (Math.abs(g.lb - t.lb - n.lb) > WEIGHT_TOLERANCE_LB) continue;
        const score = [g, t, n].filter((c) => c.tons !== null).length;
        if (!best || score > best.score) best = { set: [g, t, n], score };
      }
    }
  }
  if (!best) return;
  const [g, t, n] = best.set;
  ticket.gross_lb = g.lb;
  ticket.tare_lb = t.lb;
  ticket.net_lb = n.lb;
  ticket.gross_tons = g.tons ?? tons(g.lb);
  ticket.tare_tons = t.tons ?? tons(t.lb);
  ticket.net_tons = n.tons ?? tons(n.lb);
}

function detectLayout(text: string): Layout | null {
  if (/Heidelberg|\bBOL\s+\d/i.test(text)) return 'heidelberg';
  if (/Ontario Trap Rock|Location\s*#.*\d+/i.test(text)) return 'ontario';
  if (/\bBOL\b/i.test(text)) return 'heidelberg';
  return null;
}

export function parseTicket(raw: string): {
  ticket: Ticket;
  error: string | null;
} {
  const text = raw.replace(/\r/g, '');
  const layout = detectLayout(text);
  if (!layout) {
    return {
      ticket: emptyTicket(),
      error:
        'No supported ticket layout detected. Supported layouts are Ontario Trap Rock and Heidelberg Materials; enter the fields by hand.',
    };
  }
  const fieldAt = text.indexOf(FIELD_OCR_MARKER);
  const body = fieldAt >= 0 ? text.slice(0, fieldAt) : text;
  const parse = layout === 'ontario' ? parseOntario : parseHeidelberg;
  const [ticket, ...fallbacks] = body.split(TABLE_OCR_MARKER).map(parse);
  for (const fallback of fallbacks) {
    for (const key of Object.keys(ticket) as (keyof Ticket)[]) {
      if (ticket[key] === null && fallback[key] !== null) {
        Object.assign(ticket, { [key]: fallback[key] });
      }
    }
  }
  if (fieldAt >= 0) {
    applyFieldRows(
      ticket,
      fieldRows(text.slice(fieldAt + FIELD_OCR_MARKER.length)),
      layout,
    );
  }
  reconcileWeights(ticket, body);
  return { ticket, error: null };
}
