import { routeId } from '@/lib/load-desk/record-input';
import {
  aliasesToLearn,
  MAX_ALIASES,
  parseConfirmBody,
  periodsFromMatches,
  remainingItems,
  type ConfirmedMatch,
  type NewRatePeriod,
  type RateMatch,
  type RateSource,
} from '@/lib/load-desk/rates';
import { parseCustomer } from '@/lib/load-desk/record-input';
import { listProfiles, listRecords, updateProfile } from '@/lib/server/load-desk-store';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import {
  applyPeriodsToTickets,
  defaultWindow,
  jobsForCustomer,
  mergeAnswered,
  rateProfileOf,
  supersedeCovered,
} from '@/lib/server/rates-engine';
import {
  appendEvent,
  getRequest,
  getResponse,
  insertPeriods,
  listPeriods,
  updateRequest,
  updateResponse,
} from '@/lib/server/rates-store';

/**
 * What a person settled on the confirmation screen, written as rates.
 *
 * This is the other half of the bargain: the agent reads and proposes, and a
 * figure it was not certain of becomes money only when somebody says so. What
 * is written here is what they confirmed — their value, their unit, their
 * dates — not what the model suggested, and the periods carry their name.
 *
 * A confirmed match may also teach the customer's shorthand: "Markham" is
 * learned as a name for MARKHAM ROAD PROJECT only from a match a person
 * settled or the rules were certain of, so a guess can never make the same
 * guess look certain next time.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = routeId((await params).id);
  return memberRoute(
    request,
    async (client, member) => {
      if (id === null) return badRequest('Invalid reply id.');
      let body: Record<string, unknown>;
      try {
        body = await boundedJson(request, 32_000);
      } catch (error) {
        return badRequest(error instanceof Error ? error.message : 'Invalid request.');
      }
      const parsed = parseConfirmBody({ ...body, response_id: id });
      if ('error' in parsed) return badRequest(parsed.error);
      const { matches: confirmed, learn_aliases: learn } = parsed.value;

      const response = await getResponse(client, member.workspaceId, id);
      if (!response) {
        return Response.json({ error: 'That reply no longer exists.' }, { status: 404 });
      }
      const customerId = response.customer_profile_id;
      const asked = response.request_id
        ? await getRequest(client, member.workspaceId, response.request_id)
        : null;
      const [records, profiles, history] = await Promise.all([
        listRecords(client, member.workspaceId),
        listProfiles(client, member.workspaceId),
        listPeriods(client, member.workspaceId, { customerId }),
      ]);
      const customer = profiles.customers.find(({ id: key }) => key === customerId);
      if (!customer) {
        return Response.json({ error: 'That customer no longer exists.' }, { status: 404 });
      }
      const profile = rateProfileOf(customer);
      const span = asked
        ? { from: asked.period_from, to: asked.period_to }
        : defaultWindow(new Date());
      const jobs = jobsForCustomer(records, profiles.customers, customerId, span.from, span.to);
      const actor = member.email ?? member.id;
      const now = new Date().toISOString();
      const source: RateSource =
        response.source === 'email' ? 'customer_email' : 'simulated_response';

      // What the reader made of each line, as the person has left it. The
      // dates are theirs, so matches confirmed with different dates are
      // written as separate sets rather than flattened into one period.
      const asMatch = (settled: ConfirmedMatch): RateMatch => {
        const read = response.matches.find(
          (match) => match.line_index === settled.line_index && match.field === settled.field,
        );
        return {
          line_index: settled.line_index,
          job_key: settled.job_key,
          job_label:
            jobs.find((job) => job.job_key === settled.job_key)?.job_label ??
            read?.job_label ??
            null,
          field: settled.field,
          value: settled.value,
          unit: settled.unit,
          confidence: 1,
          evidence: [...(read?.evidence ?? []), `confirmed by ${actor}`],
          // The reading's own warning is kept when the figure is unchanged: a
          // person who applied it anyway is part of the record.
          anomaly: read && read.value === settled.value ? read.anomaly : null,
          status: 'auto',
          reason: null,
          validity_hint: settled.validity === 'PROJECT_DURATION' ? 'project_duration' : 'period',
        };
      };
      const settledMatches = confirmed.map(asMatch);
      const byRange = new Map<string, { from: string; to: string; matches: RateMatch[] }>();
      confirmed.forEach((settled, at) => {
        const key = `${settled.effective_from}|${settled.effective_to ?? ''}|${settled.validity}`;
        const group = byRange.get(key) ?? {
          from: settled.effective_from,
          to: settled.effective_to ?? settled.effective_from,
          matches: [],
        };
        group.matches.push(settledMatches[at]);
        byRange.set(key, group);
      });
      const fresh: NewRatePeriod[] = [];
      for (const group of byRange.values()) {
        fresh.push(
          ...periodsFromMatches(
            group.matches,
            customerId,
            { from: group.from, to: group.to },
            jobs,
            profile,
            source,
            { request_id: asked?.id ?? null, response_id: response.id },
            'human',
            actor,
            now,
          ),
        );
      }
      if (!fresh.length) {
        return badRequest('None of the confirmed figures can be saved as a rate.');
      }
      const applied = await insertPeriods(client, member.workspaceId, fresh);
      await supersedeCovered(client, member.workspaceId, history, applied);
      for (const period of applied) {
        await appendEvent(client, member.workspaceId, {
          kind: 'RATE_PERIOD_CONFIRMED',
          customer_profile_id: customerId,
          request_id: asked?.id ?? null,
          response_id: response.id,
          period_id: period.id,
          invoice_key: null,
          detail: `${period.job_label}: ${period.kind === 'base' ? 'hauling rate' : 'fuel surcharge'} ${
            period.value ?? ''
          } ${period.rate_type ?? period.fuel_type ?? ''} confirmed.`,
          actor,
        });
      }

      // The reading, with the settled lines marked as settled, and anything a
      // person added that the reader had missed.
      const merged = [...response.matches];
      for (const settled of settledMatches) {
        const at = merged.findIndex(
          (match) => match.line_index === settled.line_index && match.field === settled.field,
        );
        if (at === -1) merged.push(settled);
        else merged[at] = settled;
      }
      const stillPending = merged.some((match) => match.status === 'confirm');
      const saved = await updateResponse(client, member.workspaceId, response.id, {
        matches: merged,
        status: 'applied',
        processed_at: now,
      });

      if (learn) {
        const learned = aliasesToLearn(settledMatches, response.lines, profile.aliases, now);
        if (learned.length) {
          const { id: _profileId, ...rest } = customer;
          const updated = parseCustomer({
            ...rest,
            rate_profile: {
              ...profile,
              aliases: [...profile.aliases, ...learned].slice(-MAX_ALIASES),
            },
          });
          // A name that cannot be saved is not worth failing a confirmation
          // over: the rates are already written and the alias is a shortcut.
          if (!('error' in updated)) {
            await updateProfile(
              client,
              member.workspaceId,
              customer.id,
              'customer',
              updated.value,
            );
          }
        }
      }

      let updatedRequest = asked;
      if (asked) {
        const answered = mergeAnswered(asked, applied);
        const settled = remainingItems({ ...asked, answered }).length === 0;
        updatedRequest = await updateRequest(client, member.workspaceId, asked.id, {
          answered,
          follow_up_due_at: null,
          status: settled ? 'RESOLVED' : stillPending ? 'NEEDS_CONFIRMATION' : 'WAITING_FOR_REPLY',
        });
      }

      const priced = await applyPeriodsToTickets(client, member.workspaceId, member, {
        customerId,
      });
      if (priced.updated_tickets) {
        await appendEvent(client, member.workspaceId, {
          kind: 'RATE_PERIOD_APPLIED',
          customer_profile_id: customerId,
          request_id: asked?.id ?? null,
          response_id: response.id,
          period_id: applied[0].id,
          invoice_key: null,
          detail: `${priced.updated_tickets} ticket${
            priced.updated_tickets === 1 ? '' : 's'
          } priced from the confirmed rates.`,
          actor,
        });
      }
      return Response.json({
        response: saved,
        request: updatedRequest,
        applied,
        updated_tickets: priced.updated_tickets,
        conflicts: priced.conflicts,
        kept_manual: priced.kept_manual,
      });
    },
    { write: true },
  );
}
