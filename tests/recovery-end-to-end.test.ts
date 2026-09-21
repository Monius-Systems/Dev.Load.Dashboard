import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  blocksSave,
  reviewIssues,
  unresolvedCritical,
  UNKNOWN_FRAME,
  type FieldResolution,
  type ObservedField,
  type ObservedTicket,
  type PaperFrame,
  type TicketRecovery,
} from '../lib/load-desk/recovery/index.ts';
import {
  confirmValue,
  noteSameOrderFill,
  recoverTicket,
  reviewState,
} from '../lib/load-desk/recovery/queue.ts';
import {
  observedToExtracted,
  readObserved,
  ticketFromExtraction,
  type ExtractedTicket,
} from '../lib/load-desk/ticket-extraction.ts';
import { parseNewRecord, parseRecovery } from '../lib/load-desk/record-input.ts';
import type { ClientProfile, CustomerProfile, TruckProfile } from '../lib/load-desk/profiles.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

// The whole recovery layer, driven the way the review screen drives it: a
// photograph's worth of observation in at one end, the ticket a person is
// shown out at the other, and nothing rendered in between.
//
// Every test here is one of the situations the product promised to handle —
// a corner the printer cut off, a sheet that ran off the picture, a customer
// this workspace has never hauled for — named after the situation rather
// than after the function it lands in, so a person arguing about behaviour
// can find the argument. The modules are the real ones throughout: the
// vendors, the workspace memory, the policy and the resolver each get their
// say, and what is asserted is what the ticket ends up carrying.

const ticketOf = (fields: Partial<Ticket>): Ticket => ({ ...emptyTicket(), ...fields });

/** The sheet whole in the picture unless a test says otherwise. */
const frame = (patch: Partial<PaperFrame> = {}): PaperFrame => ({
  detected: true,
  left: 'inside',
  right: 'inside',
  top: 'inside',
  bottom: 'inside',
  ...patch,
});

const whole = (visible: string): ObservedField => ({
  visible,
  proposed: null,
  clipped_edge: null,
  partial: false,
});

const clipped = (
  visible: string,
  edge: ObservedField['clipped_edge'] = 'left',
  proposed: string | null = null,
): ObservedField => ({ visible, proposed, clipped_edge: edge, partial: true });

const observedOf = (
  fields: ObservedTicket['fields'],
  extra: Partial<ObservedTicket> = {},
): ObservedTicket => ({
  fields,
  timestamps: [],
  branding: null,
  paper_edges: null,
  ...extra,
});

const customerProfile = (over: Partial<CustomerProfile> = {}): CustomerProfile => ({
  id: 1,
  name: 'WITECH COMPANY INC',
  ticket_customer_ids: [],
  ticket_names: [],
  addresses: [],
  flat_rate: null,
  fuel_charge: null,
  notes: '',
  created_at: '2026-01-01T00:00:00.000Z',
  ...over,
});

const noProfiles = {
  customers: [] as CustomerProfile[],
  trucks: [] as TruckProfile[],
  clients: [] as ClientProfile[],
};

const WITECH = 'WITECH COMPANY INC';
const OTHER = 'OTHER HAULER LLC';

let counter = 0;
const saved = (
  fields: Partial<Ticket>,
  extra: { reviewed?: boolean; recovery?: TicketRecovery } = {},
): SavedRecord => ({
  id: ++counter,
  saved_at: '2026-09-14T15:00:00.000Z',
  ticket: ticketOf(fields),
  invoice: {
    invoice_number: `INV-${counter}`,
    invoice_date: '2026-09-14',
    return_date: '',
    truck_number: '3211',
    bill_to: { name: 'ILLINOIS BULK CARRIER', address_lines: ['', ''], phone: '' },
  },
  source: {
    file_name: 'loads.pdf',
    sha256: 'a'.repeat(64),
    size: 10,
    type: 'application/pdf',
    kind: 'upload',
  },
  original_stored: true,
  ocr_text: '',
  customer_profile_id: null,
  truck_id: null,
  reviewed_at: extra.reviewed === false ? null : '2026-09-15T10:00:00.000Z',
  ...(extra.recovery ? { recovery: extra.recovery } : {}),
});

const resolution = (over: Partial<FieldResolution>): FieldResolution => ({
  status: 'exact',
  value: null,
  visible_text: null,
  source: 'visible',
  source_clipped: false,
  clipped_edge: null,
  confidence: 1,
  evidence: [],
  ...over,
});

/** A reviewed ticket of Witech's, of the kind this workspace files all day. */
const hauled = (over: Partial<Ticket> = {}) =>
  saved({
    plant_name: 'Heidelberg Materials',
    plant_code: 'U857',
    customer_name: WITECH,
    customer_id: '60311596',
    project_name: 'LINCOLN HIGHWAY',
    project_address: 'MARKHAM, IL',
    product_code: 'CA6',
    carrier_name: 'ILLINOIS BULK CARRIER',
    ...over,
  });

