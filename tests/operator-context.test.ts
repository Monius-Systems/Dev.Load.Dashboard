import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { clearDeepLink, readDeepLink } from '../lib/operator/deep-links.ts';
import { suggestionsFor } from '../lib/operator/suggestions.ts';
import type { EntityRef, EntityType } from '../lib/operator/types.ts';

// Where the Operator meets the pages: the links its answers write, the
// questions it offers about the thing on screen, the standing questions it
// asks on a rhythm, and the rule that a page opens the panel rather than
// calling the Operator itself.
//
// The inspections live under lib/server, where the run engine imports modules
// this runner cannot load, so the engine is stubbed for this file alone: what
// is under test is the catalogue and its wording, not the running of it.

const root = pathToFileURL(`${process.cwd()}/`).href;

const STUBS: Record<string, string> = {
  './run.ts': 'export const runOperator = async () => ({ run_id: "r", status: "completed" });',
};

register(
  `data:text/javascript,${encodeURIComponent(`
    const root = ${JSON.stringify(root)};
    const stubs = ${JSON.stringify(STUBS)};
    export async function resolve(specifier, context, next) {
      if (stubs[specifier]) {
        return {
          url: 'data:text/javascript,' + encodeURIComponent(stubs[specifier]),
          shortCircuit: true,
          format: 'module',
        };
      }
      if (specifier.startsWith('@/')) return next(root + specifier.slice(2) + '.ts', context);
      return next(specifier, context);
    }
  `)}`,
);

const { INSPECTIONS, inspectionNamed } = await import(
  `${root}lib/server/operator/inspections.ts`
);

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// ------------------------------------------------------------- deep links

void test('a deep link is read strictly or not at all', () => {
  assert.deepEqual(readDeepLink('?ticket=412'), { ticket: 412 });
  assert.deepEqual(readDeepLink('?customer=7&request=19'), { customer: 7, request: 19 });
  assert.deepEqual(readDeepLink('?invoice=INV-284'), { invoice: 'INV-284' });
  // A key arrives percent-encoded and is handed back as it was written.
  assert.deepEqual(readDeepLink('?job=12%20Front%20St%2C%20Joliet'), {
    job: '12 Front St, Joliet',
  });
  assert.deepEqual(readDeepLink(''), {});
});

void test('anything that is not a whole positive identifier is not an identifier', () => {
  for (const value of ['1e3', '-4', '0', '12.5', ' 12 ', '0x10', 'twelve', '', '+7', '1_000']) {
    assert.deepEqual(
      readDeepLink(`?ticket=${encodeURIComponent(value)}`),
      {},
      `accepted "${value}" as a ticket`,
    );
  }
  // Beyond what a JavaScript integer can hold exactly is not an identifier.
  assert.deepEqual(readDeepLink('?customer=9007199254740993'), {});
});

void test('a key is short, printable and trimmed, or it is left out', () => {
  assert.deepEqual(readDeepLink(`?invoice=${'x'.repeat(300)}`), {});
  assert.deepEqual(readDeepLink(`?job=${'y'.repeat(300)}`), {});
  assert.deepEqual(readDeepLink('?invoice=%00'), {});
  assert.deepEqual(readDeepLink('?invoice=INV%01284'), {});
  assert.deepEqual(readDeepLink('?invoice=%20%20'), {});
  assert.deepEqual(readDeepLink('?invoice=%20INV-9%20'), { invoice: 'INV-9' });
  // Two hundred characters is the most, and exactly that much is allowed.
  assert.deepEqual(readDeepLink(`?invoice=${'z'.repeat(200)}`), { invoice: 'z'.repeat(200) });
});

void test('clearing a deep link keeps the page and everything else in the query', () => {
  assert.equal(
    clearDeepLink('invoice', 'https://app.example/records?invoice=INV-1&tab=tickets'),
    '/records?tab=tickets',
  );
  assert.equal(clearDeepLink('ticket', '/records?ticket=4'), '/records');
  assert.equal(clearDeepLink('ticket', '/records?invoice=INV-1#top'), '/records?invoice=INV-1#top');
  assert.equal(clearDeepLink('customer', '/customers'), '/customers');
});

