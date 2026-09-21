import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EXTRACTION_FIELDS,
  EXTRACTION_INSTRUCTIONS,
  EXTRACTION_SCHEMA,
  OBSERVED_FIELDS,
  OBSERVED_FIELD_NAMES,
  extractedDate,
  isObservedTicket,
  observedFromWire,
  observedToExtracted,
  readExtracted,
  readObserved,
  ticketFromExtraction,
  weightDisagreement,
  type ExtractedTicket,
} from '../lib/load-desk/ticket-extraction.ts';
import { validateTicket } from '../lib/load-desk/validate.ts';

/** The reading of the Angelo Iafrate ticket, as the model returns it. */
const answer = (patch: Partial<ExtractedTicket> = {}): ExtractedTicket => ({
  company: 'Heidelberg Materials',
  bol: '1725335778',
  date: '1/6/2026',
  location: 'THORNTON',
  customer_number: '60350616',
  customer: 'ANGELO IAFRATE CONSTRUCTION',
  project: 'AWS 210 New Carlisle',
  project_location: 'NEW CARLISLE, IN 46552 US',
  product_number: '56001204',
  product: 'IN #53',
  gross_weight: 72360,
  tare_weight: 27740,
  net_weight: 44620,
  net_tons: 22.31,
  carrier: 'Z FORCE TRANSPORT',
  ...patch,
});

type Part = { type: string | string[]; enum?: unknown[] };
/** A schema node's types, however many of them it declares. */
const types = (part: Part) => (Array.isArray(part.type) ? part.type : [part.type]);
type Observation = {
  type: string | string[];
  additionalProperties?: unknown;
  required?: string[];
  properties?: Record<string, Part>;
};

void test('the schema asks for an observation of every field, and nothing optional', () => {
  // Strict mode allows no optional keys, so "the reader had nothing to say"
  // has to be a null rather than an absent key: an absent key and an
  // unreadable field are different things, and only one of them is news.
  assert.equal(EXTRACTION_SCHEMA.additionalProperties, false);
  assert.deepEqual(
    [...EXTRACTION_SCHEMA.required].sort(),
    [...OBSERVED_FIELD_NAMES, 'timestamps', 'branding', 'paper_edges'].sort(),
  );
  for (const name of OBSERVED_FIELD_NAMES) {
    const field = EXTRACTION_SCHEMA.properties[name] as Observation;
    assert.ok(field, `${name} is in the schema`);
    assert.equal(field.type, 'object', `${name} is observed, not answered`);
    assert.equal(field.additionalProperties, false);
    assert.deepEqual(
      [...(field.required ?? [])].sort(),
      ['clipped_edge', 'partial', 'proposed', 'visible'],
    );
    const parts = field.properties!;
    for (const part of ['visible', 'proposed', 'clipped_edge']) {
      assert.ok(types(parts[part]).includes('null'), `${name}.${part} may be null`);
    }
    assert.equal(parts.partial.type, 'boolean', `${name}.partial is always answered`);
    assert.deepEqual(parts.clipped_edge.enum, ['left', 'right', 'top', 'bottom', null]);
  }
});

void test('the fifteen fields the app already works in are all still observed', () => {
  const observed = new Set<string>(OBSERVED_FIELD_NAMES);
  for (const field of EXTRACTION_FIELDS) assert.ok(observed.has(field), field);
  // And the observation is keyed by the app's own names, not the ticket's.
  assert.equal(OBSERVED_FIELDS.bol, 'ticket_number');
  assert.equal(OBSERVED_FIELDS.customer_number, 'customer_id');
  assert.equal(OBSERVED_FIELDS.net_weight, 'net_lb');
  assert.equal(OBSERVED_FIELDS.vehicle, 'vehicle_id');
  assert.equal(OBSERVED_FIELDS.plant_number, 'plant_code');
  assert.equal(OBSERVED_FIELDS.reference_ticket, 'dispatch_number');
  // The name beside the weights is not asked for: nothing is billed on it.
  assert.equal('driver' in OBSERVED_FIELDS, false);
  assert.equal(Object.values(OBSERVED_FIELDS).includes('weighmaster' as never), false);
});

