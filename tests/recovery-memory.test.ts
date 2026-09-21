import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  batchEvidence,
  buildMemory,
  memoryEvidence,
  type WorkspaceMemory,
} from '../lib/load-desk/recovery/memory.ts';
import {
  UNKNOWN_FRAME,
  type ClippedEdge,
  type Evidence,
  type FieldResolution,
  type ObservedField,
  type ObservedTicket,
  type TicketRecovery,
} from '../lib/load-desk/recovery/contract.ts';
import type { ClientProfile, CustomerProfile, TruckProfile } from '../lib/load-desk/profiles.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

const ticketOf = (fields: Partial<Ticket>): Ticket => ({ ...emptyTicket(), ...fields });

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
  source: { file_name: 'loads.pdf', sha256: 'a'.repeat(64), size: 10, type: 'application/pdf', kind: 'upload' },
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

const recoveryOf = (
  fields: TicketRecovery['fields'],
  vendor: string | null = null,
): TicketRecovery => ({ version: 1, vendor, paper: UNKNOWN_FRAME, fields });

const whole = (visible: string): ObservedField => ({
  visible,
  proposed: null,
  clipped_edge: null,
  partial: false,
});
const clipped = (visible: string, edge: ClippedEdge = 'left'): ObservedField => ({
  visible,
  proposed: null,
  clipped_edge: edge,
  partial: true,
});
const observedOf = (fields: ObservedTicket['fields']): ObservedTicket => ({
  fields,
  timestamps: [],
  branding: null,
  paper_edges: null,
});

