import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyGroupAnswer,
  dateEdit,
  groupExceptions,
  membersOf,
} from '../lib/load-desk/recovery/exceptions.ts';
import { knowledgeOf, ticketOutcome, OUTCOME_POLICY } from '../lib/load-desk/recovery/outcome.ts';
import { recoverTicket } from '../lib/load-desk/recovery/queue.ts';
import { UNKNOWN_FRAME, type FieldResolution, type ObservedField, type ObservedTicket, type TicketRecovery } from '../lib/load-desk/recovery/index.ts';
import { validateTicket } from '../lib/load-desk/validate.ts';
import { needsReview, numbersByTicketDate } from '../lib/load-desk/records.ts';
import { applyRecordEdit, parseRecordEdits } from '../lib/load-desk/record-input.ts';
import { deskSnapshot, setDeskField, clearDesk } from '../lib/load-desk/desk-session.ts';
import type { CustomerProfile } from '../lib/load-desk/profiles.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

// Scan → extract → recover → group → invoice, with a person asked only what
// the evidence cannot settle, and asked once per job. These drive the real
// modules over the shapes the page holds; nothing here touches a store.

const FIVE = 'FIVE CONST CORP';
const IAFRATE = 'ANGELO IAFRATE CONSTRUCTION';
const MARKHAM = '222 WESTERN AVE, MARKHAM, IL 60428';
const STRAWBERRY = 'STRAWBERRY RD AND IN-2';
const JOLIET = '12345 NEW ROAD, JOLIET, IL';

let nextId = 0;
const exact = (value: string | number): FieldResolution => ({
  status: 'exact', value, visible_text: String(value), source: 'visible',
  source_clipped: false, clipped_edge: null, confidence: 1, evidence: [],
});
const waiting = (visible: string, over: Partial<FieldResolution> = {}): FieldResolution => ({
  status: 'needs_review', value: null, visible_text: visible, source: null,
  source_clipped: true, clipped_edge: 'left', confidence: 0, evidence: [], reason: 'insufficient_evidence', ...over,
});

/** A ticket read whole, every field exact, filed and not yet looked at. */
const read = (fields: Partial<Ticket>, over: Partial<Record<keyof Ticket, FieldResolution>> = {}, patch: Partial<SavedRecord> = {}): SavedRecord => {
  const ticket: Ticket = {
    ...emptyTicket(),
    ticket_number: String(1725000000 + ++nextId),
    ticket_date: '2026-09-14',
    customer_id: '60311596',
    customer_name: FIVE,
    project_address: MARKHAM,
    gross_lb: 73160, tare_lb: 27280, net_lb: 45880, net_tons: 22.94,
    plant_name: 'Heidelberg Materials',
    ...fields,
  };
  const resolved: TicketRecovery['fields'] = {};
  for (const [name, value] of Object.entries(ticket)) {
    if (value !== null && value !== undefined) resolved[name as keyof Ticket] = exact(value as string | number);
  }
  for (const [name, resolution] of Object.entries(over)) {
    resolved[name as keyof Ticket] = resolution;
    if (resolution.status === 'needs_review') (ticket as Record<string, unknown>)[name] = null;
  }
  return {
    id: nextId,
    saved_at: '2026-09-14T15:00:00.000Z',
    ticket,
    recovery: { version: 1, vendor: 'heidelberg', paper: UNKNOWN_FRAME, fields: resolved },
    invoice: { invoice_number: '1042', invoice_date: '2026-09-14', return_date: '', truck_number: '', bill_to: { name: 'ILLINOIS BULK CARRIER', address_lines: ['', ''], phone: '' } },
    source: { file_name: 'scan.jpg', sha256: 'a'.repeat(64), size: 1, type: 'image/jpeg', kind: 'upload' },
    original_stored: true,
    ocr_text: '',
    customer_profile_id: null,
    truck_id: null,
    invoice_batch_id: 'batch-2026-09-14',
    reviewed_at: null,
    ...patch,
  };
};

const customer = (name: string, addresses: string[], ids: string[] = [], aliases: string[] = []): CustomerProfile => ({
  id: name.length, name, ticket_customer_ids: ids, ticket_names: aliases, addresses,
  flat_rate: 85, rate_type: 'flat', fuel_charge: null, notes: '', created_at: '2026-01-01T00:00:00.000Z',
});
const five = customer(FIVE, [MARKHAM, STRAWBERRY], ['60311596']);
const iafrate = customer(IAFRATE, [], ['60350616']);
const profiles = (customers: CustomerProfile[]) => ({ customers, trucks: [], clients: [] });

