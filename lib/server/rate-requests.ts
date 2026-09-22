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
  type RatePeriod,
  type RateRequest,
  type RequestItem,
  type RequestPlan,
} from '@/lib/load-desk/rates';
import type { SavedRecord } from '@/lib/load-desk/types';
import { listProfiles, listRecordsBetween } from '@/lib/server/load-desk-store';
import { openaiKey } from '@/lib/server/openai-key';
import { naturalBody } from '@/lib/server/rate-ai';
import { rateProfileOf } from '@/lib/server/rates-engine';
import {
  appendEvent,
  getRequest,
  insertRequest,
  updateRequest,
} from '@/lib/server/rates-store';

// Asking a customer for a rate, in one place.
//
// Who is asked, about what, and in what words is a business decision, and until
// now it was written down three times: in the generate route, in the follow-up
// route, and again in the Operator's two rate tools. Three copies of a skip
// rule is three chances for a customer to be emailed twice about a week they
// already answered, and the copy that drifts is never the one anybody is
// looking at. So the rules live here and the three callers ask.
//
// What differs between a person pressing Generate and the Operator drafting on
// its own behalf is passed in, never re-decided here: the wording (a person's
// draft may be rephrased by the model, an agent's is the fixed text), the send
// mode a request is saved with, and whether a failed insert stops the run or is
// collected and reported. Everything else — the period each customer is asked
// about, the gaps, the skip rules, the fields written, the line in the trail —
// is the same however the ask was started.
//
// Nothing here sends, marks sent, or touches a thread. There is no mail adapter
// on this deployment, this module deliberately cannot reach the one file that
// would hold one, and nothing it makes is ever in a state that could go out
// without a person opening it.

/** One call drafts for at most this many customers, whatever is outstanding. */
export const MAX_CUSTOMERS = 50;

/** How many tickets a narrow read of one billing period may return. */
const WINDOW_RECORDS = 500;

/** A request that is still in play: asking again would be asking twice. */
export const OPEN_STATUSES = new Set(['CLOSED', 'FAILED']);

/** The contact a customer's rate email goes to: the main one, else the first. */
export const contactFor = (customer: CustomerProfile | undefined): RateContact | null => {
  const contacts = customer?.rate_contacts ?? [];
  return contacts.find((contact) => contact.primary) ?? contacts[0] ?? null;
};

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

// ------------------------------------------------------------ what to draft

/** The window and the customer a plan was worked out for, ready to be written. */
export type DraftablePlan = {
  plan: RequestPlan;
  customer: CustomerProfile;
  contact: RateContact | null;
  label: string;
};

/** A customer with something outstanding that is deliberately not asked. */
export type SkippedCustomer = { customer: CustomerProfile; reason: string };

export type DraftPlan = {
  draftable: DraftablePlan[];
  skipped: SkippedCustomer[];
  /** A customer was named by id and this workspace has no such customer. */
  unknownCustomer: boolean;
};

/** Which customers, over which days, and from when the period is worked out. */
export type DraftScope = {
  customerId?: number | null;
  from?: string | null;
  to?: string | null;
  now: Date;
};

/**
 * Who has an outstanding rate and no request already asking for it.
 *
 * Each customer is asked about its own billing period unless a window was
 * named: a monthly customer must not be emailed about a week, and that is why
 * the customers are grouped into windows before anything is read.
 *
 * `records` is the tickets to read the gaps from. A caller that already holds
 * the workspace's records passes them; a caller that would rather not scan the
 * table passes null and each window is read narrowly instead, which is the same
 * question asked of fewer rows.
 */
export async function planDraftableRequests(
  client: SupabaseClient,
  workspace: string,
  records: SavedRecord[] | null,
  customers: CustomerProfile[],
  periods: RatePeriod[],
  requests: RateRequest[],
  scope: DraftScope,
): Promise<DraftPlan> {
  const only = scope.customerId ?? null;
  const chosen = customers.filter((customer) => only === null || customer.id === only);
  if (only !== null && !chosen.length) {
    return { draftable: [], skipped: [], unknownCustomer: true };
  }
  const windows = new Map<string, { from: string; to: string; ids: Set<number> }>();
  for (const customer of chosen) {
    const period =
      scope.from && scope.to
        ? { from: scope.from, to: scope.to }
        : billingPeriodFor(rateProfileOf(customer), scope.now);
    const key = `${period.from}|${period.to}`;
    const known = windows.get(key) ?? { ...period, ids: new Set<number>() };
    known.ids.add(customer.id);
    windows.set(key, known);
  }
  const plans: RequestPlan[] = [];
  for (const period of windows.values()) {
    const seen =
      records ??
      (await listRecordsBetween(client, workspace, period.from, period.to, WINDOW_RECORDS));
    const needs = missingRates(seen, chosen, periods, period.from, period.to).filter((need) =>
      period.ids.has(need.customer_profile_id),
    );
    plans.push(...planRequests(needs, period.from, period.to));
  }
  const draftable: DraftablePlan[] = [];
  const skipped: SkippedCustomer[] = [];
  for (const plan of plans.slice(0, MAX_CUSTOMERS)) {
    const customer = chosen.find(({ id }) => id === plan.customer_profile_id);
    if (!customer) continue;
    if (!rateProfileOf(customer).auto_create) {
      skipped.push({ customer, reason: 'Rate requests are turned off for this customer.' });
      continue;
    }
    const open = requests.some(
      (entry) =>
        entry.customer_profile_id === customer.id &&
        entry.period_from === plan.period_from &&
        !OPEN_STATUSES.has(entry.status),
    );
    if (open) {
      skipped.push({ customer, reason: 'A request for this period already exists.' });
      continue;
    }
    draftable.push({
      plan,
      customer,
      contact: contactFor(customer),
      label: periodLabel(plan.period_from, plan.period_to),
    });
  }
  return { draftable, skipped, unknownCustomer: false };
}

