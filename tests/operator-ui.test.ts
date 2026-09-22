import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { PL_TEXT } from '../lib/i18n/pl.ts';
import { PL_PAGES } from '../lib/i18n/pl-pages.ts';
import { RUN_LIMITS } from '../lib/operator/limits.ts';
import { suggestionsFor } from '../lib/operator/suggestions.ts';
import { permissionLabel, riskLabel, toolLabel } from '../lib/operator/tool-labels.ts';
import type { EntityRef, OperatorResponse, PageContext } from '../lib/operator/types.ts';

// The panel's own half of the Operator: the conversation store behind it, the
// questions it offers before anybody types, and the rules the shell has to
// keep for the panel to stay off the server and out of the first paint.
//
// The store talks to the server through apiJson, so the module that provides
// it is stubbed for this file alone and every answer is handed in by the test.
// Nothing here renders React: what is worth pinning is the bookkeeping — how
// much history goes up, what happens to a confirmation that expires, and
// whether two things the tools both named become one chip.

const root = pathToFileURL(`${process.cwd()}/`).href;

/** The one call the store makes, answered by whatever the test set up. */
type Answer = { ok: true; data: unknown } | { ok: false; error: string; status: number };
type Call = { path: string; init: { method?: string; body?: string } };

const calls: Call[] = [];
let answer: (call: Call) => Answer = () => ({ ok: false, error: 'no answer', status: 500 });
let mode = 'remote';

(globalThis as unknown as Record<string, unknown>).__operatorApi = (
  path: string,
  init: { method?: string; body?: string } = {},
) => {
  const call = { path, init };
  calls.push(call);
  return Promise.resolve(answer(call));
};
(globalThis as unknown as Record<string, unknown>).__operatorMode = () => Promise.resolve(mode);

const STUB = `
  export const apiJson = (path, init) => globalThis.__operatorApi(path, init);
  export const dataMode = () => globalThis.__operatorMode();
`;

register(
  `data:text/javascript,${encodeURIComponent(`
    const stub = ${JSON.stringify(STUB)};
    export async function resolve(specifier, context, next) {
      if (specifier.endsWith('load-desk/data-mode.ts') || specifier === './data-mode.ts') {
        return {
          url: 'data:text/javascript,' + encodeURIComponent(stub),
          shortCircuit: true,
          format: 'module',
        };
      }
      return next(specifier, context);
    }
  `)}`,
);

const client = await import(`${root}lib/load-desk/operator-client.ts`);
const panel = await import(`${root}lib/operator/panel-store.ts`);

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

/** A server answer with only the parts a test cares about filled in. */
const response = (over: Partial<OperatorResponse> = {}): OperatorResponse => ({
  run_id: 'run-1',
  status: 'completed',
  text: 'Eighteen tickets are ready.',
  activity: [],
  entities: [],
  actions: [],
  pending: null,
  limited: null,
  ...over,
});

const clean = () => {
  calls.length = 0;
  mode = 'remote';
  client.reset();
};

// ------------------------------------------------------- history bounding

void test('only the last dozen turns are sent, oldest first', () => {
  const turns = Array.from({ length: 40 }, (_, at) => ({
    id: `t${at}`,
    role: at % 2 === 0 ? ('user' as const) : ('operator' as const),
    text: `line ${at}`,
  }));
  const history = client.boundHistory(turns);
  assert.equal(history.length, RUN_LIMITS.maxHistoryTurns);
  assert.equal(history.at(-1)?.text, 'line 39');
  assert.equal(history[0].text, `line ${40 - RUN_LIMITS.maxHistoryTurns}`);
  assert.deepEqual(Object.keys(history[0]).sort(), ['role', 'text']);
});

void test('a short conversation is sent whole', () => {
  assert.deepEqual(client.boundHistory([{ id: 'a', role: 'user', text: 'hi' }]), [
    { role: 'user', text: 'hi' },
  ]);
  assert.deepEqual(client.boundHistory([]), []);
});

void test('asking sends the page context and the bounded history', async () => {
  clean();
  panel.openOperator({ page: '/records', ask: 'Why?' });
  answer = () => ({ ok: true, data: response() });
  await client.ask('Why is invoice 284 not ready?');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, '/api/operator/run');
  const body = JSON.parse(calls[0].init.body ?? '{}');
  assert.equal(body.context.page, '/records');
  assert.deepEqual(body.history, []);
  await client.ask('And the one before it?');
  const second = JSON.parse(calls[1].init.body ?? '{}');
  assert.deepEqual(second.history, [
    { role: 'user', text: 'Why is invoice 284 not ready?' },
    { role: 'operator', text: 'Eighteen tickets are ready.' },
  ]);
  assert.equal(client.getOperatorSnapshot().turns.length, 4);
});