/** Everything one ticket's recovery is worked out from, with the empty defaults. */
const recover = (input: {
  observed: ObservedTicket;
  paper?: PaperFrame | undefined;
  extracted?: Ticket;
  records?: SavedRecord[];
  customers?: CustomerProfile[];
  customer?: CustomerProfile | null;
  others?: { ticket: Ticket; observed?: ObservedTicket }[];
}) =>
  recoverTicket({
    observed: input.observed,
    paper: 'paper' in input ? input.paper : frame(),
    extracted: input.extracted ?? ticketOf({}),
    records: input.records ?? [],
    profiles: { ...noProfiles, customers: input.customers ?? [] },
    customer: input.customer ?? null,
    ...(input.others ? { others: input.others } : {}),
  });

// --- a ticket with nothing wrong with it ----------------------------------

/** The model's answer for a ticket the camera caught whole, in its own shape. */
const CLEAN_ANSWER = {
  company: 'Heidelberg Materials',
  bol: '17254464',
  date: '9/14/26',
  location: 'THORNTON, IL',
  customer_number: '60311596',
  customer: WITECH,
  project: 'LINCOLN HIGHWAY',
  project_location: 'MARKHAM, IL',
  product_number: 'CA6',
  product: 'CA6 CRUSHED STONE',
  gross_weight: '72,840',
  tare_weight: '27,400',
  net_weight: '45,440',
  net_tons: '22.72',
  carrier: 'ILLINOIS BULK CARRIER',
  // The scale's own stamp. Heidelberg's date box is dot-matrix print in the
  // margin and is never taken on the reader's word alone (see `faintPrint`
  // on the vendor); on a clean sheet the stamp is there to confirm it.
  timestamps: ['26SEP14 12:02'],
};

// FAILING, and left failing on purpose: `applyRecovery` writes a date that
// was read whole back as the print — "9/14/26" — over the ISO day
// `ticketFromExtraction` had just made of it, so the one ticket in this file
// with nothing wrong with it is the one recovery changes. A date the resolver
// RECOVERS comes back as "2026-09-14" (resolveDate ends in `ticketDay`), so
// the layer disagrees with itself about the same field. See resolve.ts
// `coerce` (line 83) and `applyRecovery` (line 834).
void test('a perfect normal ticket comes out of recovery exactly as it was read', () => {
  const observed = readObserved(CLEAN_ANSWER);
  const extracted = ticketFromExtraction(observedToExtracted(observed));
  const { ticket, recovery } = recover({
    observed,
    extracted,
    records: [hauled(), hauled()],
    customers: [customerProfile({ addresses: ['MARKHAM, IL'] })],
  });
  assert.deepEqual(ticket, extracted, 'recovery changed nothing');
  for (const field of [
    'ticket_number',
    'ticket_date',
    'customer_name',
    'customer_id',
    'project_address',
    'gross_lb',
    'tare_lb',
    'net_lb',
    'net_tons',
  ] as const) {
    assert.equal(recovery.fields[field]?.status, 'exact', field);
    assert.equal(recovery.fields[field]?.confidence, 1, field);
  }
  assert.equal(blocksSave(recovery), false);
  assert.deepEqual(reviewIssues(recovery), []);
  assert.deepEqual(unresolvedCritical(recovery), []);
});

void test('the normal-ticket path never goes near recovery', () => {
  // Pass 1 read whole is Pass 0: `observedToExtracted` of an answer with
  // nothing missing is the flat reading the app has always worked in, so a
  // ticket off a clean photograph reaches `ticketFromExtraction` without the
  // recovery layer having anything to say about it.
  const flat: ExtractedTicket = {
    company: 'Heidelberg Materials',
    bol: '17254464',
    date: '9/14/26',
    // Not on this fixture's answer: read as nothing, never worked out.
    time_in: null,
    time_out: null,
    location: 'THORNTON, IL',
    customer_number: '60311596',
    customer: WITECH,
    project: 'LINCOLN HIGHWAY',
    project_location: 'MARKHAM, IL',
    product_number: 'CA6',
    product: 'CA6 CRUSHED STONE',
    gross_weight: 72840,
    tare_weight: 27400,
    net_weight: 45440,
    net_tons: 22.72,
    carrier: 'ILLINOIS BULK CARRIER',
  };
  assert.deepEqual(observedToExtracted(readObserved(CLEAN_ANSWER)), flat);
});

// --- print the printer cut off, one edge at a time ------------------------

const clippedLocation = (edge: ObservedField['clipped_edge'], visible: string) =>
  recover({
    observed: observedOf({
      customer_name: whole(WITECH),
      project_address: clipped(visible, edge),
    }),
    extracted: ticketOf({ customer_name: WITECH }),
    customers: [customerProfile({ addresses: ['MARKHAM, IL'] })],
  });

void test('left printing clipped is completed from what the workspace has on file', () => {
  const { ticket, recovery } = clippedLocation('left', 'ARKHAM, IL');
  const settled = reviewState(recovery, 'project_address');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, 'MARKHAM, IL');
  assert.equal(settled?.visible_text, 'ARKHAM, IL', 'the print is kept beside it');
  assert.equal(settled?.source, 'verified_profile');
  assert.equal(settled?.source_clipped, true);
  assert.equal(ticket.project_address, 'MARKHAM, IL');
});

