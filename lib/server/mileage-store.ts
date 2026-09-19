import type { SupabaseClient } from '@supabase/supabase-js';
import {
  CLAIM_TIMEOUT_MS,
  readMileageDay,
  type LatLon,
  type MileageDay,
  type MileageLeg,
  type MileageStatus,
  type OrderBasis,
  type ReviewReason,
  type TruckRoutingProfile,
} from '@/lib/load-desk/mileage';
import type { TruckIfta, TruckProfile } from '@/lib/load-desk/profiles';
import type { NewTruck } from '@/lib/load-desk/record-input';
import type { SavedRecord } from '@/lib/load-desk/types';
import { StoreError } from '@/lib/server/load-desk-store';

// Supabase storage for IFTA & Mileage: the per-day rows and the two caches.
// Every function is given the workspace of the person making the request —
// there is no default and no global to fall back to — and runs as the
// signed-in user, so row level security enforces the same boundary.
//
// Two kinds of write to a day: state (what the last attempt did) and result
// (what the last success found). They are separate functions on purpose, so a
// failure can never touch the figures.

const unavailable = (what: string) =>
  new StoreError(`Could not ${what}. Please try again.`, 503);

const DAY_COLUMNS =
  'id, truck_id, truck_number, service_date, status, review_reasons, warnings, error, calc_started_at, last_attempt_at, input_hash, result_input_hash, ticket_ids, ticket_count, order_basis, legs, total_miles, total_seconds, mpg, est_gallons, profile_snapshot, profile_hash, calc_version, calculated_at';

// ---------------------------------------------------------------- lookups

export async function listTrucks(client: SupabaseClient, workspace: string): Promise<TruckProfile[]> {
  const { data, error } = await client
    .from('load_desk_profiles')
    .select('id, profile')
    .eq('workspace_id', workspace)
    .eq('kind', 'truck')
    .order('id', { ascending: true });
  if (error) throw unavailable('load trucks');
  return data.map((row) => ({ ...(row.profile as NewTruck), id: Number(row.id) }));
}

/** Every saved ticket dated `date`, whichever truck it was hauled by. */
export async function recordsForDay(
  client: SupabaseClient,
  workspace: string,
  date: string,
): Promise<SavedRecord[]> {
  const { data, error } = await client
    .from('load_desk_records')
    .select('id, record')
    .eq('workspace_id', workspace)
    .eq('ticket_date', date)
    .order('id', { ascending: true });
  if (error) throw unavailable('load the tickets for that day');
  return data.map((row) => ({ ...(row.record as Omit<SavedRecord, 'id'>), id: Number(row.id) }));
}

// ------------------------------------------------------------------- days

export async function listDays(
  client: SupabaseClient,
  workspace: string,
  from: string,
  to: string,
): Promise<MileageDay[]> {
  const { data, error } = await client
    .from('load_desk_daily_mileage')
    .select(DAY_COLUMNS)
    .eq('workspace_id', workspace)
    .gte('service_date', from)
    .lte('service_date', to)
    .order('service_date', { ascending: false })
    .order('truck_id', { ascending: true });
  if (error) throw unavailable('load mileage');
  return data.map((row) => readMileageDay(row as Record<string, unknown>));
}

export async function getDay(
  client: SupabaseClient,
  workspace: string,
  truckId: number,
  date: string,
): Promise<MileageDay | null> {
  const { data, error } = await client
    .from('load_desk_daily_mileage')
    .select(DAY_COLUMNS)
    .eq('workspace_id', workspace)
    .eq('truck_id', truckId)
    .eq('service_date', date)
    .maybeSingle();
  if (error) throw unavailable('load that day');
  return data ? readMileageDay(data as Record<string, unknown>) : null;
}

/**
 * Makes sure the day has a row. A row that is already there is left alone.
 * A new row is unclaimed (no calc_started_at), so the claim that follows
 * takes it.
 */
export async function ensureDay(
  client: SupabaseClient,
  workspace: string,
  truck: Pick<TruckProfile, 'id' | 'truck_number'>,
  date: string,
): Promise<void> {
  const { error } = await client.from('load_desk_daily_mileage').upsert(
    {
      workspace_id: workspace,
      truck_id: truck.id,
      truck_number: truck.truck_number,
      service_date: date,
      status: 'calculating',
      calc_started_at: null,
    },
    { onConflict: 'workspace_id,truck_id,service_date', ignoreDuplicates: true },
  );
  if (error) throw unavailable('start the calculation');
}

/**
 * Takes the day for this request: marks it calculating unless another
 * request did so within the last three minutes. False means someone else has
 * it; the caller shows what is stored and lets them finish.
 */
