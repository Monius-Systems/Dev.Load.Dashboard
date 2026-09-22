import { test } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { createRegistry } from '../lib/operator/registry.ts';
import { RUN_LIMITS } from '../lib/operator/limits.ts';
import {
  DEFAULT_SETTINGS,
  type ActionResult,
  type ActivityItem,
  type AuditEntry,
  type EntityRef,
  type OperatorSettings,
  type PendingConfirmation,
  type ReadResult,
  type ToolContext,
  type ToolDefinition,
  type ToolImpact,
} from '../lib/operator/types.ts';

// The Operator's engine, tested where it decides things.
//
// Nothing here talks to a model, a database or a network: the model is a script
// of answers, the store is a Map, and the tools are three definitions that
// record what they were called with. What is actually under test is the part
// that matters — that a write never reaches its handler without a decision to
// run, that a confirmation is against the state it was previewed on, that the
// workspace is the member's whatever the model said, and that a run is written
// down however it ends.
//
// The engine lives under lib/server, where the audit store imports
// `cloudflare:workers`, so a resolver is registered for this file alone and
// that one module is stubbed. Everything else — the engine, the registry, the
// policy, the prompt — is the real thing.

const root = pathToFileURL(`${process.cwd()}/`).href;

const STUBS: Record<string, string> = {
  'cloudflare:workers': 'export const env = {};',
  '@/lib/server/load-desk-store': `
    export class StoreError extends Error {
      constructor(message, status) { super(message); this.status = status; }
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

// The engine, loaded through the resolver above but typed as the real module,
// so the assertions below are checked against the contract and not against any.
const engine = (await import(`${root}lib/server/operator/run.ts`)) as typeof import(
  '../lib/server/operator/run.ts'
);
const { runOperator, confirmAction } = engine;

// ------------------------------------------------------------------- fakes

type Scripted = {
  text?: string | null;
  toolCalls?: { id: string; name: string; arguments: string }[];
  throws?: boolean;
};

/** A model that answers from a script, and says how many times it was asked. */
function fakeModel(script: Scripted[] | ((turn: number) => Scripted)) {
  let turn = 0;
  return {
    name: 'scripted',
    calls: () => turn,
    async respond() {
      const step = typeof script === 'function' ? script(turn) : script[turn];
      turn += 1;
      if (!step || step.throws) throw new Error('the model fell over');
      return {
        text: step.text ?? null,
        toolCalls: step.toolCalls ?? [],
        usage: { input: 10, output: 5 },
        model: 'scripted',
      };
    },
  };
}

/** The run log, in a Map, with everything it was asked to write kept for reading. */
type Row = {
  status: string;
  activity: ActivityItem[];
  entities: EntityRef[];
  summary: string;
  writes: number;
};

function fakeStore(settings: OperatorSettings = DEFAULT_SETTINGS) {
  const pendings = new Map<string, PendingConfirmation>();
  const rows = new Map<string, Row>();
  const state = {
    settings,
    created: [] as Record<string, unknown>[],
    finished: [] as Record<string, unknown>[],
    audit: [] as AuditEntry[],
    pendings,
    /** The run rows themselves, as createRun, finishRun and appendToRun leave them. */
    rows,
    /** Set to null to make takePending behave as if the action had expired. */
    takeReturns: undefined as PendingConfirmation | null | undefined,
    /** How many of the next recordAction calls should fail. */
    recordActionFails: 0,
  };
  const store = {
    async getSettings() {
      return state.settings;
    },
    async createRun(_c: unknown, _w: string, run: Record<string, unknown>) {
      state.created.push(run);
      rows.set(String(run.id), {
        status: 'running',
        activity: [],
        entities: [],
        summary: '',
        writes: 0,
      });
    },
    async finishRun(_c: unknown, _w: string, runId: string, patch: Record<string, unknown>) {
      state.finished.push({ runId, ...patch });
      rows.set(runId, {
        status: String(patch.status),
        activity: patch.activity as ActivityItem[],
        entities: patch.entities as EntityRef[],
        summary: String(patch.summary),
        writes: Number(patch.writes),
      });
    },
    async appendToRun(
      _c: unknown,
      _w: string,
      runId: string,
      patch: {
        status: string;
        activity: ActivityItem[];
        entities: EntityRef[];
        summary: string;
        writes: number;
      },
    ) {
      const row = rows.get(runId);
      if (!row) throw new Error('no such run');
      const seen = new Set<string>();
      const entities: EntityRef[] = [];
      for (const entity of [...row.entities, ...patch.entities]) {
        const key = `${entity.type}:${entity.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        entities.push(entity);
      }
      rows.set(runId, {
        status: patch.status,
        activity: [...row.activity, ...patch.activity],
        entities,
        summary: patch.summary,
        writes: row.writes + patch.writes,
      });
    },
    async recordAction(_c: unknown, _w: string, entry: AuditEntry) {
      if (state.recordActionFails > 0) {
        state.recordActionFails -= 1;
        throw new Error('the audit log is unreachable');
      }
      state.audit.push(entry);
    },
    async createPending(_c: unknown, _w: string, pending: PendingConfirmation) {
      pendings.set(pending.id, pending);
    },
    async takePending(_c: unknown, _w: string, id: string) {
      if (state.takeReturns !== undefined) return state.takeReturns;
      const found = pendings.get(id) ?? null;
      pendings.delete(id);
      return found;
    },
  };
  return Object.assign(store, { state });
}

