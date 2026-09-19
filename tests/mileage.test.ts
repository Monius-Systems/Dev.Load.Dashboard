import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildPlan,
  DEFAULT_TRUCK_IFTA,
  dayView,
  estimatedGallons,
  formatNumber,
  inputHash,
  needsRecalculation,
  orderRecords,
  parseDateRange,
  parsePlaceFixBody,
  parseRecalculateBody,
  parseStopOrderBody,
  periodRange,
  pickupQuery,
  placeKey,
  profileHash,
  quarterKeyOf,
  quarterKeys,
  quarterLabel,
  quarterRangeOf,
  readMileageDay,
  routeKey,
  routeLabels,
  routingProfileHash,
  settingsChanged,
  stopOrderApplies,
  stopOrderBasis,
  summarizeByTruck,
  summarizeDays,
  toRoutingProfile,
  truckDays,
  truckIfta,
  type MileageDay,
  type StopOrder,
} from '../lib/load-desk/mileage.ts';
import { parseTruck } from '../lib/load-desk/record-input.ts';
import type { TruckProfile } from '../lib/load-desk/profiles.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

// The demo yard is test data here and data on the truck in the app; the
// source guard at the bottom keeps it out of lib/ and components/.
const YARD = '10201 W 191st St, Mokena, IL 60448';
const PLANT = '322 S Williams St, Thornton, IL';
const SITE = '16222 Western Ave, Markham, IL';

const truck = (patch: Partial<TruckProfile> = {}): TruckProfile => ({
  id: 7,
  truck_number: 'ZF0321',
  nickname: '',
  driver: '',
  license_plate: '',
  notes: '',
  active: true,
  created_at: '2026-01-01T00:00:00.000Z',
  ifta: { ...DEFAULT_TRUCK_IFTA, yard_address: YARD },
  ...patch,
});

let nextId = 1;
const record = (ticket: Partial<Ticket>, patch: Partial<SavedRecord> = {}): SavedRecord => ({
  id: nextId++,
  saved_at: '2026-09-18T12:00:00.000Z',
  ticket: {
    ...emptyTicket(),
    ticket_date: '2026-09-18',
    plant_name: 'Heidelberg Materials',
    plant_address: PLANT,
    project_address: SITE,
    ...ticket,
  },
  invoice: {
    invoice_number: 'INV-1',
    invoice_date: '2026-09-18',
    return_date: '',
    truck_number: 'ZF0321',
    bill_to: { name: 'Client', address_lines: ['', ''], phone: '' },
  },
  source: { file_name: 'a.jpg', sha256: 'a'.repeat(64), size: 1, type: 'image/jpeg', kind: 'upload' },
  original_stored: true,
  ocr_text: '',
  truck_id: 7,
  ...patch,
});

const demoDay = () => [
  record({ ticket_number: '1001', time_out: '07:10' }),
  record({ ticket_number: '1002', time_out: '09:40' }),
];

void test('the demo day plans yard → plant → site → plant → site → yard', () => {
  const plan = buildPlan(demoDay(), truckIfta(truck()));
  assert.deepEqual(plan.blocking, []);
  assert.equal(plan.ambiguous, false);
  assert.equal(plan.order_basis, 'time');
  assert.deepEqual(
    plan.legs.map((leg) => leg.kind),
    ['yard_to_pickup', 'pickup_to_delivery', 'delivery_to_pickup', 'pickup_to_delivery', 'delivery_to_yard'],
  );
  assert.deepEqual(
    plan.legs.map((leg) => `${leg.from.kind}→${leg.to.kind}`),
    ['yard→pickup', 'pickup→delivery', 'delivery→pickup', 'pickup→delivery', 'delivery→yard'],
  );
  // Legs 2 and 4 are the same road, so they share one cached route.
  const hash = routingProfileHash(toRoutingProfile(DEFAULT_TRUCK_IFTA));
  const at = { [placeKey(YARD)]: { lat: 41.5, lon: -87.9 }, [placeKey(PLANT)]: { lat: 41.57, lon: -87.61 }, [placeKey(SITE)]: { lat: 41.6, lon: -87.68 } };
  const keys = plan.legs.map((leg) => routeKey(at[leg.from.place_key], at[leg.to.place_key], hash));
  assert.equal(keys[1], keys[3]);
  assert.notEqual(keys[0], keys[4], 'out and back are different directions');
  assert.equal(new Set(keys).size, 4);
});