const sort = (records: SavedRecord[], customers: CustomerProfile[]) => {
  const knowledge = knowledgeOf([], profiles(customers));
  const members = membersOf(records.filter(needsReview), knowledge, (r) => validateTicket(r.ticket, r.recovery));
  return { members, groups: groupExceptions(members) };
};

void test('ten tickets from a known job go through with nobody looking', () => {
  const records = Array.from({ length: 10 }, () => read({}));
  const { members, groups } = sort(records, [five]);
  assert.ok(members.every((m) => m.report.outcome === 'auto_approved'));
  assert.deepEqual(groups, []);
});

void test('ten tickets from a new job site are not a question', () => {
  const records = Array.from({ length: 10 }, () => read({ project_address: JOLIET }));
  const { members, groups } = sort(records, [five]);
  assert.ok(members.every((m) => m.report.outcome === 'auto_approved'), 'a site read whole stands');
  assert.deepEqual(groups, []);
  // Nothing is learned from the scan on its own: a site is saved by a person.
});

void test('a scan of several jobs, known and new, is no question at all when the customers are known', () => {
  const records = [
    ...Array.from({ length: 8 }, () => read({})),
    ...Array.from({ length: 6 }, () => read({ project_address: STRAWBERRY })),
    ...Array.from({ length: 4 }, () => read({ customer_name: IAFRATE, customer_id: '60350616', project_address: JOLIET })),
    ...Array.from({ length: 3 }, () => read({ project_address: '9 ELM ST, PEORIA, IL' })),
  ];
  const { members, groups } = sort(records, [five, iafrate]);
  assert.equal(members.filter((m) => m.report.outcome === 'auto_approved').length, 21);
  assert.deepEqual(groups, []);
});

void test('two unknown customers at one site are two questions, one per customer, and the site is theirs', () => {
  const records = [
    ...Array.from({ length: 3 }, () => read({ customer_name: 'NORTH HAULING', customer_id: '70000001', project_address: JOLIET })),
    ...Array.from({ length: 2 }, () => read({ customer_name: 'SOUTH HAULING', customer_id: '70000002', project_address: JOLIET })),
  ];
  const { groups } = sort(records, [five]);
  assert.equal(groups.length, 2);
  assert.ok(groups.every((g) => g.type === 'NEW_CUSTOMER'));
  assert.ok(groups.every((g) => g.asks.length === 1 && g.asks[0] === 'customer_name'), 'only the customer is asked');
  const byName = (a: string | null, b: string | null) => String(a).localeCompare(String(b));
  assert.deepEqual(groups.map((g) => g.customer).sort(byName), ['NORTH HAULING', 'SOUTH HAULING']);
});

const observedWhole = (fields: Partial<Record<keyof Ticket, string>>): ObservedTicket => ({
  fields: Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, { visible: v, proposed: null, clipped_edge: null, partial: false } satisfies ObservedField]),
  ),
  timestamps: [], branding: 'Heidelberg Materials', paper_edges: null,
});

void test('a clipped site is settled by the tickets beside it agreeing, and what is on file', () => {
  const siblings = Array.from({ length: OUTCOME_POLICY.consensusMinTickets }, () => ({
    ticket: { ...emptyTicket(), customer_id: '60311596', customer_name: FIVE, project_address: 'MARKHAM, IL 60428' },
    observed: observedWhole({ customer_id: '60311596', customer_name: FIVE, project_address: 'MARKHAM, IL 60428' }),
  }));
  const clipped: ObservedTicket = {
    ...observedWhole({ customer_id: '60311596', customer_name: FIVE }),
    fields: {
      ...observedWhole({ customer_id: '60311596', customer_name: FIVE }).fields,
      project_address: { visible: 'ARKHAM, IL 60428', proposed: null, clipped_edge: 'left', partial: true },
    },
  };
  // Nothing on any profile, only the scan and reviewed history: consensus and
  // history together clear the bar that neither clears alone.
  const history = Array.from({ length: 2 }, () => read({ project_address: 'MARKHAM, IL 60428' }, {}, { reviewed_at: '2026-09-13T10:00:00.000Z' }));
  const { ticket, recovery } = recoverTicket({
    observed: clipped, paper: UNKNOWN_FRAME, extracted: { ...emptyTicket(), customer_id: '60311596', customer_name: FIVE },
    records: history, profiles: profiles([customer(FIVE, [], ['60311596'])]), customer: customer(FIVE, [], ['60311596']), others: siblings,
  });
  assert.equal(recovery.fields.project_address?.status, 'recovered');
  assert.equal(ticket.project_address, 'MARKHAM, IL 60428');
  assert.ok(recovery.fields.project_address?.evidence.some((line) => /other tickets in this upload/.test(line)));
  // The same clipped ticket with only the scan behind it is not settled by the scan alone.
  const alone = recoverTicket({
    observed: clipped, paper: UNKNOWN_FRAME, extracted: { ...emptyTicket(), customer_id: '60311596', customer_name: FIVE },
    records: [], profiles: profiles([customer(FIVE, [], ['60311596'])]), customer: customer(FIVE, [], ['60311596']), others: siblings,
  });
  assert.equal(alone.recovery.fields.project_address?.status, 'needs_review');
});

