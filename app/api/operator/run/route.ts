import { isEntityType } from '@/lib/operator/entities';
import { RUN_LIMITS } from '@/lib/operator/limits';
import type { EntityRef, OperatorRequest, OperatorTurn, PageContext } from '@/lib/operator/types';
import { noStore } from '@/lib/server/auth';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { businessSnapshot } from '@/lib/server/operator/context';
import { agentModel } from '@/lib/server/operator/provider';
import { runOperator } from '@/lib/server/operator/run';
import { runStore } from '@/lib/server/operator/store';
import { toolRegistry } from '@/lib/server/operator/tools/index';
import { routingProvider } from '@/lib/server/routing-provider';

/**
 * One turn of the Operator: { message, context, history }.
 *
 * The workspace is the signed-in member's and comes from nowhere else, the
 * history is whatever the panel is holding for this conversation — the server
 * keeps no chat state — and everything sent is bounded before a model is told
 * about any of it.
 */

const text = (value: unknown, max: number): string =>
  typeof value === 'string' ? value.slice(0, max) : '';

/** The page context, or an error naming what was wrong with it. */
function readContext(value: unknown): { value: PageContext | null } | { error: string } {
  if (value === null || value === undefined) return { value: null };
  if (typeof value !== 'object' || Array.isArray(value)) return { error: 'Invalid context.' };
  const given = value as { page?: unknown; entity?: unknown };
  const page = text(given.page, 200);
  const raw = given.entity;
  if (raw === null || raw === undefined) return { value: { page, entity: null } };
  if (typeof raw !== 'object' || Array.isArray(raw)) return { error: 'Invalid context entity.' };
  const entity = raw as { type?: unknown; id?: unknown; label?: unknown; href?: unknown };
  if (!isEntityType(entity.type)) return { error: 'Invalid context entity.' };
  const ref: EntityRef = {
    type: entity.type,
    id: text(entity.id, 200),
    label: text(entity.label, 200),
    href: typeof entity.href === 'string' ? entity.href.slice(0, 300) : null,
  };
  if (!ref.id) return { error: 'Invalid context entity.' };
  return { value: { page, entity: ref } };
}

function readRequest(sent: Record<string, unknown>):
  | { value: OperatorRequest }
  | { error: string } {
  const message = typeof sent.message === 'string' ? sent.message.trim() : '';
  if (!message) return { error: 'Ask the Operator something.' };
  if (message.length > RUN_LIMITS.maxMessageChars) {
    return { error: 'That message is too long for one turn.' };
  }
  const context = readContext(sent.context);
  if ('error' in context) return { error: context.error };

  const turns = sent.history;
  if (turns !== undefined && turns !== null && !Array.isArray(turns)) {
    return { error: 'Invalid history.' };
  }
  const history: OperatorTurn[] = [];
  for (const turn of Array.isArray(turns) ? turns : []) {
    if (!turn || typeof turn !== 'object' || Array.isArray(turn)) {
      return { error: 'Invalid history.' };
    }
    const { role, text: said } = turn as { role?: unknown; text?: unknown };
    if (role !== 'user' && role !== 'operator') return { error: 'Invalid history.' };
    history.push({ role, text: text(said, RUN_LIMITS.maxMessageChars) });
  }
  return { value: { message, context: context.value, history } };
}

export function POST(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      let sent: Record<string, unknown>;
      try {
        sent = await boundedJson(request, 64_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const parsed = readRequest(sent);
      if ('error' in parsed) return badRequest(parsed.error);

      const model = agentModel();
      if (!model) {
        return Response.json(
          { error: 'The Operator is not configured on this deployment.' },
          { status: 503, headers: noStore },
        );
      }

      const response = await runOperator(
        {
          client,
          member: { workspaceId: member.workspaceId, id: member.id },
          registry: toolRegistry(),
          model,
          store: runStore,
          routing: routingProvider(),
          snapshot: businessSnapshot,
        },
        parsed.value,
      );
      return Response.json(response, { headers: noStore });
    },
    { write: true },
  );
}
