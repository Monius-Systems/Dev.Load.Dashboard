import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lineTotal } from '../lib/load-desk/format.ts';
import type { CustomerProfile } from '../lib/load-desk/profiles.ts';
import { invoiceGroups } from '../lib/load-desk/records.ts';
import {
  aliasesToLearn,
  billingPeriodFor,
  CONFIDENCE,
  DEFAULT_RATE_PROFILE,
  detectAnomaly,
  excludedFromJobs,
  followUpDueAt,
  invoiceReadiness,
  jobKeyOf,
  jobLabelOf,
  jobsWorked,
  matchLines,
  messageHash,
  missingRates,
  parseConfirmBody,
  parseFinalizeBody,
  parseGenerateBody,
  parseManualPeriodBody,
  parseRateContacts,
  parseRateProfile,
  parseSimulateBody,
  periodLabel,
  periodsFromMatches,
  planRequests,
  priceLine,
  readRatePeriod,
  remainingItems,
  requestWording,
  resolveRate,
  toTicketPricing,
  type CustomerRateProfile,
  type JobRef,
  type NormalizedMessage,
  type ParsedRateLine,
  type PricingInput,
  type RateContact,
  type RatePeriod,
  type RateRequest,
} from '../lib/load-desk/rates.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

// The customer, its three job sites and the week being billed. Five
// Construction hauls to all three; Markham and I-80 already have site rates
// typed into Customers, 159th has nothing at all.
const MARKHAM = '16222 Western Ave, Markham, IL';
const OAK_FOREST = '4100 159th St, Oak Forest, IL';
const JOLIET = '1900 I-80 Frontage Rd, Joliet, IL';
const FROM = '2026-09-14';
const TO = '2026-09-20';

const markhamKey = jobKeyOf(MARKHAM);
const oakForestKey = jobKeyOf(OAK_FOREST);
const jolietKey = jobKeyOf(JOLIET);

const customer = (patch: Partial<CustomerProfile> = {}): CustomerProfile => ({
  id: 5,
  name: 'Five Construction',
  ticket_customer_ids: ['60311596'],
  ticket_names: ['FIVE CONSTRUCTION'],
  addresses: [MARKHAM, OAK_FOREST, JOLIET],
  location_rates: [
    { address: MARKHAM, flat_rate: 8.75, rate_type: 'per_ton', fuel_charge: null },
    { address: JOLIET, flat_rate: 9, rate_type: 'per_ton', fuel_charge: 12, fuel_type: 'percent' },
  ],
  flat_rate: null,
  fuel_charge: null,
  notes: '',
  created_at: '2026-01-02T00:00:00.000Z',
  ...patch,
});

let nextId = 1;
const record = (ticket: Partial<Ticket>, patch: Partial<SavedRecord> = {}): SavedRecord => ({
  id: nextId++,
  saved_at: '2026-09-18T12:00:00.000Z',
  ticket: {
    ...emptyTicket(),
    ticket_date: '2026-09-16',
    customer_name: 'FIVE CONSTRUCTION',
    plant_name: 'Heidelberg Materials',
    project_address: MARKHAM,
    project_name: 'Markham Road Project',
    net_tons: 22.4,
    ...ticket,
  },
  invoice: {
    invoice_number: 'INV-1',
    invoice_date: '2026-09-21',
    return_date: '',
    truck_number: 'ZF0321',
    bill_to: { name: 'Monius', address_lines: ['', ''], phone: '' },
  },
  source: { file_name: 'a.jpg', sha256: 'a'.repeat(64), size: 1, type: 'image/jpeg', kind: 'upload' },
  original_stored: true,
  ocr_text: '',
  customer_profile_id: 5,
  ...patch,
});

const period = (patch: Partial<RatePeriod> = {}): RatePeriod => ({
  id: 1,
  customer_profile_id: 5,
  job_key: markhamKey,
  job_label: 'Markham Road Project',
  kind: 'base',
  effective_from: FROM,
  effective_to: TO,
  validity: 'PERIOD',
  rate_type: 'PER_TON',
  fuel_type: null,
  value: 8.75,
  source: 'customer_email',
  source_request_id: null,
  source_response_id: null,
  confidence: 0.95,
  applied_by: 'auto',
  confirmed_by: null,
  confirmed_at: null,
  superseded_by: null,
  note: null,
  created_at: '2026-09-21T09:00:00.000Z',
  ...patch,
});

const line = (patch: Partial<ParsedRateLine> = {}): ParsedRateLine => ({
  raw_text: '',
  job_text: null,
  field: 'unknown',
  extracted_value: null,
  interpreted_value: null,
  unit: 'UNKNOWN',
  validity_hint: null,
  note: null,
  ...patch,
});

const quantities = (patch: Partial<PricingInput> = {}): PricingInput => ({
  tons: 22.4,
  loads: 1,
  hours: 3.5,
  miles: 62,
  days: 2,
  ...patch,
});

// ------------------------------------------------------------ rate history

void test('a rate is resolved by the day that was hauled, not by which is newest', () => {
  const history = [
    period({ id: 1, effective_from: '2026-01-01', effective_to: '2026-06-30', value: 8 }),
    period({ id: 2, effective_from: '2026-07-01', effective_to: '2026-12-31', value: 8.75 }),
    period({
      id: 3,
      effective_from: '2027-01-01',
      effective_to: null,
      validity: 'PROJECT_DURATION',
      value: 9.5,
    }),
  ];
  assert.equal(resolveRate(history, 5, markhamKey, 'base', '2026-03-15')?.id, 1);
  assert.equal(resolveRate(history, 5, markhamKey, 'base', '2026-09-15')?.id, 2);
  // Open-ended: it holds for every day after it begins.
  assert.equal(resolveRate(history, 5, markhamKey, 'base', '2027-06-01')?.id, 3);
  assert.equal(resolveRate(history, 5, markhamKey, 'base', '2025-12-31'), null);
  assert.equal(resolveRate(history, 5, markhamKey, 'fuel', '2026-09-15'), null);
  assert.equal(resolveRate(history, 9, markhamKey, 'base', '2026-09-15'), null);
  assert.equal(resolveRate(history, 5, oakForestKey, 'base', '2026-09-15'), null);
});

void test('a superseded period is not resolved, and the one settled last wins', () => {
  const wrong = period({
    id: 4,
    effective_from: '2026-07-01',
    effective_to: '2026-12-31',
    value: 87.5,
    created_at: '2026-08-01T00:00:00.000Z',
    superseded_by: 5,
  });
  const corrected = period({
    id: 5,
    effective_from: '2026-07-01',
    effective_to: '2026-12-31',
    value: 9,
    created_at: '2026-08-02T00:00:00.000Z',
    confirmed_at: '2026-08-02T12:00:00.000Z',
  });
  const first = period({
    id: 2,
    effective_from: '2026-07-01',
    effective_to: '2026-12-31',
    value: 8.75,
    created_at: '2026-07-01T00:00:00.000Z',
  });
  assert.equal(resolveRate([first, wrong], 5, markhamKey, 'base', '2026-09-15')?.id, 2);
  assert.equal(resolveRate([first, wrong, corrected], 5, markhamKey, 'base', '2026-09-15')?.value, 9);
});