void test('a ticket that plainly says another site keeps it', () => {
  const records = [...Array.from({ length: 9 }, () => read({})), read({ project_address: JOLIET })];
  const { members, groups } = sort(records, [five]);
  assert.ok(members.every((m) => m.report.outcome === 'auto_approved'));
  assert.deepEqual(groups, []);
  assert.equal(members[9].ticket.project_address, JOLIET, 'not pulled into the majority');
});

void test('an unreadable BOL holds its own ticket and nothing else', () => {
  const records = [
    ...Array.from({ length: 48 }, () => read({})),
    read({}, { ticket_number: waiting('17254464', { reason: 'partial_numeric', clipped_edge: 'right' }) }),
    read({}, { net_lb: waiting('45,8', { reason: 'partial_numeric', clipped_edge: 'right' }) }),
  ];
  const { members, groups } = sort(records, [five]);
  assert.equal(members.filter((m) => m.report.outcome === 'auto_approved').length, 48);
  assert.equal(groups.length, 2);
  assert.ok(groups.every((g) => g.type === 'INDIVIDUAL_CRITICAL_FIELD' && g.ticketIds.length === 1));
});

void test('a new customer is one question for all their tickets, with the print shown', () => {
  const records = Array.from({ length: 5 }, () => read({ customer_name: 'NEW HAULING LLC', customer_id: '70000001', project_address: JOLIET }));
  const { groups } = sort(records, [five]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].type, 'NEW_CUSTOMER');
  assert.equal(groups[0].customerProfileId, null);
  assert.equal(groups[0].detected.customer_name, 'NEW HAULING LLC');
  assert.equal(groups[0].ticketIds.length, 5);
});

void test('a known job written differently is still the known job', () => {
  const aliased = customer('Five Const Corp', ['Markham IL 60428, 222 Western Ave'], [], ['FIVE CONST. CORP']);
  const records = Array.from({ length: 3 }, () => read({ customer_id: null, customer_name: 'FIVE CONST. CORP', project_address: 'MARKHAM IL 60428, 222 WESTERN AVE' }));
  const { members } = sort(records, [aliased]);
  assert.ok(members.every((m) => m.report.outcome === 'auto_approved'), 'case, punctuation and spacing are not differences');
});

void test('an ambiguous or conflicting site is never a question: the print stands, the choices are on the record', () => {
  const ambiguous = read({}, { project_address: waiting('ARKHAM, IL', { reason: 'ambiguous_candidates', candidates: [MARKHAM, '5 MAIN ST, MARKHAM, IL'] }) });
  const conflicting = read({}, { project_address: waiting('MARKHAM, IL', { reason: 'conflicting_evidence', candidates: [MARKHAM, JOLIET] }) });
  const { members, groups } = sort([ambiguous, conflicting], [five]);
  assert.deepEqual(groups, []);
  assert.ok(members.every((m) => m.report.outcome === 'auto_approved'));
  assert.ok(!validateTicket(ambiguous.ticket, ambiguous.recovery).some((issue) => /destination|project/i.test(issue)), 'not listed as an issue');
  assert.deepEqual(ambiguous.recovery?.fields.project_address?.candidates, [MARKHAM, '5 MAIN ST, MARKHAM, IL']);
});

