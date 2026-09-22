import { noStore } from '@/lib/server/auth';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { getRun, listActions, listRuns } from '@/lib/server/operator/store';

// What the Operator has done in this workspace: the runs, newest first, and
// for any one of them the audit rows its writes left behind.
//
// Reading only. This is the screen a person opens to check up on the agent,
// and checking up on it must never be a thing that costs a model call or
// changes anything — the trail is what it is, and the page that shows it is
// allowed to do nothing but read it.

/** How many runs a listing shows when the caller does not say. */
const DEFAULT_RUNS = 20;

/** A client-generated run id, as a uuid and nothing else. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function GET(request: Request) {
  return memberRoute(request, async (client, member) => {
    const url = new URL(request.url);
    const runId = url.searchParams.get('run_id');
    if (runId !== null) {
      if (!UUID.test(runId)) return badRequest('That is not a run.');
      const [run, actions] = await Promise.all([
        getRun(client, member.workspaceId, runId),
        listActions(client, member.workspaceId, { runId }),
      ]);
      if (!run) return Response.json({ error: 'No such run.' }, { status: 404, headers: noStore });
      return Response.json({ run, actions }, { headers: noStore });
    }
    const asked = Number(url.searchParams.get('limit') ?? DEFAULT_RUNS);
    const limit = Number.isFinite(asked) ? Math.trunc(asked) : DEFAULT_RUNS;
    const runs = await listRuns(client, member.workspaceId, limit);
    return Response.json({ runs }, { headers: noStore });
  });
}