void test('a rate agreed today never changes what an earlier day was priced at', () => {
  const before = [period({ id: 1, effective_from: '2026-01-01', effective_to: '2026-06-30', value: 8 })];
  const after = [
    ...before,
    period({
      id: 9,
      effective_from: '2026-09-14',
      effective_to: null,
      validity: 'PROJECT_DURATION',
      value: 20,
      created_at: '2026-09-21T09:00:00.000Z',
    }),
  ];
  assert.equal(resolveRate(before, 5, markhamKey, 'base', '2026-03-15')?.value, 8);
  assert.equal(resolveRate(after, 5, markhamKey, 'base', '2026-03-15')?.value, 8);
  assert.equal(resolveRate(after, 5, markhamKey, 'base', '2026-09-15')?.value, 20);
});

// ------------------------------------------------------------------ pricing

void test('a per-ton line with a percentage surcharge is rounded at each step', () => {
  // 22.4 tons at $8.75 is $196.00; 11% of that is $21.56; the line is $217.56.
  const priced = priceLine(
    { rate_type: 'PER_TON', value: 8.75 },
    { fuel_type: 'PERCENTAGE', value: 11 },
    quantities(),
  );
  assert.deepEqual(priced, { base_amount: 196, fuel_amount: 21.56, total: 217.56, unpriced: null });
});

void test('every base rate charges the quantity it is named for', () => {
  const at = (rate_type: Parameters<typeof priceLine>[0], input = quantities()) =>
    priceLine(rate_type, null, input).total;
  assert.equal(at({ rate_type: 'PER_TON', value: 8.75 }), 196);
  assert.equal(at({ rate_type: 'PER_LOAD', value: 150 }), 150);
  assert.equal(at({ rate_type: 'PER_LOAD', value: 150 }, quantities({ loads: 3 })), 450);
  assert.equal(at({ rate_type: 'PER_HOUR', value: 95 }), 332.5);
  assert.equal(at({ rate_type: 'PER_MILE', value: 4.25 }), 263.5);
  assert.equal(at({ rate_type: 'PER_DAY', value: 800 }), 1600);
  assert.equal(at({ rate_type: 'FLAT_RATE', value: 500 }), 500);
});

void test('every fuel surcharge is added the way it was agreed', () => {
  const at = (fuel: Parameters<typeof priceLine>[1]) =>
    priceLine({ rate_type: 'PER_TON', value: 8.75 }, fuel, quantities()).fuel_amount;
  assert.equal(at({ fuel_type: 'PERCENTAGE', value: 11 }), 21.56);
  assert.equal(at({ fuel_type: 'PER_TON', value: 0.75 }), 16.8);
  assert.equal(at({ fuel_type: 'PER_LOAD', value: 12 }), 12);
  assert.equal(at({ fuel_type: 'PER_MILE', value: 0.3 }), 18.6);
  assert.equal(at({ fuel_type: 'FIXED_AMOUNT', value: 20 }), 20);
  // An answer, not a gap: both come to nothing and neither is asked again.
  assert.equal(at({ fuel_type: 'INCLUDED', value: null }), 0);
  assert.equal(at({ fuel_type: 'NONE', value: null }), 0);
  assert.equal(at(null), 0);
});

void test('a quantity that is not known leaves the line unpriced, with the reason', () => {
  const unpriced = (
    base: Parameters<typeof priceLine>[0],
    fuel: Parameters<typeof priceLine>[1],
    input = quantities(),
  ) => priceLine(base, fuel, input).unpriced;
  assert.equal(unpriced(null, null), 'no base rate');
  assert.equal(
    unpriced({ rate_type: 'PER_TON', value: 8.75 }, null, quantities({ tons: null })),
    'the net tons are not known',
  );
  assert.equal(
    unpriced({ rate_type: 'PER_HOUR', value: 95 }, null, quantities({ hours: null })),
    'the hours are not known',
  );
  assert.equal(
    unpriced({ rate_type: 'PER_MILE', value: 4.25 }, null, quantities({ miles: null })),
    'the miles are not known',
  );
  assert.equal(unpriced({ rate_type: 'CUSTOM', value: 1 }, null), 'custom pricing is entered by hand');
  assert.equal(
    unpriced({ rate_type: 'PER_TON', value: 8.75 }, { fuel_type: 'CUSTOM', value: null }),
    'custom pricing is entered by hand',
  );
  assert.equal(
    unpriced({ rate_type: 'PER_TON', value: 8.75 }, { fuel_type: 'PERCENTAGE', value: null }),
    'the fuel rate has no amount',
  );
  assert.equal(
    unpriced(
      { rate_type: 'PER_TON', value: 8.75 },
      { fuel_type: 'PER_TON', value: 0.75 },
      quantities({ tons: null }),
    ),
    'the net tons are not known',
  );
  // The base is still worked out; it is the fuel that is holding the line up.
  assert.equal(
    priceLine({ rate_type: 'PER_TON', value: 8.75 }, { fuel_type: 'PERCENTAGE', value: null }, quantities())
      .base_amount,
    196,
  );
});

// ------------------------------------------------------------ onto a ticket

void test('an agreed rate is written onto the ticket fields the invoice already reads', () => {
  const ticket = { ...emptyTicket(), net_tons: 22.4 };
  const perTon = toTicketPricing(period({ rate_type: 'PER_TON', value: 8.75 }), null, ticket);
  assert.deepEqual(perTon, {
    pricing: { rate: 8.75, rate_type: 'per_ton', fuel_charge: null, fuel_type: 'flat' },
  });
  const flat = toTicketPricing(period({ rate_type: 'PER_LOAD', value: 150 }), null, ticket);
  assert.deepEqual(flat, {
    pricing: { rate: 150, rate_type: 'flat', fuel_charge: null, fuel_type: 'flat' },
  });
  assert.deepEqual(toTicketPricing(period({ rate_type: 'FLAT_RATE', value: 500 }), null, ticket), {
    pricing: { rate: 500, rate_type: 'flat', fuel_charge: null, fuel_type: 'flat' },
  });
  assert.deepEqual(toTicketPricing(period({ rate_type: 'PER_HOUR', value: 95 }), null, ticket), {
    pricing: { rate: 95, rate_type: 'hourly', fuel_charge: null, fuel_type: 'flat' },
  });
});

void test('a fuel surcharge is carried as a percentage or as the amount it comes to', () => {
  const ticket = { ...emptyTicket(), net_tons: 22.4 };
  const base = period({ rate_type: 'PER_TON', value: 8.75 });
  const fuel = (patch: Partial<RatePeriod>) =>
    toTicketPricing(base, period({ kind: 'fuel', rate_type: null, ...patch }), ticket);
  assert.deepEqual(fuel({ fuel_type: 'PERCENTAGE', value: 11 }), {
    pricing: { rate: 8.75, rate_type: 'per_ton', fuel_charge: 11, fuel_type: 'percent' },
  });
  assert.deepEqual(fuel({ fuel_type: 'FIXED_AMOUNT', value: 20 }), {
    pricing: { rate: 8.75, rate_type: 'per_ton', fuel_charge: 20, fuel_type: 'flat' },
  });
  // One ticket is one load.
  assert.deepEqual(fuel({ fuel_type: 'PER_LOAD', value: 12 }), {
    pricing: { rate: 8.75, rate_type: 'per_ton', fuel_charge: 12, fuel_type: 'flat' },
  });
  // Per ton needs a weight: 22.4 × 0.75 = 16.80.
  assert.deepEqual(fuel({ fuel_type: 'PER_TON', value: 0.75 }), {
    pricing: { rate: 8.75, rate_type: 'per_ton', fuel_charge: 16.8, fuel_type: 'flat' },
  });
  assert.deepEqual(fuel({ fuel_type: 'INCLUDED', value: null }), {
    pricing: { rate: 8.75, rate_type: 'per_ton', fuel_charge: null, fuel_type: 'flat' },
  });
  assert.deepEqual(fuel({ fuel_type: 'NONE', value: null }), {
    pricing: { rate: 8.75, rate_type: 'per_ton', fuel_charge: null, fuel_type: 'flat' },
  });
});

