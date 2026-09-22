import type { SupabaseClient } from '@supabase/supabase-js';
import {
  AUTONOMY_MODES,
  DEFAULT_SETTINGS,
  isWritePermission,
  type ActionOutcome,
  type ActivityItem,
  type AuditEntry,
  type AutonomyMode,
  type EntityRef,
  type EntityType,
  type OperatorSettings,
  type PageContext,
  type PendingConfirmation,
  type RiskLevel,
  type RunStatus,
  type RunSummary,
  type ToolImpact,
  type Verification,
  type WritePermission,
} from '@/lib/operator/types';
import { StoreError } from '@/lib/server/load-desk-store';

// Supabase storage for the Monius Operator: the runs, the audit trail every
// write leaves behind, the confirmations waiting on a person, and how far the
// workspace lets the Operator go on its own.
//
// Every function is given the workspace of the person making the request —
// there is no default and no global to fall back to — and runs as the signed-in
// user, so row level security enforces the same boundary a second time. There
// is no service role anywhere in this app, and the Operator is not the place to
// introduce one: the agent can reach exactly what the person driving it can.
//
// Nothing here stores reasoning. A run keeps tool names, one-line summaries,
// the entities it touched and how it ended; an action keeps the fields that
// changed, bounded, and what was re-read afterwards. That is what an audit is:
// a record of what the app did, not a transcript of what a model thought.

const unavailable = (what: string) =>
  new StoreError(`Could not ${what}. Please try again.`, 503);

const RUN_COLUMNS =
  'id, user_id, request, context, status, started_at, finished_at, activity, entities, summary, error, tool_calls, writes';

const ACTION_COLUMNS =
  'id, run_id, user_id, tool, risk, confirmation, entity_type, entity_id, before, after, reason, outcome, verification, at';

const PENDING_COLUMNS =
  'id, run_id, user_id, tool, input, impact, risk, reason, expires_at';

/** The most runs and actions one listing will return, however many are asked for. */
const MAX_RUNS = 50;
const MAX_ACTIONS = 100;

/** What one run may keep of itself: the tail of the activity and a short line. */
const MAX_ACTIVITY_ITEMS = 50;
const MAX_SUMMARY_CHARS = 500;
/** The most entities one run names. A confirmation adds to the list it left. */
const MAX_RUN_ENTITIES = 100;

/**
 * How much of a before/after snapshot an audit row may hold. The audit answers
 * "what changed", not "what was there": a whole ticket in every row would turn
 * the trail into a second copy of the business, and the fields a tool reports
 * are the fields a person needs to see. Measured in characters of JSON, which
 * keeps each side under four kilobytes for anything the tools write.
 */
const MAX_SNAPSHOT_CHARS = 4_000;

// --------------------------------------------------------------- reading

const str = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;
const nullableStr = (value: unknown): string | null =>
  typeof value === 'string' && value !== '' ? value : null;
const num = (value: unknown): number => (typeof value === 'number' ? value : Number(value) || 0);
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const readStatus = (value: unknown): RunStatus => {
  const status = str(value);
  return status === 'completed' ||
    status === 'awaiting_confirmation' ||
    status === 'failed' ||
    status === 'limited'
    ? status
    : 'running';
};

const readRisk = (value: unknown): RiskLevel => {
  const risk = num(value);
  return risk === 1 || risk === 2 || risk === 3 ? risk : 0;
};

const readOutcome = (value: unknown): ActionOutcome => {
  const outcome = str(value);
  return outcome === 'partial' || outcome === 'failed' || outcome === 'refused' ? outcome : 'done';
};

const readEntities = (value: unknown): EntityRef[] =>
  list(value).map((entry) => {
    const row = (entry ?? {}) as Record<string, unknown>;
    return {
      type: str(row.type, 'ticket') as EntityType,
      id: str(row.id),
      label: str(row.label),
      href: nullableStr(row.href),
    };
  });

const readActivity = (value: unknown): ActivityItem[] =>
  list(value).map((entry) => {
    const row = (entry ?? {}) as Record<string, unknown>;
    const kind = str(row.kind, 'read');
    return {
      at: str(row.at),
      tool: str(row.tool),
      kind: kind === 'write' || kind === 'denied' || kind === 'confirm' ? kind : 'read',
      summary: str(row.summary),
    };
  });

const readObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const readVerification = (value: unknown): Verification => {
  const row = readObject(value);
  return {
    checked: num(row.checked),
    passed: num(row.passed),
    failures: list(row.failures).map((entry) => str(entry)),
  };
};

const readImpact = (value: unknown): ToolImpact => {
  const row = readObject(value);
  return {
    records: num(row.records),
    touches_finalized: row.touches_finalized === true,
    lines: list(row.lines).map((entry) => str(entry)),
    affected: readEntities(row.affected),
    blockers: list(row.blockers).map((entry) => str(entry)),
    state_hash: str(row.state_hash),
  };
};

/**
 * Cuts a before/after snapshot down to something an audit row can hold. A value
 * that fits is stored as it came; one that does not is replaced by a marked,
 * truncated rendering of it, so a reader can see both what was there and that
 * they are not seeing all of it.
 */
const snapshot = (value: unknown): unknown => {
  if (value === undefined || value === null) return null;
  let text: string;
  try {
    text = JSON.stringify(value) ?? 'null';
  } catch {
    return { truncated: true, note: 'This value could not be recorded.' };
  }
  if (text.length <= MAX_SNAPSHOT_CHARS) return value;
  return { truncated: true, preview: `${text.slice(0, MAX_SNAPSHOT_CHARS)}…` };
};

// -------------------------------------------------------------- run rows

// The one client-visible run shape lives in lib/operator/types.ts, beside the
// response it is part of; it is re-exported here so a caller that reads runs
// from this store need not know which of the two files to ask.
export type { RunSummary };

/** One run in full, as the panel reopens it. */
export type RunDetail = RunSummary & {
  context: PageContext | null;
  activity: ActivityItem[];
};

/** One audit row as it is read back, with the person and the row's own id. */
export type ActionRecord = AuditEntry & { id: number; user_id: string };

const readRun = (row: Record<string, unknown>): RunDetail => ({
  id: str(row.id),
  user_id: str(row.user_id),
  request: str(row.request),
  status: readStatus(row.status),
  started_at: str(row.started_at),
  finished_at: nullableStr(row.finished_at),
  summary: str(row.summary),
  entities: readEntities(row.entities),
  error: nullableStr(row.error),
  tool_calls: num(row.tool_calls),
  writes: num(row.writes),
  context: row.context ? (readObject(row.context) as unknown as PageContext) : null,
  activity: readActivity(row.activity),
});

const readAction = (row: Record<string, unknown>): ActionRecord => ({
  id: num(row.id),
  run_id: str(row.run_id),
  user_id: str(row.user_id),
  tool: str(row.tool),
  risk: readRisk(row.risk),
  confirmation: str(row.confirmation) === 'confirmed' ? 'confirmed' : 'auto',
  entity_type: (nullableStr(row.entity_type) as EntityType | null),
  entity_id: nullableStr(row.entity_id),
  before: row.before ?? null,
  after: row.after ?? null,
  reason: str(row.reason),
  outcome: readOutcome(row.outcome),
  verification: readVerification(row.verification),
  at: str(row.at),
});

const readPending = (row: Record<string, unknown>): PendingConfirmation => ({
  id: str(row.id),
  run_id: str(row.run_id),
  tool: str(row.tool),
  input: readObject(row.input),
  impact: readImpact(row.impact),
  risk: readRisk(row.risk),
  reason: str(row.reason),
  expires_at: str(row.expires_at),
});

// -------------------------------------------------------------- settings

/**
 * How far the Operator may go in this workspace. A workspace that has never
 * opened the settings screen has no row, and gets the defaults — assist, with
 * nothing granted. Reading does not write: a row appears when a person decides
 * something, not when the panel is opened.
 */
export async function getSettings(
  client: SupabaseClient,
  workspace: string,
): Promise<OperatorSettings> {
  const { data, error } = await client
    .from('load_desk_operator_settings')
    .select('autonomy, granted, updated_at, updated_by')
    .eq('workspace_id', workspace)
    .maybeSingle();
  if (error) throw unavailable('load the Operator settings');
  if (!data) return { ...DEFAULT_SETTINGS, granted: [] };
  const row = data as Record<string, unknown>;
  const autonomy = str(row.autonomy) as AutonomyMode;
  return {
    autonomy: AUTONOMY_MODES.includes(autonomy) ? autonomy : DEFAULT_SETTINGS.autonomy,
    granted: list(row.granted)
      .map((entry) => str(entry))
      .filter((entry): entry is WritePermission => isWritePermission(entry)),
    updated_at: nullableStr(row.updated_at),
    updated_by: nullableStr(row.updated_by),
  };
}