void test('a second question while one is in flight is ignored', async () => {
  clean();
  // The stub resolves whatever `answer` returns, so a promise that has not
  // settled stands in for a request still on the wire.
  let release = (_: Answer) => {};
  const slow = new Promise<Answer>((resolve) => {
    release = resolve;
  });
  answer = () => slow as unknown as Answer;
  const first = client.ask('one');
  await Promise.resolve();
  await client.ask('two');
  assert.equal(calls.length, 1, 'the second ask never reached the server');
  release({ ok: true, data: response() });
  await first;
  assert.equal(client.getOperatorSnapshot().busy, false);
});

void test('the local preview never asks the server', async () => {
  // Where the session keeps its data is settled once per page load, so this
  // needs a store that has not been asked yet: a second instance of the module.
  const preview = await import(`${root}lib/load-desk/operator-client.ts?preview`);
  calls.length = 0;
  mode = 'local';
  await preview.ask('anything');
  mode = 'remote';
  assert.equal(calls.length, 0);
  assert.equal(preview.getOperatorSnapshot().turns.length, 0);
});

// ----------------------------------------------------- pending lifecycle

const PENDING = {
  id: 'act-1',
  run_id: 'run-1',
  tool: 'recalculate_mileage',
  input: {},
  impact: {
    records: 3,
    touches_finalized: false,
    lines: ['3 truck-days'],
    affected: [],
    blockers: [],
    state_hash: 'abc',
  },
  risk: 1 as const,
  reason: 'Assist mode confirms every change.',
  expires_at: '2026-09-22T12:00:00.000Z',
};

void test('a run that needs a go-ahead leaves the card waiting', async () => {
  clean();
  answer = () => ({ ok: true, data: response({ status: 'awaiting_confirmation', pending: PENDING }) });
  await client.ask('Recalculate Tuesday');
  assert.equal(client.getOperatorSnapshot().pending?.id, 'act-1');
});

void test('confirming replaces the card with what the action did', async () => {
  clean();
  answer = () => ({ ok: true, data: response({ status: 'awaiting_confirmation', pending: PENDING }) });
  await client.ask('Recalculate Tuesday');
  answer = (call) => {
    assert.equal(call.path, '/api/operator/confirm');
    assert.deepEqual(JSON.parse(call.init.body ?? '{}'), { action_id: 'act-1' });
    return {
      ok: true,
      data: response({
        text: 'Done.',
        actions: [
          {
            kind: 'action',
            outcome: 'done',
            succeeded: [],
            failed: [],
            not_attempted: [],
            verification: { checked: 3, passed: 3, failures: [] },
            summary: 'Three days recalculated.',
            entities: [],
          },
        ],
      }),
    };
  };
  await client.confirmAction('act-1');
  const snapshot = client.getOperatorSnapshot();
  assert.equal(snapshot.pending, null);
  const last = snapshot.turns.at(-1);
  assert.equal(last?.role, 'operator');
  assert.equal(last?.role === 'operator' ? last.actions.length : 0, 1);
});

void test('a confirmation that expired is dropped and said out loud', async () => {
  clean();
  answer = () => ({ ok: true, data: response({ status: 'awaiting_confirmation', pending: PENDING }) });
  await client.ask('Recalculate Tuesday');
  answer = () => ({ ok: false, error: 'That action is no longer waiting.', status: 409 });
  await client.confirmAction('act-1');
  const snapshot = client.getOperatorSnapshot();
  assert.equal(snapshot.pending, null);
  assert.equal(snapshot.error, 'That action is no longer waiting.');
  assert.equal(snapshot.busy, false);
});

void test('a failure that is not a conflict keeps the card on screen', async () => {
  clean();
  answer = () => ({ ok: true, data: response({ status: 'awaiting_confirmation', pending: PENDING }) });
  await client.ask('Recalculate Tuesday');
  answer = () => ({ ok: false, error: 'Something went wrong. Please try again.', status: 500 });
  await client.confirmAction('act-1');
  assert.equal(client.getOperatorSnapshot().pending?.id, 'act-1');
});

void test('"Not now" clears the card and adds a note, and sends nothing', async () => {
  clean();
  answer = () => ({ ok: true, data: response({ status: 'awaiting_confirmation', pending: PENDING }) });
  await client.ask('Recalculate Tuesday');
  const before = calls.length;
  client.cancelPending();
  const snapshot = client.getOperatorSnapshot();
  assert.equal(snapshot.pending, null);
  assert.equal(calls.length, before);
  const last = snapshot.turns.at(-1);
  assert.equal(last?.text, 'Okay — nothing was changed.');
  assert.equal(last?.role === 'operator' ? last.local : undefined, true);
  assert.ok(PL_TEXT['Okay — nothing was changed.'], 'the note is translated');
});

