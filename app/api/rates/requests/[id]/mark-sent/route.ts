import { routeId } from '@/lib/load-desk/record-input';
import { listProfiles } from '@/lib/server/load-desk-store';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { devTools, markRequestSent } from '@/lib/server/rate-mail';
import { getRequest } from '@/lib/server/rates-store';

/**
 * Marks a request as though it had gone out — the development stand-in for a
 * mailbox, so the rest of the agent can be walked end to end before one is
 * connected.
 *
 * It does exactly what a real send would do to the request, and nothing that a
 * real send would do to the world: the thread reference says `simulated:` and
 * so does the trail, so a request marked this way can never be mistaken later
 * for one a customer actually received. Available only where the development
 * tools are turned on.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  return memberRoute(
    request,
    async (client, member) => {
      if (id === null) return badRequest('Invalid request id.');
      if (!devTools()) {
        return Response.json(
          { error: 'The development tools are not available on this deployment.' },
          { status: 403 },
        );
      }
      const body = await boundedJson(request, 2_000).catch((): Record<string, unknown> => ({}));
      if (body.simulated !== true) {
        return badRequest('Marking a request sent is a simulation; send { simulated: true }.');
      }
      const saved = await getRequest(client, member.workspaceId, id);
      if (!saved) {
        return Response.json({ error: 'That rate request no longer exists.' }, { status: 404 });
      }
      const { customers } = await listProfiles(client, member.workspaceId);
      const customer = customers.find(({ id: key }) => key === saved.customer_profile_id);
      const sent = await markRequestSent(
        client,
        member.workspaceId,
        member,
        saved,
        customer?.rate_profile,
        `simulated:${saved.id}`,
        'Marked as sent for development; no email left this deployment.',
      );
      return Response.json({ request: sent });
    },
    { write: true },
  );
}
