'use client';

import { useEffect, useId, useMemo, useState, useSyncExternalStore, type SyntheticEvent } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Fuel, MapPin, Pencil, RefreshCw, Route } from 'lucide-react';
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
import RouteMap from '@/components/mileage/route-map';
import { useProfiles, useRecords } from '@/components/profiles/profile-ui';
import type { Translator } from '@/lib/i18n/translate';
import { useT } from '@/lib/i18n/use-t';
import { setDeskField } from '@/lib/load-desk/desk-session';
import { watchForChanges } from '@/lib/load-desk/live';
import {
  dayKey,
  dayView,
  deliveryQuery,
  formatNumber,
  IFTA_PERIODS,
  isQuarterKey,
  orderRecords,
  periodRange,
  pickupQuery,
  placeKey,
  quarterKeyOf,
  quarterKeys,
  quarterLabel,
  quarterRangeOf,
  routeLabels,
  settingsChanged,
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
  confirmStopOrder,
  fixPlace,
  getDaysSnapshot,
  getServerDaysSnapshot,
  givenUp,
  loadDayDetail,
  loadDays,
  loadRanges,
  recalculate,
  resetAttempts,
  settleDays,
  subscribeDays,
} from '@/lib/load-desk/mileage-days';
import { legsWithStops, stopsFromLegs } from '@/lib/load-desk/route-geometry';
import { ticketDateColumn } from '@/lib/load-desk/record-input';
import type { TruckProfile } from '@/lib/load-desk/profiles';
import type { SavedRecord } from '@/lib/load-desk/types';

// Mileage: estimated road miles and fuel per truck and day, from the tickets
// already saved. This is the page a day is looked at on — its route on the
// map, its legs, and whatever it needs a person for. The page keeps the stored
// days in step with the tickets by itself; a person only steps in where a
// ticket, a place or the order of the loads needs their eyes. What a quarter
// adds up to is IFTA's page, not this one.

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

/** What the page loads: last quarter through the end of this one. */
const loadedRange = (now: Date) => ({
  from: periodRange('last_quarter', now).from,
  to: periodRange('quarter', now).to,
});

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The shortest period that holds a date, for a day opened from a link. A date
 * older than last quarter falls back to its own quarter, which the period list
 * carries once its tickets are loaded.
 */
function periodFor(date: string, now: Date): string {
  for (const [period] of IFTA_PERIODS) {
    const range = periodRange(period, now);
    if (date >= range.from && date <= range.to) return period;
  }
  return quarterKeyOf(date);
}

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
    <div className="ld-panel hm-stat mileage-tile">
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
        <p className="hm-stat-sub mileage-tile-review">{t('{n} to review', { n: summary.review })}</p>
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

