'use client';

import { useId, useState, type SyntheticEvent } from 'react';
import { MapPin, Pencil, Plus, ScanLine, StickyNote, Trash2, UserPlus, UserRound, X } from 'lucide-react';
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
  addCustomerAddress,
  customerAddresses,
  customerIdFor,
  customerLocationRates,
  deleteProfile,
  normalizeAddress,
  normalizeKey,
  normalizeName,
  saveProfile,
  summarize,
  type CustomerProfile,
  type LocationRate,
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
const fuelText = ({ t }: Translator, site: LocationRate) =>
  site.fuel_charge
    ? ` ${t('+ {amount} fuel', {
        amount: formatFuel(site.fuel_charge, site.fuel_type ?? 'flat'),
      })}`
    : '';

/**
 * What the customer is charged, in a line: the one site's rate when there is
 * one, how many sites have their own when there are several, and "per ticket"
 * when no site has a rate — a ticket is then rated as it is reviewed.
 */
function rateSummary(tr: Translator, customer: CustomerProfile): { main: string; detail: string } {
  const { t, plural } = tr;
  const sites = customerLocationRates(customer);
  if (!sites.length) return { main: '', detail: t('Per ticket') };
  if (sites.length === 1) {
    const [site] = sites;
    return {
      main: site.flat_rate === null ? t('Fuel only') : money(site.flat_rate),
      detail: `${site.flat_rate === null ? '' : t(RATE_UNITS[site.rate_type ?? 'flat'])}${fuelText(tr, site)} · ${site.address}`,
    };
  }
  return {
    main: plural(sites.length, 'site'),
    detail: t('each with its own rate'),
  };
}

/**
 * What a site is charged, as typed: blank means rated per ticket. Keyed by
 * address in the draft, because a site's rate is a property of that address
 * and goes when the address goes.
 */
type SiteRateDraft = {
  rateType: RateType;
  flatRate: string;
  fuelCharge: string;
  fuelType: FuelType;
};

const blankSiteRate = (): SiteRateDraft => ({
  rateType: 'flat',
  flatRate: '',
  fuelCharge: '',
  fuelType: 'flat',
});

type Draft = {
  id: number | null;
  name: string;
  ids: string;
  /** Names this customer's tickets are printed with. */
  names: string[];
  /** Job-site addresses, ready to pick while reviewing a scan. */
  addresses: string[];
  /** What each site is charged, by address; a site not here is rated per ticket. */
  siteRates: Record<string, SiteRateDraft>;
  notes: string;
};

const blankDraft = (): Draft => ({
  id: null,
  name: '',
  ids: '',
  names: [],
  addresses: [],
  siteRates: {},
  notes: '',
});