void test('each side takes a period when there is one and the ticket’s own figure when there is not', () => {
  const fuelPeriod = period({
    id: 2,
    kind: 'fuel',
    rate_type: null,
    fuel_type: 'PERCENTAGE',
    value: 11,
  });
  // The hauling rate came from the customer's site rate and is already on the
  // ticket; only the week's surcharge was asked for, and it has to land.
  assert.deepEqual(
    toTicketPricing(null, fuelPeriod, {
      ...emptyTicket(),
      net_tons: 22.4,
      rate: 8.75,
      rate_type: 'per_ton',
    }),
    { pricing: { rate: 8.75, rate_type: 'per_ton', fuel_charge: 11, fuel_type: 'percent' } },
  );
  // Neither a period nor a rate on the ticket: there is nothing to bill at.
  assert.deepEqual(
    toTicketPricing(null, fuelPeriod, { ...emptyTicket(), net_tons: 22.4 }),
    { unsupported: 'no base rate' },
  );
  // And the other way: a fuel figure entered by hand survives a rate arriving.
  assert.deepEqual(
    toTicketPricing(period({ rate_type: 'PER_TON', value: 9.25 }), null, {
      ...emptyTicket(),
      net_tons: 22.4,
      fuel_charge: 5,
      fuel_type: 'flat',
    }),
    { pricing: { rate: 9.25, rate_type: 'per_ton', fuel_charge: 5, fuel_type: 'flat' } },
  );
  // An answer of NONE is an answer, and does override what was there.
  assert.deepEqual(
    toTicketPricing(
      period({ rate_type: 'PER_TON', value: 9.25 }),
      period({ id: 3, kind: 'fuel', rate_type: null, fuel_type: 'NONE', value: null }),
      { ...emptyTicket(), net_tons: 22.4, fuel_charge: 5, fuel_type: 'flat' },
    ),
    { pricing: { rate: 9.25, rate_type: 'per_ton', fuel_charge: null, fuel_type: 'flat' } },
  );
});

void test('a rate the ticket engine cannot carry says so instead of being rounded into one', () => {
  const ticket = { ...emptyTicket(), net_tons: 22.4 };
  const base = period({ rate_type: 'PER_TON', value: 8.75 });
  assert.deepEqual(toTicketPricing(null, null, ticket), { unsupported: 'no base rate' });
  assert.deepEqual(toTicketPricing(period({ rate_type: 'PER_MILE', value: 4.25 }), null, ticket), {
    unsupported: 'a PER_MILE rate cannot be billed on a ticket yet',
  });
  assert.deepEqual(toTicketPricing(period({ rate_type: 'PER_DAY', value: 800 }), null, ticket), {
    unsupported: 'a PER_DAY rate cannot be billed on a ticket yet',
  });
  assert.deepEqual(toTicketPricing(period({ rate_type: 'CUSTOM', value: 1 }), null, ticket), {
    unsupported: 'custom pricing is entered by hand',
  });
  assert.deepEqual(
    toTicketPricing(base, period({ kind: 'fuel', rate_type: null, fuel_type: 'PER_MILE', value: 0.3 }), ticket),
    { unsupported: 'a PER_MILE fuel surcharge cannot be billed on a ticket yet' },
  );
  assert.deepEqual(
    toTicketPricing(
      base,
      period({ kind: 'fuel', rate_type: null, fuel_type: 'PER_TON', value: 0.75 }),
      { ...emptyTicket() },
    ),
    { unsupported: 'the net tons are not known' },
  );
});

// --------------------------------------------------------------- what is due

const weekRecords = () => [
  ...Array.from({ length: 2 }, () => record({})),
  ...Array.from({ length: 2 }, () =>
    record({ project_address: OAK_FOREST, project_name: '159th Street Project' }),
  ),
  ...Array.from({ length: 2 }, () =>
    record({ project_address: JOLIET, project_name: 'I-80 Resurfacing' }),
  ),
];

void test('the week is grouped into jobs, and what cannot be placed is said out loud', () => {
  const records = [
    ...weekRecords(),
    record({ ticket_date: null }),
    record({ project_address: null, project_name: null }),
    record({ customer_name: 'Someone Else' }, { customer_profile_id: null }),
    record({ ticket_date: '2026-08-01' }),
  ];
  const jobs = jobsWorked(records, [customer()], FROM, TO);
  // Equally busy jobs read in name order.
  assert.deepEqual(
    jobs.map((job) => [job.job_key, job.ticket_count]),
    [
      [oakForestKey, 2],
      [jolietKey, 2],
      [markhamKey, 2],
    ],
  );
  const markham = jobs.find((job) => job.job_key === markhamKey);
  assert.equal(markham?.job_label, 'Markham Road Project');
  assert.equal(markham?.first_date, '2026-09-16');
  assert.equal(markham?.last_date, '2026-09-16');
  assert.equal(markham?.ticket_ids.length, 2);
  assert.deepEqual(
    excludedFromJobs(records, [customer()], FROM, TO).map((item) => item.reason),
    ['no_date', 'no_job', 'no_customer'],
  );
});

void test('jobs take their name from the ticket, and their key from the address', () => {
  assert.equal(jobKeyOf('16222 Western Ave, Markham, IL '), jobKeyOf('16222 western ave markham il'));
  assert.equal(jobKeyOf(null), '');
  assert.equal(jobLabelOf({ ...emptyTicket(), project_name: 'Markham Road Project' }), 'Markham Road Project');
  assert.equal(jobLabelOf({ ...emptyTicket(), project_address: MARKHAM }), MARKHAM);
  assert.equal(jobLabelOf(emptyTicket()), 'Unnamed job');
});

void test('a rate the office already typed in is never asked for again', () => {
  const needs = missingRates(weekRecords(), [customer()], [], FROM, TO);
  const byKey = new Map(needs.map((need) => [need.job_key, need]));
  // Markham has a site rate but no site fuel: only the surcharge is missing.
  assert.deepEqual(byKey.get(markhamKey)?.missing, ['fuel']);
  assert.deepEqual(byKey.get(markhamKey)?.known_from_site, ['base']);
  // 159th has nothing on file at all.
  assert.deepEqual(byKey.get(oakForestKey)?.missing, ['base', 'fuel']);
  assert.deepEqual(byKey.get(oakForestKey)?.known_from_site, []);
  // I-80 is fully rated and is not in the request at all.
  assert.deepEqual(byKey.get(jolietKey)?.missing, []);
  assert.deepEqual(byKey.get(jolietKey)?.known_from_site, ['base', 'fuel']);
});

void test('an agreed period answers a job, and fuel of NONE is an answer', () => {
  const periods = [
    period({ id: 1, job_key: oakForestKey, kind: 'base', value: 9.25 }),
    period({
      id: 2,
      job_key: oakForestKey,
      kind: 'fuel',
      rate_type: null,
      fuel_type: 'NONE',
      value: null,
    }),
  ];
  const needs = missingRates(weekRecords(), [customer()], periods, FROM, TO);
  const oak = needs.find((need) => need.job_key === oakForestKey);
  assert.deepEqual(oak?.missing, []);
  assert.equal(oak?.fuel?.fuel_type, 'NONE');
});