void test('the whole ticket is asked about once, not field by field', () => {
  const edges = EXTRACTION_SCHEMA.properties.paper_edges as Observation;
  assert.equal(EXTRACTION_SCHEMA.properties.timestamps.type, 'array');
  assert.deepEqual([...(edges.required ?? [])].sort(), ['bottom', 'left', 'right', 'top']);
  assert.equal(edges.additionalProperties, false);
  for (const side of ['left', 'right', 'top', 'bottom']) {
    // Not "is the print cut off" but "can you see the edge of the paper", and
    // a reader that cannot tell says so.
    assert.deepEqual(edges.properties![side].type, ['boolean', 'null']);
  }
});

void test('a reading becomes a ticket the rest of the app already understands', () => {
  const ticket = ticketFromExtraction(answer());
  assert.equal(ticket.plant_name, 'Heidelberg Materials');
  assert.equal(ticket.plant_address, 'THORNTON');
  assert.equal(ticket.ticket_number, '1725335778');
  assert.equal(ticket.ticket_date, '2026-01-06');
  assert.equal(ticket.customer_id, '60350616');
  assert.equal(ticket.customer_name, 'ANGELO IAFRATE CONSTRUCTION');
  assert.equal(ticket.project_name, 'AWS 210 New Carlisle');
  assert.equal(ticket.project_address, 'NEW CARLISLE, IN 46552 US');
  assert.equal(ticket.product_code, '56001204');
  assert.equal(ticket.product_description, 'IN #53');
  assert.equal(ticket.net_lb, 44620);
  assert.equal(ticket.net_tons, 22.31);
  assert.equal(ticket.carrier_name, 'Z FORCE TRANSPORT');
  // The weights the load is billed on: all three read off the ticket, with the
  // tons beside them worked out from the pounds as the browser's reader does.
  assert.equal(ticket.gross_lb, 72360);
  assert.equal(ticket.tare_lb, 27740);
  assert.equal(ticket.gross_tons, 36.18);
  assert.equal(ticket.tare_tons, 13.87);
  // Nothing else was asked for, so nothing else is invented.
  assert.equal(ticket.rate, null);
  assert.equal(ticket.order_number, null);
});

void test('tons are worked out from pounds only when the ticket gave none', () => {
  assert.equal(ticketFromExtraction(answer({ net_tons: null })).net_tons, 22.31);
  // A figure that came off the paper is never quietly replaced by a sum.
  assert.equal(ticketFromExtraction(answer({ net_tons: 22.29 })).net_tons, 22.29);
  assert.equal(
    ticketFromExtraction(answer({ net_weight: null, net_tons: null })).net_tons,
    null,
  );
});

void test('pounds and tons that cannot both be right are flagged, not corrected', () => {
  assert.equal(weightDisagreement(answer()), null);
  assert.equal(weightDisagreement(answer({ net_tons: 22.315 })), null, 'rounding is fine');
  const off = weightDisagreement(answer({ net_tons: 27.31 }));
  assert.ok(off && /do not agree/.test(off));
  assert.equal(weightDisagreement(answer({ net_tons: null })), null, 'one figure cannot disagree');
});

void test('dates are read as printed and stored as dates', () => {
  assert.equal(extractedDate('1/6/2026'), '2026-01-06');
  assert.equal(extractedDate('12/15/2025'), '2025-12-15');
  assert.equal(extractedDate('1/6/26'), '2026-01-06');
  assert.equal(extractedDate('2026-01-06'), '2026-01-06');
  assert.equal(extractedDate('13/45/2026'), null, 'not a date on any calendar');
  assert.equal(extractedDate('sometime Tuesday'), null);
  assert.equal(extractedDate(null), null);
  // The calendar check used to run only on the slashed dates, so a model that
  // answered in ISO had a day that does not exist taken at face value, and
  // the ticket opened a batch for it. Whichever shape the answer comes in,
  // a day the calendar has not got is a misread and the ticket goes to the
  // batch waiting for dates.
  assert.equal(extractedDate('2026-02-31'), null, 'February has no 31st in ISO either');
  assert.equal(extractedDate('2026-13-05'), null);
  assert.equal(extractedDate('2025-02-29'), null, '2025 is not a leap year');
  assert.equal(extractedDate('2024-02-29'), '2024-02-29', 'but 2024 is');
});

