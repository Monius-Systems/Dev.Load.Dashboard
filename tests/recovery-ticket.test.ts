import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  UNKNOWN_FRAME,
  applyRecovery,
  blocksSave,
  confirmField,
  emptyRecovery,
  mergeFrames,
  resolveTicket,
  reviewIssues,
  unresolvedCritical,
  type Evidence,
  type ObservedField,
  type ObservedTicket,
  type PaperFrame,
  type RecoveryContext,
} from '../lib/load-desk/recovery/index.ts';
import { emptyTicket, type Ticket } from '../lib/load-desk/types.ts';

const frame = (patch: Partial<PaperFrame> = {}): PaperFrame => ({
  detected: true,
  left: 'inside',
  right: 'inside',
  top: 'inside',
  bottom: 'inside',
  ...patch,
});

const seen = (patch: Partial<ObservedField> = {}): ObservedField => ({
  visible: null,
  proposed: null,
  clipped_edge: null,
  partial: false,
  ...patch,
});

type EvidenceSeed = Omit<Evidence, 'note' | 'field'> & { note?: string; field?: keyof Ticket };

const ev = ({ note, field, ...rest }: EvidenceSeed): Evidence => ({
  field: field ?? 'customer_name',
  ...rest,
  note: note ?? `${rest.source} offers "${rest.candidate}"`,
});

const observedTicket = (
  fields: ObservedTicket['fields'],
  patch: Partial<ObservedTicket> = {},
): ObservedTicket => ({
  fields,
  timestamps: [],
  branding: null,
  paper_edges: null,
  ...patch,
});

const here: RecoveryContext = { vendor: 'ontario-trap-rock', customer: 'Markham Paving' };

void test('an empty recovery has nothing decided and the frame it was handed', () => {
  assert.deepEqual(emptyRecovery(), {
    version: 1,
    vendor: null,
    paper: UNKNOWN_FRAME,
    fields: {},
  });
  assert.equal(emptyRecovery(frame({ left: 'cut' })).paper.left, 'cut');
  assert.equal(blocksSave(emptyRecovery()), false);
});

void test('the detector and the reader have to agree before print counts as printer-clipped', () => {
  assert.equal(mergeFrames(frame(), null).left, 'inside');
  assert.equal(mergeFrames(frame(), frame()).left, 'inside');
  assert.equal(mergeFrames(frame(), frame({ left: 'cut' })).left, 'cut');
  assert.equal(mergeFrames(frame({ left: 'cut' }), frame()).left, 'cut');
  assert.equal(mergeFrames(frame(), frame({ left: 'unknown' })).left, 'unknown');
});

void test("the reader calling an edge cut is enough to send the ticket back for a photograph", () => {
  const recovery = resolveTicket(
    observedTicket(
      { customer_name: seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }) },
      { paper_edges: frame({ left: 'cut' }) },
    ),
    frame({ left: 'inside' }),
    [ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  assert.equal(recovery.fields.customer_name?.reason, 'camera_crop');
  assert.equal(recovery.paper.left, 'cut');
});

void test('a ticket resolves every field that was seen or that anything is known about', () => {
  const recovery = resolveTicket(
    observedTicket({
      ticket_number: seen({ visible: '17254464' }),
      gross_lb: seen({ visible: '68,000' }),
      net_lb: seen({ visible: '5,440', clipped_edge: 'left', partial: true }),
    }),
    frame(),
    [
      ev({
        field: 'net_lb',
        candidate: '45440',
        source: 'same_ticket',
        strength: 'strong',
        note: 'Gross 68,000 lb less tare 22,560 lb is 45,440 lb.',
      }),
      ev({ field: 'weighmaster', candidate: 'R. Alvarez', source: 'verified_history', strength: 'strong' }),
    ],
    here,
  );
  assert.equal(recovery.version, 1);
  assert.equal(recovery.vendor, 'ontario-trap-rock');
  assert.equal(recovery.fields.ticket_number?.status, 'exact');
  assert.equal(recovery.fields.gross_lb?.value, 68000);
  assert.equal(recovery.fields.net_lb?.status, 'recovered');
  assert.equal(recovery.fields.net_lb?.value, 45440);
  assert.equal(
    recovery.fields.weighmaster?.status,
    'missing',
    'known about but never printed',
  );
  assert.equal(recovery.fields.customer_name, undefined, 'neither seen nor known about');
});