/**
 * Changes the settings, having checked that what is asked for exists. An
 * unknown autonomy mode or a permission that is not one of ours is refused
 * rather than stored: the enforcement side reads this row and trusts it, so
 * anything that reaches it has to have been through here.
 *
 * Fields left out of the patch keep their current values, which is what lets
 * the settings screen send a single change. Two people saving at the same
 * moment is last-write-wins, and the row records who it was.
 */
export async function putSettings(
  client: SupabaseClient,
  workspace: string,
  patch: { autonomy?: AutonomyMode; granted?: WritePermission[] },
  userId: string,
): Promise<OperatorSettings> {
  const current = await getSettings(client, workspace);
  let autonomy = current.autonomy;
  if (patch.autonomy !== undefined) {
    if (!AUTONOMY_MODES.includes(patch.autonomy)) {
      throw new StoreError('Choose assist, controlled or autonomous.', 400);
    }
    autonomy = patch.autonomy;
  }
  let granted = current.granted;
  if (patch.granted !== undefined) {
    const chosen: WritePermission[] = [];
    for (const entry of patch.granted) {
      if (typeof entry !== 'string' || !isWritePermission(entry)) {
        throw new StoreError('That is not something the Operator can be allowed to do.', 400);
      }
      if (!chosen.includes(entry)) chosen.push(entry);
    }
    granted = chosen;
  }
  const updatedAt = new Date().toISOString();
  const { error } = await client.from('load_desk_operator_settings').upsert(
    {
      workspace_id: workspace,
      autonomy,
      granted,
      updated_at: updatedAt,
      updated_by: userId,
    },
    { onConflict: 'workspace_id' },
  );
  if (error) throw unavailable('save the Operator settings');
  return { autonomy, granted, updated_at: updatedAt, updated_by: userId };
}

// ------------------------------------------------------------------ runs

/** Opens a run: one row, written before the model is asked anything. */
export async function createRun(
  client: SupabaseClient,
  workspace: string,
  run: {
    id: string;
    user_id: string;
    request: string;
    context: PageContext | null;
    started_at: string;
  },
): Promise<void> {
  const { error } = await client.from('load_desk_agent_runs').insert({
    id: run.id,
    workspace_id: workspace,
    user_id: run.user_id,
    request: run.request.slice(0, 4_000),
    context: run.context,
    status: 'running' satisfies RunStatus,
    started_at: run.started_at,
  });
  if (error) throw unavailable('start the run');
}

/**
 * Closes a run with what it did. The activity is kept to its last fifty lines
 * and the summary to five hundred characters: a run that called a dozen tools
 * has a dozen lines, and anything longer than that is a bug rather than a
 * history worth storing.
 */
export async function finishRun(
  client: SupabaseClient,
  workspace: string,
  runId: string,
  patch: {
    status: RunStatus;
    finished_at: string;
    activity: ActivityItem[];
    entities: EntityRef[];
    summary: string;
    error: string | null;
    tool_calls: number;
    writes: number;
  },
): Promise<void> {
  const { error } = await client
    .from('load_desk_agent_runs')
    .update({
      status: patch.status,
      finished_at: patch.finished_at,
      activity: patch.activity.slice(-MAX_ACTIVITY_ITEMS),
      entities: patch.entities,
      summary: patch.summary.slice(0, MAX_SUMMARY_CHARS),
      error: patch.error === null ? null : patch.error.slice(0, 1_000),
      tool_calls: patch.tool_calls,
      writes: patch.writes,
    })
    .eq('workspace_id', workspace)
    .eq('id', runId);
  if (error) throw unavailable('finish the run');
}

/**
 * Adds what a confirmation did to the run that asked for it.
 *
 * A run that stopped to ask a person something was already finished once, at
 * `awaiting_confirmation`, and the work happened afterwards on a request of
 * its own. Without this the run log would say for ever that the Operator
 * asked and nothing came of it. The row is read first and appended to rather
 * than replaced, so the reads that led up to the question are still there
 * under the change that answered it.
 */