void test('Estimated Fuel Used is miles over MPG, shown to one decimal', () => {
  assert.equal(estimatedGallons(55, 5.2), 10.577);
  assert.equal(formatNumber(10.577), '10.6');
  assert.equal(estimatedGallons(55, null), null);
  assert.equal(estimatedGallons(55, 0), null);
});

void test('tickets are ordered by time, then ticket number, then as saved', () => {
  const timed = orderRecords([
    record({ ticket_number: '5', time_out: '14:00' }),
    record({ ticket_number: '4', time_in: '8:05' }),
  ]);
  assert.equal(timed.basis, 'time');
  assert.deepEqual(timed.records.map((r) => r.ticket.ticket_number), ['4', '5']);
  assert.equal(timed.ambiguous, false);

  const numbered = orderRecords([
    record({ ticket_number: '1002' }),
    record({ ticket_number: '999' }),
  ]);
  assert.equal(numbered.basis, 'ticket_number');
  assert.deepEqual(numbered.records.map((r) => r.ticket.ticket_number), ['999', '1002']);
  assert.equal(numbered.ambiguous, false, 'same pickup and delivery: the order changes nothing');

  const differing = orderRecords([
    record({ ticket_number: '1002', project_address: 'Elsewhere Rd, Joliet, IL' }),
    record({ ticket_number: '1001' }),
  ]);
  assert.equal(differing.ambiguous, true, 'different deliveries without times could go either way');

  const saved = orderRecords([
    record({ ticket_number: 'A-2' }),
    record({ ticket_number: 'A-1', time_out: '09:00' }),
  ]);
  assert.equal(saved.basis, 'saved_order', 'one time is not every time');
  const plan = buildPlan(
    [record({ ticket_number: '2', project_address: 'Elsewhere Rd, Joliet, IL' }), record({ ticket_number: '1' })],
    truckIfta(truck()),
  );
  assert.ok(plan.reasons.some((reason) => reason.code === 'order_ambiguous'));
  assert.ok(plan.legs.length === 5, 'still estimated, just flagged');
});

void test('the input hash follows the fields that move the truck', () => {
  const base = demoDay();
  const before = inputHash(base, 7);
  const rated = base.map((r, i) => (i === 0 ? { ...r, ticket: { ...r.ticket, rate: 150, net_tons: 22 } } : r));
  assert.equal(inputHash(rated, 7), before, 'a rate does not change the route');
  const moved = base.map((r, i) => (i === 0 ? { ...r, ticket: { ...r.ticket, project_address: 'Other St' } } : r));
  assert.notEqual(inputHash(moved, 7), before);
  const retimed = base.map((r, i) => (i === 1 ? { ...r, ticket: { ...r.ticket, time_out: '06:00' } } : r));
  assert.notEqual(inputHash(retimed, 7), before);
  // Reassigning a ticket changes the day it leaves and the day it joins.
  const other = truck({ id: 8, truck_number: '44' });
  const trucks = [truck(), other];
  const first = truckDays(base, trucks).days;
  const reassigned = truckDays(
    base.map((r, i) => (i === 0 ? { ...r, truck_id: 8 } : r)),
    trucks,
  ).days;
  assert.equal(first.length, 1);
  assert.equal(reassigned.length, 2);
  assert.notEqual(reassigned.find((d) => d.truck_id === 7)?.input_hash, first[0].input_hash);
  assert.ok(reassigned.find((d) => d.truck_id === 8));
});

