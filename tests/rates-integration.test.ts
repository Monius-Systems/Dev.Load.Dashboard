import { test } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import {
  DEFAULT_RATE_PROFILE,
  invoiceReadiness,
  jobKeyOf,
  matchLines,
  missingRates,
  periodsFromMatches,
  planRequests,
  requestWording,
  type InvoiceLock,
  type NewRatePeriod,
  type RateContact,
  type RateMatch,
  type RatePeriod,
  type RecordPricing,
} from '../lib/load-desk/rates.ts';
import { invoiceGroups } from '../lib/load-desk/records.ts';
import type { RecordEdit } from '../lib/load-desk/record-input.ts';
import type { CustomerProfile } from '../lib/load-desk/profiles.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

// One week of the Rate & Fuel Agent, end to end through the real modules.
//
// Five Construction hauled to three places. Markham has a site rate typed into
// Customers and no fuel; 159th Street has nothing on file at all; I-80 was
// settled last week and is not the agent's business any more. The week runs:
// what is missing, what is asked, what the customer wrote back, what that was
// read as, what it became, and what it did to the tickets and the invoices.
//
// Nothing is mocked but the worker environment. The engine lives under
// lib/server, whose modules import `cloudflare:workers` and use TypeScript
// that strip-only mode cannot run, so the same resolver hook tests/
// rates-engine.test.ts uses is registered here: the environment and the ticket
// store are stubbed and everything under test is the real module.

const root = pathToFileURL(`${process.cwd()}/`).href;

const STUBS: Record<string, string> = {
  'cloudflare:workers': 'export const env = {};',
  '@/lib/server/load-desk-store': `
    export class StoreError extends Error {
      constructor(message, status) { super(message); this.status = status; }
    }
    export const listRecords = async () => [];
    export const listProfiles = async () => ({ customers: [], trucks: [], clients: [], company: null });
    export const updateRecords = async () => [];
    export const updateProfile = async () => {};
  `,
};

register(
  `data:text/javascript,${encodeURIComponent(`
    const root = ${JSON.stringify(root)};
    const stubs = ${JSON.stringify(STUBS)};
    export async function resolve(specifier, context, next) {
      if (stubs[specifier]) {
        return {
          url: 'data:text/javascript,' + encodeURIComponent(stubs[specifier]),
          shortCircuit: true,
          format: 'module',
        };
      }
      if (specifier.startsWith('@/')) return next(root + specifier.slice(2) + '.ts', context);
      return next(specifier, context);
    }
  `)}`,
);

const engine = await import(`${root}lib/server/rates-engine.ts`);
const { rulesOnlyLines } = await import(`${root}lib/server/rate-ai.ts`);

/** What `ticketEdits` answers with; the module itself is loaded through the hook. */
type TicketEditPlan = {
  edits: RecordEdit[];
  conflicts: { record_id: number; invoice_key: string; detail: string }[];
  kept_manual: number;
};

const ticketEdits = engine.ticketEdits as (
  records: SavedRecord[],
  customers: CustomerProfile[],
  periods: RatePeriod[],
  locks: InvoiceLock[],
  now: string,
  scope?: { customerId?: number; jobKey?: string },
) => TicketEditPlan;

// ------------------------------------------------------------- the week

const MARKHAM = '16222 Western Ave, Markham, IL';
const OAK_FOREST = '4100 159th St, Oak Forest, IL';
const I80 = '2400 E I-80 Frontage Rd, Joliet, IL';

const markhamKey = jobKeyOf(MARKHAM);
const oakForestKey = jobKeyOf(OAK_FOREST);
const i80Key = jobKeyOf(I80);

const FROM = '2026-09-14';
const TO = '2026-09-20';
const NOW = '2026-09-21T12:00:00.000Z';

/**
 * Five Construction as the desk has it: three delivery addresses, a site rate
 * typed into Customers for Markham and nothing for the other two.
 */
const customer: CustomerProfile = {
  id: 1,
  name: 'Five Construction',
  ticket_customer_ids: ['60311596'],
  ticket_names: [],
  addresses: [MARKHAM, OAK_FOREST, I80],
  location_rates: [
    { address: MARKHAM, flat_rate: 8.75, rate_type: 'per_ton', fuel_charge: null },
  ],
  flat_rate: null,
  fuel_charge: null,
  rate_profile: DEFAULT_RATE_PROFILE,
  rate_contacts: [],
  notes: '',
  created_at: '2026-01-01T00:00:00.000Z',
};
const customers = [customer];