void test('an answer is taken as it comes and tidied, never trusted blindly', () => {
  const read = readExtracted({
    company: '  Heidelberg   Materials ',
    bol: '1725335778',
    customer: 'null',
    net_weight: '45,440',
    net_tons: 'not readable',
    carrier: 42,
  });
  assert.equal(read.company, 'Heidelberg Materials', 'spacing is normalised');
  assert.equal(read.customer, null, 'the word "null" is not a customer');
  assert.equal(read.net_weight, 45440, 'commas are dropped from a number');
  assert.equal(read.net_tons, null, 'unreadable is null, not NaN');
  assert.equal(read.carrier, null, 'a number is not a carrier name');
  assert.equal(read.project, null, 'a field the model omitted is null');
  // Every field is present whatever came back, so callers never see undefined.
  for (const field of EXTRACTION_FIELDS) assert.ok(field in read);
});

void test('a weight nobody could read stays unread, not worked out', () => {
  // The three weights are what the paper says. Filling a missing one in from
  // the other two would put a figure on the invoice that is not on the ticket,
  // and would hide the very disagreement worth looking at.
  const noTare = ticketFromExtraction(answer({ tare_weight: null }));
  assert.equal(noTare.tare_lb, null);
  assert.equal(noTare.tare_tons, null);
  assert.equal(noTare.gross_lb, 72360, 'what was read is still read');
  assert.equal(noTare.net_lb, 44620);
  const noGross = ticketFromExtraction(answer({ gross_weight: null }));
  assert.equal(noGross.gross_lb, null);
  assert.equal(noGross.gross_tons, null);
});

void test('weights that do not balance are put in front of whoever reviews it', () => {
  // Gross - Tare = Net is the ticket's own arithmetic, and the check for it was
  // already here waiting for the figures; reading gross and tare is what turns
  // it on for a scanned ticket.
  const balanced = ticketFromExtraction(answer());
  assert.equal(
    validateTicket(balanced).some((issue) => issue.includes('Weight arithmetic')),
    false,
    '72,360 - 27,740 = 44,620',
  );
  const off = ticketFromExtraction(answer({ tare_weight: 27000 }));
  const flagged = validateTicket(off).find((issue) => issue.includes('Weight arithmetic'));
  assert.ok(flagged, 'the ticket is held for review');
  assert.match(flagged, /740/, 'and says by how much');
});

void test('a weight the model wrote with commas is still a number', () => {
  const read = readExtracted({ gross_weight: '72,360', tare_weight: ' 27,740 ' });
  assert.equal(read.gross_weight, 72360);
  assert.equal(read.tare_weight, 27740);
  assert.equal(
    readExtracted({ gross_weight: 'illegible' }).gross_weight,
    null,
    'unreadable is null, not NaN',
  );
});

// ------------------------------------------------- Pass 1 as an observation

/** One field as the reader answers it now. */
const seen = (
  visible: string | null,
  patch: Partial<{ proposed: string | null; clipped_edge: string | null; partial: boolean }> = {},
) => ({ visible, proposed: null, clipped_edge: null, partial: false, ...patch });

/** The Angelo Iafrate ticket, observed whole: nothing clipped, nothing missing. */
const observation = (patch: Record<string, unknown> = {}) => ({
  company: seen('Heidelberg Materials'),
  bol: seen('1725335778'),
  date: seen('1/6/2026'),
  location: seen('THORNTON'),
  plant_number: seen('0447'),
  customer_number: seen('60350616'),
  customer: seen('ANGELO IAFRATE CONSTRUCTION'),
  order_number: seen('4500991233'),
  reference_ticket: seen(null),
  project: seen('AWS 210 New Carlisle'),
  project_location: seen('NEW CARLISLE, IN 46552 US'),
  product_number: seen('56001204'),
  product: seen('IN #53'),
  gross_weight: seen('72,360'),
  tare_weight: seen('27,740'),
  net_weight: seen('44,620'),
  net_tons: seen('22.31'),
  carrier: seen('Z FORCE TRANSPORT'),
  vehicle: seen('4417'),
  timestamps: ['26JAN06 09:14', '01/06/26 09:14:52'],
  branding: 'HEIDELBERG MATERIALS',
  paper_edges: { left: true, right: true, top: true, bottom: false },
  ...patch,
});