void test('right printing clipped is completed from the start of the print', () => {
  const { ticket, recovery } = clippedLocation('right', 'MARKHAM');
  const settled = reviewState(recovery, 'project_address');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, 'MARKHAM, IL');
  assert.equal(settled?.clipped_edge, 'right');
  assert.equal(ticket.project_address, 'MARKHAM, IL');
});

void test('top clipped print is completed from a run of ink inside the value', () => {
  const { ticket, recovery } = clippedLocation('top', 'ARKHAM, I');
  const settled = reviewState(recovery, 'project_address');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, 'MARKHAM, IL');
  assert.equal(settled?.clipped_edge, 'top');
  assert.equal(ticket.project_address, 'MARKHAM, IL');
});

void test('bottom clipped print is completed from a run of ink inside the value', () => {
  const { ticket, recovery } = clippedLocation('bottom', 'MARKHAM');
  const settled = reviewState(recovery, 'project_address');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, 'MARKHAM, IL');
  assert.equal(settled?.clipped_edge, 'bottom');
  assert.equal(ticket.project_address, 'MARKHAM, IL');
});

// --- the camera, as distinct from the printer -----------------------------

void test('a camera crop missing the paper is a retake, and nothing is recovered', () => {
  const { ticket, recovery } = recover({
    observed: observedOf({
      customer_name: whole(WITECH),
      project_address: clipped('ARKHAM, IL'),
    }),
    paper: frame({ left: 'cut' }),
    extracted: ticketOf({ customer_name: WITECH }),
    customers: [customerProfile({ addresses: ['MARKHAM, IL'] })],
  });
  const settled = reviewState(recovery, 'project_address');
  // The job site is never a question, camera crop or not: the one saved
  // site the fragment fits is taken (see SILENT_FIELDS). A number or a
  // weight cut off by the camera is still a retake — see the tests below.
  assert.equal(settled?.status, 'recovered');
  assert.equal(ticket.project_address, 'MARKHAM, IL');
  assert.ok(settled?.evidence.some((line) => line.includes('runs off the left')));
});

void test('a paper edge inside the picture makes the missing print the printer’s doing', () => {
  // A job site on file is that customer's, so the ticket has to be theirs
  // for it to count: the matched profile goes in beside the observation.
  const profile = customerProfile({ addresses: ['MARKHAM, IL'] });
  const { recovery } = recover({
    observed: observedOf({ project_address: clipped('ARKHAM, IL') }),
    paper: frame({ left: 'inside' }),
    customers: [profile],
    customer: profile,
  });
  const settled = reviewState(recovery, 'project_address');
  assert.equal(settled?.source_clipped, true);
  assert.equal(settled?.status, 'recovered');
  assert.equal(
    settled?.evidence.some((line) => line.includes('No sheet edge was found')),
    false,
    'the frame was confirmed, so nothing says otherwise',
  );
});

// --- fields half printed --------------------------------------------------

void test('a partial customer name is completed from the customer on file', () => {
  const { ticket, recovery } = recover({
    observed: observedOf({ customer_name: clipped('ITECH COMPANY INC') }),
    customers: [customerProfile()],
  });
  const settled = reviewState(recovery, 'customer_name');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, WITECH);
  assert.equal(settled?.source, 'verified_profile');
  assert.equal(ticket.customer_name, WITECH);
  assert.equal(blocksSave(recovery), false);
});

void test('a partial project location is completed from the customer’s job sites', () => {
  const customer = customerProfile({ addresses: ['MARKHAM, IL'] });
  const { ticket, recovery } = recover({
    observed: observedOf({
      customer_name: whole(WITECH),
      project_address: clipped('ARKHAM, IL'),
    }),
    extracted: ticketOf({ customer_name: WITECH }),
    records: [hauled(), hauled()],
    customers: [customer],
    customer,
  });
  assert.equal(reviewState(recovery, 'project_address')?.status, 'recovered');
  assert.equal(ticket.project_address, 'MARKHAM, IL');
});

void test('a partially missing date with a redundant timestamp is recovered', () => {
  const { ticket, recovery } = recover({
    observed: observedOf(
      { ticket_date: clipped('9/14', 'right') },
      { branding: 'Heidelberg Materials', timestamps: ['26SEP14 12:02'] },
    ),
  });
  const settled = reviewState(recovery, 'ticket_date');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, '2026-09-14', 'year first, as the scale prints it');
  assert.equal(settled?.source, 'vendor_rule');
  assert.equal(ticket.ticket_date, '2026-09-14');
  assert.equal(blocksSave(recovery), false);
});

void test('a partially missing date with no evidence waits for a person', () => {
  const { ticket, recovery } = recover({
    observed: observedOf({ ticket_date: clipped('9/14', 'right') }),
  });
  const settled = reviewState(recovery, 'ticket_date');
  assert.equal(settled?.status, 'needs_review');
  assert.equal(settled?.reason, 'insufficient_evidence');
  // A half-read date is never left sitting in the date box looking like a day.
  assert.equal(ticket.ticket_date, null);
  assert.equal(blocksSave(recovery), true);
});

