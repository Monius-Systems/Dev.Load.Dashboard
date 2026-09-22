import type { EntityRef, ToolDefinition } from '@/lib/operator/types';
import {
  CLAIM_TIMEOUT_MS,
  dayHeadline,
  dayKey,
  dayProblems,
  formatNumber,
  inputHash,
  runsOfDay,
  summarizeByTruck,
  summarizeDays,
  truckDays,
  type MileageDay,
  type TruckDay,
} from '@/lib/load-desk/mileage';
import { normalizeKey, type TruckProfile } from '@/lib/load-desk/profiles';
import { getDay, getRouteModes, listDays, listTrucks, recordsForDay } from '@/lib/server/mileage-store';
import { mileageDayRef, truckRef } from './refs';
import {
  dateRange,
  dayView,
  deps,
  FREE_OUTPUT,
  isoDate,
  parser,
  readTool,
  rangeWords,
  requiredDate,
  requiredText,
  strictInput,
} from './shared';

// Mileage: what one truck drove on one day, what a stretch of days adds up to,
// and what the fuel came to. Every figure is the stored one — the route miles
// a provider answered and the app worked out — and nothing here recalculates
// anything. A day that cannot be worked out says what is the matter with it
// in `dayProblems`, the same words the Mileage page shows.

/** The most legs one day's answer spells out. */
const MAX_LEGS = 40;
/** The most truck numbers offered when a number matches nothing. */
const MAX_TRUCK_HINTS = 20;
/** A day whose miles run this far above the middle of the range is worth a look. */
const ANOMALY_FACTOR = 1.6;

const findTruck = (trucks: TruckProfile[], truckNumber: string): TruckProfile | null => {
  const wanted = normalizeKey(truckNumber);
  return trucks.find((truck) => normalizeKey(truck.truck_number) === wanted) ?? null;
};

const unknownTruck = (trucks: TruckProfile[], truckNumber: string) => ({
  kind: 'read' as const,
  data: {
    found: false,
    truck_number: truckNumber,
    known_truck_numbers: trucks.slice(0, MAX_TRUCK_HINTS).map((truck) => truck.truck_number),
  },
  summary: `No truck numbered ${truckNumber} in this workspace.`,
  entities: [],
});

/** A day whose calculation was claimed and never came back. */
const isStuck = (day: MileageDay | undefined, now: Date) =>
  day?.status === 'calculating' &&
  day.calc_started_at !== null &&
  now.getTime() - Date.parse(day.calc_started_at) > CLAIM_TIMEOUT_MS;

// ------------------------------------------------------------- one day

type DayInput = { truck_number: string; date: string };

export const getMileageDay: ToolDefinition = readTool<DayInput>({
  name: 'get_mileage_day',
  description:
    'One truck on one day: the miles and fuel stored for it, what is the matter with it if anything, the runs it made and the ways they were driven.',
  input: strictInput({
    truck_number: { type: 'string', description: 'The truck number, as it is printed.', maxLength: 40 },
    date: { type: 'string', description: 'The service date, as 2026-09-22.' },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'mileage.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<DayInput>((fields) => ({
    truck_number: requiredText(fields, 'truck_number', 40),
    date: requiredDate(fields, 'date'),
  })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const trucks = await listTrucks(client, ctx.workspaceId);
    const truck = findTruck(trucks, input.truck_number);
    if (!truck) return unknownTruck(trucks, input.truck_number);

    const stored = await getDay(client, ctx.workspaceId, truck.id, input.date);
    const dayRecords = await recordsForDay(client, ctx.workspaceId, input.date);
    const expected: TruckDay =
      truckDays(dayRecords, trucks, { from: input.date, to: input.date }).days.find(
        (candidate) => candidate.truck_id === truck.id,
      ) ??
      // No ticket puts this truck on that day; the hash is the one an empty
      // day would carry, so `dayView` reads a stored row against it fairly.
      {
        key: dayKey(truck.id, input.date),
        truck_id: truck.id,
        truck_number: truck.truck_number,
        date: input.date,
        records: [],
        input_hash: inputHash([], truck.id),
      };

    const row = stored ?? undefined;
    const stuck = isStuck(row, ctx.now);
    const problems = dayProblems(row, expected, truck, { stuck });
    const headline = dayHeadline(row, expected, truck, { stuck });
    const runs = stored ? runsOfDay(stored.legs) : [];
    const modes = runs.length
      ? await getRouteModes(client, ctx.workspaceId, runs.map((run) => run.route_id))
      : {};

    return {
      kind: 'read',
      data: {
        found: true,
        truck: { id: truck.id, truck_number: truck.truck_number, nickname: truck.nickname },
        date: input.date,
        headline,
        expected_tickets: expected.records.length,
        day: stored ? dayView(stored) : null,
        problems,
        runs: runs.map((run) => ({
          seq: run.seq,
          route_id: run.route_id,
          from: run.from.name ?? run.from.label,
          to: run.to.name ?? run.to.label,
          miles: run.miles,
          uses: run.uses,
          driven_as: modes[String(run.route_id)] ?? 'truck',
        })),
        legs: (stored?.legs ?? []).slice(0, MAX_LEGS).map((leg) => ({
          seq: leg.seq,
          kind: leg.kind,
          ticket_id: leg.ticket_id,
          from: leg.from.label,
          to: leg.to.label,
          miles: leg.miles,
        })),
        legs_truncated: (stored?.legs.length ?? 0) > MAX_LEGS,
      },
      summary:
        `Truck ${truck.truck_number} on ${input.date}: ${headline}` +
        `${stored?.total_miles !== null && stored?.total_miles !== undefined ? `, ${formatNumber(stored.total_miles)} miles` : ''}` +
        `${problems.length ? `, ${problems.length} problems` : ''}.`,
      entities: [
        mileageDayRef(truck.id, truck.truck_number, input.date),
        truckRef(truck.id, truck.truck_number),
      ],
    };
  },
});

