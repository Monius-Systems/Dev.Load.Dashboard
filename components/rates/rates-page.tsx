'use client';

import {
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
  type SyntheticEvent,
} from 'react';
import Link from 'next/link';
import { Mail, Plus, RefreshCw, Send } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select-field';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { useProfiles, useRecords } from '@/components/profiles/profile-ui';
import { useT } from '@/lib/i18n/use-t';
import { money } from '@/lib/load-desk/format';
import {
  invoiceGroups,
  shownInvoiceNumber,
  type InvoiceGroup,
} from '@/lib/load-desk/records';
import {
  BASE_RATE_TYPES,
  billingPeriodFor,
  CONFIDENCE,
  FUEL_RATE_TYPES,
  invoiceReadiness,
  isBaseRateType,
  isFuelRateType,
  missingRates,
  periodLabel,
  remainingItems,
  type BaseRateType,
  type FuelRateType,
  type InvoiceReadiness,
  type JobRef,
  type MissingField,
  type RateKind,
  type RateMatch,
  type RatePeriod,
  type RateRequest,
  type RateResponse,
  type RateResponseStatus,
  type RateUnit,
  type ReadinessStep,
} from '@/lib/load-desk/rates';
import {
  addPeriod,
  applyRates,
  busyKey,
  closeRequest,
  confirmResponse,
  followUp,
  generateRequests,
  getRatesSnapshot,
  getServerRatesSnapshot,
  loadRates,
  markSent,
  rejectResponse,
  sendRequest,
  simulateResponse,
  subscribeRates,
  type ConfirmedMatch,
} from '@/lib/load-desk/rates-store';

// Rates: the desk the rate and fuel agent works from. One week at a time —
// what has to be asked of each customer, what they wrote back, what is still
// waiting on a person, and what every invoice is priced on.
//
// Nothing here happens on its own. The page reads one range when it opens and
// when the week is changed; every request written, sent, confirmed or entered
// by hand is a button somebody pressed, and the answer is merged into the
// store rather than fetched again (lib/load-desk/rates-store.ts).

const useRates = () =>
  useSyncExternalStore(subscribeRates, getRatesSnapshot, getServerRatesSnapshot);

/** How many weeks back the period picker offers. */
const PERIODS_OFFERED = 8;
/** How many rows a long list shows before the count takes over. */
const MAX_LISTED = 25;
const DAY_MS = 86_400_000;

/** How a hauling rate is charged, as it is written on the screen. */
const BASE_UNIT_LABELS: Record<BaseRateType, string> = {
  PER_TON: 'Per ton',
  PER_LOAD: 'Per load',
  PER_HOUR: 'Per hour',
  PER_MILE: 'Per mile',
  PER_DAY: 'Per day',
  FLAT_RATE: 'Flat rate',
  CUSTOM: 'Other',
};

/** How a fuel surcharge is charged. INCLUDED and NONE are answers, not gaps. */
const FUEL_UNIT_LABELS: Record<FuelRateType, string> = {
  PERCENTAGE: 'Percent of the rate',
  PER_TON: 'Per ton',
  PER_LOAD: 'Per load',
  PER_MILE: 'Per mile',
  FIXED_AMOUNT: 'Fixed amount',
  INCLUDED: 'Included in the rate',
  NONE: 'No fuel surcharge',
  CUSTOM: 'Other',
};

/** Where a figure came from, for the source chip in the history. */
const SOURCE_LABELS: Record<RatePeriod['source'], string> = {
  customer_email: 'Customer email',
  simulated_response: 'Simulated reply',
  manual: 'Entered by hand',
  site_rate: 'Site rate',
};

/** Where a reply has got to, for the list under the open request. */
const RESPONSE_LABELS: Record<RateResponseStatus, string> = {
  received: 'Received',
  processing: 'Being read',
  needs_confirmation: 'Needs confirmation',
  applied: 'Applied',
  rejected: 'Rejected',
  duplicate: 'Already on file',
};

/** A request nobody has finished with yet: it still counts as waiting. */
const OPEN_STATUSES = new Set<RateRequest['status']>([
  'DRAFT',
  'READY_TO_SEND',
  'SENT',
  'WAITING_FOR_REPLY',
  'RESPONSE_RECEIVED',
  'AI_PROCESSING',
  'NEEDS_CONFIRMATION',
  'FOLLOW_UP_DUE',
]);

type Filter = 'all' | 'waiting' | 'received' | 'input' | 'resolved';

/** Which of the filters above a request answers to. */
function filterOf(status: RateRequest['status']): Exclude<Filter, 'all'> {
  switch (status) {
    case 'DRAFT':
    case 'READY_TO_SEND':
    case 'SENT':
    case 'WAITING_FOR_REPLY':
    case 'FOLLOW_UP_DUE':
      return 'waiting';
    case 'RESPONSE_RECEIVED':
    case 'AI_PROCESSING':
      return 'received';
    case 'NEEDS_CONFIRMATION':
    case 'FAILED':
      return 'input';
    case 'RESOLVED':
    case 'CLOSED':
      return 'resolved';
  }
}

/** The figures a person still has to look at, of everything read out of a reply. */
const openMatches = (response: RateResponse) =>
  response.matches.filter((match) => match.status !== 'auto');

/** What a person edits on one line of a reply before confirming it. */
type MatchDraft = {
  job_key: string;
  value: string;
  unit: RateUnit;
  effective_from: string;
  effective_to: string;
  project: boolean;
};

/** A rate typed in by hand, or one corrected. */
type PeriodForm = {
  customer: string;
  job: string;
  jobLabel: string;
  kind: RateKind;
  unit: RateUnit;
  value: string;
  from: string;
  to: string;
  project: boolean;
  reason: string;
};

/** The one option that turns the job picker into a box to type a new job into. */
const OTHER_JOB = '__other';

