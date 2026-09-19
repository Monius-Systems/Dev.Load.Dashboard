'use client';

import { useId, useState, type SyntheticEvent } from 'react';
import { Pencil, Plus, Route, Trash2, Truck } from 'lucide-react';
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
import { toast } from '@/components/ui/toast';
import {
  PeriodCells,
  PeriodGrid,
  PeriodHeaders,
  RequiredMark,
  useProfiles,
  useRecords,
} from '@/components/profiles/profile-ui';
import { useT } from '@/lib/i18n/use-t';
import { sellerDisplayName } from '@/lib/load-desk/business';
import { DEFAULT_TRUCK_IFTA, truckIfta } from '@/lib/load-desk/mileage';
import {
  deleteProfile,
  normalizeKey,
  saveProfile,
  summarize,
  truckIdFor,
  type TruckIfta,
  type TruckProfile,
} from '@/lib/load-desk/profiles';
import type { SavedRecord } from '@/lib/load-desk/types';

type Draft = {
  id: number | null;
  truckNumber: string;
  nickname: string;
  driver: string;
  licensePlate: string;
  notes: string;
  active: boolean;
  /** Mileage & routing, as typed; checked and converted on save. */
  yardAddress: string;
  mpg: string;
  heightFt: string;
  widthFt: string;
  lengthFt: string;
  grossLb: string;
  axleLb: string;
  axles: string;
  commercial: boolean;
};

const iftaFields = (ifta: TruckIfta) => ({
  yardAddress: ifta.yard_address,
  mpg: ifta.mpg === null ? '' : String(ifta.mpg),
  heightFt: String(ifta.height_ft),
  widthFt: String(ifta.width_ft),
  lengthFt: String(ifta.length_ft),
  grossLb: String(ifta.gross_weight_lb),
  axleLb: String(ifta.axle_weight_lb),
  axles: String(ifta.axles),
  commercial: ifta.commercial,
});

/**
 * A new truck starts with the defaults and, since a fleet usually shares one
 * yard, the yard of the last truck that has one.
 */
const blankDraft = (truckNumber = '', trucks: TruckProfile[] = []): Draft => ({
  id: null,
  truckNumber,
  nickname: '',
  driver: '',
  licensePlate: '',
  notes: '',
  active: true,
  ...iftaFields({
    ...DEFAULT_TRUCK_IFTA,
    yard_address: [...trucks].reverse().find((truck) => truck.ifta?.yard_address)?.ifta?.yard_address ?? '',
  }),
});

const draftFrom = (truck: TruckProfile): Draft => ({
  id: truck.id,
  truckNumber: truck.truck_number,
  nickname: truck.nickname,
  driver: truck.driver,
  licensePlate: truck.license_plate,
  notes: truck.notes,
  active: truck.active,
  ...iftaFields(truckIfta(truck)),
});

/** The bounds parseTruckIfta enforces, so the form can say which field is off. */
const IFTA_BOUNDS: [keyof Draft, string, number, number][] = [
  ['heightFt', 'Height', 6, 15],
  ['widthFt', 'Width', 5, 10],
  ['lengthFt', 'Length', 10, 100],
  ['grossLb', 'Gross weight', 5_000, 200_000],
  ['axleLb', 'Axle weight', 2_000, 60_000],
  ['axles', 'Axles', 2, 12],
];

/** The draft's mileage settings as a profile block, or the field that is wrong. */
function iftaFromDraft(draft: Draft): { value: TruckIfta } | { error: string } {
  const number = (value: string) => Number(value.trim());
  const mpg = draft.mpg.trim() === '' ? null : number(draft.mpg);
  if (mpg !== null && !(Number.isFinite(mpg) && mpg >= 1 && mpg <= 30)) {
    return { error: 'Average MPG must be between 1 and 30, or left empty.' };
  }
  for (const [field, label, min, max] of IFTA_BOUNDS) {
    const value = number(draft[field] as string);
    if (!(Number.isFinite(value) && value >= min && value <= max)) {
      return { error: `${label} must be between ${min.toLocaleString('en-US')} and ${max.toLocaleString('en-US')}.` };
    }
  }
  const axles = number(draft.axles);
  if (!Number.isInteger(axles)) return { error: 'Axles must be a whole number.' };
  return {
    value: {
      yard_address: draft.yardAddress.replace(/\s+/g, ' ').trim(),
      mpg,
      height_ft: number(draft.heightFt),
      width_ft: number(draft.widthFt),
      length_ft: number(draft.lengthFt),
      gross_weight_lb: number(draft.grossLb),
      axle_weight_lb: number(draft.axleLb),
      axles,
      commercial: draft.commercial,
    },
  };
}


