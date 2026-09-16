import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  customerIdFor,
  matchCustomer,
  matchCustomerDetailed,
  matchTruck,
  summarize,
  truckIdFor,
  type CustomerProfile,
  type TruckProfile,
} from '../lib/load-desk/profiles.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

const customer = (patch: Partial<CustomerProfile>): CustomerProfile => ({
  id: 1,
  name: 'Customer',
  ticket_customer_ids: [],
  ticket_names: [],
  flat_rate: null,
  fuel_charge: null,
  notes: '',
  created_at: '2026-01-01T00:00:00.000Z',
  ...patch,
});

const truck = (patch: Partial<TruckProfile>): TruckProfile => ({
  id: 1,
  truck_number: '3211',
  nickname: '',
  driver: '',
  license_plate: '',
  notes: '',
  active: true,
  created_at: '2026-01-01T00:00:00.000Z',
  ...patch,
});

let recordId = 0;
const record = (
  ticket: Partial<Ticket>,
  extra: Partial<SavedRecord> = {},
): SavedRecord => ({
  id: ++recordId,
  saved_at: '2026-09-16T15:00:00.000Z',
  ticket: { ...emptyTicket(), ...ticket },
  invoice: {
    invoice_number: `INV-${recordId}`,
    invoice_date: '2026-09-16',
    return_date: '',
    truck_number: '',
    bill_to: { name: 'X', address_lines: ['', ''], phone: '' },
  },
  source: {
    file_name: 'ticket.pdf',
    sha256: String(recordId),
    size: 1,
    type: 'application/pdf',
    kind: 'upload',
  },
  original_stored: true,
  ocr_text: '',
  ...extra,
});

const witech = customer({
  id: 1,
  name: 'Witech',
  ticket_customer_ids: ['60311596'],
  flat_rate: 150,
});
const otr = customer({
  id: 2,
  name: 'Ontario Trap Rock',
  ticket_names: ['ONTARIO TRAP ROCK - US'],
  flat_rate: 175,
  fuel_charge: 20,
});

void test('customers match by ticket number before name', () => {
  assert.equal(
    matchCustomer([witech, otr], {
      customer_id: '60311596',
      customer_name: 'Ontario Trap Rock - US',
    })?.id,
    1,
  );
});

void test('customer names match as whole words, ignoring punctuation and case', () => {
  const ticket = { customer_id: null, customer_name: 'WITECH COMPANY INC' };
  assert.equal(matchCustomer([witech, otr], ticket)?.id, 1);
  assert.equal(
    matchCustomer([otr], { customer_id: '20654', customer_name: 'Ontario Trap Rock US' })?.id,
    2,
  );
  assert.equal(
    matchCustomer([customer({ name: 'Tech' })], ticket),
    null,
    'part of a word must not match',
  );
});

void test('a printed name a letter or two off still finds its customer', () => {
  const printed = customer({ id: 1, name: 'WITECH COMPANY INC' });
  const others = [printed, customer({ id: 2, name: 'Ontario Trap Rock' })];
  // A letter cut off the end, a doubled letter, and a dropped letter.
  for (const name of ['WITECH COMPANY IN', 'WITECHH COMPANY INC', 'WTECH COMPANY INC']) {
    const match = matchCustomerDetailed(others, { customer_id: null, customer_name: name });
    assert.equal(match?.customer.id, 1, name);
    assert.equal(match?.how, 'near', name);
    assert.equal(match?.alias, 'WITECH COMPANY INC');
  }
  // An exact printed name is still reported as an exact name match.
  assert.equal(
    matchCustomerDetailed(others, {
      customer_id: null,
      customer_name: 'WITECH COMPANY INC',
    })?.how,
    'name',
  );
});

void test('a misprint never picks between two similar customers', () => {
  const pair = [
    customer({ id: 1, name: 'K FIVE CONST CORP' }),
    customer({ id: 2, name: 'K FIVE CONST CORE' }),
  ];
  assert.equal(
    matchCustomer(pair, { customer_id: null, customer_name: 'K FIVE CONST CORS' }),
    null,
    'equally close to both, so neither is chosen',
  );
  // The exact spelling of one of them still matches it.
  assert.equal(
    matchCustomer(pair, { customer_id: null, customer_name: 'K FIVE CONST CORE' })?.id,
    2,
  );
});

