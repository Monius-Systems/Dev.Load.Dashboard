import { noStore } from '@/lib/server/auth';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { businessSnapshot } from '@/lib/server/operator/context';
import { agentModel } from '@/lib/server/operator/provider';
import { confirmAction } from '@/lib/server/operator/run';
import { runStore } from '@/lib/server/operator/store';
import { toolRegistry } from '@/lib/server/operator/tools/index';
import { routingProvider } from '@/lib/server/routing-provider';

/**
 * The person pressed the button: { action_id }.
 *
 * That identifier is the whole of what is taken from the browser. Which tool
 * runs, with which arguments, against which records, and what it was previewed
 * as doing are the ones the server stored when it asked — so a confirmation
 * cannot be turned into a different action by editing the request.
 *
 * No model is called here, but one is still required: an Operator that is not
 * configured on this deployment has nothing waiting to confirm.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function POST(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      let sent: Record<string, unknown>;
      try {
        sent = await boundedJson(request, 2_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const actionId = typeof sent.action_id === 'string' ? sent.action_id.trim() : '';
      if (!UUID.test(actionId)) return badRequest('That is not an action to confirm.');

      const model = agentModel();
      if (!model) {
        return Response.json(
          { error: 'The Operator is not configured on this deployment.' },
          { status: 503, headers: noStore },
        );
      }

      const response = await confirmAction(
        {
          client,
          member: { workspaceId: member.workspaceId, id: member.id },
          registry: toolRegistry(),
          model,
          store: runStore,
          routing: routingProvider(),
          snapshot: businessSnapshot,
        },
        actionId,
      );
      return Response.json(response, { headers: noStore });
    },
    { write: true },
  );
}