export default function MileagePage() {
  const { records, ready: recordsReady } = useRecords();
  const profiles = useProfiles();
  const days = useDays();
  const tr = useT();
  const { t, date } = tr;
  const { trucks } = profiles;
  const search = useSyncExternalStore(subscribeSearch, getSearch, getServerSearch);
  const [now] = useState(() => new Date());
  /** A preset period, or a past quarter as "YYYY-Qn"; null follows the link. */
  const [period, setPeriod] = useState<string | null>(null);
  /** The day being looked at, as `${truck_id}|${date}`; null follows the link. */
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedLeg, setSelectedLeg] = useState<number | null>(null);
  /** The order being edited, while a person is moving the loads about. */
  const [order, setOrder] = useState<{ key: string; ids: number[] } | null>(null);
  const [fix, setFix] = useState<{ reason: ReviewReason; address: string } | null>(null);
  const [fixError, setFixError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fieldId = useId();

  // The day a link asks for, until a person picks another one. The period
  // moves with it, so the list the day belongs to is the one on the screen.
  const asked = useMemo(() => {
    const params = new URLSearchParams(search);
    const truck = Number(params.get('truck'));
    const day = params.get('date') ?? '';
    if (!Number.isInteger(truck) || truck <= 0 || !ISO_DATE.test(day)) return null;
    return { key: dayKey(truck, day), date: day };
  }, [search]);
  const shownPeriod = period ?? (asked ? periodFor(asked.date, now) : 'week');
  const selectedKey = selected ?? asked?.key ?? null;

  const range = useMemo(() => loadedRange(now), [now]);
  const shownRange = useMemo(
    () =>
      quarterRangeOf(shownPeriod) ??
      periodRange(isQuarterKey(shownPeriod) ? 'quarter' : (shownPeriod as IftaPeriod), now),
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

  // Every quarter from the first dated ticket to now, so a past quarter can be
  // picked as a period. The past ones are loaded once; their days are only
  // calculated while they are being looked at.
  const quarters = useMemo(() => {
    let earliest = range.from;
    for (const record of records) {
      const ticketDate = ticketDateColumn(record.ticket);
      if (ticketDate && ticketDate < earliest) earliest = ticketDate;
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

  // Whatever the tickets say now, the stored days follow — for the current and
  // last quarter always, and for a past quarter while it is being looked at,
  // so a long history is not sent to the provider all at once.
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

  // The open day's legs carry their lines on the map, which the list does not
  // need and does not fetch. Asked for again whenever the day is recalculated.
  const selectedRow = selectedKey ? days.days[selectedKey] : undefined;
  const detailRequest = selectedKey
    ? `${selectedKey}|${selectedRow?.input_hash ?? ''}|${selectedRow?.calculated_at ?? ''}`
    : null;
  useEffect(() => {
    if (!detailRequest) return;
    const [truckId, day] = detailRequest.split('|');
    void loadDayDetail(Number(truckId), day);
  }, [detailRequest]);

  // On a phone the detail is below the fold, so a tap goes to it.
  useEffect(() => {
    if (!selectedKey || !window.matchMedia('(max-width: 720px)').matches) return;
    document.getElementById('mileage-day')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedKey]);

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
  const open = shown.find((item) => item.day.key === selectedKey) ?? null;
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
  const recordById = new Map(records.map((record) => [record.id, record]));

  const select = (key: string) => {
    setSelected(key);
    setSelectedLeg(null);
    setOrder(null);
  };

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

  /** The order a person set, saved and then calculated with. */
  async function saveOrder(item: Shown, ids: number[]) {
    if (busy || !ids.length) return;
    setBusy(true);
    const error = await confirmStopOrder(item.day.truck_id, item.day.date, ids);
    if (error) {
      setBusy(false);
      toast.add({ title: t('Could not confirm the order'), description: t(error), type: 'error' });
      return;
    }
    setBusy(false);
    setOrder(null);
    toast.add({
      title: t('Order confirmed'),
      description: t('The day has been worked out in the order you set.'),
      type: 'success',
    });
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
    <span className="mileage-chips">
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
        return t('The order of the loads is uncertain. Put them in the order they were hauled, or enter Time out on each ticket.');
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
    // Older quarters; the two most recent are presets above.
    ...quarters
      .filter((key) => quarterRangeOf(key)!.to < range.from)
      .map((key) => ({ value: key, label: quarterLabel(key) })),
  ];

  /** Everything the open day shows, from the map down to what can be done. */
  const dayDetail = (item: Shown) => {
    const { row, day } = item;
    const reasons = row?.review_reasons ?? [];
    const showsFigures = !!row && row.total_miles !== null && row.legs.length > 0;
    const legs = row?.legs ?? [];

    // What the day's places are called: the calculated legs know, and before
    // there are any the tickets' own text stands in for the names.
    const labels = new Map<string, string>();
    for (const leg of legs) {
      labels.set(leg.from.place_key, leg.from.label);
      labels.set(leg.to.place_key, leg.to.label);
    }
    const labelFor = (query: string | null, fallback: string) => {
      if (!query) return fallback;
      return labels.get(placeKey(query)) ?? query;
    };
    const yardLabel = legs.length ? legs[0].from.label : t('Yard');
    const stopOf = (id: number, kind: 'pickup' | 'delivery') => {
      const record = recordById.get(id);
      if (!record) return t('Ticket {number}', { number: `#${id}` });
      return kind === 'pickup'
        ? labelFor(pickupQuery(record.ticket), t('No pickup address'))
        : labelFor(deliveryQuery(record.ticket), t('No delivery address'));
    };

    // The order the estimate used, and the order being edited on top of it.
    const ambiguous = reasons.find((reason) => reason.code === 'order_ambiguous');
    const usedOrder =
      ambiguous?.ticket_ids?.length
        ? ambiguous.ticket_ids
        : row?.stop_order?.ticket_ids.length
          ? row.stop_order.ticket_ids
          : orderRecords(day.records).records.map((record) => record.id);
    const editing = order?.key === day.key;
    const orderIds = editing ? order.ids : usedOrder;
    const showsOrder = !!ambiguous || editing;
    const move = (index: number, by: -1 | 1) => {
      const next = [...orderIds];
      const to = index + by;
      if (to < 0 || to >= next.length) return;
      [next[index], next[to]] = [next[to], next[index]];
      setOrder({ key: day.key, ids: next });
    };

    // The route on the map: the day's stops, and each leg with the line the
    // provider drew for it, as far as the stored geometry reaches.
    const mapStops = stopsFromLegs(legs);
    const mapLegs = legsWithStops(legs, mapStops).map(({ leg, from, to }) => ({
      seq: leg.seq,
      kind: leg.kind,
      miles: leg.miles,
      from,
      to,
      geometry: (leg.route_id === null ? null : days.geometry[String(leg.route_id)]) ?? null,
    }));
    const unresolved = reasons
      .filter((reason) => reason.code === 'place_unresolved' || reason.code === 'yard_missing')
      .map((reason) => ({ label: reason.code === 'yard_missing' ? t('Yard') : (reason.query ?? '') }));
    // A stop that could not be placed is missing from the drawing; a leg
    // without geometry is drawn straight; a day not calculated yet has nothing
    // to draw at all. Either way the map says so itself.
    const mapStatus = unresolved.length
      ? ('review' as const)
      : !mapLegs.length
        ? ('empty' as const)
        : mapLegs.some((leg) => !leg.geometry)
          ? ('incomplete' as const)
          : ('complete' as const);

    return (
      <section className="ld-panel pf-section mileage-day" id="mileage-day" aria-labelledby="mileage-day-title">
        <div className="ld-panel-head">
          <div>
            <p className="ld-step">{t('Selected day')}</p>
            <h2 id="mileage-day-title">
              {t('Truck #{number} · {date}', { number: item.truck.truck_number, date: date(day.date) })}
            </h2>
          </div>
          <span className="mileage-chips">
            {chips(item)}
            {row?.stop_order ? (
              <span className="ld-chip" data-tone="good">{t('Order confirmed')}</span>
            ) : null}
          </span>
        </div>

        <dl className="rec-card-facts mileage-facts">
          <div>
            <dt>{t('Loads')}</dt>
            <dd>{day.records.length}</dd>
          </div>
          <div>
            <dt>{t('Est. miles')}</dt>
            <dd>{miles(row)}</dd>
          </div>
          <div>
            <dt>{t('Avg MPG')}</dt>
            <dd>{mpg(row)}</dd>
          </div>
          <div>
            <dt>{t('Est. fuel used')}</dt>
            <dd>
              {gallons(row)} <small>{t('gal')}</small>
            </dd>
          </div>
          <div>
            <dt>{t('Drive time')}</dt>
            <dd>{row?.total_seconds == null ? '—' : minutes(row.total_seconds)}</dd>
          </div>
        </dl>

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

        <RouteMap
          stops={mapStops}
          legs={mapLegs}
          status={mapStatus}
          unresolved={unresolved}
          title={t('Truck #{number} · {date}', { number: item.truck.truck_number, date: date(day.date) })}
          selectedLeg={selectedLeg}
          onSelectLeg={(seq) => setSelectedLeg(seq)}
        />

        <p className="mileage-route-line">
          <Route aria-hidden="true" />
          {legs.length
            ? routeText(row)
            : [yardLabel, ...usedOrder.flatMap((id) => [stopOf(id, 'pickup'), stopOf(id, 'delivery')]), yardLabel].join(
                ' → ',
              )}
        </p>

        {showsFigures ? (
          <>
            {row.status !== 'current' || item.view !== 'current' ? (
              <p className="ld-hint">
                {t('Figures from the last successful calculation ({date}).', {
                  date: date(row.calculated_at?.slice(0, 10)),
                })}
              </p>
            ) : null}
            <table className="mileage-legs">
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
                  <tr key={leg.seq} data-selected={leg.seq === selectedLeg || undefined}>
                    <td>
                      <button
                        type="button"
                        className="mileage-leg-pick"
                        aria-pressed={leg.seq === selectedLeg}
                        onClick={() => setSelectedLeg(leg.seq === selectedLeg ? null : leg.seq)}
                      >
                        {leg.seq}
                      </button>
                    </td>
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
                        <span className="mileage-cached" title={t('From the route cache')} aria-label={t('From the route cache')} />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}

        {reasons.length || showsOrder ? (
          <div className="mileage-review">
            <h3>{reasons.length ? t('Route needs review') : t('Stop order')}</h3>
            {reasons.length ? (
              <ul className="mileage-reasons">
                {reasons.map((reason, index) => (
                  <li key={`${reason.code}-${reason.ticket_id ?? ''}-${reason.place_key ?? ''}-${index}`}>
                    <span>{reasonText(reason, day)}</span>
                    {reasonAction(reason)}
                  </li>
                ))}
              </ul>
            ) : null}
            {showsOrder ? (
              <div className="mileage-order">
                <p className="ld-hint">
                  {t('The stops in the order the estimate used. Move a load until it matches the day, then confirm it.')}
                </p>
                <ol className="mileage-order-list">
                  <li className="mileage-order-stop">
                    <span className="mileage-order-num">1</span>
                    <span>{yardLabel}</span>
                  </li>
                  {orderIds.map((id, index) => (
                    <li key={id} className="mileage-order-load">
                      <div className="mileage-order-stops">
                        <p>
                          <span className="mileage-order-num">{2 + index * 2}</span>
                          <span>
                            {stopOf(id, 'pickup')}{' '}
                            <small>
                              {t('Ticket {number}', { number: ticketNumber(recordById.get(id), id) })}
                            </small>
                          </span>
                        </p>
                        <p>
                          <span className="mileage-order-num">{3 + index * 2}</span>
                          <span>{stopOf(id, 'delivery')}</span>
                        </p>
                      </div>
                      <div className="mileage-order-move">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={busy || index === 0}
                          aria-label={t('Move ticket {number} earlier', {
                            number: ticketNumber(recordById.get(id), id),
                          })}
                          onClick={() => move(index, -1)}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={busy || index === orderIds.length - 1}
                          aria-label={t('Move ticket {number} later', {
                            number: ticketNumber(recordById.get(id), id),
                          })}
                          onClick={() => move(index, 1)}
                        >
                          <ArrowDown />
                        </Button>
                      </div>
                    </li>
                  ))}
                  <li className="mileage-order-stop">
                    <span className="mileage-order-num">{2 + orderIds.length * 2}</span>
                    <span>{yardLabel}</span>
                  </li>
                </ol>
                <div className="mileage-order-actions">
                  <Button size="sm" disabled={busy || !orderIds.length} onClick={() => void saveOrder(item, orderIds)}>
                    {t('Confirm order')}
                  </Button>
                  {editing ? (
                    <Button variant="ghost" size="sm" disabled={busy} onClick={() => setOrder(null)}>
                      {t('Cancel')}
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {row?.warnings.length ? (
          <ul className="mileage-warnings">
            {row.warnings.map((warning) => (
              <li key={warning}>{t(warning)}</li>
            ))}
          </ul>
        ) : null}

        <div className="mileage-day-actions">
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
          {row?.stop_order && !showsOrder ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => setOrder({ key: day.key, ids: usedOrder })}
            >
              {t('Change order')}
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" disabled={busy} onClick={() => void recalc([day], true)}>
            {t('Recalculate from provider')}
          </Button>
        </div>
      </section>
    );
  };

  return (
    <div className="mileage-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t('MILEAGE')}</p>
          <h1>{t('Mileage')}</h1>
          <p className="muted">
            {t('Estimated road miles and fuel per truck and day, from saved tickets.')}
          </p>
          <Link href="/ifta" className="mileage-ifta-link">
            {t('IFTA reporting')} <span aria-hidden="true">→</span>
          </Link>
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

        <div className="mileage-tiles">
          <SummaryTile label={t('Today')} summary={summaries.today} tr={tr} />
          <SummaryTile label={t('This Week')} summary={summaries.week} tr={tr} />
          <SummaryTile label={t('This Month')} summary={summaries.month} tr={tr} />
          <SummaryTile label={t('Current Quarter')} summary={summaries.quarter} tr={tr} />
        </div>
        <p className="ld-hint mileage-footnote">
          <Fuel aria-hidden="true" />
          {t('Estimated Fuel Used = route miles ÷ average MPG. Not purchased fuel.')}
        </p>

        <section className="ld-panel pf-section" aria-labelledby="mileage-days-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('Per truck and day')}</p>
              <h2 id="mileage-days-title">{t('Daily mileage')}</h2>
            </div>
            <div className="mileage-controls">
              <SelectField
                id={`${fieldId}-period`}
                value={shownPeriod}
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
              <p className="ld-hint">{t('Pick a day to see its route, its legs and anything it needs.')}</p>
              <div className="pf-table-wrap">
                <table className="pf-table mileage-table">
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
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((item) => (
                      <tr
                        key={item.day.key}
                        aria-selected={item.day.key === selectedKey}
                        data-selected={item.day.key === selectedKey || undefined}
                        onClick={() => select(item.day.key)}
                      >
                        <th scope="row" className="pf-name">
                          <button
                            type="button"
                            className="mileage-pick"
                            aria-label={t('Open truck {number} on {date}', {
                              number: item.truck.truck_number,
                              date: date(item.day.date),
                            })}
                            onClick={() => select(item.day.key)}
                          >
                            <strong>#{item.truck.truck_number}</strong>
                            {item.truck.nickname ? <small>{item.truck.nickname}</small> : null}
                          </button>
                        </th>
                        <td className="pf-date">{date(item.day.date)}</td>
                        <td className="pf-num">{item.day.records.length}</td>
                        <td className="mileage-route">{routeText(item.row)}</td>
                        <td className="pf-num">{miles(item.row)}</td>
                        <td className="pf-num">{mpg(item.row)}</td>
                        <td className="pf-num">{gallons(item.row)}</td>
                        <td>{chips(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="pf-cards">
                {shown.map((item) => (
                  <li
                    key={item.day.key}
                    className="pf-card mileage-card"
                    data-selected={item.day.key === selectedKey || undefined}
                  >
                    <button
                      type="button"
                      className="mileage-card-pick"
                      aria-pressed={item.day.key === selectedKey}
                      onClick={() => select(item.day.key)}
                    >
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
                      </div>
                      <p className="mileage-route-line">
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
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {open ? dayDetail(open) : null}

        {expected.excluded.length ? (
          <section className="ld-panel pf-section" aria-labelledby="mileage-excluded-title">
            <div className="ld-panel-head">
              <div>
                <p className="ld-step">{t('From saved tickets')}</p>
                <h2 id="mileage-excluded-title">{t('Not included')}</h2>
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

        <p className="ld-hint mileage-footer">
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