void test('days group by the truck the ticket resolves to; undated tickets are set aside', () => {
  const trucks = [truck()];
  const byNumber = record({ ticket_number: '3' }, { truck_id: null });
  const undated = record({ ticket_number: '4', ticket_date: null });
  const unknown = record({ ticket_number: '5' }, { truck_id: null, invoice: { ...record({}).invoice, truck_number: 'X9' } });
  const { days, excluded } = truckDays([byNumber, undated, unknown], trucks);
  assert.equal(days.length, 1);
  assert.deepEqual(days[0].records.map((r) => r.id), [byNumber.id]);
  assert.deepEqual(
    excluded.map((e) => [e.record.id, e.reason]),
    [[undated.id, 'no_date'], [unknown.id, 'no_truck']],
  );
  const ranged = truckDays([byNumber], trucks, { from: '2026-01-01', to: '2026-01-31' });
  assert.equal(ranged.days.length, 0);
});

void test('a ticket saved twice is one load with a warning', () => {
  const plan = buildPlan(
    [record({ ticket_number: '1001', time_out: '07:00' }), record({ ticket_number: '1001', time_out: '07:00' })],
    truckIfta(truck()),
  );
  assert.equal(plan.ticket_ids.length, 1);
  assert.equal(plan.legs.length, 3);
  assert.match(plan.warnings[0], /1001/);
  assert.deepEqual(plan.blocking, []);
});

void test('missing addresses and yard stop the plan; a missing MPG only flags it', () => {
  const noYard = buildPlan(demoDay(), truckIfta(truck({ ifta: undefined })));
  assert.deepEqual(noYard.blocking.map((r) => r.code), ['yard_missing']);
  assert.equal(noYard.legs.length, 0);
  const noSite = buildPlan([record({ project_address: '  ' })], truckIfta(truck()));
  assert.equal(noSite.blocking[0].code, 'missing_delivery_address');
  assert.equal(noSite.blocking[0].ticket_id, noSite.ticket_ids[0]);
  const noPlant = buildPlan([record({ plant_address: null })], truckIfta(truck()));
  assert.equal(noPlant.blocking[0].code, 'missing_pickup_address');
  const noMpg = buildPlan(demoDay(), { ...truckIfta(truck()), mpg: null });
  assert.deepEqual(noMpg.blocking, []);
  assert.ok(noMpg.reasons.some((r) => r.code === 'mpg_missing'));
  assert.equal(noMpg.legs.length, 5);
});

void test('the pickup query is the street address when the ticket has one', () => {
  assert.equal(pickupQuery(record({}).ticket), PLANT);
  const town = record({ plant_address: 'THORNTON' }).ticket;
  assert.equal(pickupQuery(town), 'Heidelberg Materials, THORNTON');
  assert.equal(placeKey('322 S. Williams St., Thornton, IL '), placeKey(PLANT));
});

void test('the profile converts to metres and kilograms and hashes on what routes', () => {
  assert.deepEqual(toRoutingProfile(DEFAULT_TRUCK_IFTA), {
    heightM: 4.11,
    widthM: 2.59,
    lengthM: 21.34,
    weightKg: 36287,
    axleWeightKg: 9072,
    axles: 5,
    commercial: true,
  });
  const base = truckIfta(truck());
  const version = 'routing/1;search/2';
  assert.notEqual(profileHash(base, version), profileHash({ ...base, mpg: 6 }, version), 'MPG is in the day hash');
  assert.equal(
    routingProfileHash(toRoutingProfile(base)),
    routingProfileHash(toRoutingProfile({ ...base, mpg: 6, yard_address: 'elsewhere' })),
    'but not in the route cache key',
  );
  assert.notEqual(profileHash(base, version), profileHash({ ...base, yard_address: 'elsewhere' }, version));
  assert.notEqual(profileHash(base, version), profileHash({ ...base, height_ft: 12 }, version));
  assert.notEqual(profileHash(base, version), profileHash(base, 'routing/2'));
});

