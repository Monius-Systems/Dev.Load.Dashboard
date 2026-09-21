import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';

// The reader's misreads, learned from what people type over them, shared by
// every workspace on this deployment. See supabase/migrations/
// 202609210001_misreads.sql for what a row is allowed to hold: a vendor,
// a kind of field and two single characters, counted. Nothing of any
// company's tickets passes through here.

/** Every pair on file, for the browser to teach the misread rule at start-up. */
export function GET(request: Request) {
  return memberRoute(request, async (client) => {
    const { data, error } = await client
      .from('load_desk_misreads')
      .select('vendor, field, read_char, actual_char, count')
      .limit(2000);
    // A deployment whose database is behind the app has no table yet; the
    // browser then knows only the built-in pairs, which is how it was.
    if (error) return Response.json({ pairs: [] });
    return Response.json({
      pairs: data.map((row) => ({
        vendor: row.vendor as string,
        field: row.field as string,
        read: row.read_char as string,
        actual: row.actual_char as string,
        count: Number(row.count),
      })),
    });
  });
}

/** One more sighting of a pair, from a person typing over a misread. */
export function POST(request: Request) {
  return memberRoute(
    request,
    async (client) => {
      let body: Record<string, unknown>;
      try {
        body = await boundedJson(request, 2_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const { vendor, field, read, actual } = body;
      const one = (value: unknown) => typeof value === 'string' && /^[0-9A-Za-z]$/.test(value);
      if (
        typeof vendor !== 'string' ||
        !vendor.trim() ||
        vendor.length > 40 ||
        !['date', 'number', 'weight'].includes(field as string) ||
        !one(read) ||
        !one(actual)
      ) {
        return badRequest('Send a vendor, a field kind and two single characters.');
      }
      const { error } = await client.rpc('load_desk_note_misread', {
        p_vendor: vendor.trim().toLowerCase(),
        p_field: field,
        p_read: read,
        p_actual: actual,
      });
      // Learning is never allowed to fail a save. A database without the
      // table yet simply learns nothing.
      return Response.json({ ok: !error });
    },
    { write: true },
  );
}
