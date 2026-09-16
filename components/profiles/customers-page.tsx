'use client';

import { useId, useState, type SyntheticEvent } from 'react';
import { Coins, Pencil, Plus, ScanLine, StickyNote, Trash2, UserPlus, UserRound, X } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
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
import ClientsSection from '@/components/profiles/clients-section';
import CustomerLoadsChart from '@/components/profiles/customer-loads-chart';
import {
  listFrom,
  parseAmount,
  PeriodCells,
  PeriodHeaders,
  RequiredMark,
  useProfiles,
  useRecords,
} from '@/components/profiles/profile-ui';
import type { Translator } from '@/lib/i18n/translate';
import { useT } from '@/lib/i18n/use-t';
import {
  formatFuel,
  FUEL_TYPE_LABELS,
  money,
  RATE_TYPE_LABELS,
  RATE_UNITS,
} from '@/lib/load-desk/format';
import {
  customerIdFor,
  deleteProfile,
  normalizeKey,
  normalizeName,
  saveProfile,
  summarize,
  type CustomerProfile,
} from '@/lib/load-desk/profiles';
import {
  FUEL_TYPES,
  isFuelType,
  isRateType,
  RATE_TYPES,
  type FuelType,
  type RateType,
  type SavedRecord,
} from '@/lib/load-desk/types';

/** " + $20.00 fuel" or " + 15% fuel"; empty without a fuel charge. */
const fuelText = ({ t }: Translator, customer: CustomerProfile) =>
  customer.fuel_charge
    ? ` ${t('+ {amount} fuel', {
        amount: formatFuel(customer.fuel_charge, customer.fuel_type ?? 'flat'),
      })}`
    : '';

type Draft = {
  id: number | null;
  name: string;
  ids: string;
  /** Names this customer's tickets are printed with. */
  names: string[];
  rateType: RateType;
  flatRate: string;
  fuelCharge: string;
  fuelType: FuelType;
  notes: string;
};

const blankDraft = (): Draft => ({
  id: null,
  name: '',
  ids: '',
  names: [],
  rateType: 'flat',
  flatRate: '',
  fuelCharge: '',
  fuelType: 'flat',
  notes: '',
});

const draftFrom = (customer: CustomerProfile): Draft => ({
  id: customer.id,
  name: customer.name,
  ids: customer.ticket_customer_ids.join(', '),
  names: [...customer.ticket_names],
  rateType: customer.rate_type ?? 'flat',
  flatRate: customer.flat_rate === null ? '' : String(customer.flat_rate),
  fuelCharge: customer.fuel_charge === null ? '' : String(customer.fuel_charge),
  fuelType: customer.fuel_type ?? 'flat',
  notes: customer.notes,
});

function matchDescription({ t, plural }: Translator, customer: CustomerProfile) {
  const parts = [];
  if (customer.ticket_customer_ids.length) {
    parts.push(t('Customer no. {number}', { number: customer.ticket_customer_ids.join(', ') }));
  }
  if (customer.ticket_names.length) {
    parts.push(plural(customer.ticket_names.length, 'ticket name'));
  }
  return parts.length ? parts.join(' · ') : t('Matches by profile name');
}

