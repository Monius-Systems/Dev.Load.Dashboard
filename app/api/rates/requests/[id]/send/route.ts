import { routeId } from '@/lib/load-desk/record-input';
import { listProfiles } from '@/lib/server/load-desk-store';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { sendRateRequest } from '@/lib/server/rate-mail';
import { getRequest } from '@/lib/server/rates-store';

/**
 * Sends a drafted request — on a deployment that can send anything.
 *
 * In V1 none can, and the two refusals say which kind of no it is: 409 when
 * the deployment is draft-only by choice, 503 when it would send but no
 * mailbox is connected. The draft is untouched either way, and the only
 * machinery that could reach a customer lives in lib/server/rate-mail.ts,
 * which has no network call in it at all.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  return memberRoute(
    request,
    async (client, member) => {
      if (id === null) return badRequest('Invalid request id.');
      const saved = await getRequest(client, member.workspaceId, id);
      if (!saved) {
        return Response.json({ error: 'That rate request no longer exists.' }, { status: 404 });
      }
      const { customers } = await listProfiles(client, member.workspaceId);
      const customer = customers.find(({ id: key }) => key === saved.customer_profile_id);
      const sent = await sendRateRequest(
        client,
        member.workspaceId,
        member,
        saved,
        customer?.rate_profile,
      );
      return Response.json({ request: sent });
    },
    { write: true },
  );
}
