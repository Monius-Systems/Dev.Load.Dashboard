import {
  AUTONOMY_MODES,
  READ_PERMISSIONS,
  WRITE_PERMISSIONS,
  type AutonomyMode,
  type WritePermission,
} from '@/lib/operator/types';
import { noStore } from '@/lib/server/auth';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { getSettings, putSettings } from '@/lib/server/operator/store';

// How far the Operator may go in this workspace, and which writes it has been
// allowed to make. These are facts about the workspace: they are read here,
// changed here, and nowhere else. No run, no tool result and no model output
// can reach this route, which is the whole point of it being a route.
//
// Any member of the workspace may change them. This app has no roles model —
// there is a workspace_members table and nothing above it — so "the people who
// can see the data" and "the people who can decide what the Operator does with
// it" are the same set. That is a documented gap, not an oversight: when roles
// arrive, the check belongs here and in memberRoute, not in the policy.

/** The settings screen's whole vocabulary, so the client hardcodes nothing. */
export function GET(request: Request) {
  return memberRoute(request, async (client, member) => {
    const settings = await getSettings(client, member.workspaceId);
    return Response.json(
      {
        settings,
        permissions: { reads: READ_PERMISSIONS, writes: WRITE_PERMISSIONS },
        modes: AUTONOMY_MODES,
      },
      { headers: noStore },
    );
  });
}

/**
 * Changes the mode, the granted writes, or both. What is left out is left
 * alone, so the screen can save one switch at a time. The values themselves
 * are checked in the store, which is the side the enforcement reads from.
 */
export function PUT(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      let body: Record<string, unknown>;
      try {
        body = await boundedJson(request, 4_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Expected a JSON object.');
      }
      const patch: { autonomy?: AutonomyMode; granted?: WritePermission[] } = {};
      if (body.autonomy !== undefined) {
        if (typeof body.autonomy !== 'string') return badRequest('Expected an autonomy mode.');
        patch.autonomy = body.autonomy as AutonomyMode;
      }
      if (body.granted !== undefined) {
        if (!Array.isArray(body.granted) || body.granted.some((e) => typeof e !== 'string')) {
          return badRequest('Expected a list of permissions.');
        }
        patch.granted = body.granted as WritePermission[];
      }
      const settings = await putSettings(client, member.workspaceId, patch, member.id);
      return Response.json({ settings }, { headers: noStore });
    },
    { write: true },
  );
}
