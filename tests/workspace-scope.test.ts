import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Every company's tickets, customers and invoices sit in the same tables,
// separated only by workspace_id. A query that loses its scope returns another
// company's rows, and nothing about the result would look wrong. These read the
// source rather than run it: the server modules import cloudflare:workers and
// cannot be loaded here, and a rule that is easy to break quietly is worth a
// guard that fails loudly.

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

void test('the store scopes every query to the workspace it was given', () => {
  const source = read('lib/server/load-desk-store.ts');
  const scopes = [...source.matchAll(/\.eq\('workspace_id',\s*([^)]+)\)/g)].map((m) =>
    m[1].trim(),
  );
  assert.ok(scopes.length > 0, 'expected workspace-scoped queries');
  for (const scope of scopes) {
    assert.equal(scope, 'workspace', `a query is scoped to ${scope}, not the caller's workspace`);
  }
  // Rows written must carry the same scope as rows read.
  const writes = [...source.matchAll(/workspace_id:\s*([^,\n]+)/g)].map((m) => m[1].trim());
  for (const write of writes) {
    assert.equal(write, 'workspace', `a row is written into ${write}`);
  }
});

void test('no workspace is baked into the server at build time', () => {
  for (const path of [
    'lib/server/load-desk-store.ts',
    'lib/server/auth.ts',
    'lib/server/avatar-store.ts',
  ]) {
    const source = read(path);
    assert.ok(
      !source.includes('client.config.json'),
      `${path} reads the workspace from the build instead of the signed-in member`,
    );
    assert.ok(
      !source.includes('ad-trucking-chicago'),
      `${path} names one client's workspace`,
    );
  }
});

void test('no company name or address is baked into the app', () => {
  // These were A & D's, and would have printed on another company's invoices.
  const source = read('lib/load-desk/business.ts');
  assert.ok(!/A & D|SEMMLER|TINLEY PARK/i.test(source), 'a company is hardcoded in business.ts');
});

void test('empty fields describe themselves instead of showing real details', () => {
  // The Company fields suggested A & D's actual name and street address, which
  // every other company saw greyed into their own empty form.
  for (const path of [
    'components/account/account-page.tsx',
    'components/profiles/fleet-page.tsx',
    'components/profiles/customers-page.tsx',
  ]) {
    const source = read(path);
    assert.ok(
      !/A & D|SEMMLER|TINLEY PARK/i.test(source),
      `${path} shows one client's real details`,
    );
    // A literal placeholder is either an example to copy or untranslated text;
    // both are wrong here. Hints go through t().
    const literals = [...source.matchAll(/placeholder="([^"]*)"/g)].map((m) => m[1]);
    assert.deepEqual(literals, [], `${path} has literal placeholders: ${literals.join(', ')}`);
  }
});
