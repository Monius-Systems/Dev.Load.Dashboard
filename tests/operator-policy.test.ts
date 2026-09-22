import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { decide, describe } from '../lib/operator/policy.ts';
import { RUN_LIMITS } from '../lib/operator/limits.ts';
import type {
  AutonomyMode,
  OperatorSettings,
  PolicyInput,
  ToolImpact,
  WritePermission,
} from '../lib/operator/types.ts';

// The Operator's authorisation rule, on its own, with nothing stubbed. decide()
// is pure by design so that the one decision that stands between a model and a
// company's tickets can be read in a minute and pinned by a table: every mode,
// every risk level, granted and not, confirmed and not.
//
// The last test here is the important one. It calls decide() with a Proxy that
// throws when anything outside PolicyInput is read, which is how "the model's
// own claims are not an input" stops being a comment and becomes a fact: if a
// later change reaches for a field a tool or a model supplied, this fails.

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

type Tool = PolicyInput['tool'];

const aTool = (over: Partial<Tool> = {}): Tool => ({
  name: 'correct_tickets',
  type: 'write',
  permission: 'tickets.correct',
  risk: 1,
  confirmation: 'conditional',
  maxRecords: 200,
  ...over,
});

const theSettings = (autonomy: AutonomyMode, granted: WritePermission[]): OperatorSettings => ({
  autonomy,
  granted,
  updated_at: null,
  updated_by: null,
});

const anImpact = (over: Partial<ToolImpact> = {}): ToolImpact => ({
  records: 1,
  touches_finalized: false,
  lines: [],
  affected: [],
  blockers: [],
  state_hash: 'state-1',
  ...over,
});

const GRANTED: WritePermission[] = ['tickets.correct'];

// ------------------------------------------------------------------ reads

void test('a read always runs, whatever the mode and whatever is granted', () => {
  for (const autonomy of ['assist', 'controlled', 'autonomous'] as const) {
    const decision = decide({
      tool: aTool({ type: 'read', permission: 'tickets.read', risk: 0, confirmation: 'never' }),
      settings: theSettings(autonomy, []),
      impact: null,
      confirmed: false,
    });
    assert.deepEqual(decision, { action: 'run' }, `a read was refused in ${autonomy} mode`);
  }
});

// ------------------------------------------------------------ permissions

void test('a write the workspace has not granted is denied in every mode', () => {
  for (const autonomy of ['assist', 'controlled', 'autonomous'] as const) {
    for (const confirmed of [false, true]) {
      for (const risk of [1, 2, 3] as const) {
        const decision = decide({
          tool: aTool({ risk }),
          settings: theSettings(autonomy, ['mileage.recalculate']),
          impact: anImpact(),
          confirmed,
        });
        assert.equal(
          decision.action,
          'deny',
          `${autonomy}/risk ${risk}/confirmed ${confirmed} allowed an ungranted write`,
        );
      }
    }
  }
});

void test('a confirmation cannot grant a permission the workspace withheld', () => {
  const decision = decide({
    tool: aTool(),
    settings: theSettings('autonomous', []),
    impact: anImpact(),
    confirmed: true,
  });
  assert.equal(decision.action, 'deny');
  assert.match(
    decision.action === 'deny' ? decision.reason : '',
    /not allowed to correct tickets/,
  );
});

// ------------------------------------------------- finalized and blockers

void test('nothing touches a finalized invoice, confirmed or not', () => {
  for (const confirmed of [false, true]) {
    for (const autonomy of ['assist', 'controlled', 'autonomous'] as const) {
      const decision = decide({
        tool: aTool(),
        settings: theSettings(autonomy, GRANTED),
        impact: anImpact({ touches_finalized: true }),
        confirmed,
      });
      assert.equal(decision.action, 'deny', `${autonomy}/confirmed ${confirmed} changed a finalized invoice`);
    }
  }
});

void test('a blocker from the dry run refuses the action, confirmed or not', () => {
  for (const confirmed of [false, true]) {
    const decision = decide({
      tool: aTool(),
      settings: theSettings('autonomous', GRANTED),
      impact: anImpact({ blockers: ['Two tickets have no customer.'] }),
      confirmed,
    });
    assert.equal(decision.action, 'deny');
    assert.equal(
      decision.action === 'deny' ? decision.reason : '',
      'Two tickets have no customer.',
      'the refusal does not say what the dry run found',
    );
  }
});

// ------------------------------------------------------- the record limits

void test('a tool is never asked to touch more records than it says it can', () => {
  const decision = decide({
    tool: aTool({ maxRecords: 10 }),
    settings: theSettings('autonomous', GRANTED),
    impact: anImpact({ records: 11 }),
    confirmed: false,
  });
  assert.equal(decision.action, 'deny');
});