const draftFrom = (customer: CustomerProfile): Draft => ({
  id: customer.id,
  name: customer.name,
  ids: customer.ticket_customer_ids.join(', '),
  names: [...customer.ticket_names],
  addresses: customerAddresses(customer),
  siteRates: Object.fromEntries(
    customerLocationRates(customer).map((site) => [
      site.address,
      {
        rateType: site.rate_type ?? 'flat',
        flatRate: site.flat_rate === null ? '' : String(site.flat_rate),
        fuelCharge: site.fuel_charge === null ? '' : String(site.fuel_charge),
        fuelType: site.fuel_type ?? 'flat',
      },
    ]),
  ),
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
  // The job-site address being typed into this customer's list.
  const [addressDraft, setAddressDraft] = useState('');
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

  /**
   * Destinations on this customer's own saved tickets that its profile does
   * not list yet. They were read off paperwork already, so adding one is both
   * quicker and truer to the ticket than typing the address out again.
   */
  const seenAddresses = (() => {
    if (draft?.id == null) return [];
    const known = new Set(draft.addresses.map(normalizeName));
    const found = new Map<string, string>();
    for (const record of byCustomer.get(draft.id) ?? []) {
      const address = normalizeAddress(record.ticket.project_address ?? '');
      const key = normalizeName(address);
      if (!address || known.has(key) || found.has(key)) continue;
      found.set(key, address);
    }
    return [...found.values()];
  })();

  const edit = (next: Draft) => {
    setFormError(null);
    setAliasDraft('');
    setAddressDraft('');
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
    if (!name) {
      setFormError(t('Enter the customer name.'));
      return;
    }
    // Each site's figures, read the same way; a site with nothing typed for it
    // is charged at the customer's rate and is not kept.
    const locationRates: LocationRate[] = [];
    for (const address of draft.addresses) {
      const site = draft.siteRates[address];
      if (!site) continue;
      const siteRate = parseAmount(site.flatRate);
      const siteFuel = parseAmount(site.fuelCharge);
      if (siteRate === 'invalid' || siteFuel === 'invalid') {
        setFormError(
          t('The rate at {address} must be blank, zero or a positive amount.', { address }),
        );
        return;
      }
      if (siteRate === null && siteFuel === null) continue;
      locationRates.push({
        address,
        flat_rate: siteRate,
        rate_type: site.rateType,
        fuel_charge: siteFuel,
        fuel_type: site.fuelType,
      });
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
        addresses: draft.addresses,
        location_rates: locationRates,
        // Rates are the job sites'. A customer of its own has none: a ticket to
        // a site with no rate, or to no known site, is rated on the ticket.
        flat_rate: null,
        rate_type: 'flat',
        fuel_charge: null,
        fuel_type: 'flat',
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
      description: locationRates.length
        ? t('Tickets to {sites} get that site’s rate on the invoice.', {
            sites: plural(locationRates.length, 'site'),
          })
        : t('Tickets for this customer are rated one by one.'),
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

  /** Keeps a job-site address, ignoring one already on the list. */
  const addAddress = () => {
    const value = normalizeAddress(addressDraft);
    setAddressDraft('');
    if (!value || !draft) return;
    setDraftField({ addresses: addCustomerAddress({ addresses: draft.addresses }, value) });
  };
  const removeAddress = (value: string) => {
    // The site's rate is a property of the address, and goes with it.
    const { [value]: _gone, ...siteRates } = draft?.siteRates ?? {};
    setDraftField({
      addresses: draft?.addresses.filter((address) => address !== value) ?? [],
      siteRates,
    });
  };

  /** Opens the figures for a site, or changes one of them. */
  const setSiteRate = (address: string, patch: Partial<SiteRateDraft>) =>
    setDraftField({
      siteRates: {
        ...draft?.siteRates,
        [address]: { ...(draft?.siteRates[address] ?? blankSiteRate()), ...patch },
      },
    });


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
        <dl className="ld-stats pf-stats">
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

      {/* Everything below the band rides in one sheet, as on every page. On a
          phone it is the panel that slides up over the band; on a wider screen
          it is display:contents and lays out as if it were not here. */}
      <div className="page-sheet">

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
                        {(() => {
                          const { main, detail } = rateSummary(tr, customer);
                          return main ? (
                            <>
                              <strong>{main}</strong>
                              <small className="ui-literal">{detail}</small>
                            </>
                          ) : (
                            <span className="pf-muted">{detail}</span>
                          );
                        })()}
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
                      <small className="ui-literal">
                        {(() => {
                          const { main, detail } = rateSummary(tr, customer);
                          return main ? `${main} ${detail}` : t('Rate per ticket');
                        })()}
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
                  <MapPin aria-hidden="true" />
                  {t('Job sites & rates')}
                </p>
                <div className="ld-field" data-span={2}>
                  <span id={`${fieldId}-addresses-label`}>
                    {t('Delivery addresses, each with what is charged there')}
                  </span>
                  {draft.addresses.length ? (
                    <ul className="pf-sites">
                      {draft.addresses.map((address) => {
                        // Every site carries its own figures; a customer is
                        // hauled to several places at several prices, and the
                        // rate is the site's. Blank means rated per ticket.
                        const site = draft.siteRates[address] ?? blankSiteRate();
                        const siteId = `${fieldId}-site-${normalizeKey(address)}`;
                        return (
                          <li key={address} className="pf-site">
                            <div className="pf-site-head">
                              <span className="pf-alias">
                                <span className="ui-literal">{address}</span>
                                <button
                                  type="button"
                                  aria-label={t('Remove {name}', { name: address })}
                                  onClick={() => removeAddress(address)}
                                >
                                  <X aria-hidden="true" />
                                </button>
                              </span>
                            </div>
                            {(
                              <fieldset
                                className="pf-site-rate"
                                aria-label={t('Rate at {address}', { address })}
                              >
                                <SelectField
                                  id={`${siteId}-rate-type`}
                                  aria-label={t('Rate type')}
                                  value={site.rateType}
                                  onValueChange={(value) =>
                                    setSiteRate(address, {
                                      rateType: isRateType(value) ? value : 'flat',
                                    })
                                  }
                                  options={RATE_TYPES.map((type) => ({
                                    value: type,
                                    label: t(RATE_TYPE_LABELS[type]),
                                  }))}
                                />
                                <Input
                                  id={`${siteId}-rate`}
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  aria-label={t('Rate {unit}', { unit: rateUnit(site.rateType) })}
                                  placeholder={t('Rate')}
                                  value={site.flatRate}
                                  onChange={(event) =>
                                    setSiteRate(address, { flatRate: event.target.value })
                                  }
                                />
                                <SelectField
                                  id={`${siteId}-fuel-type`}
                                  aria-label={t('Fuel charge type')}
                                  value={site.fuelType}
                                  onValueChange={(value) =>
                                    setSiteRate(address, {
                                      fuelType: isFuelType(value) ? value : 'flat',
                                    })
                                  }
                                  options={FUEL_TYPES.map((type) => ({
                                    value: type,
                                    label: t(FUEL_TYPE_LABELS[type]),
                                  }))}
                                />
                                <Input
                                  id={`${siteId}-fuel`}
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  aria-label={
                                    site.fuelType === 'percent'
                                      ? t('Fuel charge (% of rate)')
                                      : t('Fuel charge per load ($)')
                                  }
                                  placeholder={t('Charge')}
                                  value={site.fuelCharge}
                                  onChange={(event) =>
                                    setSiteRate(address, { fuelCharge: event.target.value })
                                  }
                                />
                              </fieldset>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="pf-alias-empty">{t('No addresses yet.')}</p>
                  )}
                  <div className="pf-alias-add">
                    <label className="sr-only" htmlFor={`${fieldId}-addresses`}>
                      {t('Add a delivery address')}
                    </label>
                    <Input
                      id={`${fieldId}-addresses`}
                      aria-describedby={`${fieldId}-addresses-hint`}
                      placeholder={t('Street, city, state')}
                      value={addressDraft}
                      onChange={(event) => setAddressDraft(event.target.value)}
                      onKeyDown={(event) => {
                        // Enter adds the address instead of saving the customer.
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addAddress();
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={addAddress}>
                      <Plus data-icon="inline-start" />
                      {t('Add')}
                    </Button>
                  </div>
                  {/* Addresses this customer's saved tickets were delivered to.
                      Adding one from here is quicker, and more faithful to the
                      paperwork, than typing it out again. */}
                  {seenAddresses.length ? (
                    <div className="pf-seen">
                      <span>{t('Seen on this customer’s tickets')}</span>
                      <ul>
                        {seenAddresses.map((address) => (
                          <li key={address}>
                            <Button
                              type="button"
                              variant="secondary"
                              size="xs"
                              onClick={() =>
                                setDraftField({
                                  addresses: addCustomerAddress(
                                    { addresses: draft.addresses },
                                    address,
                                  ),
                                })
                              }
                            >
                              <Plus data-icon="inline-start" />
                              <span className="ui-literal">{address}</span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <small id={`${fieldId}-addresses-hint`} className="ld-field-hint">
                    {t(
                      'Pick one of these in review instead of reading the destination off a scan that is cut off or smudged.',
                    )}
                  </small>
                </div>
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