const impactOf = (hash: string, records = 1): ToolImpact => ({
  records,
  touches_finalized: false,
  lines: [`${records} ticket`],
  affected: [{ type: 'ticket', id: 't-1', label: 'Ticket 1', href: '/records?ticket=t-1' }],
  blockers: [],
  state_hash: hash,
});

const okAction = (summary: string): ActionResult => ({
  kind: 'action',
  outcome: 'done',
  succeeded: [{ type: 'ticket', id: 't-1', label: 'Ticket 1', href: '/records?ticket=t-1' }],
  failed: [],
  not_attempted: [],
  verification: { checked: 1, passed: 1, failures: [] },
  summary,
  entities: [{ type: 'ticket', id: 't-1', label: 'Ticket 1', href: '/records?ticket=t-1' }],
});

/** The three tools every test registers, plus a record of how they were called. */
function fakeTools() {
  const seen = {
    reads: [] as ToolContext[],
    writes: [] as ToolContext[],
    dryRuns: 0,
    hash: 'hash-one',
    /** Makes the level-1 write tool fall over the way a real service can. */
    writeFails: false,
  };
  const readTool: ToolDefinition = {
    name: 'look_at_tickets',
    description: 'look at the tickets',
    input: { type: 'object', properties: {}, required: [], additionalProperties: false },
    output: { type: 'object' },
    type: 'read',
    permission: 'tickets.read',
    risk: 0,
    confirmation: 'never',
    parse: (args) => ({ value: (args ?? {}) as Record<string, unknown> }),
    handler: async (_input, ctx) => {
      seen.reads.push(ctx);
      const result: ReadResult = {
        kind: 'read',
        data: { tickets: 3 },
        summary: 'Found 3 tickets.',
        entities: [{ type: 'ticket', id: 't-1', label: 'Ticket 1', href: '/records?ticket=t-1' }],
      };
      return result;
    },
  };
  const writeTool: ToolDefinition = {
    name: 'reprocess_ticket',
    description: 'reprocess those tickets',
    input: { type: 'object', properties: {}, required: [], additionalProperties: false },
    output: { type: 'object' },
    type: 'write',
    permission: 'tickets.reprocess',
    risk: 1,
    confirmation: 'conditional',
    parse: (args) => ({ value: (args ?? {}) as Record<string, unknown> }),
    dryRun: async () => {
      seen.dryRuns += 1;
      return impactOf(seen.hash);
    },
    handler: async (_input, ctx) => {
      seen.writes.push(ctx);
      if (seen.writeFails) throw new Error('the service refused it');
      return okAction('Reprocessed 1 ticket.');
    },
  };
  const highTool: ToolDefinition = {
    name: 'correct_tickets',
    description: 'correct those tickets',
    input: { type: 'object', properties: {}, required: [], additionalProperties: false },
    output: { type: 'object' },
    type: 'write',
    permission: 'tickets.correct',
    risk: 3,
    confirmation: 'always',
    parse: (args) => ({ value: (args ?? {}) as Record<string, unknown> }),
    dryRun: async () => impactOf(seen.hash),
    handler: async (_input, ctx) => {
      seen.writes.push(ctx);
      return okAction('Corrected 1 ticket.');
    },
  };
  return { seen, readTool, writeTool, highTool };
}

