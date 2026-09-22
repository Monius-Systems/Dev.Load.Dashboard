import { dayHeadline, truckDays, type MileageDay, type TruckDay } from '@/lib/load-desk/mileage';
import { normalizeKey, type TruckProfile } from '@/lib/load-desk/profiles';
import type { EntityRef, ToolContext, ToolImpact, ToolResult } from '@/lib/operator/types';
import { listRecordsBetween } from '@/lib/server/load-desk-store';
import { recalculateDay } from '@/lib/server/mileage-calc';
import { getDay, listTrucks } from '@/lib/server/mileage-store';
import { reReadDay } from '@/lib/server/operator/verify';
import { mileageDayRef } from './refs';
import {
  daysBetween,
  defineAction,
  deps,
  isObject,
  isoDate,
  nothingVerified,
  plural,
  recordAction,
  settle,
  shortText,
  stateHash,
  verifyAll,
  type ActionDeps,
  type Parsed,
} from './shared';

// Working the miles out again for a day, or a few.
//
// The whole calculation is `recalculateDay`'s, and this tool decides only
// which truck-days to ask about and what to make of the answers. Which days
// exist at all is the tickets' business: `truckDays` is the same grouping the
// mileage page shows, so a day the Operator recalculates is a day a person can
// see.
//
// One judgement is made here. A day already worked out from unchanged tickets
// is handed straight back by `dayIsUpToDate`, which is right for a page
// refreshing itself and wrong for somebody asking for the day to be done
// again. So a day that is already 'current' is forced. Forcing asks the
// provider for the legs again; it does not discard a route somebody chose,
// which the calculation keeps by design. A day that is stale, failed or
// waiting is not forced — it would be worked out anyway, and the cached legs
// are what make that cheap.

/** The most truck-days one call will work out. */
const MAX_DAYS = 10;

export type RecalculateMileageInput = {
  truck_number: string | null;
  date: string | null;
  from: string | null;
  to: string | null;
};

type Plan = {
  range: { from: string; to: string } | null;
  truck: TruckProfile | null;
  trucks: TruckProfile[];
  days: TruckDay[];
  blockers: string[];
};

const dayLabel = (day: TruckDay) => `Truck ${day.truck_number} on ${day.date}`;

const refOf = (day: TruckDay): EntityRef =>
  mileageDayRef(day.truck_id, day.truck_number, day.date);

/** Which truck-days the request names, and what stands in the way of them. */
async function plan(
  input: RecalculateMileageInput,
  ctx: ToolContext,
  given: ActionDeps,
): Promise<Plan> {
  const blockers: string[] = [];
  if (!given.routing) blockers.push('Routing is not configured');
  const range =
    input.date !== null
      ? { from: input.date, to: input.date }
      : input.from !== null && input.to !== null
        ? { from: input.from, to: input.to }
        : null;
  if (!range) {
    blockers.push('Give a day, or a from and a to.');
    return { range: null, truck: null, trucks: [], days: [], blockers };
  }
  if (range.from > range.to) {
    blockers.push('The range starts after it ends.');
    return { range, truck: null, trucks: [], days: [], blockers };
  }
  if (daysBetween(range.from, range.to) + 1 > MAX_DAYS) {
    blockers.push(`That is more than ${MAX_DAYS} days; ask for a shorter range.`);
    return { range, truck: null, trucks: [], days: [], blockers };
  }
  const trucks = await listTrucks(given.client, ctx.workspaceId);
  let truck: TruckProfile | null = null;
  if (input.truck_number !== null) {
    truck =
      trucks.find(
        (known) => normalizeKey(known.truck_number) === normalizeKey(input.truck_number ?? ''),
      ) ?? null;
    if (!truck) blockers.push(`No truck ${input.truck_number}`);
  }
  const records = await listRecordsBetween(given.client, ctx.workspaceId, range.from, range.to, 500);
  const found = truckDays(records, trucks, range).days.filter(
    (day) => truck === null || day.truck_id === truck.id,
  );
  if (found.length > MAX_DAYS) {
    blockers.push(
      `That is ${found.length} truck-days; ask for at most ${MAX_DAYS}, or name one truck.`,
    );
  }
  if (!found.length && !blockers.length) blockers.push('No truck hauled on those days.');
  return { range, truck, trucks, days: found, blockers };
}

const parse = (args: unknown): Parsed<RecalculateMileageInput> => {
  if (!isObject(args)) return { error: 'Expected a truck, a day or a range.' };
  const truckNumber = args.truck_number === null ? null : shortText(args.truck_number, 40);
  if (args.truck_number !== null && truckNumber === null) {
    return { error: 'truck_number must be a truck number, or null for every truck.' };
  }
  const read = (value: unknown, name: string): Parsed<string | null> => {
    if (value === null) return { value: null };
    const day = isoDate(value);
    return day ? { value: day } : { error: `${name} must be a date as YYYY-MM-DD, or null.` };
  };
  const date = read(args.date, 'date');
  if ('error' in date) return date;
  const from = read(args.from, 'from');
  if ('error' in from) return from;
  const to = read(args.to, 'to');
  if ('error' in to) return to;
  if (date.value === null && (from.value === null) !== (to.value === null)) {
    return { error: 'A range needs both from and to.' };
  }
  return {
    value: {
      truck_number: truckNumber,
      date: date.value,
      from: from.value,
      to: to.value,
    },
  };
};

