'use client';

import { Check, CircleAlert, Loader2, RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Translator } from '@/lib/i18n/translate';
import { formatNumber, hasResult, type MileageDay, type TruckDay } from '@/lib/load-desk/mileage';
import type { TruckProfile } from '@/lib/load-desk/profiles';

// One truck on one day, as a row of the daily list. Everything a dispatcher
// needs in order to decide whether to open the day is on the row, in words:
// the truck, the day, how many loads, how far it drove, and whether anything
// is waiting on a person. The row never says anything with colour alone.

/** What the page says about a day, as `dayHeadline` decides it. */
export type DayHeadline =
  | 'ready'
  | 'updating'
  | 'needs_help'
  | 'could_not_update'
  | 'settings_changed';

/** "Monday, Sep 21". The same wording in every language, which reads as a date. */
export function longDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return date;
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

/** A glyph, a word and a tone for each headline, so none of them needs colour. */
const HEADLINES = {
  ready: { tone: 'good', Icon: Check, text: 'Ready' },
  updating: { tone: 'neutral', Icon: Loader2, text: 'Updating…' },
  needs_help: { tone: 'warning', Icon: TriangleAlert, text: 'Needs your help' },
  could_not_update: { tone: 'error', Icon: CircleAlert, text: 'Couldn’t update' },
  settings_changed: { tone: 'neutral', Icon: RefreshCw, text: 'Settings changed' },
} as const;

/**
 * The one line that says where the day stands. On the open day it is a live
 * region, so a reader hears the answer arrive without being moved about.
 */
export function DayStatus({
  headline,
  row,
  tr,
  live = false,
}: {
  headline: DayHeadline;
  row: MileageDay | undefined;
  tr: Translator;
  live?: boolean;
}) {
  const { t, date } = tr;
  const { tone, Icon, text } = HEADLINES[headline];
  const done = !!row && hasResult(row);
  const note =
    headline === 'updating' && !done
      ? t('Calculating today’s route…')
      : headline === 'could_not_update' && done && row.calculated_at
        ? t('Last updated {date}', { date: date(row.calculated_at.slice(0, 10)) })
        : null;
  return (
    <p
      className="mileage-status"
      data-tone={tone}
      aria-live={live ? 'polite' : undefined}
    >
      <Icon aria-hidden="true" />
      <span>{t(text)}</span>
      {note ? <small>{note}</small> : null}
    </p>
  );
}

export default function DayCard({
  day,
  truck,
  row,
  headline,
  selected,
  tr,
  onOpen,
}: {
  day: TruckDay;
  truck: TruckProfile;
  row: MileageDay | undefined;
  headline: DayHeadline;
  selected: boolean;
  tr: Translator;
  onOpen: () => void;
}) {
  const { t } = tr;
  const when = longDate(day.date);
  const miles = row?.total_miles ?? null;
  const gallons = row?.est_gallons ?? null;
  return (
    <li className="pf-card mileage-day-card" data-selected={selected || undefined}>
      <div className="pf-card-head">
        <div>
          <strong>{t('Truck {number}', { number: truck.truck_number })}</strong>
          <small>
            {when} · {tr.plural(day.records.length, 'load')}
          </small>
        </div>
        <Button
          variant={selected ? 'default' : 'secondary'}
          className="mileage-day-open"
          aria-label={t('View route for truck {number} on {date}', {
            number: truck.truck_number,
            date: when,
          })}
          aria-current={selected || undefined}
          onClick={onOpen}
        >
          {t('View route')}
        </Button>
      </div>
      <div className="mileage-day-facts">
        <p className="mileage-day-miles">
          {miles === null ? '—' : formatNumber(miles)} <small>{t('miles')}</small>
        </p>
        <p className="mileage-day-fuel">
          {t('Estimated fuel: {gal} gal', { gal: gallons === null ? '—' : formatNumber(gallons) })}
        </p>
        <DayStatus headline={headline} row={row} tr={tr} />
      </div>
    </li>
  );
}