const contact: RateContact = {
  name: 'Dave Perez',
  email: 'dave@fiveconstruction.example',
  title: 'PM',
  primary: true,
  cc: [],
  notes: '',
};

/** A saved ticket: one load, on one invoice, with whatever pricing it carries. */
function saved(
  id: number,
  address: string,
  invoiceNumber: string,
  day: number,
  ticket: Partial<Ticket> = {},
  pricing?: RecordPricing,
): SavedRecord {
  return {
    id,
    saved_at: '2026-09-20T10:00:00.000Z',
    ticket: {
      ...emptyTicket(),
      ticket_number: String(90_000 + id),
      ticket_date: `2026-09-${String(day).padStart(2, '0')}`,
      project_address: address,
      net_tons: 22.4,
      ...ticket,
    },
    invoice: {
      invoice_number: invoiceNumber,
      invoice_date: '2026-09-21',
      return_date: '2026-09-21',
      truck_number: '12',
      bill_to: { name: 'Five Construction', address_lines: ['', ''], phone: '' },
    },
    source: {
      file_name: `ticket-${id}.jpg`,
      sha256: String(id).padStart(64, 'a'),
      size: 10,
      type: 'image/jpeg',
      kind: 'upload',
    },
    original_stored: false,
    ocr_text: '',
    customer_profile_id: 1,
    truck_id: null,
    ...(pricing ? { pricing } : {}),
  };
}

/** A rate already on file, for the job that was settled before this week. */
const period = (patch: Partial<RatePeriod>): RatePeriod => ({
  id: 0,
  customer_profile_id: 1,
  job_key: i80Key,
  job_label: 'I-80',
  kind: 'base',
  effective_from: '2026-09-07',
  effective_to: null,
  validity: 'PROJECT_DURATION',
  rate_type: 'PER_TON',
  fuel_type: null,
  value: 9,
  source: 'customer_email',
  source_request_id: null,
  source_response_id: null,
  confidence: 1,
  applied_by: 'auto',
  confirmed_by: null,
  confirmed_at: null,
  superseded_by: null,
  note: null,
  created_at: '2026-09-07T00:00:00.000Z',
  ...patch,
});

const i80Base = period({ id: 1 });
const i80Fuel = period({
  id: 2,
  kind: 'fuel',
  rate_type: null,
  fuel_type: 'PERCENTAGE',
  value: 12,
  validity: 'PERIOD',
  effective_from: '2026-09-07',
  effective_to: '2026-09-30',
});
/** What the agent knew when the week started. */
const history = [i80Base, i80Fuel];

// Markham: the site rate is already on the ticket, because review filled it in
// from Customers when the ticket was saved. Nothing says what the fuel is.
const markhamTickets = Array.from({ length: 18 }, (_, at) =>
  saved(100 + at, MARKHAM, '5001', 14 + (at % 5), { rate: 8.75, rate_type: 'per_ton' }),
);
// 159th Street: nothing is known, so nothing is on the ticket.
const oakForestTickets = Array.from({ length: 11 }, (_, at) =>
  saved(200 + at, OAK_FOREST, '5002', 14 + (at % 5)),
);
// I-80: settled last week, priced from the rates on file, and stamped with them.
const i80Tickets = Array.from({ length: 7 }, (_, at) =>
  saved(
    300 + at,
    I80,
    '5003',
    14 + (at % 5),
    { rate: 9, rate_type: 'per_ton', fuel_charge: 12, fuel_type: 'percent' },
    { base_period_id: 1, fuel_period_id: 2, applied_at: '2026-09-14T00:00:00.000Z', unsupported: null },
  ),
);
const records = [...markhamTickets, ...oakForestTickets, ...i80Tickets];

const jobs = [
  { job_key: markhamKey, job_label: markhamTickets[0].ticket.project_address ?? '' },
  { job_key: oakForestKey, job_label: oakForestTickets[0].ticket.project_address ?? '' },
  { job_key: i80Key, job_label: i80Tickets[0].ticket.project_address ?? '' },
];

// ------------------------------------------------- what is missing, and asked