const call = (id: string, name: string, args = '{}') => ({ id, name, arguments: args });

// A Supabase client is never touched by the engine, only handed to tools.
const client = {} as never;
const member = { workspaceId: 'ws-1', id: 'user-1' };

// --------------------------------------------------------------- read tools

void test('a read tool runs and says what it found in the run activity', async () => {
  const { seen, readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore();
  const response = await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel([
        { toolCalls: [call('c1', 'look_at_tickets')] },
        { text: 'There are three tickets waiting.' },
      ]),
      store,
      routing: null,
      snapshot: async () => 'Three tickets waiting.',
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'What is waiting?', context: null, history: [] },
  );
  assert.equal(response.status, 'completed');
  assert.equal(seen.reads.length, 1);
  assert.deepEqual(
    response.activity.map((item) => [item.tool, item.kind, item.summary]),
    [['look_at_tickets', 'read', 'Found 3 tickets.']],
  );
  assert.equal(response.text, 'There are three tickets waiting.');
  assert.deepEqual(response.entities.map((entity) => entity.id), ['t-1']);
});

void test('an unknown tool is answered, not fatal, and the run carries on', async () => {
  const { readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore();
  const response = await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel([
        { toolCalls: [call('c1', 'delete_everything')] },
        { text: 'I have no tool for that.' },
      ]),
      store,
      routing: null,
      snapshot: async () => null,
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'Delete it all', context: null, history: [] },
  );
  assert.equal(response.status, 'completed');
  assert.equal(response.activity.length, 0);
  assert.equal(response.text, 'I have no tool for that.');
});

// ------------------------------------------------------------ confirmations

void test('in assist mode a write becomes a confirmation and no handler runs', async () => {
  const { seen, readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore({ ...DEFAULT_SETTINGS, granted: ['tickets.reprocess'] });
  const response = await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel([{ toolCalls: [call('c1', 'reprocess_ticket')] }]),
      store,
      routing: null,
      snapshot: async () => null,
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'Reprocess them', context: null, history: [] },
  );
  assert.equal(response.status, 'awaiting_confirmation');
  assert.equal(seen.writes.length, 0, 'the handler must not have run');
  assert.equal(seen.dryRuns, 1);
  assert.ok(response.pending);
  assert.equal(response.pending?.tool, 'reprocess_ticket');
  assert.equal(store.state.pendings.size, 1);
  assert.deepEqual(
    response.activity.map((item) => item.kind),
    ['confirm'],
  );
});

void test('a level-3 tool is confirmed even in autonomous mode with the permission', async () => {
  const { seen, readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore({
    ...DEFAULT_SETTINGS,
    autonomy: 'autonomous',
    granted: ['tickets.correct'],
  });
  const response = await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel([{ toolCalls: [call('c1', 'correct_tickets')] }]),
      store,
      routing: null,
      snapshot: async () => null,
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'Fix the weights', context: null, history: [] },
  );
  assert.equal(response.status, 'awaiting_confirmation');
  assert.equal(seen.writes.length, 0);
  assert.equal(response.pending?.risk, 3);
});

