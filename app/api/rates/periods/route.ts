import { money } from '@/lib/load-desk/format';
import {
  parseManualPeriodBody,
  resolveRate,
  type NewRatePeriod,
} from '@/lib/load-desk/rates';
import { listProfiles } from '@/lib/server/load-desk-store';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { applyPeriodsToTickets, supersedeCovered } from '@/lib/server/rates-engine';
import { appendEvent, insertPeriods, listPeriods } from '@/lib/server/rates-store';

/**
 * A rate entered or corrected by hand — the override, and the last word.
 *
 * The reason is required, because this is the one place a figure can be put on
 * file that no customer wrote: an override with no reason turns the history
 * from an account of what happened into a list of numbers. What it replaces is
 * superseded, never deleted, and the old figure is quoted in the trail, so
 * "why did this invoice change" always has an answer.
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
      const parsed = parseManualPeriodBody(body);
      if ('error' in parsed) return badRequest(parsed.error);
      const entry = parsed.value;
      const { customers } = await listProfiles(client, member.workspaceId);
      if (!customers.some(({ id }) => id === entry.customer_profile_id)) {
        return Response.json({ error: 'That customer no longer exists.' }, { status: 404 });
      }
      const history = await listPeriods(client, member.workspaceId, {
        customerId: entry.customer_profile_id,
      });
      const previous = resolveRate(
        history,
        entry.customer_profile_id,
        entry.job_key,
        entry.kind,
        entry.effective_from,
      );
      const now = new Date().toISOString();
      const actor = member.email ?? member.id;
      const fresh: NewRatePeriod = {
        customer_profile_id: entry.customer_profile_id,
        job_key: entry.job_key,
        job_label: entry.job_label || entry.job_key,
        kind: entry.kind,
        effective_from: entry.effective_from,
        effective_to: entry.validity === 'PROJECT_DURATION' ? null : entry.effective_to,
        validity: entry.validity,
        rate_type: entry.rate_type,
        fuel_type: entry.fuel_type,
        value: entry.value,
        source: 'manual',
        source_request_id: null,
        source_response_id: null,
        confidence: null,
        applied_by: 'human',
        confirmed_by: actor,
        confirmed_at: now,
        note: entry.reason,
      };
      const [period] = await insertPeriods(client, member.workspaceId, [fresh]);
      await supersedeCovered(client, member.workspaceId, history, [period]);
      await appendEvent(client, member.workspaceId, {
        kind: 'RATE_OVERRIDDEN',
        customer_profile_id: entry.customer_profile_id,
        request_id: null,
        response_id: null,
        period_id: period.id,
        invoice_key: null,
        detail: previous
          ? `${period.job_label}: ${money(entry.value)} replaces ${money(previous.value)} from ${
              entry.effective_from
            }. ${entry.reason}`
          : `${period.job_label}: ${money(entry.value)} entered by hand from ${
              entry.effective_from
            }. ${entry.reason}`,
        actor,
      });
      const priced = await applyPeriodsToTickets(client, member.workspaceId, member, {
        customerId: entry.customer_profile_id,
        jobKey: entry.job_key,
      });
      return Response.json({
        period,
        updated_tickets: priced.updated_tickets,
        conflicts: priced.conflicts,
        kept_manual: priced.kept_manual,
      });
    },
    { write: true },
  );
}