void test('requests are one per customer, busiest job first, and only where something is missing', () => {
  const needs = missingRates(weekRecords(), [customer()], [], FROM, TO);
  const plans = planRequests(needs, FROM, TO);
  assert.equal(plans.length, 1);
  assert.equal(plans[0].customer_profile_id, 5);
  assert.equal(plans[0].period_from, FROM);
  assert.deepEqual(
    plans[0].items.map((item) => [item.job_label, item.fields]),
    [
      ['159th Street Project', ['base', 'fuel']],
      ['Markham Road Project', ['fuel']],
    ],
  );
  // Nothing missing anywhere: nobody is written to.
  const settled = needs.map((need) => ({ ...need, missing: [] }));
  assert.deepEqual(planRequests(settled, FROM, TO), []);
});

// ----------------------------------------------------------- billing periods

void test('the period asked about is the last complete one before today', () => {
  const monday = new Date(2026, 8, 21);
  assert.deepEqual(billingPeriodFor(DEFAULT_RATE_PROFILE, monday), { from: '2026-09-14', to: '2026-09-20' });
  assert.deepEqual(billingPeriodFor(undefined, monday), { from: '2026-09-14', to: '2026-09-20' });
  // A customer whose week starts on Sunday gets Sunday-to-Saturday weeks.
  assert.deepEqual(
    billingPeriodFor({ ...DEFAULT_RATE_PROFILE, period_start_day: 0 }, monday),
    { from: '2026-09-13', to: '2026-09-19' },
  );
  // Fortnights sit on the grid anchored to the Monday of ISO week 1.
  assert.deepEqual(
    billingPeriodFor({ ...DEFAULT_RATE_PROFILE, billing_cycle: 'biweekly' }, monday),
    { from: '2026-09-07', to: '2026-09-20' },
  );
  assert.deepEqual(
    billingPeriodFor({ ...DEFAULT_RATE_PROFILE, billing_cycle: 'monthly' }, monday),
    { from: '2026-08-01', to: '2026-08-31' },
  );
  assert.deepEqual(
    billingPeriodFor({ ...DEFAULT_RATE_PROFILE, billing_cycle: 'monthly' }, new Date(2026, 0, 6)),
    { from: '2025-12-01', to: '2025-12-31' },
  );
});

void test('a period reads as a person would say it', () => {
  assert.equal(periodLabel('2026-09-14', '2026-09-20'), 'Sep 14–20');
  assert.equal(periodLabel('2026-09-28', '2026-10-04'), 'Sep 28 – Oct 4');
  assert.equal(periodLabel('2025-12-29', '2026-01-04'), 'Dec 29, 2025 – Jan 4, 2026');
  assert.equal(periodLabel('', ''), '');
});

void test('the follow-up falls the agreed number of days after the request went out', () => {
  assert.equal(followUpDueAt('2026-09-21T13:00:00.000Z', 2), '2026-09-23T13:00:00.000Z');
  assert.equal(followUpDueAt('not a time', 2), 'not a time');
});

// ------------------------------------------------------------------ wording

const contact = (patch: Partial<RateContact> = {}): RateContact => ({
  name: 'Sarah Klein',
  email: 'sarah@fiveconstruction.example',
  title: 'Project Coordinator',
  primary: true,
  cc: [],
  notes: '',
  ...patch,
});

void test('the request is written the same way every week, without a model', () => {
  const plan = planRequests(missingRates(weekRecords(), [customer()], [], FROM, TO), FROM, TO)[0];
  // The example asks about Markham first, as the busier job.
  const asked = {
    ...plan,
    items: [...plan.items].sort((a, b) => a.job_label.localeCompare(b.job_label)).reverse(),
  };
  const written = requestWording(asked, customer(), contact(), periodLabel(FROM, TO));
  assert.equal(written.subject, 'Rates & Fuel Surcharge — Sep 14–20');
  assert.equal(
    written.body,
    'Hi Sarah,\n\nCould you please send the hauling rates and applicable fuel surcharge for:\n\n' +
      '• Markham Road Project — fuel surcharge only\n' +
      '• 159th Street Project — hauling rate + fuel surcharge\n\nThank you.',
  );
  // With nobody named, the customer is greeted by name rather than by nothing.
  assert.match(requestWording(asked, customer(), null, 'Sep 14–20').body, /^Hi Five Construction,/);
});

// ------------------------------------------------------------ reading replies

const threeJobs: JobRef[] = [
  { job_key: markhamKey, job_label: 'Markham Road Project' },
  { job_key: oakForestKey, job_label: '159th Street Project' },
  { job_key: jolietKey, job_label: 'I-80 Resurfacing' },
];

const plannedItems = {
  items: [
    { job_key: markhamKey, job_label: 'Markham Road Project', fields: ['fuel' as const], ticket_count: 18 },
    {
      job_key: oakForestKey,
      job_label: '159th Street Project',
      fields: ['base' as const, 'fuel' as const],
      ticket_count: 11,
    },
  ],
};

void test('a job named in full, by a confirmed alias, or by one of its words', () => {
  const profile: CustomerRateProfile = {
    ...DEFAULT_RATE_PROFILE,
    aliases: [
      { alias: 'MRP', job_key: markhamKey, source: 'confirmed_match', confirmed_at: '2026-09-01T00:00:00.000Z' },
    ],
  };
  const named = matchLines(
    [line({ raw_text: 'Markham Road Project fuel 11%', job_text: 'Markham Road Project', field: 'fuel', interpreted_value: 11, unit: 'PERCENTAGE' })],
    null,
    threeJobs,
    profile,
    [],
  );
  assert.equal(named[0].job_key, markhamKey);
  assert.equal(named[0].status, 'auto');
  assert.ok(named[0].confidence >= CONFIDENCE.auto);

  const aliased = matchLines(
    [line({ raw_text: 'MRP fuel 11%', job_text: 'MRP', field: 'fuel', interpreted_value: 11, unit: 'PERCENTAGE' })],
    null,
    threeJobs,
    profile,
    [],
  );
  assert.equal(aliased[0].job_key, markhamKey);
  assert.equal(aliased[0].status, 'auto');
  assert.match(aliased[0].evidence.join(' '), /confirmed name/);

  const contained = matchLines(
    [line({ raw_text: 'Markham fuel 11%', job_text: 'Markham', field: 'fuel', interpreted_value: 11, unit: 'PERCENTAGE' })],
    null,
    threeJobs,
    profile,
    [],
  );
  assert.equal(contained[0].job_key, markhamKey);
  assert.equal(contained[0].confidence, 0.85);
  assert.equal(contained[0].status, 'confirm');

  // The same word, once it is one of the jobs we asked about, is enough.
  const asked = matchLines(
    [line({ raw_text: 'Markham fuel 11%', job_text: 'Markham', field: 'fuel', interpreted_value: 11, unit: 'PERCENTAGE' })],
    plannedItems,
    threeJobs,
    profile,
    [],
  );
  assert.equal(asked[0].confidence, 0.95);
  assert.equal(asked[0].status, 'auto');
});

