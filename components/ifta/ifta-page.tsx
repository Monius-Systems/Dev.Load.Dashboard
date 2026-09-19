'use client';

import { useEffect, useId, useMemo, useState, useSyncExternalStore, type SyntheticEvent } from 'react';
import Link from 'next/link';
import { CalendarRange, ChevronDown, Fuel, MapPin, Pencil, RefreshCw, Route } from 'lucide-react';
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
import { useProfiles, useRecords } from '@/components/profiles/profile-ui';
import type { Translator } from '@/lib/i18n/translate';
import { useT } from '@/lib/i18n/use-t';
import { setDeskField } from '@/lib/load-desk/desk-session';
import { watchForChanges } from '@/lib/load-desk/live';
import {
  dayView,
  formatNumber,
  IFTA_PERIODS,
  isQuarterKey,
  periodRange,
  quarterKeys,
  quarterLabel,
  quarterRangeOf,
  routeLabels,
  settingsChanged,
  summarizeByTruck,
  summarizeDays,
  truckDays,
  truckIfta,
  type DayView,
  type IftaPeriod,
  type MileageDay,
  type MileageSummary,
  type ReviewReason,
  type TruckDay,
} from '@/lib/load-desk/mileage';
import {
  fixPlace,
  getDaysSnapshot,
  getServerDaysSnapshot,
  givenUp,
  loadDays,
  loadRanges,
  recalculate,
  resetAttempts,
  settleDays,
  subscribeDays,
} from '@/lib/load-desk/mileage-days';
import { ticketDateColumn } from '@/lib/load-desk/record-input';
import type { TruckProfile } from '@/lib/load-desk/profiles';
import type { SavedRecord } from '@/lib/load-desk/types';

// IFTA & Mileage: estimated road miles and fuel per truck and day, from the
// tickets already saved. The page keeps the stored days in step with the
// tickets by itself; a person only steps in where a ticket or a place needs
// their eyes.

const useDays = () =>
  useSyncExternalStore(subscribeDays, getDaysSnapshot, getServerDaysSnapshot);

/** What the page loads: last quarter through the end of this one. */
const loadedRange = (now: Date) => ({
  from: periodRange('last_quarter', now).from,
  to: periodRange('quarter', now).to,
});

const ticketNumber = (record: SavedRecord | undefined, id: number | undefined) =>
  record?.ticket.ticket_number || (id === undefined ? '' : `#${id}`);

const minutes = (seconds: number) => {
  const total = Math.round(seconds / 60);
  const hours = Math.floor(total / 60);
  return hours ? `${hours}h ${String(total % 60).padStart(2, '0')}m` : `${total}m`;
};

/** A stat tile in the shape of Home's, for the four period summaries. */
function SummaryTile({
  label,
  summary,
  tr,
}: {
  label: string;
  summary: MileageSummary;
  tr: Translator;
}) {
  const { t } = tr;
  return (
    <div className="ld-panel hm-stat ifta-tile">
      <p className="hm-stat-label">{label}</p>
      <p className="hm-stat-value">
        {formatNumber(summary.miles)} <small>{t('mi')}</small>
      </p>
      <p className="hm-stat-sub">
        {t('Est. fuel {gal} gal · {loads} loads · {trucks} trucks', {
          gal: formatNumber(summary.gallons),
          loads: summary.loads,
          trucks: summary.trucks,
        })}
      </p>
      {summary.review ? (
        <p className="hm-stat-sub ifta-tile-review">{t('{n} to review', { n: summary.review })}</p>
      ) : null}
    </div>
  );
}

type Shown = {
  day: TruckDay;
  truck: TruckProfile;
  row: MileageDay | undefined;
  view: DayView;
  pending: boolean;
  stuck: boolean;
  changed: boolean;
};