void test('the prompt asks what is on the paper, not what the ticket says', () => {
  // The old instructions carried a worked example of completing damaged text
  // — "Visible: STR/WBERRY RD AND IN-2 / Return: STRAWBERRY RD AND IN-2" —
  // which is exactly the behaviour the observation pass exists to take apart.
  assert.doesNotMatch(EXTRACTION_INSTRUCTIONS, /return the complete corrected value/i);
  assert.match(EXTRACTION_INSTRUCTIONS, /visible —/);
  assert.match(EXTRACTION_INSTRUCTIONS, /proposed —/);
  assert.match(EXTRACTION_INSTRUCTIONS, /proposed MUST be null/);
  assert.match(EXTRACTION_INSTRUCTIONS, /verbatim/);
});

void test('an observation is tidied and bounded, and the ink is left alone', () => {
  const read = readObserved({
    company: seen('  Heidelberg   Materials '),
    customer: { visible: 'null', proposed: 'null', clipped_edge: 'sideways', partial: 'yes' },
    project: seen('STR/WBERRY RD AND IN-2', {
      proposed: 'STRAWBERRY RD AND IN-2',
      partial: true,
    }),
    net_weight: seen(45440 as unknown as string),
    carrier: 42,
    branding: '  HEIDELBERG   MATERIALS ',
    paper_edges: { left: true, right: false, top: true, bottom: null },
  });
  assert.equal(read.fields.plant_name?.visible, 'Heidelberg Materials', 'spacing is normalised');
  // Nothing else is done to the ink: the damage in it is the point.
  assert.equal(read.fields.project_name?.visible, 'STR/WBERRY RD AND IN-2');
  assert.equal(read.fields.project_name?.proposed, 'STRAWBERRY RD AND IN-2');
  assert.equal(read.fields.customer_name?.visible, null, 'the word "null" is not a customer');
  assert.equal(read.fields.customer_name?.clipped_edge, null, 'a side that is not a side');
  assert.equal(read.fields.customer_name?.partial, false, '"yes" is not true');
  assert.equal(read.fields.net_lb?.visible, '45440', 'a weight answered as a number is digits');
  assert.equal(read.fields.carrier_name?.visible, null, 'a number is not a carrier name');
  assert.equal(read.branding, 'HEIDELBERG MATERIALS');
  assert.deepEqual(read.paper_edges, {
    detected: true, left: 'inside', right: 'cut', top: 'inside', bottom: 'unknown',
  });
  // Every field is present whatever came back, so callers never see undefined.
  for (const name of OBSERVED_FIELD_NAMES) {
    assert.ok(OBSERVED_FIELDS[name] in read.fields, name);
  }
});

void test('print that ran off an edge is print with characters missing', () => {
  const read = readObserved({
    customer: seen('ARKHAM, IL', { proposed: 'MARKHAM, IL', clipped_edge: 'left' }),
  });
  // The reader said the field was whole and also said it ran off the paper.
  // Those cannot both be true, and the safe reading is the one that wins.
  assert.equal(read.fields.customer_name?.partial, true);
  assert.equal(read.fields.customer_name?.visible, 'ARKHAM, IL');
  assert.equal(read.fields.customer_name?.proposed, 'MARKHAM, IL', 'a name may be proposed');
});

void test('a digit nobody saw is not proposed, whatever the reader answered', () => {
  // The prompt forbids it. This is the same rule in code, because a prompt is
  // a request: an identifier or a weight with a character missing carries no
  // completion out of here at all.
  const read = readObserved({
    bol: seen('17254464', { proposed: '172544641', clipped_edge: 'right', partial: true }),
    customer_number: seen('6035061', { proposed: '60350616', partial: true }),
    gross_weight: seen('72,36', { proposed: '72,360', partial: true }),
    vehicle: seen('441', { proposed: '4417', partial: true }),
    product_number: seen('5600120', { proposed: '5600120', partial: true }),
  });
  assert.equal(read.fields.ticket_number?.proposed, null);
  assert.equal(read.fields.ticket_number?.visible, '17254464', 'what was seen is still seen');
  assert.equal(read.fields.customer_id?.proposed, null);
  assert.equal(read.fields.gross_lb?.proposed, null);
  assert.equal(read.fields.vehicle_id?.proposed, null);
  // A proposal that adds nothing is not a completion and is left alone.
  assert.equal(read.fields.product_code?.proposed, '5600120');
});