void test('a word that fits two jobs is a question, with both named', () => {
  const jobs: JobRef[] = [
    { job_key: 'A', job_label: 'Markham Road Project' },
    { job_key: 'B', job_label: 'Markham Avenue Project' },
  ];
  const matches = matchLines(
    [line({ raw_text: 'Markham 11%', job_text: 'Markham', field: 'fuel', interpreted_value: 11, unit: 'PERCENTAGE' })],
    null,
    jobs,
    DEFAULT_RATE_PROFILE,
    [],
  );
  assert.equal(matches[0].job_key, null);
  assert.equal(matches[0].status, 'confirm');
  assert.match(matches[0].evidence.join(' '), /Markham Road Project.+Markham Avenue Project/);
  assert.equal(matches[0].reason, 'the job this belongs to is not certain');
});

void test('a bare list in the order we asked is read in that order, and still confirmed', () => {
  const matches = matchLines(
    [
      line({ raw_text: '11', field: 'fuel', interpreted_value: 11, unit: 'PERCENTAGE' }),
      line({ raw_text: '9.25', field: 'base', interpreted_value: 9.25, unit: 'PER_TON' }),
    ],
    plannedItems,
    threeJobs,
    DEFAULT_RATE_PROFILE,
    [],
  );
  assert.deepEqual(matches.map((match) => match.job_key), [markhamKey, oakForestKey]);
  assert.deepEqual(matches.map((match) => match.confidence), [0.6, 0.6]);
  assert.deepEqual(matches.map((match) => match.status), ['confirm', 'confirm']);
  // One figure short of the jobs asked about: the order proves nothing.
  const short = matchLines(
    [line({ raw_text: '11', field: 'fuel', interpreted_value: 11, unit: 'PERCENTAGE' })],
    plannedItems,
    threeJobs,
    DEFAULT_RATE_PROFILE,
    [],
  );
  assert.equal(short[0].job_key, null);
});

void test('a unit the reply left out is the customer’s usual one, and is never automatic', () => {
  const base = matchLines(
    [line({ raw_text: '159th is 9.25', job_text: '159th', field: 'base', interpreted_value: 9.25 })],
    plannedItems,
    threeJobs,
    DEFAULT_RATE_PROFILE,
    [],
  );
  assert.equal(base[0].unit, 'PER_TON');
  assert.equal(base[0].confidence, 0.8);
  assert.equal(base[0].status, 'confirm');
  assert.match(base[0].evidence.join(' '), /usual PER_TON/);

  const fuel = matchLines(
    [line({ raw_text: 'Markham fuel 11', job_text: 'Markham', field: 'fuel', interpreted_value: 11 })],
    plannedItems,
    threeJobs,
    DEFAULT_RATE_PROFILE,
    [],
  );
  assert.equal(fuel[0].unit, 'PERCENTAGE');
  assert.equal(fuel[0].confidence, 0.85);
  assert.equal(fuel[0].status, 'confirm');

  // A customer whose fuel never moves gives nothing to fall back on.
  const unsure = matchLines(
    [line({ raw_text: 'Markham fuel 11', job_text: 'Markham', field: 'fuel', interpreted_value: 11 })],
    plannedItems,
    threeJobs,
    { ...DEFAULT_RATE_PROFILE, fuel_behavior: 'fixed' },
    [],
  );
  assert.equal(unsure[0].unit, 'UNKNOWN');
  assert.equal(unsure[0].status, 'confirm');
  assert.equal(unsure[0].reason, 'what the figure is charged in is not certain');
});

void test('a line that gives both figures becomes two matches', () => {
  const matches = matchLines(
    [
      line({
        raw_text: '159th is $9.25/ton and 10% fuel',
        job_text: '159th',
        field: 'both',
        extracted_value: '$9.25/ton',
        interpreted_value: 9.25,
        unit: 'PER_TON',
      }),
    ],
    plannedItems,
    threeJobs,
    DEFAULT_RATE_PROFILE,
    [],
  );
  assert.equal(matches.length, 2);
  assert.deepEqual(
    matches.map((match) => [match.field, match.value, match.unit, match.status]),
    [
      ['base', 9.25, 'PER_TON', 'auto'],
      ['fuel', 10, 'PERCENTAGE', 'auto'],
    ],
  );
  assert.deepEqual(matches.map((match) => match.line_index), [0, 0]);
});

void test('a line with no figure is rejected rather than guessed at', () => {
  const matches = matchLines(
    [line({ raw_text: 'Markham rate to follow', job_text: 'Markham', field: 'base' })],
    plannedItems,
    threeJobs,
    DEFAULT_RATE_PROFILE,
    [],
  );
  assert.equal(matches[0].status, 'reject');
  assert.equal(matches[0].reason, 'no figure was read from this line');
});

// ------------------------------------------------------------------ anomalies

void test('a dropped decimal point is caught however confident the reading was', () => {
  const history = [period({ id: 1, job_key: markhamKey, kind: 'base', value: 8.75 })];
  const anomaly = detectAnomaly(
    { field: 'base', value: 87.5, unit: 'PER_TON', job_key: markhamKey },
    5,
    history,
  );
  assert.equal(anomaly?.kind, 'base_change');
  assert.equal(anomaly?.previous, 8.75);
  assert.equal(anomaly?.received, 87.5);
  assert.match(anomaly?.detail ?? '', /\$87\.50 is 10× the \$8\.75/);
  // A rate that moved a little is not an anomaly.
  assert.equal(
    detectAnomaly({ field: 'base', value: 9.25, unit: 'PER_TON', job_key: markhamKey }, 5, history),
    null,
  );
  // Nothing on file: nothing to be out of line with.
  assert.equal(
    detectAnomaly({ field: 'base', value: 87.5, unit: 'PER_TON', job_key: oakForestKey }, 5, history),
    null,
  );
});

void test('a fuel surcharge outside what a surcharge can be is caught', () => {
  const out = detectAnomaly({ field: 'fuel', value: 41, unit: 'PERCENTAGE', job_key: markhamKey }, 5, []);
  assert.equal(out?.kind, 'fuel_out_of_range');
  assert.match(out?.detail ?? '', /41% is outside the 0–25%/);
  assert.equal(detectAnomaly({ field: 'fuel', value: 11, unit: 'PERCENTAGE', job_key: markhamKey }, 5, []), null);

  const priorPercent = [
    period({ id: 2, job_key: markhamKey, kind: 'fuel', rate_type: null, fuel_type: 'PERCENTAGE', value: 11 }),
  ];
  const mismatch = detectAnomaly(
    { field: 'fuel', value: 0.75, unit: 'PER_TON', job_key: markhamKey },
    5,
    priorPercent,
  );
  assert.equal(mismatch?.kind, 'unit_mismatch');
});

void test('an anomaly sends a match to a person however certain the reading is', () => {
  const history = [period({ id: 1, job_key: markhamKey, kind: 'base', value: 8.75 })];
  const matches = matchLines(
    [
      line({
        raw_text: 'Markham Road Project is $87.50/ton',
        job_text: 'Markham Road Project',
        field: 'base',
        interpreted_value: 87.5,
        unit: 'PER_TON',
      }),
    ],
    null,
    threeJobs,
    DEFAULT_RATE_PROFILE,
    history,
  );
  assert.equal(matches[0].confidence, 0.98);
  assert.equal(matches[0].status, 'confirm');
  assert.equal(matches[0].anomaly?.kind, 'base_change');
});

// ---------------------------------------------------------- applying matches