void test('periods and summaries: Monday weeks, calendar quarters, distinct trucks', () => {
  const now = new Date(2026, 8, 18, 10); // Friday 18 September 2026
  assert.deepEqual(periodRange('today', now), { from: '2026-09-18', to: '2026-09-18' });
  assert.deepEqual(periodRange('week', now), { from: '2026-09-14', to: '2026-09-20' });
  assert.deepEqual(periodRange('month', now), { from: '2026-09-01', to: '2026-09-30' });
  assert.deepEqual(periodRange('quarter', now), { from: '2026-07-01', to: '2026-09-30' });
  assert.deepEqual(periodRange('last_quarter', now), { from: '2026-04-01', to: '2026-06-30' });
  assert.deepEqual(periodRange('week', new Date(2026, 8, 20)), { from: '2026-09-14', to: '2026-09-20' }, 'Sunday belongs to the week before');
  const day = (patch: Partial<MileageDay>): MileageDay =>
    readMileageDay({
      id: 1,
      truck_id: 7,
      truck_number: 'ZF0321',
      service_date: '2026-09-18',
      status: 'current',
      legs: [{ seq: 1, kind: 'yard_to_pickup', ticket_id: 1, from: { label: 'Yard', place_key: 'A', lat: 0, lon: 0 }, to: { label: 'Thornton', place_key: 'B', lat: 0, lon: 0 }, miles: 10, seconds: 600, route_id: 1, cached: false }],
      total_miles: '10.00',
      est_gallons: '1.923',
      ticket_count: 1,
      ...patch,
    });
  const days = [
    day({}),
    day({ id: 2, truck_id: 8, service_date: '2026-09-17', status: 'needs_review' }),
    day({ id: 3, truck_id: 7, service_date: '2026-09-01', status: 'failed', total_miles: null, legs: [] }),
    day({ id: 4, truck_id: 9, service_date: '2026-06-30' }),
  ];
  const week = summarizeDays(days, '2026-09-14', '2026-09-20');
  assert.deepEqual(week, { miles: 20, gallons: 3.846, loads: 2, trucks: 2, days: 2, review: 1 });
  const month = summarizeDays(days, '2026-09-01', '2026-09-30');
  assert.equal(month.review, 2, 'a failed day with nothing to show is still to review');
  assert.equal(month.days, 2);
  assert.equal(summarizeDays(days, '2026-04-01', '2026-06-30').trucks, 1);
});

void test('quarterly reports: every quarter from the first ticket to now, with totals per truck', () => {
  assert.equal(quarterKeyOf('2026-09-19'), '2026-Q3');
  assert.equal(quarterKeyOf('2026-01-01'), '2026-Q1');
  assert.equal(quarterKeyOf('2025-12-31'), '2025-Q4');
  assert.equal(quarterLabel('2026-Q3'), 'Q3 2026');
  assert.deepEqual(quarterRangeOf('2025-Q4'), { from: '2025-10-01', to: '2025-12-31' });
  assert.deepEqual(quarterRangeOf('2026-Q1'), { from: '2026-01-01', to: '2026-03-31' });
  assert.equal(quarterRangeOf('2026-Q5'), null);
  assert.equal(quarterRangeOf('week'), null);
  assert.deepEqual(quarterKeys('2025-11-02', '2026-09-19'), ['2026-Q3', '2026-Q2', '2026-Q1', '2025-Q4']);
  assert.deepEqual(quarterKeys('2026-09-01', '2026-09-19'), ['2026-Q3']);
  assert.deepEqual(quarterKeys('2026-09-19', '2026-01-01'), [], 'backwards is nothing');
  const day = (patch: Record<string, unknown>) =>
    readMileageDay({
      status: 'current',
      truck_number: 'ZF0321',
      truck_id: 7,
      legs: [{ seq: 1 }],
      total_miles: '10',
      est_gallons: '2',
      ticket_count: 1,
      ...patch,
    });
  const trucks = summarizeByTruck(
    [
      day({ id: 1, service_date: '2026-08-01' }),
      day({ id: 2, service_date: '2026-08-02', total_miles: '30', est_gallons: '6' }),
      day({ id: 3, service_date: '2026-08-02', truck_id: 8, truck_number: '44', status: 'needs_review' }),
      day({ id: 4, service_date: '2026-05-02', truck_id: 8, truck_number: '44' }),
    ],
    '2026-07-01',
    '2026-09-30',
  );
  assert.deepEqual(
    trucks.map((t) => [t.truck_number, t.miles, t.gallons, t.loads, t.days, t.review]),
    [['ZF0321', 40, 8, 2, 2, 0], ['44', 10, 2, 1, 1, 1]],
  );
});