void test('the record limit decides between running and asking', () => {
  const at = RUN_LIMITS.maxRecordsWithoutConfirmation;
  for (const autonomy of ['controlled', 'autonomous'] as const) {
    const under = decide({
      tool: aTool({ risk: 1 }),
      settings: theSettings(autonomy, GRANTED),
      impact: anImpact({ records: at }),
      confirmed: false,
    });
    assert.equal(under.action, 'run', `${autonomy} asked about ${at} records`);
    const over = decide({
      tool: aTool({ risk: 1 }),
      settings: theSettings(autonomy, GRANTED),
      impact: anImpact({ records: at + 1 }),
      confirmed: false,
    });
    assert.equal(over.action, 'confirm', `${autonomy} ran ${at + 1} records unattended`);
  }
});

// --------------------------------------------------------------- the table

type Case = {
  what: string;
  autonomy: AutonomyMode;
  risk: 0 | 1 | 2 | 3;
  confirmation?: Tool['confirmation'];
  granted: WritePermission[];
  records?: number;
  confirmed?: boolean;
  expect: 'run' | 'confirm' | 'deny';
};

const CASES: Case[] = [
  // assist confirms every write, however small and however safe.
  { what: 'assist, granted, risk 1', autonomy: 'assist', risk: 1, granted: GRANTED, expect: 'confirm' },
  { what: 'assist, granted, risk 2', autonomy: 'assist', risk: 2, granted: GRANTED, expect: 'confirm' },
  { what: 'assist, granted, risk 3', autonomy: 'assist', risk: 3, granted: GRANTED, expect: 'confirm' },
  { what: 'assist, not granted', autonomy: 'assist', risk: 1, granted: [], expect: 'deny' },
  { what: 'assist, confirmed', autonomy: 'assist', risk: 2, granted: GRANTED, confirmed: true, expect: 'run' },

  // controlled runs the safe, reversible writes and asks about the rest.
  { what: 'controlled, granted, risk 1', autonomy: 'controlled', risk: 1, granted: GRANTED, expect: 'run' },
  { what: 'controlled, granted, risk 2', autonomy: 'controlled', risk: 2, granted: GRANTED, expect: 'confirm' },
  { what: 'controlled, granted, risk 3', autonomy: 'controlled', risk: 3, granted: GRANTED, expect: 'confirm' },
  { what: 'controlled, not granted, risk 1', autonomy: 'controlled', risk: 1, granted: [], expect: 'deny' },
  { what: 'controlled, confirmed, risk 2', autonomy: 'controlled', risk: 2, granted: GRANTED, confirmed: true, expect: 'run' },

  // autonomous runs level 1 and 2 within the limits; level 3 is never its own.
  { what: 'autonomous, granted, risk 1', autonomy: 'autonomous', risk: 1, granted: GRANTED, expect: 'run' },
  { what: 'autonomous, granted, risk 2', autonomy: 'autonomous', risk: 2, granted: GRANTED, expect: 'run' },
  { what: 'autonomous, granted, risk 3', autonomy: 'autonomous', risk: 3, granted: GRANTED, expect: 'confirm' },
  { what: 'autonomous, granted, risk 2, 25 records', autonomy: 'autonomous', risk: 2, granted: GRANTED, records: 25, expect: 'run' },
  { what: 'autonomous, granted, risk 2, 26 records', autonomy: 'autonomous', risk: 2, granted: GRANTED, records: 26, expect: 'confirm' },
  { what: 'autonomous, not granted, risk 1', autonomy: 'autonomous', risk: 1, granted: [], expect: 'deny' },
  { what: 'autonomous, confirmed, risk 3', autonomy: 'autonomous', risk: 3, granted: GRANTED, confirmed: true, expect: 'run' },

  // A tool that declares itself 'always' is confirmed wherever it is asked.
  { what: "'always', assist", autonomy: 'assist', risk: 1, confirmation: 'always', granted: GRANTED, expect: 'confirm' },
  { what: "'always', controlled", autonomy: 'controlled', risk: 1, confirmation: 'always', granted: GRANTED, expect: 'confirm' },
  { what: "'always', autonomous", autonomy: 'autonomous', risk: 1, confirmation: 'always', granted: GRANTED, expect: 'confirm' },
];

void test('the policy table', () => {
  for (const entry of CASES) {
    const decision = decide({
      tool: aTool({ risk: entry.risk, confirmation: entry.confirmation ?? 'conditional' }),
      settings: theSettings(entry.autonomy, entry.granted),
      impact: anImpact({ records: entry.records ?? 1 }),
      confirmed: entry.confirmed ?? false,
    });
    assert.equal(decision.action, entry.expect, `${entry.what}: expected ${entry.expect}`);
  }
});

void test('a level-3 action never runs unattended, in any mode', () => {
  for (const autonomy of ['assist', 'controlled', 'autonomous'] as const) {
    for (const confirmation of ['never', 'conditional', 'always'] as const) {
      const decision = decide({
        tool: aTool({ risk: 3, confirmation }),
        settings: theSettings(autonomy, GRANTED),
        impact: anImpact(),
        confirmed: false,
      });
      assert.equal(decision.action, 'confirm', `${autonomy}/${confirmation} ran a level-3 action`);
    }
  }
});

