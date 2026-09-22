import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// Every company's tickets, customers and invoices sit in the same tables,
// separated only by workspace_id. A query that loses its scope returns another
// company's rows, and nothing about the result would look wrong. These read the
// source rather than run it: the server modules import cloudflare:workers and
// cannot be loaded here, and a rule that is easy to break quietly is worth a
// guard that fails loudly.

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

void test('the stores scope every query to the workspace they were given', () => {
  for (const path of [
    'lib/server/load-desk-store.ts',
    'lib/server/mileage-store.ts',
    'lib/server/rates-store.ts',
    'lib/server/operator/store.ts',
  ]) {
    const source = read(path);
    const scopes = [...source.matchAll(/\.eq\('workspace_id',\s*([^)]+)\)/g)].map((m) =>
      m[1].trim(),
    );
    assert.ok(scopes.length > 0, `${path}: expected workspace-scoped queries`);
    for (const scope of scopes) {
      assert.equal(scope, 'workspace', `${path}: a query is scoped to ${scope}, not the caller's workspace`);
    }
    // Rows written must carry the same scope as rows read.
    const writes = [...source.matchAll(/workspace_id:\s*([^,\n]+)/g)].map((m) => m[1].trim());
    for (const write of writes) {
      assert.equal(write, 'workspace', `${path}: a row is written into ${write}`);
    }
  }
});