void test('one answer settles every ticket of a new customer’s group, and teaches the customer', () => {
  const records = Array.from({ length: 7 }, () => read({ customer_name: 'NEW HAULING LLC', customer_id: '70000001', project_address: JOLIET }));
  const { groups } = sort(records, [five]);
  const [group] = groups;
  assert.equal(group.type, 'NEW_CUSTOMER');
  const created = customer('NEW HAULING LLC', [JOLIET], ['70000001']);
  const at = '2026-09-20T12:00:00.000Z';
  const edits = applyGroupAnswer(records, group, {
    values: { customer_name: created.name },
    customerProfileId: created.id,
    // Rates are per job site; this site already has one on the profile.
    customer: { ...created, location_rates: [{ address: JOLIET, flat_rate: 95, fuel_charge: null }] },
  }, at);
  assert.equal(edits.length, 7);
  for (const edit of edits) {
    assert.equal(edit.ticket.customer_name, created.name);
    assert.equal(edit.customer_profile_id, created.id);
    assert.equal(edit.invoice.invoice_number, '1042', 'the invoice it is on is untouched');
    assert.equal(edit.recovery?.fields.customer_name?.status, 'confirmed');
    assert.ok(edit.recovery?.fields.customer_name?.evidence.at(-1)?.includes('Confirmed once for 7 tickets'));
    assert.equal(edit.ticket.rate, 95, 'charged as this site is charged');
  }
  // The edits are what the server accepts, and saving them marks the tickets checked.
  const parsed = parseRecordEdits(edits);
  assert.ok('value' in parsed);
  const saved = applyRecordEdit(records[0], parsed.value[0], at);
  assert.equal(saved.reviewed_at, at);
  // Learned: with the customer on file, the next scan from them is nobody's question.
  const again = sort(Array.from({ length: 3 }, () => read({ customer_name: 'NEW HAULING LLC', customer_id: '70000001', project_address: JOLIET })), [five, created]);
  assert.deepEqual(again.groups, []);
});

void test('the approval mark takes a ticket off the list and is the app’s own, not a person’s', () => {
  const record = read({});
  const edit = parseRecordEdits([{
    id: record.id, ticket: record.ticket, invoice: record.invoice, ocr_text: '', customer_profile_id: null, truck_id: null,
    bookkeeping: true, auto_approved_at: '2026-09-20T12:00:00.000Z',
  }]);
  assert.ok('value' in edit);
  const approved = applyRecordEdit(record, edit.value[0], '2026-09-20T12:00:01.000Z');
  assert.equal(approved.auto_approved_at, '2026-09-20T12:00:00.000Z');
  assert.equal(approved.reviewed_at, null);
  assert.equal(needsReview(approved), false);
  assert.equal(needsReview(record), true);
  assert.ok('error' in parseRecordEdits([{ ...edit.value[0], auto_approved_at: 'yesterday' }]), 'not a time, not accepted');
});

void test('chronological numbering is unchanged by any of this', () => {
  const onFile = read({ ticket_date: '2026-09-10' }, {}, { invoice_batch_id: 'batch-2026-09-10', invoice: { invoice_number: '7', invoice_date: '2026-09-10', return_date: '', truck_number: '', bill_to: { name: '', address_lines: ['', ''], phone: '' } } });
  const later = read({ ticket_date: '2026-09-14' }, {}, { invoice_batch_id: 'batch-2026-09-14', invoice: { invoice_number: 'DRAFT-batch-2026-09-14', invoice_date: '2026-09-14', return_date: '', truck_number: '', bill_to: { name: '', address_lines: ['', ''], phone: '' } } });
  const earlier = read({ ticket_date: '2026-09-12' }, {}, { invoice_batch_id: 'batch-2026-09-12', invoice: { invoice_number: 'DRAFT-batch-2026-09-12', invoice_date: '2026-09-12', return_date: '', truck_number: '', bill_to: { name: '', address_lines: ['', ''], phone: '' } } });
  const wanted = numbersByTicketDate([onFile, later, earlier], ['batch-2026-09-14', 'batch-2026-09-12']);
  assert.equal(wanted.get('batch-2026-09-12'), '8');
  assert.equal(wanted.get('batch-2026-09-14'), '9');
});

void test('the session carries what is left to ask, for the bar on every other page', () => {
  clearDesk();
  assert.deepEqual(deskSnapshot().needsInput, { groups: 0, tickets: 0 });
  setDeskField('needsInput', { groups: 1, tickets: 2 });
  assert.deepEqual(deskSnapshot().needsInput, { groups: 1, tickets: 2 });
  clearDesk();
});

