import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addCustomerAddress,
  customerAddresses,
  normalizeAddress,
  type CustomerProfile,
} from '../lib/load-desk/profiles.ts';
import { parseCustomer } from '../lib/load-desk/record-input.ts';

const customer = (addresses?: string[]): CustomerProfile => ({
  id: 1,
  name: 'Witech Company',
  ticket_customer_ids: [],
  ticket_names: [],
  ...(addresses === undefined ? {} : { addresses }),
  flat_rate: null,
  fuel_charge: null,
  notes: '',
  created_at: '2026-01-01T00:00:00.000Z',
});

void test('an address is stored on one line, without a trailing comma', () => {
  assert.equal(
    normalizeAddress('  1840   S Cicero Ave,\n Chicago, IL ,  '),
    '1840 S Cicero Ave, Chicago, IL',
  );
  assert.equal(normalizeAddress('   '), '');
});

void test('profiles saved before addresses existed simply have none', () => {
  assert.deepEqual(customerAddresses(customer()), []);
  assert.deepEqual(customerAddresses(null), []);
});

void test('a customer’s addresses come back cleaned, without blanks or repeats', () => {
  assert.deepEqual(
    customerAddresses(
      customer([
        '  1840 S Cicero Ave,  Chicago IL ',
        '',
        '1840 s cicero ave, chicago, il',
        '600 Quarry Rd, Joliet IL',
      ]),
    ),
    ['1840 S Cicero Ave, Chicago IL', '600 Quarry Rd, Joliet IL'],
  );
});

void test('an address added from a ticket joins the end of the list', () => {
  assert.deepEqual(
    addCustomerAddress(customer(['600 Quarry Rd, Joliet IL']), ' 1840 S Cicero Ave '),
    ['600 Quarry Rd, Joliet IL', '1840 S Cicero Ave'],
  );
  assert.deepEqual(addCustomerAddress({}, '600 Quarry Rd'), ['600 Quarry Rd']);
});

void test('an address already on the profile is not added a second time', () => {
  const saved = customer(['1840 S Cicero Ave, Chicago IL']);
  // The same place, printed with a comma and in capitals on another ticket.
  assert.deepEqual(addCustomerAddress(saved, '1840 S CICERO AVE, CHICAGO, IL'), [
    '1840 S Cicero Ave, Chicago IL',
  ]);
  assert.deepEqual(addCustomerAddress(saved, '   '), ['1840 S Cicero Ave, Chicago IL']);
});

void test('the server keeps a customer’s addresses, trimmed, and turns away bad ones', () => {
  const body = {
    name: 'Witech Company',
    ticket_customer_ids: [],
    ticket_names: [],
    addresses: ['  1840 S Cicero Ave,  Chicago IL ', '   '],
    flat_rate: null,
    fuel_charge: null,
    notes: '',
    created_at: '2026-09-15T12:00:00.000Z',
  };
  const parsed = parseCustomer(body);
  assert.ok('value' in parsed);
  assert.deepEqual(parsed.value.addresses, ['1840 S Cicero Ave, Chicago IL']);

  // Profiles saved before addresses existed still parse, with none.
  const { addresses: _omitted, ...older } = body;
  const withoutAddresses = parseCustomer(older);
  assert.ok('value' in withoutAddresses);
  assert.deepEqual(withoutAddresses.value.addresses, []);

  assert.ok('error' in parseCustomer({ ...body, addresses: 'one address' }));
  assert.ok('error' in parseCustomer({ ...body, addresses: [42] }));
  assert.ok('error' in parseCustomer({ ...body, addresses: Array(41).fill('x') }));
  assert.ok('error' in parseCustomer({ ...body, addresses: ['x'.repeat(201)] }));
});