void test('a hauling rate holds for the project and a surcharge for the period', () => {
  const matches = matchLines(
    [
      line({
        raw_text: '159th is $9.25/ton and 10% fuel',
        job_text: '159th',
        field: 'both',
        interpreted_value: 9.25,
        unit: 'PER_TON',
      }),
    ],
    plannedItems,
    threeJobs,
    DEFAULT_RATE_PROFILE,
    [],
  );
  const written = periodsFromMatches(
    matches,
    5,
    { from: FROM, to: TO },
    threeJobs,
    DEFAULT_RATE_PROFILE,
    'customer_email',
    { request_id: 7, response_id: 9 },
    'auto',
    null,
    '2026-09-21T10:00:00.000Z',
  );
  assert.deepEqual(
    written.map((row) => [row.kind, row.validity, row.effective_from, row.effective_to]),
    [
      ['base', 'PROJECT_DURATION', FROM, null],
      ['fuel', 'PERIOD', FROM, TO],
    ],
  );
  assert.equal(written[0].rate_type, 'PER_TON');
  assert.equal(written[0].fuel_type, null);
  assert.equal(written[1].fuel_type, 'PERCENTAGE');
  assert.equal(written[0].source_request_id, 7);
  assert.equal(written[0].source_response_id, 9);
  assert.equal(written[0].confidence, 0.95);
  assert.equal(written[0].confirmed_at, null);

  // A customer whose rate moves gets a rate for the period only.
  const varies = periodsFromMatches(
    matches,
    5,
    { from: FROM, to: TO },
    threeJobs,
    { ...DEFAULT_RATE_PROFILE, base_behavior: 'varies' },
    'customer_email',
    { request_id: null, response_id: null },
    'human',
    'sarah@example.com',
    '2026-09-21T10:00:00.000Z',
  );
  assert.deepEqual(varies[0].effective_to, TO);
  assert.equal(varies[0].validity, 'PERIOD');
  assert.equal(varies[0].confirmed_at, '2026-09-21T10:00:00.000Z');
  assert.equal(varies[0].confirmed_by, 'sarah@example.com');
});

void test('a reply that says "for the duration" is taken at its word', () => {
  const matches = matchLines(
    [
      line({
        raw_text: 'Markham fuel is 11% for the duration of the project',
        job_text: 'Markham',
        field: 'fuel',
        interpreted_value: 11,
        unit: 'PERCENTAGE',
        validity_hint: 'project_duration',
      }),
    ],
    plannedItems,
    threeJobs,
    DEFAULT_RATE_PROFILE,
    [],
  );
  const written = periodsFromMatches(
    matches,
    5,
    { from: FROM, to: TO },
    threeJobs,
    DEFAULT_RATE_PROFILE,
    'customer_email',
    { request_id: null, response_id: null },
    'auto',
    null,
    '2026-09-21T10:00:00.000Z',
  );
  assert.equal(written[0].validity, 'PROJECT_DURATION');
  assert.equal(written[0].effective_to, null);
});

void test('a match nothing is sure of writes no period at all', () => {
  const unsure = matchLines(
    [line({ raw_text: '11%', field: 'fuel', interpreted_value: 11, unit: 'PERCENTAGE' })],
    null,
    threeJobs,
    DEFAULT_RATE_PROFILE,
    [],
  );
  assert.equal(unsure[0].job_key, null);
  assert.deepEqual(
    periodsFromMatches(
      unsure,
      5,
      { from: FROM, to: TO },
      threeJobs,
      DEFAULT_RATE_PROFILE,
      'customer_email',
      { request_id: null, response_id: null },
      'auto',
      null,
      '2026-09-21T10:00:00.000Z',
    ),
    [],
  );
});

void test('a name is learned only from a match that was certain', () => {
  const lines = [
    line({ raw_text: 'Markham fuel 11%', job_text: 'Markham', field: 'fuel', interpreted_value: 11, unit: 'PERCENTAGE' }),
  ];
  const auto = matchLines(lines, plannedItems, threeJobs, DEFAULT_RATE_PROFILE, []);
  assert.equal(auto[0].status, 'auto');
  assert.deepEqual(aliasesToLearn(auto, lines, [], '2026-09-21T10:00:00.000Z'), [
    { alias: 'Markham', job_key: markhamKey, source: 'confirmed_match', confirmed_at: '2026-09-21T10:00:00.000Z' },
  ]);
  // The same reading without the request behind it is a guess, and teaches nothing.
  const guessed = matchLines(lines, null, threeJobs, DEFAULT_RATE_PROFILE, []);
  assert.equal(guessed[0].status, 'confirm');
  assert.deepEqual(aliasesToLearn(guessed, lines, [], '2026-09-21T10:00:00.000Z'), []);
  // A person who settles a match hands it over with no doubt left in it.
  assert.equal(
    aliasesToLearn(
      [{ ...guessed[0], confidence: 1 }],
      lines,
      [],
      '2026-09-21T10:00:00.000Z',
    ).length,
    1,
  );
  // The job's own name is not an alias for itself, and one already known is not relearned.
  const full = [
    line({ raw_text: 'Markham Road Project fuel 11%', job_text: 'Markham Road Project', field: 'fuel', interpreted_value: 11, unit: 'PERCENTAGE' }),
  ];
  assert.deepEqual(
    aliasesToLearn(matchLines(full, plannedItems, threeJobs, DEFAULT_RATE_PROFILE, []), full, [], 'now'),
    [],
  );
  assert.deepEqual(
    aliasesToLearn(auto, lines, [
      { alias: 'markham', job_key: markhamKey, source: 'manual', confirmed_at: 'earlier' },
    ], 'now'),
    [],
  );
});

// ------------------------------------------------------------------ requests

const request = (patch: Partial<RateRequest> = {}): RateRequest => ({
  id: 1,
  customer_profile_id: 5,
  period_from: FROM,
  period_to: TO,
  status: 'SENT',
  mode: 'DRAFT_ONLY',
  recipient: 'sarah@example.com',
  cc: [],
  subject: 'Rates & Fuel Surcharge — Sep 14–20',
  body: '',
  items: [
    { job_key: markhamKey, job_label: 'Markham Road Project', fields: ['fuel'], ticket_count: 18 },
    { job_key: oakForestKey, job_label: '159th Street Project', fields: ['base', 'fuel'], ticket_count: 11 },
  ],
  answered: [],
  sent_at: '2026-09-21T13:00:00.000Z',
  reply_at: null,
  follow_up_due_at: null,
  follow_up_count: 0,
  thread_ref: null,
  created_at: '2026-09-21T13:00:00.000Z',
  updated_at: '2026-09-21T13:00:00.000Z',
  ...patch,
});

void test('a follow-up asks only for what the reply left out', () => {
  const partial = request({
    answered: [
      { job_key: markhamKey, field: 'fuel' },
      { job_key: oakForestKey, field: 'base' },
    ],
  });
  assert.deepEqual(remainingItems(partial), [
    { job_key: oakForestKey, job_label: '159th Street Project', fields: ['fuel'], ticket_count: 11 },
  ]);
  assert.deepEqual(remainingItems(request()).length, 2);
  assert.deepEqual(
    remainingItems(
      request({
        answered: [
          { job_key: markhamKey, field: 'fuel' },
          { job_key: oakForestKey, field: 'base' },
          { job_key: oakForestKey, field: 'fuel' },
        ],
      }),
    ),
    [],
  );
});