void test('an incomplete BOL is left empty and blocks the save', () => {
  const { ticket, recovery } = recover({
    observed: observedOf({ ticket_number: clipped('254464', 'left', '17254464') }),
    records: [hauled(), hauled()],
  });
  const settled = reviewState(recovery, 'ticket_number');
  assert.equal(settled?.status, 'needs_review');
  assert.equal(settled?.value, null);
  assert.equal(settled?.reason, 'partial_numeric');
  assert.equal(ticket.ticket_number, null, 'a digit short is a different ticket');
  assert.equal(blocksSave(recovery), true);
  assert.deepEqual(unresolvedCritical(recovery), ['ticket_number']);
});

void test('an incomplete customer number is never completed from history', () => {
  const { ticket, recovery } = recover({
    observed: observedOf({
      customer_name: whole(WITECH),
      customer_id: clipped('11596'),
    }),
    extracted: ticketOf({ customer_name: WITECH }),
    records: [hauled(), hauled(), hauled(), hauled()],
  });
  const settled = reviewState(recovery, 'customer_id');
  assert.equal(settled?.status, 'needs_review');
  assert.equal(settled?.reason, 'partial_numeric');
  assert.equal(ticket.customer_id, null);
  // The number the workspace knows is offered for a click, not adopted.
  assert.deepEqual(settled?.candidates, ['60311596']);
  assert.equal(blocksSave(recovery), true);
});

void test('an incomplete weight is completed by the ticket’s own arithmetic, or not at all', () => {
  const withBoth = recover({
    observed: observedOf({
      gross_lb: whole('72,840'),
      tare_lb: whole('27,400'),
      net_lb: clipped('45,4', 'right'),
    }),
    extracted: ticketOf({ gross_lb: 72840, tare_lb: 27400 }),
  });
  const derived = reviewState(withBoth.recovery, 'net_lb');
  assert.equal(derived?.status, 'recovered');
  assert.equal(derived?.value, 45440);
  assert.equal(derived?.source, 'same_ticket');
  assert.equal(withBoth.ticket.net_lb, 45440);
  assert.equal(blocksSave(withBoth.recovery), false);

  const alone = recover({ observed: observedOf({ net_lb: clipped('45,4', 'right') }) });
  const unsettled = reviewState(alone.recovery, 'net_lb');
  assert.equal(unsettled?.status, 'needs_review');
  assert.equal(unsettled?.reason, 'partial_numeric');
  assert.equal(alone.ticket.net_lb, null, 'never a number that was not weighed');
  assert.equal(blocksSave(alone.recovery), true);
});

// --- choosing between what the workspace knows ----------------------------

void test('multiple plausible historical matches come back ambiguous', () => {
  const { ticket, recovery } = recover({
    observed: observedOf({
      customer_name: whole(WITECH),
      project_address: clipped('PARK, IL'),
    }),
    extracted: ticketOf({ customer_name: WITECH }),
    customers: [customerProfile({ addresses: ['NORTH PARK, IL', 'SOUTH PARK, IL'] })],
  });
  const settled = reviewState(recovery, 'project_address');
  // Two fit alike: neither is picked, the print stands, both are listed.
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.source, 'visible');
  assert.equal(settled?.reason, 'ambiguous_candidates');
  assert.deepEqual(settled?.candidates, ['NORTH PARK, IL', 'SOUTH PARK, IL']);
  assert.equal(ticket.project_address, 'PARK, IL', 'the print, never a pick between two');
});

void test('a clear verified historical match is recovered', () => {
  // The same fragment as the ambiguous case, with one value on file instead
  // of two: nothing else fits, and the workspace has hauled there for years.
  const { ticket, recovery } = recover({
    observed: observedOf({
      customer_name: whole(WITECH),
      project_address: clipped('PARK, IL'),
    }),
    extracted: ticketOf({ customer_name: WITECH }),
    records: [
      hauled({ project_address: 'NORTH PARK, IL' }),
      hauled({ project_address: 'NORTH PARK, IL' }),
    ],
    customers: [customerProfile({ addresses: ['NORTH PARK, IL'] })],
  });
  const settled = reviewState(recovery, 'project_address');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, 'NORTH PARK, IL');
  assert.equal(settled?.source, 'verified_profile');
  assert.ok(settled!.confidence < 1, 'never as sure as ink');
  assert.equal(ticket.project_address, 'NORTH PARK, IL');
});

void test('conflicting evidence stops a date that was read whole', () => {
  const { ticket, recovery } = recover({
    observed: observedOf(
      { ticket_date: whole('9/25/26') },
      { branding: 'Heidelberg Materials', timestamps: ['26SEP14 12:02'] },
    ),
    extracted: ticketOf({ ticket_date: '2026-09-25' }),
  });
  const settled = reviewState(recovery, 'ticket_date');
  assert.equal(settled?.status, 'needs_review');
  assert.equal(settled?.reason, 'conflicting_evidence');
  assert.deepEqual(settled?.candidates, ['2026-09-14', '9/25/26']);
  assert.equal(ticket.ticket_date, null, 'no day at all until somebody picks one');
  assert.equal(blocksSave(recovery), true);
  // One digit away, on a date box the layout knows is faint print, is that
  // digit misread: the scale's stamp dates the load, the print is kept.
  const misread = recover({
    observed: observedOf(
      { ticket_date: whole('9/15/26') },
      { branding: 'Heidelberg Materials', timestamps: ['26SEP14 12:02'] },
    ),
    extracted: ticketOf({ ticket_date: '2026-09-15' }),
  });
  assert.equal(reviewState(misread.recovery, 'ticket_date')?.status, 'recovered');
  assert.equal(misread.ticket.ticket_date, '2026-09-14');
});