void test('a stored row reads as numbers whatever the wire sent', () => {
  const day = readMileageDay({ id: '5', truck_id: '7', total_miles: '55.20', est_gallons: '10.615', mpg: '5.20', status: 'current', ticket_ids: ['1', '2'], legs: 'not a list' });
  assert.equal(day.total_miles, 55.2);
  assert.equal(day.est_gallons, 10.615);
  assert.equal(day.mpg, 5.2);
  assert.deepEqual(day.ticket_ids, [1, 2]);
  assert.deepEqual(day.legs, []);
  assert.equal(readMileageDay({ status: 'bogus' }).status, 'failed');
});

void test('the page knows a stale, current or failed day from its hash', () => {
  const expected = { key: '7|2026-09-18', truck_id: 7, truck_number: 'ZF0321', date: '2026-09-18', records: [], input_hash: 'abc' };
  const row = (patch: Partial<MileageDay>) => readMileageDay({ id: 1, status: 'current', input_hash: 'abc', ...patch });
  assert.equal(dayView(undefined, 'abc'), 'missing');
  assert.equal(dayView(row({}), 'abc'), 'current');
  assert.equal(dayView(row({ input_hash: 'old' }), 'abc'), 'stale');
  assert.equal(dayView(row({ status: 'failed' }), 'abc'), 'failed');
  const ifta = truckIfta(truck());
  const snap = row({ profile_snapshot: ifta });
  assert.equal(settingsChanged(snap, ifta), false);
  assert.equal(settingsChanged(snap, { ...ifta, mpg: 6 }), true);
  assert.equal(settingsChanged(snap, { ...ifta, yard_address: `${YARD},` }), false, 'punctuation is not a move');
  assert.equal(settingsChanged(snap, { ...ifta, axles: 6 }), true);
  assert.equal(settingsChanged(row({}), ifta), false, 'nothing stored, nothing changed');
  assert.equal(needsRecalculation(undefined, expected, false), true);
  assert.equal(needsRecalculation(row({}), expected, false), false);
  assert.equal(needsRecalculation(row({ input_hash: 'old' }), expected, false), true);
  assert.equal(needsRecalculation(row({ status: 'failed' }), expected, true), true);
  assert.equal(needsRecalculation(row({ status: 'failed' }), expected, false), false);
  const waiting = row({ status: 'needs_review', review_reasons: [{ code: 'place_unresolved', place_key: 'X' }] });
  assert.equal(needsRecalculation(waiting, expected, true), true, 'an unplaced address is worth one more ask per visit');
  assert.equal(needsRecalculation(waiting, expected, false), false);
  const ambiguous = row({ status: 'needs_review', review_reasons: [{ code: 'order_ambiguous' }] });
  assert.equal(needsRecalculation(ambiguous, expected, true), false, 'only a person can fix the order');
  assert.equal(needsRecalculation(row({ status: 'calculating', calc_started_at: new Date().toISOString() }), expected, true), false);
  assert.equal(needsRecalculation(row({ status: 'calculating', calc_started_at: '2020-01-01T00:00:00Z' }), expected, false), true);
  assert.deepEqual(
    routeLabels([
      { seq: 1, kind: 'yard_to_pickup', ticket_id: 1, from: { label: 'Yard', place_key: 'A', lat: 0, lon: 0 }, to: { label: 'Thornton', place_key: 'B', lat: 0, lon: 0 }, miles: 1, seconds: 1, route_id: null, cached: false },
      { seq: 2, kind: 'same_place', ticket_id: 1, from: { label: 'Thornton', place_key: 'B', lat: 0, lon: 0 }, to: { label: 'Thornton', place_key: 'B', lat: 0, lon: 0 }, miles: 0, seconds: 0, route_id: null, cached: false },
      { seq: 3, kind: 'delivery_to_yard', ticket_id: 1, from: { label: 'Thornton', place_key: 'B', lat: 0, lon: 0 }, to: { label: 'Yard', place_key: 'A', lat: 0, lon: 0 }, miles: 1, seconds: 1, route_id: null, cached: false },
    ]),
    ['Yard', 'Thornton', 'Yard'],
  );
});

