import type { SupabaseClient } from '@supabase/supabase-js';
import { dedupeEntities, isEntityType } from '@/lib/operator/entities';
import { RUN_LIMITS } from '@/lib/operator/limits';
import { decide } from '@/lib/operator/policy';
import type { Registry } from '@/lib/operator/registry';
import type {
  ActionResult,
  ActivityItem,
  AuditEntry,
  EntityRef,
  OperatorRequest,
  OperatorResponse,
  OperatorSettings,
  OperatorTurn,
  PageContext,
  PendingConfirmation,
  ReadResult,
  RunStatus,
  ToolContext,
  ToolDeps,
  ToolDefinition,
  ToolImpact,
  Verification,
} from '@/lib/operator/types';
import { recordAiUsage } from '@/lib/server/ai-usage';
import { StoreError } from '@/lib/server/load-desk-store';
import { buildInstructions } from './prompt.ts';
import type { AgentModel, ModelMessage, ModelResponse } from './provider.ts';

// The run engine: one person's sentence turned into a bounded, audited,
// policy-checked piece of work.
//
// Everything the Operator is allowed to be happens here. The model proposes
// tool calls; this decides whether each one may run, runs it through the tool's
// own parser and the workspace's own policy, records what happened, and stops
// the moment a limit says so. A model that is confident, confused or adversarial
// reaches exactly the same checks, because none of them read anything the model
// said: the workspace comes from the signed-in member, the arguments come back
// through the tool's parser, and the decision comes from the registered facts
// and the dry run's figures.
//
// The engine takes its model, its store and its snapshot as dependencies rather
// than importing them, which is what lets the whole of it be tested against a
// scripted model and an in-memory store, with no network and no database.
//
// Nothing of the model's reasoning is kept. A run stores tool names, one-line
// summaries, the entities it touched, the outcome, and the first part of the
// reply a person actually read.

/**
 * Where a run's facts are kept. Implemented in ./store.ts against the database;
 * declared here so the engine depends on the shape and not the module.
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
  /** Returns the pending action and marks it consumed; null if missing, expired or taken. */
  takePending(
    client: SupabaseClient,
    workspace: string,
    id: string,
    userId: string,
  ): Promise<PendingConfirmation | null>;
};

export type RunDeps = {
  client: SupabaseClient;
  member: { workspaceId: string; id: string };
  registry: Registry;
  model: AgentModel;
  store: RunStore;
  /** The routing provider, passed straight through to the tools that need it. */
  routing: unknown;
  snapshot: (client: SupabaseClient, workspace: string) => Promise<string | null>;
  now?: () => Date;
};

/** The registered facts policy reads. Never the handler, never the model's words. */
const facts = (tool: ToolDefinition) => ({
  name: tool.name,
  type: tool.type,
  permission: tool.permission,
  risk: tool.risk,
  confirmation: tool.confirmation,
  maxRecords: tool.maxRecords,
});

/**
 * A tool's data as the model is shown it. A result that will not serialise is
 * a bug in a tool, not a reason to lose the run, so it says so and carries on.
 */
function resultText(data: unknown): string {
  let json: string | undefined;
  try {
    json = JSON.stringify(data);
  } catch {
    return 'That tool returned something that could not be read back.';
  }
  if (json === undefined) return 'null';
  return json.length <= RUN_LIMITS.maxToolResultChars
    ? json
    : `${json.slice(0, RUN_LIMITS.maxToolResultChars)} … [truncated]`;
}

/** What a write verified, in one sentence a person and a model can both read. */
export function verificationSentence(verification: Verification): string {
  if (verification.checked === 0) return 'There was nothing left to check.';
  if (verification.failures.length) {
    return `Verified ${verification.passed} of ${verification.checked} checks; ${verification.failures[0]}`;
  }
  return `Verified all ${verification.checked} checks.`;
}

/** A user-facing reason, when the failure carried one, and nothing else ever. */
const plainReason = (error: unknown, fallback: string): string =>
  error instanceof StoreError ? error.message : fallback;

