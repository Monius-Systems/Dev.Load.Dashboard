import { apiJson, dataMode, type DataMode } from './data-mode.ts';
import {
  dayKey,
  MAX_DAYS_PER_REQUEST,
  needsRecalculation,
  retryable,
  type MileageDay,
  type MileagePlace,
  type RouteGeometry,
  type TruckDay,
} from './mileage.ts';

// Stored truck-days for the Mileage and IFTA pages, in the shape of
// storage.ts: one snapshot, subscribers, and the calls that change it.
// Signed-in members read /api/mileage and ask /api/mileage/recalculate for
// the days whose tickets have changed; the unprotected local preview has no
// server to ask and says so.

export type DaysSnapshot = {
  /** Stored days by `${truck_id}|${date}`. */
  days: Record<string, MileageDay>;
  /** Route lines by route id, for the days loaded one at a time. */
  geometry: Record<string, RouteGeometry>;
  /** The range loaded from the server, or null before the first load. */
  range: { from: string; to: string } | null;
  /** Whether the deployment has a routing key. */
  configured: boolean;
  /** The words the map under a route must be credited with; '' for no map. */
  mapCredit: string;
  error: string | null;
  ready: boolean;
  mode: DataMode | null;
  /** Days being worked out right now. */
  pending: ReadonlySet<string>;
};

const SERVER_SNAPSHOT: DaysSnapshot = {
  days: {},
  geometry: {},
  range: null,
  configured: true,
  mapCredit: '',
  error: null,
  ready: false,
  mode: null,
  pending: new Set(),
};

