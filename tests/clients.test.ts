import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clientForBillTo, type ClientProfile } from '../lib/load-desk/profiles.ts';
import { parseClient, parseProfileBody } from '../lib/load-desk/record-input.ts';

const created_at = '2026-09-15T12:00:00.000Z';
const client = {
  name: 'Illinois Bulk Carrier',
  address_lines: ['700 E. Joe Orr Rd.', 'Chicago Heights, IL 60411'],
  phone: '708-758-5800',
  notes: '',
  created_at,
};

void test('client details are trimmed and need a name', () => {
  const parsed = parseClient({ ...client, name: '  Illinois   Bulk Carrier ', phone: ' 708-758-5800 ' });
  assert.ok('value' in parsed);
  assert.equal(parsed.value.name, 'Illinois Bulk Carrier');
  assert.equal(parsed.value.phone, '708-758-5800');
  assert.deepEqual(parsed.value.address_lines, ['700 E. Joe Orr Rd.', 'Chicago Heights, IL 60411']);
  assert.ok('value' in parseClient({ ...client, address_lines: ['', ''], phone: '' }));
  assert.ok('error' in parseClient({ ...client, name: '  ' }));
  assert.ok('error' in parseClient({ ...client, address_lines: ['700 E. Joe Orr Rd.'] }));
  assert.ok('error' in parseClient({ ...client, phone: 'x'.repeat(41) }));
  assert.ok('error' in parseClient({ ...client, notes: undefined }));
});

void test('client profiles are accepted by the profiles API', () => {
  const body = parseProfileBody({ kind: 'client', profile: client });
  assert.ok('value' in body);
  assert.equal(body.value.kind, 'client');
  assert.ok('error' in parseProfileBody({ kind: 'client', profile: { name: 'X' } }));
});

void test('a bill-to matches the client it was filled from, ignoring case and spacing', () => {
  const clients: ClientProfile[] = [
    { ...client, id: 1, address_lines: ['700 E. Joe Orr Rd.', 'Chicago Heights, IL 60411'] },
    { ...client, id: 2, name: 'Witech Company', address_lines: ['1 Main St', 'Gary, IN'], phone: '' },
  ];
  assert.equal(
    clientForBillTo(clients, {
      name: 'ILLINOIS BULK  CARRIER',
      address_lines: ['700 e. joe orr rd.', 'Chicago Heights, IL 60411 '],
      phone: '708-758-5800',
    })?.id,
    1,
  );
  assert.equal(clientForBillTo(clients, { name: 'Witech Company', address_lines: ['1 Main St', 'Gary, IN'], phone: '' })?.id, 2);
  // Edited by hand: no longer that client.
  assert.equal(
    clientForBillTo(clients, { name: 'Illinois Bulk Carrier', address_lines: ['700 E. Joe Orr Rd.', 'Chicago Heights, IL 60411'], phone: '555-0100' }),
    null,
  );
  assert.equal(clientForBillTo([], { name: 'Anyone', address_lines: ['', ''], phone: '' }), null);
});