/** The request, cut down to what a run is allowed to carry. */
function bounded(request: OperatorRequest): {
  message: string;
  history: OperatorTurn[];
  context: PageContext | null;
} {
  const message = typeof request.message === 'string' ? request.message.trim() : '';
  if (!message) throw new StoreError('Ask the Operator something.', 400);
  if (message.length > RUN_LIMITS.maxMessageChars) {
    throw new StoreError('That message is too long for one turn.', 400);
  }
  const turns = Array.isArray(request.history) ? request.history : [];
  const history = turns
    .slice(-RUN_LIMITS.maxHistoryTurns)
    .filter((turn) => turn && (turn.role === 'user' || turn.role === 'operator'))
    .map((turn) => ({
      role: turn.role,
      text: String(turn.text ?? '').slice(0, RUN_LIMITS.maxMessageChars),
    }));
  const given = request.context;
  const context: PageContext | null = given
    ? {
        page: String(given.page ?? '').slice(0, 200),
        // An entity of a type this build does not know is no entity at all,
        // rather than a page parameter nothing will ever honour.
        entity: given.entity && isEntityType(given.entity.type) ? given.entity : null,
      }
    : null;
  return { message, history, context };
}

/**
 * One turn of the Operator.
 *
 * Reads run. Writes are previewed, put to the policy, and then either run and
 * audited or held as a pending confirmation for the person to press. The run
 * ends on the model's own answer, on a limit, or on a confirmation — and in
 * every one of those cases it is written to the run log before it returns.
 */