void test('a deployment with no model says so rather than showing an error', async () => {
  clean();
  answer = () => ({ ok: false, error: 'not configured', status: 503 });
  await client.ask('anything');
  assert.equal(client.getOperatorSnapshot().notConfigured, true);
});

void test('a new conversation drops an answer to the old one', async () => {
  clean();
  let release = (_: Answer) => {};
  const slow = new Promise<Answer>((resolve) => {
    release = resolve;
  });
  answer = () => slow as unknown as Answer;
  const asking = client.ask('one');
  await Promise.resolve();
  client.reset();
  release({ ok: true, data: response() });
  await asking;
  assert.equal(client.getOperatorSnapshot().turns.length, 0);
  assert.equal(client.getOperatorSnapshot().pending, null);
});

// ---------------------------------------------------------- entity chips

void test('a thing named by three tools is one chip', () => {
  const merged = client.mergeEntities([
    { type: 'invoice', id: '284', label: 'Invoice #284', href: '/records?invoice=284' },
    { type: 'invoice', id: '284', label: 'Invoice 284', href: null },
    { type: 'ticket', id: '284', label: 'Ticket 284', href: '/records?ticket=284' },
    { type: 'invoice', id: '285', label: 'Invoice #285', href: null },
  ]);
  assert.deepEqual(
    (merged as EntityRef[]).map((entity) => `${entity.type}:${entity.id}`),
    ['invoice:284', 'ticket:284', 'invoice:285'],
  );
  assert.equal(merged[0].label, 'Invoice #284', 'the first mention wins');
});

void test('an entity with nothing to show is not a chip at all', () => {
  const merged = client.mergeEntities([
    { type: 'ticket', id: '1', label: '', href: null },
    { type: 'ticket', id: '2', label: 'Ticket 2', href: null },
  ]);
  assert.equal(merged.length, 1);
});

void test('a chip only links to a path inside the dashboard', () => {
  assert.equal(client.safeHref('/records?invoice=284'), '/records?invoice=284');
  assert.equal(client.safeHref('https://example.test/steal'), null);
  assert.equal(client.safeHref('//example.test/steal'), null);
  assert.equal(client.safeHref('javascript:alert(1)'), null);
  assert.equal(client.safeHref('records'), null);
  assert.equal(client.safeHref(null), null);
});

// ------------------------------------------------- the panel store's page

void test('the page follows the router; the thing being looked at does not', () => {
  panel.closeOperator();
  panel.setPage('/mileage');
  panel.openOperator({
    page: '/records',
    entity: { type: 'invoice', id: '284', label: 'Invoice #284', href: null },
  });
  assert.equal(panel.getPanelSnapshot().context?.entity?.id, '284');
  panel.setPage('/mileage');
  assert.equal(panel.getPanelSnapshot().context?.page, '/mileage');
  assert.equal(panel.getPanelSnapshot().context?.entity, null);
});

void test('a question handed in by a page is used once', () => {
  panel.openOperator({ page: '/rates', ask: 'What rates are missing?' });
  assert.equal(panel.getPanelSnapshot().prefill, 'What rates are missing?');
  panel.consumePrefill();
  assert.equal(panel.getPanelSnapshot().prefill, null);
});

// ------------------------------------------------------------ suggestions

void test('the questions offered come from the page, four to six of them', () => {
  const pages = ['/', '/records', '/mileage', '/rates', '/customers', '/load-desk', '/fleet'];
  for (const page of pages) {
    const offered = suggestionsFor({ page, entity: null });
    assert.ok(offered.length >= 4 && offered.length <= 6, `${page} offered ${offered.length}`);
    assert.equal(new Set(offered).size, offered.length, `${page} repeats a question`);
  }
  assert.equal(suggestionsFor(null).length >= 4, true);
});

void test('a question about "this invoice" is only offered when there is one', () => {
  const without = suggestionsFor({ page: '/records', entity: null });
  const withOne: PageContext = {
    page: '/records',
    entity: { type: 'invoice', id: '284', label: 'Invoice #284', href: null },
  };
  assert.ok(!without.includes('Why isn’t this invoice ready?'));
  assert.equal(suggestionsFor(withOne)[0], 'Why isn’t this invoice ready?');
  assert.ok(!suggestionsFor({ page: '/mileage', entity: null }).includes('Check this route'));
});

// ----------------------------------------------------------- plain names

void test('every tool a person can confirm has a plain name', () => {
  assert.equal(toolLabel('apply_group_ticket_correction'), 'Correct tickets');
  assert.equal(toolLabel('create_rate_followup_draft'), 'Draft follow-up');
  assert.equal(toolLabel('some_future_tool'), 'some future tool');
  assert.equal(permissionLabel('exceptions.resolve'), 'Resolve safe exceptions');
  assert.equal(riskLabel(2), 'Level 2 · changes data');
  assert.equal(riskLabel(3), 'Level 3 · high impact');
});