// ------------------------------------------------------- what to ask about

const ref = (type: EntityType): EntityRef => ({ type, id: '1', label: 'It', href: null });

void test('the questions about the thing on screen come before the page’s own', () => {
  const first: [EntityType, string, string][] = [
    ['invoice', '/records', 'Why isn’t this invoice ready?'],
    ['ticket', '/records', 'Check this ticket’s extraction'],
    ['customer', '/customers', 'What rates are missing for this customer?'],
    ['mileage_day', '/mileage', 'Check this route'],
    ['rate_request', '/rates', 'Has the customer replied?'],
    ['truck', '/fleet', 'Check this truck’s mileage this week'],
  ];
  for (const [type, page, question] of first) {
    const offered = suggestionsFor({ page, entity: ref(type) });
    assert.equal(offered[0], question, `${type} did not lead with its own question`);
    assert.equal(new Set(offered).size, offered.length, `${type} repeats a question`);
    assert.ok(offered.length <= 6);
  }
});

void test('a question about "this one" is never offered without one', () => {
  const page = suggestionsFor({ page: '/records', entity: null });
  assert.ok(!page.includes('Recalculate this invoice'));
  assert.ok(!suggestionsFor({ page: '/rates', entity: null }).includes('Draft a follow-up'));
  // The page's own questions are still there when nothing is being looked at.
  assert.ok(page.includes('How many invoices are waiting on rates?'));
});

// -------------------------------------------------------- the inspections

void test('there are six standing questions, each named once', () => {
  assert.equal(INSPECTIONS.length, 6);
  const names = INSPECTIONS.map((inspection: { name: string }) => inspection.name);
  assert.equal(new Set(names).size, 6);
  const alphabetical = (a: string, b: string) => a.localeCompare(b);
  assert.deepEqual(
    [...names].sort(alphabetical),
    [
      'billing_readiness',
      'end_of_day_tickets',
      'ifta_completeness',
      'invoice_exceptions',
      'morning_operations',
      'weekly_rates',
    ],
  );
  assert.equal(inspectionNamed('billing_readiness')?.cadence, 'daily');
  assert.equal(inspectionNamed('not_an_inspection'), null);
});

void test('every inspection says in words that it changes nothing', () => {
  for (const inspection of INSPECTIONS as { name: string; label: string; question: string }[]) {
    assert.ok(
      inspection.question.includes('Do not change anything'),
      `${inspection.name} does not say it changes nothing`,
    );
    assert.ok(inspection.label.trim(), `${inspection.name} has no label`);
  }
});

void test('the settings view lists exactly the inspections the server knows', () => {
  const view = read('components/operator/operator-settings.tsx');
  const listed = [...view.matchAll(/\{ name: '([a-z_]+)', label:/g)].map((match) => match[1]);
  const alphabetical = (a: string, b: string) => a.localeCompare(b);
  assert.deepEqual(
    listed.sort(alphabetical),
    INSPECTIONS.map((inspection: { name: string }) => inspection.name).sort(alphabetical),
  );
});

// --------------------------------------------------------- source guards

void test('"Ask Monius" is a client affordance and nothing more', () => {
  const source = read('components/operator/ask-monius.tsx');
  assert.ok(!source.includes('@/lib/server'), 'ask-monius reaches into the server');
  assert.ok(!source.includes('fetch('), 'ask-monius fetches');
  assert.ok(source.includes("openOperator"), 'ask-monius does not open the panel');
});

void test('every page the Operator is reachable from opens the panel, and none calls it', () => {
  const pages = [
    'components/records/records-page.tsx',
    'components/mileage/route-view.tsx',
    'components/rates/rates-page.tsx',
    'components/profiles/customers-page.tsx',
    'components/home/home-page.tsx',
  ];
  for (const page of pages) {
    const source = read(page);
    assert.ok(
      source.includes('ask-monius') || source.includes('openOperator'),
      `${page} has no way into the Operator`,
    );
    assert.ok(!source.includes('/api/operator'), `${page} calls the Operator API itself`);
    assert.ok(!source.includes('dangerouslySetInnerHTML'), `${page} writes raw HTML`);
  }
});
