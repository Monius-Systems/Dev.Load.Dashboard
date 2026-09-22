import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { readMileageDay, stopOrderBasis } from '../lib/load-desk/mileage.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

// The server half of IFTA & Mileage: which calculation is allowed to write a
// day, when a day is already worked out and needs no calculation at all, and
// the rules about the figures and the provider that are easiest to break
// quietly.
//
// recalculateDay itself talks to Supabase and to a routing provider, so the
// decisions it turns on are pure functions beside it — dayIsUpToDate and
// resultWriteAllowed — and those are what run here. The rest are source
// guards: they read the files rather than call them, which is the only way to
// pin "this column is never written" or "this option is passed from one place
// only".
//
// lib/server modules import `cloudflare:workers` and use TypeScript that
// strip-only mode cannot run (a class with parameter properties), so a
// resolver is registered for this file alone, exactly as in
// tests/rates-engine.test.ts. Only the modules under test are real; the stubs
// are deliberately minimal, so an import that needs one fails loudly.

const root = pathToFileURL(`${process.cwd()}/`).href;

const STUBS: Record<string, string> = {
  'cloudflare:workers': 'export const env = {};',
  '@/lib/server/load-desk-store': `
    export class StoreError extends Error {
      constructor(message, status) { super(message); this.status = status; }
    }
  `,
  '@/lib/server/routing-provider': `
    export class ProviderError extends Error {
      constructor(message, kind, status) { super(message); this.kind = kind; this.status = status; }
    }
  `,
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

const { resultWriteAllowed } = await import(`${root}lib/server/mileage-store.ts`);
const { dayIsUpToDate } = await import(`${root}lib/server/mileage-calc.ts`);

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const walk = (directory: string): string[] => {
  const base = new URL(`../${directory}/`, import.meta.url);
  return readdirSync(base, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`],
  );
};

/** The body of one exported function, from its signature to the next export. */
function body(path: string, name: string): string {
  const text = source(path);
  const start = text.indexOf(`export async function ${name}(`) >= 0
    ? text.indexOf(`export async function ${name}(`)
    : text.indexOf(`export function ${name}(`);
  assert.ok(start >= 0, `${path} has no ${name}`);
  const end = text.indexOf('\nexport ', start + 1);
  return text.slice(start, end < 0 ? undefined : end);
}

let nextId = 1;
const record = (ticket: Partial<Ticket> = {}): SavedRecord => ({
  id: nextId++,
  saved_at: '2026-09-18T12:00:00.000Z',
  ticket: {
    ...emptyTicket(),
    ticket_date: '2026-09-18',
    plant_name: 'Heidelberg Materials',
    plant_address: '322 S Williams St, Thornton, IL',
    project_address: '16222 Western Ave, Markham, IL',
    ...ticket,
  },
  invoice: {
    invoice_number: 'INV-1',
    invoice_date: '2026-09-18',
    return_date: '',
    truck_number: 'ZF0321',
    bill_to: { name: 'Client', address_lines: ['', ''], phone: '' },
  },
  source: { file_name: 'a.jpg', sha256: 'a'.repeat(64), size: 1, type: 'image/jpeg', kind: 'upload' },
  original_stored: true,
  ocr_text: '',
  truck_id: 7,
});

// ------------------------------------------- the newest calculation writes

void test('a day is written only by the calculation it is claimed by', () => {
  // The token claimDay stamped on the row. Two requests for the same day can
  // overlap — a page asking for a range while somebody presses Update — and
  // the one that claimed last is the one whose answer counts.
  assert.equal(resultWriteAllowed('claim-1', 'claim-1'), true);
  assert.equal(resultWriteAllowed('claim-2', 'claim-1'), false, 'taken over since: this answer is the older one');
  assert.equal(resultWriteAllowed(null, 'claim-1'), false, 'released or never claimed');
  assert.equal(resultWriteAllowed('claim-1', ''), false, 'no token is not every token');
  assert.equal(resultWriteAllowed(null, ''), false);
});

void test('both writes and the release are compare-and-set on that token', () => {
  for (const name of ['writeDayResult', 'writeDayState', 'releaseClaim']) {
    const text = body('lib/server/mileage-store.ts', name);
    assert.match(text, /\.eq\('calc_token', token\)/, `${name} writes without naming the claim`);
    assert.match(text, /\.eq\('workspace_id', workspace\)/, `${name} writes outside the caller's workspace`);
  }
  // A write that matched nothing is not an error: it is a newer calculation
  // having got there first, and the caller answers with what is stored.
  for (const name of ['writeDayResult', 'writeDayState']) {
    const text = body('lib/server/mileage-store.ts', name);
    assert.match(text, /return data \? readMileageDay\(data as Record<string, unknown>\) : null;/, name);
  }
  const claim = body('lib/server/mileage-store.ts', 'claimDay');
  assert.match(claim, /const token = crypto\.randomUUID\(\);/, 'a claim needs a token nobody can guess or repeat');
  assert.match(claim, /calc_token: token,/);
  const calc = source('lib/server/mileage-calc.ts');
  assert.match(calc, /\?\? \(await getDay\(client, workspace, truck\.id, date\)\)/, 'a refused write answers with the stored day');
});

void test('a failure or a review never touches the last good figures', () => {
  // The columns a successful calculation writes. writeDayState is what a
  // failed or held-up day goes through, and it may write none of them: the
  // figures on the page are the last ones that were worked out, and
  // calculated_at says when that was.
  const result = ['result_input_hash', 'ticket_ids', 'ticket_count', 'order_basis', 'legs', 'total_miles', 'total_seconds', 'mpg', 'est_gallons', 'profile_snapshot', 'profile_hash', 'calc_version', 'calculated_at'];
  const state = body('lib/server/mileage-store.ts', 'writeDayState');
  const success = body('lib/server/mileage-store.ts', 'writeDayResult');
  for (const column of result) {
    assert.ok(!new RegExp(`^\\s*${column}:`, 'm').test(state), `writeDayState writes ${column}`);
    assert.match(success, new RegExp(`^\\s*${column}:`, 'm'), `writeDayResult no longer writes ${column}`);
  }
  // And the release writes neither the figures nor the state: just the status
  // the day already had, and the token given back.
  const release = body('lib/server/mileage-store.ts', 'releaseClaim');
  assert.match(release, /\.update\(\{ status, calc_token: null \}\)/);
  for (const column of [...result, 'review_reasons', 'warnings', 'error', 'input_hash', 'updated_at']) {
    assert.ok(!new RegExp(`^\\s*${column}:`, 'm').test(release), `releaseClaim writes ${column}`);
  }
});

// ------------------------------------------------------------ idempotency

void test('a day already worked out from the same tickets is handed back untouched', () => {
  const records = [record({ ticket_number: '1001', time_out: '07:10' }), record({ ticket_number: '1002', time_out: '09:40' })];
  const day = (patch: Record<string, unknown>) =>
    readMileageDay({ id: 1, status: 'current', input_hash: 'h', result_input_hash: 'h', order_basis: 'time', ...patch });
  assert.equal(dayIsUpToDate(day({}), 'h', records, false), true);
  assert.equal(dayIsUpToDate(day({}), 'h', records, true), false, 'force asks the provider again');
  assert.equal(dayIsUpToDate(undefined, 'h', records, false), false);
  assert.equal(dayIsUpToDate(null, 'h', records, false), false);
  assert.equal(dayIsUpToDate(day({}), 'other', records, false), false, 'the tickets changed');
  for (const status of ['needs_review', 'failed', 'calculating']) {
    assert.equal(dayIsUpToDate(day({ status }), 'h', records, false), false, `${status} is not worked out`);
  }
  assert.equal(
    dayIsUpToDate(day({ result_input_hash: 'older' }), 'h', records, false),
    false,
    'a result worked out from other tickets is not this day',
  );
  // An order a person has just confirmed is worked out with, even though
  // nothing about the tickets moved.
  const confirmed = { ticket_ids: [records[1].id, records[0].id], basis: stopOrderBasis(records), confirmed_at: '2026-09-19T12:00:00.000Z' };
  assert.equal(
    dayIsUpToDate(day({ stop_order: confirmed }), 'h', records, false),
    false,
    'confirmed but not yet used',
  );
  assert.equal(dayIsUpToDate(day({ stop_order: confirmed, order_basis: 'confirmed' }), 'h', records, false), true);
  assert.equal(
    dayIsUpToDate(day({ stop_order: { ...confirmed, basis: 'stale' }, order_basis: 'confirmed' }), 'h', records, false),
    false,
    'an order the day has outgrown is worked out again without it',
  );
  assert.equal(
    dayIsUpToDate(day({ order_basis: 'confirmed' }), 'h', records, false),
    false,
    'the confirmation it used has since been forgotten',
  );
  // The truck's settings are an input too: a day worked out with the yard,
  // the MPG, the vehicle or the provider version it no longer has is worked
  // out again, so changing the yard and asking again is not a no-op.
  assert.equal(dayIsUpToDate(day({ profile_hash: 'p' }), 'h', records, false, 'p'), true);
  assert.equal(dayIsUpToDate(day({ profile_hash: 'p' }), 'h', records, false, 'moved'), false);
  assert.equal(dayIsUpToDate(day({}), 'h', records, false, 'p'), false, 'nothing stored to compare');
  // Nothing written and nothing asked of the provider: the claim is given
  // back and the stored row is the answer.
  const calc = source('lib/server/mileage-calc.ts');
  assert.match(
    calc,
    /if \(dayIsUpToDate\(stored, hash, records, force, profileHash\(ifta, provider\.version\)\)\) \{[\s\S]*?await releaseClaim\(client, workspace, truck\.id, date, token\);\s*return stored;/,
  );
  const upTo = calc.indexOf('if (dayIsUpToDate(');
  assert.ok(upTo > 0 && upTo < calc.indexOf('buildPlan(records'), 'the check comes before the plan');
});

// ------------------------------------------------------ provider and cache

void test('the provider is asked once per leg, and only force goes round the cache', () => {
  const calc = source('lib/server/mileage-calc.ts');
  assert.equal(calc.match(/getRoutes\(/g)?.length, 1, 'one place reads the route cache');
  assert.match(
    calc,
    /const routes = force \? new Map<string, RouteRow>\(\) : await getRoutes\(client, workspace, \[\.\.\.new Set\(keys\)\]\)/,
    'a forced recalculation is the only path that skips the cache',
  );
  assert.equal(calc.match(/provider\.calculateTruckRoute\(/g)?.length, 1, 'one place asks for a route');
  assert.match(calc, /if \(!route\) \{[\s\S]*?provider\.calculateTruckRoute\(/, 'a cached leg is never asked about');
  assert.equal(calc.match(/provider\.geocode\(/g)?.length, 1, 'one place asks where an address is');
  // An address the provider could not place is asked about again only when
  // the provider's rules have changed since the answer was stored.
  assert.match(
    calc,
    /if \(!place \|\| \(place\.status === 'unresolved' && place\.provider !== stamp\)\)/,
    'places are re-asked for no reason',
  );
  assert.match(calc, /const stamp = `\$\{provider\.name\}@\$\{provider\.version\}`/);
});

void test('an automatic lookup takes a building, and a street only where a person confirmed one', () => {
  const tomtom = source('lib/server/tomtom-routing.ts');
  assert.match(tomtom, /const PRECISE_TYPES = new Set\(\['Point Address', 'Address Range'\]\);/);
  assert.match(tomtom, /const STREET_TYPES = new Set\(\['Street', 'Cross Street'\]\);/);
  // STREET_TYPES is accepted under one condition only: the caller said a
  // person typed and confirmed the address.
  const guarded = tomtom.indexOf('if (options.acceptStreet === true) {');
  assert.ok(guarded > 0);
  for (const at of [...tomtom.matchAll(/STREET_TYPES\.has\(/g)].map((match) => match.index ?? -1)) {
    assert.ok(at > guarded, 'a street match is accepted outside a person’s confirmation');
  }
  // A road named on a ticket that carries no street number is placed on that
  // road, and the day records that it is approximate rather than a building.
  assert.match(tomtom, /if \(!hasNumber && queryNamesPlace\) \{[\s\S]*?return accept\(road, true\);/);

  // And acceptStreet is passed from the one route where a person typed the
  // address — never from the calculation, which may not guess at a stop.
  const senders = [...walk('lib'), ...walk('components'), ...walk('app')].filter(
    (path) => /\.tsx?$/.test(path) && /acceptStreet/.test(source(path)),
  );
  assert.deepEqual(senders.sort(), [
    // Where the option is declared, where it is read, and the one caller.
    'app/api/mileage/places/route.ts',
    'lib/server/routing-provider.ts',
    'lib/server/tomtom-routing.ts',
  ]);
  assert.match(source('app/api/mileage/places/route.ts'), /\{ acceptStreet: true \}/);
  assert.ok(!source('lib/server/mileage-calc.ts').includes('acceptStreet'));
});

// ------------------------------------------------------------- the routes

void test('the mileage routes take a day, never a figure', () => {
  // Miles, coordinates and route lines are the provider's answers, stored on
  // the server. A browser may say which day to work out, which stops were
  // hauled in which order, and what address a place is at — nothing else, or
  // a page could dictate what a quarter's IFTA filing says.
  const asked = new Set(['truck_id', 'date', 'days', 'force', 'ticket_ids', 'place_key', 'address']);
  const forbidden = ['miles', 'lat', 'lon', 'geometry', 'total_miles', 'total_seconds', 'est_gallons', 'legs', 'status'];
  const routes = walk('app/api/mileage').filter((path) => path.endsWith('route.ts'));
  assert.ok(routes.length >= 5, 'the mileage routes moved');
  for (const path of routes) {
    const text = source(path);
    for (const [, field] of text.matchAll(/(?:parsed\.value|body|day)\.([A-Za-z_]+)/g)) {
      assert.ok(asked.has(field), `${path} reads ${field} from the request`);
    }
    for (const field of forbidden) {
      assert.ok(
        !new RegExp(`body(?:\\.${field}\\b|\\['${field}'\\])`).test(text),
        `${path} reads ${field} from the request body`,
      );
      assert.ok(
        !new RegExp(`searchParams\\.get\\('${field}'\\)`).test(text),
        `${path} reads ${field} from the query string`,
      );
    }
    // Every one of them runs as the signed-in member, in their workspace.
    assert.match(text, /memberRoute\(/, `${path} is not a member route`);
    assert.match(text, /member\.workspaceId/, `${path} does not scope to the member's workspace`);
    if (text.includes('export function POST')) {
      assert.match(text, /\{ write: true \}/, `${path} writes without saying so`);
    }
  }
});
