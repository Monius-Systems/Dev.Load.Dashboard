'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/toast';
import { useT } from '@/lib/i18n/use-t';
import {
  loadRuns,
  runInspection,
  saveSettings,
  type OperatorSnapshot,
} from '@/lib/load-desk/operator-client';
import {
  autonomyLabel,
  autonomyNote,
  permissionLabel,
} from '@/lib/operator/tool-labels';
import {
  AUTONOMY_MODES,
  WRITE_PERMISSIONS,
  isWritePermission,
  type AutonomyMode,
  type WritePermission,
} from '@/lib/operator/types';

// How far the Operator may go here, and what it is allowed to touch.
//
// The permissions are facts about the workspace, not conclusions the model
// reaches: everything on this page is enforced again on the server before any
// tool runs, and nothing the model says can add to it. The view is inside the
// panel rather than on a settings page of its own because it is read in the
// middle of a conversation — "why did it ask me?" — and answered there.

const RUN_TONES: Record<string, 'good' | 'warning' | undefined> = {
  completed: 'good',
  awaiting_confirmation: 'warning',
  limited: 'warning',
};

/**
 * The standing questions, as this view lists them: the name the server knows
 * each one by, what to call it, and how often it is meant to be asked.
 *
 * The questions themselves are the server's — lib/server/operator/inspections
 * holds the wording, and the route refuses a name it does not know — so what
 * is repeated here is only what a person reads. Nothing asks any of them on a
 * rhythm yet: this deployment has no scheduler, and "Run now" is the only
 * thing that runs one.
 */
const INSPECTIONS: { name: string; label: string; cadence: string }[] = [
  { name: 'morning_operations', label: 'Morning operations', cadence: 'Daily' },
  { name: 'billing_readiness', label: 'Billing readiness', cadence: 'Daily' },
  { name: 'end_of_day_tickets', label: 'End-of-day tickets', cadence: 'Daily' },
  { name: 'weekly_rates', label: 'Weekly rates', cadence: 'Weekly' },
  { name: 'ifta_completeness', label: 'IFTA completeness', cadence: 'Quarterly' },
  { name: 'invoice_exceptions', label: 'Invoice exceptions', cadence: 'Weekly' },
];

const RUN_STATUS: Record<string, string> = {
  running: 'Running',
  completed: 'Completed',
  awaiting_confirmation: 'Waiting on you',
  failed: 'Failed',
  limited: 'Stopped early',
};

