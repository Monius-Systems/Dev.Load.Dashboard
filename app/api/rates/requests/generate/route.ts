import { parseGenerateBody } from '@/lib/load-desk/rates';
import { listProfiles, listRecords } from '@/lib/server/load-desk-store';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { cappedMode } from '@/lib/server/rate-mail';
import { createRequestDrafts, planDraftableRequests } from '@/lib/server/rate-requests';
import { listPeriods, listRequests } from '@/lib/server/rates-store';

/**
 * Drafts this period's rate requests: one per customer with something
 * outstanding, and none at all for a customer with nothing missing.
 *
 * What is asked, and of whom, is worked out from the tickets — the jobs their
 * loads actually went to, minus the rates already on file or already typed
 * into Customers. The rules are in lib/server/rate-requests.ts, which the
 * Operator's own drafting tool asks as well, so the two cannot drift apart.
 * The wording is `requestWording`'s, which is fixed: the same gap produces the
 * same email every week, and that is what makes a reply easy to read back.
 * When a key is configured the model is allowed to rephrase the body more
 * naturally, and the result is kept only if every job, every field and every
 * digit survived it; otherwise the fixed wording goes out unchanged.
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
      const [records, profiles, periods, existing] = await Promise.all([
        listRecords(client, member.workspaceId),
        listProfiles(client, member.workspaceId),
        listPeriods(client, member.workspaceId),
        listRequests(client, member.workspaceId),
      ]);
      const planned = await planDraftableRequests(
        client,
        member.workspaceId,
        records,
        profiles.customers,
        periods,
        existing,
        { customerId: onlyCustomer, from, to, now },
      );
      if (planned.unknownCustomer) {
        return Response.json({ error: 'That customer no longer exists.' }, { status: 404 });
      }
      const { created } = await createRequestDrafts(
        client,
        member.workspaceId,
        { id: member.id, email: member.email ?? null, workspaceId: member.workspaceId },
        planned.draftable,
        { wording: 'natural', mode: (customer) => cappedMode(customer.rate_profile) },
      );
      const skipped = planned.skipped.map(({ customer, reason }) => ({
        customer_profile_id: customer.id,
        reason,
      }));
      return Response.json({ requests: created, created: created.length, skipped });
    },
    { write: true },
  );
}
