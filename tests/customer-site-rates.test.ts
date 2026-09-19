import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  customerLocationRates,
  locationRateFor,
  rateFor,
} from '../lib/load-desk/customer-rates.ts';
import { parseCustomer } from '../lib/load-desk/record-input.ts';
import type { CustomerProfile } from '../lib/load-desk/profiles.ts';

// Some customers have their loads go to several places at different prices,
// so the rate is the site's. A ticket to a site without one, or to no site on
// file, is rated as it is reviewed. The customer-level figures still on older
// saved profiles are not read.

const customer = (patch: Partial<CustomerProfile> = {}): CustomerProfile => ({
  id: 1,
  name: 'K FIVE CONST CORP',
  ticket_customer_ids: ['60311115'],
  ticket_names: [],
  addresses: ['1 Quarry Rd, Thornton, IL', '250 Harbor Ave, Gary, IN'],
  flat_rate: 50,
  rate_type: 'flat',
  fuel_charge: 10,
  fuel_type: 'flat',
  notes: '',
  created_at: '2026-01-01T00:00:00.000Z',
  ...patch,
});

void test('a ticket to a site is charged that site’s rate', () => {
  const profile = customer({
    location_rates: [
      { address: '250 Harbor Ave, Gary, IN', flat_rate: 65, rate_type: 'per_ton', fuel_charge: 12, fuel_type: 'percent' },
    ],
  });
  assert.deepEqual(rateFor(profile, '250 Harbor Ave, Gary, IN'), {
    flat_rate: 65,
    rate_type: 'per_ton',
    fuel_charge: 12,
    fuel_type: 'percent',
  });
});

void test('a ticket to a site without a rate is rated on the ticket', () => {
  // Nothing filled in: the reviewer enters the rate. The customer-level
  // figures an older profile may still carry are not read.
  const profile = customer({
    flat_rate: 50,
    fuel_charge: 10,
    location_rates: [{ address: '250 Harbor Ave, Gary, IN', flat_rate: 65, fuel_charge: null }],
  });
  const none = { flat_rate: null, rate_type: 'flat', fuel_charge: null, fuel_type: 'flat' };
  assert.deepEqual(rateFor(profile, '1 Quarry Rd, Thornton, IL'), none, 'the other site');
  assert.deepEqual(rateFor(profile, null), none, 'no address read off the ticket');
  assert.deepEqual(rateFor(profile, '9 Nowhere Ln'), none, 'an address not on file');
  assert.deepEqual(rateFor(customer({ flat_rate: 50 }), '250 Harbor Ave, Gary, IN'), none, 'no site rates at all');
});

void test('the address is matched the way addresses are, not letter for letter', () => {
  // A comma or a capital out of place, as a scan reads it, is the same site.
  const profile = customer({
    location_rates: [{ address: '250 Harbor Ave, Gary, IN', flat_rate: 65, fuel_charge: null }],
  });
  assert.equal(rateFor(profile, '250 HARBOR AVE  GARY IN,').flat_rate, 65);
  assert.equal(locationRateFor(profile, '250 harbor ave, gary, in')?.address, '250 Harbor Ave, Gary, IN');
});

void test('a site can have a fuel charge without a rate', () => {
  const profile = customer({
    location_rates: [
      { address: '250 Harbor Ave, Gary, IN', flat_rate: null, fuel_charge: 15, fuel_type: 'percent' },
    ],
  });
  assert.deepEqual(rateFor(profile, '250 Harbor Ave, Gary, IN'), {
    flat_rate: null,
    rate_type: 'flat',
    fuel_charge: 15,
    fuel_type: 'percent',
  });
});

void test('site rates are cleaned against the customer’s addresses', () => {
  const sites = customerLocationRates(
    customer({
      location_rates: [
        // Not one of the customer's addresses: dropped.
        { address: '9 Nowhere Ln', flat_rate: 99, fuel_charge: null },
        // Nothing said: charged at the customer's rate anyway, so not kept.
        { address: '1 Quarry Rd, Thornton, IL', flat_rate: null, fuel_charge: null },
        // Kept, under the customer's own spelling of the address.
        { address: '250 harbor ave, gary, in', flat_rate: 65, fuel_charge: null },
        // The same site again: the first wins.
        { address: '250 Harbor Ave, Gary, IN', flat_rate: 70, fuel_charge: null },
      ],
    }),
  );
  assert.deepEqual(sites, [
    { address: '250 Harbor Ave, Gary, IN', flat_rate: 65, rate_type: 'flat', fuel_charge: null },
  ]);
  assert.deepEqual(customerLocationRates(customer()), [], 'none before site rates existed');
});

void test('site rates come through the API cleaned, and bad ones are refused', () => {
  const sent = {
    ...customer(),
    location_rates: [
      { address: ' 250 Harbor Ave,  Gary, IN ', flat_rate: 65, rate_type: 'per_ton', fuel_charge: null },
      { address: '9 Nowhere Ln', flat_rate: 1, fuel_charge: null },
    ],
  };
  const parsed = parseCustomer(sent);
  assert.ok('value' in parsed);
  assert.deepEqual(parsed.value.location_rates, [
    { address: '250 Harbor Ave, Gary, IN', flat_rate: 65, rate_type: 'per_ton', fuel_charge: null },
  ]);
  const absent = parseCustomer(customer());
  assert.ok('value' in absent);
  assert.deepEqual(absent.value.location_rates, [], 'absent is fine');
  for (const bad of [
    [{ address: '', flat_rate: 1, fuel_charge: null }],
    [{ address: '250 Harbor Ave, Gary, IN', flat_rate: -1, fuel_charge: null }],
    [{ address: '250 Harbor Ave, Gary, IN', flat_rate: 'sixty', fuel_charge: null }],
    [{ address: '250 Harbor Ave, Gary, IN', flat_rate: 1, rate_type: 'weekly', fuel_charge: null }],
    'not a list',
  ]) {
    assert.ok('error' in parseCustomer({ ...customer(), location_rates: bad }), JSON.stringify(bad));
  }
});