const customerProfile = (over: Partial<CustomerProfile>): CustomerProfile => ({
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

const truckProfile = (truck_number: string): TruckProfile => ({
  id: 1,
  truck_number,
  nickname: '',
  driver: '',
  license_plate: '',
  notes: '',
  active: true,
  created_at: '2026-01-01T00:00:00.000Z',
});

const noProfiles = { customers: [] as CustomerProfile[], trucks: [] as TruckProfile[], clients: [] as ClientProfile[] };

const valuesOf = (memory: WorkspaceMemory, field: keyof Ticket) =>
  (memory.values.get(field) ?? []).map((known) => known.value).sort();

const forField = (evidence: Evidence[], field: keyof Ticket) =>
  evidence.filter((item) => item.field === field);

const IAFRATE = 'ANGELO IAFRATE CONSTRUCTION';

const hauled = (over: Partial<Ticket> = {}) =>
  saved({
    plant_name: 'U857 CHICAGO',
    customer_name: IAFRATE,
    customer_id: '60311596',
    project_name: 'LINCOLN HIGHWAY',
    project_address: 'MARKHAM, IL',
    product_code: 'CA6',
    product_description: 'CRUSHED LIMESTONE',
    carrier_name: 'ILLINOIS BULK CARRIER',
    vehicle_id: '3211',
    ...over,
  });

void test('only a ticket somebody reviewed, or the reader saw whole, teaches the workspace anything', () => {
  const memory = buildMemory(
    [
      saved({ project_address: 'MARKHAM, IL' }),
      // Filed by the app before anyone opened it, with no record of how it
      // was read: reviewed_at is an explicit null, which is what filing
      // unreviewed writes (and what the server stores for a missing value).
      saved({ project_address: 'JOLIET, IL' }, { reviewed: false }),
      // Saved before the reviewed mark existed, when the review screen was the
      // only way to save: the key is absent, and that is a person's save.
      { ...saved({ project_address: 'PEORIA, IL' }), reviewed_at: undefined },
    ],
    noProfiles,
  );
  assert.deepEqual(valuesOf(memory, 'project_address'), ['MARKHAM, IL', 'PEORIA, IL']);
});

void test('a field still in question, or recovered by the app alone, is not learned', () => {
  const memory = buildMemory(
    [
      saved(
        {
          project_address: 'MARKHAM, IL',
          plant_name: 'U857 CHICAGO',
          product_code: 'CA6',
          customer_name: 'WITECH COMPANY INC',
          carrier_name: 'ILLINOIS BULK CARRIER',
        },
        {
          recovery: recoveryOf({
            // A person has not settled this one, so it is not a fact yet.
            project_address: resolution({ status: 'needs_review', value: 'MARKHAM, IL' }),
            // The app completed this itself and nobody has agreed.
            plant_name: resolution({ status: 'recovered', value: 'U857 CHICAGO' }),
            // The app completed this one too, and a person accepted it.
            product_code: resolution({ status: 'recovered', value: 'CA6', confirmed_by_user: true }),
            customer_name: resolution({ status: 'missing', value: null }),
            // Read whole off the paper.
            carrier_name: resolution({ status: 'exact', value: 'ILLINOIS BULK CARRIER' }),
          }),
        },
      ),
    ],
    noProfiles,
  );
  assert.deepEqual(valuesOf(memory, 'project_address'), []);
  assert.deepEqual(valuesOf(memory, 'plant_name'), []);
  assert.deepEqual(valuesOf(memory, 'product_code'), ['CA6']);
  assert.deepEqual(valuesOf(memory, 'customer_name'), []);
  assert.deepEqual(valuesOf(memory, 'carrier_name'), ['ILLINOIS BULK CARRIER']);
});

void test('profiles are verified without a ticket, and no profile invents a carrier', () => {
  const memory = buildMemory([], {
    customers: [
      customerProfile({
        name: 'Angelo Iafrate Construction',
        ticket_names: ['ANGELO IAFRATE CONST CO'],
        ticket_customer_ids: ['60311596'],
        addresses: ['Markham, IL'],
      }),
    ],
    trucks: [truckProfile('3211')],
    clients: [
      { id: 1, name: 'Illinois Bulk Carrier', address_lines: ['', ''], phone: '', notes: '', created_at: '' },
    ],
  });
  assert.deepEqual(valuesOf(memory, 'customer_name'), [
    'ANGELO IAFRATE CONST CO',
    'Angelo Iafrate Construction',
  ]);
  assert.deepEqual(valuesOf(memory, 'customer_id'), ['60311596']);
  assert.deepEqual(valuesOf(memory, 'project_address'), ['Markham, IL']);
  assert.deepEqual(valuesOf(memory, 'vehicle_id'), ['3211']);
  // Nothing on a client is printed on a plant ticket, and no profile anywhere
  // records a carrier or a weighmaster.
  assert.deepEqual(valuesOf(memory, 'carrier_name'), []);
  assert.deepEqual(valuesOf(memory, 'weighmaster'), []);
  for (const list of memory.values.values()) {
    for (const known of list) assert.equal(known.source, 'verified_profile');
  }
});

void test('the same value spelled two ways is one value, in the spelling somebody saved', () => {
  const memory = buildMemory([hauled(), hauled({ project_address: 'markham,   il' })], {
    ...noProfiles,
    customers: [customerProfile({ addresses: ['Markham, IL'] })],
  });
  const addresses = memory.values.get('project_address') ?? [];
  assert.equal(addresses.length, 1);
  assert.equal(addresses[0].value, 'Markham, IL', 'the profile spelling stands');
  assert.equal(addresses[0].source, 'verified_profile');
  assert.equal(addresses[0].count, 3, 'one profile entry and two reviewed tickets');
  assert.deepEqual([...addresses[0].customers], ['ANGELO IAFRATE CONSTRUCTION']);
});

void test('the pairs reviewed tickets keep making are counted', () => {
  const memory = buildMemory([hauled(), hauled(), hauled({ project_name: 'HALSTED VIADUCT' })], noProfiles);
  const find = (kind: string, to: string) =>
    memory.relationships.find((link) => link.kind === kind && link.to === to);
  assert.equal(find('customer_address', 'MARKHAM, IL')?.count, 3);
  assert.equal(find('customer_address', 'MARKHAM, IL')?.field, 'project_address');
  assert.equal(find('customer_project', 'LINCOLN HIGHWAY')?.count, 2);
  assert.equal(find('customer_project', 'HALSTED VIADUCT')?.count, 1);
  assert.equal(find('customer_id', '60311596')?.count, 3);
  assert.equal(find('plant_product', 'CA6')?.count, 3);
  assert.equal(find('carrier_truck', '3211')?.count, 3);
  assert.equal(find('product_code_description', 'CRUSHED LIMESTONE')?.count, 3);
  assert.equal(find('project_address', 'MARKHAM, IL')?.from, 'LINCOLN HIGHWAY');
  // An unreviewed ticket pairs nothing.
  const unreviewed = buildMemory([saved({ customer_name: 'X CO', project_name: 'Y' }, { reviewed: false })], noProfiles);
  assert.deepEqual(unreviewed.relationships, []);
});

void test('what a person typed over is kept with the context it was typed in', () => {
  const memory = buildMemory(
    [
      hauled({}),
      saved(
        { customer_name: 'WITECH COMPANY INC', project_name: 'ROUTE 30', project_address: 'MARKHAM, IL' },
        {
          recovery: recoveryOf(
            {
              project_address: resolution({
                status: 'confirmed',
                value: 'MARKHAM, IL',
                visible_text: 'ARKHAM, IL',
                clipped_edge: 'left',
                confirmed_by_user: true,
              }),
              // Accepted as read: nothing was corrected here.
              product_code: resolution({
                status: 'confirmed',
                value: 'CA6',
                visible_text: 'CA6',
                confirmed_by_user: true,
              }),
            },
            'heidelberg',
          ),
        },
      ),
    ],
    noProfiles,
  );
  assert.equal(memory.corrections.length, 1);
  assert.deepEqual(memory.corrections[0], {
    field: 'project_address',
    vendor: 'heidelberg',
    clipped_edge: 'left',
    visible_text: 'ARKHAM, IL',
    confirmed_value: 'MARKHAM, IL',
    customer: 'WITECH COMPANY INC',
    project: 'ROUTE 30',
    at: '2026-09-15T10:00:00.000Z',
  });
});

void test('a verified value that fits the visible print is offered, strongest from a profile', () => {
  const memory = buildMemory([hauled(), hauled()], {
    ...noProfiles,
    customers: [customerProfile({ addresses: ['MARKHAM, IL'] })],
  });
  const evidence = memoryEvidence(
    memory,
    observedOf({ project_address: clipped('ARKHAM, IL') }),
    { vendor: null, customer: IAFRATE, project: null },
  );
  const profile = evidence.find((item) => item.source === 'verified_profile');
  assert.ok(profile);
  assert.equal(profile.field, 'project_address');
  assert.equal(profile.candidate, 'MARKHAM, IL');
  assert.equal(profile.strength, 'strong');
  assert.match(profile.note, /^Known verified location: MARKHAM, IL \(saved on a profile for ANGELO IAFRATE CONSTRUCTION\)$/);
  const related = evidence.find((item) => item.source === 'historical_relationship');
  assert.ok(related);
  assert.equal(related.strength, 'strong', 'two reviewed tickets and no other site');
  assert.equal(related.note, 'ANGELO IAFRATE CONSTRUCTION hauled to MARKHAM, IL on 2 reviewed tickets');
  assert.equal(related.context?.customer, IAFRATE);
});

void test('a value seen once is weak, and everything that fits is offered for the resolver to weigh', () => {
  const memory = buildMemory(
    [saved({ project_address: 'MARKHAM, IL' }), saved({ project_address: 'OLD MARKHAM, IL' })],
    noProfiles,
  );
  const evidence = forField(
    memoryEvidence(memory, observedOf({ project_address: clipped('ARKHAM, IL') }), {
      vendor: null,
      customer: null,
      project: null,
    }),
    'project_address',
  );
  const byName = (a: string[], b: string[]) => a[0].localeCompare(b[0]);
  assert.deepEqual(
    evidence.map((item) => [item.candidate, item.strength, item.source]).sort(byName),
    [
      ['MARKHAM, IL', 'weak', 'verified_history'],
      ['OLD MARKHAM, IL', 'weak', 'verified_history'],
    ].sort(byName),
  );
  // Seen twice, the same value carries more weight — once it is somebody's.
  // A job site is a customer's fact, so the two sightings have to name the
  // customer for the count to mean anything; with nobody named it stays weak.
  const again = buildMemory(
    [
      saved({ project_address: 'MARKHAM, IL', customer_name: IAFRATE }),
      saved({ project_address: 'MARKHAM, IL', customer_name: IAFRATE }),
    ],
    noProfiles,
  );
  const twice = forField(
    memoryEvidence(again, observedOf({ project_address: clipped('ARKHAM, IL') }), {
      vendor: null,
      customer: IAFRATE,
      project: null,
    }),
    'project_address',
  ).filter((item) => item.source === 'verified_history');
  assert.equal(twice[0].strength, 'moderate');
  assert.equal(twice[0].context?.customer, IAFRATE);
  assert.match(twice[0].note, /seen on 2 reviewed tickets/);
});

void test('a customer with two job sites has not told us which one this load went to', () => {
  const memory = buildMemory(
    [hauled(), hauled(), hauled({ project_address: 'MARKHAM HEIGHTS, IL' })],
    noProfiles,
  );
  const related = memoryEvidence(
    memory,
    observedOf({ project_address: clipped('ARKHAM HEIGHTS, IL') }),
    { vendor: null, customer: IAFRATE, project: null },
  ).filter((item) => item.source === 'historical_relationship');
  assert.equal(related.length, 1);
  assert.equal(related[0].strength, 'moderate');
});

void test('a customer the workspace has never seen brings no relationship evidence', () => {
  const memory = buildMemory([hauled(), hauled()], noProfiles);
  const evidence = memoryEvidence(
    memory,
    observedOf({ project_address: clipped('ARKHAM, IL') }),
    { vendor: null, customer: 'SOMEBODY ELSE INC', project: null },
  );
  assert.deepEqual(evidence.filter((item) => item.source === 'historical_relationship'), []);
  // The history itself still stands on its own, unattached to any customer.
  assert.equal(evidence.filter((item) => item.source === 'verified_history').length, 1);
});

void test('a correction comes back in its own context and nowhere else', () => {
  const correction = (customer: string) =>
    saved(
      { customer_name: customer, project_address: 'MARKHAM, IL' },
      {
        recovery: recoveryOf(
          {
            project_address: resolution({
              status: 'confirmed',
              value: 'MARKHAM, IL',
              visible_text: 'ARKHAM, IL',
              clipped_edge: 'left',
              confirmed_by_user: true,
            }),
          },
          'heidelberg',
        ),
      },
    );
  const memory = buildMemory([correction(IAFRATE)], noProfiles);
  const observed = observedOf({ project_address: clipped('ARKHAM, IL') });

  const here = memoryEvidence(memory, observed, { vendor: 'heidelberg', customer: IAFRATE, project: null })
    .filter((item) => item.source === 'user_correction');
  assert.equal(here.length, 1);
  assert.equal(here[0].strength, 'strong');
  assert.equal(here[0].candidate, 'MARKHAM, IL');
  assert.equal(here[0].note, 'You corrected “ARKHAM, IL” to “MARKHAM, IL” before for this customer');
  assert.equal(here[0].context?.customer, IAFRATE);

  const elsewhere = memoryEvidence(memory, observed, {
    vendor: 'heidelberg',
    customer: 'WITECH COMPANY INC',
    project: null,
  });
  assert.deepEqual(elsewhere.filter((item) => item.source === 'user_correction'), []);

  // Another supplier's layout prints something else at that edge.
  const otherVendor = memoryEvidence(memory, observed, { vendor: 'ozinga', customer: IAFRATE, project: null });
  assert.deepEqual(otherVendor.filter((item) => item.source === 'user_correction'), []);

  // Cut on the other side, it is not the same reading.
  const otherEdge = memoryEvidence(
    memory,
    observedOf({ project_address: clipped('ARKHAM, IL', 'right') }),
    { vendor: 'heidelberg', customer: IAFRATE, project: null },
  );
  assert.deepEqual(otherEdge.filter((item) => item.source === 'user_correction'), []);

  // A correction made with no customer on the ticket is only ever moderate.
  const loose = buildMemory([{ ...correction(IAFRATE), ticket: ticketOf({ project_address: 'MARKHAM, IL' }) }], noProfiles);
  const anywhere = memoryEvidence(loose, observed, { vendor: 'heidelberg', customer: 'WITECH COMPANY INC', project: null })
    .filter((item) => item.source === 'user_correction');
  assert.equal(anywhere.length, 1);
  assert.equal(anywhere[0].strength, 'moderate');
  assert.equal(anywhere[0].note, 'You corrected “ARKHAM, IL” to “MARKHAM, IL” before');
});

void test('history never completes an identifier, except a customer number its customer owns', () => {
  const memory = buildMemory([hauled(), hauled()], {
    ...noProfiles,
    customers: [customerProfile({ ticket_customer_ids: ['60311596'] })],
  });
  const evidence = memoryEvidence(
    memory,
    observedOf({
      customer_name: whole(IAFRATE),
      customer_id: clipped('311596'),
      ticket_number: clipped('254464'),
      order_number: clipped('208257'),
    }),
    { vendor: null, customer: null, project: null },
  );
  const numbers = forField(evidence, 'customer_id');
  assert.equal(numbers.length, 1, 'only the relationship, never the value on file');
  assert.equal(numbers[0].source, 'historical_relationship');
  assert.equal(numbers[0].candidate, '60311596');
  assert.equal(numbers[0].strength, 'strong');
  assert.deepEqual(forField(evidence, 'ticket_number'), []);
  assert.deepEqual(forField(evidence, 'order_number'), []);

  // Two customer numbers on file for one customer is a question, not an answer.
  const ambiguous = buildMemory([hauled(), hauled({ customer_id: '60311597' })], noProfiles);
  assert.deepEqual(
    forField(
      memoryEvidence(ambiguous, observedOf({ customer_name: whole(IAFRATE), customer_id: clipped('311596') }), {
        vendor: null,
        customer: null,
        project: null,
      }),
      'customer_id',
    ),
    [],
  );
});

void test('two characters of print are not enough to go on', () => {
  const memory = buildMemory([hauled(), hauled()], noProfiles);
  const context = { vendor: null, customer: IAFRATE, project: null };
  assert.deepEqual(memoryEvidence(memory, observedOf({ project_address: clipped(', IL') }), context), []);
  // And a field the reader saw whole is not argued with.
  assert.deepEqual(memoryEvidence(memory, observedOf({ project_address: whole('JOLIET, IL') }), context), []);
  // Nor is a field that was never observed at all.
  assert.deepEqual(memoryEvidence(memory, observedOf({}), context), []);
});

void test('a customer read whole by its number is enough to look its sites up by', () => {
  const memory = buildMemory([hauled(), hauled()], noProfiles);
  const evidence = memoryEvidence(
    memory,
    observedOf({ customer_id: whole('60311596'), project_address: clipped('ARKHAM, IL') }),
    { vendor: null, customer: null, project: null },
  );
  const related = evidence.filter((item) => item.source === 'historical_relationship');
  assert.equal(related.length, 1);
  assert.equal(related[0].candidate, 'MARKHAM, IL');
});

const upload = () => [
  {
    ticket: ticketOf({
      ticket_number: 'T2',
      order_number: '6100208257',
      customer_id: '60311596',
      customer_name: IAFRATE,
      project_address: 'MARKHAM, IL',
    }),
  },
  {
    ticket: ticketOf({
      ticket_number: 'T3',
      order_number: '7700000000',
      customer_id: '99999999',
      project_address: 'JOLIET, IL',
    }),
  },
];

void test('a blank field is spoken for by a ticket of the same order, and by nothing else', () => {
  const observed = observedOf({
    ticket_number: whole('T1'),
    order_number: whole('6100208257'),
    customer_id: whole('60311596'),
  });
  const addresses = forField(batchEvidence(upload(), observed), 'project_address');
  assert.equal(addresses.length, 1, 'the other job in the upload does not cross over');
  assert.equal(addresses[0].candidate, 'MARKHAM, IL');
  assert.equal(addresses[0].source, 'batch_context');
  assert.equal(addresses[0].strength, 'strong');
  assert.equal(addresses[0].note, 'Ticket T2 with order 6100208257 reads “MARKHAM, IL”');
  assert.equal(addresses[0].context?.customer, IAFRATE);

  // Without an order number of its own, a blank field is nobody else's to fill.
  const orphan = batchEvidence(upload(), observedOf({ ticket_number: whole('T1'), customer_id: whole('60311596') }));
  assert.deepEqual(forField(orphan, 'project_address'), []);
});

void test('a fragment is matched against the upload: same customer moderate, a stranger weak', () => {
  const others = [
    ...upload(),
    { ticket: ticketOf({ ticket_number: 'T4', project_address: 'OLD MARKHAM, IL' }) },
  ];
  const evidence = forField(
    batchEvidence(others, observedOf({ customer_id: whole('60311596'), project_address: clipped('ARKHAM, IL') })),
    'project_address',
  );
  const byCandidate = new Map(evidence.map((item) => [item.candidate, item]));
  assert.equal(byCandidate.get('MARKHAM, IL')?.strength, 'moderate', 'same customer number');
  assert.equal(byCandidate.get('MARKHAM, IL')?.note, 'Ticket T2 in this upload reads “MARKHAM, IL”');
  assert.equal(byCandidate.get('OLD MARKHAM, IL')?.strength, 'weak', 'another job in the same upload');
  assert.equal(byCandidate.has('JOLIET, IL'), false, 'does not fit what is printed');
  assert.equal(evidence.length, 2);
});

void test('the batch never argues with print, and never with itself', () => {
  const mine = observedOf({ project_address: whole('JOLIET, IL'), order_number: whole('6100208257') });
  assert.deepEqual(forField(batchEvidence(upload(), mine), 'project_address'), []);

  // The ticket being resolved is in the upload too; it is not evidence for
  // itself, however the caller passes the list.
  const partial = observedOf({ order_number: whole('6100208257'), project_address: clipped('ARKHAM, IL') });
  const withSelf = [
    { ticket: ticketOf({ ticket_number: 'T1', order_number: '6100208257', project_address: 'MARKHAM, IL' }), observed: partial },
    ...upload(),
  ];
  const evidence = forField(batchEvidence(withSelf, partial), 'project_address');
  assert.equal(evidence.length, 1);
  assert.equal(evidence[0].note, 'Ticket T2 with order 6100208257 reads “MARKHAM, IL”');

  // A ticket that is itself missing part of the field has nothing to lend.
  const damaged = [
    {
      ticket: ticketOf({ ticket_number: 'T5', order_number: '6100208257', project_address: 'MARKHAM, IL' }),
      observed: observedOf({ project_address: clipped('ARKHAM, IL') }),
    },
  ];
  assert.deepEqual(
    forField(batchEvidence(damaged, observedOf({ order_number: whole('6100208257') })), 'project_address'),
    [],
  );
});

void test('memory is only ever what the caller handed over', () => {
  // The browser loads its own workspace's records and profiles, and these
  // functions read no snapshot of their own. Given one workspace's data, a
  // second workspace's cannot appear in the answer, because it was never in
  // the room: the same call with nothing returns nothing.
  const workspaceA = [hauled(), hauled()];
  const workspaceB = [
    saved({ customer_name: 'OTHER TENANT LLC', project_address: 'MILWAUKEE, WI', customer_id: '88888888' }),
  ];
  const memory = buildMemory(workspaceA, {
    ...noProfiles,
    customers: [customerProfile({ addresses: ['MARKHAM, IL'] })],
  });
  const everything = JSON.stringify([
    [...memory.values].map(([field, list]) => [field, list.map((known) => ({ ...known, customers: [...known.customers], projects: [...known.projects] }))]),
    memory.relationships,
    memory.corrections,
    memory.sequence,
  ]);
  for (const stranger of ['OTHER TENANT LLC', 'MILWAUKEE, WI', '88888888']) {
    assert.equal(everything.includes(stranger), false, stranger);
  }
  const evidence = memoryEvidence(memory, observedOf({ project_address: clipped('ILWAUKEE, WI') }), {
    vendor: null,
    customer: 'OTHER TENANT LLC',
    project: null,
  });
  assert.deepEqual(evidence, []);
  assert.deepEqual(buildMemory([], noProfiles), { values: new Map(), relationships: [], corrections: [], sequence: [] });
  // Building B's memory does not touch A's: nothing here is shared or kept.
  buildMemory(workspaceB, noProfiles);
  assert.deepEqual(valuesOf(memory, 'project_address'), ['MARKHAM, IL']);
});

// --- a job site is somebody's ---------------------------------------------

void test('a job site saved on a profile is offered to that customer and tied to them', () => {
  const memory = buildMemory([], {
    ...noProfiles,
    customers: [customerProfile({ addresses: ['MARKHAM, IL'] })],
  });
  const evidence = forField(
    memoryEvidence(
      memory,
      observedOf({ project_address: clipped('ARKHAM, IL') }),
      { vendor: null, customer: IAFRATE, project: null },
    ),
    'project_address',
  );
  const profile = evidence.filter((item) => item.source === 'verified_profile');
  assert.equal(profile.length, 1);
  assert.equal(profile[0].context?.customer, IAFRATE);
  assert.equal(profile[0].strength, 'strong');
  assert.match(profile[0].note, /for ANGELO IAFRATE CONSTRUCTION\)$/);
  // Nothing about a job site goes out untied.
  assert.ok(evidence.every((item) => item.context?.customer || item.strength === 'weak'));
});

void test('a ticket for nobody in particular gets no job site from anybody', () => {
  // The memory offers it; the resolver refuses it, because the item is tied to
  // a customer the ticket does not match. The tie is what this test pins: it
  // used to be missing, and a stranger's ticket was completed with Witech's
  // job site.
  const memory = buildMemory([hauled(), hauled()], {
    ...noProfiles,
    customers: [customerProfile({ addresses: ['MARKHAM, IL'] })],
  });
  const evidence = forField(
    memoryEvidence(
      memory,
      observedOf({ project_address: clipped('ARKHAM, IL') }),
      { vendor: null, customer: null, project: null },
    ),
    'project_address',
  );
  assert.ok(evidence.length > 0, 'the memory still speaks');
  for (const item of evidence) {
    assert.equal(item.context?.customer, IAFRATE, `${item.source} is tied to its customer`);
  }
});

void test('a customer name is the same fact whoever the ticket is for, and stays untied', () => {
  const memory = buildMemory([], {
    ...noProfiles,
    customers: [customerProfile({ name: 'ANGELO IAFRATE CONSTRUCTION' })],
  });
  const evidence = forField(
    memoryEvidence(
      memory,
      observedOf({ customer_name: clipped('IAFRATE CONSTRUCTION') }),
      { vendor: null, customer: null, project: null },
    ),
    'customer_name',
  );
  assert.equal(evidence.length, 1);
  assert.equal(evidence[0].context, undefined);
  assert.equal(evidence[0].strength, 'strong');
});

void test('a job site seen with no customer named is offered untied, and weak', () => {
  const memory = buildMemory(
    [
      saved({ project_address: 'MARKHAM, IL' }),
      saved({ project_address: 'MARKHAM, IL' }),
      saved({ project_address: 'MARKHAM, IL' }),
    ],
    noProfiles,
  );
  const evidence = forField(
    memoryEvidence(
      memory,
      observedOf({ project_address: clipped('ARKHAM, IL') }),
      { vendor: null, customer: null, project: null },
    ),
    'project_address',
  );
  assert.equal(evidence.length, 1);
  assert.equal(evidence[0].context, undefined);
  assert.equal(evidence[0].strength, 'weak', 'three sightings with nobody named do not decide');
  assert.match(evidence[0].note, /with no customer named/);
});

void test('one site seen with two customers is two pieces of evidence', () => {
  const memory = buildMemory(
    [hauled(), hauled(), hauled({ customer_name: 'WITECH COMPANY INC' }), hauled({ customer_name: 'WITECH COMPANY INC' })],
    noProfiles,
  );
  const evidence = forField(
    memoryEvidence(
      memory,
      observedOf({ project_address: clipped('ARKHAM, IL') }),
      { vendor: null, customer: 'WITECH COMPANY INC', project: null },
    ),
    'project_address',
  ).filter((item) => item.source === 'verified_history');
  assert.deepEqual(
    evidence.map((item) => item.context?.customer).sort((a, b) => String(a).localeCompare(String(b))),
    [IAFRATE, 'WITECH COMPANY INC'],
  );
});

// --- whose word counts, and how much -------------------------------------

void test('a ticket saved before the reviewed mark existed was saved by a person', () => {
  // The review screen was the only way to save then, so an absent mark is a
  // person's; only an explicit null — what filing unreviewed writes — is not.
  const before = { ...hauled({ carrier_name: 'Z FORCE TRANSPORT' }) } as SavedRecord & { reviewed_at?: string | null };
  delete before.reviewed_at;
  const memory = buildMemory([before, before, before], noProfiles);
  const carriers = memory.values.get('carrier_name') ?? [];
  assert.equal(carriers.length, 1);
  assert.equal(carriers[0].count, 3);
});

void test('what the reader saw whole on an unreviewed ticket is learned at half a sighting', () => {
  const exact = (value: string): TicketRecovery =>
    recoveryOf({
      carrier_name: resolution({ status: 'exact', value, visible_text: value, source: 'visible', confidence: 1 }),
    });
  const readWhole = [1, 2, 3, 4, 5, 6].map(() =>
    saved({ carrier_name: 'Z FORCE TRANSPORT' }, { reviewed: false, recovery: exact('Z FORCE TRANSPORT') }),
  );
  const memory = buildMemory(readWhole, noProfiles);
  const carriers = memory.values.get('carrier_name') ?? [];
  assert.equal(carriers.length, 1);
  assert.equal(carriers[0].count, 3, 'six readings say as much as three checks');
  // And that is enough, with nothing else on file, to complete the seventh.
  const evidence = forField(
    memoryEvidence(memory, observedOf({ carrier_name: clipped('Z FORCE TRANSPO', 'right') }), {
      vendor: null, customer: null, project: null,
    }),
    'carrier_name',
  );
  assert.equal(evidence.length, 1);
  assert.equal(evidence[0].strength, 'strong');
  assert.equal(evidence[0].candidate, 'Z FORCE TRANSPORT');
});

void test('an unreviewed ticket lends nothing it did not read whole', () => {
  const guessed: TicketRecovery = recoveryOf({
    carrier_name: resolution({ status: 'recovered', value: 'Z FORCE TRANSPORT', visible_text: 'Z FORCE TRANSPO', source: 'verified_history', confidence: 0.8 }),
    project_address: resolution({ status: 'needs_review', value: null, visible_text: 'ARKHAM, IL' }),
  });
  const unreviewed = saved(
    { carrier_name: 'Z FORCE TRANSPORT', project_address: 'ARKHAM, IL', customer_name: IAFRATE },
    { reviewed: false, recovery: guessed },
  );
  const memory = buildMemory([unreviewed, unreviewed, unreviewed, unreviewed], noProfiles);
  assert.equal((memory.values.get('carrier_name') ?? []).length, 0, 'a recovered value is not a reading');
  assert.equal((memory.values.get('project_address') ?? []).length, 0);
  // Nothing at all from a ticket that carries no record of how it was read.
  const bare = saved({ carrier_name: 'Z FORCE TRANSPORT' }, { reviewed: false });
  assert.equal((buildMemory([bare, bare, bare], noProfiles).values.get('carrier_name') ?? []).length, 0);
  // And no correction is ever taken from a ticket nobody reviewed.
  assert.equal(memory.corrections.length, 0);
});

// --- the plant's run of ticket numbers ------------------------------------

void test('the tickets numbered either side of this one say what day it is', () => {
  // A plant numbers its tickets in sequence. Three checked tickets a few
  // dozen numbers away, all dated the 15th, say this one is the 15th too —
  // whatever a faded digit in its own date box made the reader think.
  const onFile = [1725331380, 1725331388, 1725331402].map((n) =>
    hauled({ ticket_number: String(n), ticket_date: '2025-12-15', plant_name: 'Heidelberg Materials' }),
  );
  const memory = buildMemory(onFile, noProfiles);
  assert.equal(memory.sequence.length, 3);
  const evidence = memoryEvidence(
    memory,
    observedOf({
      ticket_number: whole('1725331394'),
      ticket_date: whole('12/13/2025'),
      plant_name: whole('Heidelberg Materials'),
    }),
    { vendor: 'heidelberg', customer: null, project: null },
  );
  const run = evidence.find((item) => item.field === 'ticket_date');
  assert.ok(run);
  assert.equal(run.candidate, '2025-12-15');
  assert.equal(run.strength, 'strong');
  assert.equal(run.source, 'verified_history');
  assert.match(run.note, /1725331380–1725331402 .* dated 2025-12-15/);
  // A run that disagrees with itself says nothing; a number far away is not in the run.
  const mixed = buildMemory([...onFile, hauled({ ticket_number: '1725331390', ticket_date: '2025-12-16', plant_name: 'Heidelberg Materials' })], noProfiles);
  assert.equal(memoryEvidence(mixed, observedOf({ ticket_number: whole('1725331394') }), { vendor: null, customer: null, project: null }).some((i) => i.field === 'ticket_date'), false);
  assert.equal(memoryEvidence(memory, observedOf({ ticket_number: whole('1725339999') }), { vendor: null, customer: null, project: null }).some((i) => i.field === 'ticket_date'), false);
  // Nor does a run learned from tickets nobody checked.
  const unchecked = buildMemory(onFile.map((r) => ({ ...r, reviewed_at: null })), noProfiles);
  assert.equal(unchecked.sequence.length, 0);
});
