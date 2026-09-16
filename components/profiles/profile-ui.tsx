'use client';

import { useSyncExternalStore } from 'react';
import { useT } from '@/lib/i18n/use-t';
import {
  getProfilesSnapshot,
  getServerProfilesSnapshot,
  PERIODS,
  subscribeProfiles,
  type LoadSummary,
} from '@/lib/load-desk/profiles';
import {
  getRecordsSnapshot,
  getServerRecordsSnapshot,
  subscribeRecords,
} from '@/lib/load-desk/storage';

export const useRecords = () =>
  useSyncExternalStore(
    subscribeRecords,
    getRecordsSnapshot,
    getServerRecordsSnapshot,
  );

export const useProfiles = () =>
  useSyncExternalStore(
    subscribeProfiles,
    getProfilesSnapshot,
    getServerProfilesSnapshot,
  );

/** Splits comma- or line-separated input into unique trimmed values. */
export const listFrom = (value: string) => [
  ...new Set(
    value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean),
  ),
];

/** Empty input is no amount; anything else must be a non-negative number. */
export function parseAmount(value: string): number | null | 'invalid' {
  if (value.trim() === '') return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0
    ? Math.round(amount * 100) / 100
    : 'invalid';
}

export function PeriodHeaders() {
  const { t } = useT();
  return (
    <>
      {PERIODS.map(([key, label]) => (
        <th key={key} scope="col" className="pf-num">
          {t(label)}
        </th>
      ))}
    </>
  );
}

/** Loads per period, with net tons underneath. */
export function PeriodCells({ summary }: { summary: LoadSummary }) {
  const { t } = useT();
  return (
    <>
      {PERIODS.map(([key]) => (
        <td key={key} className="pf-num" data-empty={summary.periods[key].loads === 0}>
          <strong>{summary.periods[key].loads}</strong>
          <small>{t('{tons} Tons', { tons: summary.periods[key].tons.toFixed(1) })}</small>
        </td>
      ))}
    </>
  );
}

/** The same periods as a compact grid, for phone-width cards. */
export function PeriodGrid({ summary }: { summary: LoadSummary }) {
  const { t } = useT();
  return (
    <dl className="pf-period-grid">
      {PERIODS.map(([key, label]) => (
        <div key={key} data-empty={summary.periods[key].loads === 0}>
          <dt>{t(label)}</dt>
          <dd>
            {summary.periods[key].loads}
            <small>{t('{tons} Tons', { tons: summary.periods[key].tons.toFixed(1) })}</small>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function RequiredMark() {
  return (
    <span className="ld-required" aria-hidden="true">
      {' '}
      *
    </span>
  );
}
