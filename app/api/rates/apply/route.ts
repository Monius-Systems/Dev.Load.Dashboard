import { listProfiles } from '@/lib/server/load-desk-store';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { applyPeriodsToTickets } from '@/lib/server/rates-engine';

/**
 * Prices the tickets the rates on file cover, for one customer, one job, or
 * everything the workspace has.
 *
 * Asked for explicitly, from a button, and never from a page load: this is the
 * call that walks the saved tickets, and a screen that made it on every render
 * would spend the worker's whole budget re-deciding figures that did not
 * change. It is safe to press twice — a ticket already priced from the same
 * periods produces no edit at all.
 */
export function POST(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      const body = await boundedJson(request, 4_000).catch((): Record<string, unknown> => ({}));
      const customerId = body.customer_profile_id;
      const jobKey = body.job_key;
      if (
        customerId !== undefined &&
        customerId !== null &&
        !(typeof customerId === 'number' && Number.isSafeInteger(customerId) && customerId > 0)
      ) {
        return badRequest('The customer is not valid.');
      }
      if (jobKey !== undefined && jobKey !== null && (typeof jobKey !== 'string' || jobKey.length > 300)) {
        return badRequest('The job is not valid.');
      }
      if (typeof customerId === 'number') {
        const { customers } = await listProfiles(client, member.workspaceId);
        if (!customers.some(({ id }) => id === customerId)) {
          return Response.json({ error: 'That customer no longer exists.' }, { status: 404 });
        }
      }
      const priced = await applyPeriodsToTickets(client, member.workspaceId, member, {
        ...(typeof customerId === 'number' ? { customerId } : {}),
        ...(typeof jobKey === 'string' && jobKey ? { jobKey } : {}),
      });
      return Response.json(priced);
    },
    { write: true },
  );
}
