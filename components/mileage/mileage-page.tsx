'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, Fuel } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import DayCard, { type DayHeadline } from '@/components/mileage/day-card';
import RouteView from '@/components/mileage/route-view';
import { useProfiles, useRecords } from '@/components/profiles/profile-ui';
import { useT } from '@/lib/i18n/use-t';
import { watchForChanges } from '@/lib/load-desk/live';
import {
  dayHeadline,
  dayKey,
  dayProblems,
  dayView,
  formatNumber,
  periodRange,
  summarizeDays,
  truckDays,
  type MileageDay,
  type Problem,
  type TruckDay,
} from '@/lib/load-desk/mileage';
import {
  getDaysSnapshot,
  getServerDaysSnapshot,
  givenUp,
  loadDayDetail,
  loadDays,
  recalculate,
  resetAttempts,
  settleDays,
  subscribeDays,
} from '@/lib/load-desk/mileage-days';
import type { TruckProfile } from '@/lib/load-desk/profiles';

// Mileage answers one question: where did this truck drive, and how many miles
// did it travel? A card per truck and day says it; opening a card shows the
// route it drove. Everything else — the hashes, the caches, the provider — is
// the page's business, not the dispatcher's. What a quarter adds up to for a
// tax return is IFTA's page, not this one.

const useDays = () =>
  useSyncExternalStore(subscribeDays, getDaysSnapshot, getServerDaysSnapshot);

// The address is the one thing on this page the page does not own: IFTA links
// to /mileage?truck=…&date=… for a day. Read as any other outside source is,
// so that opening a link selects a day without a render setting state.
const subscribeSearch = (listener: () => void) => {
  window.addEventListener('popstate', listener);
  return () => window.removeEventListener('popstate', listener);
};
const getSearch = () => window.location.search;
const getServerSearch = () => '';

// A phone shows either the list or the route it opened, never both, so the
// width is read the same way the address is.
const PHONE = '(max-width: 720px)';
const subscribePhone = (listener: () => void) => {
  const query = window.matchMedia(PHONE);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
};
const getPhone = () => window.matchMedia(PHONE).matches;
const getServerPhone = () => false;

/** The three periods, with the tile label and the wording of the empty state. */
const PERIODS = [
  ['today', 'Today', 'Miles Today', 'today'],
  ['week', 'This Week', 'Miles This Week', 'this week'],
  ['month', 'This Month', 'Miles This Month', 'this month'],
] as const;
type Period = (typeof PERIODS)[number][0];

/** What the page loads: last quarter through the end of this one. */
const loadedRange = (now: Date) => ({
  from: periodRange('last_quarter', now).from,
  to: periodRange('quarter', now).to,
});

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** The shortest of the three periods that holds a date, for a day opened from a link. */
function periodFor(date: string, now: Date): Period {
  for (const [period] of PERIODS) {
    const range = periodRange(period, now);
    if (date >= range.from && date <= range.to) return period;
  }
  return 'month';
}

type Shown = {
  day: TruckDay;
  truck: TruckProfile;
  row: MileageDay | undefined;
  headline: DayHeadline;
  problems: Problem[];
};