export default function FleetPage() {
  const { records, ready: recordsReady } = useRecords();
  const profiles = useProfiles();
  const { t, plural, date } = useT();
  const sellerName = sellerDisplayName(profiles.company) || t('your company');
  const { trucks } = profiles;
  const [now] = useState(() => new Date());
  const [draft, setDraft] = useState<Draft | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<TruckProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const fieldId = useId();

  const byTruck = new Map<number | null, SavedRecord[]>();
  for (const record of records) {
    const id = truckIdFor(record, trucks);
    byTruck.set(id, [...(byTruck.get(id) ?? []), record]);
  }
  const unassigned = byTruck.get(null) ?? [];
  const all = summarize(records, now);
  const rows = [...trucks]
    .sort(
      (a, b) =>
        Number(b.active) - Number(a.active) ||
        a.truck_number.localeCompare(b.truck_number, undefined, { numeric: true }),
    )
    .map((truck) => ({
      truck,
      summary: summarize(byTruck.get(truck.id) ?? [], now),
    }));

  const suggestionGroups = new Map<string, { number: string; count: number }>();
  for (const record of unassigned) {
    const number = record.invoice.truck_number.trim();
    if (!number) continue;
    const key = normalizeKey(number);
    const group = suggestionGroups.get(key) ?? { number, count: 0 };
    group.count += 1;
    suggestionGroups.set(key, group);
  }
  const suggestions = [...suggestionGroups.values()].sort(
    (a, b) => b.count - a.count,
  );

  const edit = (next: Draft) => {
    setFormError(null);
    setDraft(next);
  };
  const setDraftField = (patch: Partial<Draft>) =>
    setDraft((current) => (current ? { ...current, ...patch } : current));

  async function save(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || saving) return;
    if (profiles.error) {
      setFormError(profiles.error);
      return;
    }
    const truckNumber = draft.truckNumber.trim();
    if (!truckNumber) {
      setFormError(t('Enter the truck number printed on invoices.'));
      return;
    }
    const clash = trucks.find(
      (truck) =>
        truck.id !== draft.id &&
        normalizeKey(truck.truck_number) === normalizeKey(truckNumber),
    );
    if (clash) {
      setFormError(t('Truck #{number} already has a profile.', { number: clash.truck_number }));
      return;
    }
    const existing = trucks.find((truck) => truck.id === draft.id);
    const ifta = iftaFromDraft(draft);
    if ('error' in ifta) {
      setFormError(t(ifta.error));
      return;
    }
    const truck = {
      truck_number: truckNumber,
      nickname: draft.nickname.trim(),
      driver: draft.driver.trim(),
      license_plate: draft.licensePlate.trim(),
      notes: draft.notes.trim(),
      active: draft.active,
      created_at: existing?.created_at ?? new Date().toISOString(),
      ifta: ifta.value,
    };
    setSaving(true);
    const error = await saveProfile('truck', truck, existing?.id ?? null);
    setSaving(false);
    if (error) {
      setFormError(error);
      return;
    }
    setDraft(null);
    toast.add({
      title: existing
        ? t('Updated truck #{number}', { number: truckNumber })
        : t('Added truck #{number}', { number: truckNumber }),
      description: truck.active
        ? t('Choose it in Load Desk before extracting tickets.')
        : t('Inactive trucks are hidden when uploading tickets.'),
      type: 'success',
    });
  }

  async function confirmDelete() {
    if (!toDelete) return;
    const error = await deleteProfile('truck', toDelete.id);
    if (error) {
      toast.add({ title: t('Delete failed'), description: t(error), type: 'error' });
      return;
    }
    toast.add({
      title: t('Deleted truck #{number}', { number: toDelete.truck_number }),
      type: 'success',
    });
    setToDelete(null);
  }

  const rowActions = (truck: TruckProfile) => (
    <div className="pf-actions">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t('Edit truck {number}', { number: truck.truck_number })}
        onClick={() => edit(draftFrom(truck))}
      >
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="ld-danger"
        aria-label={t('Delete truck {number}', { number: truck.truck_number })}
        onClick={() => setToDelete(truck)}
      >
        <Trash2 />
      </Button>
    </div>
  );
  const plate = (truck: TruckProfile) =>
    truck.license_plate && t('Plate {plate}', { plate: truck.license_plate });

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t('TRUCK FLEET')}</p>
          <h1>{t('Truck Fleet')}</h1>
          <p className="muted">
            {t(
              'Trucks for {company}. Choose one when uploading tickets and its number goes on the invoice.',
              { company: sellerName },
            )}
          </p>
        </div>
        <dl className="ld-stats pf-stats">
          <div>
            <dt>{t('Trucks')}</dt>
            <dd>{trucks.length}</dd>
          </div>
          <div>
            <dt>{t('Active')}</dt>
            <dd>{trucks.filter((truck) => truck.active).length}</dd>
          </div>
          <div>
            <dt>{t('Loads this month')}</dt>
            <dd>{all.periods.month.loads}</dd>
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

        <section className="ld-panel pf-section" aria-labelledby="pf-trucks-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('Fleet')}</p>
              <h2 id="pf-trucks-title">{t('Trucks')}</h2>
            </div>
            <Button onClick={() => edit(blankDraft('', trucks))}>
              <Plus />
              {t('Add truck')}
            </Button>
          </div>
          {!profiles.ready || !recordsReady ? (
            <p className="ld-empty">{t('Loading trucks…')}</p>
          ) : rows.length === 0 ? (
            <p className="ld-empty">
              {t(
                'No trucks yet. Add each truck once, then choose it when uploading tickets so invoices get its number.',
              )}
            </p>
          ) : (
            <>
            <div className="pf-table-wrap">
              <table className="pf-table">
                <thead>
                  <tr>
                    <th scope="col">{t('Truck')}</th>
                    <th scope="col">{t('Driver')}</th>
                    <PeriodHeaders />
                    <th scope="col">{t('Last load')}</th>
                    <th scope="col">
                      <span className="sr-only">{t('Actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ truck, summary }) => (
                    <tr key={truck.id} data-inactive={!truck.active}>
                      <th scope="row" className="pf-name">
                        <strong>
                          <Truck aria-hidden="true" />#{truck.truck_number}
                          {truck.active ? null : (
                            <span className="ld-chip pf-chip">{t('Inactive')}</span>
                          )}
                          {truck.ifta?.yard_address ? null : (
                            <span className="ld-chip pf-chip" title={t('Enter the yard for IFTA mileage.')}>
                              {t('No yard')}
                            </span>
                          )}
                        </strong>
                        <small>
                          {[truck.nickname, plate(truck)].filter(Boolean).join(' · ') ||
                            t('No nickname or plate')}
                        </small>
                      </th>
                      <td>{truck.driver || <span className="pf-muted">—</span>}</td>
                      <PeriodCells summary={summary} />
                      <td className="pf-date">
                        {summary.lastLoad ? date(summary.lastLoad) : '—'}
                      </td>
                      <td>{rowActions(truck)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="pf-cards">
              {rows.map(({ truck, summary }) => (
                <li key={truck.id} className="pf-card" data-inactive={!truck.active}>
                  <div className="pf-card-head">
                    <div>
                      <strong>
                        #{truck.truck_number}
                        {truck.active ? null : (
                          <span className="ld-chip pf-chip">{t('Inactive')}</span>
                        )}
                        {truck.ifta?.yard_address ? null : (
                          <span className="ld-chip pf-chip">{t('No yard')}</span>
                        )}
                      </strong>
                      <small>
                        {[truck.nickname, truck.driver, plate(truck)]
                          .filter(Boolean)
                          .join(' · ') || t('No details yet')}
                      </small>
                    </div>
                    {rowActions(truck)}
                  </div>
                  <PeriodGrid summary={summary} />
                  <p className="pf-card-foot">
                    {t('Last load')} {summary.lastLoad ? date(summary.lastLoad) : '—'}
                  </p>
                </li>
              ))}
            </ul>
            </>
          )}
        </section>

        {suggestions.length ? (
          <section className="ld-panel pf-section" aria-labelledby="pf-unmatched-trucks">
            <div className="ld-panel-head">
              <div>
                <p className="ld-step">{t('From saved invoices')}</p>
                <h2 id="pf-unmatched-trucks">{t('Truck Numbers Without a Profile')}</h2>
              </div>
              <span className="ld-hint">
                {t('{loads} not counted under a truck', {
                  loads: plural(unassigned.length, 'load'),
                })}
              </span>
            </div>
            <ul className="pf-suggestions">
              {suggestions.map((suggestion) => (
                <li key={suggestion.number}>
                  <div>
                    <strong>#{suggestion.number}</strong>
                    <small>{plural(suggestion.count, 'load')}</small>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => edit(blankDraft(suggestion.number, trucks))}
                  >
                    <Plus />
                    {t('Add truck')}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
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
                <DialogTitle>{draft.id ? t('Edit truck') : t('Add truck')}</DialogTitle>
                <DialogDescription>
                  {t(
                    'Choose this truck in Load Desk before extracting tickets and its number goes on each invoice.',
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="ld-fields pf-fields">
                <label className="ld-field" htmlFor={`${fieldId}-number`}>
                  <span>
                    {t('Truck number')}
                    <RequiredMark />
                  </span>
                  <Input
                    id={`${fieldId}-number`}
                    required
                    placeholder={t('Number as printed on the ticket')}
                    value={draft.truckNumber}
                    onChange={(event) =>
                      setDraftField({ truckNumber: event.target.value })
                    }
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-nickname`}>
                  <span>{t('Nickname')}</span>
                  <Input
                    id={`${fieldId}-nickname`}
                    placeholder={t('What the crew calls it')}
                    value={draft.nickname}
                    onChange={(event) => setDraftField({ nickname: event.target.value })}
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-driver`}>
                  <span>{t('Driver')}</span>
                  <Input
                    id={`${fieldId}-driver`}
                    value={draft.driver}
                    onChange={(event) => setDraftField({ driver: event.target.value })}
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-plate`}>
                  <span>{t('License plate')}</span>
                  <Input
                    id={`${fieldId}-plate`}
                    value={draft.licensePlate}
                    onChange={(event) =>
                      setDraftField({ licensePlate: event.target.value })
                    }
                  />
                </label>
                <label className="ld-field" data-span={2}>
                  <span>{t('Notes')}</span>
                  <textarea
                    className="pf-textarea"
                    rows={2}
                    value={draft.notes}
                    onChange={(event) => setDraftField({ notes: event.target.value })}
                  />
                </label>
                <p className="pf-group-title">
                  <Route aria-hidden="true" />
                  {t('Mileage & routing')}
                </p>
                <label className="ld-field" data-span={2} htmlFor={`${fieldId}-yard`}>
                  <span>{t('Yard address')}</span>
                  <Input
                    id={`${fieldId}-yard`}
                    placeholder={t('Street, city, state and ZIP the day starts and ends at')}
                    value={draft.yardAddress}
                    maxLength={200}
                    onChange={(event) => setDraftField({ yardAddress: event.target.value })}
                  />
                </label>
                <label className="ld-field" htmlFor={`${fieldId}-mpg`}>
                  <span>{t('Average MPG')}</span>
                  <Input
                    id={`${fieldId}-mpg`}
                    type="number"
                    inputMode="decimal"
                    step={0.1}
                    min={1}
                    max={30}
                    value={draft.mpg}
                    onChange={(event) => setDraftField({ mpg: event.target.value })}
                  />
                </label>
                <label className="pf-check pf-check-inline" htmlFor={`${fieldId}-commercial`}>
                  <input
                    id={`${fieldId}-commercial`}
                    type="checkbox"
                    checked={draft.commercial}
                    onChange={(event) => setDraftField({ commercial: event.target.checked })}
                  />
                  <span>
                    {t('Commercial vehicle')}
                    <small>{t('Used for truck routing restrictions')}</small>
                  </span>
                </label>
                <div className="pf-dimensions" data-span={2}>
                  {(
                    [
                      ['heightFt', 'Height ft', 0.1],
                      ['widthFt', 'Width ft', 0.1],
                      ['lengthFt', 'Length ft', 0.5],
                      ['grossLb', 'Gross lb', 100],
                      ['axleLb', 'Axle lb', 100],
                      ['axles', 'Axles', 1],
                    ] as const
                  ).map(([field, label, step]) => (
                    <label className="ld-field" key={field} htmlFor={`${fieldId}-${field}`}>
                      <span>{t(label)}</span>
                      <Input
                        id={`${fieldId}-${field}`}
                        type="number"
                        inputMode="decimal"
                        step={step}
                        value={draft[field]}
                        onChange={(event) => setDraftField({ [field]: event.target.value })}
                      />
                    </label>
                  ))}
                </div>
                <label className="pf-check" data-span={2}>
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(event) => setDraftField({ active: event.target.checked })}
                  />
                  <span>
                    {t('Active')}
                    <small>
                      {t(
                        'Inactive trucks keep their history but are hidden when uploading tickets.',
                      )}
                    </small>
                  </span>
                </label>
              </div>
              {formError ? (
                <p className="ld-status" data-tone="error" role="alert">
                  {t(formError)}
                </p>
              ) : null}
              <DialogFooter showCloseButton>
                <Button type="submit" disabled={saving}>
                  {saving ? t('Saving…') : draft.id ? t('Save changes') : t('Add truck')}
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
                  {t('Delete truck #{number}?', { number: toDelete.truck_number })}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    'Saved tickets and invoices keep their truck number. To keep the truck’s load history on this page, mark it inactive instead.',
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => void confirmDelete()}
                >
                  {t('Delete truck')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