void test('every refusal and every question says why, in a sentence', () => {
  for (const entry of CASES) {
    const decision = decide({
      tool: aTool({ risk: entry.risk, confirmation: entry.confirmation ?? 'conditional' }),
      settings: theSettings(entry.autonomy, entry.granted),
      impact: anImpact({ records: entry.records ?? 1 }),
      confirmed: entry.confirmed ?? false,
    });
    if (decision.action === 'run') continue;
    assert.ok(decision.reason.length > 10, `${entry.what}: no reason given`);
    assert.match(decision.reason, /\.$/, `${entry.what}: the reason is not a sentence`);
  }
});

void test('a permission reads as something a person would say', () => {
  assert.equal(describe('tickets.correct'), 'correct tickets');
  assert.equal(describe('mileage.recalculate'), 'recalculate mileage');
  assert.equal(describe('nonsense'), 'nonsense');
});

// ------------------------------------------- nothing else is an input

/**
 * Wraps an object so that reading any property outside the contract throws.
 * Symbols are let through: they are how the runtime inspects a value, not how
 * a rule reads a field.
 */
const only = <T extends object>(value: T, allowed: string[]): T =>
  new Proxy(value, {
    get(target, property, receiver) {
      if (typeof property === 'string' && !allowed.includes(property)) {
        throw new Error(`the policy read ${property}, which is not part of its input`);
      }
      return Reflect.get(target, property, receiver);
    },
  });

void test('the policy reads nothing but its own input', () => {
  // Every field a tool, a model or a dry run could add is off limits: the only
  // way a model influences this decision is by choosing which tool to call.
  for (const entry of CASES) {
    const tool = only(aTool({ risk: entry.risk, confirmation: entry.confirmation ?? 'conditional' }), [
      'name',
      'type',
      'permission',
      'risk',
      'confirmation',
      'maxRecords',
    ]);
    const settings = only(theSettings(entry.autonomy, entry.granted), [
      'autonomy',
      'granted',
      'updated_at',
      'updated_by',
    ]);
    const impact = only(anImpact({ records: entry.records ?? 1 }), [
      'records',
      'touches_finalized',
      'lines',
      'affected',
      'blockers',
      'state_hash',
    ]);
    const input = only({ tool, settings, impact, confirmed: entry.confirmed ?? false }, [
      'tool',
      'settings',
      'impact',
      'confirmed',
    ]);
    const decision = decide(input as PolicyInput);
    assert.equal(decision.action, entry.expect, `${entry.what}: expected ${entry.expect}`);
  }
});

// ------------------------------------------------------------ the sources

void test('the policy decides and does nothing else', () => {
  const source = read('lib/operator/policy.ts');
  assert.ok(!/\bfetch\s*\(/.test(source), 'the policy makes a network call');
  assert.ok(
    !/from '[^']*lib\/server/.test(source),
    'the policy imports the server, so it cannot be reasoned about on its own',
  );
});

void test('the Operator tables are members-only, with no way around them', () => {
  const sql = read('supabase/migrations/202609250001_operator.sql');
  assert.equal(
    (sql.match(/enable row level security/g) ?? []).length,
    4,
    'every one of the four Operator tables must have row level security on',
  );
  assert.ok(
    (sql.match(/load_desk_is_member\(workspace_id\)/g) ?? []).length >= 16,
    'each table needs a read, add, edit and delete policy checked against membership',
  );
  assert.ok(
    !/security definer/i.test(sql),
    'nothing here may run as anyone but the signed-in member',
  );
  assert.ok(!/service_role/.test(sql), 'the migration names the service role');
});

void test('the Operator store scopes every query to the workspace it was given', () => {
  const source = read('lib/server/operator/store.ts');
  const scopes = [...source.matchAll(/\.eq\('workspace_id',\s*([^)]+)\)/g)].map((m) => m[1].trim());
  assert.ok(scopes.length > 0, 'expected workspace-scoped queries');
  for (const scope of scopes) {
    assert.equal(scope, 'workspace', `a query is scoped to ${scope}, not the caller's workspace`);
  }
  const writes = [...source.matchAll(/workspace_id:\s*([^,\n]+)/g)].map((m) => m[1].trim());
  assert.ok(writes.length > 0, 'expected workspace-scoped inserts');
  for (const write of writes) {
    assert.equal(write, 'workspace', `a row is written into ${write}`);
  }
  assert.ok(!/service_role/.test(source), 'the Operator store reaches for the service role');
});

void test('a confirmation can only be taken once, and only by the person shown it', () => {
  const source = read('lib/server/operator/store.ts');
  const take = source.slice(source.indexOf('export async function takePending'));
  assert.ok(take.includes(".eq('user_id', userId)"), 'takePending does not check who is confirming');
  assert.ok(take.includes(".is('consumed_at', null)"), 'takePending does not claim the row');
  assert.ok(take.includes('consumed_at: now'), 'takePending does not mark the row taken');
});

void test('no run of the Operator stores what a model thought', () => {
  const sql = read('supabase/migrations/202609250001_operator.sql');
  for (const column of ['reasoning', 'chain_of_thought', 'thoughts', 'transcript']) {
    assert.ok(!new RegExp(`\\b${column}\\b`).test(sql), `the runs table stores ${column}`);
  }
});
