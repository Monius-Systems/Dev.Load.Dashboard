import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultClient, type ClientProfile, type CompanyProfile } from '../lib/load-desk/profiles.ts';
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
