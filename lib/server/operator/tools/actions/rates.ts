import type { SupabaseClient } from '@supabase/supabase-js';
import type { CustomerProfile } from '@/lib/load-desk/profiles';
import {
  billingPeriodFor,
  missingRates,
  periodLabel,
  planRequests,
  remainingItems,
  requestWording,
  type RateContact,
  type RateRequest,
  type RequestPlan,
} from '@/lib/load-desk/rates';
import type { EntityRef, ToolImpact, ToolResult } from '@/lib/operator/types';
import { listProfiles, listRecordsBetween } from '@/lib/server/load-desk-store';
import { rateProfileOf } from '@/lib/server/rates-engine';
import {
  appendEvent,
  getRequest,
  insertRequest,
  listPeriods,
  listRequests,
  updateRequest,
} from '@/lib/server/rates-store';
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
// Both tools mirror the routes the Rates page already posts to, and they mirror
// them deliberately: the same gaps, the same wording, the same skip rules, the
// same line in the trail. What is asked and of whom is worked out from the
// tickets by `missingRates` and `planRequests`; the wording is
// `requestWording`'s, which is fixed, so the same gap produces the same email
// however it was asked for.
//
// Two deliberate differences from the routes, both narrowing:
//
// The model is never asked to rephrase the body. The route lets `naturalBody`
// make the wording more natural when a key is configured; an agent drafting on
// its own behalf should produce the deterministic text, so that what a person
// reads before sending is exactly what the rules wrote.
//
// The request is created DRAFT_ONLY, whatever the customer's own send mode
// allows. The route caps the customer's mode against the deployment's; here
// there is no cap to negotiate, because nothing the Operator makes may ever be
// in a state that could go out without a person opening it.
//
// Nothing in this file sends, marks sent, or touches a thread. There is no
// mail adapter on this deployment at all, and this is not the place to want one.

/** A request that is still in play: asking again would be asking twice. */
const OPEN_STATUSES = new Set(['CLOSED', 'FAILED']);

/** The most customers one call drafts for. */
const MAX_DRAFTS = 5;

/** The contact a customer's rate email goes to: the main one, else the first. */
const contactFor = (customer: CustomerProfile | undefined): RateContact | null => {
  const contacts = customer?.rate_contacts ?? [];
  return contacts.find((contact) => contact.primary) ?? contacts[0] ?? null;
};

// -------------------------------------------------- create_rate_request_draft

export type RateDraftInput = {
  customer_id: number | null;
  from: string | null;
  to: string | null;
};

type Draftable = { plan: RequestPlan; customer: CustomerProfile; label: string };

type DraftLoad = {
  draftable: Draftable[];
  skipped: { customer: CustomerProfile; reason: string }[];
  overflow: number;
  blockers: string[];
};

/**
 * Who has an outstanding rate and no request already asking for it.
 *
 * Each customer is asked about its own billing period unless a window was
 * named: a monthly customer must not be emailed about a week. That is the
 * generate route's rule, and the windows are worked out the same way here.
 */
