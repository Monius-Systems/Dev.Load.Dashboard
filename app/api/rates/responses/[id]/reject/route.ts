import { routeId } from '@/lib/load-desk/record-input';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { otherEventKind } from '@/lib/server/rates-engine';
import { appendEvent, getResponse, updateResponse } from '@/lib/server/rates-store';

/**
 * A reply a person has looked at and decided says nothing to apply — an
 * out-of-office, a question back, a figure that turned out to be for another
 * job. Nothing is deleted: the message stays exactly as it arrived, and the
 * reason is in the trail, so a rate that never appeared can be explained as
 * easily as one that did.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  return memberRoute(
    request,
    async (client, member) => {
      if (id === null) return badRequest('Invalid reply id.');
      const body = await boundedJson(request, 4_000).catch((): Record<string, unknown> => ({}));
      const reason = typeof body.reason === 'string' ? body.reason.trim() : '';
      if (reason.length < 3 || reason.length > 500) {
        return badRequest('Say why this reply is being set aside.');
      }
      const response = await getResponse(client, member.workspaceId, id);
      if (!response) {
        return Response.json({ error: 'That reply no longer exists.' }, { status: 404 });
      }
      const rejected = await updateResponse(client, member.workspaceId, id, {
        status: 'rejected',
        processed_at: new Date().toISOString(),
      });
      await appendEvent(client, member.workspaceId, {
        kind: otherEventKind('RATE_RESPONSE_REJECTED'),
        customer_profile_id: response.customer_profile_id,
        request_id: response.request_id,
        response_id: response.id,
        period_id: null,
        invoice_key: null,
        detail: `Set aside: ${reason}`,
        actor: member.email ?? member.id,
      });
      return Response.json({ response: rejected });
    },
    { write: true },
  );
}
