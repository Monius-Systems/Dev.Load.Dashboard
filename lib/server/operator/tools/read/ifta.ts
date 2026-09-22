import type { ToolDefinition } from '@/lib/operator/types';
import {
  dayView,
  formatNumber,
  isQuarterKey,
  periodRange,
  quarterKeyOf,
  quarterLabel,
  quarterRangeOf,
  summarizeByTruck,
  summarizeDays,
  truckDays,
  truckIfta,
} from '@/lib/load-desk/mileage';
import { listProfiles, listRecordsBetween } from '@/lib/server/load-desk-store';
import { listDays } from '@/lib/server/mileage-store';
import { truckRef } from './refs';
import {
  bounded,
  deps,
  FREE_OUTPUT,
  parser,
  readTool,
  refuse,
  strictInput,
} from './shared';

// IFTA: what a quarter adds up to per truck, and how much of it is settled.
//
// The readiness figures are the IFTA page's own: every truck-day the tickets
// say the quarter has, read against the day stored for it with `dayView`. The
// quarter is at most 92 days, so one bounded read of the tickets covers it.

const READ_LIMIT = 1000;
const MAX_LISTED = 20;

type Input = { quarter: string | null };

export const getIftaStatus: ToolDefinition = readTool<Input>({
  name: 'get_ifta_status',
  description:
    'A quarter for fuel-tax reporting: miles and estimated gallons per truck, and how many of the quarter’s truck-days are settled, waiting, up for review or failed.',
  input: strictInput({
    quarter: { type: ['string', 'null'], description: 'A quarter like 2026-Q3, or null for the current one.' },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'ifta.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<Input>((fields) => {
    const quarter = bounded(fields, 'quarter', 10);
    if (quarter !== null && !isQuarterKey(quarter)) refuse('quarter must read like 2026-Q3.');
    return { quarter };
  }),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const quarter = input.quarter ?? quarterKeyOf(periodRange('quarter', ctx.now).from);
    const range = quarterRangeOf(quarter) ?? periodRange('quarter', ctx.now);
    const days = await listDays(client, ctx.workspaceId, range.from, range.to);
    const records = await listRecordsBetween(client, ctx.workspaceId, range.from, range.to, READ_LIMIT);
    const { trucks } = await listProfiles(client, ctx.workspaceId);

    const stored = new Map(days.map((day) => [`${day.truck_id}|${day.service_date}`, day]));
    const expected = truckDays(records, trucks, range);
    const readiness = { complete: 0, review: 0, failed: 0, waiting: 0 };
    for (const day of expected.days) {
      const view = dayView(stored.get(day.key), day.input_hash);
      if (view === 'current') readiness.complete += 1;
      else if (view === 'needs_review') readiness.review += 1;
      else if (view === 'failed') readiness.failed += 1;
      else readiness.waiting += 1;
    }

    const perTruck = summarizeByTruck(days, range.from, range.to);
    const total = summarizeDays(days, range.from, range.to);
    const active = trucks.filter((truck) => truck.active);
    return {
      kind: 'read',
      data: {
        quarter,
        label: quarterLabel(quarter),
        range,
        total,
        readiness,
        expected_days: expected.days.length,
        tickets_not_counted: expected.excluded.length,
        trucks_without_yard: active
          .filter((truck) => !truck.ifta?.yard_address)
          .map((truck) => truck.truck_number),
        trucks_without_mpg: active
          .filter((truck) => !((truckIfta(truck).mpg ?? 0) > 0))
          .map((truck) => truck.truck_number),
        trucks: perTruck.map((truck) => ({
          truck_id: truck.truck_id,
          truck_number: truck.truck_number,
          miles: truck.miles,
          est_gallons: truck.gallons,
          loads: truck.loads,
          days: truck.days,
          days_for_review: truck.review,
        })),
      },
      summary:
        `${quarterLabel(quarter)}: ${formatNumber(total.miles)} miles over ${perTruck.length} trucks; ` +
        `${readiness.complete} of ${expected.days.length} truck-days settled.`,
      entities: perTruck
        .slice(0, MAX_LISTED)
        .map((truck) => truckRef(truck.truck_id, truck.truck_number)),
    };
  },
});

export const IFTA_TOOLS: ToolDefinition[] = [getIftaStatus];
