import { badRequest, memberRoute } from '@/lib/server/member-route';
import { getDay, getRouteGeometries } from '@/lib/server/mileage-store';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * One stored truck-day (?truck_id&date) with the lines of the routes it was
 * worked out from, so the page can draw the day on a map. The geometry is
 * keyed by route id, as the day's legs carry them.
 */
export function GET(request: Request) {
  return memberRoute(request, async (client, member) => {
    const url = new URL(request.url);
    const truckId = Number(url.searchParams.get('truck_id'));
    const date = url.searchParams.get('date') ?? '';
    if (!Number.isSafeInteger(truckId) || truckId <= 0) return badRequest('Unknown truck.');
    if (!ISO_DATE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
      return badRequest('Dates must be YYYY-MM-DD.');
    }
    const day = await getDay(client, member.workspaceId, truckId, date);
    const ids = [
      ...new Set(
        (day?.legs ?? [])
          .map((leg) => leg.route_id)
          .filter((id): id is number => typeof id === 'number'),
      ),
    ];
    const geometry = await getRouteGeometries(client, member.workspaceId, ids);
    return Response.json({ day, geometry });
  });
}