// --------------------------------------------------------- the shell rules

const SHELL = read('components/shell/app-shell.tsx');

void test('the shell reaches the Operator only through a lazy import', () => {
  assert.match(SHELL, /dynamic\(\s*\(\) => import\('@\/components\/operator\/operator-mount'\)/);
  assert.match(SHELL, /ssr: false/);
  assert.match(SHELL, /<OperatorMount \/>/);
  assert.match(SHELL, /<OperatorTrigger \/>/);
  // A static import would put the panel in every request for every page.
  assert.ok(
    !/^import .*components\/operator/m.test(SHELL),
    'app-shell must not import the Operator statically',
  );
  assert.ok(!/^import .*lib\/server/m.test(SHELL), 'app-shell must not import server code');
});

void test('the shell still says nothing about rates', () => {
  for (const forbidden of ['/api/rates', 'rates-engine', 'rate-ai', 'rate-mail']) {
    assert.ok(!SHELL.includes(forbidden), `app-shell must not mention ${forbidden}`);
  }
});

const OPERATOR_FILES = readdirSync(new URL('../components/operator', import.meta.url))
  .filter((name) => name.endsWith('.tsx') || name.endsWith('.ts'))
  .map((name) => ({ name, source: read(`components/operator/${name}`) }));

void test('the panel never reaches into the server', () => {
  assert.ok(OPERATOR_FILES.length >= 8, 'the panel is made of the files the brief lists');
  for (const { name, source } of OPERATOR_FILES) {
    assert.ok(!source.includes('@/lib/server'), `${name} imports server code`);
    assert.ok(
      !source.includes('dangerouslySetInnerHTML'),
      `${name} renders markup from the server`,
    );
  }
});

void test('the stylesheet is loaded once, by the workspace layout', () => {
  assert.match(read('app/(workspace)/layout.tsx'), /import '\.\/operator\/operator\.css';/);
});

// ------------------------------------------------------------------ Polish

/** `t('…')` and `t(\n  '…')`, but not `import('…')` or `split('\n')`. */
const T_CALL = /(?<![\w.])t\(\s*'((?:[^'\\]|\\.)+)'/g;

void test('every English sentence in the panel has Polish', () => {
  const missing: string[] = [];
  for (const { name, source } of OPERATOR_FILES) {
    for (const match of source.matchAll(T_CALL)) {
      const english = match[1];
      if (PL_TEXT[english] === undefined) missing.push(`${name}: ${english}`);
    }
  }
  assert.deepEqual(missing, []);
});

void test('the wording the panel builds from maps has Polish too', () => {
  const built = [
    ...['reprocess_ticket', 'apply_group_ticket_correction', 'resolve_ticket_exception',
      'recalculate_mileage', 'recalculate_invoice', 'create_rate_request_draft',
      'create_rate_followup_draft'].map(toolLabel),
    ...['tickets.reprocess', 'tickets.correct', 'exceptions.resolve', 'mileage.recalculate',
      'invoices.recalculate', 'rates.draft'].map(permissionLabel),
    ...([0, 1, 2, 3] as const).map(riskLabel),
    ...suggestionsFor(null),
    ...suggestionsFor({ page: '/records', entity: { type: 'invoice', id: '1', label: 'x', href: null } }),
    ...suggestionsFor({ page: '/mileage', entity: { type: 'mileage_day', id: '1', label: 'x', href: null } }),
    ...suggestionsFor({ page: '/rates', entity: null }),
    ...suggestionsFor({ page: '/load-desk', entity: null }),
    ...suggestionsFor({ page: '/customers', entity: null }),
    ...suggestionsFor({ page: '/', entity: null }),
    'Assist', 'Controlled', 'Autonomous',
    'Done', 'Partly done', 'Failed', 'Refused',
    'Running', 'Completed', 'Waiting on you', 'Stopped early',
    'Monius Operator isn’t set up on this deployment yet.',
  ];
  const missing = built.filter((english) => PL_TEXT[english] === undefined);
  assert.deepEqual(missing, []);
});

void test('the Polish is in the pages dictionary, under its own heading', () => {
  assert.match(read('lib/i18n/pl-pages.ts'), /\/\/ Monius Operator/);
  assert.ok(PL_PAGES['Ask Monius'], 'the trigger is translated in pl-pages');
  const names = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
  for (const [english, polish] of Object.entries(PL_PAGES)) {
    assert.deepEqual(names(polish), names(english), `placeholders differ for "${english}"`);
  }
});