void test('request parsers reject out-of-range and oversized input', () => {
  const ok = parseRecalculateBody({ days: [{ truck_id: 7, date: '2026-09-18' }, { truck_id: 7, date: '2026-09-18' }], force: true });
  assert.ok('value' in ok);
  assert.equal(ok.value.days.length, 1, 'repeats collapse');
  assert.equal(ok.value.force, true);
  assert.ok('error' in parseRecalculateBody({ days: [] }));
  assert.ok('error' in parseRecalculateBody({ days: Array.from({ length: 26 }, (_, i) => ({ truck_id: 1, date: `2026-01-${String(i + 1).padStart(2, '0')}` })) }));
  assert.ok('error' in parseRecalculateBody({ days: [{ truck_id: '7', date: '2026-09-18' }] }));
  assert.ok('error' in parseRecalculateBody({ days: [{ truck_id: 7, date: '2026-13-40' }] }));
  assert.ok('error' in parseRecalculateBody({ days: [{ truck_id: 7, date: '2026-09-18' }], force: 'yes' }));

  const fix = parsePlaceFixBody({ place_key: 'HEIDELBERG MATERIALS THORNTON', address: ' 322 S Williams St,  Thornton, IL ' });
  assert.ok('value' in fix);
  assert.equal(fix.value.address, '322 S Williams St, Thornton, IL');
  assert.ok('error' in parsePlaceFixBody({ place_key: 'lower-case', address: 'x' }));
  assert.ok('error' in parsePlaceFixBody({ place_key: 'A', address: 'x'.repeat(201) }));
  assert.ok('error' in parsePlaceFixBody({ place_key: 'A', address: 'line\nbreak' }));
  assert.ok('error' in parsePlaceFixBody({ place_key: 'A', address: '   ' }));

  const now = new Date(2026, 8, 18);
  const range = parseDateRange(null, null, now);
  assert.ok('value' in range);
  assert.deepEqual(range.value, { from: '2026-04-01', to: '2026-09-18' });
  assert.ok('error' in parseDateRange('2026-09-18', '2026-09-01', now));
  assert.ok('error' in parseDateRange('2020-01-01', '2026-09-01', now));
  assert.ok('error' in parseDateRange('18/09/2026', null, now));

  const good = parseTruck({ ...truck(), id: undefined, ifta: { ...DEFAULT_TRUCK_IFTA, yard_address: ` ${YARD} ` } });
  assert.ok('value' in good);
  assert.equal(good.value.ifta?.yard_address, YARD);
  assert.equal(good.value.ifta?.mpg, 5.2);
  const legacy = parseTruck({ ...truck(), id: undefined, ifta: undefined });
  assert.ok('value' in legacy && !('ifta' in legacy.value), 'trucks saved before IFTA stay as they were');
  for (const bad of [
    { mpg: 0 },
    { mpg: 31 },
    { height_ft: 20 },
    { width_ft: 4 },
    { length_ft: 101 },
    { gross_weight_lb: 250_000 },
    { axle_weight_lb: 1_000 },
    { axles: 13 },
    { axles: 2.5 },
    { commercial: 'yes' },
    { yard_address: 'x'.repeat(201) },
  ]) {
    const parsed = parseTruck({ ...truck(), id: undefined, ifta: { ...DEFAULT_TRUCK_IFTA, ...bad } });
    assert.ok('error' in parsed, `accepted ${JSON.stringify(bad)}`);
  }
});

