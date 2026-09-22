import type { ToolDefinition } from '@/lib/operator/types';
import { cachedOverview } from '@/lib/server/operator/context';
import { deps, FREE_OUTPUT, NO_INPUT, parser, readTool } from './shared';

// The same seven figures the model is given at the start of a run, asked for
// again as structured data. A run that has been going a while, or one that
// has just changed something, wants the state of the business rather than the
// state it was in when the run began.

type Input = Record<string, never>;

export const getBusinessOverview: ToolDefinition = readTool<Input>({
  name: 'get_business_overview',
  description:
    'The state of the business right now: tickets this week, invoice readiness over the last 60 days, open rate requests, mileage this week, the exception backlog and active trucks.',
  input: NO_INPUT,
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'system.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<Input>(() => ({}) as Input),
  handler: async (_input, ctx, given) => {
    const { client } = deps(given);
    const figures = await cachedOverview(client, ctx.workspaceId, ctx.now);
    const waiting =
      figures.invoices === null
        ? null
        : figures.invoices.waiting_for_rate + figures.invoices.waiting_for_fuel;
    return {
      kind: 'read',
      data: figures,
      summary:
        `${figures.tickets?.total ?? 0} tickets in the last 7 days, ` +
        `${figures.tickets?.needing_review ?? 0} needing review; ` +
        `${waiting ?? 0} invoices waiting on a rate.`,
      entities: [],
    };
  },
});

export const OVERVIEW_TOOLS: ToolDefinition[] = [getBusinessOverview];
