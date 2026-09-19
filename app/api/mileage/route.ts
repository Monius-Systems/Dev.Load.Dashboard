import { parseDateRange } from '@/lib/load-desk/mileage';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { listDays } from '@/lib/server/mileage-store';
import { tomtomKey } from '@/lib/server/tomtom-key';

/**
 * Stored truck-days in a date range (?from&to, inclusive ISO dates, at most
 * 400 days; last quarter through today when omitted), and whether routing
 * is configured on this deployment. Never the key itself.
 */
export function GET(request: Request) {
  return memberRoute(request, async (client, member) => {
    const url = new URL(request.url);
    const range = parseDateRange(url.searchParams.get('from'), url.searchParams.get('to'), new Date());
    if ('error' in range) return badRequest(range.error);
    const days = await listDays(client, member.workspaceId, range.value.from, range.value.to);
    return Response.json({ days, configured: tomtomKey() !== null });
  });
}