void test('a confirmed order is tied to the day\u2019s tickets and their addresses', () => {
  const base = demoDay();
  const before = stopOrderBasis(base);
  const retimed = base.map((r, i) => (i === 0 ? { ...r, ticket: { ...r.ticket, time_out: '18:00' } } : r));
  assert.equal(stopOrderBasis(retimed), before, 'a time does not move a stop');
  const rated = base.map((r, i) => (i === 1 ? { ...r, ticket: { ...r.ticket, rate: 150, net_tons: 22 } } : r));
  assert.equal(stopOrderBasis(rated), before, 'nor does what the load was worth');
  const moved = base.map((r, i) => (i === 0 ? { ...r, ticket: { ...r.ticket, project_address: 'Elsewhere Rd, Joliet, IL' } } : r));
  assert.notEqual(stopOrderBasis(moved), before);
  const punctuated = base.map((r, i) => (i === 0 ? { ...r, ticket: { ...r.ticket, project_address: `${SITE}.` } } : r));
  assert.equal(stopOrderBasis(punctuated), before, 'punctuation is not a move');
  assert.notEqual(stopOrderBasis([...base, record({ ticket_number: '1003' })]), before, 'another ticket is another day');
  assert.notEqual(stopOrderBasis([base[0]]), before);
});

void test('a confirmed order is used while it fits the day, and ignored once it does not', () => {
  const ambiguous = [
    record({ ticket_number: 'A-2', project_address: 'Elsewhere Rd, Joliet, IL' }),
    record({ ticket_number: 'A-1' }),
  ];
  const flagged = buildPlan(ambiguous, truckIfta(truck()));
  assert.equal(flagged.order_basis, 'saved_order');
  const reason = flagged.reasons.find((r) => r.code === 'order_ambiguous');
  assert.deepEqual(reason?.ticket_ids, flagged.ticket_ids, 'the page is told which order was used');

  const confirmed: StopOrder = {
    ticket_ids: [ambiguous[1].id, ambiguous[0].id],
    basis: stopOrderBasis(ambiguous),
    confirmed_at: '2026-09-19T12:00:00.000Z',
  };
  assert.equal(stopOrderApplies(confirmed, ambiguous), true);
  const plan = buildPlan(ambiguous, truckIfta(truck()), confirmed);
  assert.equal(plan.order_basis, 'confirmed');
  assert.equal(plan.ambiguous, false);
  assert.deepEqual(plan.ticket_ids, confirmed.ticket_ids);
  assert.ok(!plan.reasons.some((r) => r.code === 'order_ambiguous'));

  const moved = ambiguous.map((r, i) => (i === 0 ? { ...r, ticket: { ...r.ticket, project_address: 'Another Rd, Joliet, IL' } } : r));
  assert.equal(stopOrderApplies(confirmed, moved), false);
  const stale = buildPlan(moved, truckIfta(truck()), confirmed);
  assert.equal(stale.order_basis, 'saved_order');
  assert.ok(stale.reasons.some((r) => r.code === 'order_ambiguous'));
  assert.equal(stopOrderApplies({ ...confirmed, ticket_ids: [ambiguous[0].id] }, ambiguous), false, 'every stop or none');
  assert.equal(
    stopOrderApplies({ ...confirmed, ticket_ids: [ambiguous[0].id, ambiguous[0].id] }, ambiguous),
    false,
    'a ticket cannot be hauled twice',
  );
  assert.equal(stopOrderApplies(null, ambiguous), false);

  // A ticket saved twice is one stop, so the order names it once.
  const twice = [
    record({ ticket_number: '1001', time_out: '07:00' }),
    record({ ticket_number: '1001', time_out: '07:00' }),
  ];
  const single = buildPlan(twice, truckIfta(truck()));
  assert.equal(
    stopOrderApplies({ ticket_ids: single.ticket_ids, basis: stopOrderBasis(twice), confirmed_at: '' }, twice),
    true,
  );
});