export async function runOperator(
  deps: RunDeps,
  request: OperatorRequest,
): Promise<OperatorResponse> {
  const now = deps.now ?? (() => new Date());
  const { client, registry, store } = deps;
  const workspace = deps.member.workspaceId;
  const userId = deps.member.id;
  const { message, history, context } = bounded(request);

  const runId = crypto.randomUUID();
  const startedAt = now();
  const toolDeps: ToolDeps = { client, routing: deps.routing };
  const activity: ActivityItem[] = [];
  const entities: EntityRef[] = [];
  const actions: ActionResult[] = [];

  let status: RunStatus = 'running';
  let text = '';
  let limited: string | null = null;
  let pending: PendingConfirmation | null = null;
  let failure: string | null = null;
  let toolCalls = 0;
  let writes = 0;

  await store.createRun(client, workspace, {
    id: runId,
    user_id: userId,
    request: message,
    context,
    started_at: startedAt.toISOString(),
  });

  // One deadline for the whole run, so a slow model call is cut short rather
  // than leaving a person watching a spinner past the limit they were promised.
  const deadline = new AbortController();
  const timer = setTimeout(() => deadline.abort(), RUN_LIMITS.maxRunMs);

  try {
    const settings = await store.getSettings(client, workspace);
    let snapshot: string | null = null;
    try {
      snapshot = await deps.snapshot(client, workspace);
    } catch {
      // A snapshot is context, not the answer. A run without one still runs.
      snapshot = null;
    }
    const instructions = buildInstructions({ snapshot, context, settings, now: startedAt });

    const transcript: ModelMessage[] = [
      ...history.map((turn) => ({
        role: turn.role === 'user' ? ('user' as const) : ('assistant' as const),
        text: turn.text,
      })),
      { role: 'user' as const, text: message },
    ];

    for (let turn = 0; turn < RUN_LIMITS.maxModelTurns; turn++) {
      if (now().getTime() - startedAt.getTime() > RUN_LIMITS.maxRunMs) {
        status = 'limited';
        limited = 'The Operator ran out of time on this one.';
        break;
      }

      let answer: ModelResponse;
      try {
        answer = await deps.model.respond(
          { instructions, input: transcript, tools: registry.specs() },
          deadline.signal,
        );
      } catch {
        console.error('Operator: the model call failed', deps.model.name);
        status = 'failed';
        failure = 'The model could not be reached.';
        if (!text) text = 'I could not reach the model just now. Please try that again.';
        break;
      }

      recordAiUsage({
        userId,
        workspaceId: workspace,
        requestType: 'operator-turn',
        model: answer.model,
        inputTokens: answer.usage.input,
        outputTokens: answer.usage.output,
        at: now().toISOString(),
      });

      if (answer.text) text = answer.text;
      if (!answer.toolCalls.length) {
        status = 'completed';
        break;
      }
      transcript.push({
        role: 'assistant',
        text: answer.text ?? undefined,
        tool_calls: answer.toolCalls,
      });

      let stop = false;
      for (const call of answer.toolCalls) {
        const reply = (output: string) =>
          transcript.push({
            role: 'tool' as const,
            tool_call_id: call.id,
            name: call.name,
            text: output,
          });

        if (toolCalls >= RUN_LIMITS.maxToolCalls) {
          status = 'limited';
          limited = `The Operator reached the limit of ${RUN_LIMITS.maxToolCalls} tool calls.`;
          stop = true;
          break;
        }
        toolCalls += 1;

        const tool = registry.get(call.name);
        if (!tool) {
          reply('Unknown tool. It is not one of the tools you were given.');
          continue;
        }

        let args: unknown;
        try {
          args = call.arguments.trim() ? JSON.parse(call.arguments) : {};
        } catch {
          reply('Those arguments were not valid JSON.');
          continue;
        }
        // The tool's own parser is the only thing that turns the model's words
        // into a value anything else will see.
        const parsed = tool.parse(args);
        if ('error' in parsed) {
          reply(`Those arguments were not accepted: ${parsed.error}`);
          continue;
        }

        const ctx: ToolContext = {
          workspaceId: workspace,
          userId,
          runId,
          origin: 'operator',
          now: now(),
        };

        if (tool.type === 'read') {
          const decision = decide({ tool: facts(tool), settings, impact: null, confirmed: false });
          if (decision.action !== 'run') {
            activity.push({ at: ctx.now.toISOString(), tool: tool.name, kind: 'denied', summary: decision.reason });
            reply(`Refused: ${decision.reason}`);
            continue;
          }
          try {
            const result = (await tool.handler(parsed.value, ctx, toolDeps)) as ReadResult;
            entities.push(...(result.entities ?? []));
            activity.push({
              at: ctx.now.toISOString(),
              tool: tool.name,
              kind: 'read',
              summary: result.summary,
            });
            reply(resultText(result.data));
          } catch (error) {
            console.error('Operator: a read tool failed', tool.name);
            reply(`That read did not work: ${plainReason(error, 'the tool failed.')}`);
          }
          continue;
        }

        // ------------------------------------------------------------ a write
        if (writes >= RUN_LIMITS.maxWrites) {
          status = 'limited';
          limited = `The Operator reached the limit of ${RUN_LIMITS.maxWrites} changes in one run.`;
          stop = true;
          break;
        }

        if (!tool.dryRun) {
          reply('That tool cannot preview itself, so it will not be run.');
          continue;
        }
        let impact: ToolImpact;
        try {
          impact = await tool.dryRun(parsed.value, ctx, toolDeps);
        } catch (error) {
          console.error('Operator: a dry run failed', tool.name);
          reply(`That change could not be previewed: ${plainReason(error, 'the preview failed.')}`);
          continue;
        }

        const decision = decide({ tool: facts(tool), settings, impact, confirmed: false });

        if (decision.action === 'deny') {
          activity.push({
            at: ctx.now.toISOString(),
            tool: tool.name,
            kind: 'denied',
            summary: decision.reason,
          });
          entities.push(...impact.affected);
          reply(`Refused: ${decision.reason} Tell the person this, and do not try another way round it.`);
          continue;
        }

        if (decision.action === 'confirm') {
          pending = {
            id: crypto.randomUUID(),
            run_id: runId,
            tool: tool.name,
            input: parsed.value as Record<string, unknown>,
            impact,
            risk: tool.risk,
            reason: decision.reason,
            expires_at: new Date(ctx.now.getTime() + RUN_LIMITS.confirmationTtlMs).toISOString(),
          };
          await store.createPending(client, workspace, { ...pending, user_id: userId });
          activity.push({
            at: ctx.now.toISOString(),
            tool: tool.name,
            kind: 'confirm',
            summary: decision.reason,
          });
          entities.push(...impact.affected);
          if (!text) text = `I need your go-ahead to ${tool.description}`;
          status = 'awaiting_confirmation';
          stop = true;
          break;
        }

        // 'run' — and only 'run' — ever reaches a write handler. What follows
        // is deliberately three steps rather than one: making the change,
        // writing it down, and telling the model — because a failure in the
        // second of those is not a failure of the first, and saying so would
        // be a lie about a change that has already happened.
        const reason = "Ran under the workspace's autonomy settings.";
        let result: ActionResult;
        try {
          result = (await tool.handler(parsed.value, ctx, toolDeps)) as ActionResult;
        } catch (error) {
          console.error('Operator: a write tool failed', tool.name);
          activity.push({
            at: ctx.now.toISOString(),
            tool: tool.name,
            kind: 'write',
            summary: 'The change did not go through.',
          });
          reply(`That change did not go through: ${plainReason(error, 'the tool failed.')}`);
          // An attempt is a thing that happened to somebody's data, or nearly
          // did, so the trail carries it whichever way it went.
          try {
            await store.recordAction(client, workspace, {
              run_id: runId,
              tool: tool.name,
              risk: tool.risk,
              confirmation: 'auto',
              entity_type: impact.affected[0]?.type ?? null,
              entity_id: impact.affected[0]?.id ?? null,
              before: null,
              after: null,
              reason,
              outcome: 'failed',
              verification: {
                checked: 0,
                passed: 0,
                failures: ['The change did not go through.'],
              },
              at: ctx.now.toISOString(),
              user_id: userId,
            });
          } catch {
            console.error('Operator: a failed write could not be recorded', tool.name);
            status = 'failed';
            failure = 'A change was attempted but could not be recorded. Stopping.';
            text = failure;
            stop = true;
            break;
          }
          continue;
        }

        // The change is made. Everything from here is bookkeeping about
        // something that has already happened to a person's records.
        actions.push(result);
        entities.push(...(result.entities ?? []));
        writes += 1;
        try {
          await store.recordAction(client, workspace, {
            ...auditOf(runId, tool, result, 'auto', reason),
            at: ctx.now.toISOString(),
            user_id: userId,
          });
        } catch {
          // The write went through and the trail did not catch it. One
          // unrecorded change is a thing a person can be told about and go
          // and look at; a second one on top of it is not, so the run ends
          // here rather than changing anything else unrecorded.
          console.error('Operator: a write could not be recorded', tool.name);
          activity.push({
            at: ctx.now.toISOString(),
            tool: tool.name,
            kind: 'write',
            summary: `${result.summary} — could not be recorded`,
          });
          status = 'failed';
          failure =
            'The change was made but could not be recorded in the audit log. Stopping so nothing else changes unrecorded.';
          text = failure;
          stop = true;
          break;
        }
        activity.push({
          at: ctx.now.toISOString(),
          tool: tool.name,
          kind: 'write',
          summary: result.summary,
        });
        reply(`${result.summary} ${verificationSentence(result.verification)}`);
      }

      if (stop) break;
    }

    if (status === 'running') {
      status = 'limited';
      limited = `The Operator reached the limit of ${RUN_LIMITS.maxModelTurns} turns on this question.`;
    }
  } catch (error) {
    console.error('Operator: the run failed', plainReason(error, 'unknown'));
    status = 'failed';
    failure = 'The run could not be completed.';
    if (!text) text = 'Something went wrong while I was working on that.';
  } finally {
    clearTimeout(timer);
    try {
      await store.finishRun(client, workspace, runId, {
        status,
        finished_at: now().toISOString(),
        activity,
        entities: dedupeEntities(entities),
        // The only model text a run keeps: the opening of the reply a person read.
        summary: text.slice(0, 500),
        error: failure,
        tool_calls: toolCalls,
        writes,
      });
    } catch {
      console.error('Operator: the run could not be closed', runId);
    }
  }

  if (!text) {
    text = limited ?? 'I had nothing to say about that.';
  }
  return {
    run_id: runId,
    status,
    text,
    activity,
    entities: dedupeEntities(entities),
    actions,
    pending,
    limited,
  };
}

