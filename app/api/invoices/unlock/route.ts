import { parseFinalizeBody } from '@/lib/load-desk/rates';
import { invoiceKeyOf } from '@/lib/load-desk/record-input';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { appendEvent, unlockInvoice } from '@/lib/server/rates-store';

/**
 * Opens a finalized invoice again, with the reason on the row.
 *
 * The reason is required and the snapshot is kept: an invoice that is unlocked
 * and re-priced can still be compared, line by line, with what went out. That
 * is the whole difference between correcting an invoice and rewriting history.
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
      const reason = parsed.value.reason ?? '';
      if (reason.length < 3) {
        return badRequest('Say why this invoice is being opened again.');
      }
      const key = invoiceKeyOf(parsed.value.invoice_key);
      const lock = await unlockInvoice(client, member.workspaceId, key, reason);
      await appendEvent(client, member.workspaceId, {
        kind: 'INVOICE_UNLOCKED',
        customer_profile_id: null,
        request_id: null,
        response_id: null,
        period_id: null,
        invoice_key: key,
        detail: `Opened again: ${reason}`,
        actor: member.email ?? member.id,
      });
      return Response.json({ lock });
    },
    { write: true },
  );
}
