import { boundedJson } from '@/lib/server/json';
import { createProfile, listProfiles } from '@/lib/server/load-desk-store';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { parseProfileBody } from '@/lib/load-desk/record-input';

/** Customer and truck profiles, and the invoice address, for the workspace. */
export function GET(request: Request) {
  return memberRoute(request, async (client, member) =>
    Response.json(await listProfiles(client, member.workspaceId)),
  );
}

/** Adds a customer, a truck or the company profile: { kind, profile }. */
export function POST(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      let body: Record<string, unknown>;
      try {
        body = await boundedJson(request, 32_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const parsed = parseProfileBody(body);
      if ('error' in parsed) return badRequest(parsed.error);
      const id = await createProfile(client, member.workspaceId, parsed.value.kind, parsed.value.profile);
      return Response.json({ id }, { status: 201 });
    },
    { write: true },
  );
}