export async function appendToRun(
  client: SupabaseClient,
  workspace: string,
  runId: string,
  patch: {
    status: RunStatus;
    activity: ActivityItem[];
    entities: EntityRef[];
    summary: string;
    writes: number;
  },
): Promise<void> {
  const existing = await client
    .from('load_desk_agent_runs')
    .select('activity, entities, writes')
    .eq('workspace_id', workspace)
    .eq('id', runId)
    .maybeSingle();
  if (existing.error) throw unavailable('load the run');
  const row = (existing.data ?? {}) as Record<string, unknown>;

  const activity = [...readActivity(row.activity), ...patch.activity].slice(-MAX_ACTIVITY_ITEMS);
  const entities: EntityRef[] = [];
  const seen = new Set<string>();
  for (const entity of [...readEntities(row.entities), ...patch.entities]) {
    const key = `${entity.type}:${entity.id}`;
    if (seen.has(key) || entities.length >= MAX_RUN_ENTITIES) continue;
    seen.add(key);
    entities.push(entity);
  }

  const { error } = await client
    .from('load_desk_agent_runs')
    .update({
      status: patch.status,
      finished_at: new Date().toISOString(),
      activity,
      entities,
      summary: patch.summary.slice(0, MAX_SUMMARY_CHARS),
      writes: num(row.writes) + patch.writes,
    })
    .eq('workspace_id', workspace)
    .eq('id', runId);
  if (error) throw unavailable('close the run');
}

/** The workspace's runs, newest first. */
export async function listRuns(
  client: SupabaseClient,
  workspace: string,
  limit = MAX_RUNS,
): Promise<RunSummary[]> {
  const { data, error } = await client
    .from('load_desk_agent_runs')
    .select(RUN_COLUMNS)
    .eq('workspace_id', workspace)
    .order('started_at', { ascending: false })
    .limit(Math.max(1, Math.min(limit, MAX_RUNS)));
  if (error) throw unavailable('load the Operator runs');
  return (data ?? []).map((row) => readRun(row as Record<string, unknown>));
}

/** One run in full, or null when this workspace has no such run. */
export async function getRun(
  client: SupabaseClient,
  workspace: string,
  runId: string,
): Promise<RunDetail | null> {
  const { data, error } = await client
    .from('load_desk_agent_runs')
    .select(RUN_COLUMNS)
    .eq('workspace_id', workspace)
    .eq('id', runId)
    .maybeSingle();
  if (error) throw unavailable('load the run');
  return data ? readRun(data as Record<string, unknown>) : null;
}

// ----------------------------------------------------------------- audit

/**
 * The row a write leaves behind. This throws when it cannot be written, and
 * that is deliberate: an unaudited write is worse than a failed run. The
 * engine decides what to do about it — stop, refuse further writes, tell the
 * person — but it is never left believing the trail is complete when it is not.
 */
export async function recordAction(
  client: SupabaseClient,
  workspace: string,
  entry: AuditEntry & { user_id: string },
): Promise<void> {
  const { error } = await client.from('load_desk_agent_actions').insert({
    workspace_id: workspace,
    run_id: entry.run_id,
    user_id: entry.user_id,
    tool: entry.tool.slice(0, 80),
    risk: entry.risk,
    confirmation: entry.confirmation,
    entity_type: entry.entity_type,
    entity_id: entry.entity_id === null ? null : entry.entity_id.slice(0, 200),
    before: snapshot(entry.before),
    after: snapshot(entry.after),
    reason: entry.reason.slice(0, 1_000),
    outcome: entry.outcome,
    verification: entry.verification,
    at: entry.at,
  });
  if (error) throw new StoreError('Could not record what the Operator did.', 503);
}

/** The audit trail, newest first, for the workspace or for one run of it. */
export async function listActions(
  client: SupabaseClient,
  workspace: string,
  options: { runId?: string; limit?: number } = {},
): Promise<ActionRecord[]> {
  let query = client
    .from('load_desk_agent_actions')
    .select(ACTION_COLUMNS)
    .eq('workspace_id', workspace);
  if (options.runId !== undefined) query = query.eq('run_id', options.runId);
  const { data, error } = await query
    .order('at', { ascending: false })
    .order('id', { ascending: false })
    .limit(Math.max(1, Math.min(options.limit ?? MAX_ACTIONS, MAX_ACTIONS)));
  if (error) throw unavailable('load what the Operator did');
  return (data ?? []).map((row) => readAction(row as Record<string, unknown>));
}