// --- a pile of tickets on the desk ----------------------------------------

void test('different jobs in one scan batch do not fill each other in', () => {
  const sister = {
    ticket: ticketOf({ project_address: 'MARKHAM, IL', order_number: '884120' }),
    observed: observedOf({
      project_address: whole('MARKHAM, IL'),
      order_number: whole('884120'),
    }),
  };
  // A field this ticket shows whole: the paper in hand outranks the paper
  // beside it, whatever the sister page reads.
  const readWhole = observedOf({
    project_address: whole('JOLIET, IL'),
    order_number: whole('884120'),
  });
  const kept = recover({
    observed: readWhole,
    extracted: ticketOf({ project_address: 'JOLIET, IL', order_number: '884120' }),
    others: [sister, { ticket: ticketOf({}), observed: readWhole }],
  });
  assert.equal(kept.ticket.project_address, 'JOLIET, IL');
  assert.equal(reviewState(kept.recovery, 'project_address')?.status, 'exact');

  // And a fragment is not recovered on the sister's say-so either: "the
  // ticket before it in the pile said so" is how a whole upload comes to
  // share one wrong job site.
  const half = observedOf({
    project_address: clipped('ARKHAM, IL'),
    order_number: whole('884120'),
  });
  const waiting = recover({
    observed: half,
    extracted: ticketOf({ order_number: '884120' }),
    others: [sister, { ticket: ticketOf({}), observed: half }],
  });
  const settled = reviewState(waiting.recovery, 'project_address');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.source, 'visible');
  assert.equal(waiting.ticket.project_address, 'ARKHAM, IL', 'the print, not the sister');
  assert.equal(settled?.reason, 'insufficient_evidence');
  assert.deepEqual(settled?.candidates, ['MARKHAM, IL']);
});

void test('multiple tickets from the same job record the fill they came from', () => {
  const { recovery } = recover({
    observed: observedOf({ order_number: whole('884120') }),
    extracted: ticketOf({ order_number: '884120' }),
  });
  const noted = noteSameOrderFill(
    recovery,
    ['customer_name', 'project_address'],
    ticketOf({ ticket_number: '17254464', order_number: '884120' }),
    { customer_name: WITECH, project_address: 'MARKHAM, IL' },
  );
  const filled = reviewState(noted, 'project_address');
  assert.equal(filled?.status, 'recovered');
  assert.equal(filled?.value, 'MARKHAM, IL');
  assert.equal(filled?.source, 'batch_context');
  assert.deepEqual(filled?.evidence, [
    'Filled from ticket 17254464 with the same order number 884120',
  ]);
  assert.equal(reviewState(noted, 'order_number')?.status, 'exact', 'untouched');
});

// --- a customer nobody has hauled for -------------------------------------

// FAILING, and left failing on purpose: a job site saved on one customer's
// profile is offered for every customer's ticket. `memoryEvidence` emits the
// value-on-file evidence with no `context` (memory.ts line 460), although
// `VerifiedValue` collects the `customers` and `projects` it was seen with
// (memory.ts lines 44-45) and nothing ever reads them. Being verified_profile
// and strong, it clears the threshold by itself, so a stranger's clipped
// address is completed with somebody else's yard.
void test('an unknown customer gets nothing from another customer’s record', () => {
  const stranger = customerProfile({ id: 1, name: OTHER, addresses: ['JOLIET, IL'] });
  const known = customerProfile({ id: 2, name: WITECH, addresses: ['MARKHAM, IL'] });
  const { ticket, recovery } = recover({
    observed: observedOf({
      customer_name: whole(OTHER),
      project_address: clipped('ARKHAM, IL'),
    }),
    extracted: ticketOf({ customer_name: OTHER }),
    records: [hauled(), hauled(), hauled()],
    customers: [stranger, known],
    customer: stranger,
  });
  const settled = reviewState(recovery, 'project_address');
  // Witech hauls to Markham. This ticket is not Witech's, so the pairing is
  // tied to a customer it does not match and never reaches the resolver.
  assert.equal(
    settled?.evidence.some((line) => line.includes('hauled to')),
    false,
    'no relationship evidence for a customer with no relationships',
  );
  // Nor is a job site somebody saved on Witech's profile: a place another
  // customer's loads go to says nothing about where this one went.
  assert.equal(settled?.source, 'visible');
  assert.equal(ticket.project_address, 'ARKHAM, IL');
});

// --- Heidelberg's own paper -----------------------------------------------

void test('Heidelberg clipped date is completed by the machine stamp', () => {
  const { ticket, recovery } = recover({
    observed: observedOf(
      { ticket_date: clipped('/14/26', 'left') },
      { branding: 'Heidelberg Materials', timestamps: ['26SEP14 12:02'] },
    ),
  });
  assert.equal(recovery.vendor, 'heidelberg');
  const settled = reviewState(recovery, 'ticket_date');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, '2026-09-14');
  assert.equal(ticket.ticket_date, '2026-09-14');
});