void test('the same reply delivered twice has the same fingerprint', () => {
  const message = (patch: Partial<NormalizedMessage> = {}): NormalizedMessage => ({
    sender: 'Sarah@Example.com',
    recipients: ['desk@example.com'],
    subject: 'RE: Rates & Fuel Surcharge — Sep 14–20',
    body_text: 'Markham fuel is 11%',
    body_html: null,
    attachments: [],
    received_at: '2026-09-22T08:00:00.000Z',
    external_thread_id: null,
    ...patch,
  });
  assert.equal(
    messageHash(message()),
    messageHash(message({ body_text: 'Markham  fuel is 11%\n', received_at: '2026-09-22T09:00:00.000Z' })),
  );
  assert.notEqual(messageHash(message()), messageHash(message({ body_text: 'Markham fuel is 12%' })));
});

// -------------------------------------------------------------- invoice gate

const groupOf = (records: SavedRecord[]) => invoiceGroups(records)[0];

void test('an invoice says which of the three steps it is waiting on', () => {
  const customers = [customer({ location_rates: [] })];
  const waiting = invoiceReadiness(groupOf([record({ rate: null, fuel_charge: null })]), customers, [], false);
  assert.equal(waiting.status, 'WAITING_FOR_RATE');
  assert.equal(waiting.tickets, 'ok');
  assert.equal(waiting.base, 'waiting');
  assert.deepEqual(waiting.waiting_jobs, [
    { job_key: markhamKey, job_label: 'Markham Road Project', missing: ['base', 'fuel'] },
  ]);

  const rated = invoiceReadiness(groupOf([record({ rate: 8.75, fuel_charge: null })]), customers, [], false);
  assert.equal(rated.status, 'WAITING_FOR_FUEL');
  assert.equal(rated.base, 'ok');
  assert.equal(rated.fuel, 'waiting');
  assert.deepEqual(rated.waiting_jobs[0].missing, ['fuel']);

  const ready = invoiceReadiness(groupOf([record({ rate: 8.75, fuel_charge: 11 })]), customers, [], false);
  assert.equal(ready.status, 'READY');
  assert.equal(ready.fuel, 'ok');
  assert.deepEqual(ready.waiting_jobs, []);
});

void test('an agreed period, a site rate or an answer of NONE all rate a line', () => {
  const periods = [
    period({ id: 1, effective_from: FROM, effective_to: TO, value: 8.75 }),
    period({
      id: 2,
      kind: 'fuel',
      rate_type: null,
      fuel_type: 'NONE',
      value: null,
      effective_from: FROM,
      effective_to: TO,
    }),
  ];
  const byPeriod = invoiceReadiness(
    groupOf([record({ rate: null, fuel_charge: null })]),
    [customer({ location_rates: [] })],
    periods,
    false,
  );
  assert.equal(byPeriod.status, 'READY');
  // Nothing is waiting and no fuel is charged: this invoice has no fuel step.
  assert.equal(byPeriod.fuel, 'n/a');

  // The site rate in Customers answers both, with no period on file at all.
  const bySite = invoiceReadiness(
    groupOf([record({ rate: null, fuel_charge: null, project_address: JOLIET, project_name: 'I-80 Resurfacing' })]),
    [customer()],
    [],
    false,
  );
  assert.equal(bySite.status, 'READY');
});

void test('a finalized invoice is never asked for a rate again, and a half-read one goes to a person', () => {
  const customers = [customer({ location_rates: [] })];
  const group = groupOf([record({ rate: null, fuel_charge: null })]);
  const locked = invoiceReadiness(group, customers, [], true);
  assert.deepEqual(locked, {
    tickets: 'ok',
    base: 'ok',
    fuel: 'ok',
    status: 'FINALIZED',
    waiting_jobs: [],
  });
  const unchecked = invoiceReadiness(
    { ...groupOf([record({ rate: 8.75, fuel_charge: 11 })]), needsConfirmation: true },
    customers,
    [],
    false,
  );
  assert.equal(unchecked.status, 'NEEDS_REVIEW');
});

// ------------------------------------------------------------------- readers

void test('a stored period reads back whether its numbers arrived as numbers or as text', () => {
  const read = readRatePeriod({
    id: '12',
    customer_profile_id: '5',
    job_key: markhamKey,
    job_label: 'Markham Road Project',
    kind: 'fuel',
    effective_from: FROM,
    effective_to: null,
    validity: 'PROJECT_DURATION',
    rate_type: null,
    fuel_type: 'PERCENTAGE',
    value: '11.5',
    source: 'customer_email',
    source_request_id: '7',
    source_response_id: null,
    confidence: '0.95',
    applied_by: 'human',
    confirmed_by: 'sarah@example.com',
    confirmed_at: '2026-09-22T08:00:00.000Z',
    superseded_by: null,
    note: null,
    created_at: '2026-09-22T08:00:00.000Z',
  });
  assert.equal(read.id, 12);
  assert.equal(read.value, 11.5);
  assert.equal(read.confidence, 0.95);
  assert.equal(read.source_request_id, 7);
  assert.equal(read.validity, 'PROJECT_DURATION');
  // A row with nonsense in it reads as the safest thing it can be, not as a crash.
  const junk = readRatePeriod({ kind: 'sideways', validity: 'forever', source: 'nowhere', value: 'x' });
  assert.equal(junk.kind, 'base');
  assert.equal(junk.validity, 'PERIOD');
  assert.equal(junk.source, 'manual');
  assert.equal(junk.value, null);
});

// ------------------------------------------------------------------- parsers

void test('rate settings and contacts are checked field by field', () => {
  assert.deepEqual(parseRateProfile(undefined), { value: undefined });
  assert.deepEqual(parseRateProfile(DEFAULT_RATE_PROFILE), { value: DEFAULT_RATE_PROFILE });
  assert.ok('error' in parseRateProfile({ ...DEFAULT_RATE_PROFILE, billing_cycle: 'fortnightly' }));
  assert.ok('error' in parseRateProfile({ ...DEFAULT_RATE_PROFILE, period_start_day: 9 }));
  assert.ok('error' in parseRateProfile({ ...DEFAULT_RATE_PROFILE, follow_up_days: -1 }));
  assert.ok('error' in parseRateProfile({ ...DEFAULT_RATE_PROFILE, typical_rate_type: 'per_ton' }));
  assert.ok('error' in parseRateProfile({ ...DEFAULT_RATE_PROFILE, aliases: [{ alias: '' }] }));

  assert.deepEqual(parseRateContacts([contact()]), { value: [contact()] });
  assert.deepEqual(parseRateContacts(undefined), { value: undefined });
  assert.ok('error' in parseRateContacts([contact({ email: 'sarah' })]));
  assert.ok('error' in parseRateContacts([contact(), contact({ email: 'b@example.com' })]));
  assert.ok('error' in parseRateContacts([contact({ cc: ['nope'] })]));
  assert.ok('error' in parseRateContacts(Array.from({ length: 21 }, () => contact({ primary: false }))));
});

