// IFTA & Mileage: the arithmetic of a truck's day.
//
// From the tickets a truck hauled on one date, the day is Yard → pickup →
// delivery for each ticket in order → Yard. This module works out that plan,
// the keys the places and routes are cached under, the hashes that say when a
// stored day is out of date, and the fuel estimate. Nothing here talks to a
// provider or a database: the same functions run in the browser (to see which
// days need work) and on the server (to do it), and are covered by tests.

import { normalizeAddress, normalizeName } from './customer-rates.ts';
import { normalizeKey, truckIdFor } from './profiles.ts';
import type { TruckIfta, TruckProfile } from './profiles.ts';
import { ticketDateColumn } from './record-input.ts';
import type { SavedRecord, Ticket } from './types.ts';

/** Bumped when the plan or hash arithmetic changes, so every day recalculates. */
export const CALC_VERSION = 1;
/** Days one recalculate request may ask for. */
export const MAX_DAYS_PER_REQUEST = 25;
/** Tickets one truck-day may carry before it is sent for review instead. */
export const MAX_TICKETS_PER_DAY = 60;
/** A day's legs: two per ticket, and the two that start and end at the yard. */
export const MAX_LEGS_PER_DAY = MAX_TICKETS_PER_DAY * 2 + 2;
/** The widest span GET /api/mileage answers. */
export const MAX_RANGE_DAYS = 400;
/** A day still marked calculating after this long is taken over. */
export const CLAIM_TIMEOUT_MS = 3 * 60_000;

/**
 * A typical five-axle tractor and trailer. The yard is empty on purpose: it is
 * entered on each truck in Truck Fleet, never written into the app.
 */
export const DEFAULT_TRUCK_IFTA: TruckIfta = {
  yard_address: '',
  mpg: 5.2,
  height_ft: 13.5,
  width_ft: 8.5,
  length_ft: 70,
  gross_weight_lb: 80_000,
  axle_weight_lb: 20_000,
  axles: 5,
  commercial: true,
};

/** A truck's IFTA settings, with the defaults for anything not entered. */
export const truckIfta = (truck: Pick<TruckProfile, 'ifta'>): TruckIfta => ({
  ...DEFAULT_TRUCK_IFTA,
  ...truck.ifta,
});

// ------------------------------------------------------------ routing profile

/** The vehicle as the routing provider takes it: metres and kilograms. */
export type TruckRoutingProfile = {
  heightM: number;
  widthM: number;
  lengthM: number;
  weightKg: number;
  axleWeightKg: number;
  axles: number;
  commercial: boolean;
};

const FOOT_M = 0.3048;
const POUND_KG = 0.45359237;
const round2 = (value: number) => Math.round(value * 100) / 100;
const round3 = (value: number) => Math.round(value * 1000) / 1000;

export function toRoutingProfile(ifta: TruckIfta): TruckRoutingProfile {
  return {
    heightM: round2(ifta.height_ft * FOOT_M),
    widthM: round2(ifta.width_ft * FOOT_M),
    lengthM: round2(ifta.length_ft * FOOT_M),
    weightKg: Math.round(ifta.gross_weight_lb * POUND_KG),
    axleWeightKg: Math.round(ifta.axle_weight_lb * POUND_KG),
    axles: ifta.axles,
    commercial: ifta.commercial,
  };
}

// ------------------------------------------------------------------- hashing

/** FNV-1a over the text, twice with different seeds, as 16 hex characters. */
export function fnv1a(text: string): string {
  const pass = (seed: number) => {
    let hash = seed >>> 0;
    for (let at = 0; at < text.length; at += 1) {
      hash ^= text.charCodeAt(at);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, '0');
  };
  return pass(0x811c9dc5) + pass(0x050c5d1f);
}

/** The key a stored route is cached under: both ends and the vehicle. */
export const routingProfileHash = (profile: TruckRoutingProfile) =>
  fnv1a(
    [
      profile.heightM,
      profile.widthM,
      profile.lengthM,
      profile.weightKg,
      profile.axleWeightKg,
      profile.axles,
      profile.commercial ? 1 : 0,
    ].join('|'),
  );

export type LatLon = { lat: number; lon: number };

export const routeKey = (origin: LatLon, destination: LatLon, profileHash: string) =>
  `${origin.lat.toFixed(5)},${origin.lon.toFixed(5)}|${destination.lat.toFixed(5)},${destination.lon.toFixed(5)}|${profileHash}`;

/**
 * What a stored day was calculated with. The yard, MPG and vehicle all change
 * the answer; the provider's version too, since a newer map may route
 * differently. Changing any of them is shown as "Settings changed" rather than
 * rewriting history on its own.
 */
export const profileHash = (ifta: TruckIfta, providerVersion: string) =>
  fnv1a(
    JSON.stringify({
      profile: toRoutingProfile(ifta),
      yard: placeKey(ifta.yard_address),
      mpg: ifta.mpg,
      provider: providerVersion,
      v: CALC_VERSION,
    }),
  );

/**
 * The tickets of a day as far as mileage is concerned. Any change to a field
 * here recalculates the day; a rate or a weight does not, since the route does
 * not care what the load was worth.
 */
export function inputHash(records: SavedRecord[], truckId: number): string {
  const rows = [...records]
    .sort((a, b) => a.id - b.id)
    .map(({ id, ticket }) => [
      id,
      ticket.ticket_date,
      ticket.time_in,
      ticket.time_out,
      ticket.ticket_number,
      ticket.plant_code,
      ticket.plant_name,
      ticket.plant_address,
      ticket.project_address,
    ]);
  return fnv1a(JSON.stringify({ truck: truckId, v: CALC_VERSION, rows }));
}

// -------------------------------------------------------------------- places