void test('a site rate typed into Customers is an answer, and is never asked for again', () => {
  const needs = missingRates(records, customers, history, FROM, TO);
  const of = (key: string) => needs.find((need) => need.job_key === key);

  const markham = of(markhamKey);
  assert.equal(markham?.ticket_count, 18);
  assert.deepEqual(markham?.missing, ['fuel']);
  assert.deepEqual(markham?.known_from_site, ['base'], 'the office already typed the hauling rate');

  const oakForest = of(oakForestKey);
  assert.equal(oakForest?.ticket_count, 11);
  assert.deepEqual(oakForest?.missing, ['base', 'fuel']);

  const i80 = of(i80Key);
  assert.equal(i80?.ticket_count, 7);
  assert.deepEqual(i80?.missing, [], 'a job with both rates on file is nobody’s question');
});

void test('one email asks for exactly what is missing, busiest job first', () => {
  const plans = planRequests(missingRates(records, customers, history, FROM, TO), FROM, TO);
  assert.equal(plans.length, 1, 'one customer, one request');
  const [plan] = plans;
  assert.equal(plan.customer_profile_id, 1);
  assert.deepEqual(
    plan.items.map((item) => [item.job_key, item.fields, item.ticket_count]),
    [
      [markhamKey, ['fuel'], 18],
      [oakForestKey, ['base', 'fuel'], 11],
    ],
  );

  const { subject, body } = requestWording(plan, customer, contact, 'Sep 14–20');
  assert.equal(subject, 'Rates & Fuel Surcharge — Sep 14–20');
  assert.match(body, /^Hi Dave,/);
  const bullets = body.split('\n').filter((line) => line.startsWith('•'));
  assert.deepEqual(bullets, [
    `• ${jobs[0].job_label} — fuel surcharge only`,
    `• ${jobs[1].job_label} — hauling rate + fuel surcharge`,
  ]);
  // The job that is settled is not mentioned, and neither is a figure: the
  // agent asks, it does not negotiate.
  assert.ok(!body.includes('I-80'), 'a settled job is asked about again');
  assert.ok(!/\d+\.\d{2}/.test(body), 'the request quotes a figure at the customer');
});

// --------------------------------------------------- what the customer wrote

const REPLY = 'Markham fuel is 11%\n159th is $9.25/ton and 10% fuel';

const plan = planRequests(missingRates(records, customers, history, FROM, TO), FROM, TO)[0];
const asked = { items: plan.items };

void test('the reply reads, matches and becomes rates without a person', () => {
  const lines = rulesOnlyLines(REPLY);
  const matches: RateMatch[] = matchLines(lines, asked, jobs, DEFAULT_RATE_PROFILE, history);

  const autos = matches.filter((match) => match.status === 'auto');
  assert.equal(autos.length, 3, `expected three certain matches, got ${matches.length} matches`);
  assert.deepEqual(
    autos.map((match) => [match.job_key, match.field, match.value, match.unit]),
    [
      [markhamKey, 'fuel', 11, 'PERCENTAGE'],
      [oakForestKey, 'base', 9.25, 'PER_TON'],
      [oakForestKey, 'fuel', 10, 'PERCENTAGE'],
    ],
  );
  assert.deepEqual(autos.map((match) => match.anomaly), [null, null, null]);

  const fresh: NewRatePeriod[] = periodsFromMatches(
    autos,
    1,
    { from: FROM, to: TO },
    jobs,
    DEFAULT_RATE_PROFILE,
    'simulated_response',
    { request_id: 7, response_id: 8 },
    'auto',
    null,
    NOW,
  );
  assert.deepEqual(
    fresh.map((row) => [row.job_key, row.kind, row.value, row.effective_to, row.validity]),
    [
      // A fuel surcharge holds for the week it was given for, and no longer.
      [markhamKey, 'fuel', 11, TO, 'PERIOD'],
      // A hauling rate agreed for a project is open-ended.
      [oakForestKey, 'base', 9.25, null, 'PROJECT_DURATION'],
      [oakForestKey, 'fuel', 10, TO, 'PERIOD'],
    ],
  );
});