void test('the stop order parser takes a day and its stops, each once', () => {
  const ok = parseStopOrderBody({ truck_id: 7, date: '2026-09-18', ticket_ids: [3, 1, 2] });
  assert.ok('value' in ok);
  assert.deepEqual(ok.value.ticket_ids, [3, 1, 2], 'the order given is the order kept');
  assert.ok('error' in parseStopOrderBody({ truck_id: 0, date: '2026-09-18', ticket_ids: [1] }));
  assert.ok('error' in parseStopOrderBody({ truck_id: '7', date: '2026-09-18', ticket_ids: [1] }));
  assert.ok('error' in parseStopOrderBody({ truck_id: 7, date: '18/09/2026', ticket_ids: [1] }));
  assert.ok('error' in parseStopOrderBody({ truck_id: 7, date: '2026-09-18', ticket_ids: [] }));
  assert.ok('error' in parseStopOrderBody({ truck_id: 7, date: '2026-09-18', ticket_ids: [1, 1] }));
  assert.ok('error' in parseStopOrderBody({ truck_id: 7, date: '2026-09-18', ticket_ids: [1, -2] }));
  assert.ok('error' in parseStopOrderBody({ truck_id: 7, date: '2026-09-18', ticket_ids: ['1'] }));
  assert.ok('error' in parseStopOrderBody({ truck_id: 7, date: '2026-09-18', ticket_ids: Array.from({ length: 61 }, (_, i) => i + 1) }));
  assert.ok('error' in parseStopOrderBody([{ truck_id: 7 }]));
});

void test('a stored day reads back the order a person confirmed, or nothing', () => {
  const stored = readMileageDay({
    id: 1,
    status: 'current',
    order_basis: 'confirmed',
    stop_order: { ticket_ids: [2, 1], basis: 'abc', confirmed_at: '2026-09-19T12:00:00.000Z' },
  });
  assert.equal(stored.order_basis, 'confirmed');
  assert.deepEqual(stored.stop_order, { ticket_ids: [2, 1], basis: 'abc', confirmed_at: '2026-09-19T12:00:00.000Z' });
  assert.equal(readMileageDay({ id: 1 }).stop_order, null);
  assert.equal(readMileageDay({ stop_order: 'confirmed' }).stop_order, null);
  assert.equal(readMileageDay({ stop_order: { ticket_ids: ['1'], basis: 'abc', confirmed_at: 'x' } }).stop_order, null);
  assert.equal(readMileageDay({ stop_order: { ticket_ids: [1], basis: 'abc' } }).stop_order, null);
  assert.equal(readMileageDay({ order_basis: 'guessed' }).order_basis, null);
});

// ---------------------------------------------------------- source guards

const root = new URL('..', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), 'utf8');
const walk = (dir: string): string[] =>
  readdirSync(new URL(dir, root)).flatMap((name) => {
    const path = join(dir, name);
    return statSync(new URL(path, root)).isDirectory() ? walk(path) : [path];
  });

void test('the mileage store scopes every query and write to the workspace it was given', () => {
  const source = read('lib/server/mileage-store.ts');
  const scopes = [...source.matchAll(/\.eq\('workspace_id',\s*([^)]+)\)/g)].map((m) => m[1].trim());
  assert.ok(scopes.length > 0);
  for (const scope of scopes) assert.equal(scope, 'workspace');
  const writes = [...source.matchAll(/workspace_id:\s*([^,\n]+)/g)].map((m) => m[1].trim());
  assert.ok(writes.length > 0);
  for (const write of writes) assert.equal(write, 'workspace');
});

void test('the demo yard is data on the truck, not code', () => {
  for (const path of [...walk('lib'), ...walk('components'), ...walk('app')]) {
    if (!/\.(ts|tsx|css)$/.test(path)) continue;
    const source = read(path);
    assert.ok(!/mokena|191st/i.test(source), `${path} names the demo yard`);
  }
});

void test('TomTom is spoken to only on the server', () => {
  // The page may name the provider in a footnote; the key, its URL and its
  // client may appear only under lib/server.
  for (const path of [...walk('lib'), ...walk('components'), ...walk('app')]) {
    if (!/\.(ts|tsx)$/.test(path) || path.startsWith('lib/server/')) continue;
    const source = read(path);
    assert.ok(!/TOMTOM|api\.tomtom\.com|tomtomProvider/.test(source), `${path} reaches TomTom outside lib/server`);
  }
  const key = read('lib/server/tomtom-key.ts');
  assert.match(key, /TOMTOM_API_KEY/);
  for (const path of [...walk('lib'), ...walk('components'), ...walk('app')]) {
    if (!/\.(ts|tsx)$/.test(path) || path === 'lib/server/tomtom-key.ts') continue;
    assert.ok(!read(path).includes('TOMTOM_API_KEY'), `${path} reads the key directly`);
  }
});