void test('Heidelberg clipped location is completed from the plant line', () => {
  const { ticket, recovery } = recover({
    observed: observedOf(
      { plant_code: whole('U857'), plant_name: clipped('idelberg Materials') },
      { branding: 'Heidelberg Materials' },
    ),
    records: [hauled(), hauled(), hauled()],
  });
  const settled = reviewState(recovery, 'plant_name');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, 'Heidelberg Materials');
  // The vendor's rule and three reviewed tickets agree; whichever leads, the
  // layout's own word is on the record.
  assert.ok(['vendor_rule', 'verified_history'].includes(settled?.source ?? ''));
  assert.ok(settled?.evidence.some((line) => /Branding reads Heidelberg/.test(line)));
  assert.equal(ticket.plant_name, 'Heidelberg Materials');
});

void test('Heidelberg timestamp recovery dates a ticket whose date box was lost', () => {
  const { ticket, recovery } = recover({
    observed: observedOf(
      { ticket_date: clipped('', 'left') },
      { branding: 'Heidelberg Materials', timestamps: ['26SEP14 12:02'] },
    ),
  });
  const settled = reviewState(recovery, 'ticket_date');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, '2026-09-14');
  assert.equal(settled?.source, 'vendor_rule');
  assert.ok(
    settled?.evidence.some((line) => line.includes('Machine timestamp 26SEP14 12:02')),
  );
  assert.equal(ticket.ticket_date, '2026-09-14');
});

void test('Heidelberg historical location support completes a clipped job site', () => {
  const customer = customerProfile({ addresses: ['MARKHAM, IL'] });
  const { ticket, recovery } = recover({
    observed: observedOf(
      { customer_name: whole(WITECH), project_address: clipped('ARKHAM, IL') },
      { branding: 'Heidelberg Materials' },
    ),
    extracted: ticketOf({ customer_name: WITECH }),
    records: [hauled(), hauled()],
    customers: [customer],
    customer,
  });
  assert.equal(recovery.vendor, 'heidelberg');
  const settled = reviewState(recovery, 'project_address');
  // The vendor's layout says nothing about a job site; the workspace does.
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.source, 'verified_profile');
  assert.equal(ticket.project_address, 'MARKHAM, IL');
});

void test('Heidelberg conflicting evidence from two stamps waits for a person', () => {
  const { ticket, recovery } = recover({
    observed: observedOf(
      { ticket_date: clipped('', 'left') },
      {
        branding: 'Heidelberg Materials',
        timestamps: ['26SEP14 12:02', '26SEP15 07:41'],
      },
    ),
  });
  const settled = reviewState(recovery, 'ticket_date');
  assert.equal(settled?.status, 'needs_review');
  assert.equal(settled?.reason, 'conflicting_evidence');
  assert.deepEqual(settled?.candidates, ['2026-09-14', '2026-09-15']);
  assert.equal(ticket.ticket_date, null);
});

// --- paper nobody recognises ----------------------------------------------

void test('an unknown vendor falls back to what any scale ticket says twice', () => {
  const { ticket, recovery } = recover({
    observed: observedOf(
      {
        ticket_date: clipped('9/14', 'right'),
        gross_lb: whole('72,840'),
        tare_lb: whole('27,400'),
        net_lb: clipped('45,4', 'right'),
      },
      { branding: 'Acme Aggregates', timestamps: ['26SEP14 12:02'] },
    ),
    extracted: ticketOf({ gross_lb: 72840, tare_lb: 27400 }),
  });
  assert.equal(recovery.vendor, null, 'no vendor is guessed');
  // "26SEP14" is only a date under Heidelberg's layout, and this is not one.
  const date = reviewState(recovery, 'ticket_date');
  assert.equal(date?.status, 'needs_review');
  assert.equal(ticket.ticket_date, null);
  // The arithmetic every scale ticket carries still works.
  assert.equal(reviewState(recovery, 'net_lb')?.status, 'recovered');
  assert.equal(ticket.net_lb, 45440);
});

void test('multiple vendors in one session are each read under their own rules', () => {
  const heidelberg = recover({
    observed: observedOf(
      { ticket_date: clipped('', 'left') },
      { branding: 'Heidelberg Materials', timestamps: ['26SEP14 12:02'] },
    ),
  });
  const unknown = recover({
    observed: observedOf(
      { ticket_date: clipped('', 'left') },
      { branding: 'Acme Aggregates', timestamps: ['26SEP14 12:02'] },
    ),
  });
  assert.equal(heidelberg.recovery.vendor, 'heidelberg');
  assert.equal(unknown.recovery.vendor, null);
  assert.equal(heidelberg.ticket.ticket_date, '2026-09-14');
  assert.equal(unknown.ticket.ticket_date, null);
  assert.equal(reviewState(unknown.recovery, 'ticket_date')?.status, 'needs_review');
});

// --- what the reader suggests ---------------------------------------------

