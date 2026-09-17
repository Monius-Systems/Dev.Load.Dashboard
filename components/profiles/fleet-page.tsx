'use client';

import { useId, useState, type SyntheticEvent } from 'react';
import { Pencil, Plus, Trash2, Truck } from 'lucide-react';
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
import {
  deleteProfile,
  normalizeKey,
  saveProfile,
  summarize,
  truckIdFor,
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
};

const blankDraft = (truckNumber = ''): Draft => ({
  id: null,
  truckNumber,
  nickname: '',
  driver: '',
  licensePlate: '',
  notes: '',
  active: true,
});

const draftFrom = (truck: TruckProfile): Draft => ({
  id: truck.id,
  truckNumber: truck.truck_number,
  nickname: truck.nickname,
  driver: truck.driver,
  licensePlate: truck.license_plate,
  notes: truck.notes,
  active: truck.active,
});


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
    const truck = {
      truck_number: truckNumber,
      nickname: draft.nickname.trim(),
      driver: draft.driver.trim(),
      license_plate: draft.licensePlate.trim(),
      notes: draft.notes.trim(),
      active: draft.active,
      created_at: existing?.created_at ?? new Date().toISOString(),
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
        <dl className="ld-stats">
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
            <Button onClick={() => edit(blankDraft())}>
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
                    onClick={() => edit(blankDraft(suggestion.number))}
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
