import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultClient, defaultTruck, type ClientProfile, type CompanyProfile } from '../lib/load-desk/profiles.ts';
import { parseCompany } from '../lib/load-desk/record-input.ts';

const client = (id: number, name: string): ClientProfile => ({
  id,
  name,
  address_lines: ['', ''],
  phone: '',
  notes: '',
  created_at: '2026-01-01T00:00:00.000Z',
});

const company = (patch: Partial<CompanyProfile> = {}): CompanyProfile => ({
  id: 1,
  name: 'A & D TRUCKING OF CHICAGO INC',
  address_lines: ['17954 SEMMLER DR.', 'TINLEY PARK, IL 60487'],
  updated_at: '2026-09-16T00:00:00.000Z',
  ...patch,
});

const clients = [client(1, 'ILLINOIS BULK CARRIER'), client(2, 'PAN OCEANIC')];

void test('the default client is the one the company points at', () => {
  assert.equal(defaultClient(clients, company({ default_client_id: 2 }))?.name, 'PAN OCEANIC');
});

void test('no default, or one since deleted, leaves the invoice to choose', () => {
  assert.equal(defaultClient(clients, company()), null);
  assert.equal(defaultClient(clients, company({ default_client_id: null })), null);
  assert.equal(defaultClient(clients, company({ default_client_id: 99 })), null);
  assert.equal(defaultClient([], company({ default_client_id: 1 })), null);
  assert.equal(defaultClient(clients, null), null);
});

const sent = (patch: Record<string, unknown> = {}) => ({
  name: 'A & D TRUCKING OF CHICAGO INC',
  address_lines: ['17954 SEMMLER DR.', 'TINLEY PARK, IL 60487'],
  updated_at: '2026-09-16T00:00:00.000Z',
  ...patch,
});

void test('the server keeps a default client sent with the company', () => {
  const parsed = parseCompany(sent({ default_client_id: 3 }));
  assert.ok('value' in parsed);
  assert.equal(parsed.value.default_client_id, 3);
});

void test('no default client is stored when none was sent', () => {
  for (const value of [sent(), sent({ default_client_id: null })]) {
    const parsed = parseCompany(value);
    assert.ok('value' in parsed);
    assert.equal('default_client_id' in parsed.value, false);
  }
});

void test('a default client that is not a real id is refused', () => {
  for (const bad of ['2', 0, -1, 2.5, {}]) {
    const parsed = parseCompany(sent({ default_client_id: bad }));
    assert.ok('error' in parsed, `refused: ${JSON.stringify(bad)}`);
  }
});

void test('the default truck is kept on the company and ignored once the truck is gone or retired', () => {
  const trucks = [
    { id: 3, truck_number: '3211', nickname: '', driver: 'Mike', license_plate: '', notes: '', active: true, created_at: '' },
    { id: 4, truck_number: 'ZF0321', nickname: '', driver: '', license_plate: '', notes: '', active: false, created_at: '' },
  ];
  const company = { id: 1, name: 'A & D', address_lines: ['', ''] as [string, string], updated_at: '', default_truck_id: 3 };
  assert.equal(defaultTruck(trucks, company)?.id, 3);
  assert.equal(defaultTruck(trucks, { ...company, default_truck_id: 4 }), null, 'a retired truck is no default');
  assert.equal(defaultTruck(trucks, { ...company, default_truck_id: 9 }), null, 'a deleted truck is no default');
  assert.equal(defaultTruck(trucks, { ...company, default_truck_id: undefined }), null);
  // The server keeps it, and refuses nonsense.
  const parsed = parseCompany({ name: 'A & D', address_lines: ['1 Main St', 'Chicago, IL'], updated_at: '2026-09-21T00:00:00.000Z', default_truck_id: 3 });
  assert.ok('value' in parsed && parsed.value.default_truck_id === 3);
  assert.ok('error' in parseCompany({ name: 'A & D', address_lines: ['1 Main St', 'Chicago, IL'], updated_at: '2026-09-21T00:00:00.000Z', default_truck_id: 'three' }));
});
