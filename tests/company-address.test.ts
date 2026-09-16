import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  business,
  sellerAddressLines,
  sellerDisplayName,
  sellerName,
} from '../lib/load-desk/business.ts';
import { parseCompany, parseProfileBody } from '../lib/load-desk/record-input.ts';

const updated_at = '2026-09-15T12:00:00.000Z';
const name = 'A & D Trucking of Chicago Inc';

void test('saved company details are trimmed and kept to one line each', () => {
  const parsed = parseCompany({
    name: '  A & D   Trucking of Chicago Inc ',
    address_lines: ['  31480   Edison Rd ', ' New Carlisle,  IN 46552 '],
    updated_at,
  });
  assert.ok('value' in parsed);
  assert.equal(parsed.value.name, 'A & D Trucking of Chicago Inc');
  assert.deepEqual(parsed.value.address_lines, ['31480 Edison Rd', 'New Carlisle, IN 46552']);
});

void test('company details need a name, a street and two bounded lines', () => {
  const lines = ['1 Main St', 'Chicago, IL'];
  assert.ok('error' in parseCompany({ address_lines: lines, updated_at }));
  assert.ok('error' in parseCompany({ name: '   ', address_lines: lines, updated_at }));
  assert.ok('error' in parseCompany({ name: 'x'.repeat(121), address_lines: lines, updated_at }));
  assert.ok('error' in parseCompany({ name, address_lines: ['  ', 'Chicago, IL'], updated_at }));
  assert.ok('error' in parseCompany({ name, address_lines: ['1 Main St'], updated_at }));
  assert.ok('error' in parseCompany({ name, address_lines: ['1 Main St', 'x'.repeat(161)], updated_at }));
  assert.ok('error' in parseCompany({ name, address_lines: ['1 Main St', 42], updated_at }));
  assert.ok('error' in parseCompany({ name, address_lines: ['1 Main St', ''] }));
  assert.ok('value' in parseCompany({ name, address_lines: ['1 Main St', ''], updated_at }));
});

void test('profile bodies are checked for their kind', () => {
  assert.ok('error' in parseProfileBody({ kind: 'admin', profile: {} }));
  const company = parseProfileBody({
    kind: 'company',
    profile: { name, address_lines: ['1 Main St', 'Chicago, IL 60601'], updated_at },
  });
  assert.ok('value' in company);
  assert.equal(company.value.kind, 'company');
  assert.ok('error' in parseProfileBody({ kind: 'truck', profile: { address_lines: [] } }));
});

void test('invoices print the saved name and address', () => {
  assert.equal(sellerName({ name: ' New Name LLC ' }), 'New Name LLC');
  assert.equal(sellerDisplayName({ name: 'Acme Hauling, Inc.' }), 'Acme Hauling, Inc');
  assert.deepEqual(sellerAddressLines({ address_lines: [' 1 Main St ', ''] }), ['1 Main St']);
  assert.deepEqual(
    sellerAddressLines({ address_lines: ['1 Main St', 'Chicago, IL 60601'] }),
    ['1 Main St', 'Chicago, IL 60601'],
  );
});

void test('an unsaved company is empty, never another company', () => {
  // Several companies use this app. A name or address built into the code
  // would be somebody else's, printed on their invoices in front of their
  // customers. Empty shows as a prompt to fill it in; wrong does not.
  assert.equal(sellerName(null), '');
  assert.equal(sellerName({}), '');
  assert.equal(sellerName({ name: '  ' }), '');
  assert.equal(sellerDisplayName(null), '');
  assert.deepEqual(sellerAddressLines(null), []);
  assert.deepEqual(sellerAddressLines({ address_lines: ['', ''] }), []);
  assert.deepEqual(Object.keys(business), ['origin_label']);
});
