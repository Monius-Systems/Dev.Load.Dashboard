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
  canLeaveEmpty,
  confirmValue,
  noteSameOrderFill,
  recoverTicket,
  reviewState,
  unresolvedMessage,
} from '../lib/load-desk/recovery/queue.ts';
import type { ClientProfile, CustomerProfile, TruckProfile } from '../lib/load-desk/profiles.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';
import { validateTicket } from '../lib/load-desk/validate.ts';

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
  assert.equal(resolution?.status, 'needs_review');
  // What the ticket carries is the print, never a candidate: a person
  // reading the screen is reading the paper.
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
  assert.equal(resolution?.status, 'needs_review');
  assert.equal(resolution?.reason, 'camera_crop');
  assert.equal(resolution?.source_clipped, false);
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