void test('confirming an action on the same state runs it and audits the confirmation', async () => {
  const { seen, readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore({ ...DEFAULT_SETTINGS, granted: ['tickets.reprocess'] });
  const deps = {
    client,
    member,
    registry: createRegistry([readTool, writeTool, highTool]),
    model: fakeModel([{ toolCalls: [call('c1', 'reprocess_ticket')] }]),
    store,
    routing: null,
    snapshot: async () => null,
    now: () => new Date('2026-09-22T12:00:00.000Z'),
  };
  const asked = await runOperator(deps, {
    message: 'Reprocess them',
    context: null,
    history: [],
  });
  const actionId = asked.pending?.id as string;

  const done = await confirmAction(deps, actionId);
  assert.equal(done.status, 'completed');
  assert.equal(seen.writes.length, 1);
  assert.equal(done.actions[0]?.outcome, 'done');
  assert.match(done.text, /Reprocessed 1 ticket\. Verified 1 of 1\./);
  assert.equal(store.state.audit.length, 1);
  assert.equal(store.state.audit[0].confirmation, 'confirmed');
  assert.equal(store.state.audit[0].tool, 'reprocess_ticket');
  assert.equal(store.state.audit[0].outcome, 'done');
});

void test('a confirmation closes the run that stopped to ask for it', async () => {
  const { readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore({ ...DEFAULT_SETTINGS, granted: ['tickets.reprocess'] });
  const deps = {
    client,
    member,
    registry: createRegistry([readTool, writeTool, highTool]),
    model: fakeModel([
      {
        toolCalls: [
          call('c1', 'look_at_tickets'),
          call('c2', 'reprocess_ticket'),
        ],
      },
    ]),
    store,
    routing: null,
    snapshot: async () => null,
    now: () => new Date('2026-09-22T12:00:00.000Z'),
  };
  const asked = await runOperator(deps, {
    message: 'Look, then reprocess them',
    context: null,
    history: [],
  });
  assert.equal(asked.status, 'awaiting_confirmation');
  const row = store.state.rows.get(asked.run_id);
  assert.equal(row?.status, 'awaiting_confirmation');
  assert.equal(row?.writes, 0);

  await confirmAction(deps, asked.pending?.id as string);

  const closed = store.state.rows.get(asked.run_id);
  assert.equal(closed?.status, 'completed');
  assert.equal(closed?.writes, 1);
  // The reading that led to the question is still under the change that
  // answered it, rather than replaced by it.
  assert.deepEqual(
    closed?.activity.map((item) => [item.kind, item.tool]),
    [
      ['read', 'look_at_tickets'],
      ['confirm', 'reprocess_ticket'],
      ['write', 'reprocess_ticket'],
    ],
  );
  assert.deepEqual(closed?.entities.map((entity) => entity.id), ['t-1']);
});

void test('the confirmation sentence is the tool\'s plain label, not its description', async () => {
  const { readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore({ ...DEFAULT_SETTINGS, granted: ['tickets.reprocess'] });
  const asked = await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel([{ toolCalls: [call('c1', 'reprocess_ticket')] }]),
      store,
      routing: null,
      snapshot: async () => null,
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'Reprocess them', context: null, history: [] },
  );
  // 'reprocess_ticket' is labelled 'Reprocess ticket' in lib/operator/tool-labels.ts.
  assert.equal(asked.text, 'I need your go-ahead: reprocess ticket.');
  assert.ok(!asked.text.includes(writeTool.description));
});

void test('a confirmation against changed state is refused and nothing runs', async () => {
  const { seen, readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore({ ...DEFAULT_SETTINGS, granted: ['tickets.reprocess'] });
  const deps = {
    client,
    member,
    registry: createRegistry([readTool, writeTool, highTool]),
    model: fakeModel([{ toolCalls: [call('c1', 'reprocess_ticket')] }]),
    store,
    routing: null,
    snapshot: async () => null,
    now: () => new Date('2026-09-22T12:00:00.000Z'),
  };
  const asked = await runOperator(deps, {
    message: 'Reprocess them',
    context: null,
    history: [],
  });
  // Somebody edited a ticket between the preview and the button.
  seen.hash = 'hash-two';
  await assert.rejects(
    () => confirmAction(deps, asked.pending?.id as string),
    (error: unknown) => {
      const failure = error as { status?: number; message?: string };
      assert.equal(failure.status, 409);
      assert.match(String(failure.message), /changed since you looked/i);
      return true;
    },
  );
  assert.equal(seen.writes.length, 0);
  assert.equal(store.state.audit.length, 0);
});

void test('a confirmation that is no longer waiting is a 409', async () => {
  const { readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore();
  store.state.takeReturns = null;
  await assert.rejects(
    () =>
      confirmAction(
        {
          client,
          member,
          registry: createRegistry([readTool, writeTool, highTool]),
          model: fakeModel([]),
          store,
          routing: null,
          snapshot: async () => null,
        },
        '00000000-0000-4000-8000-000000000000',
      ),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 409);
      return true;
    },
  );
});

// ------------------------------------------------------- writes and the trail

void test('a write that falls over still leaves an audit row, and the run goes on', async () => {
  const { seen, readTool, writeTool, highTool } = fakeTools();
  seen.writeFails = true;
  const store = fakeStore({
    ...DEFAULT_SETTINGS,
    autonomy: 'controlled',
    granted: ['tickets.reprocess'],
  });
  const response = await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel([
        { toolCalls: [call('c1', 'reprocess_ticket')] },
        { text: 'That did not work, and I have left it alone.' },
      ]),
      store,
      routing: null,
      snapshot: async () => null,
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'Reprocess them', context: null, history: [] },
  );
  assert.equal(seen.writes.length, 1, 'the handler was reached');
  assert.equal(store.state.audit.length, 1, 'an attempt that failed is still an attempt');
  assert.equal(store.state.audit[0].outcome, 'failed');
  assert.equal(store.state.audit[0].confirmation, 'auto');
  assert.equal(store.state.audit[0].tool, 'reprocess_ticket');
  assert.equal(store.state.audit[0].entity_id, 't-1');
  // The change failed; the run did not.
  assert.equal(response.status, 'completed');
  assert.deepEqual(
    response.activity.map((item) => [item.kind, item.summary]),
    [['write', 'The change did not go through.']],
  );
});

