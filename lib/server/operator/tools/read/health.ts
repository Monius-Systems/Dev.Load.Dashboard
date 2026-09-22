import type { ToolDefinition } from '@/lib/operator/types';
import { CLAIM_TIMEOUT_MS } from '@/lib/load-desk/mileage';
import { ticketsNeedingReview } from '@/lib/load-desk/overview';
import { listRecordsBetween } from '@/lib/server/load-desk-store';
import { listRequests } from '@/lib/server/rates-store';
import { listDays } from '@/lib/server/mileage-store';
import { openaiKey } from '@/lib/server/openai-key';
import { routingProvider } from '@/lib/server/routing-provider';
import { deps, FREE_OUTPUT, isoDay, NO_INPUT, parser, readTool, shiftDays } from './shared';

// Whether the machinery is working: is a reader configured, is a map
// configured, is anything stuck, is anything overdue.
//
// Configuration is reported as a yes or a no and never as a value. The keys
// are the deployment's, not the workspace's, and a tool that could read one
// back would be a way to exfiltrate it through a conversation.

/** How far back a stuck or failed mileage day is still worth reporting. */
const MILEAGE_DAYS = 30;
const TICKET_DAYS = 7;
const READ_LIMIT = 500;

/** A request nobody has settled, which a chase would still be about. */
const OPEN_REQUEST = new Set([
  'DRAFT',
  'READY_TO_SEND',
  'SENT',
  'WAITING_FOR_REPLY',
  'RESPONSE_RECEIVED',
  'AI_PROCESSING',
  'NEEDS_CONFIRMATION',
  'FOLLOW_UP_DUE',
]);

type Input = Record<string, never>;

export const getSystemHealth: ToolDefinition = readTool<Input>({
  name: 'get_system_health',
  description:
    'Whether the parts are working: reading and routing configured, mail still draft-only, mileage days stuck or failed, rate follow-ups overdue and tickets waiting to be checked.',
  input: NO_INPUT,
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'system.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<Input>(() => ({}) as Input),
  handler: async (_input, ctx, given) => {
    const { client } = deps(given);
    const today = isoDay(ctx.now);
    const days = await listDays(
      client,
      ctx.workspaceId,
      shiftDays(today, -(MILEAGE_DAYS - 1)),
      today,
    );
    const requests = await listRequests(client, ctx.workspaceId);
    const records = await listRecordsBetween(
      client,
      ctx.workspaceId,
      shiftDays(today, -(TICKET_DAYS - 1)),
      today,
      READ_LIMIT,
    );
    const now = ctx.now.getTime();
    const stuck = days.filter(
      (day) =>
        day.status === 'calculating' &&
        day.calc_started_at !== null &&
        now - Date.parse(day.calc_started_at) > CLAIM_TIMEOUT_MS,
    ).length;
    const failed = days.filter((day) => day.status === 'failed').length;
    const overdue = requests.filter(
      (request) =>
        OPEN_REQUEST.has(request.status) &&
        request.follow_up_due_at !== null &&
        Date.parse(request.follow_up_due_at) <= now,
    ).length;
    const waiting = ticketsNeedingReview(records).length;

    const data = {
      ai_configured: openaiKey() !== null,
      routing_configured: routingProvider() !== null,
      // No send path exists in this build; the Operator can draft and nothing more.
      mail: 'draft_only' as const,
      stuck_mileage_days: stuck,
      failed_mileage_days: failed,
      overdue_rate_followups: overdue,
      tickets_needing_review_7d: waiting,
    };
    const trouble = stuck + failed + overdue;
    return {
      kind: 'read',
      data,
      summary: trouble
        ? `${stuck} stuck and ${failed} failed mileage days, ${overdue} overdue rate follow-ups.`
        : 'Nothing stuck, nothing failed, no overdue follow-ups.',
      entities: [],
    };
  },
});

export const HEALTH_TOOLS: ToolDefinition[] = [getSystemHealth];
