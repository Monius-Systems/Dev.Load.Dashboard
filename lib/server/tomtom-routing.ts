import { normalizeName } from '@/lib/load-desk/customer-rates';
import {
  ProviderError,
  type GeocodeResult,
  type LatLon,
  type RouteMode,
  type RouteOptionResult,
  type RouteResult,
  type RoutingProvider,
  type TruckRoutingProfile,
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
/** The most ways to drive one run the router is ever asked for at once. */
const MAX_ALTERNATIVES = 3;
const GEOCODE = 'https://api.tomtom.com/search/2/search';
const VERSION = 'routing/1;search/2-fuzzy2';
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

type Candidate = {
  type: string;
  confidence: number | null;
  lat: number | null;
  lon: number | null;
  municipality: string;
  localName: string;
  postalCode: string;
  formatted: string;
  streetName: string;
  poiName: string;
};

/** Words in a street name that do not tell one street from another. */
const STREET_FILLER = new Set(
  'N S E W NORTH SOUTH EAST WEST NE NW SE SW ST STREET RD ROAD AVE AVENUE BLVD BOULEVARD DR DRIVE LN LANE CT COURT HWY HIGHWAY PKWY PARKWAY TRL TRAIL WAY PL PLACE CIR CIRCLE TER TERRACE STATE COUNTY ROUTE RTE US IL IN'.split(' '),
);
const streetTokens = (name: string) =>
  normalizeName(name)
    .split(' ')
    .filter((token) => token && !STREET_FILLER.has(token));

const DIRECTIONS: Record<string, string> = {
  N: 'N', NORTH: 'N', S: 'S', SOUTH: 'S', E: 'E', EAST: 'E', W: 'W', WEST: 'W',
  NE: 'NE', NW: 'NW', SE: 'SE', SW: 'SW',
};
/** The compass prefixes in a street name or address: "S Williams St" → ["S"]. */
const directions = (text: string) =>
  normalizeName(text)
    .split(' ')
    .map((token) => DIRECTIONS[token])
    .filter((direction): direction is string => !!direction);

/** One search result, read field by field; nothing else of it is kept. */
function readResult(result: Record<string, unknown>): Candidate {
  const address = isObject(result.address) ? result.address : {};
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
  const entry =
    Array.isArray(result.entryPoints) && isObject(result.entryPoints[0]) && isObject(result.entryPoints[0].position)
      ? result.entryPoints[0].position
      : null;
  const position = entry ?? (isObject(result.position) ? result.position : null);
  return {
    type: text(result.type),
    confidence: isObject(result.matchConfidence) ? finite(result.matchConfidence.score) : null,
    lat: position ? finite(position.lat) : null,
    lon: position ? finite(position.lon) : null,
    municipality: text(address.municipality),
    localName: text(address.localName),
    postalCode: text(address.postalCode).slice(0, 5),
    formatted: text(address.freeformAddress),
    streetName: text(address.streetName),
    poiName: isObject(result.poi) ? text(result.poi.name) : '',
  };
}

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

/**
 * One call to the router: its own answer, and — where `alternatives` asks for
 * them — other ways to drive the same run. `mode` is what it is asked for, a
 * truck of the given size or an ordinary vehicle. Every answer is read field
 * by field; an alternative without a distance is dropped rather than guessed
 * at, and two that come back the same length are one way, not two.
 */
async function roads(
  apiKey: string,
  origin: LatLon,
  destination: LatLon,
  profile: TruckRoutingProfile,
  alternatives: number,
  mode: RouteMode = 'truck',
): Promise<RouteResult[]> {
  const url = new URL(
    `${ROUTING}/${origin.lat},${origin.lon}:${destination.lat},${destination.lon}/json`,
  );
  const params = url.searchParams;
  params.set('key', apiKey);
  params.set('travelMode', mode);
  params.set('routeType', 'fastest');
  params.set('traffic', 'false');
  params.set('routeRepresentation', 'encodedPolyline');
  params.set('computeTravelTimeFor', 'none');
  if (alternatives > 0) {
    params.set('maxAlternatives', String(Math.min(alternatives, MAX_ALTERNATIVES)));
    params.set('alternativeType', 'anyRoute');
  }
  // A car is asked about as a car: none of the truck's size, weight or
  // commercial standing, since the whole point of asking is the roads those
  // rules keep a truck off.
  if (mode === 'truck') {
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
  }

  const body = await fetchJson(url, 'routing');
  const formatVersion =
    isObject(body) && typeof body.formatVersion === 'string' ? body.formatVersion : null;
  const answers = isObject(body) && Array.isArray(body.routes) ? body.routes : [];
  const results: RouteResult[] = [];
  const seen = new Set<string>();
  for (const answer of answers) {
    const route = isObject(answer) ? answer : null;
    const summary = route && isObject(route.summary) ? route.summary : null;
    const meters = summary ? finite(summary.lengthInMeters) : null;
    const seconds = summary ? finite(summary.travelTimeInSeconds) : null;
    if (meters === null || seconds === null || meters < 0 || seconds < 0) continue;
    const legs = route && Array.isArray(route.legs) ? route.legs : [];
    const leg = isObject(legs[0]) ? legs[0] : null;
    const geometry = leg && typeof leg.encodedPolyline === 'string' ? leg.encodedPolyline : null;
    const precision = leg ? finite(leg.encodedPolylinePrecision) : null;
    const miles = round2(meters / METERS_PER_MILE);
    const key = `${miles}|${Math.round(seconds)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({
      miles,
      seconds: Math.round(seconds),
      geometry,
      geometryPrecision: geometry && (precision === 5 || precision === 7) ? precision : null,
      providerMeta: { lengthInMeters: meters, travelTimeInSeconds: seconds, formatVersion },
    });
  }
  if (!results.length) {
    throw new ProviderError('The routing service answered without a distance.', 'transient');
  }
  return results;
}

export function tomtomProvider(apiKey: string): RoutingProvider {
  return {
    name: 'tomtom',
    version: VERSION,

    async calculateTruckRoute(origin, destination, profile): Promise<RouteResult> {
      const [first] = await roads(apiKey, origin, destination, profile, 0);
      return first;
    },

    /**
     * Ways to drive the same run, for a person to look at and pick from: the
     * ways a truck of this size may go, and then the ways any vehicle may.
     *
     * The second kind is asked for because a driver who knows the run often
     * takes a road the truck rules keep the router off — and because seeing
     * both is the only way to tell that is what is happening. The calculation
     * itself never uses them: it takes the truck's own answer, as it always
     * has, until somebody chooses otherwise.
     */
    async routeOptions(origin, destination, profile, count): Promise<RouteOptionResult[]> {
      const asTruck = (await roads(apiKey, origin, destination, profile, count)).map(
        (route) => ({ ...route, mode: 'truck' as const }),
      );
      // A router that will not answer for a car is no reason to offer nothing:
      // the truck's own ways are the ones that matter.
      const asCar = await roads(apiKey, origin, destination, profile, count, 'car')
        .then((routes) => routes.map((route) => ({ ...route, mode: 'car' as const })))
        .catch(() => [] as RouteOptionResult[]);
      const seen = new Set<string>();
      const ways: RouteOptionResult[] = [];
      // The truck's ways first, and a car's way that is the same road as one
      // of them is that one, not a second entry.
      for (const way of [...asTruck, ...asCar]) {
        const key = `${way.miles}|${way.seconds}`;
        if (seen.has(key)) continue;
        seen.add(key);
        ways.push(way);
      }
      return ways;
    },

    async geocode(query, bias, options = {}): Promise<GeocodeResult> {
      const search = async (idxSet: string) => {
        const url = new URL(`${GEOCODE}/${encodeURIComponent(query.slice(0, 200))}.json`);
        url.searchParams.set('key', apiKey);
        url.searchParams.set('countrySet', 'US');
        url.searchParams.set('limit', '5');
        url.searchParams.set('idxSet', idxSet);
        if (bias) {
          url.searchParams.set('lat', String(bias.lat));
          url.searchParams.set('lon', String(bias.lon));
        }
        const body = await fetchJson(url, 'geocoding');
        const results = isObject(body) && Array.isArray(body.results) ? body.results.filter(isObject) : [];
        return results.map(readResult);
      };
      const wanted = normalizeName(query);
      // "700 E Joe Orr Rd" alone names no town, and the provider's best is taken.
      const queryNamesPlace = /\d{5}/.test(query) || query.includes(',');
      /** The result is in a town or ZIP the query names. */
      const inNamedTown = (result: Candidate) => {
        const towns = [result.municipality, result.localName].map(normalizeName).filter(Boolean);
        return towns.some((town) => wanted.includes(town)) || (!!result.postalCode && wanted.includes(result.postalCode));
      };
      /** As above, or the query names no town at all. */
      const inQueryTown = (result: Candidate) => inNamedTown(result) || !queryNamesPlace;
      const placed = (result: Candidate) => result.lat !== null && result.lon !== null;
      /**
       * The result's street is the one the query names: every telling word of
       * it ("WILLIAMS", "159TH") appears in the query. Fuzzy search otherwise
       * happily offers the same house number on another street in town.
       */
      const queryDirections = directions(query);
      const onQueryStreet = (result: Candidate, every = true) => {
        const tokens = streetTokens(result.streetName);
        if (!tokens.length) return false;
        const hits = tokens.filter((token) => wanted.includes(token));
        if (!(every ? hits.length === tokens.length : hits.length > 0)) return false;
        // "S Williams St" is not "North Williams Street".
        const theirs = directions(result.streetName);
        return !theirs.length || !queryDirections.length || theirs.some((d) => queryDirections.includes(d));
      };
      /** The town the ticket named, when the result is in it; else the provider's. */
      const townLabel = (result: Candidate) =>
        [result.localName, result.municipality].find((town) => town && wanted.includes(normalizeName(town))) ||
        result.municipality ||
        result.localName;
      const accept = (result: Candidate, approximate: boolean): GeocodeResult => ({
        ok: true,
        position: { lat: result.lat as number, lon: result.lon as number },
        label: townLabel(result) || result.formatted || query,
        formatted: result.formatted || query,
        type: result.type,
        confidence: result.confidence,
        approximate,
      });

      // First the building: addresses only, so a street does not outrank the
      // house number that is on it (fuzzy search ranks them the other way).
      const addresses = (await search('PAD,Addr')).filter(
        (result) => PRECISE_TYPES.has(result.type) && placed(result) && onQueryStreet(result),
      );
      const building = addresses.find(inQueryTown);
      if (building) {
        if (building.confidence !== null && building.confidence < MIN_CONFIDENCE) {
          return { ok: false, reason: 'low_confidence', suggestion: building.formatted || null };
        }
        // Without a town in the query, the same house number in another town
        // that scores as well is a coin toss, and a coin is not tossed.
        const rival = queryNamesPlace
          ? undefined
          : addresses.find(
              (other) =>
                other !== building && normalizeName(other.municipality) !== normalizeName(building.municipality),
            );
        const tied =
          !!rival &&
          (rival.confidence === null || building.confidence === null
            ? true
            : building.confidence - rival.confidence < TIE_MARGIN);
        if (tied) return { ok: false, reason: 'ambiguous', suggestion: building.formatted || null };
        return accept(building, false);
      }

      // Then everything else: a business by name, a road or a crossing.
      const others = (await search('PAD,Addr,Str,Xstr,Geo,POI')).filter(placed);
      const top = others[0];
      if (!top) return { ok: false, reason: 'no_match', suggestion: null };
      const suggestion = top.formatted || null;
      const hasNumber = /^\d{1,6}[A-Z]?\s/i.test(query.trim());
      const nameOf = (text: string) => normalizeName(text.split(',')[0]);
      // A business whose name is what the ticket printed, in the town it named.
      const business = others.find(
        (result) => result.type === 'POI' && result.poiName && nameOf(result.poiName) === nameOf(query) && inQueryTown(result),
      );
      if (business) return accept(business, false);
      // A road or crossing: exactly what a ticket names when there is no
      // street number to give, placed on that road in the town the ticket
      // names. A bare word ("THORNTON") names a town, not a road, and waits.
      if (!hasNumber && queryNamesPlace) {
        const crossing = /\b(AND|&|AT)\b/i.test(query)
          ? others.find((result) => result.type === 'Cross Street' && inNamedTown(result) && onQueryStreet(result, false))
          : undefined;
        const road =
          crossing ??
          others.find((result) => result.type === 'Street' && inNamedTown(result) && onQueryStreet(result));
        if (road) return accept(road, true);
      }
      // A person typed and confirmed this: the street they named, or the
      // place, will do.
      if (options.acceptStreet === true) {
        const confirmed = others.find(
          (result) =>
            (STREET_TYPES.has(result.type) && onQueryStreet(result, false)) ||
            (PRECISE_TYPES.has(result.type) && onQueryStreet(result)) ||
            result.type === 'POI',
        );
        if (confirmed) return accept(confirmed, STREET_TYPES.has(confirmed.type));
      }
      return { ok: false, reason: 'low_confidence', suggestion };
    },
  };
}
