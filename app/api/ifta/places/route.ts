import { parsePlaceFixBody, placeKey } from '@/lib/load-desk/mileage';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { getPlaces, listTrucks, upsertPlace } from '@/lib/server/mileage-store';
import { routingProvider } from '@/lib/server/routing-provider';

/**
 * Sets where an address on tickets is: { place_key, address }. The address a
 * person typed is looked up by the provider — coordinates are never taken
 * from the browser — and, when it places precisely, stored under the
 * original key, so every ticket with that text resolves from then on.
 */
export function POST(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      let body: Record<string, unknown>;
      try {
        body = await boundedJson(request, 4_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const parsed = parsePlaceFixBody(body);
      if ('error' in parsed) return badRequest(parsed.error);
      const provider = routingProvider();
      if (!provider) {
        return Response.json({ error: 'Mileage routing is not configured on this deployment.' }, { status: 503 });
      }
      const existing = (await getPlaces(client, member.workspaceId, [parsed.value.place_key])).get(
        parsed.value.place_key,
      );
      if (!existing) return Response.json({ error: 'That place is not on any ticket.' }, { status: 404 });
      // Looked up near a truck's yard, as the calculation does: the provider
      // ranks by distance, and the same street number exists in many towns.
      const yards = (await listTrucks(client, member.workspaceId))
        .map((truck) => truck.ifta?.yard_address ?? '')
        .filter(Boolean)
        .map(placeKey);
      const yard = [...(await getPlaces(client, member.workspaceId, [...new Set(yards)])).values()].find(
        (place) => place.status === 'resolved' && place.lat !== null && place.lon !== null,
      );
      const bias = yard ? { lat: yard.lat as number, lon: yard.lon as number } : undefined;
      // A person typed this, so a match on the street alone is accepted when
      // the provider has no house number there (see GeocodeOptions).
      const answer = await provider.geocode(parsed.value.address, bias, { acceptStreet: true });
      if (!answer.ok) {
        return Response.json(
          {
            error:
              answer.reason === 'no_match'
                ? 'That address was not found. Check the street, city and state.'
                : 'That address is not precise enough. Add the street, city and state, or use a nearby address or business name.',
            suggestion: answer.suggestion,
          },
          { status: 422 },
        );
      }
      const place = await upsertPlace(client, member.workspaceId, {
        place_key: parsed.value.place_key,
        query_text: existing.query_text,
        provider: `${provider.name}@${provider.version}`,
        status: 'resolved',
        position: answer.position,
        label: answer.label,
        formatted: answer.formatted,
        resolved_by: 'user',
        resolved_query: parsed.value.address,
        provider_type: answer.type,
        confidence: answer.confidence,
      });
      return Response.json({ place });
    },
    { write: true },
  );
}
