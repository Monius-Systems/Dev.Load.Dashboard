import { hasSession, noStore } from '@/lib/server/auth';
import { fetchTile, parseTile, TILE_CACHE_CONTROL } from '@/lib/server/map-tiles';

type Context = { params: Promise<{ z: string; x: string; y: string }> };

/**
 * One picture of the map, for the route drawn on the Mileage page.
 *
 * The browser never talks to the map source: it asks this route, which fetches
 * the tile with whatever credential the deployment holds. So a source that
 * needs a key can be configured without that key ever reaching a page, and
 * nothing about which company is looking leaves this app.
 *
 * A tile is the same picture of the world for everybody and says nothing about
 * any workspace, so this route only refuses requests with no session, rather
 * than asking Supabase about the person once per picture.
 */
export async function GET(request: Request, { params }: Context) {
  const { z, x, y } = await params;
  if (!(await hasSession(request))) {
    return Response.json({ error: 'Sign in with an authorized account.' }, { status: 401, headers: noStore });
  }
  const tile = parseTile(z, x, y);
  if (!tile) return Response.json({ error: 'Invalid tile.' }, { status: 400, headers: noStore });
  const picture = await fetchTile(tile);
  if (!picture) {
    // The map is an aid, never the answer: the page draws the route on its
    // plain canvas when this says no.
    return Response.json({ error: 'The map is unavailable.' }, { status: 502, headers: noStore });
  }
  return new Response(picture.body, {
    headers: {
      'Content-Type': picture.type,
      'Cache-Control': TILE_CACHE_CONTROL,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  });
}
