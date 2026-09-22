import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ActionOutcome,
  EntityRef,
  ToolContext,
  ToolDefinition,
  ToolDeps,
  Verification,
} from '@/lib/operator/types';
import type { WorkspaceUser } from '@/lib/server/auth';
import { otherEventKind } from '@/lib/server/rates-engine';
import { appendEvent } from '@/lib/server/rates-store';
import type { RoutingProvider } from '@/lib/server/routing-provider';

// What every write tool needs and none of them should write twice: the narrow
// view of the dependencies the engine hands over, the parsers that refuse a
// model's arguments before anything is read, the fingerprint a confirmation is
// measured against, and the two ways an action reports itself — the
// verification it did and the line it leaves in the activity trail.
//
// Nothing here touches a business table. Every write in this folder goes
// through an existing service, and the only insert this file knows about is
// the trail's own, through `appendEvent`.

/** The dependencies as a server tool uses them, narrowed once. */
export type ActionDeps = {
  client: SupabaseClient;
  routing: RoutingProvider | null;
};

/**
 * The engine's `ToolDeps` is deliberately loose, so that lib/operator/types.ts
 * stays isomorphic and imports no server module. Narrowing it is the server
 * side's job, and this is the one place that does it.
 */
export const deps = (given: ToolDeps): ActionDeps => ({
  client: given.client as SupabaseClient,
  routing: (given.routing ?? null) as RoutingProvider | null,
});

/**
 * A tool written against its own argument type, put into the registry's list.
 *
 * `ToolDefinition` defaults its input to a plain record, which is what the
 * registry holds, but a tool that parsed its arguments into a shape and then
 * read them back as `unknown` would be checking the same thing twice and
 * getting it wrong once. `parse` is the only thing that ever produces the
 * input the handler is given, so the two agree at runtime by construction.
 */
export const defineAction = <Input>(definition: ToolDefinition<Input>): ToolDefinition =>
  definition as unknown as ToolDefinition;

// ------------------------------------------------------------------ parsers

export type Parsed<T> = { value: T } | { error: string };

export const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/** A saved row's id: a whole number above zero, and nothing else. */
export const rowId = (value: unknown): number | null =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0 ? value : null;

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const isoDate = (value: unknown): string | null =>
  typeof value === 'string' &&
  ISO_DATE.test(value) &&
  !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
    ? value
    : null;

/** A trimmed line of text within a cap, or null for anything else. */
export const shortText = (value: unknown, max: number): string | null =>
  typeof value === 'string' && value.trim() && value.length <= max ? value.trim() : null;

// ------------------------------------------------------------------- dates

const DAY_MS = 86_400_000;
const pad2 = (value: number) => String(value).padStart(2, '0');

export const isoOf = (date: Date) =>
  `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;

export const addDays = (date: string, days: number) =>
  isoOf(new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS));

export const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);

/**
 * A bounded window around the days a set of tickets falls on, for the reads
 * that need neighbours — the workspace's memory, an invoice's other lines.
 * Tickets with no readable day fall back to the window around today, because a
 * read that cannot be bounded must not become a read of everything.
 */
export function windowAround(days: (string | null)[], now: Date, pad = 30) {
  const known = days.filter((day): day is string => Boolean(day)).sort();
  const first = known[0] ?? isoOf(now);
  const last = known.at(-1) ?? isoOf(now);
  return { from: addDays(first, -pad), to: addDays(last, pad) };
}

// -------------------------------------------------------------- state hash

/**
 * A fingerprint of the state a preview was taken from.
 *
 * djb2 over the JSON of whatever the tool considers its inputs. It has one
 * job: to differ when the world has moved. A dry run therefore folds in the
 * marks that change when a record is written — `edited_at`, `saved_at`, a
 * request's `updated_at` — so a confirmation pressed after somebody else
 * edited the same ticket does not act on a preview that no longer holds.
 */
export function stateHash(parts: unknown[]): string {
  const text = JSON.stringify(parts);
  let hash = 5381;
  for (let at = 0; at < text.length; at += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(at)) | 0;
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

// ------------------------------------------------------------ verification

/** What the re-read found, in the shape the audit row keeps. */
export const verifyAll = (checks: { label: string; ok: boolean }[]): Verification => ({
  checked: checks.length,
  passed: checks.filter((check) => check.ok).length,
  failures: checks.filter((check) => !check.ok).map((check) => check.label),
});

export const nothingVerified = (): Verification => ({ checked: 0, passed: 0, failures: [] });

/**
 * The outcome the three lists add up to. A write that changed nothing because
 * everything was refused is 'refused'; one that changed some of what it meant
 * to is 'partial', whatever the service answered.
 */
export function settle(
  succeeded: EntityRef[],
  failed: { entity: EntityRef; reason: string }[],
  notAttempted: EntityRef[],
): ActionOutcome {
  if (failed.length) return succeeded.length ? 'partial' : 'failed';
  if (succeeded.length) return notAttempted.length ? 'partial' : 'done';
  return notAttempted.length ? 'refused' : 'done';
}

// ------------------------------------------------------------------- trail

/** The member shape the existing services want, built from the run's context. */
export const memberOf = (ctx: ToolContext): WorkspaceUser => ({
  id: ctx.userId,
  email: null,
  name: null,
  phone: null,
  createdAt: null,
  lastSignInAt: null,
  memberSince: null,
  workspaceId: ctx.workspaceId,
  avatarVersion: null,
  locale: null,
});

/** The trail is read by people, so the line is a sentence and not a blob. */
const MAX_DETAIL = 500;

/**
 * One line in the existing activity trail for a thing the Operator did.
 *
 * The trail is where the desk already looks to find out what happened to an
 * invoice, and Operator work belongs in it beside everything else rather than
 * in a log of its own. The line names the tool, the run it belonged to and the
 * records it touched, so a change can be traced back to the turn that asked
 * for it — and never any reasoning, which is not stored anywhere.
 *
 * A trail that cannot be written does not undo the work that was already done,
 * so the failure is reported and the action's own result stands.
 */
export async function recordAction(
  client: SupabaseClient,
  workspace: string,
  ctx: ToolContext,
  entry: {
    tool: string;
    summary: string;
    affected: (string | number)[];
    customerId?: number | null;
    requestId?: number | null;
    invoiceKey?: string | null;
  },
): Promise<void> {
  const affected = entry.affected.length ? ` Affected: ${entry.affected.join(', ')}.` : '';
  const detail =
    `Monius Operator ran ${entry.tool} (origin ${ctx.origin}, run ${ctx.runId}). ` +
    `${entry.summary}${affected}`;
  try {
    await appendEvent(client, workspace, {
      kind: otherEventKind('OPERATOR_ACTION'),
      customer_profile_id: entry.customerId ?? null,
      request_id: entry.requestId ?? null,
      response_id: null,
      period_id: null,
      invoice_key: entry.invoiceKey ?? null,
      detail: detail.slice(0, MAX_DETAIL),
      // Nobody pressed a button: the Operator acted under a person's settings,
      // and the run id is what leads back to the turn that asked.
      actor: null,
    });
  } catch (error) {
    console.error(
      'Operator: the activity trail could not be written',
      error instanceof Error ? error.message : 'unknown',
    );
  }
}

// ------------------------------------------------------------------ wording

export const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? '' : 's'}`;