void test('fields come back in the order the app declares them, whatever order they arrived in', () => {
  const forwards = resolveTicket(
    observedTicket({
      net_lb: seen({ visible: '45,440' }),
      ticket_number: seen({ visible: '17254464' }),
      customer_name: seen({ visible: 'Markham Paving' }),
    }),
    frame(),
    [],
    here,
  );
  const backwards = resolveTicket(
    observedTicket({
      customer_name: seen({ visible: 'Markham Paving' }),
      ticket_number: seen({ visible: '17254464' }),
      net_lb: seen({ visible: '45,440' }),
    }),
    frame(),
    [],
    here,
  );
  assert.deepEqual(Object.keys(forwards.fields), ['ticket_number', 'customer_name', 'net_lb']);
  assert.equal(JSON.stringify(forwards), JSON.stringify(backwards));
});

void test('the same ticket resolved twice is the same record, character for character', () => {
  const observed = observedTicket({
    ticket_date: seen({ visible: '14/2026', clipped_edge: 'left', partial: true }),
    customer_name: seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    ticket_number: seen({ visible: '1725', proposed: '17254464', clipped_edge: 'right', partial: true }),
  });
  const evidence = [
    ev({ field: 'ticket_date', candidate: '2026-09-14', source: 'vendor_rule', strength: 'strong' }),
    ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
    ev({ field: 'ticket_number', candidate: '17254464', source: 'batch_context', strength: 'weak' }),
  ];
  const first = resolveTicket(observed, frame(), evidence, here);
  const second = resolveTicket(observed, frame(), evidence, here);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
});

// --- writing the decisions onto the ticket --------------------------------