export default function MileagePage() {
  const { records, ready: recordsReady } = useRecords();
  const profiles = useProfiles();
  const days = useDays();
  const tr = useT();
  const { t } = tr;
  const { trucks } = profiles;
  const search = useSyncExternalStore(subscribeSearch, getSearch, getServerSearch);
  const phone = useSyncExternalStore(subscribePhone, getPhone, getServerPhone);
  const [now] = useState(() => new Date());
  /** The period on screen; null until a person picks one, so a link decides. */
  const [period, setPeriod] = useState<Period | null>(null);
  /** The open day as `${truck_id}|${date}`; null follows the link, '' is none. */
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // The day a link asks for, until a person picks another one. The period moves
  // with it, so the list the day belongs to is the one on the screen.
  const asked = useMemo(() => {
    const params = new URLSearchParams(search);
    const truck = Number(params.get('truck'));
    const day = params.get('date') ?? '';
    if (!Number.isInteger(truck) || truck <= 0 || !ISO_DATE.test(day)) return null;
    return { key: dayKey(truck, day), date: day };
  }, [search]);
  const shownPeriod = period ?? (asked ? periodFor(asked.date, now) : 'week');
  const selectedKey = selected === null ? (asked?.key ?? null) : selected || null;

  const range = useMemo(() => loadedRange(now), [now]);
  const shownRange = useMemo(
    () => periodRange(shownPeriod, now),
    [shownPeriod, now],
  );

  // The stored days, and again whenever the page comes back into view.
  useEffect(() => {
    void loadDays(range);
    return watchForChanges(() => void loadDays(range));
  }, [range]);

  // Every poll of the tickets is a new snapshot, so this follows edits made
  // anywhere within ten seconds; the store only posts what actually changed.
  const expected = useMemo(() => truckDays(records, trucks), [records, trucks]);

  // Whatever the tickets say now, the stored days follow.
  const toSettle = useMemo(
    () => expected.days.filter((day) => day.date >= range.from && day.date <= range.to),
    [expected, range],
  );
  useEffect(() => {
    if (!recordsReady || !profiles.ready || !days.ready) return;
    void settleDays(toSettle);
  }, [toSettle, recordsReady, profiles.ready, days.ready, days.mode, days.configured]);

  // The open day's legs carry their lines on the map, which the list does not
  // need and does not fetch. Asked for again whenever the day is worked out.
  const selectedRow = selectedKey ? days.days[selectedKey] : undefined;
  const detailRequest = selectedKey
    ? `${selectedKey}|${selectedRow?.input_hash ?? ''}|${selectedRow?.calculated_at ?? ''}`
    : null;
  useEffect(() => {
    if (!detailRequest) return;
    const [truckId, day] = detailRequest.split('|');
    void loadDayDetail(Number(truckId), day);
  }, [detailRequest]);

  // The route opens below the list on a phone and beside it on a desktop; in
  // both places a tap goes to it.
  useEffect(() => {
    if (!selectedKey) return;
    document.getElementById('mileage-route')?.scrollIntoView({
      behavior: 'smooth',
      block: window.matchMedia(PHONE).matches ? 'start' : 'nearest',
    });
  }, [selectedKey]);

  const byTruck = new Map(trucks.map((truck) => [truck.id, truck]));
  const describe = (day: TruckDay): Shown | null => {
    const truck = byTruck.get(day.truck_id);
    if (!truck) return null;
    const row = days.days[day.key];
    const stuck = givenUp(day);
    return {
      day,
      truck,
      row,
      headline: dayHeadline(row, day, truck, { stuck }),
      problems: dayProblems(row, day, truck, { stuck }),
    };
  };
  const shown = expected.days
    .filter((day) => day.date >= shownRange.from && day.date <= shownRange.to)
    .map(describe)
    .filter((item): item is Shown => item !== null);

  // The open day may be older than the period on screen, when a link asked for
  // it, so it is looked for among every day the tickets describe.
  const asking = expected.days.find((day) => day.key === selectedKey);
  const open = asking ? describe(asking) : null;

  const summary = summarizeDays(Object.values(days.days), shownRange.from, shownRange.to);
  const toReview = shown.filter(
    (item) => item.headline === 'needs_help' || item.headline === 'could_not_update',
  ).length;
  const trucksWithoutYard = trucks.filter((truck) => truck.active && !truck.ifta?.yard_address);
  const loading = !recordsReady || !profiles.ready || !days.ready;
  const labels = PERIODS.find(([value]) => value === shownPeriod) ?? PERIODS[1];

  /** Asks for these days again, forgetting how often they have been asked for. */
  async function update(items: TruckDay[]) {
    if (busy || !items.length) return;
    setBusy(true);
    resetAttempts(items.map((day) => day.key));
    const error = await recalculate(items.map((day) => ({ truck_id: day.truck_id, date: day.date })));
    setBusy(false);
    if (error) {
      toast.add({ title: t('Could not update the mileage'), description: t(error), type: 'error' });
    }
  }

  /** Every day that was waiting on this place, whatever its date. */
  async function locationFixed(place: string) {
    const waiting = expected.days.filter((day) =>
      days.days[day.key]?.review_reasons.some((reason) => reason.place_key === place),
    );
    await update(waiting);
  }

  return (
    <div className="mileage-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t('MILEAGE')}</p>
          <h1>{t('Mileage')}</h1>
          <p className="muted">
            {t('See where each truck drove and how many miles it traveled.')}
          </p>
          <Link href="/ifta" className="mileage-ifta-link">
            {t('IFTA reporting')}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <dl className="ld-stats">
          <div>
            <dt>{t('Showing')}</dt>
            <dd>{t(labels[1])}</dd>
          </div>
          <div>
            <dt>{t('Miles')}</dt>
            <dd>{formatNumber(summary.miles)}</dd>
          </div>
          <div>
            <dt>{t('Days to review')}</dt>
            <dd>{toReview}</dd>
          </div>
        </dl>
      </div>

      <div className="page-sheet">
        <div className="mileage-tiles">
          <div className="ld-panel hm-stat mileage-tile">
            <p className="hm-stat-label">{t(labels[2])}</p>
            <p className="hm-stat-value">{formatNumber(summary.miles)}</p>
            <p className="hm-stat-sub">{t('Route miles from each day’s tickets')}</p>
          </div>
          <div className="ld-panel hm-stat mileage-tile">
            <p className="hm-stat-label">{t('Estimated Fuel Used')}</p>
            <p className="hm-stat-value">
              {formatNumber(summary.gallons)} <small>{t('gal')}</small>
            </p>
            <p className="hm-stat-sub">{t('At each truck’s average MPG')}</p>
          </div>
          <div className="ld-panel hm-stat mileage-tile">
            <p className="hm-stat-label">{t('Loads')}</p>
            <p className="hm-stat-value">{summary.loads}</p>
            <p className="hm-stat-sub">{t('Tickets on the days counted')}</p>
          </div>
          <div className="ld-panel hm-stat mileage-tile">
            <p className="hm-stat-label">{t('Trucks')}</p>
            <p className="hm-stat-value">{summary.trucks}</p>
            <p className="hm-stat-sub">
              {t('Trucks with miles {when}', { when: t(labels[3]) })}
            </p>
          </div>
        </div>
        <p className="ld-hint mileage-footnote">
          <Fuel aria-hidden="true" />
          {t('Estimated Fuel Used is miles ÷ average MPG. It is not fuel purchased.')}
        </p>

        {days.mode === 'local' ? (
          <div className="ld-notice pf-notice">
            {t('Mileage is worked out on the server and isn’t available in this preview.')}
          </div>
        ) : null}
        {days.ready && days.mode === 'remote' && !days.configured ? (
          <div className="ld-notice pf-notice" data-tone="warning">
            {t('Mileage can’t be calculated on this site yet. Ask Monius to finish the setup.')}
          </div>
        ) : null}
        {days.error ? (
          <div className="ld-notice pf-notice" data-tone="warning">
            {t(days.error)}
          </div>
        ) : null}
        {profiles.ready
          ? trucksWithoutYard.map((truck) => (
              <div key={truck.id} className="ld-notice pf-notice mileage-yard" data-tone="warning">
                <span>
                  {t('Truck {number} needs a home yard before mileage can be calculated.', {
                    number: truck.truck_number,
                  })}
                </span>
                <Link
                  href={`/fleet?edit=${truck.id}`}
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  {t('Set yard')}
                </Link>
              </div>
            ))
          : null}

        <div className="mileage-split" data-open={open ? '' : undefined}>
          {phone && open ? null : (
            <section
              className="ld-panel pf-section mileage-days"
              aria-labelledby="mileage-days-title"
            >
              <div className="ld-panel-head">
                <div>
                  <p className="ld-step">{t('Per truck and day')}</p>
                  <h2 id="mileage-days-title">{t('Daily mileage')}</h2>
                </div>
                <fieldset className="ui-segmented mileage-periods">
                  <legend className="sr-only">{t('Show')}</legend>
                  {PERIODS.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={shownPeriod === value}
                      onClick={() => setPeriod(value)}
                    >
                      {t(label)}
                    </button>
                  ))}
                </fieldset>
              </div>
              {loading ? (
                <p className="ld-empty">{t('Loading mileage…')}</p>
              ) : shown.length === 0 ? (
                <p className="ld-empty">
                  {t('No mileage yet {when}. Mileage appears automatically after tickets are added.', {
                    when: t(labels[3]),
                  })}
                </p>
              ) : (
                <ul className="mileage-list">
                  {shown.map((item) => (
                    <DayCard
                      key={item.day.key}
                      day={item.day}
                      truck={item.truck}
                      row={item.row}
                      headline={item.headline}
                      selected={item.day.key === selectedKey}
                      tr={tr}
                      onOpen={() => setSelected(item.day.key)}
                    />
                  ))}
                </ul>
              )}
            </section>
          )}
          {open ? (
            <RouteView
              key={open.day.key}
              day={open.day}
              truck={open.truck}
              row={open.row}
              problems={open.problems}
              headline={open.headline}
              geometry={days.geometry}
              records={records}
              busy={busy}
              phone={phone}
              canUpdate={
                open.headline === 'settings_changed' ||
                open.headline === 'could_not_update' ||
                dayView(open.row, open.day.input_hash) === 'stale'
              }
              tr={tr}
              onBack={() => setSelected('')}
              onTryAgain={() => void update([open.day])}
              onUpdateDay={() => void update([open.day])}
              onOrderConfirmed={() => void loadDayDetail(open.day.truck_id, open.day.date)}
              onLocationFixed={(place) => void locationFixed(place)}
            />
          ) : null}
        </div>

        {expected.excluded.length ? (
          <p className="ld-hint mileage-excluded">
            {t('{tickets} aren’t counted because they have no truck or date.', {
              tickets: tr.plural(expected.excluded.length, 'ticket'),
            })}{' '}
            <Link href="/records">{t('Open Records')}</Link>
          </p>
        ) : null}

        <p className="ld-hint mileage-footer">
          {t(
            'Routes follow roads open to each truck’s size and weight, as far as TomTom’s map allows. Miles are estimates.',
          )}
        </p>
      </div>
    </div>
  );
}
