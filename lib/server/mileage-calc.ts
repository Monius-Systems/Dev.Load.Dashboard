import type { SupabaseClient } from '@supabase/supabase-js';
import {
  buildPlan,
  CALC_VERSION,
  estimatedGallons,
  inputHash,
  profileHash,
  routeKey,
  routingProfileHash,
  toRoutingProfile,
  truckIfta,
  type LatLon,
  type MileageDay,
  type MileageLeg,
  type MileagePlace,
  type PlanStop,
  type ReviewReason,
} from '@/lib/load-desk/mileage';
import { truckIdFor, type TruckProfile } from '@/lib/load-desk/profiles';
import {
  claimDay,
  deleteDay,
  ensureDay,
  getDay,
  getPlaces,
  getRoutes,
  putRoute,
  recordsForDay,
  upsertPlace,
  writeDayResult,
  writeDayState,
  type PlaceRow,
  type RouteRow,
} from '@/lib/server/mileage-store';
import { StoreError } from '@/lib/server/load-desk-store';
import { ProviderError, type RouteResult, type RoutingProvider } from '@/lib/server/routing-provider';

// Working out one truck-day: the plan from the tickets, the places from the
// cache or the provider, the legs from the cache or the provider, and the
// totals. The rules that matter:
//
// - A failure never touches the last good figures (writeDayState only).
// - Nothing is guessed: a place the provider is not sure of is a review item
//   with the provider's suggestion offered, and the day waits.
// - One provider call per unique leg and place, cached for every later day.

const round2 = (value: number) => Math.round(value * 100) / 100;

const yardLabel = (stop: PlanStop, place: PlaceRow) =>
  stop.kind === 'yard' ? 'Yard' : place.label || place.formatted || stop.query;

/** Adds every place the plan needs to the cache, asking the provider for the ones it lacks. */
async function resolvePlaces(
  client: SupabaseClient,
  workspace: string,
  provider: RoutingProvider,
  stops: PlanStop[],
): Promise<Map<string, PlaceRow>> {
  const wanted = new Map<string, PlanStop>();
  for (const stop of stops) if (stop.place_key && !wanted.has(stop.place_key)) wanted.set(stop.place_key, stop);
  const places = await getPlaces(client, workspace, [...wanted.keys()]);
  // The yard first, so the rest can be looked up near it.
  const order = [...wanted.values()].sort((a, b) => Number(b.kind === 'yard') - Number(a.kind === 'yard'));
  let bias: LatLon | undefined;
  for (const stop of order) {
    let place = places.get(stop.place_key);
    if (!place) {
      const answer = await provider.geocode(stop.query, bias);
      place = await upsertPlace(
        client,
        workspace,
        answer.ok
          ? {
              place_key: stop.place_key,
              query_text: stop.query,
              provider: provider.name,
              status: 'resolved',
              position: answer.position,
              label: answer.label,
              formatted: answer.formatted,
              resolved_by: 'provider',
              resolved_query: null,
              provider_type: answer.type,
              confidence: answer.confidence,
            }
          : {
              place_key: stop.place_key,
              query_text: stop.query,
              provider: provider.name,
              status: 'unresolved',
              reason: answer.reason,
              suggestion: answer.suggestion,
            },
      );
      places.set(stop.place_key, place);
    }
    if (stop.kind === 'yard' && place.status === 'resolved' && place.lat !== null && place.lon !== null) {
      bias = { lat: place.lat, lon: place.lon };
    }
  }
  return places;
}

/**
 * Recalculates one truck-day and returns the stored row, or null when the
 * truck has no tickets that day (the row is removed). `force` asks the
 * provider again for every leg instead of using cached routes.
 */