void test('what the browser sends is bounded before anything is written', () => {
  assert.deepEqual(parseGenerateBody({}), { value: { customer_profile_id: null, from: null, to: null } });
  assert.deepEqual(parseGenerateBody({ customer_profile_id: 5, from: FROM, to: TO }), {
    value: { customer_profile_id: 5, from: FROM, to: TO },
  });
  assert.ok('error' in parseGenerateBody({ from: '14/09/2026' }));
  assert.ok('error' in parseGenerateBody({ from: TO, to: FROM }));

  assert.ok('value' in parseSimulateBody({ customer_profile_id: 5, body_text: 'Markham fuel is 11%' }));
  assert.ok('error' in parseSimulateBody({ customer_profile_id: 0, body_text: 'x' }));
  assert.ok('error' in parseSimulateBody({ customer_profile_id: 5, body_text: '   ' }));
  assert.ok('error' in parseSimulateBody({ customer_profile_id: 5, body_text: 'x'.repeat(20_001) }));

  const confirmed = {
    response_id: 3,
    learn_aliases: true,
    matches: [
      {
        line_index: 0,
        job_key: markhamKey,
        field: 'fuel',
        value: 11,
        unit: 'PERCENTAGE',
        effective_from: FROM,
        effective_to: TO,
        validity: 'PERIOD',
      },
    ],
  };
  assert.ok('value' in parseConfirmBody(confirmed));
  // A hauling rate cannot be a percentage, however it is sent.
  assert.ok(
    'error' in
      parseConfirmBody({ ...confirmed, matches: [{ ...confirmed.matches[0], field: 'base' }] }),
  );
  assert.ok('error' in parseConfirmBody({ ...confirmed, matches: [] }));
  assert.ok('error' in parseConfirmBody({ ...confirmed, learn_aliases: 'yes' }));

  const manual = {
    customer_profile_id: 5,
    job_key: markhamKey,
    job_label: 'Markham Road Project',
    kind: 'base',
    value: 8.75,
    rate_type: 'PER_TON',
    effective_from: FROM,
    effective_to: null,
    validity: 'PROJECT_DURATION',
    reason: 'agreed on the phone with Sarah',
  };
  assert.ok('value' in parseManualPeriodBody(manual));
  assert.ok('error' in parseManualPeriodBody({ ...manual, reason: 'x' }));
  assert.ok('error' in parseManualPeriodBody({ ...manual, rate_type: 'PERCENTAGE' }));
  assert.ok('error' in parseManualPeriodBody({ ...manual, effective_to: FROM, effective_from: TO }));
  assert.ok('error' in parseManualPeriodBody({ ...manual, value: -1 }));

  assert.deepEqual(parseFinalizeBody({ invoice_key: 'inv-1' }), { value: { invoice_key: 'inv-1', reason: null } });
  assert.ok('error' in parseFinalizeBody({ invoice_key: '  ' }));
});

// ------------------------------------------------------------ the whole week

void test('Five Construction: two jobs asked about, three rates agreed, one job untouched', () => {
  const customers = [customer()];
  const records = [
    ...Array.from({ length: 18 }, () => record({})),
    ...Array.from({ length: 11 }, () =>
      record({ project_address: OAK_FOREST, project_name: '159th Street Project' }),
    ),
    ...Array.from({ length: 7 }, () =>
      record({ project_address: JOLIET, project_name: 'I-80 Resurfacing' }),
    ),
  ];

  // What the week is short of: Markham's surcharge and everything about 159th.
  const needs = missingRates(records, customers, [], FROM, TO);
  const plans = planRequests(needs, FROM, TO);
  assert.equal(plans.length, 1);
  assert.deepEqual(
    plans[0].items.map((item) => [item.job_label, item.fields, item.ticket_count]),
    [
      ['Markham Road Project', ['fuel'], 18],
      ['159th Street Project', ['base', 'fuel'], 11],
    ],
  );

  // What the customer wrote back.
  const lines = [
    line({
      raw_text: 'Markham fuel is 11%',
      job_text: 'Markham',
      field: 'fuel',
      extracted_value: '11%',
      interpreted_value: 11,
      unit: 'PERCENTAGE',
    }),
    line({
      raw_text: '159th is $9.25/ton and 10% fuel',
      job_text: '159th',
      field: 'both',
      extracted_value: '$9.25/ton',
      interpreted_value: 9.25,
      unit: 'PER_TON',
    }),
  ];
  const jobs = jobsWorked(records, customers, FROM, TO);
  const matches = matchLines(lines, plans[0], jobs, DEFAULT_RATE_PROFILE, []);
  assert.deepEqual(
    matches.map((match) => [match.job_key, match.field, match.value, match.unit, match.status]),
    [
      [markhamKey, 'fuel', 11, 'PERCENTAGE', 'auto'],
      [oakForestKey, 'base', 9.25, 'PER_TON', 'auto'],
      [oakForestKey, 'fuel', 10, 'PERCENTAGE', 'auto'],
    ],
  );
  assert.ok(matches.every((match) => match.anomaly === null));

  // What is written: three periods, and nothing anybody did not ask for.
  const written = periodsFromMatches(
    matches,
    5,
    { from: FROM, to: TO },
    jobs,
    DEFAULT_RATE_PROFILE,
    'simulated_response',
    { request_id: 1, response_id: 2 },
    'auto',
    null,
    '2026-09-22T09:00:00.000Z',
  );
  assert.equal(written.length, 3);
  assert.deepEqual(
    written.map((row) => [row.job_key, row.kind, row.value, row.validity]),
    [
      [markhamKey, 'fuel', 11, 'PERIOD'],
      [oakForestKey, 'base', 9.25, 'PROJECT_DURATION'],
      [oakForestKey, 'fuel', 10, 'PERIOD'],
    ],
  );
  assert.equal(written.filter((row) => row.job_key === jolietKey).length, 0, 'I-80 was never asked about');
  assert.equal(
    written.filter((row) => row.job_key === markhamKey && row.kind === 'base').length,
    0,
    "Markham's hauling rate was already on file and is left alone",
  );

  // And with those on file, nothing is outstanding for the week.
  const applied: RatePeriod[] = written.map((row, index) => ({
    ...row,
    id: index + 1,
    superseded_by: null,
    created_at: '2026-09-22T09:00:00.000Z',
  }));
  assert.deepEqual(
    missingRates(records, customers, applied, FROM, TO).flatMap((need) => need.missing),
    [],
  );

  // Markham's 18 tickets carry the site rate already; only the 11% arrived.
  // It has to reach the ticket, or the week's invoice goes out without fuel.
  const markhamTicket: Ticket = {
    ...records[0].ticket,
    rate: 8.75,
    rate_type: 'per_ton',
    fuel_charge: null,
  };
  const day = markhamTicket.ticket_date as string;
  const priced = toTicketPricing(
    resolveRate(applied, 5, markhamKey, 'base', day),
    resolveRate(applied, 5, markhamKey, 'fuel', day),
    markhamTicket,
  );
  assert.deepEqual(priced, {
    pricing: { rate: 8.75, rate_type: 'per_ton', fuel_charge: 11, fuel_type: 'percent' },
  });
  // The invoice engine and the pricing agree to the cent: 196.00 + 21.56.
  assert.ok('pricing' in priced);
  assert.equal(lineTotal({ ...markhamTicket, ...priced.pricing }), 217.56);
  assert.equal(
    priceLine(
      { rate_type: 'PER_TON', value: 8.75 },
      { fuel_type: 'PERCENTAGE', value: 11 },
      quantities({ tons: 22.4 }),
    ).total,
    217.56,
  );

  // 159th, which had nothing at all, is priced from its two new periods.
  const oakTicket: Ticket = { ...records[18].ticket, rate: null, fuel_charge: null };
  assert.deepEqual(
    toTicketPricing(
      resolveRate(applied, 5, oakForestKey, 'base', day),
      resolveRate(applied, 5, oakForestKey, 'fuel', day),
      oakTicket,
    ),
    { pricing: { rate: 9.25, rate_type: 'per_ton', fuel_charge: 10, fuel_type: 'percent' } },
  );
});