void test('an unsupported numeric reconstruction by the reader is dropped', () => {
  const { ticket, recovery } = recover({
    observed: observedOf({ net_lb: clipped('45,4', 'right', '45440') }),
  });
  const settled = reviewState(recovery, 'net_lb');
  assert.equal(settled?.status, 'needs_review');
  assert.equal(settled?.reason, 'partial_numeric');
  assert.equal(settled?.value, null);
  assert.equal(ticket.net_lb, null);
  assert.ok(
    settled?.evidence.some((line) =>
      line.includes('The reader proposed "45440", which nothing on the ticket or on file supports.'),
    ),
  );
});

void test('a text reconstruction with insufficient evidence is not taken', () => {
  const { ticket, recovery } = recover({
    observed: observedOf({
      project_name: clipped('NCOLN HIGHWAY', 'left', 'LINCOLN HIGHWAY'),
    }),
  });
  const settled = reviewState(recovery, 'project_name');
  assert.equal(settled?.source, 'visible');
  assert.equal(settled?.reason, 'unsupported_proposal');
  assert.equal(ticket.project_name, 'NCOLN HIGHWAY', 'the print, not the guess');
});

// --- what a person taught the app -----------------------------------------

/** A reviewed ticket where somebody typed the job site over a clipped reading. */
const corrected = (customer: string) =>
  saved(
    { customer_name: customer, project_address: 'MARKHAM, IL' },
    {
      recovery: {
        version: 1,
        vendor: null,
        paper: UNKNOWN_FRAME,
        fields: {
          project_address: resolution({
            status: 'confirmed',
            value: 'MARKHAM, IL',
            visible_text: 'ARKHAM, IL',
            source: 'user_confirmed',
            clipped_edge: 'left',
            confirmed_by_user: true,
            evidence: ['A reviewer typed "MARKHAM, IL" for this field.'],
          }),
        },
      },
    },
  );

void test('a confirmed user correction is reused in the context it was made in', () => {
  const { ticket, recovery } = recover({
    observed: observedOf({
      customer_name: whole(WITECH),
      project_address: clipped('ARKHAM, IL'),
    }),
    extracted: ticketOf({ customer_name: WITECH }),
    records: [corrected(WITECH)],
  });
  const settled = reviewState(recovery, 'project_address');
  assert.equal(settled?.status, 'recovered');
  assert.equal(settled?.value, 'MARKHAM, IL');
  assert.equal(settled?.source, 'user_correction');
  assert.ok(
    settled?.evidence.some((line) => line.includes('for this customer')),
    'the reviewer is told whose correction this was',
  );
  assert.equal(ticket.project_address, 'MARKHAM, IL');
});

void test('a correction is not reused outside the context it was made in', () => {
  const { ticket, recovery } = recover({
    observed: observedOf({
      customer_name: whole(OTHER),
      project_address: clipped('ARKHAM, IL'),
    }),
    extracted: ticketOf({ customer_name: OTHER }),
    records: [corrected(WITECH)],
  });
  const settled = reviewState(recovery, 'project_address');
  assert.equal(settled?.source, 'visible');
  assert.equal(
    settled?.evidence.some((line) => line.includes('You corrected')),
    false,
    'another customer’s correction is not evidence about this ticket',
  );
  assert.equal(ticket.project_address, 'ARKHAM, IL');
});

void test('one workspace’s history is nothing to another workspace', () => {
  // The same clipped print, resolved against two workspaces' records. Memory
  // is built from exactly what the caller passes, so a workspace that never
  // hauled to Markham is never told about it.
  const theirs = [
    hauled({ project_address: 'MARKHAM, IL' }),
    hauled({ project_address: 'MARKHAM, IL' }),
  ];
  const ours = [hauled({ project_address: 'JOLIET, IL', customer_name: OTHER })];
  const observed = () =>
    observedOf({
      customer_name: whole(WITECH),
      project_address: clipped('ARKHAM, IL'),
    });
  const withTheirs = recover({
    observed: observed(),
    extracted: ticketOf({ customer_name: WITECH }),
    records: theirs,
    customers: [customerProfile({ addresses: ['MARKHAM, IL'] })],
  });
  assert.equal(reviewState(withTheirs.recovery, 'project_address')?.status, 'recovered');

  const withOurs = recover({
    observed: observed(),
    extracted: ticketOf({ customer_name: WITECH }),
    records: ours,
  });
  const settled = reviewState(withOurs.recovery, 'project_address');
  assert.equal(settled?.source, 'visible');
  assert.deepEqual(settled?.candidates, undefined);
  assert.equal(withOurs.ticket.project_address, 'ARKHAM, IL');
});

// --- the record that travels with the ticket ------------------------------

/** A saved record's worth of everything but the recovery under test. */
const newRecordBody = (recovery: TicketRecovery, ticket: Ticket) => ({
  saved_at: '2026-09-14T15:00:00.000Z',
  ticket,
  recovery,
  invoice: {
    invoice_number: '2271',
    invoice_date: '2026-09-14',
    return_date: '',
    truck_number: '3211',
    bill_to: { name: 'ILLINOIS BULK CARRIER', address_lines: ['', ''], phone: '' },
  },
  source: {
    file_name: 'loads.pdf',
    sha256: 'a'.repeat(64),
    size: 10,
    type: 'application/pdf',
    kind: 'upload',
  },
  original_stored: true,
  ocr_text: '',
  customer_profile_id: null,
  truck_id: null,
  invoice_batch_id: '2026-09-14',
  reviewed_at: null,
});

