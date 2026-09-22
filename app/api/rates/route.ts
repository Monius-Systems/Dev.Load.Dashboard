import { parseDateRange } from '@/lib/load-desk/rates';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { openaiKey } from '@/lib/server/openai-key';
import { devTools, mailMode } from '@/lib/server/rate-mail';
import { defaultWindow } from '@/lib/server/rates-engine';
import {
  listEvents,
  listLocks,
  listPeriods,
  listRequests,
  listResponses,
} from '@/lib/server/rates-store';

/** The trail shown on the Rates page. Older lines are read per customer. */
const RECENT_EVENTS = 50;

/**
 * Everything the Rates page opens with: the rates on file, the requests and
 * replies of the window asked for, the finalized invoices, and the last fifty
 * things the agent did.
 *
 * Reading only. Nothing is asked of a model, nothing is priced and nothing is
 * written — a page that loads must cost a read, or the screen that shows what
 * the agent is doing becomes the reason the worker runs out of time.
 *
 * `from` and `to` are inclusive ISO days and default to the last eight weeks.
 * The rates and the finalized invoices ignore them: both are small, and a rate
 * agreed in March is exactly what a page looking at September needs to explain
 * what a ticket was priced at.
 */
export function GET(request: Request) {
  return memberRoute(request, async (client, member) => {
    const url = new URL(request.url);
    const fallback = defaultWindow(new Date());
    const range = parseDateRange(
      url.searchParams.get('from') ?? fallback.from,
      url.searchParams.get('to') ?? fallback.to,
      new Date(),
    );
    if ('error' in range) return badRequest(range.error);
    const { from, to } = range.value;
    const [periods, requests, everyResponse, locks, events] = await Promise.all([
      listPeriods(client, member.workspaceId),
      listRequests(client, member.workspaceId, { from, to }),
      listResponses(client, member.workspaceId),
      listLocks(client, member.workspaceId),
      listEvents(client, member.workspaceId, { limit: RECENT_EVENTS }),
    ]);
    // A reply belongs to the window if it arrived in it or answers a request
    // in it — a customer who answers late is answering this window's question.
    const asked = new Set(requests.map((entry) => entry.id));
    const responses = everyResponse.filter((response) => {
      const day = (response.created_at || response.message.received_at).slice(0, 10);
      return (day >= from && day <= to) || (response.request_id !== null && asked.has(response.request_id));
    });
    return Response.json({
      periods,
      requests,
      responses,
      locks,
      events,
      from,
      to,
      mail_mode: mailMode(),
      ai_configured: openaiKey() !== null,
      dev_tools: devTools(),
    });
  });
}
