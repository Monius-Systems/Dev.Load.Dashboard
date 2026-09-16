import { deleteRecord } from '@/lib/server/load-desk-store';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { routeId } from '@/lib/load-desk/record-input';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = routeId((await params).id);
  return memberRoute(
    request,
    async (client, member) => {
      if (id === null) return badRequest('Invalid ticket id.');
      await deleteRecord(client, member.workspaceId, id);
      return Response.json({ ok: true });
    },
    { write: true },
  );
}