void test('timestamps come back verbatim, and there are never too many of them', () => {
  const read = readObserved({
    timestamps: ['26JAN06 09:14', 7, null, '  01/06/26  09:14:52 ', ''],
  });
  assert.deepEqual(read.timestamps, ['26JAN06 09:14', '01/06/26 09:14:52']);
  // Nothing here parses them into a date; that is the vendor rules' work.
  const many = readObserved({ timestamps: Array.from({ length: 40 }, (_, i) => `09:${i}`) });
  assert.equal(many.timestamps.length, 10);
  assert.deepEqual(readObserved({ timestamps: 'noon' }).timestamps, []);
});

void test('a reader that could not tell says nothing about the paper', () => {
  assert.equal(readObserved({}).paper_edges, null);
  assert.equal(
    readObserved({ paper_edges: { left: null, right: null, top: null, bottom: null } }).paper_edges,
    null,
    'four shrugs are not evidence',
  );
  assert.equal(readObserved({ paper_edges: 'yes' }).paper_edges, null);
});

void test('an answer in the old flat shape is read as ink seen whole', () => {
  // Which is what the flat answer always meant, and is what a model that has
  // not caught up with the schema will keep sending.
  const read = readObserved({
    company: 'Heidelberg Materials',
    bol: '1725335778',
    gross_weight: 72360,
    carrier: 42,
  });
  assert.deepEqual(read.fields.plant_name, {
    visible: 'Heidelberg Materials', proposed: null, clipped_edge: null, partial: false,
  });
  assert.equal(read.fields.gross_lb?.visible, '72360');
  assert.equal(read.fields.carrier_name?.visible, null);
  assert.deepEqual(read.timestamps, []);
});

void test('garbage is an unreadable ticket, not a crash', () => {
  for (const answer of [null, undefined, 'nope', 42, [1, 2, 3]]) {
    const read = readObserved(answer);
    assert.equal(read.branding, null);
    assert.deepEqual(read.timestamps, []);
    for (const name of OBSERVED_FIELD_NAMES) {
      assert.deepEqual(read.fields[OBSERVED_FIELDS[name]], {
        visible: null, proposed: null, clipped_edge: null, partial: false,
      });
    }
  }
});

void test('the flat view carries only what was read whole off the paper', () => {
  const flat = observedToExtracted(readObserved(observation()));
  assert.equal(flat.company, 'Heidelberg Materials');
  assert.equal(flat.bol, '1725335778');
  assert.equal(flat.customer, 'ANGELO IAFRATE CONSTRUCTION');
  // Weights are strings on the paper and numbers once they are acted on.
  assert.equal(flat.gross_weight, 72360);
  assert.equal(flat.tare_weight, 27740);
  assert.equal(flat.net_weight, 44620);
  assert.equal(flat.net_tons, 22.31);
  // And it is still the shape the rest of Load Desk has always been handed.
  for (const field of EXTRACTION_FIELDS) assert.ok(field in flat);
});

void test('a partial or clipped field never reaches the flat view', () => {
  // This is the guarantee, and it is in the code rather than in the prompt:
  // ticketFromExtraction cannot be handed a completion however the reader
  // behaves, because the completion is dropped on the way past.
  const partial = observedToExtracted(
    readObserved(
      observation({
        customer: seen('ANGELO IAFRAT', { proposed: 'ANGELO IAFRATE CONSTRUCTION', partial: true }),
        net_tons: seen('22.3', { partial: true }),
      }),
    ),
  );
  assert.equal(partial.customer, null, 'a proposed completion is not a value');
  assert.equal(partial.net_tons, null);
  assert.equal(partial.bol, '1725335778', 'the rest of the ticket is untouched');

  const clipped = observedToExtracted(
    readObserved(
      observation({
        project_location: seen('NEW CARLISLE, IN 4655', { clipped_edge: 'right' }),
        bol: seen('1725335778', { clipped_edge: 'right', partial: false }),
      }),
    ),
  );
  assert.equal(clipped.project_location, null);
  assert.equal(clipped.bol, null, 'clipped is partial, and partial is not a value');

  // Whole and uncut, the reader's own reading is what stands.
  const tidied = observedToExtracted(
    readObserved(observation({ carrier: seen('Z  FORCE TRANSPORT', { proposed: 'Z FORCE TRANSPORT' }) })),
  );
  assert.equal(tidied.carrier, 'Z FORCE TRANSPORT');
});