/** The rates on file after the reply, as the store would have handed them back. */
const applied: RatePeriod[] = periodsFromMatches(
  matchLines(rulesOnlyLines(REPLY), asked, jobs, DEFAULT_RATE_PROFILE, history).filter(
    (match) => match.status === 'auto',
  ),
  1,
  { from: FROM, to: TO },
  jobs,
  DEFAULT_RATE_PROFILE,
  'simulated_response',
  { request_id: 7, response_id: 8 },
  'auto',
  null,
  NOW,
).map((row, at) => ({ ...row, id: 10 + at, created_at: NOW, superseded_by: null }));

const periods = [...history, ...applied];
const markhamFuelId = applied.find((row) => row.job_key === markhamKey)?.id;
const oakBaseId = applied.find((row) => row.job_key === oakForestKey && row.kind === 'base')?.id;
const oakFuelId = applied.find((row) => row.job_key === oakForestKey && row.kind === 'fuel')?.id;

// ------------------------------------------------------- onto the tickets

void test('the agreed rates reach the tickets that were waiting for them', () => {
  const result = ticketEdits(records, customers, periods, [], NOW, {});
  const edits = new Map(result.edits.map((edit) => [edit.id, edit]));

  // 159th Street had nothing; it now has both figures and says where they came from.
  const oak = edits.get(200);
  assert.ok(oak, '159th Street was not priced');
  assert.equal(oak.ticket.rate, 9.25);
  assert.equal(oak.ticket.rate_type, 'per_ton');
  assert.equal(oak.ticket.fuel_charge, 10);
  assert.equal(oak.ticket.fuel_type, 'percent');
  assert.deepEqual(oak.pricing, {
    base_period_id: oakBaseId,
    fuel_period_id: oakFuelId,
    applied_at: NOW,
    unsupported: null,
  });
  assert.equal(oak.bookkeeping, true, 'pricing a ticket is not a person checking it');
  assert.equal(
    result.edits.filter((edit) => edit.id >= 200 && edit.id < 300).length,
    11,
    'every 159th Street ticket is priced',
  );

  // I-80 was settled before this week and is left exactly as it is.
  assert.equal(
    result.edits.some((edit) => edit.id >= 300),
    false,
    'a job that was already priced from its own rates was touched again',
  );
  assert.deepEqual(result.conflicts, []);
});

void test('a job whose hauling rate is a site rate keeps it and takes the fuel', () => {
  // The contract the rest of the agent works to: `missingRates` treats a site
  // rate as an answer and never asks for it, and `invoiceReadiness` counts the
  // invoice as rated because of it. So the fuel the customer just agreed to
  // has to reach the ticket, with the 8.75 the office typed left alone.
  const result = ticketEdits(records, customers, periods, [], NOW, {});
  const markham = result.edits.find((edit) => edit.id === 100);
  assert.ok(markham, 'the Markham ticket was left out of the pricing run');
  assert.equal(markham.ticket.rate, 8.75, 'the site rate was overwritten or dropped');
  assert.equal(markham.ticket.rate_type, 'per_ton');
  assert.equal(markham.ticket.fuel_charge, 11, 'the agreed fuel surcharge never reached the ticket');
  assert.equal(markham.ticket.fuel_type, 'percent');
  assert.deepEqual(markham.pricing, {
    // The base did not come from a rate period, and the stamp says so rather
    // than naming one: the figure is the customer profile's.
    base_period_id: null,
    fuel_period_id: markhamFuelId,
    applied_at: NOW,
    unsupported: null,
  });
  assert.equal(result.kept_manual, 0, 'a ticket carrying only a rate is not a priced ticket');
});

void test('pricing the same week twice changes nothing the second time', () => {
  const first = ticketEdits(records, customers, periods, [], NOW, {});
  const changed = new Map(first.edits.map((edit) => [edit.id, edit]));
  const after = records.map((record) => {
    const edit = changed.get(record.id);
    return edit ? { ...record, ticket: edit.ticket, pricing: edit.pricing ?? undefined } : record;
  });
  const second = ticketEdits(after, customers, periods, [], NOW, {});
  assert.deepEqual(second.edits, []);
  assert.deepEqual(second.conflicts, []);
  assert.equal(second.kept_manual, 0);
});