async function dryRun(
  input: RecalculateMileageInput,
  ctx: ToolContext,
  given: ActionDeps,
): Promise<ToolImpact> {
  const found = await plan(input, ctx, given);
  return {
    records: found.blockers.length ? 0 : found.days.length,
    // Mileage is worked out from tickets and never writes one, so no invoice
    // can be reached from here.
    touches_finalized: false,
    lines: found.days.length
      ? [`${plural(found.days.length, 'truck-day')}`, ...found.days.slice(0, 5).map(dayLabel)]
      : ['Nothing to work out'],
    affected: found.days.map(refOf),
    blockers: found.blockers,
    state_hash: stateHash([
      found.range,
      found.truck?.id ?? null,
      found.days.map((day) => [day.key, day.input_hash]),
    ]),
  };
}

async function handler(
  input: RecalculateMileageInput,
  ctx: ToolContext,
  given: ActionDeps,
): Promise<ToolResult> {
  const workspace = ctx.workspaceId;
  const found = await plan(input, ctx, given);
  const routing = given.routing;
  if (found.blockers.length || !routing) {
    return {
      kind: 'action',
      outcome: 'refused',
      succeeded: [],
      failed: [],
      not_attempted: found.days.map(refOf),
      verification: nothingVerified(),
      summary: (found.blockers.length ? found.blockers : ['Routing is not configured']).join(' '),
      entities: found.days.map(refOf),
    };
  }
  const byId = new Map(found.trucks.map((truck) => [truck.id, truck]));
  const succeeded: EntityRef[] = [];
  const failed: { entity: EntityRef; reason: string }[] = [];
  const notAttempted: EntityRef[] = [];
  const checks: { label: string; ok: boolean }[] = [];
  const headlines: string[] = [];
  for (const day of found.days) {
    const truck = byId.get(day.truck_id);
    const ref = refOf(day);
    if (!truck) {
      notAttempted.push(ref);
      continue;
    }
    const before = await getDay(given.client, workspace, truck.id, day.date);
    // See the note at the top: only a day that is already settled needs forcing.
    const force = before?.status === 'current';
    let result: MileageDay | null = null;
    try {
      result = await recalculateDay(given.client, workspace, routing, found.trucks, truck, day.date, {
        force,
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'The day could not be worked out.';
      failed.push({ entity: ref, reason });
      checks.push({ label: `${dayLabel(day)}: ${reason}`, ok: false });
      continue;
    }
    const after = await reReadDay(given.client, workspace, truck.id, day.date);
    if (result === null) {
      // The truck has no tickets that day any more, so the row is gone. That is
      // the right answer, and the re-read confirms it.
      const ok = after === null;
      checks.push({ label: `${dayLabel(day)}: the day should have been removed.`, ok });
      if (ok) succeeded.push(ref);
      else failed.push({ entity: ref, reason: 'The day was removed but is still on file.' });
      continue;
    }
    const settledStatus = after?.status === 'current' || after?.status === 'needs_review';
    const advanced =
      after !== null &&
      (before?.calculated_at ?? '') !== (after.calculated_at ?? '') &&
      after.calculated_at !== null;
    const ok = settledStatus && (advanced || after.status === 'current');
    const headline = after ? dayHeadline(after, day, truck) : 'could_not_update';
    headlines.push(`${dayLabel(day)}: ${headline.replace(/_/g, ' ')}`);
    checks.push({ label: `${dayLabel(day)}: ${headline.replace(/_/g, ' ')}`, ok });
    if (ok) succeeded.push(ref);
    else failed.push({ entity: ref, reason: `The day reads back as ${after?.status ?? 'missing'}.` });
  }
  const verification = verifyAll(checks);
  const summary = `${plural(succeeded.length, 'truck-day')} worked out${
    failed.length ? `, ${failed.length} could not be` : ''
  }.${headlines.length ? ` ${headlines.slice(0, 5).join('; ')}.` : ''}`;
  await recordAction(given.client, workspace, ctx, {
    tool: 'recalculate_mileage',
    summary,
    affected: succeeded.map((entity) => entity.id),
  });
  return {
    kind: 'action',
    outcome: settle(succeeded, failed, notAttempted),
    succeeded,
    failed,
    not_attempted: notAttempted,
    verification,
    summary,
    entities: found.days.map(refOf),
  };
}

export const recalculateMileage = defineAction<RecalculateMileageInput>({
  name: 'recalculate_mileage',
  description:
    'Work the miles out again for one truck-day, or for a range of at most ten days. With no ' +
    'truck, every truck that hauled on those days. Routes a person has chosen are kept.',
  input: {
    type: 'object',
    properties: {
      truck_number: {
        type: ['string', 'null'],
        description: 'The truck number, or null for every truck that hauled.',
      },
      date: { type: ['string', 'null'], description: 'One day as YYYY-MM-DD, or null.' },
      from: { type: ['string', 'null'], description: 'The first day of a range, or null.' },
      to: { type: ['string', 'null'], description: 'The last day of a range, or null.' },
    },
    required: ['truck_number', 'date', 'from', 'to'],
    additionalProperties: false,
  },
  output: {
    type: 'object',
    properties: { outcome: { type: 'string' }, summary: { type: 'string' } },
    required: ['outcome', 'summary'],
    additionalProperties: false,
  },
  type: 'write',
  permission: 'mileage.recalculate',
  risk: 1,
  confirmation: 'conditional',
  maxRecords: MAX_DAYS,
  parse,
  dryRun: (input, ctx, given) => dryRun(input, ctx, deps(given)),
  handler: (input, ctx, given) => handler(input, ctx, deps(given)),
});