void test('no workspace is baked into the server at build time', () => {
  for (const path of [
    'lib/server/load-desk-store.ts',
    'lib/server/mileage-store.ts',
    'lib/server/rates-store.ts',
    'lib/server/mileage-calc.ts',
    'lib/server/auth.ts',
    'lib/server/avatar-store.ts',
    'lib/server/rates-engine.ts',
    'lib/server/rate-ai.ts',
    'lib/server/rate-mail.ts',
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

void test('one client’s yard and the routing key stay out of the app', () => {
  // The demo yard is entered on the truck in Truck Fleet; the source guards in
  // tests/mileage.test.ts walk lib/, components/ and app/ for it and for any
  // TomTom reference outside lib/server. Here the two files that may hold the
  // key name are pinned down.
  for (const path of ['lib/server/tomtom-key.ts', '.dev.vars.example']) {
    assert.ok(read(path).includes('TOMTOM_API_KEY'), `${path} names the routing key`);
  }
  assert.ok(!read('vite.config.ts').includes('TOMTOM'), 'the key is a host secret, not a build var');
  for (const path of [
    'components/ifta/ifta-page.tsx',
    'components/mileage/mileage-page.tsx',
    'components/mileage/day-card.tsx',
    'components/mileage/route-view.tsx',
    'components/mileage/route-map.tsx',
    'components/mileage/needs-help.tsx',
    'components/mileage/fix-order.tsx',
    'components/mileage/fix-location.tsx',
    'components/profiles/fleet-page.tsx',
    'lib/load-desk/mileage.ts',
  ]) {
    assert.ok(!/mokena|191st/i.test(read(path)), `${path} names the demo yard`);
  }
});

void test('IFTA reports the routes; it never changes them', () => {
  // Mileage is where a day is recalculated, a place is fixed and a stop order
  // is confirmed. IFTA reads the same rows a quarter at a time and sends people
  // to Mileage for anything that has to be put right, so a correction is made
  // in one place and a filing quarter cannot be edited out from under itself.
  const source = read('components/ifta/ifta-page.tsx');
  for (const call of [
    'recalculate(',
    'settleDays(',
    'fixPlace(',
    'confirmStopOrder(',
    '/api/mileage/recalculate',
    '/api/mileage/order',
    '/api/mileage/places',
  ]) {
    assert.ok(
      !source.includes(call),
      `the IFTA page writes routes with ${call}; corrections belong in Mileage`,
    );
  }
});

// ------------------------------------------------- the Rate & Fuel Agent

const readDir = (directory: string): string[] => {
  const base = new URL(`../${directory}/`, import.meta.url);
  const found: string[] = [];
  for (const entry of readdirSync(base, { withFileTypes: true })) {
    if (entry.isDirectory()) found.push(...readDir(`${directory}/${entry.name}`));
    else if (/\.tsx?$/.test(entry.name)) found.push(`${directory}/${entry.name}`);
  }
  return found;
};

void test('the dashboard root never runs the rate agent', () => {
  // The agent reads every saved ticket and may write to hundreds of them. That
  // is work for a POST somebody asked for, not for the render of the page the
  // desk opens all day: a worker has a CPU budget per request, and a shell
  // that priced tickets on every load would be a shell that stopped loading.
  // The Rates page itself is loaded only when somebody navigates to it, which
  // is why the pager's dynamic import is allowed here.
  for (const path of [
    'app/(workspace)/layout.tsx',
    'app/(workspace)/page.tsx',
    'components/home/home-page.tsx',
    'components/shell/app-shell.tsx',
    'components/shell/section-pager.tsx',
  ]) {
    const source = read(path);
    for (const half of ['rates-engine', 'rate-ai', 'rate-mail']) {
      assert.ok(
        !new RegExp(`from '[^']*${half}'`).test(source),
        `${path} imports the agent's server half (${half})`,
      );
    }
    assert.ok(
      !source.includes('/api/rates'),
      `${path} calls the rate agent while the shell is being drawn`,
    );
  }
});

void test('this deployment cannot email a customer', () => {
  // V1 writes drafts. The boundary is one file with no adapter behind it, and
  // the endpoints reach nothing outside the worker; the only outbound call in
  // the whole agent is the reading model's, which is in lib/server and never
  // in a route. Connecting a mailbox has to be a deliberate act.
  const mail = read('lib/server/rate-mail.ts');
  assert.ok(!/\bfetch\s*\(/.test(mail), 'lib/server/rate-mail.ts makes a network call');
  assert.match(
    mail,
    /export function mailAdapter\(\): MailAdapter \| null \{\s*return null;\s*\}/,
    'lib/server/rate-mail.ts returns a mail adapter',
  );
  for (const path of readDir('app/api/rates')) {
    assert.ok(!/\bfetch\s*\(/.test(read(path)), `${path} makes a network call`);
  }
  // The one outbound call, where it is allowed to be.
  assert.match(read('lib/server/rate-ai.ts'), /fetch\('https:\/\/api\.openai\.com/);
});

void test('the reading model never prices anything', () => {
  // The model says what a sentence appears to state. What that is worth, and
  // what it comes to on a ticket, is settled by the rules in rates.ts and the
  // arithmetic in format.ts — neither of which this module can reach, so a
  // reply cannot talk the app into a figure.
  const source = read('lib/server/rate-ai.ts');
  assert.ok(
    !/from '[^']*(load-desk\/format|load-desk\/rates-engine)'/.test(source),
    'the reader imports the invoice arithmetic',
  );
  for (const name of ['lineTotal', 'priceLine', 'fuelAmount', 'toTicketPricing']) {
    assert.ok(!source.includes(name), `the reader uses ${name}: pricing is not the model's`);
  }
});

// --------------------------------------------------- the Monius Operator

void test('the Operator acts only through the tools, the tools only through the services', () => {
  // The Operator is a model with a set of hands, and this is the shape of the
  // hands. A tool calls an existing service and never a table: a service knows
  // about locks, about review marks, about what a period means, and a query
  // written inside a tool knows none of that and would look perfectly correct.
  // These read the source because the rule is easy to break by writing one
  // convenient line, and because nothing about the result would look wrong.
  const tools = readDir('lib/server/operator/tools');
  assert.ok(tools.length > 0, 'the Operator has no tools');
  for (const path of tools) {
    const source = read(path);
    for (const call of ['.insert(', '.update(', '.delete(', '.upsert(', '.rpc(']) {
      assert.ok(!source.includes(call), `${path} writes to a table with ${call}`);
    }
    // A read tool may hold a narrow query; an action tool may not, because the
    // rules that make a write safe live in the services it is meant to call.
    if (path.includes('/tools/actions/')) {
      assert.ok(!source.includes('.from('), `${path} reaches a table directly`);
    }
  }

  // A service role would give the agent more than the person driving it has.
  // There is none in this app, and the Operator is not where one arrives.
  for (const directory of ['lib/server/operator', 'app/api/operator']) {
    for (const path of readDir(directory)) {
      const source = read(path);
      for (const secret of ['service_role', 'SUPABASE_SERVICE', 'sb_secret']) {
        assert.ok(!source.includes(secret), `${path} reaches for ${secret}`);
      }
    }
  }

  // A write tool previews itself and no read tool scans the whole table: the
  // Operator reads a day, an invoice or a record, never every ticket a company
  // has ever saved.
  for (const path of readDir('lib/server/operator/tools/read')) {
    assert.ok(!read(path).includes('listRecords('), `${path} scans every saved ticket`);
  }

  // The marks and the paths a tool may never touch, by name.
  for (const path of readDir('lib/server/operator/tools/actions')) {
    const source = read(path);
    for (const forbidden of [
      'reviewed_at:',
      'sendRateRequest',
      'markRequestSent',
      'unlockInvoice',
      'lockInvoice',
      'deleteRecord',
    ]) {
      assert.ok(!source.includes(forbidden), `${path} uses ${forbidden}`);
    }
  }
});

void test('the model is asked in three places and nowhere else', () => {
  // Every outbound call to a model is a key, a cost and a sentence leaving the
  // building. Three files make one: the rate reader, the ticket extractor and
  // the Operator's provider. A fourth would be a fourth place to audit.
  const allowed = new Set([
    'lib/server/rate-ai.ts',
    'app/api/extract/route.ts',
    'lib/server/operator/provider.ts',
  ]);
  const callers: string[] = [];
  for (const directory of ['lib', 'app', 'components']) {
    for (const path of readDir(directory)) {
      if (read(path).includes('api.openai.com')) callers.push(path);
    }
  }
  assert.deepEqual(
    callers.filter((path) => !allowed.has(path)),
    [],
    'a new file calls the model directly',
  );
  for (const path of allowed) {
    assert.ok(callers.includes(path), `${path} no longer calls the model`);
  }
});

void test('the dashboard shell loads the Operator only when somebody opens it', () => {
  // The panel is a sheet somebody presses a button to see. Everything it needs
  // — the run engine, the tools, the routes — is behind a dynamic import, so a
  // desk that never opens it pays nothing for it, and the shell that draws on
  // every page cannot reach the server half at all.
  const shell = read('components/shell/app-shell.tsx');
  assert.ok(shell.includes('dynamic('), 'the shell no longer imports the panel lazily');
  for (const reach of [
    '/api/operator',
    '/api/rates',
    "from '@/components/operator/",
    "from '@/lib/server/",
  ]) {
    assert.ok(!shell.includes(reach), `components/shell/app-shell.tsx reaches ${reach}`);
  }
  for (const path of ['app/(workspace)/layout.tsx', 'components/home/home-page.tsx']) {
    assert.ok(
      !read(path).includes('lib/server/operator'),
      `${path} pulls the Operator's server half into the page render`,
    );
  }
});

void test('the registry refuses a tool that could act without being asked', () => {
  // The rules that decide what a tool is allowed to be are worth reading in
  // the registry rather than trusting each tool to declare itself honestly.
  const registry = read('lib/operator/registry.ts');
  assert.match(
    registry,
    /risk === 3[\s\S]{0,80}confirmation !== 'always'/,
    'a level-3 tool may register without always asking a person',
  );
  assert.match(registry, /!tool\.dryRun/, 'a write tool may register with no preview of itself');
});

void test('the policy decides on its own, with nothing to reach for', () => {
  // decide() is given the tool, the workspace's settings and the dry run, and
  // that is all it may know: a policy that could read the database could be
  // told a different answer by the state it is meant to be guarding.
  const policy = read('lib/operator/policy.ts');
  assert.ok(
    !/from '[^']*lib\/server/.test(policy) && !policy.includes("from '@/lib/server"),
    'the policy reaches into the server half',
  );
  assert.ok(!/\bfetch\s*\(/.test(policy), 'the policy makes a network call');
});

void test('every run is bounded, audited, and ends however it goes', () => {
  const run = read('lib/server/operator/run.ts');
  for (const needed of [
    'recordAction(',
    'dryRun(',
    'state_hash',
    'finally',
    'maxToolCalls',
    'maxWrites',
    'maxRunMs',
  ]) {
    assert.ok(run.includes(needed), `lib/server/operator/run.ts no longer has ${needed}`);
  }
});

void test('the Operator’s own tables are closed to everyone but their workspace', () => {
  // Runs, audit rows, confirmations and settings are as sensitive as the
  // tickets they describe. Row level security on every one of them, and no
  // function that runs as its owner to get around it.
  const migration = read('supabase/migrations/202609250001_operator.sql');
  const count = (pattern: RegExp) => (migration.match(pattern) ?? []).length;
  const tables = count(/create table/gi);
  assert.ok(tables > 0, 'the migration creates no tables');
  assert.equal(
    count(/enable row level security/gi),
    tables,
    'a table in the Operator migration has no row level security',
  );
  assert.ok(!/security definer/i.test(migration), 'the migration defines a function that escapes RLS');
});
