'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type SyntheticEvent,
} from 'react';
import Link from 'next/link';
import { setDeskField } from '@/lib/load-desk/desk-session';
import {
  ChevronDown,
  Download,
  FileSearch,
  Lock,
  LockOpen,
  Pencil,
  ReceiptText,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { toast } from '@/components/ui/toast';
import InvoiceDialog, {
  type InvoiceView,
} from '@/components/load-desk/invoice-dialog';
import { useProfiles, useRecords } from '@/components/profiles/profile-ui';
import type { Translator } from '@/lib/i18n/translate';
import { useT } from '@/lib/i18n/use-t';
import {
  invoiceDestination,
  invoiceOrigin,
  invoiceTons,
  ledgerCsv,
  lineTotal,
  money,
} from '@/lib/load-desk/format';
import {
  customerIdFor,
  loadDate,
  truckIdFor,
  truckLabel,
} from '@/lib/load-desk/profiles';
import {
  invoiceGroups,
  invoiceLines,
  invoicesCsv,
  isPendingInvoiceNumber,
  isUndatedBatch,
  recordBatch,
  recordMatches,
  shownInvoiceNumber,
  ticketStatus,
  type InvoiceGroup,
} from '@/lib/load-desk/records';
import {
  billingPeriodFor,
  invoiceReadiness,
  type InvoiceLock,
  type InvoiceReadiness,
  type ReadinessStep,
} from '@/lib/load-desk/rates';
import {
  busyKey,
  finalizeInvoice,
  getRatesSnapshot,
  getServerRatesSnapshot,
  loadRates,
  subscribeRates,
  unlockInvoice,
} from '@/lib/load-desk/rates-store';
import {
  deleteSavedRecord,
  openStoredOriginal,
} from '@/lib/load-desk/storage';
import type { SavedRecord } from '@/lib/load-desk/types';

// The rate agent's rows, as this page reads them: the periods an invoice is
// priced from and the invoices already closed against them.
const useRates = () =>
  useSyncExternalStore(subscribeRates, getRatesSnapshot, getServerRatesSnapshot);

const DAY_MS = 86_400_000;
/** As far back as the Rates page offers, so the invoices on screen are covered. */
const RATE_PERIODS_BACK = 8;

const pad2 = (value: number) => String(value).padStart(2, '0');
const isoDay = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

/**
 * The stretch of days this page needs rates for: from the start of the billing
 * period eight back — the oldest the Rates page offers, and further back than
 * an invoice is usually still open — up to today.
 */
const ratesRange = (now: Date) => ({
  from: billingPeriodFor(undefined, new Date(now.getTime() - RATE_PERIODS_BACK * 7 * DAY_MS)).from,
  to: isoDay(now),
});

type Tab = 'invoices' | 'tickets';

const STATUS_OPTIONS: Record<Tab, [string, string][]> = {
  invoices: [
    ['all', 'All invoices'],
    ['draft', 'Draft (rate missing)'],
    ['rated', 'Rated'],
    ['waiting', 'Waiting on rates'],
    ['finalized', 'Finalized'],
  ],
  tickets: [
    ['all', 'All tickets'],
    ['needs_review', 'Needs review'],
    ['valid', 'Valid'],
  ],
};

// Exported files stay in English, like printed invoices.
function downloadCsv(fileName: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'text/csv;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

function dateRange({ t, date }: Translator, group: InvoiceGroup) {
  if (!group.firstTicketDate) return t('No ticket dates');
  const first = date(group.firstTicketDate);
  const last = group.lastTicketDate ? date(group.lastTicketDate) : first;
  return first === last
    ? t('Tickets {date}', { date: first })
    : t('Tickets {first} – {last}', { first, last });
}

/**
 * What to call an invoice: its number, or, for tickets not on one yet, why
 * not. Tickets with no date read off them wait on no invoice at all (see
 * UNDATED_BATCH); a batch still being read waits for its number.
 */
function invoiceName({ t }: Translator, group: Pick<InvoiceGroup, 'records' | 'invoice'>) {
  const number = shownInvoiceNumber(group.invoice.invoice_number);
  if (number) return number;
  return invoiceStanding(t, group);
}

/** Why a group of tickets has no number to show: waiting for its date, or a number. */
function invoiceStanding(t: Translator['t'], group: Pick<InvoiceGroup, 'records' | 'invoice'>) {
  const first = group.records[0];
  if (first && isUndatedBatch(recordBatch(first))) return t('Date not found');
  return isPendingInvoiceNumber(group.invoice.invoice_number)
    ? t('Waiting for a number')
    : group.invoice.invoice_number;
}

/**
 * A company — the client an invoice is billed to, or a customer whose loads
 * are on it — as a pill in that company's own colour.
 *
 * The colour is worked out from the name, so the same company is the same
 * colour on every invoice and on every visit, and two companies are two
 * colours — eight to go round, so a workspace with more than eight will see a
 * repeat. Nothing is stored for it.
 */
const COMPANY_TONES = 8;
function companyTone(name: string): number {
  let hash = 0;
  for (const char of name.trim().toUpperCase()) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash % COMPANY_TONES;
}

function CompanyPill({ name }: { name: string }) {
  const clean = name.trim();
  if (!clean) return <span className="pf-muted">—</span>;
  return (
    <span className="rec-company ui-literal" data-tone={companyTone(clean)}>
      {clean}
    </span>
  );
}

/** Several companies, each its own pill, wrapping as they need to. */
function CompanyPills({ names }: { names: string[] }) {
  const unique = [...new Set(names.map((name) => name.trim()).filter(Boolean))];
  if (!unique.length) return <span className="pf-muted">—</span>;
  return (
    <span className="rec-companies">
      {unique.map((name) => (
        <CompanyPill key={name} name={name} />
      ))}
    </span>
  );
}

/** "Invoice 12" as a line to open, or why there is no number yet. */
function invoiceHeading(tr: Translator, group: Pick<InvoiceGroup, 'records' | 'invoice'>) {
  const number = shownInvoiceNumber(group.invoice.invoice_number);
  return number ? tr.t('Invoice {number}', { number }) : invoiceStanding(tr.t, group);
}

/** A step of the readiness line: done, still waited on, or not on this invoice. */
const STEP_MARK: Record<ReadinessStep, string> = {
  ok: '✓',
  waiting: '⏳',
  'n/a': '—',
};

export default function RecordsPage() {
  const { records, ready, error: storeError, mode } = useRecords();
  const { customers, trucks } = useProfiles();
  const rates = useRates();
  const [now] = useState(() => new Date());
  // One read, and only ever one: the range is asked for while it is still null
  // and the answer sets it, but a second render before the answer arrives must
  // not ask again.
  const askedForRates = useRef(false);
  const tr = useT();
  const { t, plural, date } = tr;
  const fieldId = useId();
  const [tab, setTab] = useState<Tab>('invoices');
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [truckFilter, setTruckFilter] = useState('');
  const [status, setStatus] = useState('all');
  // Five filters ahead of the records made a phone scroll past the controls to
  // reach the thing it came for. They fold away there; on a screen with room
  // the CSS shows them regardless and this does nothing.
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [invoiceView, setInvoiceView] = useState<InvoiceView | null>(null);
  const [toDelete, setToDelete] = useState<SavedRecord | null>(null);
  const [toFinalize, setToFinalize] = useState<InvoiceGroup | null>(null);
  const [toUnlock, setToUnlock] = useState<InvoiceGroup | null>(null);
  // Reopening a finalized invoice says why, and the reason is kept on the lock.
  const [unlockReason, setUnlockReason] = useState('');
  /**
   * On the Tickets tab the tickets sit under their invoice, and an invoice
   * opens to show them. Closed until pressed — except while a search or filter
   * is on, when what was searched for is what should be in view, so every
   * invoice with a match starts open and pressing one closes it instead. So
   * this is the set of invoices flipped from whichever way is the default.
   */
  const [flippedInvoices, setFlippedInvoices] = useState<Set<string>>(() => new Set());

  /**
   * What an invoice is waiting for is part of this page, not something the
   * Rates page has to be visited first to see. So the agent's periods and
   * locks for the weeks these invoices fall in are read once, when the records
   * are in and there is a workspace to read them from. One bounded request of
   * small tables, nothing worked out on the server, and nothing here polls;
   * the unprotected local preview has no agent to ask.
   */
  useEffect(() => {
    if (!ready || mode !== 'remote') return;
    if (rates.ready || rates.range !== null || askedForRates.current) return;
    askedForRates.current = true;
    void loadRates(ratesRange(now));
  }, [ready, mode, rates.ready, rates.range, now]);

  const ticketNumber = (record: SavedRecord) =>
    record.ticket.ticket_number ?? t('unnumbered');

  const customerName = (record: SavedRecord) => {
    const id = customerIdFor(record, customers);
    return (
      customers.find((customer) => customer.id === id)?.name ??
      record.ticket.customer_name ??
      t('No customer')
    );
  };

  const passes = (record: SavedRecord) => {
    if (!recordMatches(record, query)) return false;
    const day = loadDate(record);
    if (from && day < from) return false;
    if (to && day > to) return false;
    if (customerFilter) {
      const id = customerIdFor(record, customers);
      if (customerFilter === 'none' ? id !== null : String(id) !== customerFilter) {
        return false;
      }
    }
    if (truckFilter) {
      const id = truckIdFor(record, trucks);
      if (truckFilter === 'none' ? id !== null : String(id) !== truckFilter) {
        return false;
      }
    }
    return true;
  };

  const groups = invoiceGroups(records);
  /** The lock on an invoice, if one has been written and not lifted since. */
  const lockFor = (group: InvoiceGroup): InvoiceLock | null =>
    rates.locks.find((lock) => lock.invoice_key === group.key) ?? null;
  const isLocked = (group: InvoiceGroup) => {
    const lock = lockFor(group);
    return lock !== null && lock.unlocked_at === null;
  };
  /**
   * What each invoice is still waiting for, worked out once for the page. Only
   * once the agent's rows are in and came back whole: without them there are no
   * periods to resolve against, and reading every invoice as short of a rate
   * would be a worse answer than the one this page already gives.
   */
  const readinessByKey = new Map<string, InvoiceReadiness>();
  if (rates.ready && rates.error === null) {
    for (const group of groups) {
      readinessByKey.set(
        group.key,
        invoiceReadiness(group, customers, rates.periods, isLocked(group)),
      );
    }
  }
  const readinessOf = (group: InvoiceGroup): InvoiceReadiness | null =>
    readinessByKey.get(group.key) ?? null;

  // An invoice shows when any of its tickets match; its totals stay whole.
  const shownInvoices = groups
    .filter((group) => group.records.some(passes))
    .filter((group) => {
      if (status === 'all') return true;
      const readiness = readinessOf(group);
      // Waiting and finalized are the agent's questions; without it, waiting
      // falls back to the draft an invoice short of a rate has always been.
      if (status === 'waiting') {
        return readiness
          ? readiness.status === 'WAITING_FOR_RATE' || readiness.status === 'WAITING_FOR_FUEL'
          : group.needsRate;
      }
      if (status === 'finalized') return readiness?.status === 'FINALIZED';
      return status === 'draft' ? group.needsRate : !group.needsRate;
    });
  const shownTickets = records
    .filter(passes)
    .filter((record) => status === 'all' || ticketStatus(record) === status)
    .sort((a, b) => loadDate(b).localeCompare(loadDate(a)) || b.id - a.id);
  // The same tickets, under their invoices, newest invoice first.
  const ticketsByInvoice = invoiceGroups(shownTickets);

  const billed = groups.reduce((sum, group) => sum + group.total, 0);
  const drafts = groups.filter((group) => group.needsRate).length;
  const filtersActive = Boolean(
    query || from || to || customerFilter || truckFilter || status !== 'all',
  );
  // What the folded-away filters are doing, so a phone can see that something
  // is narrowing the list without opening them. The search box is always in
  // view, so it is not counted here.
  const activeFilterCount = [from, to, customerFilter, truckFilter]
    .filter(Boolean)
    .length + (status === 'all' ? 0 : 1);

  function chooseTab(next: Tab) {
    setTab(next);
    setStatus('all');
  }

  const invoiceOpen = (key: string) => flippedInvoices.has(key) !== filtersActive;
  /**
   * Opens or closes an invoice. A press with the pointer lets go of the button
   * afterwards: the browser may otherwise leave its focus ring drawn round the
   * whole line — a blue box that stays until the pointer moves — which is for
   * finding the focus from the keyboard, and the keyboard keeps it (an Enter or
   * a Space arrives with no click count).
   */
  const toggleInvoice = (key: string, event?: MouseEvent<HTMLButtonElement>) => {
    if (event?.detail) event.currentTarget.blur();
    setFlippedInvoices((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  function clearFilters() {
    setQuery('');
    setFrom('');
    setTo('');
    setCustomerFilter('');
    setTruckFilter('');
    setStatus('all');
  }

  const openInvoice = (invoiceNumber: string, invoice = invoiceLines(records, invoiceNumber)[0]?.invoice) => {
    if (!invoice) return;
    setInvoiceView({
      lines: invoiceLines(records, invoiceNumber),
      invoice,
    });
  };

  async function openOriginal(record: SavedRecord) {
    try {
      await openStoredOriginal(record);
    } catch (error) {
      toast.add({
        title: t('Original unavailable'),
        description: t(errorMessage(error)),
        type: 'error',
      });
    }
  }

  async function confirmDelete() {
    const record = toDelete;
    if (!record) return;
    const error = await deleteSavedRecord(records, record);
    if (error) {
      toast.add({ title: t('Delete failed'), description: t(error), type: 'error' });
      return;
    }
    setToDelete(null);
    toast.add({
      title: t('Deleted ticket {number}', { number: ticketNumber(record) }),
      description: t(
        'Its line was removed from invoice {number}, and the stored original was deleted.',
        { number: record.invoice.invoice_number },
      ),
      type: 'success',
    });
  }

  /** Closes an invoice against the figures it carries today. */
  async function confirmFinalize() {
    const group = toFinalize;
    if (!group) return;
    const error = await finalizeInvoice(group.key);
    if (error) {
      toast.add({ title: t('Could not finalize'), description: t(error), type: 'error' });
      return;
    }
    setToFinalize(null);
    toast.add({
      title: t('Finalized {name}', { name: invoiceName(tr, group) }),
      description: t('Its pricing is kept as it is now. Later rate changes do not alter it.'),
      type: 'success',
    });
  }

  /** Opens a finalized invoice again. The reason is kept with the lock. */
  async function confirmUnlock(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const group = toUnlock;
    const reason = unlockReason.trim();
    if (!group || !reason) return;
    const error = await unlockInvoice(group.key, reason);
    if (error) {
      toast.add({ title: t('Could not unlock'), description: t(error), type: 'error' });
      return;
    }
    setToUnlock(null);
    setUnlockReason('');
    toast.add({
      title: t('Unlocked {name}', { name: invoiceName(tr, group) }),
      description: t('It is priced from the rates on file again.'),
      type: 'success',
    });
  }

  function exportCsv() {
    if (tab === 'invoices') {
      downloadCsv('invoices.csv', invoicesCsv(shownInvoices));
    } else {
      downloadCsv('load_tickets.csv', ledgerCsv(shownTickets));
    }
  }

  const shownCount = tab === 'invoices' ? shownInvoices.length : shownTickets.length;
  const totalCount = tab === 'invoices' ? groups.length : records.length;
  const noun = tab === 'invoices' ? 'invoice' : 'ticket';

  const invoiceActions = (group: InvoiceGroup) => {
    const readiness = readinessOf(group);
    const busy = rates.busy.has(busyKey.invoice(group.key));
    return (
      <div className="pf-actions">
        <Link
          href="/load-desk"
          onClick={() => setDeskField('editRequest', group.records[0].id)}
          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          aria-label={t('Edit invoice {number}', { number: group.invoice.invoice_number })}
        >
          <Pencil data-icon="inline-start" />
          {t('Edit')}
        </Link>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => openInvoice(group.invoice.invoice_number, group.invoice)}
        >
          <ReceiptText />
          {t('View')}
        </Button>
        {/* Closing an invoice against the rates of the day, and opening it
            again, are the agent's own actions: offered only where the agent
            is there to carry them out. */}
        {readiness === null ? null : readiness.status === 'FINALIZED' ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => {
              setUnlockReason('');
              setToUnlock(group);
            }}
          >
            <LockOpen data-icon="inline-start" />
            {t('Unlock')}
          </Button>
        ) : (
          <Button variant="ghost" size="sm" disabled={busy} onClick={() => setToFinalize(group)}>
            <Lock data-icon="inline-start" />
            {t('Finalize')}
          </Button>
        )}
      </div>
    );
  };

  const ticketActions = (record: SavedRecord) => (
    <div className="pf-actions">
      <Link
        href="/load-desk"
        onClick={() => setDeskField('editRequest', record.id)}
        className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
        aria-label={t('Edit ticket {number}', { number: ticketNumber(record) })}
        title={t('Edit')}
      >
        <Pencil />
      </Link>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t('Invoice {invoice} for ticket {ticket}', {
          invoice: record.invoice.invoice_number,
          ticket: ticketNumber(record),
        })}
        title={t('Invoice')}
        onClick={() => openInvoice(record.invoice.invoice_number)}
      >
        <ReceiptText />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t('Original of ticket {number}', { number: ticketNumber(record) })}
        title={t('Original')}
        onClick={() => void openOriginal(record)}
      >
        <FileSearch />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="ld-danger"
        aria-label={t('Delete ticket {number}', { number: ticketNumber(record) })}
        title={t('Delete')}
        onClick={() => setToDelete(record)}
      >
        <Trash2 />
      </Button>
    </div>
  );

  // A draft with no rated lines has no total yet, not a $0.00 total.
  const invoiceTotal = (group: InvoiceGroup) =>
    group.needsRate && group.total === 0 ? (
      <span className="pf-muted">{t('No rate yet')}</span>
    ) : (
      <strong>{money(group.total)}</strong>
    );

  /**
   * Where an invoice stands, in one chip.
   *
   * With the rate agent's week loaded that is what it is still waiting for —
   * the rate, the fuel surcharge, a person's eye, or nothing at all. Without
   * it, the older pair of chips: rated and to-confirm are two different
   * questions about one invoice — has it a price, and has a person checked
   * what it says against the paper — so a priced invoice with an unconfirmed
   * weight shows both rather than reading "Rated" and nothing else.
   */
  const invoiceStatus = (group: InvoiceGroup) => {
    const readiness = readinessOf(group);
    if (!readiness) {
      return (
        <>
          <span className="ld-chip" data-tone={group.needsRate ? 'warning' : 'good'}>
            {group.needsRate ? t('Draft') : t('Rated')}
          </span>
          {group.needsConfirmation ? (
            <span className="ld-chip" data-tone="warning">
              {t('To confirm')}
            </span>
          ) : null}
        </>
      );
    }
    if (readiness.status === 'FINALIZED') {
      const lock = lockFor(group);
      return (
        <span className="ld-chip pf-chip">
          {t('Finalized {date}', {
            date: date(lock ? lock.finalized_at.slice(0, 10) : null),
          })}
        </span>
      );
    }
    if (readiness.status === 'READY') {
      return (
        <span className="ld-chip" data-tone="good">
          {t('Ready')}
        </span>
      );
    }
    if (readiness.status === 'NEEDS_REVIEW') {
      return (
        <span className="ld-chip" data-tone="warning">
          {t('To confirm')}
        </span>
      );
    }
    return (
      <span
        className="ld-chip"
        data-tone="warning"
        // Which jobs are short, for the invoice that is short of several.
        title={readiness.waiting_jobs.map((job) => job.job_label).join(', ') || undefined}
      >
        {readiness.status === 'WAITING_FOR_RATE' ? t('Waiting for rate') : t('Waiting for fuel')}
      </span>
    );
  };

  /**
   * The four steps an invoice goes through, as one line. Mileage is not billed
   * from a rate period yet, so it stands as a step with nothing to say rather
   * than being left off the row people will come to read it in.
   */
  const readinessSteps = (group: InvoiceGroup) => {
    const readiness = readinessOf(group);
    if (!readiness) return null;
    return (
      <span className="rec-ready-steps">
        {[
          `${t('Tickets')} ${STEP_MARK[readiness.tickets]}`,
          `${t('Base rate')} ${STEP_MARK[readiness.base]}`,
          `${t('Fuel')} ${STEP_MARK[readiness.fuel]}`,
          `${t('Mileage')} ${STEP_MARK['n/a']}`,
        ].join(' · ')}
      </span>
    );
  };

  const recordStatus = (record: SavedRecord) => {
    const valid = ticketStatus(record) === 'valid';
    return (
      <span className="ld-chip" data-tone={valid ? 'good' : 'warning'}>
        {valid ? t('Valid') : t('Needs review')}
      </span>
    );
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t('RECORDS')}</p>
          <h1>{t('Invoices & Tickets')}</h1>
          <p className="muted">
            {t(
              'Every invoice and load ticket saved in Load Desk. Search, filter, edit, reprint an invoice or export what you see.',
            )}
          </p>
        </div>
        <dl className="ld-stats">
          <div>
            <dt>{t('Invoices')}</dt>
            <dd>{groups.length}</dd>
          </div>
          <div>
            <dt>{t('Tickets')}</dt>
            <dd>{records.length}</dd>
          </div>
          <div>
            <dt>{t('Billed')}</dt>
            <dd>{money(billed)}</dd>
          </div>
          <div>
            <dt>{t('Drafts')}</dt>
            <dd>{drafts}</dd>
          </div>
        </dl>
      </div>

      {/* Everything below the band rides in one sheet, as on every page. On a
          phone it is the panel that slides up over the band; on a wider screen
          it is display:contents and lays out as if it were not here. */}
      <div className="page-sheet">

        {storeError ? (
          <div className="ld-notice pf-notice" data-tone="warning">
            {t(storeError)}
          </div>
        ) : null}

        <section
          className="ld-panel pf-section rec-panel"
          aria-labelledby="rec-title"
        >
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('Database')}</p>
              <h2 id="rec-title">
                {tab === 'invoices' ? t('Invoices') : t('Load Tickets')}
              </h2>
            </div>
            <fieldset className="ui-segmented">
              <legend className="sr-only">{t('Show')}</legend>
              <button
                type="button"
                aria-pressed={tab === 'invoices'}
                onClick={() => chooseTab('invoices')}
              >
                {t('Invoices')}
              </button>
              <button
                type="button"
                aria-pressed={tab === 'tickets'}
                onClick={() => chooseTab('tickets')}
              >
                {t('Tickets')}
              </button>
            </fieldset>
          </div>

          <div className="rec-toolbar">
            <div className="rec-search">
              <Search aria-hidden="true" />
              <Input
                type="search"
                aria-label={t('Search invoices and tickets')}
                placeholder={t('Search ticket #, invoice #, customer, destination, truck…')}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button
              type="button"
              className="rec-filter-toggle"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal aria-hidden="true" />
              {filtersOpen ? t('Hide filters') : t('Filters')}
              {activeFilterCount ? <em>{activeFilterCount}</em> : null}
            </button>
            <div className="rec-filters" data-open={filtersOpen}>
              <div className="ld-field rec-filter">
                <label htmlFor={`${fieldId}-from`}>{t('Ticket date from')}</label>
                <Input
                  id={`${fieldId}-from`}
                  type="date"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                />
              </div>
              <div className="ld-field rec-filter">
                <label htmlFor={`${fieldId}-to`}>{t('Ticket date to')}</label>
                <Input
                  id={`${fieldId}-to`}
                  type="date"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                />
              </div>
              <div className="ld-field rec-filter">
                <label htmlFor={`${fieldId}-customer`}>{t('Customer')}</label>
                <SelectField
                  id={`${fieldId}-customer`}
                  value={customerFilter}
                  onValueChange={setCustomerFilter}
                  options={[
                    { value: '', label: t('All customers') },
                    ...customers.map((customer) => ({
                      value: String(customer.id),
                      label: customer.name,
                    })),
                    { value: 'none', label: t('Without a profile') },
                  ]}
                />
              </div>
              <div className="ld-field rec-filter">
                <label htmlFor={`${fieldId}-truck`}>{t('Truck')}</label>
                <SelectField
                  id={`${fieldId}-truck`}
                  value={truckFilter}
                  onValueChange={setTruckFilter}
                  options={[
                    { value: '', label: t('All trucks') },
                    ...trucks.map((truck) => ({
                      value: String(truck.id),
                      label: truckLabel(truck),
                    })),
                    { value: 'none', label: t('Without a profile') },
                  ]}
                />
              </div>
              <div className="ld-field rec-filter">
                <label htmlFor={`${fieldId}-status`}>{t('Status')}</label>
                <SelectField
                  id={`${fieldId}-status`}
                  value={status}
                  onValueChange={setStatus}
                  options={STATUS_OPTIONS[tab].map(([value, label]) => ({
                    value,
                    label: t(label),
                  }))}
                />
              </div>
            </div>
            <div className="rec-summary">
              <span aria-live="polite">
                {filtersActive
                  ? t('Showing {shown} of {total}', {
                      shown: shownCount,
                      total: plural(totalCount, noun),
                    })
                  : plural(totalCount, noun)}
              </span>
              <div className="rec-summary-actions">
                {filtersActive ? (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    {t('Clear filters')}
                  </Button>
                ) : null}
                <Button
                  className="rec-export"
                  variant="secondary"
                  size="sm"
                  onClick={exportCsv}
                  disabled={!shownCount}
                >
                  <Download />
                  {t('Export CSV')}
                </Button>
              </div>
            </div>
          </div>

          {!ready ? (
            <p className="ld-empty">{t('Loading saved records…')}</p>
          ) : !records.length ? (
            <p className="ld-empty">
              {t(
                'Nothing saved yet. Tickets and their invoices appear here after you save them in',
              )}{' '}
              <Link href="/load-desk">Load Desk</Link>.
            </p>
          ) : !shownCount ? (
            <p className="ld-empty">
              {tab === 'invoices'
                ? t('No invoices match these filters.')
                : t('No tickets match these filters.')}
            </p>
          ) : tab === 'invoices' ? (
            <>
              <div className="pf-table-wrap">
                <table className="pf-table">
                  <thead>
                    <tr>
                      <th scope="col">{t('Invoice #')}</th>
                      <th scope="col">{t('Invoice date')}</th>
                      <th scope="col" className="rec-wide-only">
                        {t('Bill to')}
                      </th>
                      <th scope="col">{t('Customers')}</th>
                      <th scope="col">{t('Truck #')}</th>
                      <th scope="col" className="pf-num">
                        {t('Tickets')}
                      </th>
                      <th scope="col" className="pf-num">
                        {t('Net tons')}
                      </th>
                      <th scope="col" className="pf-num">
                        {t('Total')}
                      </th>
                      <th scope="col">{t('Status')}</th>
                      <th scope="col">
                        <span className="sr-only">{t('Actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shownInvoices.map((group) => (
                      <tr key={group.key}>
                        <th scope="row" className="pf-name">
                          <button
                            type="button"
                            className="rec-link"
                            onClick={() =>
                              openInvoice(group.invoice.invoice_number, group.invoice)
                            }
                          >
                            {invoiceName(tr, group)}
                          </button>
                          <small>{dateRange(tr, group)}</small>
                        </th>
                        <td className="pf-date">
                          {date(group.invoice.invoice_date)}
                        </td>
                        <td className="rec-wrap rec-wide-only">
                          <CompanyPill name={group.invoice.bill_to.name} />
                        </td>
                        <td className="rec-wrap">
                          <CompanyPills names={group.records.map(customerName)} />
                        </td>
                        <td>{group.invoice.truck_number || '—'}</td>
                        <td className="pf-num">{group.records.length}</td>
                        <td className="pf-num">{group.tons.toFixed(2)}</td>
                        <td className="pf-num">{invoiceTotal(group)}</td>
                        <td>
                          {invoiceStatus(group)}
                          {readinessSteps(group)}
                        </td>
                        <td>
                          {invoiceActions(group)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="pf-cards">
                {shownInvoices.map((group) => (
                  <li key={group.key} className="pf-card">
                    <div className="pf-card-head">
                      <div>
                        <strong>
                          {invoiceName(tr, group)}
                          {invoiceStatus(group)}
                        </strong>
                        <small>
                          {date(group.invoice.invoice_date)} ·{' '}
                          <CompanyPill name={group.invoice.bill_to.name} />
                        </small>
                      </div>
                      {invoiceActions(group)}
                    </div>
                    <dl className="rec-card-facts">
                      <div>
                        <dt>{t('Tickets')}</dt>
                        <dd>{group.records.length}</dd>
                      </div>
                      <div>
                        <dt>{t('Net tons')}</dt>
                        <dd>{group.tons.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt>{t('Total')}</dt>
                        <dd>{invoiceTotal(group)}</dd>
                      </div>
                    </dl>
                    {readinessSteps(group)}
                    <p className="pf-card-foot">
                      <CompanyPills names={group.records.map(customerName)} />
                      {group.invoice.truck_number
                        ? ` · ${t('Truck #{number}', { number: group.invoice.truck_number })}`
                        : ''}{' '}
                      · {dateRange(tr, group)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="pf-table-wrap">
                <table className="pf-table rec-table-tickets">
                  {ticketsByInvoice.map((group) => {
                    const open = invoiceOpen(group.key);
                    const headId = `${fieldId}-invoice-${group.key.replace(/[^a-z0-9]+/gi, '-')}`;
                    return (
                  <tbody key={group.key} id={headId} className="rec-invoice-body" data-open={open || undefined}>
                    {/* The invoice, as a line that opens onto its tickets. */}
                    <tr className="rec-invoice-row">
                      <th scope="rowgroup" colSpan={9}>
                        <button
                          type="button"
                          className="rec-invoice-toggle"
                          aria-expanded={open}
                          aria-controls={headId}
                          onClick={(event) => toggleInvoice(group.key, event)}
                        >
                          <ChevronDown aria-hidden="true" />
                          <span className="rec-invoice-name">
                            <strong>{invoiceHeading(tr, group)}</strong>
                            <small>
                              {[
                                dateRange(tr, group),
                                plural(group.records.length, 'ticket'),
                                group.needsRate ? t('Needs a rate') : money(group.total),
                              ].join(' · ')}
                            </small>
                          </span>
                        </button>
                      </th>
                    </tr>
                    {/* The columns, named where the rows are: under the open
                        invoice, not over the whole list, which read as a
                        heading for columns the closed invoices do not have. */}
                    {open ? (
                      <tr className="rec-invoice-columns">
                        <th scope="col">{t('Ticket #')}</th>
                        <th scope="col">{t('Ticket date')}</th>
                        <th scope="col">{t('Customer · product')}</th>
                        <th scope="col">{t('Origin → destination')}</th>
                        <th scope="col" className="pf-num">
                          {t('Net tons')}
                        </th>
                        <th scope="col">{t('Invoice · truck')}</th>
                        <th scope="col" className="pf-num">
                          {t('Line total')}
                        </th>
                        <th scope="col" className="rec-wide-only">
                          {t('Status')}
                        </th>
                        <th scope="col">
                          <span className="sr-only">{t('Actions')}</span>
                        </th>
                      </tr>
                    ) : null}
                    {open ? group.records.map((record) => (
                      <tr key={record.id}>
                        <th scope="row" className="pf-name">
                          <strong>
                            {record.ticket.ticket_number ?? t('Unnumbered')}
                            <span className="rec-compact-only">
                              {recordStatus(record)}
                            </span>
                          </strong>
                          <small>
                            {record.ticket.plant_name ?? t('Unknown plant')}
                            {record.edited_at
                              ? ` · ${t('Edited {date}', { date: date(record.edited_at.slice(0, 10)) })}`
                              : ''}
                          </small>
                        </th>
                        <td className="pf-date">{date(loadDate(record))}</td>
                        <td className="rec-wrap rec-stack">
                          <span>{customerName(record)}</span>
                          <small>
                            {record.ticket.product_description ??
                              record.ticket.product_code ??
                              t('No product')}
                          </small>
                        </td>
                        <td className="rec-wrap rec-stack">
                          <span>{invoiceOrigin(record.ticket) || '—'}</span>
                          <small>
                            → {invoiceDestination(record.ticket.project_address) || '—'}
                          </small>
                        </td>
                        <td className="pf-num">{invoiceTons(record.ticket) || '—'}</td>
                        <td className="rec-stack">
                          <button
                            type="button"
                            className="rec-link"
                            onClick={() => openInvoice(record.invoice.invoice_number)}
                          >
                            {invoiceName(tr, { records: [record], invoice: record.invoice })}
                          </button>
                          <small>
                            {record.invoice.truck_number
                              ? t('Truck #{number}', { number: record.invoice.truck_number })
                              : t('No truck #')}
                          </small>
                        </td>
                        <td className="pf-num">
                          {money(lineTotal(record.ticket)) || (
                            <span className="pf-muted">{t('No rate')}</span>
                          )}
                        </td>
                        <td className="rec-wide-only">{recordStatus(record)}</td>
                        <td>{ticketActions(record)}</td>
                      </tr>
                    )) : null}
                  </tbody>
                    );
                  })}
                </table>
              </div>
              <ul className="pf-cards">
                {ticketsByInvoice.map((group) => {
                  const open = invoiceOpen(group.key);
                  return (
                <li key={group.key} className="pf-card rec-invoice-card" data-open={open || undefined}>
                  <button
                    type="button"
                    className="rec-invoice-toggle"
                    aria-expanded={open}
                    onClick={(event) => toggleInvoice(group.key, event)}
                  >
                    <ChevronDown aria-hidden="true" />
                    <span className="rec-invoice-name">
                      <strong>{invoiceHeading(tr, group)}</strong>
                      <small>
                        {[
                          dateRange(tr, group),
                          plural(group.records.length, 'ticket'),
                          group.needsRate ? t('Needs a rate') : money(group.total),
                        ].join(' · ')}
                      </small>
                    </span>
                  </button>
                  {open ? (
                  <ul className="pf-cards rec-invoice-tickets">
                {group.records.map((record) => (
                  <li key={record.id} className="pf-card">
                    <div className="pf-card-head">
                      <div>
                        <strong>
                          {record.ticket.ticket_number ?? t('Unnumbered')}
                          {recordStatus(record)}
                        </strong>
                        <small>
                          {date(loadDate(record))} · {customerName(record)}
                        </small>
                      </div>
                      {ticketActions(record)}
                    </div>
                    <dl className="rec-card-facts">
                      <div>
                        <dt>{t('Net tons')}</dt>
                        <dd>{invoiceTons(record.ticket) || '—'}</dd>
                      </div>
                      <div>
                        <dt>{t('Line total')}</dt>
                        <dd>{money(lineTotal(record.ticket)) || '—'}</dd>
                      </div>
                      <div>
                        <dt>{t('Truck #')}</dt>
                        <dd>{record.invoice.truck_number || '—'}</dd>
                      </div>
                    </dl>
                    <p className="pf-card-foot">
                      {invoiceDestination(record.ticket.project_address) || t('No destination')}
                    </p>
                  </li>
                ))}
                  </ul>
                  ) : null}
                </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>
      </div>


      <InvoiceDialog view={invoiceView} onClose={() => setInvoiceView(null)} />

      <AlertDialog
        open={toFinalize !== null}
        onOpenChange={(open) => {
          if (!open) setToFinalize(null);
        }}
      >
        <AlertDialogContent>
          {toFinalize ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('Finalize {name}?', { name: invoiceName(tr, toFinalize) })}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('Lock this invoice’s pricing? Later rate changes will not alter it.')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={() => void confirmFinalize()}>
                  {t('Finalize')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={toUnlock !== null}
        onOpenChange={(open) => {
          if (!open) setToUnlock(null);
        }}
      >
        <DialogContent>
          {toUnlock ? (
            <form className="pf-form" onSubmit={(event) => void confirmUnlock(event)}>
              <DialogHeader>
                <DialogTitle>
                  {t('Unlock {name}?', { name: invoiceName(tr, toUnlock) })}
                </DialogTitle>
                <DialogDescription>
                  {t(
                    'The invoice is priced from the rates on file again. Say why it was reopened; the reason is kept with the invoice.',
                  )}
                </DialogDescription>
              </DialogHeader>
              <label className="ld-field" htmlFor={`${fieldId}-unlock-reason`}>
                <span>{t('Reason')}</span>
                <Input
                  id={`${fieldId}-unlock-reason`}
                  required
                  maxLength={500}
                  placeholder={t('The customer corrected the fuel surcharge')}
                  value={unlockReason}
                  onChange={(event) => setUnlockReason(event.target.value)}
                />
              </label>
              <DialogFooter showCloseButton>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={!unlockReason.trim() || rates.busy.has(busyKey.invoice(toUnlock.key))}
                >
                  {t('Unlock')}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
      >
        <AlertDialogContent>
          {toDelete ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('Delete ticket {number}?', { number: ticketNumber(toDelete) })}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    'This permanently removes the saved record and its stored original for everyone in your workspace, and takes its line off invoice {number}. The invoice number can be reused once every ticket on it is deleted.',
                    { number: toDelete.invoice.invoice_number },
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => void confirmDelete()}
                >
                  {t('Delete ticket')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
