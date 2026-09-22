import type { SupabaseClient } from '@supabase/supabase-js';
import type { EntityRef, ToolImpact, ToolResult } from '@/lib/operator/types';
import { listProfiles } from '@/lib/server/load-desk-store';
import {
  createRequestDrafts,
  followUpDraft,
  planDraftableRequests,
  planFollowUp,
  type DraftablePlan,
  type SkippedCustomer,
} from '@/lib/server/rate-requests';
import { getRequest, listPeriods, listRequests } from '@/lib/server/rates-store';
import { customerRef, rateRequestRef } from './refs';
import {
  defineAction,
  deps,
  isObject,
  isoDate,
  nothingVerified,
  plural,
  recordAction,
  rowId,
  settle,
  stateHash,
  verifyAll,
  type Parsed,
} from './shared';

// Asking a customer for a rate — as a draft, and only ever as a draft.
//
// Both tools ask lib/server/rate-requests.ts, which is the same module the
// Rates page's own generate and follow-up routes ask: the same gaps, the same
// wording, the same skip rules, the same line in the trail. That is deliberate,
// and it is why the rules are not written down here — a skip rule with two
// copies is a customer emailed twice about a week they already answered.
//
// Two deliberate differences from the routes, both narrowing, and both passed
// to that module rather than decided again here:
//
// The model is never asked to rephrase the body. The route lets `naturalBody`
// make the wording more natural when a key is configured; an agent drafting on
// its own behalf produces the deterministic text, so that what a person reads
// before sending is exactly what the rules wrote.
//
// The request is created DRAFT_ONLY, whatever the customer's own send mode
// allows. The route caps the customer's mode against the deployment's; here
// there is no cap to negotiate, because nothing the Operator makes may ever be
// in a state that could go out without a person opening it.
//
// Nothing in this file sends, marks sent, or touches a thread. There is no
// mail adapter on this deployment at all, and this is not the place to want one.

/** The most customers one call drafts for. */
const MAX_DRAFTS = 5;

// -------------------------------------------------- create_rate_request_draft

export type RateDraftInput = {
  customer_id: number | null;
  from: string | null;
  to: string | null;
};

type DraftLoad = {
  draftable: DraftablePlan[];
  skipped: SkippedCustomer[];
  overflow: number;
  blockers: string[];
};

/**
 * Who has an outstanding rate and no request already asking for it, as far as
 * one call of this tool will go.
 *
 * The plan is the drafting service's; what this adds is the agent's own cap and
 * the refusals it owes the model — a customer asked for by name and skipped is
 * a refusal with a reason, where the same customer skipped in a sweep is simply
 * not drafted for. The service reads each billing period narrowly rather than
 * scanning the workspace, which is the same question asked of fewer rows.
 */
async function load(
  client: SupabaseClient,
  workspace: string,
  input: RateDraftInput,
  now: Date,
): Promise<DraftLoad> {
  const [profiles, periods, existing] = await Promise.all([
    listProfiles(client, workspace),
    listPeriods(client, workspace),
    listRequests(client, workspace),
  ]);
  const planned = await planDraftableRequests(
    client,
    workspace,
    null,
    profiles.customers,
    periods,
    existing,
    { customerId: input.customer_id, from: input.from, to: input.to, now },
  );
  if (planned.unknownCustomer) {
    return { draftable: [], skipped: [], overflow: 0, blockers: ['That customer no longer exists.'] };
  }
  const blockers: string[] = [];
  if (input.customer_id !== null && !planned.draftable.length && planned.skipped.length) {
    blockers.push(planned.skipped[0].reason);
  }
  if (!planned.draftable.length && !planned.skipped.length && !blockers.length) {
    blockers.push('Every rate for that period is already on file.');
  }
  return {
    draftable: planned.draftable.slice(0, MAX_DRAFTS),
    skipped: planned.skipped,
    overflow: Math.max(0, planned.draftable.length - MAX_DRAFTS),
    blockers,
  };
}

const parseDraft = (args: unknown): Parsed<RateDraftInput> => {
  if (!isObject(args)) return { error: 'Expected a customer and an optional period.' };
  const customerId = args.customer_id === null ? null : rowId(args.customer_id);
  if (args.customer_id !== null && customerId === null) {
    return { error: 'customer_id must be a customer, or null for every customer that is due.' };
  }
  const read = (value: unknown, name: string): Parsed<string | null> => {
    if (value === null) return { value: null };
    const day = isoDate(value);
    return day ? { value: day } : { error: `${name} must be a date as YYYY-MM-DD, or null.` };
  };
  const from = read(args.from, 'from');
  if ('error' in from) return from;
  const to = read(args.to, 'to');
  if ('error' in to) return to;
  if ((from.value === null) !== (to.value === null)) {
    return { error: 'A period needs both from and to.' };
  }
  return { value: { customer_id: customerId, from: from.value, to: to.value } };
};