void test('short names must be printed exactly', () => {
  const short = [customer({ id: 1, name: 'ABC' })];
  assert.equal(matchCustomer(short, { customer_id: null, customer_name: 'ABD' }), null);
  assert.equal(matchCustomer(short, { customer_id: null, customer_name: 'ABC' })?.id, 1);
});

void test('a name too far off is not a misprint', () => {
  const only = [customer({ id: 1, name: 'WITECH COMPANY INC' })];
  assert.equal(
    matchCustomer(only, { customer_id: null, customer_name: 'PAN OCEANIC SHIPPING' }),
    null,
  );
});

void test('an unknown customer has no profile', () => {
  assert.equal(
    matchCustomer([witech, otr], { customer_id: '999', customer_name: 'PAN OCEANIC' }),
    null,
  );
});

void test('truck numbers match without punctuation or case', () => {
  const trucks = [truck({ id: 7, truck_number: 'ZF-0321' })];
  assert.equal(matchTruck(trucks, 'zf0321')?.id, 7);
  assert.equal(matchTruck(trucks, '321'), null);
});

void test('saved tickets count under their chosen profile, falling back to a match', () => {
  const chosen = record({ customer_name: 'PAN OCEANIC' }, { customer_profile_id: 2 });
  const older = record({ customer_id: '60311596' });
  const deleted = record({ customer_id: '60311596' }, { customer_profile_id: 99 });
  assert.equal(customerIdFor(chosen, [witech, otr]), 2);
  assert.equal(customerIdFor(older, [witech, otr]), 1);
  assert.equal(customerIdFor(deleted, [witech, otr]), 1);

  const trucks = [truck({ id: 3, truck_number: '3211' })];
  const byNumber = record({});
  byNumber.invoice.truck_number = '3211';
  assert.equal(truckIdFor(byNumber, trucks), 3);
  assert.equal(truckIdFor(record({}, { truck_id: 3 }), trucks), 3);
  assert.equal(truckIdFor(record({}), trucks), null);
});

void test('loads are counted per day, Monday-start week, month, year and lifetime', () => {
  // Wednesday 16 September 2026, local time.
  const now = new Date(2026, 8, 16, 10);
  const loads = [
    record({ ticket_date: '2026-09-16', net_tons: 22.91, rate: 150, fuel_charge: 20 }),
    record({ ticket_date: '2026-09-14', net_tons: 22.39, rate: 150 }),
    record({ ticket_date: '2026-09-13', net_lb: 44780 }),
    record({ ticket_date: '2026-09-02', net_tons: 10 }),
    record({ ticket_date: '2026-01-05', net_tons: 10 }),
    record({ ticket_date: '2025-01-07', net_tons: 10 }),
    record({ ticket_date: null }, { saved_at: new Date(2026, 8, 16, 12).toISOString() }),
  ];
  const summary = summarize(loads, now);
  const counts = Object.fromEntries(
    Object.entries(summary.periods).map(([key, value]) => [key, value.loads]),
  );
  assert.deepEqual(counts, { today: 2, week: 3, month: 5, year: 6, lifetime: 7 });
  assert.equal(Math.round(summary.periods.week.tons * 100) / 100, 45.3);
  assert.equal(Math.round(summary.periods.month.tons * 100) / 100, 77.69);
  assert.equal(summary.billed, 320);
  assert.equal(summary.lastLoad, '2026-09-16');
});

void test('a vehicle number misread by the scanner still finds its truck', () => {
  const trucks = [truck({ id: 1, truck_number: 'ZF0321' })];
  // The shapes OCR trades: 0/O, 1/I, 5/S, 8/B.
  for (const printed of ['ZF0321', 'ZFO321', 'ZF032I', 'ZFO32I', 'zf 0321']) {
    assert.equal(matchTruck(trucks, printed)?.id, 1, `should match ${printed}`);
  }
  assert.equal(matchTruck(trucks, 'ZF0322'), null, 'a different truck is not a misread');
  assert.equal(matchTruck(trucks, ''), null);
});

void test('two trucks a misread apart are left for a person to choose', () => {
  // ZF0321 and ZFO32I fold to the same key, so neither can be assumed.
  const trucks = [
    truck({ id: 1, truck_number: 'ZF0321' }),
    truck({ id: 2, truck_number: 'ZFO32I' }),
  ];
  assert.equal(matchTruck(trucks, 'ZF0321')?.id, 1, 'an exact match still wins');
  assert.equal(matchTruck(trucks, 'ZFO32l'), null, 'an ambiguous misread picks neither');
});