void test('what was settled is written down and what was not is not', () => {
  const recovery = resolveTicket(
    observedTicket({
      ticket_number: seen({ visible: '17254464' }),
      customer_name: seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
      project_name: seen({ visible: 'ROUTE 30', clipped_edge: 'right', partial: true }),
      net_lb: seen({ visible: '5,440', clipped_edge: 'left', partial: true }),
      weighmaster: seen({ visible: null }),
    }),
    frame(),
    [ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  const before = { ...emptyTicket(), plant_name: 'Ontario Trap Rock', rate: 12.5 };
  const after = applyRecovery(before, recovery);

  assert.equal(after.ticket_number, '17254464', 'exact');
  assert.equal(after.customer_name, 'Markham Paving', 'recovered');
  assert.equal(after.project_name, 'ROUTE 30', 'waiting, but prose the reviewer should see');
  assert.equal(after.net_lb, null, 'waiting, and a half-read weight is never a number');
  assert.equal(after.weighmaster, null, 'missing');
  assert.equal(after.plant_name, 'Ontario Trap Rock', 'nothing was resolved, nothing was touched');
  assert.equal(after.rate, 12.5);
  assert.notEqual(after, before, 'the ticket handed in is not modified');
  assert.equal(before.customer_name, null);
});

void test('a number, a code and a date waiting for a person all come out empty', () => {
  const recovery = resolveTicket(
    observedTicket({
      customer_id: seen({ visible: 'CUS-104', clipped_edge: 'right', partial: true }),
      ticket_date: seen({ visible: '9/14', clipped_edge: 'right', partial: true }),
      net_tons: seen({ visible: '22.7', clipped_edge: 'right', partial: true }),
    }),
    frame(),
    [],
    here,
  );
  const after = applyRecovery(emptyTicket(), recovery);
  assert.equal(after.customer_id, null);
  assert.equal(after.ticket_date, null);
  assert.equal(after.net_tons, null);
});

// --- a person settling it -------------------------------------------------

void test('a reviewer accepting a value ends the question and leaves a trail', () => {
  const recovery = resolveTicket(
    observedTicket({
      ticket_number: seen({ visible: '1725', clipped_edge: 'right', partial: true }),
    }),
    frame(),
    [ev({ field: 'ticket_number', candidate: '17254464', source: 'verified_history', strength: 'strong' })],
    here,
  );
  const confirmed = confirmField(recovery, 'ticket_number', '17254464', 'accepted');
  const field = confirmed.fields.ticket_number!;

  assert.equal(field.status, 'confirmed');
  assert.equal(field.value, '17254464');
  assert.equal(field.source, 'user_confirmed');
  assert.equal(field.confirmed_by_user, true);
  assert.equal(field.confidence, 1);
  assert.equal(field.visible_text, '1725', 'the print is kept whatever was typed over it');
  assert.equal(field.clipped_edge, 'right');
  assert.ok(field.evidence.at(-1)?.includes('accepted'));
  assert.ok(field.evidence.length > 1, 'the evidence weighed before is still there');

  assert.equal(recovery.fields.ticket_number?.status, 'needs_review', 'the original is untouched');
  assert.equal(applyRecovery(emptyTicket(), confirmed).ticket_number, '17254464');
});

void test('a reviewer typing a value is recorded as typed, not accepted', () => {
  const confirmed = confirmField(emptyRecovery(frame()), 'net_lb', 45440, 'edited');
  const field = confirmed.fields.net_lb!;
  assert.equal(field.status, 'confirmed');
  assert.equal(field.value, 45440);
  assert.equal(field.visible_text, null);
  assert.ok(field.evidence.at(-1)?.includes('typed'));
  assert.equal(applyRecovery(emptyTicket(), confirmed).net_lb, 45440);
});

// --- what stops a save ----------------------------------------------------

void test('a critical field waiting for a person stops the save; a harmless one does not', () => {
  const blocked = resolveTicket(
    observedTicket({
      net_lb: seen({ visible: '5,440', clipped_edge: 'left', partial: true }),
      weighmaster: seen({ visible: 'R. AL', clipped_edge: 'right', partial: true }),
    }),
    frame(),
    [],
    here,
  );
  assert.deepEqual(unresolvedCritical(blocked), ['net_lb']);
  assert.equal(blocksSave(blocked), true);

  const settled = confirmField(blocked, 'net_lb', 45440, 'edited');
  assert.deepEqual(unresolvedCritical(settled), []);
  assert.equal(blocksSave(settled), false);
});

void test('unresolved critical fields are listed in the ticket order every time', () => {
  const recovery = resolveTicket(
    observedTicket({
      net_lb: seen({ visible: '5,440', clipped_edge: 'left', partial: true }),
      ticket_date: seen({ visible: '9/14', clipped_edge: 'right', partial: true }),
      ticket_number: seen({ visible: '1725', clipped_edge: 'right', partial: true }),
      customer_name: seen({ visible: 'Markham Paving' }),
    }),
    frame(),
    [],
    here,
  );
  assert.deepEqual(unresolvedCritical(recovery), ['ticket_number', 'ticket_date', 'net_lb']);
});

void test('a ticket read whole blocks nothing', () => {
  const recovery = resolveTicket(
    observedTicket({
      ticket_number: seen({ visible: '17254464' }),
      ticket_date: seen({ visible: '09/14/2026' }),
      customer_name: seen({ visible: 'Markham Paving' }),
      net_lb: seen({ visible: '45,440' }),
    }),
    frame(),
    [],
    here,
  );
  assert.equal(blocksSave(recovery), false);
  assert.deepEqual(reviewIssues(recovery), []);
});

void test('a recovered field is settled and says nothing to the reviewer', () => {
  const recovery = resolveTicket(
    observedTicket({
      customer_name: seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    }),
    frame(),
    [ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  assert.equal(recovery.fields.customer_name?.status, 'recovered');
  assert.deepEqual(reviewIssues(recovery), []);
  assert.equal(blocksSave(recovery), false);
});

// --- what the reviewer reads ---------------------------------------------

void test('the issue lines say what is wrong, what printed and what was on offer', () => {
  const recovery = resolveTicket(
    observedTicket({
      ticket_number: seen({ visible: '17254464_', clipped_edge: 'right', partial: true }),
      project_name: seen({ visible: 'HAM', clipped_edge: 'left', partial: true }),
      customer_name: seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    }),
    frame({ left: 'cut' }),
    [
      ev({ field: 'project_name', candidate: 'Markham', source: 'verified_profile', strength: 'strong' }),
      ev({ field: 'project_name', candidate: 'Graham', source: 'verified_profile', strength: 'strong' }),
    ],
    here,
  );
  assert.deepEqual(reviewIssues(recovery), [
    'Needs confirmation: ticket number — part of the print was cut off; visible "17254464_"',
    'Needs confirmation: customer name — the sheet ran off the photograph: take the picture again; visible "ARKHAM PAVING"',
    'Needs confirmation: project name — the sheet ran off the photograph: take the picture again; visible "HAM"; on file: "Graham", "Markham"',
  ]);
});

void test('the issue lines name the weights the way the rest of the app does', () => {
  const recovery = resolveTicket(
    observedTicket({ net_lb: seen({ visible: '5,440', clipped_edge: 'left', partial: true }) }),
    frame(),
    [],
    here,
  );
  assert.deepEqual(reviewIssues(recovery), [
    'Needs confirmation: net weight — part of the print was cut off; visible "5,440"',
  ]);
});

void test('confirming the same field over and over leaves one decision, not a diary', () => {
  let recovery = resolveTicket(
    observedTicket({
      customer_name: seen({ visible: 'ARKHAM PAV', clipped_edge: 'left', partial: true }),
    }),
    frame(),
    [
      ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
      ev({ candidate: 'Barkham Paving', source: 'verified_history', strength: 'strong' }),
    ],
    here,
  );
  const weighed = recovery.fields.customer_name!.evidence.length;
  assert.ok(weighed > 0, 'there is evidence underneath to preserve');

  // The review screen confirms on every keystroke of "Markham Paving".
  const typed = 'Markham Paving';
  for (let index = 1; index <= 30; index++) {
    recovery = confirmField(recovery, 'customer_name', typed.slice(0, index), 'edited');
  }
  const field = recovery.fields.customer_name!;
  const reviewerNotes = field.evidence.filter((line) => line.startsWith('A reviewer'));

  assert.equal(reviewerNotes.length, 1, 'one decision, however many keystrokes made it');
  assert.ok(field.evidence.length <= 20, 'the stored record stays inside what a save accepts');
  assert.equal(field.evidence.length, weighed + 1);
  assert.ok(field.evidence.at(-1)?.includes('"Markham Paving"'), 'the last call is what stands');
  assert.equal(field.value, 'Markham Paving');
  assert.equal(field.status, 'confirmed');
});

void test('accepting after editing replaces the decision rather than joining it', () => {
  const once = confirmField(emptyRecovery(frame()), 'customer_id', 'CUS-104', 'edited');
  const twice = confirmField(once, 'customer_id', 'CUS-10412', 'accepted');
  const notes = twice.fields.customer_id!.evidence;
  assert.deepEqual(notes, ['A reviewer accepted "CUS-10412" for this field.']);
});

void test('a field weighed against more evidence than a record may carry still confirms', () => {
  const crowded = resolveTicket(
    observedTicket({
      project_name: seen({ visible: 'ROUTE 30', clipped_edge: 'right', partial: true }),
    }),
    frame(),
    Array.from({ length: 25 }, (_, index) =>
      ev({
        field: 'project_name',
        candidate: `Route 30 Section ${index}`,
        source: 'batch_context',
        strength: 'weak',
        note: `Ticket ${index} of the upload reads Route 30 Section ${index}.`,
      }),
    ),
    here,
  );
  assert.ok(crowded.fields.project_name!.evidence.length > 20, 'more notes than a save allows');

  const confirmed = confirmField(crowded, 'project_name', 'Route 30 Section 4', 'accepted');
  const notes = confirmed.fields.project_name!.evidence;
  assert.equal(notes.length, 20);
  assert.ok(notes.at(-1)?.startsWith('A reviewer'), 'the decision is the last thing said');
  assert.equal(notes.filter((line) => line.startsWith('A reviewer')).length, 1);
  assert.ok(notes[0].includes('Ticket 6'), 'the oldest notes are the ones dropped');
});

void test('a frame the resolver was handed is never written to', () => {
  const recovery = resolveTicket(
    observedTicket({ net_lb: seen({ visible: '5,440', clipped_edge: 'left', partial: true }) }),
    UNKNOWN_FRAME,
    [],
    here,
  );
  assert.equal(recovery.fields.net_lb?.source_clipped, true);
  assert.deepEqual(recovery.paper, UNKNOWN_FRAME);
  assert.notEqual(recovery.paper, UNKNOWN_FRAME, 'a copy, so the record cannot alias it');
  assert.deepEqual(emptyRecovery(UNKNOWN_FRAME).paper, UNKNOWN_FRAME);
  assert.equal(Object.isFrozen(UNKNOWN_FRAME), true, 'and it is still frozen afterwards');
});