export const createRateRequestDraft = defineAction<RateDraftInput>({
  name: 'create_rate_request_draft',
  description:
    'Draft this period\'s rate requests — one per customer with a rate still outstanding, and none ' +
    'for a customer with nothing missing. Every request is a draft; nothing is ever sent.',
  input: {
    type: 'object',
    properties: {
      customer_id: {
        type: ['integer', 'null'],
        description: 'One customer, or null for every customer that is due.',
      },
      from: { type: ['string', 'null'], description: 'The first day of the period, or null for the customer\'s own.' },
      to: { type: ['string', 'null'], description: 'The last day of the period, or null.' },
    },
    required: ['customer_id', 'from', 'to'],
    additionalProperties: false,
  },
  output: {
    type: 'object',
    properties: { outcome: { type: 'string' }, summary: { type: 'string' } },
    required: ['outcome', 'summary'],
    additionalProperties: false,
  },
  type: 'write',
  permission: 'rates.draft',
  risk: 1,
  confirmation: 'conditional',
  maxRecords: MAX_DRAFTS,
  parse: parseDraft,
  dryRun: async (input, ctx, given): Promise<ToolImpact> => {
    const { client } = deps(given);
    const loaded = await load(client, ctx.workspaceId, input, ctx.now);
    const lines = loaded.draftable.map(
      ({ plan, customer, label }) =>
        `Draft for ${customer.name}: ${plural(plan.items.length, 'job')} for ${label}`,
    );
    for (const { customer, reason } of loaded.skipped) lines.push(`${customer.name}: ${reason}`);
    if (loaded.overflow) {
      lines.push(`${plural(loaded.overflow, 'other customer')} not drafted for; ask again for the rest`);
    }
    return {
      records: loaded.blockers.length ? 0 : loaded.draftable.length,
      touches_finalized: false,
      lines: lines.length ? lines : ['Nothing to draft'],
      affected: loaded.draftable.map(({ customer }) => customerRef(customer.id, customer.name)),
      blockers: loaded.blockers,
      state_hash: stateHash([
        input,
        loaded.draftable.map(({ plan, customer }) => [customer.id, plan.period_from, plan.items.length]),
      ]),
    };
  },
  handler: async (input, ctx, given): Promise<ToolResult> => {
    const { client } = deps(given);
    const workspace = ctx.workspaceId;
    const loaded = await load(client, workspace, input, ctx.now);
    const notAttempted = loaded.skipped.map(({ customer }) =>
      customerRef(customer.id, customer.name),
    );
    if (loaded.blockers.length || !loaded.draftable.length) {
      const reason = loaded.blockers.length ? loaded.blockers.join(' ') : 'There was nothing to draft.';
      return {
        kind: 'action',
        outcome: 'refused',
        succeeded: [],
        failed: [],
        not_attempted: notAttempted,
        verification: nothingVerified(),
        summary: reason,
        entities: notAttempted,
      };
    }
    // Deterministic wording, DRAFT_ONLY, and a failed insert reported rather
    // than thrown: the three ways an agent's draft differs from a person's.
    const drafting = await createRequestDrafts(
      client,
      workspace,
      { id: ctx.userId, email: null, workspaceId: workspace },
      loaded.draftable,
      { wording: 'deterministic', onError: 'collect' },
    );
    const created = drafting.created;
    const failed: { entity: EntityRef; reason: string }[] = drafting.failed.map(
      ({ customer, reason }) => ({ entity: customerRef(customer.id, customer.name), reason }),
    );

    const drafts = await listRequests(client, workspace, { status: 'DRAFT' });
    const onFile = new Set(drafts.map((request) => request.id));
    const succeeded: EntityRef[] = [];
    const checks: { label: string; ok: boolean }[] = [];
    for (const request of created) {
      const ok = onFile.has(request.id);
      const ref = rateRequestRef(request.id, `Rate request #${request.id}`);
      checks.push({ label: `Rate request #${request.id} is not on file as a draft.`, ok });
      if (ok) succeeded.push(ref);
      else failed.push({ entity: ref, reason: 'The draft is not on file.' });
    }
    const verification = verifyAll(checks);
    const summary = `${plural(succeeded.length, 'rate request')} drafted. Nothing was sent.`;
    await recordAction(client, workspace, ctx, {
      tool: 'create_rate_request_draft',
      summary,
      affected: created.map((request) => request.id),
      customerId: input.customer_id,
    });
    return {
      kind: 'action',
      outcome: settle(succeeded, failed, notAttempted),
      succeeded,
      failed,
      not_attempted: notAttempted,
      verification,
      after: created.map((request) => ({ id: request.id, status: request.status })),
      summary,
      entities: [
        ...succeeded,
        ...loaded.draftable.map(({ customer }) => customerRef(customer.id, customer.name)),
      ],
    };
  },
});