export default function RatesPage() {
  const { records, ready: recordsReady } = useRecords();
  const profiles = useProfiles();
  const rates = useRates();
  const tr = useT();
  const { t, date } = tr;
  const [now] = useState(() => new Date());
  const fieldId = useId();

  /** The week being worked on, as `from|to`; null is the latest complete one. */
  const [periodKey, setPeriodKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<number | null>(null);
  /** What the server said about the last action on the open request. */
  const [notice, setNotice] = useState<string | null>(null);
  /** Edits to the figures read out of a reply, by `${response}:${line}`. */
  const [edits, setEdits] = useState<Record<string, Partial<MatchDraft>>>({});
  /** Whether the names in a reply are remembered, by response; on by default. */
  const [learn, setLearn] = useState<Record<number, boolean>>({});
  const [reject, setReject] = useState<{ id: number; reason: string } | null>(null);
  const [form, setForm] = useState<PeriodForm | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sim, setSim] = useState({ customer: '', request: '', subject: '', body: '' });

  // The last eight complete billing periods, newest first. A week is asked
  // about once it is over, so the first of these is the one to work on.
  const periods = useMemo(() => {
    const list: { from: string; to: string }[] = [];
    for (let back = 0; back < PERIODS_OFFERED; back += 1) {
      list.push(billingPeriodFor(undefined, new Date(now.getTime() - back * 7 * DAY_MS)));
    }
    return list;
  }, [now]);
  const range = useMemo(
    () => periods.find((period) => `${period.from}|${period.to}` === periodKey) ?? periods[0],
    [periods, periodKey],
  );

  // One request for the week on screen, and none after it. Everything else on
  // this page is worked out here in the browser from what came back.
  useEffect(() => {
    void loadRates(range);
  }, [range]);

  // On a phone the open request is below the fold, so a tap goes to it.
  useEffect(() => {
    if (selected === null || !window.matchMedia('(max-width: 720px)').matches) return;
    document.getElementById('rates-request')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selected]);

  const customers = profiles.customers;
  const customerById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers],
  );
  const nameOf = (id: number) => customerById.get(id)?.name ?? t('Unknown customer');

  const needs = useMemo(
    () => missingRates(records, customers, rates.periods, range.from, range.to),
    [records, customers, rates.periods, range],
  );

  /** Every job this page knows a customer by: worked this week, or rated before. */
  const jobsByCustomer = useMemo(() => {
    const byCustomer = new Map<number, JobRef[]>();
    const add = (id: number, job: JobRef) => {
      const jobs = byCustomer.get(id) ?? [];
      if (!jobs.some((known) => known.job_key === job.job_key)) {
        byCustomer.set(id, [...jobs, job]);
      }
    };
    for (const need of needs) {
      add(need.customer_profile_id, { job_key: need.job_key, job_label: need.job_label });
    }
    for (const period of rates.periods) {
      add(period.customer_profile_id, { job_key: period.job_key, job_label: period.job_label });
    }
    return byCustomer;
  }, [needs, rates.periods]);
  const jobsOf = (id: number) => jobsByCustomer.get(id) ?? [];

  /** How many tickets a job has this week, for "confirm for all of them". */
  const ticketsByJob = useMemo(
    () => new Map(needs.map((need) => [`${need.customer_profile_id}|${need.job_key}`, need.ticket_count])),
    [needs],
  );

  const requests = useMemo(() => {
    const name = (id: number) => customerById.get(id)?.name ?? '';
    return [...rates.requests].sort((a, b) =>
      name(a.customer_profile_id).localeCompare(name(b.customer_profile_id)),
    );
  }, [rates.requests, customerById]);
  const shown = requests.filter(
    (request) => filter === 'all' || filterOf(request.status) === filter,
  );
  const open = requests.find((request) => request.id === selected) ?? null;

  const toConfirm = rates.responses.filter((response) => response.status === 'needs_confirmation');
  const responsesFor = (id: number) =>
    rates.responses.filter((response) => response.request_id === id);

  const waitingCustomers = new Set(
    rates.requests.filter((request) => OPEN_STATUSES.has(request.status)).map((r) => r.customer_profile_id),
  ).size;

  // Every invoice the tickets make, against the rates on file and the locks.
  const locksByKey = useMemo(
    () => new Map(rates.locks.map((lock) => [lock.invoice_key, lock])),
    [rates.locks],
  );
  const invoices = useMemo(
    () =>
      invoiceGroups(records).map((group) => {
        const lock = locksByKey.get(group.key) ?? null;
        const locked = Boolean(lock && !lock.unlocked_at);
        return {
          group,
          lock,
          readiness: invoiceReadiness(group, customers, rates.periods, locked),
        };
      }),
    [records, locksByKey, customers, rates.periods],
  );
  const waitingInvoices = invoices.filter(
    ({ readiness }) =>
      readiness.status === 'WAITING_FOR_RATE' || readiness.status === 'WAITING_FOR_FUEL',
  );
  const finalized = invoices.filter(({ readiness }) => readiness.status === 'FINALIZED');
  const readyInvoices = invoices.filter(({ readiness }) => readiness.status === 'READY').length;

  const busy = (key: string) => rates.busy.has(key);
  const working = rates.busy.size > 0;
  const loading = !recordsReady || !profiles.ready || !rates.ready;

  // ------------------------------------------------------------------ wording

  const unitLabel = (unit: RateUnit): string => {
    if (unit === 'UNKNOWN') return t('Not clear from the reply');
    if (isBaseRateType(unit)) return t(BASE_UNIT_LABELS[unit]);
    return isFuelRateType(unit) ? t(FUEL_UNIT_LABELS[unit]) : unit;
  };

  /** A figure as it reads: a percentage, an answer of "none", or money and its unit. */
  const rateText = (period: RatePeriod) => {
    const unit: RateUnit = period.kind === 'base' ? (period.rate_type ?? 'CUSTOM') : (period.fuel_type ?? 'CUSTOM');
    if (unit === 'INCLUDED' || unit === 'NONE') return unitLabel(unit);
    if (period.value === null) return t('Not given');
    if (unit === 'PERCENTAGE') return `${period.value}%`;
    return `${money(period.value)} · ${unitLabel(unit)}`;
  };

  const fieldLabel = (field: MissingField) => (field === 'base' ? t('Rate') : t('Fuel'));

  /** What one job is being asked for: the rate, the fuel surcharge, or both. */
  const askText = (fields: MissingField[]) => {
    if (fields.length > 1) return t('rate + fuel');
    return fields[0] === 'base' ? t('rate only') : t('fuel surcharge only');
  };
  const asksOf = (request: RateRequest) =>
    remainingItems(request)
      .map((item) => `${item.job_label} — ${askText(item.fields)}`)
      .join(' · ');

  const periodFor = (request: RateRequest) =>
    periodLabel(request.period_from, request.period_to);

  /** The chip a request wears in the list, and what it is waiting on. */
  const statusChip = (request: RateRequest) => {
    const pending = responsesFor(request.id)
      .filter((response) => response.status === 'needs_confirmation')
      .reduce((sum, response) => sum + openMatches(response).length, 0);
    switch (request.status) {
      case 'DRAFT':
      case 'READY_TO_SEND':
        return <span className="ld-chip" data-tone="neutral">{t('Draft')}</span>;
      case 'SENT':
      case 'WAITING_FOR_REPLY':
        return (
          <span className="ld-chip" data-tone="neutral">
            {request.sent_at
              ? t('Waiting for reply · sent {date}', { date: date(request.sent_at.slice(0, 10)) })
              : t('Waiting for reply')}
          </span>
        );
      case 'RESPONSE_RECEIVED':
        return <span className="ld-chip" data-tone="good">{t('Reply received')}</span>;
      case 'AI_PROCESSING':
        return <span className="ld-chip" data-tone="neutral">{t('Reading the reply…')}</span>;
      case 'NEEDS_CONFIRMATION':
        return (
          <span className="ld-chip">
            {t('{values} to confirm', { values: tr.plural(pending || 1, 'value') })}
          </span>
        );
      case 'FOLLOW_UP_DUE':
        return <span className="ld-chip">{t('Follow-up due')}</span>;
      case 'RESOLVED':
        return <span className="ld-chip" data-tone="good">{t('Resolved')}</span>;
      case 'FAILED':
        return <span className="ld-chip" data-tone="error">{t('Could not be sent')}</span>;
      case 'CLOSED':
        return <span className="ld-chip" data-tone="neutral">{t('Closed')}</span>;
    }
  };

  /** How sure the reader was, as a chip a person can read at a glance. */
  const confidenceChip = (value: number) => (
    <span
      className="ld-chip"
      data-tone={value >= CONFIDENCE.auto ? 'good' : value >= CONFIDENCE.confirm ? undefined : 'error'}
    >
      {t('{percent}% sure', { percent: Math.round(value * 100) })}
    </span>
  );

  const recipientOf = (request: RateRequest) => {
    if (request.recipient) return request.recipient;
    const contacts = customerById.get(request.customer_profile_id)?.rate_contacts ?? [];
    const primary = contacts.find((contact) => contact.primary) ?? contacts[0];
    return primary?.email ?? null;
  };

  // ------------------------------------------------------------------ actions

  const report = (error: string | null, done: string) => {
    if (error) {
      setNotice(error);
      toast.add({ title: t('Nothing was changed'), description: t(error), type: 'error' });
      return false;
    }
    setNotice(null);
    toast.add({ title: t(done), type: 'success' });
    return true;
  };

  async function generate() {
    const { error, data } = await generateRequests(range);
    if (error) {
      toast.add({ title: t('Could not write the requests'), description: t(error), type: 'error' });
      return;
    }
    if (!data) return;
    toast.add({
      title: t('{requests} written', { requests: tr.plural(data.created, 'request') }),
      description: data.skipped.length
        ? t('{n} customers skipped: nothing is missing, or there is already a request open.', {
            n: data.skipped.length,
          })
        : t('Every customer short a rate this period has a draft.'),
      type: 'success',
    });
  }

  async function act(action: () => Promise<string | null>, done: string) {
    report(await action(), done);
  }

  /** What one line of a reply says now: what was read, with anything typed over it. */
  const draftOf = (response: RateResponse, match: RateMatch): MatchDraft => {
    const request = rates.requests.find((item) => item.id === response.request_id) ?? null;
    const project = match.validity_hint === 'project_duration';
    const base: MatchDraft = {
      job_key: match.job_key ?? '',
      value: match.value === null ? '' : String(match.value),
      unit: match.unit,
      effective_from: request?.period_from ?? range.from,
      effective_to: project ? '' : (request?.period_to ?? range.to),
      project,
    };
    return { ...base, ...edits[`${response.id}:${match.line_index}`] };
  };
  const editMatch = (response: RateResponse, match: RateMatch, patch: Partial<MatchDraft>) => {
    const key = `${response.id}:${match.line_index}`;
    setEdits({ ...edits, [key]: { ...draftOf(response, match), ...patch } });
  };

  /** How many tickets a reply settles, over every job it names. */
  const ticketsFor = (response: RateResponse) => {
    const jobs = new Set(
      response.matches.map((match) => draftOf(response, match).job_key).filter(Boolean),
    );
    let total = 0;
    for (const job of jobs) {
      total += ticketsByJob.get(`${response.customer_profile_id}|${job}`) ?? 0;
    }
    return total;
  };

  async function confirm(response: RateResponse) {
    const matches: ConfirmedMatch[] = [];
    for (const match of response.matches) {
      const draft = draftOf(response, match);
      if (!draft.job_key) continue;
      const value = draft.value.trim() === '' ? null : Number(draft.value);
      if (value !== null && !Number.isFinite(value)) {
        setNotice(null);
        toast.add({
          title: t('Check the figures'),
          description: t('“{value}” is not a number.', { value: draft.value }),
          type: 'error',
        });
        return;
      }
      matches.push({
        line_index: match.line_index,
        job_key: draft.job_key,
        field: match.field,
        value,
        unit: draft.unit,
        effective_from: draft.effective_from,
        effective_to: draft.project ? null : draft.effective_to || null,
        validity: draft.project ? 'PROJECT_DURATION' : 'PERIOD',
      });
    }
    const { error, data } = await confirmResponse(
      response.id,
      matches,
      learn[response.id] ?? true,
    );
    if (error) {
      toast.add({ title: t('Nothing was changed'), description: t(error), type: 'error' });
      return;
    }
    toast.add({
      title: t('Rates confirmed'),
      description: t('{tickets} repriced.', { tickets: tr.plural(data?.updated_tickets ?? 0, 'ticket') }),
      type: 'success',
    });
  }

  async function simulate(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const customer = Number(sim.customer);
    if (!customer || !sim.body.trim()) return;
    const { error, data } = await simulateResponse({
      customer_profile_id: customer,
      ...(sim.request ? { request_id: Number(sim.request) } : {}),
      ...(sim.subject.trim() ? { subject: sim.subject.trim() } : {}),
      body_text: sim.body,
    });
    if (error) {
      toast.add({ title: t('The reply was not read'), description: t(error), type: 'error' });
      return;
    }
    setSim({ ...sim, body: '' });
    toast.add({
      title: t('Reply processed'),
      description: t('{applied} applied, {pending} waiting to be confirmed.', {
        applied: data?.applied.length ?? 0,
        pending: data?.pending.length ?? 0,
      }),
      type: 'success',
    });
  }

  async function saveRate(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setFormError(null);
    const customer = Number(form.customer);
    const job = form.job === OTHER_JOB ? form.jobLabel.trim() : form.job;
    if (!customer || !job || !form.reason.trim()) {
      setFormError('Pick a customer and a job, and say why this rate is being entered.');
      return;
    }
    const value = form.value.trim() === '' ? null : Number(form.value);
    if (value !== null && !Number.isFinite(value)) {
      setFormError('The rate has to be a number.');
      return;
    }
    const label = form.job === OTHER_JOB
      ? form.jobLabel.trim()
      : (jobsOf(customer).find((known) => known.job_key === form.job)?.job_label ?? job);
    const { error, data } = await addPeriod({
      customer_profile_id: customer,
      job_key: job,
      job_label: label,
      kind: form.kind,
      value,
      ...(form.kind === 'base' && isBaseRateType(form.unit) ? { rate_type: form.unit } : {}),
      ...(form.kind === 'fuel' && isFuelRateType(form.unit) ? { fuel_type: form.unit } : {}),
      effective_from: form.from,
      effective_to: form.project ? null : form.to || null,
      validity: form.project ? 'PROJECT_DURATION' : 'PERIOD',
      reason: form.reason.trim(),
    });
    if (error) {
      setFormError(error);
      return;
    }
    setForm(null);
    toast.add({
      title: t('Rate saved'),
      description: t('{tickets} repriced.', { tickets: tr.plural(data?.updated_tickets ?? 0, 'ticket') }),
      type: 'success',
    });
  }

  async function reprice() {
    const { error, data } = await applyRates();
    if (error) {
      toast.add({ title: t('Nothing was repriced'), description: t(error), type: 'error' });
      return;
    }
    toast.add({
      title: t('Tickets repriced'),
      description: t('{tickets} changed, {conflicts} could not be.', {
        tickets: tr.plural(data?.updated_tickets ?? 0, 'ticket'),
        conflicts: data?.conflicts.length ?? 0,
      }),
      type: 'success',
    });
  }

  // -------------------------------------------------------------------- parts

  const periodOptions = periods.map((period) => ({
    value: `${period.from}|${period.to}`,
    label: periodLabel(period.from, period.to),
  }));
  const customerOptions = customers.map((customer) => ({
    value: String(customer.id),
    label: customer.name,
  }));
  const unitOptions = (kind: RateKind) =>
    kind === 'base'
      ? BASE_RATE_TYPES.map((unit) => ({ value: unit, label: t(BASE_UNIT_LABELS[unit]) }))
      : FUEL_RATE_TYPES.map((unit) => ({ value: unit, label: t(FUEL_UNIT_LABELS[unit]) }));
  const jobOptions = (id: number) => [
    ...jobsOf(id).map((job) => ({ value: job.job_key, label: job.job_label })),
    { value: OTHER_JOB, label: t('Another job…') },
  ];

  /** The four steps an invoice goes through before it can be finalized. */
  const step = (label: string, state: ReadinessStep) => (
    <span
      className="rates-step"
      data-state={state === 'ok' ? 'ready' : state === 'waiting' ? 'waiting' : undefined}
    >
      {label} {state === 'ok' ? '✓' : state === 'waiting' ? '…' : '—'}
    </span>
  );
  const steps = (readiness: InvoiceReadiness) => (
    <span className="rates-steps">
      {step(t('Tickets'), readiness.tickets)}
      {step(t('Mileage'), 'n/a')}
      {step(t('Base rate'), readiness.base)}
      {step(t('Fuel'), readiness.fuel)}
    </span>
  );
  const invoiceNumber = (group: InvoiceGroup) =>
    shownInvoiceNumber(group.invoice.invoice_number) || t('Draft invoice');

  /** What a reply was read to say, in a line, for the list under a request. */
  const matchSummary = (response: RateResponse) =>
    response.matches.length
      ? response.matches
          .map((match) => {
            const job = match.job_label ?? t('Job not named');
            const value =
              match.value === null
                ? t('no figure')
                : match.unit === 'PERCENTAGE'
                  ? `${match.value}%`
                  : money(match.value);
            return `${job} — ${fieldLabel(match.field)} ${value}`;
          })
          .join(' · ')
      : t('Nothing could be read out of it.');

  /** One reply, with every figure read out of it and everywhere to correct it. */
  const replyCard = (response: RateResponse) => {
    const request = rates.requests.find((item) => item.id === response.request_id) ?? null;
    const tickets = ticketsFor(response);
    const settling = response.matches.filter(
      (match) => draftOf(response, match).job_key !== '',
    ).length;
    return (
      <article className="rates-reply" key={response.id}>
        <div className="rates-reply-head">
          <div>
            <strong>{nameOf(response.customer_profile_id)}</strong>{' '}
            <small>
              {request ? periodFor(request) : periodLabel(range.from, range.to)} ·{' '}
              {date(response.created_at.slice(0, 10))}
            </small>
          </div>
          <span className="rates-chips">
            {response.source === 'simulated' ? (
              <span className="ld-chip" data-tone="neutral">{t('Simulated')}</span>
            ) : (
              <span className="ld-chip" data-tone="neutral">{t('Customer email')}</span>
            )}
            {response.ai_model ? null : (
              <span className="ld-chip">{t('Read by rules')}</span>
            )}
          </span>
        </div>

        <div className="rates-mail">
          <dl>
            <dt>{t('From')}</dt>
            <dd>{response.message.sender ?? t('Not given')}</dd>
            <dt>{t('Subject')}</dt>
            <dd>{response.message.subject ?? t('No subject')}</dd>
          </dl>
          <pre className="rates-body">{response.message.body_text}</pre>
        </div>

        {response.matches.map((match) => {
          const draft = draftOf(response, match);
          const line = response.lines[match.line_index];
          const key = `${response.id}:${match.line_index}`;
          return (
            <div className="rates-match" key={key}>
              <div className="rates-match-head">
                <strong>{match.job_label ?? draft.job_key ?? t('Job not named')}</strong>
                <span className="ld-chip" data-tone="neutral">{fieldLabel(match.field)}</span>
                {confidenceChip(match.confidence)}
              </div>
              {line ? <p className="rates-evidence">{line.raw_text}</p> : null}
              {match.evidence.length ? (
                <p className="rates-evidence">{match.evidence.join(' · ')}</p>
              ) : null}
              {match.anomaly ? (
                <p className="rates-anomaly">
                  {t('Rate anomaly: {detail}', { detail: match.anomaly.detail })}
                </p>
              ) : null}
              <div className="ld-fields rates-match-fields">
                <label className="ld-field" htmlFor={`${fieldId}-job-${key}`}>
                  <span>{t('Job')}</span>
                  <SelectField
                    id={`${fieldId}-job-${key}`}
                    wide
                    value={draft.job_key}
                    placeholder={t('Not a job')}
                    options={[
                      ...jobsOf(response.customer_profile_id).map((job) => ({
                        value: job.job_key,
                        label: job.job_label,
                      })),
                      { value: '', label: t('Not a job') },
                    ]}
                    onValueChange={(value) => editMatch(response, match, { job_key: value })}
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-value-${key}`}>
                  <span>{t('Value')}</span>
                  <Input
                    id={`${fieldId}-value-${key}`}
                    inputMode="decimal"
                    value={draft.value}
                    onChange={(event) => editMatch(response, match, { value: event.target.value })}
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-unit-${key}`}>
                  <span>{t('Unit')}</span>
                  <SelectField
                    id={`${fieldId}-unit-${key}`}
                    value={draft.unit}
                    options={unitOptions(match.field)}
                    onValueChange={(value) =>
                      editMatch(response, match, { unit: value as RateUnit })
                    }
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-from-${key}`}>
                  <span>{t('In force from')}</span>
                  <Input
                    id={`${fieldId}-from-${key}`}
                    type="date"
                    value={draft.effective_from}
                    onChange={(event) =>
                      editMatch(response, match, { effective_from: event.target.value })
                    }
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-to-${key}`}>
                  <span>{t('Until')}</span>
                  <Input
                    id={`${fieldId}-to-${key}`}
                    type="date"
                    disabled={draft.project}
                    value={draft.effective_to}
                    onChange={(event) =>
                      editMatch(response, match, { effective_to: event.target.value })
                    }
                  />
                </label>
                <label className="pf-check" data-span={2}>
                  <input
                    type="checkbox"
                    checked={draft.project}
                    onChange={(event) =>
                      editMatch(response, match, { project: event.target.checked })
                    }
                  />
                  <span>
                    {t('Applies for the rest of the project')}
                    <small>{t('The figure holds until a later one replaces it.')}</small>
                  </span>
                </label>
              </div>
            </div>
          );
        })}

        <div className="rates-confirm">
          <label className="pf-check">
            <input
              type="checkbox"
              checked={learn[response.id] ?? true}
              onChange={(event) => setLearn({ ...learn, [response.id]: event.target.checked })}
            />
            <span>
              {t('Remember these names for this customer')}
              <small>{t('The next reply that writes them is matched without asking.')}</small>
            </span>
          </label>
          <Button
            disabled={busy(busyKey.response(response.id)) || settling === 0}
            onClick={() => void confirm(response)}
          >
            {t('Confirm for all {tickets}', { tickets: tr.plural(tickets, 'ticket') })}
          </Button>
          <Button
            variant="ghost"
            disabled={busy(busyKey.response(response.id))}
            onClick={() => setReject({ id: response.id, reason: '' })}
          >
            {t('Reject')}
          </Button>
        </div>
      </article>
    );
  };

  /** The open request: the message as it stands, and what can be done with it. */
  const requestDetail = (request: RateRequest) => {
    const recipient = recipientOf(request);
    const waiting = busy(busyKey.request(request.id));
    const replies = responsesFor(request.id);
    return (
      <section
        className="ld-panel pf-section rates-request"
        id="rates-request"
        aria-labelledby="rates-request-title"
      >
        <div className="ld-panel-head">
          <div>
            <p className="ld-step">{t('Selected request')}</p>
            <h2 id="rates-request-title">
              {nameOf(request.customer_profile_id)} · {periodFor(request)}
            </h2>
          </div>
          <span className="rates-chips">{statusChip(request)}</span>
        </div>

        {notice ? (
          <p className="ld-notice" data-tone="warning">
            {t(notice)}
          </p>
        ) : null}

        <div className="rates-mail">
          <dl>
            <dt>{t('To')}</dt>
            <dd data-missing={recipient ? undefined : true}>
              {recipient ?? t('No rate contact — add one in Customers')}
            </dd>
            <dt>{t('Subject')}</dt>
            <dd>{request.subject}</dd>
          </dl>
          <pre className="rates-body">{request.body}</pre>
        </div>

        <div className="rates-actions">
          <Button disabled={waiting || !recipient} onClick={() => void act(() => sendRequest(request.id), 'Request sent')}>
            <Send />
            {t('Send')}
          </Button>
          {rates.dev_tools ? (
            <Button
              variant="secondary"
              disabled={waiting}
              onClick={() => void act(() => markSent(request.id), 'Filed as sent')}
            >
              {t('Mark as sent (simulated)')}
            </Button>
          ) : null}
          <Button
            variant="secondary"
            disabled={waiting}
            onClick={() => void act(() => followUp(request.id), 'Follow-up drafted')}
          >
            <Mail />
            {t('Draft follow-up')}
          </Button>
          <Button
            variant="ghost"
            disabled={waiting}
            onClick={() => void act(() => closeRequest(request.id), 'Request closed')}
          >
            {t('Close')}
          </Button>
        </div>

        {replies.length ? (
          <div>
            <p className="ld-step">{t('Replies to this request')}</p>
            <ul className="pf-suggestions">
              {replies.map((response) => (
                <li key={response.id}>
                  <div>
                    <strong>
                      {date(response.created_at.slice(0, 10))} ·{' '}
                      {response.source === 'simulated' ? t('Simulated') : t('Customer email')}
                    </strong>
                    <small>{matchSummary(response)}</small>
                  </div>
                  {response.status === 'needs_confirmation' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        document
                          .getElementById('rates-confirm')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    >
                      {t('Confirm below')}
                    </Button>
                  ) : (
                    <span className="ld-chip" data-tone="neutral">
                      {t(RESPONSE_LABELS[response.status])}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    );
  };

  return (
    <div className="rates-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t('RATES')}</p>
          <h1>{t('Rates')}</h1>
          <p className="muted">
            {t(
              'Weekly hauling rates and fuel surcharges: what to ask each customer, what they answered, and what every invoice is priced on.',
            )}
          </p>
        </div>
        <dl className="ld-stats pf-stats">
          <div>
            <dt>{t('Waiting for rates')}</dt>
            <dd>{waitingCustomers}</dd>
          </div>
          <div>
            <dt>{t('Needs confirmation')}</dt>
            <dd>{toConfirm.length}</dd>
          </div>
          <div>
            <dt>{t('Ready invoices')}</dt>
            <dd>{readyInvoices}</dd>
          </div>
        </dl>
      </div>

      <div className="page-sheet">
        {rates.mode === 'local' ? (
          <div className="ld-notice pf-notice">
            {t('The rate agent runs on the server and is not available in the local preview.')}
          </div>
        ) : null}
        {rates.ready && rates.mode === 'remote' && !rates.ai_configured ? (
          <div className="ld-notice pf-notice">
            {t('No reading model is configured, so replies are matched by rules only. Anything the rules cannot place is left for you.')}
          </div>
        ) : null}
        {rates.ready && rates.mode === 'remote' && rates.mail_mode === 'DRAFT_ONLY' ? (
          <div className="ld-notice pf-notice">
            {t('Requests are drafts only on this deployment; nothing is emailed.')}
          </div>
        ) : null}
        {rates.error ? (
          <div className="ld-notice pf-notice" data-tone="warning">
            {t(rates.error)}
          </div>
        ) : null}

        <div className="rates-tiles">
          <div className="ld-panel hm-stat rates-tile">
            <p className="hm-stat-label">{t('Waiting for rates')}</p>
            <p className="hm-stat-value">{waitingCustomers}</p>
            <p className="hm-stat-sub">
              {t('{customers} with a request open', { customers: tr.plural(waitingCustomers, 'customer') })}
            </p>
          </div>
          <div className="ld-panel hm-stat rates-tile">
            <p className="hm-stat-label">{t('Responses received')}</p>
            <p className="hm-stat-value">{rates.responses.length}</p>
            <p className="hm-stat-sub">{t('Replies read this period')}</p>
          </div>
          <div className="ld-panel hm-stat rates-tile">
            <p className="hm-stat-label">{t('Needs confirmation')}</p>
            <p className="hm-stat-value">{toConfirm.length}</p>
            <p className="hm-stat-sub rates-tile-warning">
              {toConfirm.length ? t('Waiting on you') : t('Nothing waiting on you')}
            </p>
          </div>
          <div className="ld-panel hm-stat rates-tile">
            <p className="hm-stat-label">{t('Ready')}</p>
            <p className="hm-stat-value">{readyInvoices}</p>
            <p className="hm-stat-sub">
              {t('{invoices} priced in full', { invoices: tr.plural(readyInvoices, 'invoice') })}
            </p>
          </div>
        </div>

        <section className="ld-panel pf-section" aria-labelledby="rates-requests-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('What to ask')}</p>
              <h2 id="rates-requests-title">{t('This week’s requests')}</h2>
            </div>
          </div>

          <div className="rates-toolbar">
            <label className="rates-period-field" htmlFor={`${fieldId}-period`}>
              <span>{t('Period')}</span>
              <SelectField
                id={`${fieldId}-period`}
                value={`${range.from}|${range.to}`}
                options={periodOptions}
                onValueChange={(value) => {
                  setPeriodKey(value);
                  setSelected(null);
                  setNotice(null);
                }}
              />
            </label>
            <p className="ld-hint">
              {date(range.from)} – {date(range.to)}
            </p>
            <span className="rates-toolbar-spacer" />
            <Button disabled={working || rates.mode !== 'remote'} onClick={() => void generate()}>
              <Plus />
              {t('Generate weekly requests')}
            </Button>
          </div>

          {loading ? (
            <p className="ld-empty">{t('Loading rates…')}</p>
          ) : requests.length === 0 ? (
            <p className="ld-empty">
              {t('No requests for this period yet. Generate them to see what each customer has to be asked.')}
            </p>
          ) : (
            <>
              <div className="rates-filters">
                <fieldset className="ui-segmented">
                  <legend className="sr-only">{t('Show')}</legend>
                  {(
                    [
                      ['all', 'All'],
                      ['waiting', 'Waiting'],
                      ['received', 'Received'],
                      ['input', 'Needs input'],
                      ['resolved', 'Resolved'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={filter === value}
                      onClick={() => setFilter(value)}
                    >
                      {t(label)}
                    </button>
                  ))}
                </fieldset>
                <p className="ld-hint">{t('Pick a request to read it and send it.')}</p>
              </div>

              <div className="pf-table-wrap">
                <table className="pf-table rates-table">
                  <thead>
                    <tr>
                      <th scope="col">{t('Customer')}</th>
                      <th scope="col">{t('Period')}</th>
                      <th scope="col">{t('Status')}</th>
                      <th scope="col" className="pf-num">{t('Jobs')}</th>
                      <th scope="col">{t('What is asked')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((request) => (
                      <tr
                        key={request.id}
                        aria-selected={request.id === selected}
                        data-selected={request.id === selected || undefined}
                        onClick={() => {
                          setSelected(request.id);
                          setNotice(null);
                        }}
                      >
                        <th scope="row" className="pf-name">
                          <button
                            type="button"
                            className="rates-pick"
                            aria-label={t('Open the request to {customer}', {
                              customer: nameOf(request.customer_profile_id),
                            })}
                            onClick={() => {
                              setSelected(request.id);
                              setNotice(null);
                            }}
                          >
                            <strong>{nameOf(request.customer_profile_id)}</strong>
                          </button>
                        </th>
                        <td className="pf-date">{periodFor(request)}</td>
                        <td>{statusChip(request)}</td>
                        <td className="pf-num">{request.items.length}</td>
                        <td className="rates-asks">{asksOf(request) || t('Nothing left to ask')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="pf-cards">
                {shown.map((request) => (
                  <li
                    key={request.id}
                    className="pf-card rates-card"
                    data-selected={request.id === selected || undefined}
                  >
                    <button
                      type="button"
                      className="rates-card-pick"
                      aria-pressed={request.id === selected}
                      onClick={() => {
                        setSelected(request.id);
                        setNotice(null);
                      }}
                    >
                      <div className="pf-card-head">
                        <div>
                          <strong>{nameOf(request.customer_profile_id)}</strong>
                          <small>
                            {periodFor(request)} · {tr.plural(request.items.length, 'job')}
                          </small>
                        </div>
                        {statusChip(request)}
                      </div>
                      <p className="rates-card-asks">{asksOf(request) || t('Nothing left to ask')}</p>
                    </button>
                  </li>
                ))}
              </ul>
              {shown.length === 0 ? (
                <p className="ld-empty">{t('No requests in this view.')}</p>
              ) : null}
            </>
          )}
        </section>

        {open ? requestDetail(open) : null}

        <section
          className="ld-panel pf-section"
          id="rates-confirm"
          aria-labelledby="rates-confirm-title"
        >
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('Waiting on you')}</p>
              <h2 id="rates-confirm-title">{t('Replies to confirm')}</h2>
            </div>
            <span className="ld-hint">
              {t('A rate is agreed for a job and a period, so it is confirmed once for every ticket it covers.')}
            </span>
          </div>
          {toConfirm.length === 0 ? (
            <p className="ld-empty">{t('Nothing is waiting to be confirmed.')}</p>
          ) : (
            toConfirm.map((response) => replyCard(response))
          )}
        </section>

        {rates.dev_tools ? (
          <section className="ld-panel pf-section rates-dev" aria-labelledby="rates-simulate-title">
            <div className="ld-panel-head">
              <div>
                <p className="ld-step">{t('Development only')}</p>
                <h2 id="rates-simulate-title">{t('Simulate a reply')}</h2>
              </div>
              <span className="rates-dev-tag">{t('DEV')}</span>
            </div>
            <p className="ld-hint">
              {t('Puts a message through the reader exactly as an arriving email would go through it. Nothing is emailed.')}
            </p>
            <form className="rates-dev-form" onSubmit={(event) => void simulate(event)}>
              <div className="rates-dev-fields">
                <label className="ld-field" htmlFor={`${fieldId}-sim-customer`}>
                  <span>{t('Customer')}</span>
                  <SelectField
                    id={`${fieldId}-sim-customer`}
                    wide
                    value={sim.customer}
                    placeholder={t('Pick a customer')}
                    options={customerOptions}
                    onValueChange={(value) => setSim({ ...sim, customer: value, request: '' })}
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-sim-request`}>
                  <span>{t('In reply to')}</span>
                  <SelectField
                    id={`${fieldId}-sim-request`}
                    wide
                    value={sim.request}
                    placeholder={t('No request')}
                    options={rates.requests
                      .filter(
                        (request) =>
                          String(request.customer_profile_id) === sim.customer &&
                          OPEN_STATUSES.has(request.status),
                      )
                      .map((request) => ({ value: String(request.id), label: periodFor(request) }))}
                    onValueChange={(value) => setSim({ ...sim, request: value })}
                  />
                </label>
              </div>
              <label className="ld-field" htmlFor={`${fieldId}-sim-subject`}>
                <span>{t('Subject')}</span>
                <Input
                  id={`${fieldId}-sim-subject`}
                  maxLength={400}
                  value={sim.subject}
                  onChange={(event) => setSim({ ...sim, subject: event.target.value })}
                />
              </label>
              <label className="ld-field" htmlFor={`${fieldId}-sim-body`}>
                <span>{t('Message')}</span>
                <Textarea
                  id={`${fieldId}-sim-body`}
                  rows={6}
                  value={sim.body}
                  placeholder={t('Markham Road is $8.75 a ton, fuel 12%.')}
                  onChange={(event) => setSim({ ...sim, body: event.target.value })}
                />
              </label>
              <div className="rates-actions">
                <Button
                  type="submit"
                  disabled={busy(busyKey.simulate) || !sim.customer || !sim.body.trim()}
                >
                  {t('Process reply')}
                </Button>
              </div>
            </form>
          </section>
        ) : null}

        <section className="ld-panel pf-section" aria-labelledby="rates-history-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('What invoices are priced on')}</p>
              <h2 id="rates-history-title">{t('Rate history')}</h2>
            </div>
            <div className="rates-history-controls">
              <label className="pf-check pf-check-inline" htmlFor={`${fieldId}-history`}>
                <input
                  id={`${fieldId}-history`}
                  type="checkbox"
                  checked={showHistory}
                  onChange={(event) => setShowHistory(event.target.checked)}
                />
                <span>{t('Show history')}</span>
              </label>
              <Button
                variant="ghost"
                size="sm"
                disabled={busy(busyKey.apply) || rates.mode !== 'remote'}
                onClick={() => void reprice()}
              >
                <RefreshCw />
                {t('Re-price tickets')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={rates.mode !== 'remote' || customers.length === 0}
                onClick={() => {
                  setFormError(null);
                  setForm({
                    customer: '',
                    job: '',
                    jobLabel: '',
                    kind: 'base',
                    unit: 'PER_TON',
                    value: '',
                    from: range.from,
                    to: range.to,
                    project: false,
                    reason: '',
                  });
                }}
              >
                <Plus />
                {t('Add rate')}
              </Button>
            </div>
          </div>
          {(() => {
            const history = rates.periods
              .filter((period) => showHistory || period.superseded_by === null)
              .sort((a, b) => b.effective_from.localeCompare(a.effective_from) || b.id - a.id);
            if (loading) return <p className="ld-empty">{t('Loading rates…')}</p>;
            if (!history.length) {
              return <p className="ld-empty">{t('No rates on file yet.')}</p>;
            }
            return (
              <div className="pf-table-wrap">
                <table className="pf-table rates-history-table">
                  <thead>
                    <tr>
                      <th scope="col">{t('Customer')}</th>
                      <th scope="col">{t('Job')}</th>
                      <th scope="col">{t('Kind')}</th>
                      <th scope="col">{t('Value')}</th>
                      <th scope="col">{t('Effective')}</th>
                      <th scope="col">{t('Source')}</th>
                      <th scope="col">{t('Confidence')}</th>
                      <th scope="col">{t('Applied by')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, MAX_LISTED * 4).map((period) => (
                      <tr key={period.id} data-superseded={period.superseded_by !== null || undefined}>
                        <th scope="row" className="pf-name">
                          <strong>{nameOf(period.customer_profile_id)}</strong>
                        </th>
                        <td>{period.job_label || period.job_key}</td>
                        <td>{period.kind === 'base' ? t('Base') : t('Fuel')}</td>
                        <td className="rates-value">{rateText(period)}</td>
                        <td className="pf-date">
                          {period.validity === 'PROJECT_DURATION'
                            ? t('{date} · for the project', { date: date(period.effective_from) })
                            : `${date(period.effective_from)} – ${
                                period.effective_to ? date(period.effective_to) : t('open')
                              }`}
                        </td>
                        <td>
                          <span className="ld-chip" data-tone="neutral">
                            {t(SOURCE_LABELS[period.source])}
                          </span>
                        </td>
                        <td>
                          {period.confidence === null
                            ? '—'
                            : t('{percent}%', { percent: Math.round(period.confidence * 100) })}
                        </td>
                        <td>
                          {period.applied_by === 'auto'
                            ? t('Applied automatically')
                            : t('Confirmed by {who}', { who: period.confirmed_by ?? t('a person') })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </section>

        <section className="ld-panel pf-section" aria-labelledby="rates-invoices-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('Before they can go out')}</p>
              <h2 id="rates-invoices-title">{t('Invoices waiting on rates')}</h2>
            </div>
            <Link href="/records" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
              {t('Open Invoices & Tickets')}
            </Link>
          </div>
          {loading ? (
            <p className="ld-empty">{t('Loading rates…')}</p>
          ) : waitingInvoices.length === 0 ? (
            <p className="ld-notice" data-tone="good">
              {t('No invoice is waiting on a rate.')}
            </p>
          ) : (
            <ul className="pf-suggestions">
              {waitingInvoices.slice(0, MAX_LISTED).map(({ group, readiness }) => (
                <li key={group.key}>
                  <div>
                    <strong>
                      {invoiceNumber(group)} · {group.invoice.bill_to.name}
                    </strong>
                    <small>
                      {group.firstTicketDate ? date(group.firstTicketDate) : t('undated')} –{' '}
                      {group.lastTicketDate ? date(group.lastTicketDate) : t('undated')} ·{' '}
                      {tr.plural(group.records.length, 'ticket')}
                    </small>
                    {steps(readiness)}
                    {readiness.waiting_jobs.length ? (
                      <p className="rates-waiting">
                        {t('Waiting on {jobs}', {
                          jobs: readiness.waiting_jobs
                            .map(
                              (job) =>
                                `${job.job_label} (${job.missing.map((field) => fieldLabel(field)).join(' + ')})`,
                            )
                            .join(', '),
                        })}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {waitingInvoices.length > MAX_LISTED ? (
            <p className="ld-hint">
              {t('and {n} more', { n: waitingInvoices.length - MAX_LISTED })}
            </p>
          ) : null}

          {finalized.length ? (
            <>
              <p className="ld-step">{t('Finalized')}</p>
              <ul className="pf-suggestions">
                {finalized.slice(0, MAX_LISTED).map(({ group, lock }) => {
                  const conflicts = rates.events.filter(
                    (event) => event.kind === 'PRICING_CONFLICT' && event.invoice_key === group.key,
                  );
                  return (
                    <li key={group.key}>
                      <div>
                        <strong>
                          {invoiceNumber(group)} · {group.invoice.bill_to.name}
                        </strong>
                        <small>
                          {lock
                            ? t('Finalized {date} · {total}', {
                                date: date(lock.finalized_at.slice(0, 10)),
                                total: money(lock.snapshot.total),
                              })
                            : t('Finalized')}
                        </small>
                        {conflicts.map((event) => (
                          <p className="rates-waiting" key={event.id}>
                            {t('Rate change after finalizing: {detail}', { detail: event.detail })}
                          </p>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </section>

        <section className="ld-panel pf-section" aria-labelledby="rates-activity-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('What the agent did')}</p>
              <h2 id="rates-activity-title">{t('Recent activity')}</h2>
            </div>
          </div>
          {rates.events.length === 0 ? (
            <p className="ld-empty">{t('Nothing has happened yet.')}</p>
          ) : (
            <ul className="rates-events">
              {rates.events.slice(0, 20).map((event) => (
                <li key={event.id}>
                  <time dateTime={event.at}>{date(event.at.slice(0, 10))}</time>
                  <strong>
                    {event.customer_profile_id === null
                      ? t('Agent')
                      : nameOf(event.customer_profile_id)}
                  </strong>
                  <span>{event.detail || event.kind}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="ld-hint rates-footer">
          {t(
            'A rate is never edited in place: a new figure supersedes the old one and the old one stays on file, so an invoice can always be explained by the rate that was in force when it was printed.',
          )}
        </p>
      </div>

      <Dialog
        open={reject !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setReject(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {reject ? (
            <form
              className="pf-form"
              onSubmit={(event) => {
                event.preventDefault();
                const { id, reason } = reject;
                setReject(null);
                void act(() => rejectResponse(id, reason), 'Reply rejected');
              }}
            >
              <DialogHeader>
                <DialogTitle>{t('Reject this reply')}</DialogTitle>
                <DialogDescription>
                  {t('The message stays on file; nothing is priced from it. Say why, so the trail reads.')}
                </DialogDescription>
              </DialogHeader>
              <div className="ld-fields pf-fields">
                <label className="ld-field" data-span={2} htmlFor={`${fieldId}-reject`}>
                  <span>{t('Reason')}</span>
                  <Input
                    id={`${fieldId}-reject`}
                    required
                    maxLength={2000}
                    value={reject.reason}
                    onChange={(event) => setReject({ ...reject, reason: event.target.value })}
                  />
                </label>
              </div>
              <DialogFooter showCloseButton>
                <Button type="submit" disabled={!reject.reason.trim()}>
                  {t('Reject')}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={form !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setForm(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          {form ? (
            <form className="pf-form" onSubmit={(event) => void saveRate(event)}>
              <DialogHeader>
                <DialogTitle>{t('Add rate')}</DialogTitle>
                <DialogDescription>
                  {t('The figure in force from a day. Whatever it replaces is kept, so older invoices still read.')}
                </DialogDescription>
              </DialogHeader>
              <div className="ld-fields pf-fields">
                <label className="ld-field" data-span={2} htmlFor={`${fieldId}-add-customer`}>
                  <span>{t('Customer')}</span>
                  <SelectField
                    id={`${fieldId}-add-customer`}
                    wide
                    value={form.customer}
                    placeholder={t('Pick a customer')}
                    options={customerOptions}
                    onValueChange={(value) => setForm({ ...form, customer: value, job: '' })}
                  />
                </label>
                <label className="ld-field" data-span={2} htmlFor={`${fieldId}-add-job`}>
                  <span>{t('Job')}</span>
                  <SelectField
                    id={`${fieldId}-add-job`}
                    wide
                    value={form.job}
                    placeholder={t('Pick a job')}
                    options={jobOptions(Number(form.customer))}
                    onValueChange={(value) => setForm({ ...form, job: value })}
                  />
                </label>
                {form.job === OTHER_JOB ? (
                  <label className="ld-field" data-span={2} htmlFor={`${fieldId}-add-job-name`}>
                    <span>{t('Job name')}</span>
                    <Input
                      id={`${fieldId}-add-job-name`}
                      required
                      maxLength={200}
                      value={form.jobLabel}
                      onChange={(event) => setForm({ ...form, jobLabel: event.target.value })}
                    />
                  </label>
                ) : null}
                <label className="ld-field" htmlFor={`${fieldId}-add-kind`}>
                  <span>{t('Kind')}</span>
                  <SelectField
                    id={`${fieldId}-add-kind`}
                    value={form.kind}
                    options={[
                      { value: 'base', label: t('Base') },
                      { value: 'fuel', label: t('Fuel') },
                    ]}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        kind: value === 'fuel' ? 'fuel' : 'base',
                        unit: value === 'fuel' ? 'PERCENTAGE' : 'PER_TON',
                      })
                    }
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-add-unit`}>
                  <span>{t('Unit')}</span>
                  <SelectField
                    id={`${fieldId}-add-unit`}
                    value={form.unit}
                    options={unitOptions(form.kind)}
                    onValueChange={(value) => setForm({ ...form, unit: value as RateUnit })}
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-add-value`}>
                  <span>{t('Value')}</span>
                  <Input
                    id={`${fieldId}-add-value`}
                    inputMode="decimal"
                    value={form.value}
                    onChange={(event) => setForm({ ...form, value: event.target.value })}
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-add-from`}>
                  <span>{t('In force from')}</span>
                  <Input
                    id={`${fieldId}-add-from`}
                    type="date"
                    required
                    value={form.from}
                    onChange={(event) => setForm({ ...form, from: event.target.value })}
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-add-to`}>
                  <span>{t('Until')}</span>
                  <Input
                    id={`${fieldId}-add-to`}
                    type="date"
                    disabled={form.project}
                    value={form.to}
                    onChange={(event) => setForm({ ...form, to: event.target.value })}
                  />
                </label>
                <label className="pf-check" data-span={2}>
                  <input
                    type="checkbox"
                    checked={form.project}
                    onChange={(event) => setForm({ ...form, project: event.target.checked })}
                  />
                  <span>
                    {t('Applies for the rest of the project')}
                    <small>{t('The figure holds until a later one replaces it.')}</small>
                  </span>
                </label>
                <label className="ld-field" data-span={2} htmlFor={`${fieldId}-add-reason`}>
                  <span>{t('Why')}</span>
                  <Input
                    id={`${fieldId}-add-reason`}
                    required
                    maxLength={2000}
                    placeholder={t('Agreed on the phone with the yard')}
                    value={form.reason}
                    onChange={(event) => setForm({ ...form, reason: event.target.value })}
                  />
                </label>
              </div>
              {formError ? (
                <p className="ld-status" data-tone="error" role="alert">
                  {t(formError)}
                </p>
              ) : null}
              <DialogFooter showCloseButton>
                <Button type="submit" disabled={busy(busyKey.period)}>
                  {busy(busyKey.period) ? t('Saving…') : t('Save rate')}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
