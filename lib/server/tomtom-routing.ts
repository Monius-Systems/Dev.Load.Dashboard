import {
  ProviderError,
  type GeocodeResult,
  type RouteResult,
  type RoutingProvider,
} from '@/lib/server/routing-provider';

// TomTom, behind the routing-provider interface. The only file that knows the
// provider's URLs, parameters and answer shapes.
//
// Routing uses Maps Routing API v1 (calculateRoute) because it takes truck
// dimensions; Orbis routes cars only. Geocoding uses Search API v2 fuzzy
// search (search/2/search): current TomTom plans allow that endpoint but not
// the dedicated geocode one, and it answers in the same shape. Every answer
// is read field by field and never stored whole, and no error message ever
// carries a URL, since the URL carries the key.

const ROUTING = 'https://api.tomtom.com/routing/1/calculateRoute';
const GEOCODE = 'https://api.tomtom.com/search/2/search';
const VERSION = 'routing/1;search/2-fuzzy';
const TIMEOUT_MS = 10_000;
const RETRY_AFTER_MS = 500;
const METERS_PER_MILE = 1609.344;

/** Geocode results that name one building or one stretch of a street. */
const PRECISE_TYPES = new Set(['Point Address', 'Address Range']);
/** Results that name the street only; taken when a person confirms them. */
const STREET_TYPES = new Set(['Street', 'Cross Street']);
const MIN_CONFIDENCE = 0.8;
/** A second candidate this close, in another town, means the query is ambiguous. */
const TIE_MARGIN = 0.05;

const round2 = (value: number) => Math.round(value * 100) / 100;
const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const finite = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;
const clean = (message: string) => message.replace(/https?:\/\/\S+/g, '[url]').slice(0, 300);

/** A metre or kilogram figure the API takes; zero means "ignore", so never zero. */
const positive = (value: number, digits: number) =>
  value > 0 ? value.toFixed(digits) : null;

async function fetchJson(url: URL, what: string): Promise<unknown> {
  const attempt = async (): Promise<Response> => {
    try {
      return await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (error) {
      throw new ProviderError(
        `Could not reach the ${what} service: ${clean(error instanceof Error ? error.message : 'network error')}`,
        'transient',
      );
    }
  };
  const transient = (status: number) => status === 429 || status >= 500;
  let response: Response;
  try {
    response = await attempt();
    if (transient(response.status)) throw new ProviderError(`${what} answered ${response.status}`, 'transient', response.status);
  } catch (error) {
    if (!(error instanceof ProviderError) || error.kind !== 'transient') throw error;
    await new Promise((resolve) => setTimeout(resolve, RETRY_AFTER_MS));
    response = await attempt();
  }
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = isObject(body) && isObject(body.detailedError) ? body.detailedError : null;
    const message = clean(
      (detail && typeof detail.message === 'string' && detail.message) ||
        `The ${what} service answered ${response.status}.`,
    );
    if (response.status === 401 || response.status === 403) {
      throw new ProviderError(
        `The routing key is not accepted for ${what} (${message}). Check the key's products in the TomTom portal.`,
        'config',
        response.status,
      );
    }
    if (response.status === 400 || response.status === 404) {
      throw new ProviderError(message, 'permanent', response.status);
    }
    throw new ProviderError(message, 'transient', response.status);
  }
  return body;
}

