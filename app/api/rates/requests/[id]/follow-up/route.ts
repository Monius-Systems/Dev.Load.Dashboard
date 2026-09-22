import { routeId } from '@/lib/load-desk/record-input';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { followUpDraft } from '@/lib/server/rate-requests';

/**
 * Writes the chaser, and only about what is still outstanding.
 *
 * A customer who answered two of three jobs answered two of three jobs: the
 * follow-up asks about the third and never re-asks what was already given,
 * which is the difference between a reminder and an insult. It is a new draft
 * on the same request, with the same subject so it stays in the same thread,
 * and it goes out the same way the first one did — which on this deployment
 * means a person sends it. The wording, and what counts as outstanding, are in
 * lib/server/rate-requests.ts, which the Operator's own chaser asks as well.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  return memberRoute(
    request,
    async (client, member) => {
      if (id === null) return badRequest('Invalid request id.');
      const chased = await followUpDraft(
        client,
        member.workspaceId,
        { id: member.id, email: member.email ?? null, workspaceId: member.workspaceId },
        id,
      );
      if (!chased.ok) return Response.json({ error: chased.error }, { status: chased.status });
      return Response.json({ request: chased.drafted });
    },
    { write: true },
  );
}
