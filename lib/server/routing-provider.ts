import type { LatLon, TruckRoutingProfile } from '@/lib/load-desk/mileage';
import { tomtomKey } from '@/lib/server/tomtom-key';
import { tomtomProvider } from '@/lib/server/tomtom-routing';

// What IFTA & Mileage asks of a map: where an address is, and how far a truck
// of a given size drives between two points. One interface, so the
// calculation never knows which provider answered, and swapping or adding one
// is a matter of another file under lib/server.

export type { LatLon, TruckRoutingProfile };

export type RouteResult = {
  miles: number;
  seconds: number;
  /** Encoded polyline of the route, kept for a later split by state. */
  geometry: string | null;
  geometryPrecision: 5 | 7 | null;
  /** A few provider figures worth keeping for an audit; never the whole answer. */
  providerMeta: Record<string, unknown>;
};

export type GeocodeResult =
  | {
      ok: true;
      position: LatLon;
      /** Short name for route lines, e.g. the town. */
      label: string;
      formatted: string;
      type: string;
      confidence: number | null;
      /** The match names the street, not the building (see GeocodeOptions). */
      approximate: boolean;
    }
  | {
      ok: false;
      reason: 'no_match' | 'low_confidence' | 'ambiguous';
      /** The provider's best guess, offered for a person to confirm — never used. */
      suggestion: string | null;
    };

export type GeocodeOptions = {
  /**
   * Accept a match that names the street but not the building. Only for an
   * address a person has typed and confirmed: automatic lookups take a
   * building-level match or nothing, so no stop is ever guessed at.
   */
  acceptStreet?: boolean;
};

export interface RoutingProvider {
  readonly name: 'tomtom';
  /** Changes when the provider's API version changes, so stored days say what routed them. */
  readonly version: string;
  geocode(query: string, bias?: LatLon, options?: GeocodeOptions): Promise<GeocodeResult>;
  calculateTruckRoute(
    origin: LatLon,
    destination: LatLon,
    profile: TruckRoutingProfile,
  ): Promise<RouteResult>;
  /**
   * Several ways to drive the same run, the provider's own answer first, for
   * a person to choose between. Never used by the calculation, which takes
   * the provider's answer as it always has.
   */
  truckRouteOptions(
    origin: LatLon,
    destination: LatLon,
    profile: TruckRoutingProfile,
    count: number,
  ): Promise<RouteResult[]>;
}

/**
 * Why a provider call did not answer. `permanent` means the request itself
 * cannot be served (no route between the points); `transient` means try
 * later; `config` means the deployment's key is wrong. Messages never carry
 * the request URL, which carries the key.
 */
export class ProviderError extends Error {
  constructor(
    message: string,
    readonly kind: 'permanent' | 'transient' | 'config',
    readonly status?: number,
  ) {
    super(message);
  }
}

/** The configured provider, or null when no key is set. */
export function routingProvider(): RoutingProvider | null {
  const key = tomtomKey();
  return key ? tomtomProvider(key) : null;
}
