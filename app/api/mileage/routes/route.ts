import {
  parseRouteChoiceBody,
  routeKey,
  routingProfileHash,
  toRoutingProfile,
  truckIfta,
  MAX_ROUTE_OPTIONS,
} from '@/lib/load-desk/mileage';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import {
  getDay,
  getRouteOptions,
  listTrucks,
  putRouteOptions,
  type RouteOption,
} from '@/lib/server/mileage-store';
import { routingProvider } from '@/lib/server/routing-provider';

/**
 * The ways one run of a stored day may be driven: { truck_id, date, seq }.
 *
 * The browser names a leg of a day it is looking at, and nothing else. Which
 * two places that leg runs between, and what the truck's size is, are read
 * from the day and the truck as they are stored — a page cannot ask about a
 * route of its own invention, and cannot say what one is worth.
 *
 * The ways offered are kept on the run itself, so a choice can name one by
 * position. Asking again offers them again, which is how a run whose roads
 * have changed since is brought up to date.
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
      const parsed = parseRouteChoiceBody(sent);
      if ('error' in parsed) return badRequest(parsed.error);
      const { truck_id: truckId, date, seq } = parsed.value;

      const provider = routingProvider();
      if (!provider) {
        return Response.json(
          { error: 'Mileage routing is not configured on this deployment.' },
          { status: 503 },
        );
      }
      const truck = (await listTrucks(client, member.workspaceId)).find(({ id }) => id === truckId);
      if (!truck) return Response.json({ error: 'That truck no longer exists.' }, { status: 404 });
      const worked = await getDay(client, member.workspaceId, truckId, date);
      const run = worked?.legs.find((leg) => leg.seq === seq);
      if (!worked || !run || run.route_id === null) {
        return Response.json({ error: 'That part of the day is not routed.' }, { status: 404 });
      }

      const profile = toRoutingProfile(truckIfta(truck));
      const key = routeKey(run.from, run.to, routingProfileHash(profile));
      const answers = await provider.truckRouteOptions(
        run.from,
        run.to,
        profile,
        MAX_ROUTE_OPTIONS - 1,
      );
      const options: RouteOption[] = answers.slice(0, MAX_ROUTE_OPTIONS).map((answer) => ({
        miles: answer.miles,
        seconds: answer.seconds,
        geometry: answer.geometry,
        precision: answer.geometryPrecision,
      }));
      await putRouteOptions(client, member.workspaceId, key, options);
      const settled = await getRouteOptions(client, member.workspaceId, key);

      return Response.json({
        from: run.from,
        to: run.to,
        // How much of the day rides on this one choice: every leg, anywhere in
        // the day, that is this same run.
        uses: worked.legs.filter((leg) => leg.route_id === run.route_id).length,
        in_use: settled?.chosen ?? null,
        options: options.map((option, at) => ({
          index: at,
          miles: option.miles,
          seconds: option.seconds,
          geometry:
            option.geometry && option.precision
              ? { polyline: option.geometry, precision: option.precision }
              : null,
        })),
      });
    },
    { write: true },
  );
}