void test('a ticket read whole still becomes the ticket it always did', () => {
  const ticket = ticketFromExtraction(observedToExtracted(readObserved(observation())));
  assert.equal(ticket.ticket_number, '1725335778');
  assert.equal(ticket.ticket_date, '2026-01-06');
  assert.equal(ticket.customer_id, '60350616');
  assert.equal(ticket.gross_lb, 72360);
  assert.equal(ticket.tare_lb, 27740);
  assert.equal(ticket.net_lb, 44620);
  assert.equal(ticket.net_tons, 22.31);
  assert.equal(ticket.gross_tons, 36.18);
  assert.equal(validateTicket(ticket).some((issue) => issue.includes('Weight arithmetic')), false);
  // The observation reaches further than the flat view does, and the fields
  // past it are the recovery layer's to use — not this mapping's to fill in.
  assert.equal(ticket.order_number, null);
  assert.equal(ticket.vehicle_id, null);
});

void test('what the route answers with is taken as the observation it already is', () => {
  // The route reads the model's answer and sends the observation on, keyed
  // by the app's own field names. Reading that a second time looked for the
  // model's keys on an object that has none of them, and every ticket — read
  // perfectly on the server — arrived in the browser with every field null.
  // This is the whole wire round trip, JSON and all.
  const raw: Record<string, unknown> = {};
  for (const name of Object.keys(EXTRACTION_SCHEMA.properties)) {
    if (name === 'timestamps') raw[name] = ['26SEP14 12:02'];
    else if (name === 'branding') raw[name] = 'Heidelberg Materials';
    else if (name === 'paper_edges') raw[name] = { left: true, right: true, top: true, bottom: null };
    else {
      raw[name] = {
        visible: name === 'bol' ? '1725335778' : name === 'net_weight' ? '44,620' : `SEEN ${name}`,
        proposed: null,
        clipped_edge: name === 'project_location' ? 'left' : null,
        partial: name === 'project_location',
      };
    }
  }
  const onServer = readObserved(raw);
  const wire = JSON.parse(
    JSON.stringify({ extracted: observedToExtracted(onServer), observed: onServer }),
  ) as { extracted: unknown; observed: unknown };
  const inBrowser = observedFromWire(wire.observed ?? wire.extracted);
  assert.deepEqual(inBrowser, onServer, 'the observation survives the wire untouched');
  assert.equal(inBrowser.fields.ticket_number?.visible, '1725335778');
  assert.equal(inBrowser.fields.project_address?.clipped_edge, 'left');
  assert.equal(inBrowser.timestamps[0], '26SEP14 12:02');
  assert.equal(observedToExtracted(inBrowser).net_weight, 44620);
  // Reading it a second time is exactly the fault this guards against.
  assert.equal(readObserved(wire.observed).fields.ticket_number?.visible, null);
});

void test('an older route answering with the flat fields alone still reads', () => {
  const flat = { bol: '1725335778', date: '1/6/2026', customer: 'ANGELO IAFRATE CONSTRUCTION' };
  const observed = observedFromWire(flat);
  assert.equal(observed.fields.ticket_number?.visible, '1725335778');
  assert.equal(observed.fields.ticket_number?.partial, false);
  assert.equal(observedToExtracted(observed).customer, 'ANGELO IAFRATE CONSTRUCTION');
  // And anything that is not an observation at all is an empty one, not a crash.
  assert.equal(isObservedTicket(null), false);
  assert.equal(isObservedTicket({ fields: 'no' }), false);
  assert.equal(observedFromWire(null).fields.ticket_number?.visible, null);
});

void test('a ? in the print is a digit the reader could not make out, and the field is partial', () => {
  const observed = readObserved({
    date: { visible: '12/1?/2025', proposed: '12/15/2025', clipped_edge: null, partial: false },
    bol: { visible: '17253313?4', proposed: '1725331394', clipped_edge: null, partial: false },
  });
  assert.equal(observed.fields.ticket_date?.partial, true, 'whatever the reader ticked');
  assert.equal(observed.fields.ticket_date?.visible, '12/1?/2025');
  assert.equal(observed.fields.ticket_number?.partial, true);
  assert.equal(observed.fields.ticket_number?.proposed, null, 'a completed number is dropped');
  const flat = observedToExtracted(observed);
  assert.equal(flat.date, null, 'never a date');
  assert.equal(flat.bol, null, 'never a number');
  assert.match(EXTRACTION_INSTRUCTIONS, /put a \? in visible/);
});
