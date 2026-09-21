import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  blocksSave,
  UNKNOWN_FRAME,
  type ObservedField,
  type ObservedTicket,
  type PaperFrame,
  type TicketRecovery,
} from '../lib/load-desk/recovery/index.ts';
import {
  acceptableValue,
  savedAddressFor,
  canLeaveEmpty,
  confirmValue,
  noteSameOrderFill,
  recoverTicket,
  rerecoverSaved,
  reviewState,
  unresolvedMessage,
} from '../lib/load-desk/recovery/queue.ts';
import type { ClientProfile, CustomerProfile, TruckProfile } from '../lib/load-desk/profiles.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';
import { validateTicket } from '../lib/load-desk/validate.ts';
import { setLearnedConfusions } from '../lib/load-desk/recovery/misread.ts';

// The queue's own wiring: an observation in, a ticket and a record of how it
// got that way out. Everything here is the pure half of the review screen —
// what it shows, what a click on it does — so it can be argued about without
// rendering anything.

const ticketOf = (fields: Partial<Ticket>): Ticket => ({ ...emptyTicket(), ...fields });

// The sheet whole in the picture unless a test says otherwise, so a test
// about clipping is about the printer and not about the photograph.
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

const observedOf = (fields: ObservedTicket['fields']): ObservedTicket => ({
  fields,
  timestamps: [],
  branding: null,
  paper_edges: null,
});