export default function IftaPage() {
  const { records, ready: recordsReady } = useRecords();
  const profiles = useProfiles();
  const days = useDays();
  const tr = useT();
  const { t, date } = tr;
  const { trucks } = profiles;
  const [now] = useState(() => new Date());
  /** A preset period, or a past quarter as "YYYY-Qn" from the reports. */
  const [period, setPeriod] = useState<string>('week');
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());
  const [openQuarters, setOpenQuarters] = useState<ReadonlySet<string>>(() => new Set());
  const [fix, setFix] = useState<{ reason: ReviewReason; address: string } | null>(null);
  const [fixError, setFixError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fieldId = useId();

  const range = useMemo(() => loadedRange(now), [now]);
  const shownRange = useMemo(
    () => quarterRangeOf(period) ?? periodRange(isQuarterKey(period) ? 'quarter' : (period as IftaPeriod), now),
    [period, now],
  );

  // The stored days, and again whenever the page comes back into view.
  useEffect(() => {
    void loadDays(range);
    return watchForChanges(() => void loadDays(range));
  }, [range]);

  // Every poll of the tickets is a new snapshot, so this follows edits made
  // anywhere within ten seconds; the store only posts what actually changed.
  const expected = useMemo(() => truckDays(records, trucks), [records, trucks]);

  // Every quarter from the first dated ticket to now, for the reports. The
  // past ones are loaded once; their days are only calculated when opened.
  const quarters = useMemo(() => {
    let earliest = range.from;
    for (const record of records) {
      const date = ticketDateColumn(record.ticket);
      if (date && date < earliest) earliest = date;
    }
    return quarterKeys(earliest, range.to);
  }, [records, range]);
  const quartersKey = quarters.join(',');
  useEffect(() => {
    if (!recordsReady || !days.ready || days.mode !== 'remote') return;
    const past = quarters
      .map((key) => quarterRangeOf(key))
      .filter((quarter): quarter is { from: string; to: string } => !!quarter && quarter.to < range.from);
    void loadRanges(past);
  }, [quartersKey, quarters, recordsReady, days.ready, days.mode, range]);

  // Whatever the tickets say now, the stored days follow — for the current
  // and last quarter always, and for a past quarter while it is being looked
  // at, so a long history is not sent to the provider all at once.
  const toSettle = useMemo(
    () =>
      expected.days.filter(
        (day) =>
          (day.date >= range.from && day.date <= range.to) ||
          (day.date >= shownRange.from && day.date <= shownRange.to),
      ),
    [expected, range, shownRange],
  );
  useEffect(() => {
    if (!recordsReady || !profiles.ready || !days.ready) return;
    void settleDays(toSettle);
  }, [toSettle, recordsReady, profiles.ready, days.ready, days.mode, days.configured]);

  const byTruck = new Map(trucks.map((truck) => [truck.id, truck]));
  const shown: Shown[] = expected.days
    .filter((day) => day.date >= shownRange.from && day.date <= shownRange.to)
    .map((day) => {
      const truck = byTruck.get(day.truck_id) as TruckProfile;
      const row = days.days[day.key];
      return {
        day,
        truck,
        row,
        view: dayView(row, day.input_hash),
        pending: days.pending.has(day.key),
        stuck: givenUp(day),
        changed: row ? settingsChanged(row, truckIfta(truck)) : false,
      };
    });
  const stored = Object.values(days.days);
  const summarize = (key: IftaPeriod) => {
    const { from, to } = periodRange(key, now);
    return summarizeDays(stored, from, to);
  };
  const summaries = {
    today: summarize('today'),
    week: summarize('week'),
    month: summarize('month'),
    quarter: summarize('quarter'),
  };
  const trucksWithYard = trucks.filter((truck) => truck.ifta?.yard_address).length;
  const trucksWithoutYard = trucks.filter((truck) => truck.active && !truck.ifta?.yard_address);
  const toReview = toSettle.filter((day) => {
    const row = days.days[day.key];
    return (row && (row.status === 'needs_review' || row.status === 'failed')) || givenUp(day);
  }).length;
  const quarterReports = quarters.map((key) => {
    const quarter = quarterRangeOf(key) as { from: string; to: string };
    const summary = summarizeDays(stored, quarter.from, quarter.to);
    const expectedDays = expected.days.filter((day) => day.date >= quarter.from && day.date <= quarter.to);
    return { key, quarter, summary, expectedDays, trucks: summarizeByTruck(stored, quarter.from, quarter.to) };
  });
  const toggleQuarter = (key: string) =>
    setOpenQuarters((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const recordById = new Map(records.map((record) => [record.id, record]));

  const toggle = (key: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  async function recalc(items: TruckDay[], force = false) {
    if (busy || !items.length) return;
    setBusy(true);
    resetAttempts(items.map((day) => day.key));
    const error = await recalculate(
      items.map((day) => ({ truck_id: day.truck_id, date: day.date })),
      { force },
    );
    setBusy(false);
    if (error) toast.add({ title: t('Could not recalculate'), description: t(error), type: 'error' });
  }

  async function saveFix(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fix || busy || !fix.reason.place_key) return;
    setBusy(true);
    setFixError(null);
    const error = await fixPlace(fix.reason.place_key, fix.address);
    if (error) {
      setBusy(false);
      setFixError(error);
      return;
    }
    const key = fix.reason.place_key;
    setFix(null);
    toast.add({ title: t('Location saved'), description: t('Days using this address are being recalculated.'), type: 'success' });
    // Every stored day that was waiting on this place, whatever its date.
    const waiting = expected.days.filter((day) =>
      days.days[day.key]?.review_reasons.some((reason) => reason.place_key === key),
    );
    resetAttempts(waiting.map((day) => day.key));
    await recalculate(waiting.map((day) => ({ truck_id: day.truck_id, date: day.date })));
    setBusy(false);
  }

  const statusChip = (item: Shown) => {
    if (item.pending || item.view === 'calculating') {
      return <span className="ld-chip" data-tone="neutral">{t('Calculating…')}</span>;
    }
    if (item.stuck) return <span className="ld-chip" data-tone="error">{t('Failed')}</span>;
    switch (item.view) {
      case 'missing':
      case 'stale':
        return (
          <span className="ld-chip" data-tone="neutral">
            {days.configured && days.mode === 'remote' ? t('Updating…') : t('Out of date')}
          </span>
        );
      case 'current':
        return <span className="ld-chip" data-tone="good">{t('Current')}</span>;
      case 'needs_review':
        return <span className="ld-chip">{t('Needs review')}</span>;
      case 'failed':
        return <span className="ld-chip" data-tone="error">{t('Failed')}</span>;
    }
  };
  const chips = (item: Shown) => (
    <span className="ifta-chips">
      {statusChip(item)}
      {item.changed ? <span className="ld-chip" data-tone="neutral">{t('Settings changed')}</span> : null}
    </span>
  );

  const reasonText = (reason: ReviewReason, day: TruckDay) => {
    const record = reason.ticket_id === undefined ? undefined : recordById.get(reason.ticket_id);
    const number = ticketNumber(record, reason.ticket_id);
    switch (reason.code) {
      case 'yard_missing':
        return t('No yard address on this truck.');
      case 'place_unresolved':
        return reason.suggestion
          ? t('Could not place “{query}”. Did you mean {suggestion}?', { query: reason.query ?? '', suggestion: reason.suggestion })
          : t('Could not place “{query}”.', { query: reason.query ?? '' });
      case 'missing_pickup_address':
        return t('Ticket {number} has no pickup address.', { number });
      case 'missing_delivery_address':
        return t('Ticket {number} has no delivery address.', { number });
      case 'order_ambiguous':
        return t('The order of the loads is uncertain. Enter Time out on each ticket to fix it.');
      case 'no_route':
        return t('No truck route found: {detail}', { detail: reason.detail ?? '' });
      case 'too_many_tickets':
        return t('Too many tickets on one day to route ({count}).', { count: day.records.length });
      case 'mpg_missing':
        return t('No average MPG on this truck, so fuel cannot be estimated.');
    }
  };

  const reasonAction = (reason: ReviewReason) => {
    if (reason.code === 'place_unresolved' && reason.place_key) {
      return (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setFixError(null);
            setFix({ reason, address: reason.suggestion ?? reason.query ?? '' });
          }}
        >
          <MapPin />
          {t('Set location')}
        </Button>
      );
    }
    if (reason.code === 'yard_missing' || reason.code === 'mpg_missing') {
      return (
        <Link href="/fleet" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
          {t('Open Truck Fleet')}
        </Link>
      );
    }
    if (reason.ticket_id !== undefined) {
      const id = reason.ticket_id;
      return (
        <Link
          href="/load-desk"
          onClick={() => setDeskField('editRequest', id)}
          className={buttonVariants({ variant: 'secondary', size: 'sm' })}
        >
          <Pencil data-icon="inline-start" />
          {t('Open ticket')}
        </Link>
      );
    }
    return null;
  };

  /** The legs, reasons and actions under an open day. */
  const detail = (item: Shown) => {
    const { row, day } = item;
    const reasons = row?.review_reasons ?? [];
    const showsFigures = row && row.total_miles !== null && row.legs.length > 0;
    return (
      <div className="ifta-detail">
        {item.stuck ? (
          <p className="ld-notice" data-tone="warning">
            {t('Could not settle this day; try Recalculate.')}
          </p>
        ) : null}
        {row?.status === 'failed' && row.error ? (
          <p className="ld-notice" data-tone="warning">
            {t(row.error)}
            {row.calculated_at
              ? ` ${t('Last calculated {date}.', { date: date(row.calculated_at.slice(0, 10)) })}`
              : ''}
          </p>
        ) : null}
        {reasons.length ? (
          <ul className="ifta-reasons">
            {reasons.map((reason, index) => (
              <li key={`${reason.code}-${reason.ticket_id ?? ''}-${reason.place_key ?? ''}-${index}`}>
                <span>{reasonText(reason, day)}</span>
                {reasonAction(reason)}
              </li>
            ))}
          </ul>
        ) : null}
        {row?.warnings.length ? (
          <ul className="ifta-warnings">
            {row.warnings.map((warning) => (
              <li key={warning}>{t(warning)}</li>
            ))}
          </ul>
        ) : null}
        {showsFigures ? (
          <>
            {row.status !== 'current' || item.view !== 'current' ? (
              <p className="ld-hint">
                {t('Figures from the last successful calculation ({date}).', {
                  date: date(row.calculated_at?.slice(0, 10)),
                })}
              </p>
            ) : null}
            <table className="ifta-legs">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t('From → To')}</th>
                  <th scope="col" className="pf-num">{t('Miles')}</th>
                  <th scope="col" className="pf-num">{t('Time')}</th>
                </tr>
              </thead>
              <tbody>
                {row.legs.map((leg) => (
                  <tr key={leg.seq}>
                    <td>{leg.seq}</td>
                    <td>
                      {leg.from.label} → {leg.to.label}
                      {leg.ticket_id !== null ? (
                        <small>
                          {' '}
                          · {t('Ticket {number}', { number: ticketNumber(recordById.get(leg.ticket_id), leg.ticket_id) })}
                        </small>
                      ) : null}
                    </td>
                    <td className="pf-num">{leg.kind === 'same_place' ? '0' : formatNumber(leg.miles)}</td>
                    <td className="pf-num">
                      {minutes(leg.seconds)}
                      {leg.cached ? (
                        <span className="ifta-cached" title={t('From the route cache')} aria-label={t('From the route cache')} />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}
        <div className="ifta-detail-actions">
          {row?.status === 'failed' || item.stuck ? (
            <Button variant="secondary" size="sm" disabled={busy} onClick={() => void recalc([day])}>
              <RefreshCw />
              {t('Retry')}
            </Button>
          ) : null}
          {item.changed ? (
            <Button variant="secondary" size="sm" disabled={busy} onClick={() => void recalc([day])}>
              <RefreshCw />
              {t('Recalculate')}
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" disabled={busy} onClick={() => void recalc([day], true)}>
            {t('Recalculate from provider')}
          </Button>
        </div>
      </div>
    );
  };

  const routeText = (row: MileageDay | undefined) =>
    row && row.legs.length ? routeLabels(row.legs).join(' → ') : '—';
  const miles = (row: MileageDay | undefined) =>
    row?.total_miles === null || row === undefined ? '—' : formatNumber(row.total_miles);
  const mpg = (row: MileageDay | undefined) => (row?.mpg == null ? '—' : formatNumber(row.mpg));
  const gallons = (row: MileageDay | undefined) =>
    row?.est_gallons == null ? '—' : formatNumber(row.est_gallons);

  const loading = !recordsReady || !profiles.ready || !days.ready;
  const periodOptions = [
    ...IFTA_PERIODS.map(([value, label]) => ({ value: value as string, label: t(label) })),
    // Older quarters, from the reports; the two most recent are presets above.
    ...quarters
      .filter((key) => quarterRangeOf(key)!.to < range.from)
      .map((key) => ({ value: key, label: quarterLabel(key) })),
  ];

  return (
    <div className="ifta-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t('IFTA & MILEAGE')}</p>
          <h1>{t('IFTA & Mileage')}</h1>
          <p className="muted">
            {t('Estimated road miles and fuel per truck and day, from saved tickets.')}
          </p>
        </div>
        <dl className="ld-stats pf-stats">
          <div>
            <dt>{t('Trucks with a yard')}</dt>
            <dd>{trucksWithYard}</dd>
          </div>
          <div>
            <dt>{t('Days to review')}</dt>
            <dd>{toReview}</dd>
          </div>
        </dl>
      </div>

      <div className="page-sheet">
        {days.mode === 'local' ? (
          <div className="ld-notice pf-notice">
            {t('Mileage is worked out on the server and is not available in the local preview.')}
          </div>
        ) : null}
        {days.ready && days.mode === 'remote' && !days.configured ? (
          <div className="ld-notice pf-notice" data-tone="warning">
            {t('Mileage routing is not configured on this deployment. Ask Monius to add the routing key.')}
          </div>
        ) : null}
        {days.error ? (
          <div className="ld-notice pf-notice" data-tone="warning">
            {t(days.error)}
          </div>
        ) : null}
        {profiles.ready && trucksWithoutYard.length ? (
          <div className="ld-notice pf-notice" data-tone="warning">
            {t('{trucks} without a yard address: {numbers}. Enter each truck’s yard in Truck Fleet.', {
              trucks: tr.plural(trucksWithoutYard.length, 'truck'),
              numbers: trucksWithoutYard.map((truck) => `#${truck.truck_number}`).join(', '),
            })}{' '}
            <Link href="/fleet">{t('Open Truck Fleet')}</Link>
          </div>
        ) : null}

        <div className="ifta-tiles">
          <SummaryTile label={t('Today')} summary={summaries.today} tr={tr} />
          <SummaryTile label={t('This Week')} summary={summaries.week} tr={tr} />
          <SummaryTile label={t('This Month')} summary={summaries.month} tr={tr} />
          <SummaryTile label={t('Current Quarter')} summary={summaries.quarter} tr={tr} />
        </div>
        <p className="ld-hint ifta-footnote">
          <Fuel aria-hidden="true" />
          {t('Estimated Fuel Used = route miles ÷ average MPG. Not purchased fuel.')}
        </p>

        <section className="ld-panel pf-section" aria-labelledby="ifta-days-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('Per truck and day')}</p>
              <h2 id="ifta-days-title">{t('Daily mileage')}</h2>
            </div>
            <div className="ifta-controls">
              <SelectField
                id={`${fieldId}-period`}
                value={period}
                options={periodOptions}
                onValueChange={(value) => setPeriod(value)}
              />
              <Button
                variant="ghost"
                size="sm"
                disabled={busy || !shown.length || days.mode !== 'remote'}
                onClick={() => void recalc(shown.map((item) => item.day))}
              >
                <RefreshCw />
                {t('Recalculate period')}
              </Button>
            </div>
          </div>
          {loading ? (
            <p className="ld-empty">{t('Loading mileage…')}</p>
          ) : shown.length === 0 ? (
            <p className="ld-empty">{t('No tickets with a truck and a date in this period.')}</p>
          ) : (
            <>
              <div className="pf-table-wrap">
                <table className="pf-table ifta-table">
                  <thead>
                    <tr>
                      <th scope="col">{t('Truck')}</th>
                      <th scope="col">{t('Date')}</th>
                      <th scope="col" className="pf-num">{t('Loads')}</th>
                      <th scope="col">{t('Route')}</th>
                      <th scope="col" className="pf-num">{t('Est. miles')}</th>
                      <th scope="col" className="pf-num">{t('Avg MPG')}</th>
                      <th scope="col" className="pf-num">{t('Est. fuel used')}</th>
                      <th scope="col">{t('Status')}</th>
                      <th scope="col">
                        <span className="sr-only">{t('Details')}</span>
                      </th>
                    </tr>
                  </thead>
                  {shown.map((item) => {
                    const isOpen = open.has(item.day.key);
                    const detailId = `${fieldId}-${item.day.key.replace(/[^a-z0-9]+/gi, '-')}`;
                    return (
                      <tbody key={item.day.key} data-open={isOpen || undefined}>
                        <tr>
                          <th scope="row" className="pf-name">
                            <strong>#{item.truck.truck_number}</strong>
                            {item.truck.nickname ? <small>{item.truck.nickname}</small> : null}
                          </th>
                          <td className="pf-date">{date(item.day.date)}</td>
                          <td className="pf-num">{item.day.records.length}</td>
                          <td className="ifta-route">{routeText(item.row)}</td>
                          <td className="pf-num">{miles(item.row)}</td>
                          <td className="pf-num">{mpg(item.row)}</td>
                          <td className="pf-num">{gallons(item.row)}</td>
                          <td>{chips(item)}</td>
                          <td>
                            <button
                              type="button"
                              className="ifta-toggle"
                              aria-expanded={isOpen}
                              aria-controls={detailId}
                              aria-label={t('Details for truck {number} on {date}', {
                                number: item.truck.truck_number,
                                date: date(item.day.date),
                              })}
                              onClick={() => toggle(item.day.key)}
                            >
                              <ChevronDown aria-hidden="true" />
                            </button>
                          </td>
                        </tr>
                        {isOpen ? (
                          <tr className="ifta-detail-row" id={detailId}>
                            <td colSpan={9}>{detail(item)}</td>
                          </tr>
                        ) : null}
                      </tbody>
                    );
                  })}
                </table>
              </div>
              <ul className="pf-cards">
                {shown.map((item) => {
                  const isOpen = open.has(item.day.key);
                  const detailId = `${fieldId}-card-${item.day.key.replace(/[^a-z0-9]+/gi, '-')}`;
                  return (
                    <li key={item.day.key} className="pf-card">
                      <div className="pf-card-head">
                        <div>
                          <strong>
                            #{item.truck.truck_number}
                            {chips(item)}
                          </strong>
                          <small>
                            {date(item.day.date)} · {tr.plural(item.day.records.length, 'load')}
                          </small>
                        </div>
                        <button
                          type="button"
                          className="ifta-toggle"
                          aria-expanded={isOpen}
                          aria-controls={detailId}
                          aria-label={t('Details for truck {number} on {date}', {
                            number: item.truck.truck_number,
                            date: date(item.day.date),
                          })}
                          onClick={() => toggle(item.day.key)}
                        >
                          <ChevronDown aria-hidden="true" />
                        </button>
                      </div>
                      <p className="ifta-route-line">
                        <Route aria-hidden="true" />
                        {routeText(item.row)}
                      </p>
                      <dl className="rec-card-facts">
                        <div>
                          <dt>{t('Miles')}</dt>
                          <dd>{miles(item.row)}</dd>
                        </div>
                        <div>
                          <dt>{t('MPG')}</dt>
                          <dd>{mpg(item.row)}</dd>
                        </div>
                        <div>
                          <dt>{t('Fuel')}</dt>
                          <dd>{gallons(item.row)}</dd>
                        </div>
                      </dl>
                      {isOpen ? <div id={detailId}>{detail(item)}</div> : null}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>

        <section className="ld-panel pf-section" aria-labelledby="ifta-quarters-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('IFTA periods')}</p>
              <h2 id="ifta-quarters-title">{t('Quarterly reports')}</h2>
            </div>
            <span className="ld-hint">
              {t('Every quarter since the first saved ticket. Open a quarter to calculate and see its days.')}
            </span>
          </div>
          {loading ? (
            <p className="ld-empty">{t('Loading mileage…')}</p>
          ) : (
            <ul className="ifta-quarters">
              {quarterReports.map(({ key, quarter, summary, expectedDays, trucks: perTruck }) => {
                const isOpen = openQuarters.has(key);
                const detailId = `${fieldId}-quarter-${key}`;
                const viewing = period === key || (shownRange.from === quarter.from && shownRange.to === quarter.to);
                const calculated = summary.days;
                return (
                  <li key={key} className="ifta-quarter" data-open={isOpen || undefined} data-current={viewing || undefined}>
                    <div className="ifta-quarter-row">
                      <button
                        type="button"
                        className="ifta-quarter-toggle"
                        aria-expanded={isOpen}
                        aria-controls={detailId}
                        onClick={() => toggleQuarter(key)}
                      >
                        <ChevronDown aria-hidden="true" />
                        <span className="ifta-quarter-name">
                          <strong>
                            <CalendarRange aria-hidden="true" />
                            {quarterLabel(key)}
                          </strong>
                          <small>
                            {date(quarter.from)} – {date(quarter.to)}
                          </small>
                        </span>
                      </button>
                      <dl className="ifta-quarter-facts">
                        <div>
                          <dt>{t('Est. miles')}</dt>
                          <dd>{formatNumber(summary.miles)}</dd>
                        </div>
                        <div>
                          <dt>{t('Est. fuel used')}</dt>
                          <dd>{formatNumber(summary.gallons)} <small>{t('gal')}</small></dd>
                        </div>
                        <div>
                          <dt>{t('Loads')}</dt>
                          <dd>{summary.loads}</dd>
                        </div>
                        <div>
                          <dt>{t('Trucks')}</dt>
                          <dd>{summary.trucks}</dd>
                        </div>
                        <div>
                          <dt>{t('Days')}</dt>
                          <dd>
                            {t('{done} of {all}', { done: calculated, all: expectedDays.length })}
                            {summary.review ? (
                              <small className="ifta-tile-review"> · {t('{n} to review', { n: summary.review })}</small>
                            ) : null}
                          </dd>
                        </div>
                      </dl>
                      <div className="ifta-quarter-actions">
                        {expectedDays.length && calculated < expectedDays.length && !viewing ? (
                          <span className="ld-chip" data-tone="neutral">{t('Not fully calculated')}</span>
                        ) : null}
                        <Button
                          variant={viewing ? 'default' : 'secondary'}
                          size="sm"
                          disabled={!expectedDays.length}
                          onClick={() => {
                            setPeriod(key);
                            document.getElementById('ifta-days-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                        >
                          {viewing ? t('Viewing') : t('View days')}
                        </Button>
                      </div>
                    </div>
                    {isOpen ? (
                      <div id={detailId} className="ifta-quarter-detail">
                        {perTruck.length ? (
                          <table className="ifta-legs">
                            <thead>
                              <tr>
                                <th scope="col">{t('Truck')}</th>
                                <th scope="col" className="pf-num">{t('Days')}</th>
                                <th scope="col" className="pf-num">{t('Loads')}</th>
                                <th scope="col" className="pf-num">{t('Est. miles')}</th>
                                <th scope="col" className="pf-num">{t('Est. fuel used')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {perTruck.map((truck) => (
                                <tr key={truck.truck_id}>
                                  <td>
                                    #{truck.truck_number}
                                    {truck.review ? (
                                      <small> · {t('{n} to review', { n: truck.review })}</small>
                                    ) : null}
                                  </td>
                                  <td className="pf-num">{truck.days}</td>
                                  <td className="pf-num">{truck.loads}</td>
                                  <td className="pf-num">{formatNumber(truck.miles)}</td>
                                  <td className="pf-num">{formatNumber(truck.gallons)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="ld-hint">
                            {expectedDays.length
                              ? t('No days calculated yet. Open the quarter with View days to calculate them.')
                              : t('No tickets with a truck and a date in this quarter.')}
                          </p>
                        )}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {expected.excluded.length ? (
          <section className="ld-panel pf-section" aria-labelledby="ifta-excluded-title">
            <div className="ld-panel-head">
              <div>
                <p className="ld-step">{t('From saved tickets')}</p>
                <h2 id="ifta-excluded-title">{t('Not included')}</h2>
              </div>
              <span className="ld-hint">
                {t('{tickets} without a truck or a date', {
                  tickets: tr.plural(expected.excluded.length, 'ticket'),
                })}
              </span>
            </div>
            <ul className="pf-suggestions">
              {expected.excluded.slice(0, 20).map(({ record, reason }) => (
                <li key={record.id}>
                  <div>
                    <strong>{t('Ticket {number}', { number: ticketNumber(record, record.id) })}</strong>
                    <small>
                      {reason === 'no_truck'
                        ? record.invoice.truck_number
                          ? t('Truck #{number} has no profile', { number: record.invoice.truck_number })
                          : t('No truck on the ticket')
                        : t('No usable ticket date')}
                    </small>
                  </div>
                  {reason === 'no_truck' ? (
                    <Link href="/fleet" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
                      {t('Open Truck Fleet')}
                    </Link>
                  ) : (
                    <Link
                      href="/load-desk"
                      onClick={() => setDeskField('editRequest', record.id)}
                      className={buttonVariants({ variant: 'secondary', size: 'sm' })}
                    >
                      <Pencil data-icon="inline-start" />
                      {t('Open ticket')}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="ld-hint ifta-footer">
          {t(
            'Routes follow roads open to each truck’s configured profile as far as TomTom data allows. They are estimates, not legal guidance, and are not yet split by state.',
          )}
        </p>
      </div>

      <Dialog
        open={fix !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setFix(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {fix ? (
            <form className="pf-form" onSubmit={(event) => void saveFix(event)}>
              <DialogHeader>
                <DialogTitle>{t('Set location')}</DialogTitle>
                <DialogDescription>
                  {t('Type the full street address once; every ticket printed with this text will use it.')}
                </DialogDescription>
              </DialogHeader>
              <div className="ld-fields pf-fields">
                <label className="ld-field" data-span={2} htmlFor={`${fieldId}-fix-original`}>
                  <span>{t('As printed on tickets')}</span>
                  <Input id={`${fieldId}-fix-original`} value={fix.reason.query ?? ''} readOnly />
                </label>
                <label className="ld-field" data-span={2} htmlFor={`${fieldId}-fix-address`}>
                  <span>{t('Street address')}</span>
                  <Input
                    id={`${fieldId}-fix-address`}
                    required
                    maxLength={200}
                    placeholder={t('Number and street, city, state and ZIP')}
                    value={fix.address}
                    onChange={(event) => setFix({ ...fix, address: event.target.value })}
                  />
                </label>
              </div>
              {fixError ? (
                <p className="ld-status" data-tone="error" role="alert">
                  {t(fixError)}
                </p>
              ) : null}
              <DialogFooter showCloseButton>
                <Button type="submit" disabled={busy}>
                  {busy ? t('Saving…') : t('Save location')}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
