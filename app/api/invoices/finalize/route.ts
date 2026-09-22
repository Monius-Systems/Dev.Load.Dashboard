import { lineTotal } from '@/lib/load-desk/format';
import { parseFinalizeBody } from '@/lib/load-desk/rates';
import { invoiceGroups } from '@/lib/load-desk/records';
import { invoiceKeyOf } from '@/lib/load-desk/record-input';
import { listRecords } from '@/lib/server/load-desk-store';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { appendEvent, lockInvoice } from '@/lib/server/rates-store';

/**
 * Finalizes an invoice: what it says today is what the customer was billed.
 *
 * The figures are kept with the lock — the total and every line — so a rate
 * agreed next week cannot quietly restate last week's invoice, and the claim
 * that it did not is provable rather than merely intended. After this the
 * agent will not touch these tickets: where an agreed rate disagrees with a
 * finalized line it says so as a conflict and leaves the line alone.
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
      const parsed = parseFinalizeBody(body);
      if ('error' in parsed) return badRequest(parsed.error);
      const key = invoiceKeyOf(parsed.value.invoice_key);
      const records = await listRecords(client, member.workspaceId);
      const group = invoiceGroups(records).find((invoice) => invoice.key === key);
      if (!group) {
        return Response.json({ error: 'That invoice no longer exists.' }, { status: 404 });
      }
      const lock = await lockInvoice(client, member.workspaceId, {
        invoice_key: key,
        finalized_at: new Date().toISOString(),
        finalized_by: member.email ?? member.id,
        snapshot: {
          total: group.total,
          lines: group.records.map((record) => ({
            record_id: record.id,
            total: lineTotal(record.ticket),
          })),
        },
      });
      await appendEvent(client, member.workspaceId, {
        kind: 'INVOICE_FINALIZED',
        customer_profile_id: null,
        request_id: null,
        response_id: null,
        period_id: null,
        invoice_key: key,
        detail: `Invoice ${group.invoice.invoice_number} finalized at ${group.total.toFixed(2)} over ${
          group.records.length
        } ticket${group.records.length === 1 ? '' : 's'}.${
          parsed.value.reason ? ` ${parsed.value.reason}` : ''
        }`,
        actor: member.email ?? member.id,
      });
      return Response.json({ lock });
    },
    { write: true },
  );
}