void test('a change that cannot be written down ends the run before anything else changes', async () => {
  const { seen, readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore({
    ...DEFAULT_SETTINGS,
    autonomy: 'controlled',
    granted: ['tickets.reprocess'],
  });
  store.state.recordActionFails = 1;
  const response = await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel([
        {
          toolCalls: [
            call('c1', 'reprocess_ticket'),
            call('c2', 'reprocess_ticket'),
          ],
        },
        { text: 'Never reached.' },
      ]),
      store,
      routing: null,
      snapshot: async () => null,
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'Reprocess them twice', context: null, history: [] },
  );
  assert.equal(response.status, 'failed');
  // The change happened, so it is reported, not hidden.
  assert.equal(response.actions.length, 1);
  assert.equal(response.actions[0].summary, 'Reprocessed 1 ticket.');
  assert.match(response.text, /could not be recorded in the audit log/);
  // And nothing else was allowed to change unrecorded.
  assert.equal(seen.writes.length, 1, 'a second write ran after an unrecorded one');
  assert.equal(store.state.finished.length, 1);
  assert.equal(store.state.finished[0].status, 'failed');
  assert.equal(store.state.finished[0].writes, 1);
});

// ------------------------------------------------------------------ limits

void test('a model that keeps calling tools stops at the tool-call limit', async () => {
  const { readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore();
  let n = 0;
  const response = await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel(() => {
        n += 1;
        return {
          toolCalls: [
            call(`a${n}`, 'look_at_tickets'),
            call(`b${n}`, 'look_at_tickets'),
          ],
        };
      }),
      store,
      routing: null,
      snapshot: async () => null,
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'Look again', context: null, history: [] },
  );
  assert.equal(response.status, 'limited');
  assert.equal(response.activity.length, RUN_LIMITS.maxToolCalls);
  assert.match(
    String(response.limited),
    new RegExp(`limit of ${RUN_LIMITS.maxToolCalls} tool calls`),
  );
});

