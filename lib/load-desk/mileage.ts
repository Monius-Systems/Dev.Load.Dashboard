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
/** The widest span GET /api/ifta answers. */
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

export type OrderBasis = 'time' | 'ticket_number' | 'saved_order';

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
 * the plan; an uncertain order or a missing MPG only flag it.
 */
export function buildPlan(records: SavedRecord[], ifta: TruckIfta): DayPlan {
  const blocking: ReviewReason[] = [];
  const reasons: ReviewReason[] = [];
  const deduped = dedupeRecords(records);
  const warnings = [...deduped.warnings];
  const ordered = orderRecords(deduped.records);
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

export type MileagePlace = { label: string; place_key: string; lat: number; lon: number };

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

/** A stored truck-day, as GET /api/ifta returns it. */
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
  value === 'time' || value === 'ticket_number' || value === 'saved_order';

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
    legs: legs.filter(
      (leg): leg is MileageLeg => !!leg && typeof leg === 'object' && typeof (leg as MileageLeg).seq === 'number',
    ),
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
