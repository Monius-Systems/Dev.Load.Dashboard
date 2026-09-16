'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import {
  Download,
  FileSearch,
  Pencil,
  ReceiptText,
  Search,
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
  recordMatches,
  ticketStatus,
  type InvoiceGroup,
} from '@/lib/load-desk/records';
import {
  deleteSavedRecord,
  openStoredOriginal,
} from '@/lib/load-desk/storage';
import type { SavedRecord } from '@/lib/load-desk/types';

type Tab = 'invoices' | 'tickets';

const STATUS_OPTIONS: Record<Tab, [string, string][]> = {
  invoices: [
    ['all', 'All invoices'],
    ['draft', 'Draft (rate missing)'],
    ['rated', 'Rated'],
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

export default function RecordsPage() {
  const { records, ready, error: storeError } = useRecords();
  const { customers, trucks } = useProfiles();
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
  const [invoiceView, setInvoiceView] = useState<InvoiceView | null>(null);
  const [toDelete, setToDelete] = useState<SavedRecord | null>(null);

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
  // An invoice shows when any of its tickets match; its totals stay whole.
  const shownInvoices = groups
    .filter((group) => group.records.some(passes))
    .filter(
      (group) =>
        status === 'all' || (status === 'draft' ? group.needsRate : !group.needsRate),
    );
  const shownTickets = records
    .filter(passes)
    .filter((record) => status === 'all' || ticketStatus(record) === status)
    .sort((a, b) => loadDate(b).localeCompare(loadDate(a)) || b.id - a.id);

  const billed = groups.reduce((sum, group) => sum + group.total, 0);
  const drafts = groups.filter((group) => group.needsRate).length;
  const filtersActive = Boolean(
    query || from || to || customerFilter || truckFilter || status !== 'all',
  );

  function chooseTab(next: Tab) {
    setTab(next);
    setStatus('all');
  }

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

  const invoiceActions = (group: InvoiceGroup) => (
    <div className="pf-actions">
      <Link
        href={`/load-desk?edit=${group.records[0].id}`}
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
    </div>
  );

  const ticketActions = (record: SavedRecord) => (
    <div className="pf-actions">
      <Link
        href={`/load-desk?edit=${record.id}`}
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

  const invoiceStatus = (group: InvoiceGroup) => (
    <span className="ld-chip" data-tone={group.needsRate ? 'warning' : 'good'}>
      {group.needsRate ? t('Draft') : t('Rated')}
    </span>
  );

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
          <div className="rec-filters">
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
                          {group.invoice.invoice_number}
                        </button>
                        <small>{dateRange(tr, group)}</small>
                      </th>
                      <td className="pf-date">
                        {date(group.invoice.invoice_date)}
                      </td>
                      <td className="rec-wrap rec-wide-only">
                        {group.invoice.bill_to.name}
                      </td>
                      <td className="rec-wrap">
                        {[...new Set(group.records.map(customerName))].join(', ')}
                      </td>
                      <td>{group.invoice.truck_number || '—'}</td>
                      <td className="pf-num">{group.records.length}</td>
                      <td className="pf-num">{group.tons.toFixed(2)}</td>
                      <td className="pf-num">{invoiceTotal(group)}</td>
                      <td>{invoiceStatus(group)}</td>
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
                        {group.invoice.invoice_number}
                        {invoiceStatus(group)}
                      </strong>
                      <small>
                        {date(group.invoice.invoice_date)} ·{' '}
                        {group.invoice.bill_to.name}
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
                  <p className="pf-card-foot">
                    {[...new Set(group.records.map(customerName))].join(', ')}
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
                <thead>
                  <tr>
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
                </thead>
                <tbody>
                  {shownTickets.map((record) => (
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
                          {record.invoice.invoice_number}
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
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="pf-cards">
              {shownTickets.map((record) => (
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
                    {t('Invoice {number}', { number: record.invoice.invoice_number })} ·{' '}
                    {invoiceDestination(record.ticket.project_address) || t('No destination')}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <InvoiceDialog view={invoiceView} onClose={() => setInvoiceView(null)} />

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
