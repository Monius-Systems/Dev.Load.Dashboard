import { env } from 'cloudflare:workers';

// The map under the route lines: square images of the world, fetched here and
// passed to the browser by /api/mileage/tiles, so a source that needs a key
// can be swapped in without that key ever reaching a page.
//
// The default source is OpenStreetMap's own tiles, which need no key. Their
// tile policy asks for three things and this file does all three: an honest
// User-Agent, no bulk downloading (a request only ever fetches the handful of
// tiles one day's route covers, and every answer is cached for a week), and
// the credit shown beside the map. A deployment that would rather pay a
// provider sets MAP_TILE_URL and MAP_TILE_CREDIT and nothing else changes.

const DEFAULT_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const DEFAULT_CREDIT = '© OpenStreetMap contributors';
/** Named in the User-Agent, as the policy asks, so a problem can be traced. */
const CONTACT = 'https://moniussystems.com';

/** Tiles are this many pixels square; the projection in route-geometry agrees. */
export const TILE_SIZE = 256;
/** Past this the source runs out of pictures long before a route needs to. */
export const MAX_TILE_ZOOM = 18;

const TIMEOUT_MS = 8_000;
const CACHE_SECONDS = 7 * 24 * 60 * 60;

export type Tile = { z: number; x: number; y: number };

const setting = (name: string) => {
  const value = (env as unknown as Record<string, string | undefined>)[name];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

/** The words shown in the corner of every map drawn from this source. */
export const mapCredit = () =>
  setting('MAP_TILE_CREDIT') ?? (setting('MAP_TILE_URL') ? '' : DEFAULT_CREDIT);

/**
 * One tile of the world, as three whole numbers: zoom, and the column and row
 * at that zoom. Anything else — a float, a negative, a row past the edge of
 * the world, a zoom no source serves — is not a tile and is refused before
 * anything is fetched.
 */
export function parseTile(z: string, x: string, y: string): Tile | null {
  const whole = (value: string) => (/^\d{1,9}$/.test(value) ? Number(value) : null);
  const zoom = whole(z);
  const column = whole(x);
  // The row carries the file extension the browser asked for.
  const row = whole(y.replace(/\.(png|jpg|jpeg|webp)$/i, ''));
  if (zoom === null || column === null || row === null) return null;
  if (zoom > MAX_TILE_ZOOM) return null;
  const across = 2 ** zoom;
  if (column >= across || row >= across) return null;
  return { z: zoom, x: column, y: row };
}

/**
 * The picture for one tile. Null when the source refuses it or is unreachable,
 * which the map treats as "no map today" and draws its plain canvas instead.
 *
 * The answer is cached at the edge for a week, so a day opened twice, or by
 * two people, costs the source one request rather than one per look.
 */
export async function fetchTile(tile: Tile): Promise<{ body: ArrayBuffer; type: string } | null> {
  const template = setting('MAP_TILE_URL') ?? DEFAULT_URL;
  const url = template
    .replace('{z}', String(tile.z))
    .replace('{x}', String(tile.x))
    .replace('{y}', String(tile.y));
  try {
    const answer = await fetch(url, {
      headers: {
        'User-Agent': `Monius Load Desk (+${CONTACT})`,
        Accept: 'image/png,image/webp,image/*',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cf: { cacheEverything: true, cacheTtl: CACHE_SECONDS },
    } as RequestInit);
    if (!answer.ok) return null;
    const type = answer.headers.get('Content-Type') ?? '';
    if (!type.startsWith('image/')) return null;
    return { body: await answer.arrayBuffer(), type };
  } catch {
    return null;
  }
}

/** How long the browser may keep a tile. The map is drawn, never panned. */
export const TILE_CACHE_CONTROL = `private, max-age=${CACHE_SECONDS}, immutable`;