export default function OperatorSettings({ snapshot }: { snapshot: OperatorSnapshot }) {
  const { t } = useT();
  const stored = snapshot.settings;
  // What the person has changed since the view opened; null means "as stored".
  const [draft, setDraft] = useState<{
    autonomy: AutonomyMode;
    granted: WritePermission[];
  } | null>(null);
  /** The inspection being run by hand, if one is; only one goes at a time. */
  const [running, setRunning] = useState<string | null>(null);

  // The runs list is read when this view opens and never again: it is a record
  // of what has happened, not a thing that needs watching.
  useEffect(() => {
    void loadRuns();
  }, []);

  if (!stored) {
    return (
      <div className="op-settings">
        <p className="ld-empty">
          {snapshot.settingsError
            ? t(snapshot.settingsError)
            : t('Reading the Operator settings…')}
        </p>
      </div>
    );
  }

  const autonomy = draft?.autonomy ?? stored.autonomy;
  const granted = draft?.granted ?? stored.granted ?? [];
  const modes = snapshot.modes.length ? snapshot.modes : AUTONOMY_MODES;
  const writes = snapshot.permissions?.writes.filter(isWritePermission) ?? [
    ...WRITE_PERMISSIONS,
  ];
  const changed =
    autonomy !== stored.autonomy ||
    granted.length !== (stored.granted?.length ?? 0) ||
    granted.some((write) => !stored.granted?.includes(write));

  const set = (next: { autonomy?: AutonomyMode; granted?: WritePermission[] }) =>
    setDraft({ autonomy, granted, ...next });

  const toggle = (write: WritePermission, on: boolean) =>
    set({
      granted: on ? [...granted, write] : granted.filter((item) => item !== write),
    });

  async function save() {
    const saved = await saveSettings({ autonomy, granted });
    if (!saved) return;
    setDraft(null);
    toast.add({ title: t('Operator settings saved'), type: 'success' });
  }

  /**
   * Asks one standing question now. The answer lands in the conversation
   * rather than here, because it is an answer like any other and belongs where
   * a person reads answers; the toast is only to say where it went.
   */
  async function inspect(name: string, label: string) {
    if (running || snapshot.busy) return;
    setRunning(name);
    const error = await runInspection(name);
    setRunning(null);
    toast.add({
      title: error ? t('Could not run {inspection}', { inspection: t(label) }) : t('{inspection} is in the conversation', { inspection: t(label) }),
      description: error ? t(error) : undefined,
      type: error ? 'error' : 'success',
    });
  }

  return (
    <div className="op-settings">
      <section className="op-settings-block">
        <p className="ld-step">{t('How far it may go')}</p>
        <fieldset className="ui-segmented op-modes" aria-label={t('Autonomy')}>
          {modes.map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={mode === autonomy}
              onClick={() => set({ autonomy: mode })}
            >
              {t(autonomyLabel(mode))}
            </button>
          ))}
        </fieldset>
        <p className="op-settings-note">{t(autonomyNote(autonomy))}</p>
      </section>

      <section className="op-settings-block">
        <p className="ld-step">{t('What it may change')}</p>
        <ul className="op-checks">
          {writes.map((write) => (
            <li key={write}>
              <label className="op-check">
                <Checkbox
                  checked={granted.includes(write)}
                  onCheckedChange={(on) => toggle(write, on === true)}
                />
                <span>{t(permissionLabel(write))}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="op-settings-note">
          {t('Reading is always on: tickets, invoices, customers, rates, mileage, IFTA and system health.')}
        </p>
        <p className="op-settings-note">
          {t('Level 3 actions (sending, finalizing, deleting) always need your confirmation and are not available in this version.')}
        </p>
      </section>

      {snapshot.settingsError ? (
        <p className="ld-notice" data-tone="warning">
          {t(snapshot.settingsError)}
        </p>
      ) : null}

      <div className="op-settings-buttons">
        <Button disabled={!changed || snapshot.settingsBusy} onClick={() => void save()}>
          {snapshot.settingsBusy ? t('Saving…') : t('Save')}
        </Button>
        {changed ? (
          <Button variant="secondary" onClick={() => setDraft(null)}>
            {t('Discard changes')}
          </Button>
        ) : null}
      </div>

      <section className="op-settings-block">
        <p className="ld-step">{t('Recent runs')}</p>
        {snapshot.runs === null ? (
          <p className="ld-empty">{t('Reading the recent runs…')}</p>
        ) : snapshot.runs.length === 0 ? (
          <p className="ld-empty">{t('Nothing has been asked yet.')}</p>
        ) : (
          <ul className="op-runs">
            {snapshot.runs.map((run) => (
              <li key={run.id} className="op-run">
                <span className="op-run-request">{run.summary || run.request}</span>
                <span className="ld-chip" data-tone={RUN_TONES[run.status]}>
                  {t(RUN_STATUS[run.status] ?? run.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="op-settings-block">
        <p className="ld-step">{t('Inspections')}</p>
        <ul className="op-runs op-inspections">
          {INSPECTIONS.map((inspection) => (
            <li key={inspection.name} className="op-run">
              <span className="op-run-request">
                {t(inspection.label)}
                <span className="ld-chip">{t(inspection.cadence)}</span>
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={running !== null || snapshot.busy}
                onClick={() => void inspect(inspection.name, inspection.label)}
              >
                {running === inspection.name ? t('Working…') : t('Run now')}
              </Button>
            </li>
          ))}
        </ul>
        <p className="op-settings-note">
          {t('These are the standing questions. Nothing asks them on a schedule yet — pressing Run now asks one, and the answer arrives in the conversation.')}
        </p>
      </section>
    </div>
  );
}