// --------------------------------------------------------- writing the draft

/** Who is drafting, for the usage record and for the line in the trail. */
export type DraftMember = { id: string; email: string | null; workspaceId: string };

export type DraftOptions = {
  /**
   * 'natural' lets the model rephrase the body when a key is configured, and
   * keeps the fixed text otherwise; 'deterministic' never asks it at all, which
   * is what an agent drafting on its own behalf does, so that what a person
   * reads before sending is exactly what the rules wrote.
   */
  wording: 'deterministic' | 'natural';
  /** The send mode the request is saved with. The default is the safest one. */
  mode?: (customer: CustomerProfile) => RateRequest['mode'];
  /** 'collect' reports a failed draft and carries on; the default stops. */
  onError?: 'throw' | 'collect';
};

export type DraftFailure = { customer: CustomerProfile; reason: string };

export type DraftResult = { created: RateRequest[]; failed: DraftFailure[] };

/**
 * Writes the drafts and the line in the trail for each one.
 *
 * Every request is a draft, whatever else is asked for: there is no path from
 * here to a customer's inbox, so a draft that turns out to be wrong costs
 * somebody the trouble of deleting it.
 */
export async function createRequestDrafts(
  client: SupabaseClient,
  workspace: string,
  member: DraftMember,
  plans: DraftablePlan[],
  options: DraftOptions,
): Promise<DraftResult> {
  const apiKey = options.wording === 'natural' ? openaiKey() : null;
  const created: RateRequest[] = [];
  const failed: DraftFailure[] = [];
  for (const { plan, customer, contact, label } of plans) {
    const wording = requestWording(plan, customer, contact, label);
    try {
      const body = apiKey
        ? await naturalBody(apiKey, wording.body, plan.items, {
            userId: member.id,
            workspaceId: member.workspaceId,
          })
        : wording.body;
      const saved = await insertRequest(client, workspace, {
        customer_profile_id: customer.id,
        period_from: plan.period_from,
        period_to: plan.period_to,
        status: 'DRAFT',
        mode: options.mode ? options.mode(customer) : 'DRAFT_ONLY',
        recipient: contact?.email ?? null,
        cc: contact?.cc ?? [],
        subject: wording.subject,
        body,
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
        actor: member.email ?? member.id,
      });
      created.push(saved);
    } catch (error) {
      if (options.onError !== 'collect') throw error;
      failed.push({
        customer,
        reason: error instanceof Error ? error.message : 'The draft could not be saved.',
      });
    }
  }
  return { created, failed };
}

// ------------------------------------------------------------- the follow-up

/**
 * The chaser's opener: the same fixed text about what is still outstanding,
 * begun the way a person would begin it. No model is asked to chase a customer.
 */
export function followUpBody(body: string, label: string): string {
  const opener = `\n\nJust following up on my note about ${label} — could you please`;
  return body.includes('\n\nCould you please')
    ? body.replace('\n\nCould you please', opener)
    : `${body}\n\nJust following up on my note about ${label}.`;
}

export type FollowUpPlan = {
  request: RateRequest | null;
  customer: CustomerProfile | null;
  remaining: RequestItem[];
  /** Why it cannot be chased. Empty means it can. */
  blockers: string[];
  /** What a route answers with for the first blocker, or null when there is none. */
  status: 404 | 409 | null;
};

/** What a chaser would say, read without writing anything. */
export async function planFollowUp(
  client: SupabaseClient,
  workspace: string,
  requestId: number,
): Promise<FollowUpPlan> {
  const request = await getRequest(client, workspace, requestId);
  if (!request) {
    return {
      request: null,
      customer: null,
      remaining: [],
      blockers: ['That rate request no longer exists.'],
      status: 404,
    };
  }
  const remaining = remainingItems(request);
  const { customers } = await listProfiles(client, workspace);
  const customer = customers.find(({ id }) => id === request.customer_profile_id) ?? null;
  const blockers: string[] = [];
  let status: 404 | 409 | null = null;
  if (!remaining.length) {
    blockers.push('This customer has answered everything that was asked.');
    status = 409;
  }
  if (!customer) {
    blockers.push('That customer no longer exists.');
    if (status === null) status = 404;
  }
  return { request, customer, remaining, blockers, status };
}

export type FollowUpResult =
  | { ok: false; status: 404 | 409; error: string; blockers: string[] }
  | {
      ok: true;
      request: RateRequest;
      customer: CustomerProfile;
      remaining: RequestItem[];
      drafted: RateRequest;
    };

/**
 * Writes the chaser, and only about what is still outstanding.
 *
 * A customer who answered two of three jobs answered two of three jobs: the
 * follow-up asks about the third and never re-asks what was already given,
 * which is the difference between a reminder and an insult. It is a new draft
 * on the same request, with the same subject so it stays in the same thread.
 */
export async function followUpDraft(
  client: SupabaseClient,
  workspace: string,
  member: DraftMember,
  requestId: number,
): Promise<FollowUpResult> {
  const plan = await planFollowUp(client, workspace, requestId);
  if (plan.blockers.length || !plan.request || !plan.customer) {
    return {
      ok: false,
      status: plan.status ?? 404,
      error: plan.blockers[0] ?? 'That rate request cannot be chased.',
      blockers: plan.blockers,
    };
  }
  const { request, customer, remaining } = plan;
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
    actor: member.email ?? member.id,
  });
  return { ok: true, request, customer, remaining, drafted };
}