export default function CustomersPage() {
  const { records, ready: recordsReady } = useRecords();
  const profiles = useProfiles();
  const { customers } = profiles;
  const tr = useT();
  const { t, plural, date } = tr;
  const [now] = useState(() => new Date());
  const [draft, setDraft] = useState<Draft | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<CustomerProfile | null>(null);
  const [saving, setSaving] = useState(false);
  // The printed name being typed into the list of names on tickets.
  const [aliasDraft, setAliasDraft] = useState('');
  const fieldId = useId();
  const rateUnit = (type: RateType | null | undefined) => t(RATE_UNITS[type ?? 'flat']);

  const byCustomer = new Map<number | null, SavedRecord[]>();
  for (const record of records) {
    const id = customerIdFor(record, customers);
    byCustomer.set(id, [...(byCustomer.get(id) ?? []), record]);
  }
  const unassigned = byCustomer.get(null) ?? [];
  const all = summarize(records, now);
  const rows = [...customers]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((customer) => ({
      customer,
      summary: summarize(byCustomer.get(customer.id) ?? [], now),
    }));

  const suggestionGroups = new Map<
    string,
    { name: string; id: string; count: number }
  >();
  for (const record of unassigned) {
    const name = record.ticket.customer_name?.trim() ?? '';
    const id = record.ticket.customer_id?.trim() ?? '';
    if (!name && !id) continue;
    const key = id ? normalizeKey(id) : normalizeName(name);
    const group = suggestionGroups.get(key) ?? { name, id, count: 0 };
    group.count += 1;
    suggestionGroups.set(key, group);
  }
  const suggestions = [...suggestionGroups.values()].sort(
    (a, b) => b.count - a.count,
  );

  const edit = (next: Draft) => {
    setFormError(null);
    setAliasDraft('');
    setDraft(next);
  };

  async function save(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || saving) return;
    if (profiles.error) {
      setFormError(profiles.error);
      return;
    }
    const name = draft.name.trim();
    const flatRate = parseAmount(draft.flatRate);
    const fuelCharge = parseAmount(draft.fuelCharge);
    if (!name) {
      setFormError(t('Enter the customer name.'));
      return;
    }
    if (flatRate === 'invalid' || fuelCharge === 'invalid') {
      setFormError(t('Rates must be blank, zero or a positive amount.'));
      return;
    }
    const ids = listFrom(draft.ids);
    const clash = customers.find(
      (customer) =>
        customer.id !== draft.id &&
        customer.ticket_customer_ids.some((value) =>
          ids.some((id) => normalizeKey(id) === normalizeKey(value)),
        ),
    );
    if (clash) {
      setFormError(
        t(
          'A customer number here already belongs to {name}. Each number can match one customer.',
          { name: clash.name },
        ),
      );
      return;
    }
    const existing = customers.find((customer) => customer.id === draft.id);
    setSaving(true);
    const error = await saveProfile(
      'customer',
      {
        name,
        ticket_customer_ids: ids,
        ticket_names: draft.names,
        flat_rate: flatRate,
        rate_type: draft.rateType,
        fuel_charge: fuelCharge,
        fuel_type: draft.fuelType,
        notes: draft.notes.trim(),
        created_at: existing?.created_at ?? new Date().toISOString(),
      },
      existing?.id ?? null,
    );
    setSaving(false);
    if (error) {
      setFormError(error);
      return;
    }
    setDraft(null);
    toast.add({
      title: existing ? t('Updated {name}', { name }) : t('Added {name}', { name }),
      description:
        flatRate === null
          ? t('Tickets for this customer are rated one by one.')
          : t('Matching tickets get {rate} {unit} on the invoice.', {
              rate: money(flatRate),
              unit: rateUnit(draft.rateType),
            }),
      type: 'success',
    });
  }

  async function confirmDelete() {
    if (!toDelete) return;
    const error = await deleteProfile('customer', toDelete.id);
    if (error) {
      toast.add({ title: t('Delete failed'), description: t(error), type: 'error' });
      return;
    }
    toast.add({ title: t('Deleted {name}', { name: toDelete.name }), type: 'success' });
    setToDelete(null);
  }

  const setDraftField = (patch: Partial<Draft>) =>
    setDraft((current) => (current ? { ...current, ...patch } : current));

  /** Keeps a printed name, ignoring one that is already on the list. */
  const addAlias = () => {
    const value = aliasDraft.replace(/\s+/g, ' ').trim();
    setAliasDraft('');
    if (!value || !draft) return;
    const known = draft.names.some((name) => normalizeName(name) === normalizeName(value));
    if (!known) setDraftField({ names: [...draft.names, value] });
  };
  const removeAlias = (value: string) =>
    setDraftField({ names: draft?.names.filter((name) => name !== value) ?? [] });

  const rowActions = (customer: CustomerProfile) => (
    <div className="pf-actions">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t('Edit {name}', { name: customer.name })}
        onClick={() => edit(draftFrom(customer))}
      >
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="ld-danger"
        aria-label={t('Delete {name}', { name: customer.name })}
        onClick={() => setToDelete(customer)}
      >
        <Trash2 />
      </Button>
    </div>
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t('CUSTOMERS & CLIENTS')}</p>
          <h1>{t('Customers & Clients')}</h1>
          <p className="muted">
            {t(
              'Loads hauled for each customer and the rates filled in when a ticket matches, plus the clients you bill.',
            )}
          </p>
        </div>
        <dl className="ld-stats">
          <div>
            <dt>{t('Customers')}</dt>
            <dd>{customers.length}</dd>
          </div>
          <div>
            <dt>{t('Clients')}</dt>
            <dd>{profiles.clients.length}</dd>
          </div>
          <div>
            <dt>{t('Loads this month')}</dt>
            <dd>{all.periods.month.loads}</dd>
          </div>
          <div>
            <dt>{t('Without a profile')}</dt>
            <dd>{unassigned.length}</dd>
          </div>
        </dl>
      </div>

      {profiles.error ? (
        <div className="ld-notice pf-notice" data-tone="warning">
          {t(profiles.error)}
        </div>
      ) : null}

      {/* Customers and clients side by side on wide screens. */}
      <div className="pf-pair">
      <div className="pf-column">
      <section className="ld-panel pf-section" aria-labelledby="pf-customers-title">
        <div className="ld-panel-head">
          <div>
            <p className="ld-step">{t('Loads by customer')}</p>
            <h2 id="pf-customers-title">{t('Customer Profiles')}</h2>
          </div>
          <Button onClick={() => edit(blankDraft())}>
            <Plus />
            {t('Add customer')}
          </Button>
        </div>
        {!profiles.ready || !recordsReady ? (
          <p className="ld-empty">{t('Loading customers…')}</p>
        ) : rows.length === 0 ? (
          <p className="ld-empty">
            {t(
              'No customers yet. Add one, or create a profile from a customer found on saved tickets.',
            )}
          </p>
        ) : (
          <>
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th scope="col">{t('Customer')}</th>
                  <th scope="col">{t('Rate')}</th>
                  <PeriodHeaders />
                  <th scope="col" className="pf-num">
                    {t('Billed')}
                  </th>
                  <th scope="col">{t('Last load')}</th>
                  <th scope="col">
                    <span className="sr-only">{t('Actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ customer, summary }) => (
                  <tr key={customer.id}>
                    <th scope="row" className="pf-name">
                      <strong>{customer.name}</strong>
                      <small>{matchDescription(tr, customer)}</small>
                    </th>
                    <td className="pf-rate">
                      {customer.flat_rate === null ? (
                        <span className="pf-muted">{t('Per ticket')}</span>
                      ) : (
                        <>
                          <strong>{money(customer.flat_rate)}</strong>
                          <small>
                            {rateUnit(customer.rate_type)}
                            {fuelText(tr, customer)}
                          </small>
                        </>
                      )}
                    </td>
                    <PeriodCells summary={summary} />
                    <td className="pf-num">{money(summary.billed)}</td>
                    <td className="pf-date">
                      {summary.lastLoad ? date(summary.lastLoad) : '—'}
                    </td>
                    <td>{rowActions(customer)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="pf-cards">
            {rows.map(({ customer, summary }) => (
              <li key={customer.id} className="pf-card">
                <div className="pf-card-head">
                  <div>
                    <strong>{customer.name}</strong>
                    <small>
                      {customer.flat_rate === null
                        ? t('Rate per ticket')
                        : `${money(customer.flat_rate)} ${rateUnit(customer.rate_type)}${fuelText(tr, customer)}`}
                    </small>
                  </div>
                  {rowActions(customer)}
                </div>
                <CustomerLoadsChart
                  name={customer.name}
                  records={byCustomer.get(customer.id) ?? []}
                  now={now}
                />
                <p className="pf-card-foot">
                  {t('Billed {amount} · Last load {date}', {
                    amount: money(summary.billed),
                    date: summary.lastLoad ? date(summary.lastLoad) : '—',
                  })}
                </p>
              </li>
            ))}
          </ul>
          </>
        )}
      </section>

      {suggestions.length ? (
        <section className="ld-panel pf-section" aria-labelledby="pf-unmatched-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('From saved tickets')}</p>
              <h2 id="pf-unmatched-title">{t('Customers Without a Profile')}</h2>
            </div>
            <span className="ld-hint">
              {t('{loads} not counted under a customer', {
                loads: plural(unassigned.length, 'load'),
              })}
            </span>
          </div>
          <ul className="pf-suggestions">
            {suggestions.map((suggestion) => (
              <li key={`${suggestion.id}|${suggestion.name}`}>
                <div>
                  <strong>
                    {suggestion.name || t('Customer {number}', { number: suggestion.id })}
                  </strong>
                  <small>
                    {suggestion.id
                      ? `${t('Customer no. {number}', { number: suggestion.id })} · `
                      : ''}
                    {plural(suggestion.count, 'load')}
                  </small>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    edit({
                      ...blankDraft(),
                      name: suggestion.name,
                      ids: suggestion.id,
                      names: suggestion.name ? [suggestion.name] : [],
                    })
                  }
                >
                  <UserPlus />
                  {t('Create profile')}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      </div>

      <ClientsSection records={records} ready={recordsReady} />
      </div>

      <Dialog
        open={draft !== null}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          {draft ? (
            <form className="pf-form" onSubmit={(event) => void save(event)}>
              <DialogHeader>
                <DialogTitle>{draft.id ? t('Edit customer') : t('Add customer')}</DialogTitle>
                <DialogDescription>
                  {t(
                    'When a ticket’s customer number or name matches, Load Desk selects this customer and fills in its rate on the invoice.',
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="ld-fields pf-fields">
                <p className="pf-group-title">
                  <UserRound aria-hidden="true" />
                  {t('Customer')}
                </p>
                <label
                  className="ld-field"
                  data-span={2}
                  htmlFor={`${fieldId}-name`}
                >
                  <span>
                    {t('Customer name')}
                    <RequiredMark />
                  </span>
                  <Input
                    id={`${fieldId}-name`}
                    required
                    value={draft.name}
                    onChange={(event) => setDraftField({ name: event.target.value })}
                  />
                </label>
                <p className="pf-group-title">
                  <ScanLine aria-hidden="true" />
                  {t('Matching tickets')}
                </p>
                <div className="ld-field" data-span={2}>
                  <label htmlFor={`${fieldId}-ids`}>
                    {t('Customer numbers on tickets')}
                  </label>
                  <Input
                    id={`${fieldId}-ids`}
                    aria-describedby={`${fieldId}-ids-hint`}
                    placeholder={t('Customer number')}
                    value={draft.ids}
                    onChange={(event) => setDraftField({ ids: event.target.value })}
                  />
                  <small id={`${fieldId}-ids-hint`} className="ld-field-hint">
                    {t(
                      'The number printed after “Customer:”. Separate several with commas.',
                    )}
                  </small>
                </div>
                <div className="ld-field" data-span={2}>
                  <span id={`${fieldId}-names-label`}>{t('Names printed on tickets')}</span>
                  {draft.names.length ? (
                    <ul className="pf-aliases">
                      {draft.names.map((printed) => (
                        <li key={printed} className="pf-alias">
                          <span className="ui-literal">{printed}</span>
                          <button
                            type="button"
                            aria-label={t('Remove {name}', { name: printed })}
                            onClick={() => removeAlias(printed)}
                          >
                            <X aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="pf-alias-empty">{t('No printed names yet.')}</p>
                  )}
                  <div className="pf-alias-add">
                    <label className="sr-only" htmlFor={`${fieldId}-names`}>
                      {t('Add a name printed on tickets')}
                    </label>
                    <Input
                      id={`${fieldId}-names`}
                      aria-describedby={`${fieldId}-names-hint`}
                      placeholder={t('Name as printed on the ticket')}
                      value={aliasDraft}
                      onChange={(event) => setAliasDraft(event.target.value)}
                      onKeyDown={(event) => {
                        // Enter adds the name instead of saving the customer.
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addAlias();
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={addAlias}>
                      <Plus data-icon="inline-start" />
                      {t('Add')}
                    </Button>
                  </div>
                  <small id={`${fieldId}-names-hint`} className="ld-field-hint">
                    {t(
                      'A ticket matches when its customer name contains one of these or the profile name. A name a letter or two off still matches, so a printer dropping or adding a character is fine.',
                    )}
                  </small>
                </div>
                <p className="pf-group-title">
                  <Coins aria-hidden="true" />
                  {t('Rate')}
                </p>
                {/* Rate type sits in front of the rate it applies to, same width. */}
                <div className="ld-field">
                  <label htmlFor={`${fieldId}-rate-type`}>{t('Rate type')}</label>
                  <SelectField
                    id={`${fieldId}-rate-type`}
                    aria-describedby={`${fieldId}-rate-type-hint`}
                    value={draft.rateType}
                    onValueChange={(value) =>
                      setDraftField({ rateType: isRateType(value) ? value : 'flat' })
                    }
                    options={RATE_TYPES.map((type) => ({
                      value: type,
                      label: t(RATE_TYPE_LABELS[type]),
                    }))}
                  />
                  <small id={`${fieldId}-rate-type-hint`} className="ld-field-hint">
                    {draft.rateType === 'per_ton'
                      ? t('The rate is multiplied by each ticket’s net tons.')
                      : draft.rateType === 'hourly'
                        ? t('The rate is multiplied by the hours entered on each ticket.')
                        : t('The rate is charged once per load.')}
                  </small>
                </div>
                <label className="ld-field" htmlFor={`${fieldId}-rate`}>
                  <span>{t('Rate {unit}', { unit: rateUnit(draft.rateType) })}</span>
                  <Input
                    id={`${fieldId}-rate`}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder={t('None')}
                    value={draft.flatRate}
                    onChange={(event) =>
                      setDraftField({ flatRate: event.target.value })
                    }
                  />
                </label>
                <div className="ld-field">
                  <label htmlFor={`${fieldId}-fuel-type`}>{t('Fuel charge type')}</label>
                  <SelectField
                    id={`${fieldId}-fuel-type`}
                    value={draft.fuelType}
                    onValueChange={(value) =>
                      setDraftField({ fuelType: isFuelType(value) ? value : 'flat' })
                    }
                    options={FUEL_TYPES.map((type) => ({
                      value: type,
                      label: t(FUEL_TYPE_LABELS[type]),
                    }))}
                  />
                </div>
                <label className="ld-field" htmlFor={`${fieldId}-fuel`}>
                  <span>
                    {draft.fuelType === 'percent'
                      ? t('Fuel charge (% of rate)')
                      : t('Fuel charge per load ($)')}
                  </span>
                  <Input
                    id={`${fieldId}-fuel`}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder={t('None')}
                    value={draft.fuelCharge}
                    onChange={(event) =>
                      setDraftField({ fuelCharge: event.target.value })
                    }
                  />
                </label>
                <p className="pf-group-title">
                  <StickyNote aria-hidden="true" />
                  {t('Notes')}
                </p>
                <label className="ld-field" data-span={2}>
                  <span className="sr-only">{t('Notes')}</span>
                  <textarea
                    className="pf-textarea"
                    rows={2}
                    value={draft.notes}
                    onChange={(event) => setDraftField({ notes: event.target.value })}
                  />
                </label>
              </div>
              {formError ? (
                <p className="ld-status" data-tone="error" role="alert">
                  {t(formError)}
                </p>
              ) : null}
              <DialogFooter showCloseButton>
                <Button type="submit" disabled={saving}>
                  {saving ? t('Saving…') : draft.id ? t('Save changes') : t('Add customer')}
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
                <AlertDialogTitle>{t('Delete {name}?', { name: toDelete.name })}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    'Saved tickets and their invoices are kept. They stop counting under this customer, and new tickets no longer get its rate.',
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => void confirmDelete()}
                >
                  {t('Delete customer')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
