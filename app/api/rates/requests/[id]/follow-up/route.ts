import type { CustomerProfile } from '@/lib/load-desk/profiles';
import { routeId } from '@/lib/load-desk/record-input';
import {
  periodLabel,
  remainingItems,
  requestWording,
  type RateContact,
} from '@/lib/load-desk/rates';
import { listProfiles } from '@/lib/server/load-desk-store';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { appendEvent, getRequest, updateRequest } from '@/lib/server/rates-store';

const contactFor = (customer: CustomerProfile | undefined): RateContact | null => {
  const contacts = customer?.rate_contacts ?? [];
  return contacts.find((contact) => contact.primary) ?? contacts[0] ?? null;
};

/**
 * Writes the chaser, and only about what is still outstanding.
 *
 * A customer who answered two of three jobs answered two of three jobs: the
 * follow-up asks about the third and never re-asks what was already given,
 * which is the difference between a reminder and an insult. It is a new draft
 * on the same request, with the same subject so it stays in the same thread,
 * and it goes out the same way the first one did — which on this deployment
 * means a person sends it.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  return memberRoute(
    request,
    async (client, member) => {
      if (id === null) return badRequest('Invalid request id.');
      const saved = await getRequest(client, member.workspaceId, id);
      if (!saved) {
        return Response.json({ error: 'That rate request no longer exists.' }, { status: 404 });
      }
      const remaining = remainingItems(saved);
      if (!remaining.length) {
        return Response.json(
          { error: 'This customer has answered everything that was asked.' },
          { status: 409 },
        );
      }
      const { customers } = await listProfiles(client, member.workspaceId);
      const customer = customers.find(({ id: key }) => key === saved.customer_profile_id);
      if (!customer) {
        return Response.json({ error: 'That customer no longer exists.' }, { status: 404 });
      }
      const label = periodLabel(saved.period_from, saved.period_to);
      const wording = requestWording(
        {
          customer_profile_id: saved.customer_profile_id,
          period_from: saved.period_from,
          period_to: saved.period_to,
          items: remaining,
        },
        customer,
        contactFor(customer),
        label,
      );
      // The same wording, opened as a person would open it. Deterministic: no
      // model is asked to chase a customer.
      const opener = `\n\nJust following up on my note about ${label} — could you please`;
      const body = wording.body.includes('\n\nCould you please')
        ? wording.body.replace('\n\nCould you please', opener)
        : `${wording.body}\n\nJust following up on my note about ${label}.`;
      const drafted = await updateRequest(client, member.workspaceId, id, {
        status: 'DRAFT',
        body,
        follow_up_count: saved.follow_up_count + 1,
        follow_up_due_at: null,
      });
      await appendEvent(client, member.workspaceId, {
        kind: 'RATE_FOLLOWUP_DUE',
        customer_profile_id: saved.customer_profile_id,
        request_id: saved.id,
        response_id: null,
        period_id: null,
        invoice_key: null,
        detail: `Follow-up ${drafted.follow_up_count} drafted for ${remaining.length} job${
          remaining.length === 1 ? '' : 's'
        } still outstanding.`,
        actor: member.email ?? member.id,
      });
      return Response.json({ request: drafted });
    },
    { write: true },
  );
}