export async function claimDay(
  client: SupabaseClient,
  workspace: string,
  truckId: number,
  date: string,
): Promise<boolean> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - CLAIM_TIMEOUT_MS).toISOString();
  const { data, error } = await client
    .from('load_desk_daily_mileage')
    .update({
      status: 'calculating',
      calc_started_at: now.toISOString(),
      last_attempt_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('workspace_id', workspace)
    .eq('truck_id', truckId)
    .eq('service_date', date)
    .or(`status.neq.calculating,calc_started_at.is.null,calc_started_at.lt.${cutoff}`)
    .select('id');
  if (error) throw unavailable('start the calculation');
  return data.length > 0;
}

export type DayResult = {
  truck_number: string;
  status: Extract<MileageStatus, 'current' | 'needs_review'>;
  review_reasons: ReviewReason[];
  warnings: string[];
  input_hash: string;
  ticket_ids: number[];
  order_basis: OrderBasis;
  legs: MileageLeg[];
  total_miles: number;
  total_seconds: number;
  mpg: number | null;
  est_gallons: number | null;
  profile_snapshot: TruckIfta;
  profile_hash: string;
  calc_version: number;
};

/** A success: every result column and the state, in one update. */
export async function writeDayResult(
  client: SupabaseClient,
  workspace: string,
  truckId: number,
  date: string,
  result: DayResult,
): Promise<MileageDay> {
  const now = new Date().toISOString();
  const { data, error } = await client
    .from('load_desk_daily_mileage')
    .update({
      truck_number: result.truck_number,
      status: result.status,
      review_reasons: result.review_reasons,
      warnings: result.warnings,
      error: null,
      last_attempt_at: now,
      input_hash: result.input_hash,
      result_input_hash: result.input_hash,
      ticket_ids: result.ticket_ids,
      ticket_count: result.ticket_ids.length,
      order_basis: result.order_basis,
      legs: result.legs,
      total_miles: result.total_miles,
      total_seconds: result.total_seconds,
      mpg: result.mpg,
      est_gallons: result.est_gallons,
      profile_snapshot: result.profile_snapshot,
      profile_hash: result.profile_hash,
      calc_version: result.calc_version,
      calculated_at: now,
      updated_at: now,
    })
    .eq('workspace_id', workspace)
    .eq('truck_id', truckId)
    .eq('service_date', date)
    .select(DAY_COLUMNS)
    .maybeSingle();
  if (error || !data) throw unavailable('save the mileage');
  return readMileageDay(data as Record<string, unknown>);
}

/** What an attempt found without a result: state columns only, figures untouched. */
export async function writeDayState(
  client: SupabaseClient,
  workspace: string,
  truckId: number,
  date: string,
  state: {
    truck_number?: string;
    status: Extract<MileageStatus, 'needs_review' | 'failed'>;
    review_reasons: ReviewReason[];
    warnings: string[];
    error: string | null;
    input_hash: string | null;
  },
): Promise<MileageDay> {
  const now = new Date().toISOString();
  const { data, error } = await client
    .from('load_desk_daily_mileage')
    .update({
      ...(state.truck_number !== undefined ? { truck_number: state.truck_number } : {}),
      status: state.status,
      review_reasons: state.review_reasons,
      warnings: state.warnings,
      error: state.error,
      last_attempt_at: now,
      input_hash: state.input_hash,
      updated_at: now,
    })
    .eq('workspace_id', workspace)
    .eq('truck_id', truckId)
    .eq('service_date', date)
    .select(DAY_COLUMNS)
    .maybeSingle();
  if (error || !data) throw unavailable('save the day');
  return readMileageDay(data as Record<string, unknown>);
}

export async function deleteDay(
  client: SupabaseClient,
  workspace: string,
  truckId: number,
  date: string,
): Promise<void> {
  const { error } = await client
    .from('load_desk_daily_mileage')
    .delete()
    .eq('workspace_id', workspace)
    .eq('truck_id', truckId)
    .eq('service_date', date);
  if (error) throw unavailable('remove the day');
}

// ----------------------------------------------------------------- places

export type PlaceRow = {
  id: number;
  place_key: string;
  query_text: string;
  status: 'resolved' | 'unresolved';
  lat: number | null;
  lon: number | null;
  label: string | null;
  formatted: string | null;
  resolved_by: 'provider' | 'user' | null;
  reason: string | null;
  suggestion: string | null;
};

const PLACE_COLUMNS =
  'id, place_key, query_text, status, lat, lon, label, formatted, resolved_by, reason, suggestion';

const readPlace = (row: Record<string, unknown>): PlaceRow => ({
  id: Number(row.id),
  place_key: typeof row.place_key === 'string' ? row.place_key : '',
  query_text: typeof row.query_text === 'string' ? row.query_text : '',
  status: row.status === 'resolved' ? 'resolved' : 'unresolved',
  lat: typeof row.lat === 'number' ? row.lat : null,
  lon: typeof row.lon === 'number' ? row.lon : null,
  label: typeof row.label === 'string' ? row.label : null,
  formatted: typeof row.formatted === 'string' ? row.formatted : null,
  resolved_by: row.resolved_by === 'user' ? 'user' : row.resolved_by === 'provider' ? 'provider' : null,
  reason: typeof row.reason === 'string' ? row.reason : null,
  suggestion: typeof row.suggestion === 'string' ? row.suggestion : null,
});

export async function getPlaces(
  client: SupabaseClient,
  workspace: string,
  keys: string[],
): Promise<Map<string, PlaceRow>> {
  if (!keys.length) return new Map();
  const { data, error } = await client
    .from('load_desk_places')
    .select(PLACE_COLUMNS)
    .eq('workspace_id', workspace)
    .in('place_key', keys);
  if (error) throw unavailable('load places');
  return new Map(data.map((row) => {
    const place = readPlace(row as Record<string, unknown>);
    return [place.place_key, place];
  }));
}

export type PlaceUpsert = {
  place_key: string;
  query_text: string;
  provider: string;
} & (
  | {
      status: 'resolved';
      position: LatLon;
      label: string;
      formatted: string;
      resolved_by: 'provider' | 'user';
      resolved_query: string | null;
      provider_type: string;
      confidence: number | null;
    }
  | { status: 'unresolved'; reason: string; suggestion: string | null }
);

export async function upsertPlace(
  client: SupabaseClient,
  workspace: string,
  place: PlaceUpsert,
): Promise<PlaceRow> {
  const now = new Date().toISOString();
  // Named apart so the scope guard in the tests reads only real writes.
  type Row = Record<'workspace_id', string> & {
    place_key: string;
    query_text: string;
    status: 'resolved' | 'unresolved';
    lat: number | null;
    lon: number | null;
    label: string | null;
    formatted: string | null;
    resolved_by: 'provider' | 'user' | null;
    resolved_query: string | null;
    provider: string;
    provider_type: string | null;
    confidence: number | null;
    reason: string | null;
    suggestion: string | null;
    updated_at: string;
  };
  const row: Row =
    place.status === 'resolved'
      ? {
          workspace_id: workspace,
          place_key: place.place_key,
          query_text: place.query_text,
          status: 'resolved',
          lat: place.position.lat,
          lon: place.position.lon,
          label: place.label.slice(0, 120),
          formatted: place.formatted.slice(0, 400),
          resolved_by: place.resolved_by,
          resolved_query: place.resolved_query,
          provider: place.provider,
          provider_type: place.provider_type.slice(0, 60),
          confidence: place.confidence,
          reason: null,
          suggestion: null,
          updated_at: now,
        }
      : {
          workspace_id: workspace,
          place_key: place.place_key,
          query_text: place.query_text,
          status: 'unresolved',
          lat: null,
          lon: null,
          label: null,
          formatted: null,
          resolved_by: null,
          resolved_query: null,
          provider: place.provider,
          provider_type: null,
          confidence: null,
          reason: place.reason,
          suggestion: place.suggestion?.slice(0, 400) ?? null,
          updated_at: now,
        };
  const { data, error } = await client
    .from('load_desk_places')
    .upsert(row, { onConflict: 'workspace_id,place_key' })
    .select(PLACE_COLUMNS)
    .single();
  if (error || !data) throw unavailable('save the place');
  return readPlace(data as Record<string, unknown>);
}

// ----------------------------------------------------------------- routes

export type RouteRow = { id: number; route_key: string; miles: number; seconds: number };

export async function getRoutes(
  client: SupabaseClient,
  workspace: string,
  keys: string[],
): Promise<Map<string, RouteRow>> {
  if (!keys.length) return new Map();
  const { data, error } = await client
    .from('load_desk_routes')
    .select('id, route_key, miles, seconds')
    .eq('workspace_id', workspace)
    .in('route_key', keys);
  if (error) throw unavailable('load routes');
  return new Map(
    data.map((row) => [
      String(row.route_key),
      {
        id: Number(row.id),
        route_key: String(row.route_key),
        miles: Number(row.miles),
        seconds: Number(row.seconds),
      },
    ]),
  );
}

export async function putRoute(
  client: SupabaseClient,
  workspace: string,
  route: {
    route_key: string;
    origin: LatLon;
    destination: LatLon;
    profile: TruckRoutingProfile;
    provider: string;
    provider_version: string;
    miles: number;
    seconds: number;
    geometry: string | null;
    geometry_precision: 5 | 7 | null;
    provider_meta: Record<string, unknown>;
  },
): Promise<RouteRow> {
  const { data, error } = await client
    .from('load_desk_routes')
    .upsert(
      {
        workspace_id: workspace,
        route_key: route.route_key,
        origin_lat: route.origin.lat,
        origin_lon: route.origin.lon,
        dest_lat: route.destination.lat,
        dest_lon: route.destination.lon,
        profile: route.profile,
        provider: route.provider,
        provider_version: route.provider_version,
        miles: route.miles,
        seconds: route.seconds,
        geometry: route.geometry,
        geometry_precision: route.geometry_precision,
        provider_meta: route.provider_meta,
        calculated_at: new Date().toISOString(),
      },
      { onConflict: 'workspace_id,route_key' },
    )
    .select('id, route_key, miles, seconds')
    .single();
  if (error || !data) throw unavailable('save the route');
  return {
    id: Number(data.id),
    route_key: String(data.route_key),
    miles: Number(data.miles),
    seconds: Number(data.seconds),
  };
}