const oneLine = (value: string | null | undefined) =>
  (value ?? '').replace(/\s+/g, ' ').trim();

/** Address text as the places table keys it: no case, spacing or punctuation. */
export const placeKey = (query: string) =>
  normalizeName(normalizeAddress(query)).slice(0, 200);

/** "322 S Williams St, Thornton, IL" is one; "THORNTON" is not. */
export const looksLikeStreetAddress = (text: string) =>
  /^\d{1,6}[A-Z]?\s+\S/i.test(text.trim());

/**
 * What to look up for a ticket's pickup: the plant's street address when the
 * ticket carries one, else the plant's name with the town, which the provider
 * may or may not place with confidence. Null when the ticket says nothing.
 */
export function pickupQuery(ticket: Ticket): string | null {
  const address = normalizeAddress(oneLine(ticket.plant_address));
  if (!address) return null;
  if (looksLikeStreetAddress(address)) return address;
  const name = normalizeAddress(oneLine(ticket.plant_name));
  return name ? `${name}, ${address}` : address;
}

export function deliveryQuery(ticket: Ticket): string | null {
  const address = normalizeAddress(oneLine(ticket.project_address));
  return address || null;
}

// ------------------------------------------------------------------ ordering

export type OrderBasis = 'time' | 'ticket_number' | 'saved_order' | 'confirmed';

/** "07:45" from a printed time; null for anything else. */
const clockOf = (value: string | null) => {
  const match = /^(\d{1,2}):(\d{2})/.exec(value ?? '');
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return null;
  return `${match[1].padStart(2, '0')}:${match[2]}`;
};

const plantKeyOf = (ticket: Ticket) =>
  normalizeName(`${oneLine(ticket.plant_name)} ${oneLine(ticket.plant_address)}`);

/**
 * The order the loads were hauled in: by the times on the tickets when every
 * ticket has one, else by ticket number when the numbers are one plant's
 * serials, else the order they were saved. Only the first is certain; the
 * others are flagged when getting them wrong would change the mileage.
 */
export function orderRecords(records: SavedRecord[]): {
  records: SavedRecord[];
  basis: OrderBasis;
  ambiguous: boolean;
} {
  const byId = (a: SavedRecord, b: SavedRecord) => a.id - b.id;
  const times = records.map(({ ticket }) => clockOf(ticket.time_out) ?? clockOf(ticket.time_in));
  let basis: OrderBasis;
  let ordered: SavedRecord[];
  if (records.length && times.every((time) => time !== null)) {
    basis = 'time';
    const at = new Map(records.map((record, index) => [record.id, times[index] as string]));
    ordered = [...records].sort(
      (a, b) => (at.get(a.id) as string).localeCompare(at.get(b.id) as string) || byId(a, b),
    );
  } else if (
    records.length &&
    records.every(({ ticket }) => /^\d+$/.test(oneLine(ticket.ticket_number))) &&
    new Set(records.map(({ ticket }) => plantKeyOf(ticket))).size <= 1
  ) {
    basis = 'ticket_number';
    ordered = [...records].sort((a, b) => {
      const left = oneLine(a.ticket.ticket_number);
      const right = oneLine(b.ticket.ticket_number);
      return left.length - right.length || left.localeCompare(right) || byId(a, b);
    });
  } else {
    basis = 'saved_order';
    ordered = [...records].sort(byId);
  }
  const pickups = new Set(ordered.map(({ ticket }) => placeKey(pickupQuery(ticket) ?? '')));
  const deliveries = new Set(ordered.map(({ ticket }) => placeKey(deliveryQuery(ticket) ?? '')));
  const ambiguous = basis !== 'time' && (pickups.size > 1 || deliveries.size > 1);
  return { records: ordered, basis, ambiguous };
}

/**
 * The same ticket saved twice — the front and the carbon, or a rescan — is one
 * load. Kept once, with a note; nothing is held up over it.
 */
