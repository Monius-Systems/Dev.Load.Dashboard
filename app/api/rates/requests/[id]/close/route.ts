import { routeId } from '@/lib/load-desk/record-input';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { otherEventKind } from '@/lib/server/rates-engine';
import { appendEvent, getRequest, updateRequest } from '@/lib/server/rates-store';

/**
 * Closes a request: the desk has decided this one is finished with, however it
 * ended. Nothing is chased afterwards, and the same period can be asked about
 * again — a closed request is the one state `generate` will draft over.
 *
 * What was asked and what came back stay exactly as they are. Closing is a
 * decision about what happens next, not an edit to what happened.
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
      const closed = await updateRequest(client, member.workspaceId, id, {
        status: 'CLOSED',
        follow_up_due_at: null,
      });
      await appendEvent(client, member.workspaceId, {
        kind: otherEventKind('RATE_REQUEST_CLOSED'),
        customer_profile_id: saved.customer_profile_id,
        request_id: saved.id,
        response_id: null,
        period_id: null,
        invoice_key: null,
        detail: 'Closed; nothing more is chased for this period.',
        actor: member.email ?? member.id,
      });
      return Response.json({ request: closed });
    },
    { write: true },
  );
}