// --------------------------------------------------------- confirmations

/** Puts a proposed write where the confirm route can find it, and nowhere else. */
export async function createPending(
  client: SupabaseClient,
  workspace: string,
  pending: PendingConfirmation & { user_id: string },
): Promise<void> {
  const { error } = await client.from('load_desk_agent_pending').insert({
    id: pending.id,
    workspace_id: workspace,
    run_id: pending.run_id,
    user_id: pending.user_id,
    tool: pending.tool.slice(0, 80),
    input: pending.input,
    impact: pending.impact,
    risk: pending.risk,
    reason: pending.reason.slice(0, 1_000),
    expires_at: pending.expires_at,
  });
  if (error) throw unavailable('save the action for you to confirm');
}

/**
 * Takes a confirmation, once. The row must belong to this workspace, must be
 * the one this person was shown, must not have been taken already and must not
 * have expired; taking it marks it consumed in the same statement that claims
 * it, with `.is('consumed_at', null)` as the claim, and the update is asked to
 * return the row so that a claim which changed nothing is visible as a miss.
 *
 * What remains is one narrow race: the same person confirming the same action
 * twice inside the window between the claim and the database applying it. One
 * of the two updates matches no row, so the second caller is handed null and
 * the action does not happen twice. That is the property that matters, and it
 * holds without a transaction or a stored procedure — neither of which this
 * app has anywhere, and neither of which is worth introducing for a button a
 * person presses once.
 */
export async function takePending(
  client: SupabaseClient,
  workspace: string,
  id: string,
  userId: string,
): Promise<PendingConfirmation | null> {
  const now = new Date().toISOString();
  const { data: found, error: findError } = await client
    .from('load_desk_agent_pending')
    .select('id')
    .eq('workspace_id', workspace)
    .eq('id', id)
    .eq('user_id', userId)
    .is('consumed_at', null)
    .gt('expires_at', now)
    .maybeSingle();
  if (findError) throw unavailable('load the action you confirmed');
  if (!found) return null;

  const { data: claimed, error: claimError } = await client
    .from('load_desk_agent_pending')
    .update({ consumed_at: now })
    .eq('workspace_id', workspace)
    .eq('id', id)
    .eq('user_id', userId)
    .is('consumed_at', null)
    .select(PENDING_COLUMNS);
  if (claimError) throw unavailable('confirm the action');
  const rows = claimed ?? [];
  if (rows.length === 0) return null;
  return readPending(rows[0] as Record<string, unknown>);
}

// ------------------------------------------------------------ the engine

/**
 * What the run engine consumes, gathered into one object so that the engine
 * can be handed a different implementation in a test without knowing that
 * Supabase exists. The functions above are the same functions; this is only
 * the shape the engine holds them in.
 */
export type RunStore = {
  getSettings(client: SupabaseClient, workspace: string): Promise<OperatorSettings>;
  createRun(
    client: SupabaseClient,
    workspace: string,
    run: {
      id: string;
      user_id: string;
      request: string;
      context: PageContext | null;
      started_at: string;
    },
  ): Promise<void>;
  finishRun(
    client: SupabaseClient,
    workspace: string,
    runId: string,
    patch: {
      status: RunStatus;
      finished_at: string;
      activity: ActivityItem[];
      entities: EntityRef[];
      summary: string;
      error: string | null;
      tool_calls: number;
      writes: number;
    },
  ): Promise<void>;
  recordAction(
    client: SupabaseClient,
    workspace: string,
    entry: AuditEntry & { user_id: string },
  ): Promise<void>;
  createPending(
    client: SupabaseClient,
    workspace: string,
    pending: PendingConfirmation & { user_id: string },
  ): Promise<void>;
  appendToRun(
    client: SupabaseClient,
    workspace: string,
    runId: string,
    patch: {
      status: RunStatus;
      activity: ActivityItem[];
      entities: EntityRef[];
      summary: string;
      writes: number;
    },
  ): Promise<void>;
  takePending(
    client: SupabaseClient,
    workspace: string,
    id: string,
    userId: string,
  ): Promise<PendingConfirmation | null>;
};

export const runStore: RunStore = {
  getSettings,
  createRun,
  finishRun,
  appendToRun,
  recordAction,
  createPending,
  takePending,
};