const customerProfile = (over: Partial<CustomerProfile> = {}): CustomerProfile => ({
  id: 1,
  name: 'Angelo Iafrate Construction',
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

const IAFRATE = 'ANGELO IAFRATE CONSTRUCTION';

let counter = 0;
const saved = (fields: Partial<Ticket>): SavedRecord => ({
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
  reviewed_at: '2026-09-15T10:00:00.000Z',
});

/** A ticket of this customer's, read whole and reviewed by a person. */
const hauled = (over: Partial<Ticket> = {}) =>
  saved({
    plant_name: 'U857 CHICAGO',
    customer_name: IAFRATE,
    customer_id: '60311596',
    project_name: 'LINCOLN HIGHWAY',
    project_address: 'MARKHAM, IL',
    product_code: 'CA6',
    carrier_name: 'ILLINOIS BULK CARRIER',
    ...over,
  });

// --- a ticket that came through clean -------------------------------------

void test('a ticket read whole comes back exactly as it was read', () => {
  const observed = observedOf({
    ticket_number: whole('17254464'),
    customer_name: whole(IAFRATE),
    project_address: whole('MARKHAM, IL'),
    net_lb: whole('45,440'),
  });
  const extracted = ticketOf({
    ticket_number: '17254464',
    customer_name: IAFRATE,
    project_address: 'MARKHAM, IL',
    net_lb: 45440,
  });
  const { ticket, recovery } = recoverTicket({
    observed,
    paper: frame(),
    extracted,
    records: [hauled(), hauled()],
    profiles: { ...noProfiles, customers: [customerProfile({ addresses: ['MARKHAM, IL'] })] },
    customer: customerProfile({ addresses: ['MARKHAM, IL'] }),
  });
  assert.deepEqual(ticket, extracted);
  for (const field of ['ticket_number', 'customer_name', 'project_address', 'net_lb'] as const) {
    assert.equal(recovery.fields[field]?.status, 'exact', field);
  }
  assert.equal(blocksSave(recovery), false);
  assert.equal(unresolvedMessage(recovery), null);
});

// --- print the printer cut off --------------------------------------------

void test('a clipped address the matched customer is known to haul to is recovered', () => {
  const customer = customerProfile({ addresses: ['MARKHAM, IL'] });
  const { ticket, recovery } = recoverTicket({
    observed: observedOf({
      customer_name: whole(IAFRATE),
      project_address: clipped('ARKHAM, IL'),
    }),
    paper: frame(),
    extracted: ticketOf({ customer_name: IAFRATE }),
    records: [hauled(), hauled()],
    profiles: { ...noProfiles, customers: [customer] },
    customer,
  });
  const resolution = reviewState(recovery, 'project_address');
  assert.equal(resolution?.status, 'recovered');
  assert.equal(resolution?.visible_text, 'ARKHAM, IL');
  assert.equal(ticket.project_address, 'MARKHAM, IL');
  assert.ok(resolution!.evidence.length, 'the working is kept for the review screen');
  assert.equal(blocksSave(recovery), false);
});

void test('the same clipped address with nothing on file keeps the fragment and waits', () => {
  const { ticket, recovery } = recoverTicket({
    observed: observedOf({ project_address: clipped('ARKHAM, IL') }),
    paper: frame(),
    extracted: ticketOf({}),
    records: [],
    profiles: noProfiles,
    customer: null,
  });
  const resolution = reviewState(recovery, 'project_address');
  // Never a question (SILENT_FIELDS): the print stands as read, and what
  // the ticket carries is the print, never a candidate.
  assert.equal(resolution?.status, 'recovered');
  assert.equal(resolution?.source, 'visible');
  assert.equal(ticket.project_address, 'ARKHAM, IL');
});

void test('a part-read ticket number stays empty and is named in the save message', () => {
  const { ticket, recovery } = recoverTicket({
    observed: observedOf({
      ticket_number: clipped('254464', 'left', '17254464'),
      net_lb: whole('45,440'),
    }),
    paper: frame(),
    extracted: ticketOf({ net_lb: 45440 }),
    records: [hauled(), hauled()],
    profiles: noProfiles,
    customer: null,
  });
  assert.equal(reviewState(recovery, 'ticket_number')?.status, 'needs_review');
  // A digit short is a different ticket, so nothing goes in the box.
  assert.equal(ticket.ticket_number, null);
  assert.equal(blocksSave(recovery), true);
  const message = unresolvedMessage(recovery);
  assert.ok(message?.includes('ticket number'), message ?? '(nothing)');
  assert.equal(message?.split('.').filter(Boolean).length, 1, 'one sentence');
});

void test('the sheet running off the picture is a retake, not a recovery', () => {
  const customer = customerProfile({ addresses: ['MARKHAM, IL'] });
  const { recovery } = recoverTicket({
    observed: observedOf({
      customer_name: whole(IAFRATE),
      project_address: clipped('ARKHAM, IL'),
    }),
    paper: frame({ left: 'cut' }),
    extracted: ticketOf({ customer_name: IAFRATE }),
    records: [hauled(), hauled()],
    profiles: { ...noProfiles, customers: [customer] },
    customer,
  });
  const resolution = reviewState(recovery, 'project_address');
  // The site is never a question, and the one saved site it fits is taken;
  // the cut is noted. A number the camera cut off is still a retake.
  assert.equal(resolution?.status, 'recovered');
  assert.equal(resolution?.value, 'MARKHAM, IL');
  assert.equal(resolution?.source_clipped, false);
  const number = recoverTicket({
    observed: observedOf({ ticket_number: clipped('254464') }),
    paper: frame({ left: 'cut' }),
    extracted: ticketOf({}),
    records: [],
    profiles: noProfiles,
    customer: null,
  }).recovery.fields.ticket_number;
  assert.equal(number?.status, 'needs_review');
  assert.equal(number?.reason, 'camera_crop');
});

void test('a PDF page with no frame at all still resolves, against an unknown sheet', () => {
  const { recovery } = recoverTicket({
    observed: observedOf({ net_lb: whole('45,440') }),
    paper: undefined,
    extracted: ticketOf({ net_lb: 45440 }),
    records: [],
    profiles: noProfiles,
    customer: null,
  });
  assert.deepEqual(recovery.paper, { ...UNKNOWN_FRAME });
  assert.equal(recovery.fields.net_lb?.status, 'exact');
});

// --- the rest of the upload -----------------------------------------------

void test('another ticket of the upload does not touch a field this one shows whole', () => {
  const sister = {
    ticket: ticketOf({ project_address: 'JOLIET, IL', order_number: '884120' }),
    observed: observedOf({
      project_address: whole('JOLIET, IL'),
      order_number: whole('884120'),
    }),
  };
  const observed = observedOf({
    project_address: whole('MARKHAM, IL'),
    order_number: whole('884120'),
  });
  const { ticket, recovery } = recoverTicket({
    observed,
    paper: frame(),
    extracted: ticketOf({ project_address: 'MARKHAM, IL', order_number: '884120' }),
    records: [],
    profiles: noProfiles,
    customer: null,
    others: [sister, { ticket: ticketOf({}), observed }],
  });
  assert.equal(ticket.project_address, 'MARKHAM, IL');
  assert.equal(reviewState(recovery, 'project_address')?.status, 'exact');
});

void test('the same-order fill is written down as what it is', () => {
  const { recovery } = recoverTicket({
    observed: observedOf({ order_number: whole('884120') }),
    paper: frame(),
    extracted: ticketOf({ order_number: '884120' }),
    records: [],
    profiles: noProfiles,
    customer: null,
  });
  const noted = noteSameOrderFill(
    recovery,
    ['customer_name', 'project_address'],
    ticketOf({ ticket_number: '17254464', order_number: '884120' }),
    { customer_name: IAFRATE, project_address: 'MARKHAM, IL' },
  );
  const filled = reviewState(noted, 'project_address');
  assert.equal(filled?.status, 'recovered');
  assert.equal(filled?.value, 'MARKHAM, IL');
  assert.equal(filled?.source, 'batch_context');
  assert.equal(filled?.confidence, 0.75);
  assert.deepEqual(filled?.evidence, [
    'Filled from ticket 17254464 with the same order number 884120',
  ]);
  // The order number it was matched on is untouched, and so is everything
  // the fill did not fill.
  assert.equal(reviewState(noted, 'order_number')?.status, 'exact');
  assert.equal(noteSameOrderFill(recovery, [], ticketOf({}), {}), recovery);
});

// --- what a reviewer does about it ----------------------------------------

/** A ticket with one part-read BOL, which is what review is for. */
const waiting = () =>
  recoverTicket({
    observed: observedOf({ ticket_number: clipped('254464', 'left', '17254464') }),
    paper: frame(),
    extracted: ticketOf({}),
    records: [],
    profiles: noProfiles,
    customer: null,
  }).recovery;

void test('accepting settles the field and the save goes through', () => {
  const recovery = confirmValue(waiting(), 'ticket_number', '17254464', 'accepted');
  const resolution = reviewState(recovery, 'ticket_number');
  assert.equal(resolution?.status, 'confirmed');
  assert.equal(resolution?.value, '17254464');
  assert.equal(resolution?.confirmed_by_user, true);
  assert.equal(resolution?.visible_text, '254464', 'the print is kept beside it');
  assert.equal(blocksSave(recovery), false);
  assert.equal(unresolvedMessage(recovery), null);
});

void test('typing over an accepted value is one decision, and the last one stands', () => {
  const accepted = confirmValue(waiting(), 'ticket_number', '17254464', 'accepted');
  const edited = confirmValue(accepted, 'ticket_number', '17254465', 'edited');
  const resolution = reviewState(edited, 'ticket_number');
  assert.equal(resolution?.value, '17254465');
  assert.equal(
    resolution?.evidence.filter((line) => line.startsWith('A reviewer')).length,
    1,
  );
});

void test('a reviewer may leave a number empty on purpose, and that unblocks it', () => {
  const recovery = confirmValue(waiting(), 'ticket_number', null, 'accepted');
  const resolution = reviewState(recovery, 'ticket_number');
  assert.equal(resolution?.status, 'confirmed');
  assert.equal(resolution?.value, null);
  assert.equal(blocksSave(recovery), false);
  // Prose keeps whatever printed, so there is nothing to leave empty there.
  assert.equal(canLeaveEmpty('ticket_number'), true);
  assert.equal(canLeaveEmpty('net_lb'), true);
  assert.equal(canLeaveEmpty('ticket_date'), true);
  assert.equal(canLeaveEmpty('customer_name'), false);
});

void test('reviewState has nothing to say about a ticket that never saw the reader', () => {
  assert.equal(reviewState(undefined, 'net_lb'), null);
});

// --- the issues list ------------------------------------------------------

const complete = ticketOf({
  ticket_number: '17254464',
  ticket_date: '2026-09-14',
  customer_name: IAFRATE,
  net_lb: 45440,
  net_tons: 22.72,
  rate: 120,
});

void test('the issues of a ticket are unchanged when no recovery is handed over', () => {
  assert.deepEqual(validateTicket(complete), []);
  const empty: TicketRecovery = { version: 1, vendor: null, paper: UNKNOWN_FRAME, fields: {} };
  assert.deepEqual(validateTicket(complete, empty), []);
});

void test('a field waiting on a person joins the issues, after the rate', () => {
  const recovery = waiting();
  const issues = validateTicket({ ...complete, rate: null }, recovery);
  assert.equal(issues[0], 'Rate is missing');
  assert.ok(issues[issues.length - 1]?.startsWith('Needs confirmation: ticket number'));
  // And goes away once somebody has settled it.
  assert.deepEqual(
    validateTicket(complete, confirmValue(recovery, 'ticket_number', '17254464', 'accepted')),
    [],
  );
});

void test('a candidate is handed to the box as a value, or not at all', () => {
  // Candidates are print. A weight disputed by the ticket's own arithmetic is
  // listed as "68,000", and Number("68,000") is NaN — which the box turns into
  // an empty field marked as accepted. The digits go through; anything that
  // is not a number is refused rather than written as nothing.
  assert.equal(acceptableValue('net_lb', '68,000'), '68000');
  assert.equal(acceptableValue('net_lb', '$ 68 000'), '68000');
  assert.equal(acceptableValue('net_lb', 'abc'), null);
  assert.equal(acceptableValue('net_lb', ''), null);
  assert.equal(acceptableValue('net_tons', '22.31'), '22.31');
  assert.equal(acceptableValue('project_address', 'MARKHAM, IL'), 'MARKHAM, IL');
  assert.equal(acceptableValue('ticket_date', '2026-09-14'), '2026-09-14');
});

// --- a saved ticket, looked at again -------------------------------------

const staleResolution = (over: Partial<import('../lib/load-desk/recovery/index.ts').FieldResolution>) => ({
  status: 'needs_review' as const,
  value: null,
  visible_text: null,
  source: null,
  source_clipped: false,
  clipped_edge: null,
  confidence: 0,
  evidence: [],
  ...over,
});

void test('a weight refused for the mark beside it reads as a weight once reopened', () => {
  const recovery: TicketRecovery = {
    version: 1,
    vendor: 'heidelberg',
    paper: UNKNOWN_FRAME,
    fields: {
      tare_lb: staleResolution({ visible_text: '27600 *', reason: 'not_read' }),
      gross_lb: { ...staleResolution({}), status: 'exact', value: 73100, visible_text: '73,100', source: 'visible', confidence: 1 },
    },
  };
  const ticket: Ticket = { ...emptyTicket(), gross_lb: 73100, tare_lb: null };
  const again = rerecoverSaved({ ticket, recovery, records: [], profiles: noProfiles, customer: null });
  assert.equal(again.recovery.fields.tare_lb?.status, 'exact');
  assert.equal(again.recovery.fields.tare_lb?.value, 27600);
  assert.equal(again.recovery.fields.tare_lb?.visible_text, '27600 *');
  assert.equal(again.ticket.tare_lb, 27600);
  assert.equal(again.ticket.gross_lb, 73100, 'a settled field is left alone');
});

void test('a carrier sent back for a photograph is completed from reviewed history once reopened', () => {
  const recovery: TicketRecovery = {
    version: 1,
    vendor: 'heidelberg',
    paper: { detected: false, left: 'unknown', right: 'cut', top: 'unknown', bottom: 'unknown' },
    fields: {
      carrier_name: staleResolution({ visible_text: 'ILLINOIS BULK CARR', clipped_edge: 'right', reason: 'camera_crop' }),
    },
  };
  const ticket: Ticket = { ...emptyTicket(), carrier_name: 'ILLINOIS BULK CARR' };
  const reviewed = [1, 2, 3].map(() => saved({ carrier_name: 'ILLINOIS BULK CARRIER' }));
  // The stored frame says the detector called the right side cut; that was
  // the reader's word, written into the frame by the old merge. A detector
  // verdict is trusted, so this stays a retake...
  const still = rerecoverSaved({ ticket, recovery, records: reviewed, profiles: noProfiles, customer: null });
  assert.equal(still.recovery.fields.carrier_name?.reason, 'camera_crop');
  // ...but a record whose frame never had the detector's verdict is recovered.
  const doubted = { ...recovery, paper: UNKNOWN_FRAME };
  const again = rerecoverSaved({ ticket, recovery: doubted, records: reviewed, profiles: noProfiles, customer: null });
  assert.equal(again.recovery.fields.carrier_name?.status, 'recovered');
  assert.equal(again.recovery.fields.carrier_name?.value, 'ILLINOIS BULK CARRIER');
  assert.equal(again.ticket.carrier_name, 'ILLINOIS BULK CARRIER');
});

void test('a field a person confirmed is never reconsidered, and nothing changes when nothing changes', () => {
  const recovery: TicketRecovery = {
    version: 1,
    vendor: null,
    paper: UNKNOWN_FRAME,
    fields: {
      carrier_name: { ...staleResolution({ visible_text: 'Z FORCE TRANSPO' }), status: 'confirmed', value: 'Z FORCE TRANSPO', confirmed_by_user: true, source: 'user_confirmed', confidence: 1 },
      product_description: staleResolution({ visible_text: 'A6 CRUSHED', clipped_edge: 'left', reason: 'insufficient_evidence' }),
    },
  };
  const ticket: Ticket = { ...emptyTicket(), carrier_name: 'Z FORCE TRANSPO', product_description: 'A6 CRUSHED' };
  const again = rerecoverSaved({ ticket, recovery, records: [], profiles: noProfiles, customer: null });
  assert.equal(again.recovery, recovery, 'the same object comes back when nothing changed');
  assert.equal(again.ticket, ticket);
});

void test('a customer matched a letter off is written as the name on file', () => {
  const witech: CustomerProfile = {
    id: 5, name: 'WITECH COMPANY INC', ticket_customer_ids: ['60311596'], ticket_names: [], addresses: [],
    flat_rate: null, fuel_charge: null, notes: '', created_at: '',
  };
  const observed: ObservedTicket = {
    fields: {
      customer_id: { visible: '60311596', proposed: null, clipped_edge: null, partial: false },
      customer_name: { visible: 'VITECH COMPANY INC', proposed: null, clipped_edge: null, partial: false },
    },
    timestamps: [], branding: 'Heidelberg Materials', paper_edges: null,
  };
  const extracted: Ticket = { ...emptyTicket(), customer_id: '60311596', customer_name: 'VITECH COMPANY INC' };
  // The page matches the customer (by number here, or a letter off by name) and hands them in.
  const { ticket, recovery } = recoverTicket({
    observed, paper: UNKNOWN_FRAME, extracted, records: [], profiles: { customers: [witech], trucks: [], clients: [] }, customer: witech,
  });
  assert.equal(ticket.customer_name, 'WITECH COMPANY INC');
  assert.equal(recovery.fields.customer_name?.status, 'recovered');
  assert.equal(recovery.fields.customer_name?.visible_text, 'VITECH COMPANY INC', 'the print is kept');
  assert.equal(recovery.fields.customer_name?.source, 'verified_profile');
  assert.equal(blocksSave(recovery), false);
  // The same name, spelled as on file: nothing to do.
  const same = recoverTicket({
    observed: { ...observed, fields: { ...observed.fields, customer_name: { visible: 'Witech Company Inc', proposed: null, clipped_edge: null, partial: false } } },
    paper: UNKNOWN_FRAME, extracted: { ...extracted, customer_name: 'Witech Company Inc' }, records: [], profiles: { customers: [witech], trucks: [], clients: [] }, customer: witech,
  });
  assert.equal(same.recovery.fields.customer_name?.status, 'exact');
  // No customer matched: the print stands, and it is the customer question.
  const nobody = recoverTicket({ observed, paper: UNKNOWN_FRAME, extracted, records: [], profiles: { customers: [witech], trucks: [], clients: [] }, customer: null });
  assert.equal(nobody.ticket.customer_name, 'VITECH COMPANY INC');
});

// --- a date on print the paper is known to lay down faintly -----------------

void test("a Heidelberg date is not taken on the reader's word: asked for, unless the stamp or the run confirms it", () => {
  // The ticket as it came back three times over: the date box in the
  // dot-matrix margin read as "12/13/2025", called clear, for a 15th. No
  // encoded stamp on the sheet — only the date box and the time box, which
  // the reader hands back together.
  const read = (over: Partial<ObservedTicket> = {}) => ({
    ...observedOf({
      ticket_number: whole('1725331394'),
      ticket_date: whole('12/13/2025'),
      plant_name: whole('Heidelberg Materials'),
      plant_code: whole('U857'),
      customer_name: whole(IAFRATE),
    }),
    branding: 'Heidelberg Materials',
    timestamps: ['12/13/2025 8:33'],
    ...over,
  });
  const extracted = ticketOf({
    ticket_number: '1725331394',
    ticket_date: '2025-12-13',
    plant_name: 'Heidelberg Materials',
    plant_code: 'U857',
    customer_name: IAFRATE,
  });
  const input = { paper: frame(), extracted, profiles: noProfiles, customer: null };

  // Nothing on file: the date is asked for, and the misread does not pass.
  const alone = recoverTicket({ ...input, observed: read(), records: [] });
  assert.equal(alone.recovery.fields.ticket_date?.status, 'needs_review');
  assert.equal(alone.ticket.ticket_date, null);
  assert.ok(alone.recovery.fields.ticket_date?.evidence.some((line) => /printed faintly/.test(line)));

  // The scale's own encoded stamp confirms the day: taken, no question.
  const stamped = recoverTicket({
    ...input,
    observed: read({ timestamps: ['25DEC13 08:33'] }),
    records: [],
  });
  assert.equal(stamped.recovery.fields.ticket_date?.status, 'exact');
  assert.equal(stamped.ticket.ticket_date, '2025-12-13');

  // The plant's run of checked tickets either side, all the 15th: the 13
  // is one faded digit from it, and read as the 15th with the print kept.
  const run = [1725331380, 1725331388, 1725331402].map((n) =>
    hauled({ ticket_number: String(n), ticket_date: '2025-12-15', plant_name: 'Heidelberg Materials' }),
  );
  const inRun = recoverTicket({ ...input, observed: read(), records: run });
  assert.equal(inRun.recovery.fields.ticket_date?.status, 'recovered');
  assert.equal(inRun.ticket.ticket_date, '2025-12-15');
  assert.equal(inRun.recovery.fields.ticket_date?.visible_text, '12/13/2025');

  // And a stamp that disagrees with the run is the ticket disagreeing with
  // itself, two days apart: still a question, never a silent pick.
  const torn = recoverTicket({
    ...input,
    observed: read({ timestamps: ['25DEC11 08:33'] }),
    records: run,
  });
  assert.equal(torn.recovery.fields.ticket_date?.status, 'needs_review');
});

void test("a vendor whose dates keep being typed over is learned to print them faintly", () => {
  // Nobody's layout says so, but the deployment has corrected this vendor's
  // dates three times — three different digits, so no one pair has learned
  // anything. Together they say the print is faint, and the date is asked.
  const read = () => ({
    ...observedOf({ ticket_number: whole('88123456'), ticket_date: whole('12/13/2025') }),
    branding: 'Ontario Trap Rock',
  });
  const extracted = ticketOf({ ticket_number: '88123456', ticket_date: '2025-12-13' });
  const input = { paper: frame(), extracted, records: [], profiles: noProfiles, customer: null };
  const vendor = recoverTicket({ ...input, observed: read() }).recovery.vendor;
  assert.ok(vendor, 'the fixture has to detect a vendor');
  const before = recoverTicket({ ...input, observed: read() });
  assert.equal(before.recovery.fields.ticket_date?.status, 'exact');
  try {
    setLearnedConfusions([
      { vendor, field: 'date', read: '3', actual: '5', count: 1 },
      { vendor, field: 'date', read: '1', actual: '5', count: 1 },
      { vendor, field: 'date', read: '8', actual: '5', count: 1 },
    ]);
    const after = recoverTicket({ ...input, observed: read() });
    assert.equal(after.recovery.fields.ticket_date?.status, 'needs_review');
    // Another vendor's corrections say nothing about this one.
    setLearnedConfusions([{ vendor: 'somebody-else', field: 'date', read: '3', actual: '5', count: 9 }]);
    assert.equal(recoverTicket({ ...input, observed: read() }).recovery.fields.ticket_date?.status, 'exact');
  } finally {
    setLearnedConfusions([]);
  }
});

// --- the job site, as saved --------------------------------------------------

void test('a job site is written as the customer has it saved, however the ticket prints it', () => {
  const site = '16222 Western Ave, Markham, IL';
  const customer = customerProfile({ addresses: [site, '5 MAIN ST, JOLIET, IL'] });
  // Case and punctuation aside, the same site.
  assert.equal(savedAddressFor(customer, '16222 Western Ave MARKHAM, IL'), site);
  assert.equal(savedAddressFor(customer, '16222 WESTERN AVE. MARKHAM IL'), site);
  // Part of it: the city line alone.
  assert.equal(savedAddressFor(customer, 'MARKHAM, IL'), site);
  // A character or two off.
  assert.equal(savedAddressFor(customer, '16222 Westem Ave, Markham, IL'), site);
  // Another site is another site.
  assert.equal(savedAddressFor(customer, '99 ELM ST, MARKHAM, IL'), null);
  assert.equal(savedAddressFor(null, site), null);
  // And through the queue: the ticket carries the saved spelling, with the
  // print kept beside it.
  const { ticket, recovery } = recoverTicket({
    observed: observedOf({
      customer_name: whole(IAFRATE),
      project_address: whole('16222 Western Ave MARKHAM, IL'),
    }),
    paper: frame(),
    extracted: ticketOf({ customer_name: IAFRATE, project_address: '16222 Western Ave MARKHAM, IL' }),
    records: [],
    profiles: { ...noProfiles, customers: [customer] },
    customer,
  });
  assert.equal(ticket.project_address, site);
  assert.equal(recovery.fields.project_address?.visible_text, '16222 Western Ave MARKHAM, IL');
  assert.equal(blocksSave(recovery), false);
  // Printed as saved: nothing to change.
  const same = recoverTicket({
    observed: observedOf({ customer_name: whole(IAFRATE), project_address: whole(site) }),
    paper: frame(),
    extracted: ticketOf({ customer_name: IAFRATE, project_address: site }),
    records: [],
    profiles: { ...noProfiles, customers: [customer] },
    customer,
  });
  assert.equal(same.recovery.fields.project_address?.status, 'exact');
});