export async function recalculateDay(
  client: SupabaseClient,
  workspace: string,
  provider: RoutingProvider,
  trucks: TruckProfile[],
  truck: TruckProfile,
  date: string,
  { force = false } = {},
): Promise<MileageDay | null> {
  await ensureDay(client, workspace, truck, date);
  if (!(await claimDay(client, workspace, truck.id, date))) {
    return getDay(client, workspace, truck.id, date);
  }
  const records = (await recordsForDay(client, workspace, date)).filter(
    (record) => truckIdFor(record, trucks) === truck.id,
  );
  if (!records.length) {
    await deleteDay(client, workspace, truck.id, date);
    return null;
  }
  const hash = inputHash(records, truck.id);
  const ifta = truckIfta(truck);
  const state = (
    status: 'needs_review' | 'failed',
    reasons: ReviewReason[],
    warnings: string[],
    error: string | null,
  ) =>
    writeDayState(client, workspace, truck.id, date, {
      truck_number: truck.truck_number,
      status,
      review_reasons: reasons,
      warnings,
      error,
      input_hash: hash,
    });

  // Which step a failure happened in, so the day can say so.
  let stage: 'planning' | 'placing addresses' | 'routing' | 'saving' = 'planning';
  try {
    const plan = buildPlan(records, ifta);
    if (plan.blocking.length) {
      return await state('needs_review', [...plan.blocking, ...plan.reasons], plan.warnings, null);
    }

    stage = 'placing addresses';
    const places = await resolvePlaces(client, workspace, provider, plan.stops);
    const unresolved: ReviewReason[] = [];
    const seen = new Set<string>();
    for (const stop of plan.stops) {
      const place = places.get(stop.place_key);
      if (place && place.status === 'resolved' && place.lat !== null && place.lon !== null) continue;
      if (seen.has(stop.place_key)) continue;
      seen.add(stop.place_key);
      unresolved.push({
        code: 'place_unresolved',
        ticket_id: stop.ticket_id ?? undefined,
        place_key: stop.place_key,
        query: stop.query,
        suggestion: place?.suggestion ?? null,
        detail: place?.reason ?? 'no_match',
      });
    }
    if (unresolved.length) {
      return await state('needs_review', [...unresolved, ...plan.reasons], plan.warnings, null);
    }
    // A stop a person placed at street level (the map has no house number
    // there) is noted on the day, once per place, without holding it up.
    const warnings = [...plan.warnings];
    const noted = new Set<string>();
    for (const stop of plan.stops) {
      const place = places.get(stop.place_key);
      if (!place || noted.has(stop.place_key)) continue;
      if (place.provider_type === 'Street' || place.provider_type === 'Cross Street') {
        noted.add(stop.place_key);
        warnings.push(`${stop.query} is placed at street level; the map has no house number there.`);
      }
    }

    stage = 'routing';
    const profile = toRoutingProfile(ifta);
    const profileKey = routingProfileHash(profile);
    const at = (stop: PlanStop): MileagePlace => {
      const place = places.get(stop.place_key) as PlaceRow;
      return {
        label: yardLabel(stop, place),
        place_key: stop.place_key,
        lat: place.lat as number,
        lon: place.lon as number,
      };
    };
    const keys = plan.legs
      .filter((leg) => leg.kind !== 'same_place')
      .map((leg) => routeKey(at(leg.from), at(leg.to), profileKey));
    const routes = force ? new Map<string, RouteRow>() : await getRoutes(client, workspace, [...new Set(keys)]);
    const legs: MileageLeg[] = [];
    for (const leg of plan.legs) {
      const from = at(leg.from);
      const to = at(leg.to);
      if (leg.kind === 'same_place') {
        legs.push({ seq: leg.seq, kind: leg.kind, ticket_id: leg.ticket_id, from, to, miles: 0, seconds: 0, route_id: null, cached: false });
        continue;
      }
      const key = routeKey(from, to, profileKey);
      let route = routes.get(key);
      let cached = true;
      if (!route) {
        cached = false;
        let answer: RouteResult;
        try {
          answer = await provider.calculateTruckRoute(from, to, profile);
        } catch (error) {
          if (error instanceof ProviderError && error.kind === 'permanent') {
            return await state(
              'needs_review',
              [
                {
                  code: 'no_route',
                  ticket_id: leg.ticket_id ?? undefined,
                  detail: `${from.label} → ${to.label}: ${error.message}`,
                },
                ...plan.reasons,
              ],
              warnings,
              null,
            );
          }
          const message =
            error instanceof ProviderError
              ? error.message
              : 'The routing service did not answer. Try again.';
          return await state('failed', plan.reasons, warnings, message);
        }
        route = await putRoute(client, workspace, {
          route_key: key,
          origin: from,
          destination: to,
          profile,
          provider: provider.name,
          provider_version: provider.version,
          miles: answer.miles,
          seconds: answer.seconds,
          geometry: answer.geometry,
          geometry_precision: answer.geometryPrecision,
          provider_meta: answer.providerMeta,
        });
        routes.set(key, route);
      }
      legs.push({
        seq: leg.seq,
        kind: leg.kind,
        ticket_id: leg.ticket_id,
        from,
        to,
        miles: route.miles,
        seconds: route.seconds,
        route_id: route.id,
        cached,
      });
    }

    stage = 'saving';
    const totalMiles = round2(legs.reduce((sum, leg) => sum + leg.miles, 0));
    const totalSeconds = legs.reduce((sum, leg) => sum + leg.seconds, 0);
    return await writeDayResult(client, workspace, truck.id, date, {
      truck_number: truck.truck_number,
      status: plan.reasons.length ? 'needs_review' : 'current',
      review_reasons: plan.reasons,
      warnings,
      input_hash: hash,
      ticket_ids: plan.ticket_ids,
      order_basis: plan.order_basis,
      legs,
      total_miles: totalMiles,
      total_seconds: totalSeconds,
      mpg: ifta.mpg,
      est_gallons: estimatedGallons(totalMiles, ifta.mpg),
      profile_snapshot: ifta,
      profile_hash: profileHash(ifta, provider.version),
      calc_version: CALC_VERSION,
    });
  } catch (error) {
    // Never the key and never a payload: only that the day did not calculate,
    // at which step, and what the provider or database said about it. The
    // provider's messages already have any URL (which carries the key)
    // stripped; a store error is the app's own wording.
    const detail =
      error instanceof ProviderError || error instanceof StoreError
        ? error.message
        : 'Try again.';
    console.error(`IFTA: day ${date} for truck ${truck.id} failed while ${stage}`, error instanceof Error ? error.message : 'unknown error');
    return state('failed', [], [], `Calculation failed while ${stage}: ${detail}`);
  }
}