// ------------------------------------------------- create_rate_followup_draft

export type FollowUpInput = { request_id: number };

const parseFollowUp = (args: unknown): Parsed<FollowUpInput> => {
  if (!isObject(args)) return { error: 'Expected a rate request id.' };
  const id = rowId(args.request_id);
  if (id === null) return { error: 'request_id must be the number of a rate request.' };
  return { value: { request_id: id } };
};

export const createRateFollowUpDraft = defineAction<FollowUpInput>({
  name: 'create_rate_followup_draft',
  description:
    'Draft a chaser on a rate request, about what is still outstanding and nothing else. It is a ' +
    'draft on the same request, with the same subject; nothing is sent.',
  input: {
    type: 'object',
    properties: {
      request_id: { type: 'integer', description: 'The rate request to chase.' },
    },
    required: ['request_id'],
    additionalProperties: false,
  },
  output: {
    type: 'object',
    properties: { outcome: { type: 'string' }, summary: { type: 'string' } },
    required: ['outcome', 'summary'],
    additionalProperties: false,
  },
  type: 'write',
  permission: 'rates.draft',
  risk: 1,
  confirmation: 'conditional',
  maxRecords: 1,
  parse: parseFollowUp,
  dryRun: async (input, ctx, given): Promise<ToolImpact> => {
    const { client } = deps(given);
    const loaded = await planFollowUp(client, ctx.workspaceId, input.request_id);
    const ref = rateRequestRef(input.request_id, `Rate request #${input.request_id}`);
    return {
      records: loaded.blockers.length ? 0 : 1,
      touches_finalized: false,
      lines: loaded.request
        ? [
            `Follow-up ${loaded.request.follow_up_count + 1} about ${plural(
              loaded.remaining.length,
              'job',
            )} still outstanding`,
          ]
        : ['Nothing to chase'],
      affected: [ref],
      blockers: loaded.blockers,
      state_hash: stateHash([
        input.request_id,
        loaded.request?.updated_at ?? null,
        loaded.request?.follow_up_count ?? null,
        loaded.request?.answered ?? null,
      ]),
    };
  },
  handler: async (input, ctx, given): Promise<ToolResult> => {
    const { client } = deps(given);
    const workspace = ctx.workspaceId;
    const ref = rateRequestRef(input.request_id, `Rate request #${input.request_id}`);
    const chased = await followUpDraft(
      client,
      workspace,
      { id: ctx.userId, email: null, workspaceId: workspace },
      input.request_id,
    );
    if (!chased.ok) {
      return {
        kind: 'action',
        outcome: 'refused',
        succeeded: [],
        failed: [],
        not_attempted: [ref],
        verification: nothingVerified(),
        summary: chased.blockers.join(' ') || 'That rate request cannot be chased.',
        entities: [ref],
      };
    }
    const { request, customer, remaining, drafted } = chased;

    const after = await getRequest(client, workspace, request.id);
    const verification = verifyAll([
      {
        label: `Rate request #${request.id} is not a draft.`,
        ok: after?.status === 'DRAFT',
      },
      {
        label: `Rate request #${request.id} does not show the new follow-up.`,
        ok: (after?.follow_up_count ?? 0) === request.follow_up_count + 1,
      },
    ]);
    const passed = verification.passed === verification.checked;
    const summary = passed
      ? `Follow-up ${drafted.follow_up_count} drafted for ${customer.name} about ${plural(
          remaining.length,
          'job',
        )}. Nothing was sent.`
      : `Rate request #${request.id} was saved but does not read back as a new draft.`;
    await recordAction(client, workspace, ctx, {
      tool: 'create_rate_followup_draft',
      summary,
      affected: [request.id],
      customerId: request.customer_profile_id,
      requestId: request.id,
    });
    return {
      kind: 'action',
      outcome: passed ? 'done' : 'failed',
      succeeded: passed ? [ref] : [],
      failed: passed ? [] : [{ entity: ref, reason: verification.failures.join(' ') }],
      not_attempted: [],
      verification,
      before: { status: request.status, follow_up_count: request.follow_up_count },
      after: { status: after?.status ?? null, follow_up_count: after?.follow_up_count ?? null },
      summary,
      entities: [ref, customerRef(customer.id, customer.name)],
    };
  },
});