export function tomtomProvider(apiKey: string): RoutingProvider {
  return {
    name: 'tomtom',
    version: VERSION,

    async calculateTruckRoute(origin, destination, profile): Promise<RouteResult> {
      const url = new URL(
        `${ROUTING}/${origin.lat},${origin.lon}:${destination.lat},${destination.lon}/json`,
      );
      const params = url.searchParams;
      params.set('key', apiKey);
      params.set('travelMode', 'truck');
      params.set('routeType', 'fastest');
      params.set('traffic', 'false');
      params.set('routeRepresentation', 'encodedPolyline');
      params.set('computeTravelTimeFor', 'none');
      params.set('vehicleCommercial', profile.commercial ? 'true' : 'false');
      const dimensions: [string, string | null][] = [
        ['vehicleHeight', positive(profile.heightM, 2)],
        ['vehicleWidth', positive(profile.widthM, 2)],
        ['vehicleLength', positive(profile.lengthM, 2)],
        ['vehicleWeight', positive(Math.round(profile.weightKg), 0)],
        ['vehicleAxleWeight', positive(Math.round(profile.axleWeightKg), 0)],
        ['vehicleNumberOfAxles', positive(Math.round(profile.axles), 0)],
      ];
      for (const [name, value] of dimensions) if (value !== null) params.set(name, value);

      const body = await fetchJson(url, 'routing');
      const routes = isObject(body) && Array.isArray(body.routes) ? body.routes : [];
      const route = isObject(routes[0]) ? routes[0] : null;
      const summary = route && isObject(route.summary) ? route.summary : null;
      const meters = summary ? finite(summary.lengthInMeters) : null;
      const seconds = summary ? finite(summary.travelTimeInSeconds) : null;
      if (meters === null || seconds === null || meters < 0 || seconds < 0) {
        throw new ProviderError('The routing service answered without a distance.', 'transient');
      }
      const legs = route && Array.isArray(route.legs) ? route.legs : [];
      const leg = isObject(legs[0]) ? legs[0] : null;
      const geometry = leg && typeof leg.encodedPolyline === 'string' ? leg.encodedPolyline : null;
      const precision = leg ? finite(leg.encodedPolylinePrecision) : null;
      return {
        miles: round2(meters / METERS_PER_MILE),
        seconds: Math.round(seconds),
        geometry,
        geometryPrecision: geometry && (precision === 5 || precision === 7) ? precision : null,
        providerMeta: {
          lengthInMeters: meters,
          travelTimeInSeconds: seconds,
          formatVersion: isObject(body) && typeof body.formatVersion === 'string' ? body.formatVersion : null,
        },
      };
    },

    async geocode(query, bias, options = {}): Promise<GeocodeResult> {
      const url = new URL(`${GEOCODE}/${encodeURIComponent(query.slice(0, 200))}.json`);
      url.searchParams.set('key', apiKey);
      url.searchParams.set('countrySet', 'US');
      url.searchParams.set('limit', '3');
      // Addresses and places only; no categories or brands.
      url.searchParams.set('idxSet', 'PAD,Addr,Str,Xstr,Geo,POI');
      if (bias) {
        url.searchParams.set('lat', String(bias.lat));
        url.searchParams.set('lon', String(bias.lon));
      }
      const body = await fetchJson(url, 'geocoding');
      const results = isObject(body) && Array.isArray(body.results) ? body.results.filter(isObject) : [];
      const read = (result: Record<string, unknown>) => {
        const address = isObject(result.address) ? result.address : {};
        const confidence = isObject(result.matchConfidence) ? finite(result.matchConfidence.score) : null;
        const entry = Array.isArray(result.entryPoints) && isObject(result.entryPoints[0]) && isObject(result.entryPoints[0].position)
          ? result.entryPoints[0].position
          : null;
        const position = entry ?? (isObject(result.position) ? result.position : null);
        const lat = position ? finite(position.lat) : null;
        const lon = position ? finite(position.lon) : null;
        const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
        return {
          type: text(result.type),
          confidence,
          lat,
          lon,
          municipality: text(address.municipality) || text(address.localName),
          formatted: text(address.freeformAddress),
        };
      };
      const [top, second] = results.map(read);
      if (!top) return { ok: false, reason: 'no_match', suggestion: null };
      const suggestion = top.formatted || null;
      const precise = PRECISE_TYPES.has(top.type);
      const street = options.acceptStreet === true && STREET_TYPES.has(top.type);
      if (!(precise || street) || top.lat === null || top.lon === null) {
        return { ok: false, reason: 'low_confidence', suggestion };
      }
      if (top.confidence !== null && top.confidence < MIN_CONFIDENCE) {
        return { ok: false, reason: 'low_confidence', suggestion };
      }
      if (
        second &&
        second.confidence !== null &&
        top.confidence !== null &&
        top.confidence - second.confidence < TIE_MARGIN &&
        second.municipality &&
        second.municipality !== top.municipality
      ) {
        return { ok: false, reason: 'ambiguous', suggestion };
      }
      return {
        ok: true,
        position: { lat: top.lat, lon: top.lon },
        label: top.municipality || top.formatted || query,
        formatted: top.formatted || query,
        type: top.type,
        confidence: top.confidence,
        approximate: !precise,
      };
    },
  };
}