let snapshot: DaysSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function publish(next: DaysSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

export function subscribeDays(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getDaysSnapshot = () => snapshot;
export const getServerDaysSnapshot = () => SERVER_SNAPSHOT;

const keyOf = (day: MileageDay) => dayKey(day.truck_id, day.service_date);

/** Stored rows merged in; `removed` taken out. */
function merge(rows: MileageDay[], removed: { truck_id: number; date: string }[] = []) {
  const days = { ...snapshot.days };
  for (const row of rows) days[keyOf(row)] = row;
  for (const gone of removed) delete days[dayKey(gone.truck_id, gone.date)];
  return days;
}

/** Loads the stored days in a range, replacing what was loaded for it before. */
export async function loadDays(range: { from: string; to: string }): Promise<void> {
  const mode = snapshot.mode ?? (await dataMode());
  if (mode === 'local') {
    publish({ ...snapshot, days: {}, range, configured: false, error: null, ready: true, mode });
    return;
  }
  if (mode === 'unavailable') {
    publish({
      ...snapshot,
      range,
      error: 'Your session has ended. Sign in again to see mileage.',
      ready: true,
      mode,
    });
    return;
  }
  const result = await apiJson<{ days: MileageDay[]; configured: boolean; map_credit?: string }>(
    `/api/mileage?from=${range.from}&to=${range.to}`,
  );
  if (!result.ok) {
    publish({ ...snapshot, range, error: result.error, ready: true, mode });
    return;
  }
  const days: Record<string, MileageDay> = {};
  for (const [key, day] of Object.entries(snapshot.days)) {
    if (day.service_date < range.from || day.service_date > range.to) days[key] = day;
  }
  for (const row of result.data.days) days[keyOf(row)] = row;
  publish({
    ...snapshot,
    days,
    range,
    configured: result.data.configured,
    mapCredit: result.data.map_credit ?? '',
    error: null,
    ready: true,
    mode,
  });
}

/**
 * Loads several ranges one after another — the past quarters for the
 * quarterly reports. A range already loaded this page session is skipped.
 */
const loadedRanges = new Set<string>();
export async function loadRanges(ranges: { from: string; to: string }[]): Promise<void> {
  for (const range of ranges) {
    const key = `${range.from}|${range.to}`;
    if (loadedRanges.has(key)) continue;
    await loadDays(range);
    if (snapshot.mode === 'remote' && !snapshot.error) loadedRanges.add(key);
    if (snapshot.mode !== 'remote') return;
  }
}

type RecalculateAnswer = {
  days: MileageDay[];
  removed?: { truck_id: number; date: string }[];
  configured: boolean;
  error?: string;
};

/**
 * Asks the server for the given days, at most 25 at a time, one request
 * after another, publishing each answer as it comes. Returns an error
 * message when a request fails; the rest are not sent.
 */
export async function recalculate(
  days: { truck_id: number; date: string }[],
  { force = false } = {},
): Promise<string | null> {
  if (snapshot.mode !== 'remote' || !days.length) return null;
  const keys = days.map((day) => dayKey(day.truck_id, day.date));
  publish({ ...snapshot, pending: new Set([...snapshot.pending, ...keys]) });
  let error: string | null = null;
  try {
    for (let at = 0; at < days.length; at += MAX_DAYS_PER_REQUEST) {
      const chunk = days.slice(at, at + MAX_DAYS_PER_REQUEST);
      const result = await apiJson<RecalculateAnswer>('/api/mileage/recalculate', {
        method: 'POST',
        body: JSON.stringify({ days: chunk, force }),
      });
      if (!result.ok) {
        error = result.error;
        if (result.status === 503) publish({ ...snapshot, configured: false });
        break;
      }
      publish({
        ...snapshot,
        days: merge(result.data.days, result.data.removed),
        configured: result.data.configured,
      });
    }
  } finally {
    const pending = new Set(snapshot.pending);
    for (const key of keys) pending.delete(key);
    publish({ ...snapshot, pending });
  }
  return error;
}

/**
 * How many times a day has been asked for this page session without its
 * tickets changing. Three is where the page stops and says so, rather than
 * asking again every ten seconds for something the server cannot settle.
 */
const attempts = new Map<string, { hash: string; count: number }>();
const retriedFailed = new Set<string>();
export const MAX_ATTEMPTS = 3;

export const givenUp = (day: TruckDay) => {
  const tried = attempts.get(day.key);
  return !!tried && tried.hash === day.input_hash && tried.count >= MAX_ATTEMPTS;
};

let settling: Promise<void> | null = null;
let again = false;
/** The days the page last asked for; a pass always works from the latest. */
let latest: TruckDay[] = [];

/**
 * Brings the stored days in line with the tickets: every expected day that is
 * missing, out of date, or failed and not yet retried this visit is posted,
 * newest first. One pass at a time; a call during a pass queues one more.
 */
export function settleDays(expected: TruckDay[]): Promise<void> {
  latest = expected;
  if (settling) {
    again = true;
    return settling;
  }
  settling = (async () => {
    try {
      do {
        again = false;
        if (snapshot.mode !== 'remote' || !snapshot.configured) return;
        const needed = latest.filter((day) => {
          if (snapshot.pending.has(day.key) || givenUp(day)) return false;
          const retry = !retriedFailed.has(day.key);
          return needsRecalculation(snapshot.days[day.key], day, retry);
        });
        if (!needed.length) return;
        for (const day of needed) {
          const tried = attempts.get(day.key);
          attempts.set(day.key, {
            hash: day.input_hash,
            count: tried && tried.hash === day.input_hash ? tried.count + 1 : 1,
          });
          const stored = snapshot.days[day.key];
          if (stored && retryable(stored)) retriedFailed.add(day.key);
        }
        const error = await recalculate(needed.map((day) => ({ truck_id: day.truck_id, date: day.date })));
        if (error) {
          publish({ ...snapshot, error });
          return;
        }
      } while (again);
    } finally {
      settling = null;
    }
  })();
  return settling;
}

/** Forgets the attempt count for a day, so a manual Recalculate is always sent. */
export function resetAttempts(keys: string[]) {
  for (const key of keys) {
    attempts.delete(key);
    retriedFailed.delete(key);
  }
}

/**
 * One day in full: the stored row and the lines of its routes, for the map.
 * Nothing to ask in the local preview, which has no server.
 */
export async function loadDayDetail(truckId: number, date: string): Promise<string | null> {
  const mode = snapshot.mode ?? (await dataMode());
  if (mode !== 'remote') return null;
  const result = await apiJson<{ day: MileageDay | null; geometry: Record<string, RouteGeometry> }>(
    `/api/mileage/day?truck_id=${truckId}&date=${date}`,
  );
  if (!result.ok) return result.error;
  const days = { ...snapshot.days };
  if (result.data.day) days[keyOf(result.data.day)] = result.data.day;
  else delete days[dayKey(truckId, date)];
  publish({ ...snapshot, days, geometry: { ...snapshot.geometry, ...result.data.geometry } });
  return null;
}

/**
 * Confirms the order the day's loads were hauled in and has the day worked
 * out again with it. Returns null on success, or the error message.
 */
export async function confirmStopOrder(
  truckId: number,
  date: string,
  ticketIds: number[],
): Promise<string | null> {
  if (snapshot.mode !== 'remote') return 'Your session has ended. Sign in again to save.';
  const key = dayKey(truckId, date);
  resetAttempts([key]);
  publish({ ...snapshot, pending: new Set([...snapshot.pending, key]) });
  try {
    const result = await apiJson<{ day: MileageDay }>('/api/mileage/order', {
      method: 'POST',
      body: JSON.stringify({ truck_id: truckId, date, ticket_ids: ticketIds }),
    });
    if (!result.ok) return result.error;
    publish({ ...snapshot, days: merge([result.data.day]) });
    return null;
  } finally {
    const pending = new Set(snapshot.pending);
    pending.delete(key);
    publish({ ...snapshot, pending });
  }
}

/** One way of driving a run, as the server offered it. */
export type RouteWay = {
  index: number;
  miles: number;
  seconds: number;
  geometry: RouteGeometry | null;
};

/** The ways one run may be driven, and how much of the day rides on it. */
export type RouteWays = {
  from: MileagePlace;
  to: MileagePlace;
  /** Legs of this day that are this same run. */
  uses: number;
  /** Which way is in use, where somebody has already settled it. */
  in_use: number | null;
  options: RouteWay[];
};

/**
 * The ways one run of a day may be driven. The leg is named by its place in
 * the day; everything about the route itself comes back from the server.
 */
export async function loadRouteWays(
  truckId: number,
  date: string,
  seq: number,
): Promise<{ ways: RouteWays } | { error: string }> {
  if (snapshot.mode !== 'remote') {
    return { error: 'Your session has ended. Sign in again to choose a route.' };
  }
  const result = await apiJson<RouteWays>('/api/mileage/routes', {
    method: 'POST',
    body: JSON.stringify({ truck_id: truckId, date, seq }),
  });
  return result.ok ? { ways: result.data } : { error: result.error };
}

/**
 * Settles how that run is driven, by the position of one of the ways offered.
 * The day is worked out again on the server; every other day that used the
 * run is marked for working out again, so the range is loaded afresh and the
 * page settles them as it shows them.
 *
 * Returns how many stored days the choice reaches, or the error message.
 */
export async function chooseRouteWay(
  truckId: number,
  date: string,
  seq: number,
  option: number,
): Promise<{ days: number } | { error: string }> {
  if (snapshot.mode !== 'remote') {
    return { error: 'Your session has ended. Sign in again to choose a route.' };
  }
  const key = dayKey(truckId, date);
  resetAttempts([key]);
  publish({ ...snapshot, pending: new Set([...snapshot.pending, key]) });
  try {
    const result = await apiJson<{ day: MileageDay | null; days: number }>(
      '/api/mileage/routes/choose',
      {
        method: 'POST',
        body: JSON.stringify({ truck_id: truckId, date, seq, option }),
      },
    );
    if (!result.ok) return { error: result.error };
    if (result.data.day) publish({ ...snapshot, days: merge([result.data.day]) });
    // The other days now say they no longer answer their own inputs, which
    // this page only learns by reading them again.
    if (snapshot.range) {
      loadedRanges.clear();
      await loadDays(snapshot.range);
    }
    await loadDayDetail(truckId, date);
    return { days: result.data.days };
  } finally {
    const pending = new Set(snapshot.pending);
    pending.delete(key);
    publish({ ...snapshot, pending });
  }
}

/**
 * Sets where an address on tickets is. Returns null on success, or the error
 * message when the typed address did not place precisely either.
 */
export async function fixPlace(placeKey: string, address: string): Promise<string | null> {
  if (snapshot.mode !== 'remote') return 'Your session has ended. Sign in again to save.';
  const result = await apiJson<{ place: unknown }>('/api/mileage/places', {
    method: 'POST',
    body: JSON.stringify({ place_key: placeKey, address }),
  });
  return result.ok ? null : result.error;
}