// ------------------------------------------------------------ the workspace

void test('the workspace a tool is given is the member\'s, whatever the model sent', async () => {
  const { seen, readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore();
  await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel([
        {
          toolCalls: [
            call('c1', 'look_at_tickets', JSON.stringify({ workspace_id: 'somebody-else' })),
          ],
        },
        { text: 'Done.' },
      ]),
      store,
      routing: null,
      snapshot: async () => null,
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'Look', context: null, history: [] },
  );
  assert.equal(seen.reads.length, 1);
  assert.equal(seen.reads[0].workspaceId, 'ws-1');
  assert.equal(seen.reads[0].userId, 'user-1');
  assert.equal(seen.reads[0].origin, 'operator');
});

// ---------------------------------------------------------------- registry

void test('the registry refuses a tool that could not be made safe', () => {
  const { readTool, writeTool } = fakeTools();
  assert.throws(
    () => createRegistry([{ ...writeTool, risk: 3, confirmation: 'conditional' }]),
    /level-3/,
  );
  assert.throws(
    () => createRegistry([{ ...writeTool, dryRun: undefined }]),
    /dry run/,
  );
  assert.throws(() => createRegistry([readTool, readTool]), /already registered/);
  assert.throws(
    () => createRegistry([{ ...readTool, permission: 'tickets.reprocess' }]),
    /read permission/,
  );
  assert.throws(
    () => createRegistry([{ ...writeTool, permission: 'tickets.read' }]),
    /write permission/,
  );
  // And it accepts the three that are right.
  assert.equal(createRegistry([readTool, writeTool]).list().length, 2);
  assert.deepEqual(createRegistry([readTool]).specs(), [
    {
      type: 'function',
      name: 'look_at_tickets',
      description: 'look at the tickets',
      parameters: readTool.input,
      strict: true,
    },
  ]);
});

// ------------------------------------------------------------ what is kept

void test('a run that fails is still written down, as failed', async () => {
  const { readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore();
  const response = await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel([{ throws: true }]),
      store,
      routing: null,
      snapshot: async () => null,
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'Anything', context: null, history: [] },
  );
  assert.equal(response.status, 'failed');
  assert.equal(store.state.created.length, 1);
  assert.equal(store.state.finished.length, 1);
  assert.equal(store.state.finished[0].status, 'failed');
  assert.equal(store.state.finished[0].runId, response.run_id);
});

void test('a run keeps nothing of the model beyond the reply a person read', async () => {
  const { readTool, writeTool, highTool } = fakeTools();
  const store = fakeStore();
  const reply = `${'The tickets are fine. '.repeat(30)}MARKER-NOT-FOR-STORAGE`;
  assert.ok(reply.length > 500);
  const response = await runOperator(
    {
      client,
      member,
      registry: createRegistry([readTool, writeTool, highTool]),
      model: fakeModel([
        { text: 'first pass', toolCalls: [call('c1', 'look_at_tickets')] },
        { text: reply },
      ]),
      store,
      routing: null,
      snapshot: async () => null,
      now: () => new Date('2026-09-22T12:00:00.000Z'),
    },
    { message: 'How are the tickets?', context: null, history: [] },
  );
  assert.equal(response.status, 'completed');
  const written = store.state.finished[0];
  const summary = String(written.summary);
  assert.ok(summary.length <= 500);
  assert.equal(summary, reply.slice(0, 500));
  assert.ok(
    !JSON.stringify(written).includes('MARKER-NOT-FOR-STORAGE'),
    'the stored run carried model text past the summary',
  );
  assert.ok(!JSON.stringify(store.state.created[0]).includes('first pass'));
  assert.equal(written.tool_calls, 1);
  assert.equal(written.writes, 0);
});