/** The audit row a write leaves, whichever way it went. */
function auditOf(
  runId: string,
  tool: ToolDefinition,
  result: ActionResult,
  confirmation: 'auto' | 'confirmed',
  reason: string,
): AuditEntry {
  const first = result.succeeded[0] ?? result.entities[0] ?? null;
  return {
    run_id: runId,
    tool: tool.name,
    risk: tool.risk,
    confirmation,
    entity_type: first?.type ?? null,
    entity_id: first?.id ?? null,
    before: result.before ?? null,
    after: result.after ?? null,
    reason,
    outcome: result.outcome,
    verification: result.verification,
    at: new Date().toISOString(),
  };
}

/**
 * The person pressed the button.
 *
 * Nothing but the action's id comes from the browser: the tool, the arguments
 * and the impact are the ones the server itself stored when it asked. The dry
 * run is taken again and its fingerprint compared, so an action that was
 * previewed against state somebody has since changed is refused rather than
 * applied to a world it was never previewed against. No model is called: there
 * is nothing left to decide.
 */
export async function confirmAction(
  deps: RunDeps,
  actionId: string,
): Promise<OperatorResponse> {
  const now = deps.now ?? (() => new Date());
  const { client, registry, store } = deps;
  const workspace = deps.member.workspaceId;
  const userId = deps.member.id;
  const toolDeps: ToolDeps = { client, routing: deps.routing };

  const pending = await store.takePending(client, workspace, actionId, userId);
  if (!pending) throw new StoreError('That action is no longer waiting.', 409);

  const tool = registry.get(pending.tool);
  if (!tool || tool.type !== 'write' || !tool.dryRun) {
    throw new StoreError('That action can no longer be carried out.', 409);
  }
  const parsed = tool.parse(pending.input);
  if ('error' in parsed) {
    throw new StoreError('That action can no longer be carried out.', 409);
  }

  const settings = await store.getSettings(client, workspace);
  const ctx: ToolContext = {
    workspaceId: workspace,
    userId,
    runId: pending.run_id,
    origin: 'operator',
    now: now(),
  };

  const impact = await tool.dryRun(parsed.value, ctx, toolDeps);
  if (impact.state_hash !== pending.impact.state_hash) {
    throw new StoreError('Things changed since you looked. Ask again.', 409);
  }
  const decision = decide({ tool: facts(tool), settings, impact, confirmed: true });
  if (decision.action !== 'run') {
    throw new StoreError(
      decision.action === 'deny' ? decision.reason : 'That action still needs a person to allow it.',
      409,
    );
  }

  let result: ActionResult;
  try {
    result = (await tool.handler(parsed.value, ctx, toolDeps)) as ActionResult;
  } catch (error) {
    console.error('Operator: a confirmed write failed', tool.name);
    await store
      .recordAction(client, workspace, {
        run_id: pending.run_id,
        tool: tool.name,
        risk: tool.risk,
        confirmation: 'confirmed',
        entity_type: impact.affected[0]?.type ?? null,
        entity_id: impact.affected[0]?.id ?? null,
        before: null,
        after: null,
        reason: pending.reason,
        outcome: 'failed',
        verification: { checked: 0, passed: 0, failures: ['The change did not go through.'] },
        at: ctx.now.toISOString(),
        user_id: userId,
      })
      .catch(() => {});
    throw new StoreError(plainReason(error, 'That change did not go through.'), 500);
  }

  await store.recordAction(client, workspace, {
    ...auditOf(pending.run_id, tool, result, 'confirmed', pending.reason),
    at: ctx.now.toISOString(),
    user_id: userId,
  });

  return {
    run_id: pending.run_id,
    status: 'completed',
    text: `${result.summary} ${verificationSentence(result.verification)}`,
    activity: [
      {
        at: ctx.now.toISOString(),
        tool: tool.name,
        kind: 'write',
        summary: result.summary,
      },
    ],
    entities: dedupeEntities(result.entities ?? []),
    actions: [result],
    pending: null,
    limited: null,
  };
}