// ------------------------------------------------------- a truck's days

type TruckInput = { truck_number: string; from: string | null; to: string | null };

export const getTruckMileage: ToolDefinition = readTool<TruckInput>({
  name: 'get_truck_mileage',
  description:
    'One truck over a stretch of days: the miles and status of each day, the totals, and any day whose miles stand well above the rest.',
  input: strictInput({
    truck_number: { type: 'string', description: 'The truck number, as it is printed.', maxLength: 40 },
    from: { type: ['string', 'null'], description: 'First service date, as 2026-09-01.' },
    to: { type: ['string', 'null'], description: 'Last service date, as 2026-09-30.' },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'mileage.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<TruckInput>((fields) => ({
    truck_number: requiredText(fields, 'truck_number', 40),
    from: isoDate(fields, 'from'),
    to: isoDate(fields, 'to'),
  })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const trucks = await listTrucks(client, ctx.workspaceId);
    const truck = findTruck(trucks, input.truck_number);
    if (!truck) return unknownTruck(trucks, input.truck_number);
    const range = dateRange(input.from, input.to, ctx.now, 30);
    const days = (await listDays(client, ctx.workspaceId, range.from, range.to)).filter(
      (day) => day.truck_id === truck.id,
    );
    const summary = summarizeDays(days, range.from, range.to);

    // The middle day of the range, not the average: one 600-mile day would
    // pull an average up until nothing looked unusual beside it.
    const miles = days
      .map((day) => day.total_miles)
      .filter((value): value is number => value !== null)
      .sort((a, b) => a - b);
    const median = miles.length ? miles[Math.floor(miles.length / 2)] : 0;
    const unusual = days
      .filter((day) => median > 0 && (day.total_miles ?? 0) > median * ANOMALY_FACTOR)
      .map((day) => ({ date: day.service_date, miles: day.total_miles }));

    return {
      kind: 'read',
      data: {
        truck: { id: truck.id, truck_number: truck.truck_number },
        range: { from: range.from, to: range.to, clamped: range.clamped },
        summary,
        median_miles: median,
        unusual_days: unusual,
        days: days.map(dayView),
      },
      summary:
        `Truck ${truck.truck_number}, ${rangeWords(range)}: ${formatNumber(summary.miles)} miles over ${summary.days} days` +
        `${unusual.length ? `, ${unusual.length} unusually long` : ''}.`,
      entities: [truckRef(truck.id, truck.truck_number)],
    };
  },
});

// ---------------------------------------------------------- fuel usage

type FuelInput = { from: string | null; to: string | null };

export const getFuelUsage: ToolDefinition = readTool<FuelInput>({
  name: 'get_fuel_usage',
  description:
    'Estimated fuel and miles per truck over a stretch of days, from the stored route miles and each truck’s average MPG.',
  input: strictInput({
    from: { type: ['string', 'null'], description: 'First service date, as 2026-09-01.' },
    to: { type: ['string', 'null'], description: 'Last service date, as 2026-09-30.' },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'mileage.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<FuelInput>((fields) => ({
    from: isoDate(fields, 'from'),
    to: isoDate(fields, 'to'),
  })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const range = dateRange(input.from, input.to, ctx.now, 30);
    const days = await listDays(client, ctx.workspaceId, range.from, range.to);
    const perTruck = summarizeByTruck(days, range.from, range.to);
    const total = summarizeDays(days, range.from, range.to);
    const entities: EntityRef[] = perTruck
      .slice(0, MAX_TRUCK_HINTS)
      .map((truck) => truckRef(truck.truck_id, truck.truck_number));
    return {
      kind: 'read',
      data: {
        range: { from: range.from, to: range.to, clamped: range.clamped },
        total,
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
      summary: `${formatNumber(total.miles)} miles and ${formatNumber(total.gallons)} estimated gallons over ${perTruck.length} trucks, ${rangeWords(range)}.`,
      entities,
    };
  },
});

export const MILEAGE_TOOLS: ToolDefinition[] = [getMileageDay, getTruckMileage, getFuelUsage];
