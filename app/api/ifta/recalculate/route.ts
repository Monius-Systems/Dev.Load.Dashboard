import { parseRecalculateBody, type MileageDay } from '@/lib/load-desk/mileage';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { recalculateDay } from '@/lib/server/mileage-calc';
import { listTrucks } from '@/lib/server/mileage-store';
import { routingProvider } from '@/lib/server/routing-provider';

/**
 * Works out the days asked for — { days: [{ truck_id, date }], force? }, up
 * to 25 — one after another, and answers with the stored rows. A day whose
 * truck has no tickets any more is removed and listed under `removed`. The
 * trucks are the workspace's own; a truck id from elsewhere is refused.
 */
export function POST(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      let body: Record<string, unknown>;
      try {
        body = await boundedJson(request, 16_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const parsed = parseRecalculateBody(body);
      if ('error' in parsed) return badRequest(parsed.error);
      const provider = routingProvider();
      if (!provider) {
        return Response.json(
          { days: [], removed: [], configured: false, error: 'Mileage routing is not configured on this deployment.' },
          { status: 503 },
        );
      }
      const trucks = await listTrucks(client, member.workspaceId);
      const byId = new Map(trucks.map((truck) => [truck.id, truck]));
      for (const day of parsed.value.days) {
        if (!byId.has(day.truck_id)) return badRequest('Unknown truck.');
      }
      const days: MileageDay[] = [];
      const removed: { truck_id: number; date: string }[] = [];
      for (const day of parsed.value.days) {
        const truck = byId.get(day.truck_id)!;
        const result = await recalculateDay(client, member.workspaceId, provider, trucks, truck, day.date, {
          force: parsed.value.force,
        });
        if (result) days.push(result);
        else removed.push(day);
      }
      return Response.json({ days, removed, configured: true });
    },
    { write: true },
  );
}
