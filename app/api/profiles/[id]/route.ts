import { boundedJson } from '@/lib/server/json';
import { deleteProfile, updateProfile } from '@/lib/server/load-desk-store';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { parseProfileBody, routeId } from '@/lib/load-desk/record-input';

type Context = { params: Promise<{ id: string }> };

/** Replaces a customer, truck or company profile: { kind, profile }. */
export async function PUT(request: Request, { params }: Context) {
  const id = routeId((await params).id);
  return memberRoute(
    request,
    async (client, member) => {
      if (id === null) return badRequest('Invalid profile id.');
      let body: Record<string, unknown>;
      try {
        body = await boundedJson(request, 32_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const parsed = parseProfileBody(body);
      if ('error' in parsed) return badRequest(parsed.error);
      await updateProfile(client, member.workspaceId, id, parsed.value.kind, parsed.value.profile);
      return Response.json({ ok: true });
    },
    { write: true },
  );
}

export async function DELETE(request: Request, { params }: Context) {
  const id = routeId((await params).id);
  return memberRoute(
    request,
    async (client, member) => {
      if (id === null) return badRequest('Invalid profile id.');
      await deleteProfile(client, member.workspaceId, id);
      return Response.json({ ok: true });
    },
    { write: true },
  );
}