void test('an invoice that has gone out is reported, never repriced', () => {
  const lock: InvoiceLock = {
    invoice_key: '5002',
    finalized_at: '2026-09-20T18:00:00.000Z',
    finalized_by: 'office@example.com',
    snapshot: { total: 0, lines: [] },
    unlocked_at: null,
    unlock_reason: null,
  };
  const result = ticketEdits(records, customers, periods, [lock], NOW, {});
  assert.equal(
    result.edits.some((edit) => edit.id >= 200 && edit.id < 300),
    false,
    'a finalized invoice was repriced',
  );
  assert.equal(result.conflicts.length, 11);
  assert.equal(result.conflicts[0].invoice_key, '5002');
  assert.match(result.conflicts[0].detail, /Invoice 5002 is finalized/);
  // 22.4 tons at $9.25 is $207.20; 10% fuel is $20.72.
  assert.match(result.conflicts[0].detail, /from no total to \$227\.92\./);
});

// ------------------------------------------------------ what it was all for

void test('the invoice that was waiting for a rate is ready', () => {
  const group = invoiceGroups(records).find((invoice) => invoice.key === '5002');
  assert.ok(group);
  assert.equal(group.records.length, 11);
  const before = invoiceReadiness(group, customers, history, false);
  assert.equal(before.status, 'WAITING_FOR_RATE');
  assert.equal(before.base, 'waiting');
  assert.deepEqual(
    before.waiting_jobs.map((job) => [job.job_key, job.missing]),
    [[oakForestKey, ['base', 'fuel']]],
  );

  const after = invoiceReadiness(group, customers, periods, false);
  assert.equal(after.status, 'READY');
  assert.equal(after.base, 'ok');
  assert.equal(after.fuel, 'ok');
  assert.deepEqual(after.waiting_jobs, []);

  // Markham's invoice was never waiting for a hauling rate: the site rate is
  // on the ticket, and the fuel arrived with this week's reply.
  const markham = invoiceGroups(records).find((invoice) => invoice.key === '5001');
  assert.ok(markham);
  assert.equal(invoiceReadiness(markham, customers, history, false).status, 'WAITING_FOR_FUEL');
  assert.equal(invoiceReadiness(markham, customers, periods, false).status, 'READY');

  // And one that has gone out is not asked anything at all.
  assert.equal(invoiceReadiness(group, customers, history, true).status, 'FINALIZED');
});

// ------------------------------------------------------- what is not certain

void test('a dropped decimal point is a question, however plainly it is written', () => {
  // The rules do not care how clearly "$87.50 a ton" is stated: it is ten
  // times what this job was last agreed at, and ten times is a typo.
  const settled = [
    ...periods,
    period({ id: 20, job_key: markhamKey, job_label: 'Markham', kind: 'base', value: 8.75 }),
  ];
  const matches = matchLines(
    rulesOnlyLines('Markham 87.50/ton'),
    asked,
    jobs,
    DEFAULT_RATE_PROFILE,
    settled,
  );
  assert.equal(matches.length, 1);
  const [match] = matches;
  assert.equal(match.field, 'base');
  assert.equal(match.value, 87.5);
  assert.equal(match.status, 'confirm');
  assert.equal(match.anomaly?.kind, 'base_change');
  assert.match(String(match.reason), /8\.75/);
  // Nothing an anomaly touched is written unattended.
  assert.deepEqual(
    periodsFromMatches(
      matches.filter((row) => row.status === 'auto'),
      1,
      { from: FROM, to: TO },
      jobs,
      DEFAULT_RATE_PROFILE,
      'simulated_response',
      { request_id: 7, response_id: 8 },
      'auto',
      null,
      NOW,
    ),
    [],
  );
});

void test('a bare list of figures is read, but never applied on its own', () => {
  // "8.75 / 9.25 / fuel 11" is almost certainly the answer in the order the
  // jobs were asked about — and almost is not enough to price 29 tickets on.
  const matches = matchLines(
    rulesOnlyLines('8.75\n9.25\nfuel 11'),
    asked,
    jobs,
    DEFAULT_RATE_PROFILE,
    history,
  );
  assert.ok(matches.length > 0, 'the reply was not read at all');
  assert.deepEqual(
    matches.filter((match) => match.field === 'base' && match.status === 'auto'),
    [],
    'a hauling rate was taken from an unnamed list',
  );
  for (const match of matches) {
    if (match.status === 'auto') continue;
    assert.ok(match.reason, 'a match a person has to settle says nothing about why');
  }
});