void test('a ticket filed before automatic checking is still a person’s to look at', () => {
  const old = { ...read({}), recovery: undefined };
  const report = ticketOutcome(old.ticket, undefined, knowledgeOf([], profiles([five])), []);
  assert.equal(report.outcome, 'individual_review');
});

// --- the address is on file: it is never a check --------------------------

void test('a cut-off address matched to the customer’s saved site passes without a check', () => {
  // The resolver's threshold is the bar. A second bar on the confidence
  // figure once sat just above what a profile match scores, and an address
  // the workspace had on file still came up as something to check.
  const recovered: FieldResolution = {
    status: 'recovered', value: MARKHAM, visible_text: 'ARKHAM, IL 60428 US', source: 'verified_profile',
    source_clipped: true, clipped_edge: 'left', confidence: 0.72, evidence: ['Known job site for FIVE CONST CORP: 222 WESTERN AVE, MARKHAM, IL 60428 (saved on a profile)'],
  };
  const records = Array.from({ length: 4 }, () => read({ project_address: MARKHAM }, { project_address: recovered }));
  const { members, groups } = sort(records, [five]);
  assert.ok(members.every((m) => m.report.outcome === 'auto_approved'), 'recovered is settled');
  assert.deepEqual(groups, []);
});

void test('the dates are asked first and inline, and dating a ticket sends it back through the sorting', () => {
  const undated = read({ ticket_date: null }, { ticket_date: waiting('', { reason: 'not_read', clipped_edge: null, source_clipped: false }) }, {
    invoice_batch_id: 'batch-undated',
    invoice: { invoice_number: 'DRAFT-batch-undated', invoice_date: '2026-09-14', return_date: '', truck_number: '', bill_to: { name: '', address_lines: ['', ''], phone: '' } },
  });
  const unclearProject = Array.from({ length: 3 }, () => read({}, { project_name: waiting('MARKHAM PL') }));
  const { members, groups } = sort([...unclearProject, undated], [five]);
  assert.equal(groups[0].needsDate, true, 'the date comes first');
  assert.equal(groups[0].ticketIds[0], undated.id);
  // Three tickets with an unclear project on a known job are no question at
  // all: the project is never asked, and what printed stands.
  assert.equal(groups.length, 1);
  assert.ok(members.filter((m) => m.id !== undated.id).every((m) => m.report.outcome === 'auto_approved'));

  // The date, typed once: the ticket is dated, joins that day's invoice with
  // the other tickets of that day, and is not marked reviewed — it goes back
  // through the sorting, where its job's question is the only one left.
  const all = [...unclearProject, undated];
  const edit = dateEdit(undated, '2026-09-14', all);
  assert.equal(edit.ticket.ticket_date, '2026-09-14');
  assert.equal(edit.invoice.invoice_number, '1042', 'joined the invoice already filed for that day');
  assert.equal(edit.invoice_batch_id, 'batch-2026-09-14');
  assert.equal(edit.bookkeeping, true);
  assert.equal(edit.recovery?.fields.ticket_date?.status, 'confirmed');
  const dated = applyRecordEdit(undated, edit, '2026-09-20T12:00:00.000Z');
  assert.equal(dated.reviewed_at, null);
  const after = sort([...unclearProject, dated], [five]);
  assert.deepEqual(after.groups, [], 'dated, it passes with the rest');
});

void test('a dispatch number the reader could not make out is never a question', () => {
  const records = [
    read({}, { dispatch_number: waiting('5582', { reason: 'partial_numeric', clipped_edge: 'right' }) }),
    read({}, { dispatch_number: waiting('', { reason: 'not_read', clipped_edge: null }) }),
  ];
  const { members, groups } = sort(records, [five]);
  assert.ok(members.every((m) => m.report.outcome === 'auto_approved'));
  assert.deepEqual(groups, []);
  for (const record of records) {
    assert.ok(!validateTicket(record.ticket, record.recovery).some((issue) => /dispatch/i.test(issue)));
  }
});

void test('a ticket whose date was never read at all is a date question, asked inline', () => {
  const none = read({ ticket_date: null }, { ticket_date: { status: 'missing', value: null, visible_text: null, source: null, source_clipped: false, clipped_edge: null, confidence: 0, evidence: [] } });
  const { groups } = sort([none], [five]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].type, 'INDIVIDUAL_CRITICAL_FIELD');
  assert.equal(groups[0].needsDate, true, 'the panel offers the date box, not only the review');
  assert.deepEqual(groups[0].asks, ['ticket_date']);
});
