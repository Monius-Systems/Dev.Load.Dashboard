import {
  buildPlan,
  parseStopOrderBody,
  stopOrderBasis,
  truckIfta,
} from '@/lib/load-desk/mileage';
import { truckIdFor } from '@/lib/load-desk/profiles';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { recalculateDay } from '@/lib/server/mileage-calc';
import { ensureDay, listTrucks, recordsForDay, setStopOrder } from '@/lib/server/mileage-store';
import { routingProvider } from '@/lib/server/routing-provider';

/**
 * Confirms the order a truck hauled a day's loads in —
 * { truck_id, date, ticket_ids } — and works the day out again with it. The
 * stops must be the day's own tickets, each once; the order is tied to the
 * tickets and addresses it was confirmed for, and forgotten when they change.
 */
export function POST(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      let body: Record<string, unknown>;
      try {
        body = await boundedJson(request, 8_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const parsed = parseStopOrderBody(body);
      if ('error' in parsed) return badRequest(parsed.error);
      const provider = routingProvider();
      if (!provider) {
        return Response.json(
          { error: 'Mileage routing is not configured on this deployment.' },
          { status: 503 },
        );
      }
      const trucks = await listTrucks(client, member.workspaceId);
      const truck = trucks.find((row) => row.id === parsed.value.truck_id);
      if (!truck) return badRequest('Unknown truck.');
      const records = (await recordsForDay(client, member.workspaceId, parsed.value.date)).filter(
        (record) => truckIdFor(record, trucks) === truck.id,
      );
      if (!records.length) {
        return Response.json({ error: 'No tickets on that day.' }, { status: 404 });
      }
      // The stops the day actually has, duplicates already counted once.
      const planned = buildPlan(records, truckIfta(truck)).ticket_ids;
      const wanted = new Set(planned);
      const same =
        parsed.value.ticket_ids.length === wanted.size &&
        parsed.value.ticket_ids.every((id) => wanted.has(id));
      if (!same) return badRequest('The stops do not match this day’s tickets.');
      await ensureDay(client, member.workspaceId, truck, parsed.value.date);
      await setStopOrder(client, member.workspaceId, truck.id, parsed.value.date, {
        ticket_ids: parsed.value.ticket_ids,
        basis: stopOrderBasis(records),
        confirmed_at: new Date().toISOString(),
      });
      const day = await recalculateDay(
        client,
        member.workspaceId,
        provider,
        trucks,
        truck,
        parsed.value.date,
      );
      if (!day) return Response.json({ error: 'No tickets on that day.' }, { status: 404 });
      return Response.json({ day });
    },
    { write: true },
  );
}
