import type { CustomerProfile } from '@/lib/load-desk/profiles';
import {
  billingPeriodFor,
  missingRates,
  parseGenerateBody,
  periodLabel,
  planRequests,
  requestWording,
  type RateContact,
  type RateRequest,
  type RequestPlan,
} from '@/lib/load-desk/rates';
import { listProfiles, listRecords } from '@/lib/server/load-desk-store';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { openaiKey } from '@/lib/server/openai-key';
import { naturalBody } from '@/lib/server/rate-ai';
import { cappedMode } from '@/lib/server/rate-mail';
import { rateProfileOf } from '@/lib/server/rates-engine';
import {
  appendEvent,
  insertRequest,
  listPeriods,
  listRequests,
} from '@/lib/server/rates-store';

/** One call drafts for at most this many customers, whatever is outstanding. */
const MAX_CUSTOMERS = 50;

/** A request that is still in play: asking again would be asking twice. */
const OPEN_STATUSES = new Set(['CLOSED', 'FAILED']);

/** The contact a customer's rate email goes to: the main one, else the first. */
const contactFor = (customer: CustomerProfile): RateContact | null => {
  const contacts = customer.rate_contacts ?? [];
  return contacts.find((contact) => contact.primary) ?? contacts[0] ?? null;
};

/**
 * Drafts this period's rate requests: one per customer with something
 * outstanding, and none at all for a customer with nothing missing.
 *
 * What is asked, and of whom, is worked out from the tickets — the jobs their
 * loads actually went to, minus the rates already on file or already typed
 * into Customers. The wording is `requestWording`'s, which is fixed: the same
 * gap produces the same email every week, and that is what makes a reply easy
 * to read back. When a key is configured the model is allowed to rephrase the
 * body more naturally, and the result is kept only if every job, every field
 * and every digit survived it; otherwise the fixed wording goes out unchanged.
 *
 * Every request is a draft. Nothing here can send anything — see
 * lib/server/rate-mail.ts — so a generate that goes wrong costs a person the
 * trouble of deleting some drafts.
 */
export function POST(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      // A generate with no body is the ordinary case: this week, every
      // customer that is due.
      const body = await boundedJson(request, 4_000).catch((): Record<string, unknown> => ({}));
      const parsed = parseGenerateBody(body);
      if ('error' in parsed) return badRequest(parsed.error);
      const { customer_profile_id: onlyCustomer, from, to } = parsed.value;
      const now = new Date();
      const [records, profiles, periods] = await Promise.all([
        listRecords(client, member.workspaceId),
        listProfiles(client, member.workspaceId),
        listPeriods(client, member.workspaceId),
      ]);
      const customers = profiles.customers.filter(
        (customer) => onlyCustomer === null || customer.id === onlyCustomer,
      );
      if (onlyCustomer !== null && !customers.length) {
        return Response.json({ error: 'That customer no longer exists.' }, { status: 404 });
      }

      // Each customer is asked about its own billing period unless the desk
      // named a window: a monthly customer must not be emailed about a week.
      const windows = new Map<string, { from: string; to: string; ids: Set<number> }>();
      for (const customer of customers) {
        const period =
          from && to ? { from, to } : billingPeriodFor(rateProfileOf(customer), now);
        const key = `${period.from}|${period.to}`;
        const known = windows.get(key) ?? { ...period, ids: new Set<number>() };
        known.ids.add(customer.id);
        windows.set(key, known);
      }
      const plans: RequestPlan[] = [];
      for (const period of windows.values()) {
        const needs = missingRates(records, customers, periods, period.from, period.to).filter(
          (need) => period.ids.has(need.customer_profile_id),
        );
        plans.push(...planRequests(needs, period.from, period.to));
      }

      const existing = await listRequests(client, member.workspaceId);
      const apiKey = openaiKey();
      const created: RateRequest[] = [];
      const skipped: { customer_profile_id: number; reason: string }[] = [];
      for (const plan of plans.slice(0, MAX_CUSTOMERS)) {
        const customer = customers.find(({ id }) => id === plan.customer_profile_id);
        if (!customer) continue;
        const profile = rateProfileOf(customer);
        if (!profile.auto_create) {
          skipped.push({
            customer_profile_id: customer.id,
            reason: 'Rate requests are turned off for this customer.',
          });
          continue;
        }
        const open = existing.some(
          (entry) =>
            entry.customer_profile_id === customer.id &&
            entry.period_from === plan.period_from &&
            !OPEN_STATUSES.has(entry.status),
        );
        if (open) {
          skipped.push({
            customer_profile_id: customer.id,
            reason: 'A request for this period already exists.',
          });
          continue;
        }
        const contact = contactFor(customer);
        const label = periodLabel(plan.period_from, plan.period_to);
        const wording = requestWording(plan, customer, contact, label);
        const drafted = apiKey
          ? await naturalBody(apiKey, wording.body, plan.items, {
              userId: member.id,
              workspaceId: member.workspaceId,
            })
          : wording.body;
        const saved = await insertRequest(client, member.workspaceId, {
          customer_profile_id: customer.id,
          period_from: plan.period_from,
          period_to: plan.period_to,
          status: 'DRAFT',
          mode: cappedMode(customer.rate_profile),
          recipient: contact?.email ?? null,
          cc: contact?.cc ?? [],
          subject: wording.subject,
          body: drafted,
          items: plan.items,
          answered: [],
          sent_at: null,
          reply_at: null,
          follow_up_due_at: null,
          follow_up_count: 0,
          thread_ref: null,
        });
        await appendEvent(client, member.workspaceId, {
          kind: 'RATE_REQUEST_CREATED',
          customer_profile_id: customer.id,
          request_id: saved.id,
          response_id: null,
          period_id: null,
          invoice_key: null,
          detail: `Drafted for ${customer.name}: ${plan.items.length} job${
            plan.items.length === 1 ? '' : 's'
          } for ${label}.`,
          actor: member.email ?? member.id,
        });
        created.push(saved);
      }
      return Response.json({ requests: created, created: created.length, skipped });
    },
    { write: true },
  );
}
