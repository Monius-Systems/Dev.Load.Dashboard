import { noStore } from '@/lib/server/auth';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { businessSnapshot } from '@/lib/server/operator/context';
import { INSPECTIONS, inspectionNamed, runInspection } from '@/lib/server/operator/inspections';
import { agentModel } from '@/lib/server/operator/provider';
import { runStore } from '@/lib/server/operator/store';
import { toolRegistry } from '@/lib/server/operator/tools/index';
import { routingProvider } from '@/lib/server/routing-provider';

/**
 * The standing questions, and the one way to ask one.
 *
 * GET lists them. POST { name } runs that one, now, as the signed-in member:
 * the same client, the same registry, the same policy and the same audit trail
 * as a question typed into the panel, because an inspection is a question and
 * nothing more. There is no scheduler behind this route; nothing here runs on
 * a page load, on a timer or on anybody's behalf but the person who pressed
 * the button.
 */

export function GET(request: Request) {
  return memberRoute(request, async () =>
    Response.json(
      {
        inspections: INSPECTIONS.map(({ name, label, cadence, question }) => ({
          name,
          label,
          cadence,
          question,
        })),
      },
      { headers: noStore },
    ),
  );
}

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
      const inspection =
        typeof sent.name === 'string' ? inspectionNamed(sent.name) : null;
      if (!inspection) return badRequest('Unknown inspection.');

      const model = agentModel();
      if (!model) {
        return Response.json(
          { error: 'The Operator is not configured on this deployment.' },
          { status: 503, headers: noStore },
        );
      }

      const response = await runInspection(
        {
          client,
          member: { workspaceId: member.workspaceId, id: member.id },
          registry: toolRegistry(),
          model,
          store: runStore,
          routing: routingProvider(),
          snapshot: businessSnapshot,
        },
        inspection.name,
      );
      return Response.json(response, { headers: noStore });
    },
    { write: true },
  );
}