export function dedupeRecords(records: SavedRecord[]): {
  records: SavedRecord[];
  warnings: string[];
} {
  const seen = new Map<string, number>();
  const kept: SavedRecord[] = [];
  for (const record of records) {
    const number = normalizeKey(oneLine(record.ticket.ticket_number));
    if (!number) {
      kept.push(record);
      continue;
    }
    const key = `${number}|${plantKeyOf(record.ticket)}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
    if (seen.get(key) === 1) kept.push(record);
  }
  const warnings = [...seen.entries()]
    .filter(([, count]) => count > 1)
    .map(([key, count]) => `Ticket ${key.split('|')[0]} is saved ${count} times and is counted once.`);
  return { records: kept, warnings };
}

// ------------------------------------------------------------ stop order

/**
 * The order a person confirmed for a day, when the tickets could not say it
 * themselves. It is tied to the day it was given for by `basis`.
 */
export type StopOrder = { ticket_ids: number[]; basis: string; confirmed_at: string };

/**
 * What a confirmed order is tied to: which tickets are on the day and where
 * each one picks up and delivers. Times, rates and everything else may be
 * edited without asking the person to confirm the order again; adding or
 * removing a ticket, or moving one of its addresses, does ask.
 */
export function stopOrderBasis(records: SavedRecord[]): string {
  const rows = [...records]
    .sort((a, b) => a.id - b.id)
    .map(({ id, ticket }) => [
      id,
      placeKey(pickupQuery(ticket) ?? ''),
      placeKey(deliveryQuery(ticket) ?? ''),
    ]);
  return fnv1a(JSON.stringify({ v: CALC_VERSION, rows }));
}

/**
 * Whether a stored order still describes this day: the same basis, and every
 * ticket of the day named once. Anything else is a confirmation from before
 * the day changed, and is ignored.
 */
export function stopOrderApplies(
  stopOrder: StopOrder | null | undefined,
  records: SavedRecord[],
): boolean {
  if (!stopOrder || !Array.isArray(stopOrder.ticket_ids)) return false;
  if (stopOrder.basis !== stopOrderBasis(records)) return false;
  const wanted = new Set(dedupeRecords(records).records.map((record) => record.id));
  if (stopOrder.ticket_ids.length !== wanted.size) return false;
  const seen = new Set<number>();
  for (const id of stopOrder.ticket_ids) {
    if (!wanted.has(id) || seen.has(id)) return false;
    seen.add(id);
  }
  return true;
}

// ---------------------------------------------------------------------- plan

export type ReviewCode =
  | 'yard_missing'
  | 'place_unresolved'
  | 'missing_pickup_address'
  | 'missing_delivery_address'
  | 'order_ambiguous'
  | 'no_route'
  | 'too_many_tickets'
  | 'mpg_missing';

export type ReviewReason = {
  code: ReviewCode;
  ticket_id?: number;
  /** The tickets the reason is about, in the order the plan used them. */
  ticket_ids?: number[];
  place_key?: string;
  query?: string;
  suggestion?: string | null;
  detail?: string;
};

export type StopKind = 'yard' | 'pickup' | 'delivery';
export type PlanStop = {
  kind: StopKind;
  ticket_id: number | null;
  query: string;
  place_key: string;
};

export type LegKind =
  | 'yard_to_pickup'
  | 'pickup_to_delivery'
  | 'delivery_to_pickup'
  | 'delivery_to_yard'
  | 'same_place';

export type PlanLeg = {
  seq: number;
  kind: LegKind;
  ticket_id: number | null;
  from: PlanStop;
  to: PlanStop;
};

export type DayPlan = {
  /** Every ticket on the day, duplicates included, in hauling order. */
  ticket_ids: number[];
  records: SavedRecord[];
  order_basis: OrderBasis;
  ambiguous: boolean;
  stops: PlanStop[];
  legs: PlanLeg[];
  /** What stops the day being routed at all. */
  blocking: ReviewReason[];
  /** What is worth a look but does not stop the estimate. */
  reasons: ReviewReason[];
  warnings: string[];
};

const legKind = (from: PlanStop, to: PlanStop): LegKind => {
  if (from.place_key === to.place_key) return 'same_place';
  if (from.kind === 'yard') return 'yard_to_pickup';
  if (to.kind === 'yard') return 'delivery_to_yard';
  return from.kind === 'pickup' ? 'pickup_to_delivery' : 'delivery_to_pickup';
};

/**
 * Yard → P1 → D1 → … → Pn → Dn → Yard. Two stops in a row at the same place
 * are a leg of nothing, kept so the day reads whole. Missing addresses stop
 * the plan; an uncertain order or a missing MPG only flag it. An order a
 * person confirmed for this day is taken as given, and nothing is flagged.
 */
export function buildPlan(
  records: SavedRecord[],
  ifta: TruckIfta,
  stopOrder?: StopOrder | null,
): DayPlan {
  const blocking: ReviewReason[] = [];
  const reasons: ReviewReason[] = [];
  const deduped = dedupeRecords(records);
  const warnings = [...deduped.warnings];
  const ordered = stopOrderApplies(stopOrder, records)
    ? {
        records: [...deduped.records].sort(
          (a, b) =>
            (stopOrder as StopOrder).ticket_ids.indexOf(a.id) -
            (stopOrder as StopOrder).ticket_ids.indexOf(b.id),
        ),
        basis: 'confirmed' as OrderBasis,
        ambiguous: false,
      }
    : orderRecords(deduped.records);
  const yardQuery = normalizeAddress(oneLine(ifta.yard_address));
  if (!yardQuery) blocking.push({ code: 'yard_missing' });
  if (ordered.records.length > MAX_TICKETS_PER_DAY) {
    blocking.push({
      code: 'too_many_tickets',
      detail: `${ordered.records.length} tickets on one day; the limit is ${MAX_TICKETS_PER_DAY}.`,
    });
  }
  const stops: PlanStop[] = [];
  const yard: PlanStop = { kind: 'yard', ticket_id: null, query: yardQuery, place_key: placeKey(yardQuery) };
  stops.push(yard);
  for (const record of ordered.records) {
    const pickup = pickupQuery(record.ticket);
    const delivery = deliveryQuery(record.ticket);
    if (!pickup) blocking.push({ code: 'missing_pickup_address', ticket_id: record.id });
    if (!delivery) blocking.push({ code: 'missing_delivery_address', ticket_id: record.id });
    stops.push({ kind: 'pickup', ticket_id: record.id, query: pickup ?? '', place_key: placeKey(pickup ?? '') });
    stops.push({ kind: 'delivery', ticket_id: record.id, query: delivery ?? '', place_key: placeKey(delivery ?? '') });
  }
  stops.push(yard);
  if (ordered.ambiguous) {
    reasons.push({
      code: 'order_ambiguous',
      // The order the plan went with, so the page can offer it to be confirmed.
      ticket_ids: ordered.records.map((record) => record.id),
      detail:
        ordered.basis === 'ticket_number'
          ? 'Ordered by ticket number. Enter Time out on each ticket to fix the order.'
          : 'Ordered as saved. Enter Time out on each ticket to fix the order.',
    });
  }
  if (ifta.mpg === null || !(ifta.mpg > 0)) reasons.push({ code: 'mpg_missing' });
  const legs: PlanLeg[] = [];
  for (let at = 1; at < stops.length; at += 1) {
    const from = stops[at - 1];
    const to = stops[at];
    legs.push({
      seq: at,
      kind: legKind(from, to),
      ticket_id: to.kind === 'yard' ? from.ticket_id : to.ticket_id,
      from,
      to,
    });
  }
  return {
    ticket_ids: ordered.records.map((record) => record.id),
    records: ordered.records,
    order_basis: ordered.basis,
    ambiguous: ordered.ambiguous,
    stops,
    legs: blocking.length ? [] : legs,
    blocking,
    reasons,
    warnings,
  };
}

// ---------------------------------------------------------------- truck days

export const dayKey = (truckId: number, date: string) => `${truckId}|${date}`;

export type TruckDay = {
  key: string;
  truck_id: number;
  truck_number: string;
  date: string;
  records: SavedRecord[];
  input_hash: string;
};

export type ExcludedRecord = { record: SavedRecord; reason: 'no_truck' | 'no_date' };

/**
 * Saved tickets as truck-days, newest first, each with the hash the stored
 * row must carry to be up to date. Tickets without a truck or a usable date
 * are listed apart, so the page can say what is not counted and why.
 */
export function truckDays(
  records: SavedRecord[],
  trucks: TruckProfile[],
  range?: { from: string; to: string },
): { days: TruckDay[]; excluded: ExcludedRecord[] } {
  const groups = new Map<string, { truck: TruckProfile; date: string; records: SavedRecord[] }>();
  const excluded: ExcludedRecord[] = [];
  const byId = new Map(trucks.map((truck) => [truck.id, truck]));
  for (const record of records) {
    const truckId = truckIdFor(record, trucks);
    const truck = truckId === null ? undefined : byId.get(truckId);
    if (!truck) {
      excluded.push({ record, reason: 'no_truck' });
      continue;
    }
    const date = ticketDateColumn(record.ticket);
    if (!date) {
      excluded.push({ record, reason: 'no_date' });
      continue;
    }
    if (range && (date < range.from || date > range.to)) continue;
    const key = dayKey(truck.id, date);
    const group = groups.get(key) ?? { truck, date, records: [] };
    group.records.push(record);
    groups.set(key, group);
  }
  const days = [...groups.entries()]
    .map(([key, group]) => ({
      key,
      truck_id: group.truck.id,
      truck_number: group.truck.truck_number,
      date: group.date,
      records: group.records,
      input_hash: inputHash(group.records, group.truck.id),
    }))
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        a.truck_number.localeCompare(b.truck_number, undefined, { numeric: true }),
    );
  return { days, excluded };
}

// ---------------------------------------------------------------------- fuel

export const metersToMiles = (meters: number) => round2(meters / 1609.344);

/** Estimated Fuel Used: route miles over the truck's average MPG. */
export const estimatedGallons = (miles: number, mpg: number | null): number | null =>
  mpg !== null && mpg > 0 && Number.isFinite(miles) ? round3(miles / mpg) : null;

export const formatNumber = (value: number) =>
  value.toLocaleString('en-US', { maximumFractionDigits: 1 });

// ------------------------------------------------------------------- periods

export const IFTA_PERIODS = [
  ['today', 'Today'],
  ['week', 'This week'],
  ['month', 'This month'],
  ['quarter', 'This quarter'],
  ['last_quarter', 'Last quarter'],
] as const;
export type IftaPeriod = (typeof IFTA_PERIODS)[number][0];

const pad2 = (value: number) => String(value).padStart(2, '0');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const iso = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

/** The first day of the calendar quarter `offset` quarters from `now`'s. */
function quarterStart(now: Date, offset = 0): Date {
  const quarter = Math.floor(now.getMonth() / 3) + offset;
  return new Date(now.getFullYear(), quarter * 3, 1);
}

/** Inclusive ISO dates for a period, in local time; weeks start on Monday. */
export function periodRange(period: IftaPeriod, now: Date): { from: string; to: string } {
  const today = iso(now);
  switch (period) {
    case 'today':
      return { from: today, to: today };
    case 'week': {
      const monday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - ((now.getDay() + 6) % 7),
      );
      const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
      return { from: iso(monday), to: iso(sunday) };
    }
    case 'month':
      return {
        from: iso(new Date(now.getFullYear(), now.getMonth(), 1)),
        to: iso(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
      };
    case 'quarter': {
      const start = quarterStart(now);
      return {
        from: iso(start),
        to: iso(new Date(start.getFullYear(), start.getMonth() + 3, 0)),
      };
    }
    case 'last_quarter': {
      const start = quarterStart(now, -1);
      return {
        from: iso(start),
        to: iso(new Date(start.getFullYear(), start.getMonth() + 3, 0)),
      };
    }
  }
}

/** What the page loads without being asked: last quarter through today. */
export const defaultRange = (now: Date) => ({
  from: iso(quarterStart(now, -1)),
  to: iso(now),
});

// ------------------------------------------------------------------ quarters

/** "2026-Q3": the IFTA quarter a date falls in. */
export const quarterKeyOf = (date: string) =>
  `${date.slice(0, 4)}-Q${Math.floor((Number(date.slice(5, 7)) - 1) / 3) + 1}`;

export const isQuarterKey = (value: string) => /^\d{4}-Q[1-4]$/.test(value);

/** "Q3 2026". */
export const quarterLabel = (key: string) => `${key.slice(5)} ${key.slice(0, 4)}`;

/** Inclusive ISO dates of a quarter, or null for anything that is not one. */
export function quarterRangeOf(key: string): { from: string; to: string } | null {
  if (!isQuarterKey(key)) return null;
  const year = Number(key.slice(0, 4));
  const month = (Number(key.slice(6)) - 1) * 3;
  return { from: iso(new Date(year, month, 1)), to: iso(new Date(year, month + 3, 0)) };
}

/** Every quarter from the one `from` falls in to the one `to` falls in, newest first. */
export function quarterKeys(from: string, to: string): string[] {
  if (!ISO_DATE.test(from) || !ISO_DATE.test(to) || from > to) return [];
  const keys: string[] = [];
  let year = Number(from.slice(0, 4));
  let quarter = Math.floor((Number(from.slice(5, 7)) - 1) / 3) + 1;
  const last = quarterKeyOf(to);
  for (let guard = 0; guard < 400; guard += 1) {
    const key = `${year}-Q${quarter}`;
    keys.push(key);
    if (key === last) break;
    quarter += 1;
    if (quarter > 4) {
      quarter = 1;
      year += 1;
    }
  }
  return keys.reverse();
}

// ------------------------------------------------------------------ stored days

export type MileageStatus = 'calculating' | 'current' | 'needs_review' | 'failed';

/**
 * One end of a leg. `label` is the town, as route lines read it; `address` is
 * the whole address the provider settled on, and `name` what the paperwork
 * calls the place — the plant on a pickup, the job on a delivery, the home
 * yard at either end of the day. Both are for a person reading the day, and
 * both are absent on days stored before they were written.
 */
export type MileagePlace = {
  label: string;
  place_key: string;
  lat: number;
  lon: number;
  address?: string;
  name?: string;
};

export type MileageLeg = {
  seq: number;
  kind: LegKind;
  ticket_id: number | null;
  from: MileagePlace;
  to: MileagePlace;
  miles: number;
  seconds: number;
  route_id: number | null;
  /** Taken from the route cache rather than asked of the provider. */
  cached: boolean;
};

/** A stored route's line on the map, as the provider encoded it. */
export type RouteGeometry = { polyline: string; precision: 5 | 7 };

/** A stored truck-day, as GET /api/mileage returns it. */
export type MileageDay = {
  id: number;
  truck_id: number;
  truck_number: string;
  service_date: string;
  status: MileageStatus;
  review_reasons: ReviewReason[];
  warnings: string[];
  error: string | null;
  calc_started_at: string | null;
  last_attempt_at: string | null;
  input_hash: string | null;
  result_input_hash: string | null;
  ticket_ids: number[];
  ticket_count: number;
  order_basis: OrderBasis | null;
  /** The order a person confirmed for this day, if they have. */
  stop_order: StopOrder | null;
  legs: MileageLeg[];
  total_miles: number | null;
  total_seconds: number | null;
  mpg: number | null;
  est_gallons: number | null;
  profile_snapshot: TruckIfta | null;
  profile_hash: string | null;
  calc_version: number | null;
  calculated_at: string | null;
};

const num = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};
const str = (value: unknown): string | null => (typeof value === 'string' ? value : null);
const isStatus = (value: unknown): value is MileageStatus =>
  value === 'calculating' || value === 'current' || value === 'needs_review' || value === 'failed';
const isBasis = (value: unknown): value is OrderBasis =>
  value === 'time' ||
  value === 'ticket_number' ||
  value === 'saved_order' ||
  value === 'confirmed';

/** A stored stop order, or null for anything that is not one. */
function readStopOrder(value: unknown): StopOrder | null {
  if (!isObject(value)) return null;
  const ids = value.ticket_ids;
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === 'number')) return null;
  if (typeof value.basis !== 'string' || typeof value.confirmed_at !== 'string') return null;
  return { ticket_ids: [...ids], basis: value.basis, confirmed_at: value.confirmed_at };
}

/**
 * One end of a stored leg. The label and the coordinates are what a route
 * line and a map need; the address and the name are kept only when they are
 * text, so a day stored before either was written simply has neither rather
 * than an empty line where a name should be.
 */
function readLegPlace(value: unknown): MileagePlace {
  const place = isObject(value) ? value : {};
  const address = str(place.address)?.trim();
  const name = str(place.name)?.trim();
  return {
    label: str(place.label) ?? '',
    place_key: str(place.place_key) ?? '',
    lat: num(place.lat) ?? 0,
    lon: num(place.lon) ?? 0,
    ...(address ? { address } : {}),
    ...(name ? { name } : {}),
  };
}

/**
 * A database row as the app's day. Numeric columns come over the wire as
 * strings, and JSON columns as whatever was stored, so every field is read
 * rather than cast.
 */
export function readMileageDay(row: Record<string, unknown>): MileageDay {
  const reasons = Array.isArray(row.review_reasons) ? row.review_reasons : [];
  const warnings = Array.isArray(row.warnings) ? row.warnings : [];
  const legs = Array.isArray(row.legs) ? row.legs : [];
  const ticketIds = Array.isArray(row.ticket_ids) ? row.ticket_ids : [];
  const snapshot =
    row.profile_snapshot && typeof row.profile_snapshot === 'object'
      ? ({ ...DEFAULT_TRUCK_IFTA, ...(row.profile_snapshot as Partial<TruckIfta>) } as TruckIfta)
      : null;
  return {
    id: num(row.id) ?? 0,
    truck_id: num(row.truck_id) ?? 0,
    truck_number: str(row.truck_number) ?? '',
    service_date: str(row.service_date) ?? '',
    status: isStatus(row.status) ? row.status : 'failed',
    review_reasons: reasons.filter(
      (reason): reason is ReviewReason =>
        !!reason && typeof reason === 'object' && typeof (reason as ReviewReason).code === 'string',
    ),
    warnings: warnings.filter((warning): warning is string => typeof warning === 'string'),
    error: str(row.error),
    calc_started_at: str(row.calc_started_at),
    last_attempt_at: str(row.last_attempt_at),
    input_hash: str(row.input_hash),
    result_input_hash: str(row.result_input_hash),
    ticket_ids: ticketIds.map(num).filter((id): id is number => id !== null),
    ticket_count: num(row.ticket_count) ?? 0,
    order_basis: isBasis(row.order_basis) ? row.order_basis : null,
    stop_order: readStopOrder(row.stop_order),
    legs: legs
      .filter(
        (leg): leg is MileageLeg =>
          !!leg && typeof leg === 'object' && typeof (leg as MileageLeg).seq === 'number',
      )
      .map((leg) => ({ ...leg, from: readLegPlace(leg.from), to: readLegPlace(leg.to) })),
    total_miles: num(row.total_miles),
    total_seconds: num(row.total_seconds),
    mpg: num(row.mpg),
    est_gallons: num(row.est_gallons),
    profile_snapshot: snapshot,
    profile_hash: str(row.profile_hash),
    calc_version: num(row.calc_version),
    calculated_at: str(row.calculated_at),
  };
}

/** Whether the stored day has figures to show, whatever its last attempt did. */
export const hasResult = (day: MileageDay) => day.total_miles !== null && day.legs.length > 0;

/** "Yard → Thornton → Markham → Yard" as its parts. */
export function routeLabels(legs: MileageLeg[]): string[] {
  if (!legs.length) return [];
  const labels = [legs[0].from.label];
  for (const leg of legs) {
    if (leg.kind === 'same_place') continue;
    labels.push(leg.to.label);
  }
  return labels;
}

/** What the page shows for a day next to what the tickets say it should be. */
export type DayView = 'missing' | 'calculating' | 'stale' | 'current' | 'needs_review' | 'failed';

export function dayView(day: MileageDay | undefined, expectedHash: string): DayView {
  if (!day) return 'missing';
  if (day.status === 'calculating') return 'calculating';
  if (day.input_hash !== expectedHash) return 'stale';
  return day.status;
}

/**
 * The day was worked out with a yard, MPG or vehicle the truck no longer has.
 * Compared on the stored snapshot rather than profile_hash, which also covers
 * the provider version the browser has no business knowing.
 */
export const settingsChanged = (day: MileageDay, current: TruckIfta) =>
  day.profile_snapshot !== null &&
  (placeKey(day.profile_snapshot.yard_address) !== placeKey(current.yard_address) ||
    day.profile_snapshot.mpg !== current.mpg ||
    JSON.stringify(toRoutingProfile(day.profile_snapshot)) !== JSON.stringify(toRoutingProfile(current)));

/**
 * A day worth asking about again without anything having changed: it
 * failed, or it waits on an address the provider could not place — which a
 * newer provider answer, or a place set by hand, may since have settled.
 */
export const retryable = (day: MileageDay) =>
  day.status === 'failed' ||
  (day.status === 'needs_review' && day.review_reasons.some((reason) => reason.code === 'place_unresolved'));

/**
 * Whether the page should ask the server for this day: nothing stored, the
 * tickets changed since, or a retryable state not yet retried this visit.
 */
export function needsRecalculation(
  day: MileageDay | undefined,
  expected: TruckDay,
  retryFailed: boolean,
): boolean {
  if (!day) return true;
  if (day.status === 'calculating') {
    // A claim older than the timeout is abandoned work; ask again.
    const started = day.calc_started_at ? Date.parse(day.calc_started_at) : NaN;
    return Number.isNaN(started) || Date.now() - started > CLAIM_TIMEOUT_MS;
  }
  if (day.input_hash !== expected.input_hash) return true;
  return retryFailed && retryable(day);
}

// ------------------------------------------------------------------ problems

/**
 * What is the matter with a day, in the words a dispatcher would use. The
 * review codes say what the calculation found; these say what somebody can do
 * about it, and are what a page shows. `stuck` is reserved: a day whose update
 * started and never came back is reported as `could_not_update`, and the kind
 * is kept so a page may label that case apart if it wants to.
 */
export type ProblemKind =
  | 'missing_yard'
  | 'unknown_place'
  | 'uncertain_order'
  | 'missing_pickup'
  | 'missing_delivery'
  | 'no_route'
  | 'too_many_tickets'
  | 'missing_mpg'
  | 'could_not_update'
  | 'settings_changed'
  | 'stuck';

export type Problem = {
  kind: ProblemKind;
  ticket_id?: number;
  place_key?: string;
  query?: string;
  suggestion?: string | null;
  ticket_ids?: number[];
  detail?: string;
  /** When the day last calculated, so a stale figure can say how old it is. */
  last_success_at?: string | null;
};

const PROBLEM_OF: Record<ReviewCode, ProblemKind> = {
  yard_missing: 'missing_yard',
  place_unresolved: 'unknown_place',
  order_ambiguous: 'uncertain_order',
  missing_pickup_address: 'missing_pickup',
  missing_delivery_address: 'missing_delivery',
  no_route: 'no_route',
  too_many_tickets: 'too_many_tickets',
  mpg_missing: 'missing_mpg',
};

/**
 * Everything wrong with one day: what the last calculation put it up for
 * review over, whether it failed or is stuck, and whether the truck's settings
 * have moved since the figures were worked out. Each review reason becomes one
 * problem, carrying only what a page needs to offer the fix — the address that
 * was not placed and the provider's suggestion, the order that was assumed,
 * the leg that could not be routed.
 *
 * A reason about a ticket that is no longer on the day is left out: the
 * calculation that raised it ran before the ticket was deleted or moved to
 * another truck, and there is nothing to put right. Days whose expected
 * tickets are not to hand (`expected.records` empty) keep every reason.
 */
export function dayProblems(
  day: MileageDay | undefined,
  expected: TruckDay,
  truck: TruckProfile,
  options: { stuck?: boolean } = {},
): Problem[] {
  const problems: Problem[] = [];
  const onDay = new Set(expected.records.map((record) => record.id));
  const stillThere = (ticketId: number | undefined) =>
    ticketId === undefined || !onDay.size || onDay.has(ticketId);
  for (const reason of day?.review_reasons ?? []) {
    const kind = PROBLEM_OF[reason.code];
    if (!kind) continue;
    if (!stillThere(reason.ticket_id)) continue;
    const problem: Problem = { kind };
    if (reason.ticket_id !== undefined) problem.ticket_id = reason.ticket_id;
    if (kind === 'unknown_place') {
      problem.place_key = reason.place_key;
      problem.query = reason.query;
      problem.suggestion = reason.suggestion ?? null;
    }
    if (reason.ticket_ids) problem.ticket_ids = [...reason.ticket_ids];
    if (reason.detail) problem.detail = reason.detail;
    problems.push(problem);
  }
  if (day?.status === 'failed' || options.stuck === true) {
    problems.push({
      kind: 'could_not_update',
      detail:
        day?.status === 'failed'
          ? day.error ?? 'The last update did not finish.'
          : 'The last update started and did not finish.',
      last_success_at: day?.calculated_at ?? null,
    });
  }
  if (day && hasResult(day) && settingsChanged(day, truckIfta(truck))) {
    problems.push({ kind: 'settings_changed', last_success_at: day.calculated_at });
  }
  return problems;
}

/** Problems a day can show its figures in spite of. */
const QUIET_PROBLEMS = new Set<ProblemKind>(['could_not_update', 'settings_changed', 'stuck']);

/**
 * The one thing to say about a day on a card. Anything a person can put right
 * comes first, then a day that could not be worked out, then one still being
 * worked out; a day whose only news is that the truck's settings have changed
 * says so, and a day with nothing to report is ready.
 */
export function dayHeadline(
  day: MileageDay | undefined,
  expected: TruckDay,
  truck: TruckProfile,
  options: { stuck?: boolean } = {},
): 'ready' | 'updating' | 'needs_help' | 'could_not_update' | 'settings_changed' {
  const problems = dayProblems(day, expected, truck, options);
  if (problems.some((problem) => !QUIET_PROBLEMS.has(problem.kind))) return 'needs_help';
  if (day?.status === 'failed' || options.stuck === true) return 'could_not_update';
  const view = dayView(day, expected.input_hash);
  if (view === 'missing' || view === 'stale' || view === 'calculating') return 'updating';
  if (problems.some((problem) => problem.kind === 'settings_changed')) return 'settings_changed';
  return 'ready';
}

// ----------------------------------------------------------------- summaries

export type MileageSummary = {
  miles: number;
  gallons: number;
  loads: number;
  trucks: number;
  days: number;
  /** Days marked for review or failed. */
  review: number;
};

/** Totals over the stored days in a range. Days waiting on review still count. */
export function summarizeDays(days: MileageDay[], from: string, to: string): MileageSummary {
  const summary: MileageSummary = { miles: 0, gallons: 0, loads: 0, trucks: 0, days: 0, review: 0 };
  const trucks = new Set<number>();
  for (const day of days) {
    if (day.service_date < from || day.service_date > to) continue;
    if (day.status === 'needs_review' || day.status === 'failed') summary.review += 1;
    if (!hasResult(day)) continue;
    summary.days += 1;
    summary.miles += day.total_miles ?? 0;
    summary.gallons += day.est_gallons ?? 0;
    summary.loads += day.ticket_count;
    trucks.add(day.truck_id);
  }
  summary.trucks = trucks.size;
  summary.miles = round2(summary.miles);
  summary.gallons = round3(summary.gallons);
  return summary;
}

export type TruckSummary = MileageSummary & { truck_id: number; truck_number: string };

/** The same totals, one line per truck, most miles first. */
export function summarizeByTruck(days: MileageDay[], from: string, to: string): TruckSummary[] {
  const byTruck = new Map<number, MileageDay[]>();
  for (const day of days) {
    if (day.service_date < from || day.service_date > to) continue;
    byTruck.set(day.truck_id, [...(byTruck.get(day.truck_id) ?? []), day]);
  }
  return [...byTruck.entries()]
    .map(([truckId, rows]) => ({
      truck_id: truckId,
      truck_number: rows.find((row) => row.truck_number)?.truck_number ?? String(truckId),
      ...summarizeDays(rows, from, to),
    }))
    .sort((a, b) => b.miles - a.miles || a.truck_number.localeCompare(b.truck_number, undefined, { numeric: true }));
}

// ------------------------------------------------------------------- parsers

type Parsed<T> = { value: T } | { error: string };

const isIsoDate = (value: unknown): value is string =>
  typeof value === 'string' && ISO_DATE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export type RecalculateRequest = {
  days: { truck_id: number; date: string }[];
  force: boolean;
};

/** { days: [{ truck_id, date }], force? } — up to 25 distinct days. */
export function parseRecalculateBody(body: unknown): Parsed<RecalculateRequest> {
  if (!isObject(body) || !Array.isArray(body.days)) return { error: 'Send the days to calculate.' };
  if (!body.days.length || body.days.length > MAX_DAYS_PER_REQUEST) {
    return { error: `Send between 1 and ${MAX_DAYS_PER_REQUEST} days.` };
  }
  if (body.force !== undefined && typeof body.force !== 'boolean') {
    return { error: 'The request is not valid.' };
  }
  const days: RecalculateRequest['days'] = [];
  const seen = new Set<string>();
  for (const item of body.days) {
    if (
      !isObject(item) ||
      typeof item.truck_id !== 'number' ||
      !Number.isSafeInteger(item.truck_id) ||
      item.truck_id <= 0 ||
      !isIsoDate(item.date)
    ) {
      return { error: 'Each day needs a truck and a date.' };
    }
    const key = dayKey(item.truck_id, item.date);
    if (seen.has(key)) continue;
    seen.add(key);
    days.push({ truck_id: item.truck_id, date: item.date });
  }
  return { value: { days, force: body.force === true } };
}

/** { truck_id, date, ticket_ids } — the order a person put the day's stops in. */
export function parseStopOrderBody(
  body: unknown,
): Parsed<{ truck_id: number; date: string; ticket_ids: number[] }> {
  if (!isObject(body)) return { error: 'The request is not valid.' };
  const { truck_id: truckId, date, ticket_ids: ticketIds } = body;
  if (typeof truckId !== 'number' || !Number.isSafeInteger(truckId) || truckId <= 0 || !isIsoDate(date)) {
    return { error: 'The day needs a truck and a date.' };
  }
  if (!Array.isArray(ticketIds) || !ticketIds.length || ticketIds.length > MAX_TICKETS_PER_DAY) {
    return { error: `Send between 1 and ${MAX_TICKETS_PER_DAY} stops.` };
  }
  const seen = new Set<number>();
  for (const id of ticketIds) {
    if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0 || seen.has(id)) {
      return { error: 'The stops are not valid.' };
    }
    seen.add(id);
  }
  return { value: { truck_id: truckId, date, ticket_ids: [...ticketIds] as number[] } };
}

/** A run of the day: one pair of places, and the legs that drive it. */
export type DayRun = {
  /** The first leg that drives it, which names it to the server. */
  seq: number;
  route_id: number;
  from: MileagePlace;
  to: MileagePlace;
  miles: number;
  /** Legs of this day that are this same run. */
  uses: number;
};

/**
 * The distinct runs of a day, in the order they first happen.
 *
 * A day of shuttle work is thirty legs and four runs: out to the quarry, the
 * quarry to the job, the job back to the quarry, and home at the end. A run
 * is one cached route, so everything that is true of it — the miles, and the
 * way a person chose to drive it — is true of every leg that drives it.
 */
export function runsOfDay(legs: MileageLeg[]): DayRun[] {
  const runs = new Map<number, DayRun>();
  for (const leg of [...legs].sort((a, b) => a.seq - b.seq)) {
    if (leg.route_id === null || leg.kind === 'same_place') continue;
    const run = runs.get(leg.route_id);
    if (run) run.uses += 1;
    else {
      runs.set(leg.route_id, {
        seq: leg.seq,
        route_id: leg.route_id,
        from: leg.from,
        to: leg.to,
        miles: leg.miles,
        uses: 1,
      });
    }
  }
  return [...runs.values()];
}

/**
 * { truck_id, date, seq } — one leg of a stored day, and with `option` the
 * way to drive it that a person picked.
 *
 * A browser says which leg and which of the ways already offered for it. It
 * never says how long a route is, where it goes or what line it draws: those
 * are the provider's answers, held on the server, and a page that could send
 * them could dictate what a quarter's IFTA filing says.
 */
export function parseRouteChoiceBody(
  body: unknown,
  { needsOption = false } = {},
): Parsed<{ truck_id: number; date: string; seq: number; option: number | null }> {
  if (!isObject(body)) return { error: 'The request is not valid.' };
  const { truck_id: truckId, date, seq, option } = body;
  if (typeof truckId !== 'number' || !Number.isSafeInteger(truckId) || truckId <= 0 || !isIsoDate(date)) {
    return { error: 'The day needs a truck and a date.' };
  }
  if (typeof seq !== 'number' || !Number.isSafeInteger(seq) || seq <= 0 || seq > MAX_LEGS_PER_DAY) {
    return { error: 'That part of the day is not valid.' };
  }
  if (!needsOption) return { value: { truck_id: truckId, date, seq, option: null } };
  if (typeof option !== 'number' || !Number.isSafeInteger(option) || option < 0 || option >= MAX_ROUTE_OPTIONS) {
    return { error: 'Choose one of the ways offered.' };
  }
  return { value: { truck_id: truckId, date, seq, option } };
}

/** The most ways to drive one run a person is ever offered. */
export const MAX_ROUTE_OPTIONS = 6;

export const PLACE_KEY = /^[A-Z0-9 ]{1,200}$/;

/** { place_key, address } — the address a person typed for an unplaced stop. */
export function parsePlaceFixBody(body: unknown): Parsed<{ place_key: string; address: string }> {
  if (!isObject(body)) return { error: 'The request is not valid.' };
  const { place_key: key, address } = body;
  if (typeof key !== 'string' || !PLACE_KEY.test(key)) return { error: 'The place is not valid.' };
  if (typeof address !== 'string' || address.length > 200 || /[\r\n]/.test(address)) {
    return { error: 'Enter the address on one line, up to 200 characters.' };
  }
  const clean = normalizeAddress(address);
  if (!clean) return { error: 'Enter the address.' };
  return { value: { place_key: key, address: clean } };
}

/** ?from&to as inclusive ISO dates, at most 400 days, defaulting sensibly. */
export function parseDateRange(
  from: string | null,
  to: string | null,
  now: Date,
): Parsed<{ from: string; to: string }> {
  const fallback = defaultRange(now);
  const start = from ?? fallback.from;
  const end = to ?? fallback.to;
  if (!isIsoDate(start) || !isIsoDate(end)) return { error: 'Dates must be YYYY-MM-DD.' };
  if (end < start) return { error: 'The end date is before the start date.' };
  const span = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000;
  if (span > MAX_RANGE_DAYS) return { error: `Ask for at most ${MAX_RANGE_DAYS} days at a time.` };
  return { value: { from: start, to: end } };
}
