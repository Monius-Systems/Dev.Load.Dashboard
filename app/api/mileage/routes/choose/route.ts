import {
  parseRouteChoiceBody,
  routeKey,
  routingProfileHash,
  toRoutingProfile,
  truckIfta,
} from '@/lib/load-desk/mileage';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { recalculateDay } from '@/lib/server/mileage-calc';
import {
  chooseRouteOption,
  getDay,
  listTrucks,
  markDaysStaleForRoute,
} from '@/lib/server/mileage-store';
import { routingProvider } from '@/lib/server/routing-provider';

/**
 * Settles how a run is driven: { truck_id, date, seq, option }.
 *
 * `option` is a position in the ways last offered for that run, which the
 * server itself stored — the browser never sends a distance, a time or a
 * line. What is chosen becomes the run's own figures, so every leg between
 * those two places is worth it: the other eight loads of a shuttle day, the
 * empty run home from the last job, and the same run on any other day.
 *
 * Days already worked out with the old figures no longer answer their own
 * inputs, so they are marked for working out again. This day is done here and
 * now, from the cache, so the person sees their choice take effect; the rest
 * follow as Mileage reaches them, and each keeps its last good figures until
 * it does.
 */
export function POST(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      let sent: Record<string, unknown>;
      try {
        sent = await boundedJson(request, 2_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const parsed = parseRouteChoiceBody(sent, { needsOption: true });
      if ('error' in parsed) return badRequest(parsed.error);
      const { truck_id: truckId, date, seq, option } = parsed.value;

      const provider = routingProvider();
      if (!provider) {
        return Response.json(
          { error: 'Mileage routing is not configured on this deployment.' },
          { status: 503 },
        );
      }
      const trucks = await listTrucks(client, member.workspaceId);
      const truck = trucks.find(({ id }) => id === truckId);
      if (!truck) return Response.json({ error: 'That truck no longer exists.' }, { status: 404 });
      const worked = await getDay(client, member.workspaceId, truckId, date);
      const run = worked?.legs.find((leg) => leg.seq === seq);
      if (!run || run.route_id === null) {
        return Response.json({ error: 'That part of the day is not routed.' }, { status: 404 });
      }

      const key = routeKey(
        run.from,
        run.to,
        routingProfileHash(toRoutingProfile(truckIfta(truck))),
      );
      const settled = await chooseRouteOption(client, member.workspaceId, key, option ?? 0);
      if (!settled) {
        return Response.json(
          { error: 'That way is no longer offered. Look at the ways again.' },
          { status: 409 },
        );
      }
      const days = await markDaysStaleForRoute(client, member.workspaceId, settled.id);
      const day = await recalculateDay(client, member.workspaceId, provider, trucks, truck, date);
      return Response.json({
        day,
        miles: settled.miles,
        // This day included, so a page can say how far the choice reaches.
        days,
        configured: true,
      });
    },
    { write: true },
  );
}
