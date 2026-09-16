import { test } from 'node:test';
import assert from 'node:assert/strict';
import { workspaceCompanyName } from '../lib/load-desk/business.ts';
import { parseCompany } from '../lib/load-desk/record-input.ts';

const company = (extra: Record<string, unknown> = {}) => ({
  name: 'A & D TRUCKING OF CHICAGO INC,.',
  address_lines: ['17954 SEMMLER DR.', 'TINLEY PARK, IL 60487'],
  updated_at: '2026-09-15T12:00:00.000Z',
  ...extra,
});

void test('the dashboard company name is saved alongside the invoice name', () => {
  const parsed = parseCompany(company({ display_name: '  A & D   Trucking  ' }));
  assert.ok('value' in parsed);
  assert.equal(parsed.value.display_name, 'A & D Trucking');
  assert.equal(parsed.value.name, 'A & D TRUCKING OF CHICAGO INC,.');
});

void test('older company profiles without a dashboard name still read', () => {
  const parsed = parseCompany(company());
  assert.ok('value' in parsed);
  assert.equal('display_name' in parsed.value, false);
  const blank = parseCompany(company({ display_name: '   ' }));
  assert.ok('value' in blank);
  assert.equal('display_name' in blank.value, false);
});

void test('a dashboard company name must be text of 120 characters or fewer', () => {
  assert.ok('error' in parseCompany(company({ display_name: 42 })));
  assert.ok('error' in parseCompany(company({ display_name: 'x'.repeat(121) })));
});

void test('the saved dashboard name shows, or the configured one', () => {
  assert.equal(workspaceCompanyName({ display_name: 'A & D Trucking' }, 'A & D Trucking of Chicago'), 'A & D Trucking');
  assert.equal(workspaceCompanyName({ display_name: '  ' }, 'A & D Trucking of Chicago'), 'A & D Trucking of Chicago');
  assert.equal(workspaceCompanyName(null, 'A & D Trucking of Chicago'), 'A & D Trucking of Chicago');
});

void test('company icons use the first letters of the first two significant words', async () => {
  const { companyInitials } = await import('../lib/load-desk/business.ts');
  assert.equal(companyInitials('A&D Trucking of Chicago'), 'AD');
  assert.equal(companyInitials('A & D Trucking of Chicago'), 'AD');
  assert.equal(companyInitials('A & D TRUCKING OF CHICAGO INC,.'), 'AD');
  assert.equal(companyInitials('The Witech Company'), 'WC');
  assert.equal(companyInitials('Heidelberg'), 'H');
  assert.equal(companyInitials('  & '), '?');
});
