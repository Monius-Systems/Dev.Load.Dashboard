import {
  parseSimulateBody,
  type NormalizedMessage,
  type RateRequest,
} from '@/lib/load-desk/rates';
import { listProfiles } from '@/lib/server/load-desk-store';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { devTools } from '@/lib/server/rate-mail';
import { processReply } from '@/lib/server/rates-engine';
import { getRequest } from '@/lib/server/rates-store';

/** A typed reply is a long one; a real email body is capped well below this. */
const MAX_BODY_BYTES = 40_000;

/**
 * A reply typed as if the customer had sent it, put through exactly the path a
 * real one would take: stored as it arrived, read, matched against the jobs
 * actually worked, and applied only where the rules are certain.
 *
 * This is how the agent is demonstrated and tested before a mailbox exists,
 * and it earns its keep by being the same code — a simulation that took a
 * shortcut would prove nothing about the thing it stands in for. The only
 * differences are on the record itself: the reply is marked `simulated`, and
 * the periods it writes are sourced `simulated_response`, so nothing that came
 * from a person pretending is ever mistaken for the customer's own words.
 *
 * Available only where the development tools are turned on.
 */
export function POST(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      if (!devTools()) {
        return Response.json(
          { error: 'The development tools are not available on this deployment.' },
          { status: 403 },
        );
      }
      let body: Record<string, unknown>;
      try {
        body = await boundedJson(request, MAX_BODY_BYTES);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const parsed = parseSimulateBody(body);
      if ('error' in parsed) return badRequest(parsed.error);
      const { customer_profile_id: customerId, request_id: requestId, subject, body_text: text } =
        parsed.value;
      const { customers } = await listProfiles(client, member.workspaceId);
      const customer = customers.find(({ id }) => id === customerId);
      if (!customer) {
        return Response.json({ error: 'That customer no longer exists.' }, { status: 404 });
      }
      let asked: RateRequest | null = null;
      if (requestId !== null) {
        asked = await getRequest(client, member.workspaceId, requestId);
        if (!asked) {
          return Response.json({ error: 'That rate request no longer exists.' }, { status: 404 });
        }
        if (asked.customer_profile_id !== customerId) {
          return badRequest('That request belongs to another customer.');
        }
      }
      const contacts = customer.rate_contacts ?? [];
      const contact = contacts.find((entry) => entry.primary) ?? contacts[0] ?? null;
      const message: NormalizedMessage = {
        sender: contact?.email ?? 'simulated@dev.local',
        recipients: [],
        subject: subject ?? asked?.subject ?? null,
        body_text: text,
        body_html: null,
        attachments: [],
        received_at: new Date().toISOString(),
        external_thread_id: asked ? `simulated:${asked.id}` : null,
      };
      const outcome = await processReply(client, member.workspaceId, member, {
        customerId,
        request: asked,
        message,
        source: 'simulated',
      });
      return Response.json(outcome);
    },
    { write: true },
  );
}