void test('a recovery survives the save it is sent through, character for character', () => {
  const { ticket, recovery } = recover({
    observed: observedOf(
      {
        customer_name: whole(WITECH),
        project_address: clipped('ARKHAM, IL'),
        ticket_number: clipped('254464', 'left', '17254464'),
        gross_lb: whole('72,840'),
        tare_lb: whole('27,400'),
        net_lb: clipped('45,4', 'right'),
        ticket_date: clipped('', 'left'),
      },
      { branding: 'Heidelberg Materials', timestamps: ['26SEP14 12:02'] },
    ),
    extracted: ticketOf({ customer_name: WITECH, gross_lb: 72840, tare_lb: 27400 }),
    records: [hauled(), hauled()],
    customers: [customerProfile({ addresses: ['MARKHAM, IL'] })],
  });
  // Through JSON, the way the browser sends it to the API.
  const sent = JSON.parse(JSON.stringify(newRecordBody(recovery, ticket))) as unknown;
  const parsed = parseNewRecord(sent);
  assert.ok(!('error' in parsed), 'error' in parsed ? parsed.error : '');
  assert.equal(
    JSON.stringify((parsed as { value: { recovery?: TicketRecovery } }).value.recovery),
    JSON.stringify(recovery),
  );
});

void test('a field somebody worked over still parses after thirty confirmations', () => {
  const start = recover({
    observed: observedOf({ ticket_number: clipped('254464', 'left', '17254464') }),
  }).recovery;
  let recovery = start;
  for (let index = 0; index < 30; index += 1) {
    recovery = confirmValue(
      recovery,
      'ticket_number',
      `1725446${index % 10}`,
      index === 0 ? 'accepted' : 'edited',
    );
  }
  const settled = reviewState(recovery, 'ticket_number');
  assert.equal(settled?.status, 'confirmed');
  assert.equal(settled?.value, '17254469');
  assert.equal(
    settled?.evidence.filter((line) => line.startsWith('A reviewer')).length,
    1,
    'the decision is kept, not the typing',
  );
  const round = parseRecovery(JSON.parse(JSON.stringify(recovery)));
  assert.notEqual(round, null, 'the stored record is still within its bounds');
  assert.deepEqual(round, recovery);
  assert.equal(blocksSave(recovery), false);
});

// --- a name typed once is a name known -----------------------------------

void test('a carrier typed once completes every fragment that fits it from then on', () => {
  // The person typed the carrier's full name over a cut-off print on one
  // ticket and saved it. That is all the workspace needs: the next ticket
  // reading the same fragment, or a shorter one, is completed without
  // a customer in common, because a carrier is the same fact whoever the
  // ticket is for.
  const typed: SavedRecord = {
    ...hauled({ carrier_name: 'ILLINOIS BULK CARRIER INC' }),
    recovery: {
      version: 1,
      vendor: 'heidelberg',
      paper: UNKNOWN_FRAME,
      fields: {
        carrier_name: {
          status: 'confirmed',
          value: 'ILLINOIS BULK CARRIER INC',
          visible_text: 'ILLINOIS BULK CARR',
          source: 'user_confirmed',
          source_clipped: true,
          clipped_edge: 'right',
          confidence: 1,
          evidence: ['A reviewer typed "ILLINOIS BULK CARRIER INC" for this field.'],
          confirmed_by_user: true,
        },
      },
    },
  };
  for (const printed of ['ILLINOIS BULK CARR', 'ILLINOIS BULK', 'ILLINOIS BULK CARRIER I']) {
    const { ticket, recovery } = recover({
      observed: observedOf(
        { carrier_name: clipped(printed, 'right') },
        { branding: 'Heidelberg Materials' },
      ),
      records: [typed],
    });
    const settled = reviewState(recovery, 'carrier_name');
    assert.equal(settled?.status, 'recovered', printed);
    assert.equal(settled?.value, 'ILLINOIS BULK CARRIER INC', printed);
    assert.equal(ticket.carrier_name, 'ILLINOIS BULK CARRIER INC', printed);
    assert.equal(blocksSave(recovery), false);
  }
});

void test('the fragment already on file is never offered as its own completion', () => {
  // Tickets saved with the print as it stood put "ILLINOIS BULK CARR" on file.
  // It fits itself; it completes nothing, and must not be listed as if it did.
  const asItStood = [1, 2, 3].map(() => hauled({ carrier_name: 'ILLINOIS BULK CARR' }));
  const { recovery } = recover({
    observed: observedOf({ carrier_name: clipped('ILLINOIS BULK CARR', 'right') }),
    records: asItStood,
  });
  const settled = reviewState(recovery, 'carrier_name');
  assert.equal(settled?.status, 'needs_review');
  assert.equal(settled?.candidates, undefined, 'nothing on file that is not the print itself');
});