async function load(
  client: SupabaseClient,
  workspace: string,
  input: RateDraftInput,
  now: Date,
): Promise<DraftLoad> {
  const blockers: string[] = [];
  const [profiles, periods] = await Promise.all([
    listProfiles(client, workspace),
    listPeriods(client, workspace),
  ]);
  const customers = profiles.customers.filter(
    (customer) => input.customer_id === null || customer.id === input.customer_id,
  );
  if (input.customer_id !== null && !customers.length) {
    return { draftable: [], skipped: [], overflow: 0, blockers: ['That customer no longer exists.'] };
  }
  const windows = new Map<string, { from: string; to: string; ids: Set<number> }>();
  for (const customer of customers) {
    const period =
      input.from && input.to
        ? { from: input.from, to: input.to }
        : billingPeriodFor(rateProfileOf(customer), now);
    const key = `${period.from}|${period.to}`;
    const known = windows.get(key) ?? { ...period, ids: new Set<number>() };
    known.ids.add(customer.id);
    windows.set(key, known);
  }
  const plans: RequestPlan[] = [];
  for (const period of windows.values()) {
    // Bounded where the route reads the workspace: `missingRates` only looks
    // at the window, so the window is what is read.
    const records = await listRecordsBetween(client, workspace, period.from, period.to, 500);
    const needs = missingRates(records, customers, periods, period.from, period.to).filter(
      (need) => period.ids.has(need.customer_profile_id),
    );
    plans.push(...planRequests(needs, period.from, period.to));
  }
  const existing = await listRequests(client, workspace);
  const draftable: Draftable[] = [];
  const skipped: { customer: CustomerProfile; reason: string }[] = [];
  for (const plan of plans) {
    const customer = customers.find(({ id }) => id === plan.customer_profile_id);
    if (!customer) continue;
    if (!rateProfileOf(customer).auto_create) {
      skipped.push({ customer, reason: 'Rate requests are turned off for this customer.' });
      continue;
    }
    const open = existing.some(
      (entry) =>
        entry.customer_profile_id === customer.id &&
        entry.period_from === plan.period_from &&
        !OPEN_STATUSES.has(entry.status),
    );
    if (open) {
      skipped.push({ customer, reason: 'A request for this period already exists.' });
      continue;
    }
    draftable.push({ plan, customer, label: periodLabel(plan.period_from, plan.period_to) });
  }
  // A customer the request was asked for by name, and skipped, is a refusal
  // with a reason; a customer skipped in a sweep is just not drafted for.
  if (input.customer_id !== null && !draftable.length && skipped.length) {
    blockers.push(skipped[0].reason);
  }
  if (!draftable.length && !skipped.length && !blockers.length) {
    blockers.push('Every rate for that period is already on file.');
  }
  return {
    draftable: draftable.slice(0, MAX_DRAFTS),
    skipped,
    overflow: Math.max(0, draftable.length - MAX_DRAFTS),
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
    if (loaded.blockers.length || !loaded.draftable.length) {
      const reason = loaded.blockers.length ? loaded.blockers.join(' ') : 'There was nothing to draft.';
      return {
        kind: 'action',
        outcome: 'refused',
        succeeded: [],
        failed: [],
        not_attempted: loaded.skipped.map(({ customer }) => customerRef(customer.id, customer.name)),
        verification: nothingVerified(),
        summary: reason,
        entities: loaded.skipped.map(({ customer }) => customerRef(customer.id, customer.name)),
      };
    }
    const created: RateRequest[] = [];
    const failed: { entity: EntityRef; reason: string }[] = [];
    for (const { plan, customer, label } of loaded.draftable) {
      const contact = contactFor(customer);
      // Deterministic wording only. See the note at the top of this file.
      const wording = requestWording(plan, customer, contact, label);
      try {
        const saved = await insertRequest(client, workspace, {
          customer_profile_id: customer.id,
          period_from: plan.period_from,
          period_to: plan.period_to,
          status: 'DRAFT',
          mode: 'DRAFT_ONLY',
          recipient: contact?.email ?? null,
          cc: contact?.cc ?? [],
          subject: wording.subject,
          body: wording.body,
          items: plan.items,
          answered: [],
          sent_at: null,
          reply_at: null,
          follow_up_due_at: null,
          follow_up_count: 0,
          thread_ref: null,
        });
        await appendEvent(client, workspace, {
          kind: 'RATE_REQUEST_CREATED',
          customer_profile_id: customer.id,
          request_id: saved.id,
          response_id: null,
          period_id: null,
          invoice_key: null,
          detail: `Drafted for ${customer.name}: ${plural(plan.items.length, 'job')} for ${label}.`,
          actor: ctx.userId,
        });
        created.push(saved);
      } catch (error) {
        failed.push({
          entity: customerRef(customer.id, customer.name),
          reason: error instanceof Error ? error.message : 'The draft could not be saved.',
        });
      }
    }

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
      outcome: settle(succeeded, failed, loaded.skipped.map(({ customer }) => customerRef(customer.id, customer.name))),
      succeeded,
      failed,
      not_attempted: loaded.skipped.map(({ customer }) => customerRef(customer.id, customer.name)),
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

/**
 * The chaser's wording, as the follow-up route writes it: the same fixed text
 * about what is still outstanding, opened the way a person would open it. No
 * model is asked to chase a customer.
 */
function followUpBody(body: string, label: string): string {
  const opener = `\n\nJust following up on my note about ${label} — could you please`;
  return body.includes('\n\nCould you please')
    ? body.replace('\n\nCould you please', opener)
    : `${body}\n\nJust following up on my note about ${label}.`;
}

type FollowUpLoad = {
  request: RateRequest | null;
  customer: CustomerProfile | null;
  remaining: ReturnType<typeof remainingItems>;
  blockers: string[];
};

async function loadFollowUp(
  client: SupabaseClient,
  workspace: string,
  id: number,
): Promise<FollowUpLoad> {
  const request = await getRequest(client, workspace, id);
  if (!request) {
    return { request: null, customer: null, remaining: [], blockers: ['That rate request no longer exists.'] };
  }
  const remaining = remainingItems(request);
  const { customers } = await listProfiles(client, workspace);
  const customer = customers.find(({ id: key }) => key === request.customer_profile_id) ?? null;
  const blockers: string[] = [];
  if (!remaining.length) blockers.push('This customer has answered everything that was asked.');
  if (!customer) blockers.push('That customer no longer exists.');
  return { request, customer, remaining, blockers };
}

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
    const loaded = await loadFollowUp(client, ctx.workspaceId, input.request_id);
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
    const loaded = await loadFollowUp(client, workspace, input.request_id);
    const ref = rateRequestRef(input.request_id, `Rate request #${input.request_id}`);
    if (loaded.blockers.length || !loaded.request || !loaded.customer) {
      return {
        kind: 'action',
        outcome: 'refused',
        succeeded: [],
        failed: [],
        not_attempted: [ref],
        verification: nothingVerified(),
        summary: loaded.blockers.join(' ') || 'That rate request cannot be chased.',
        entities: [ref],
      };
    }
    const { request, customer, remaining } = loaded;
    const label = periodLabel(request.period_from, request.period_to);
    const wording = requestWording(
      {
        customer_profile_id: request.customer_profile_id,
        period_from: request.period_from,
        period_to: request.period_to,
        items: remaining,
      },
      customer,
      contactFor(customer),
      label,
    );
    const drafted = await updateRequest(client, workspace, request.id, {
      status: 'DRAFT',
      body: followUpBody(wording.body, label),
      follow_up_count: request.follow_up_count + 1,
      follow_up_due_at: null,
    });
    await appendEvent(client, workspace, {
      kind: 'RATE_FOLLOWUP_DUE',
      customer_profile_id: request.customer_profile_id,
      request_id: request.id,
      response_id: null,
      period_id: null,
      invoice_key: null,
      detail: `Follow-up ${drafted.follow_up_count} drafted for ${plural(
        remaining.length,
        'job',
      )} still outstanding.`,
      actor: ctx.userId,
    });

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
