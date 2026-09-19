'use client';

import { useEffect, useId, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, Fuel } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { useProfiles, useRecords } from '@/components/profiles/profile-ui';
import { useT } from '@/lib/i18n/use-t';
import { watchForChanges } from '@/lib/load-desk/live';
import {
  dayView,
  formatNumber,
  periodRange,
  quarterKeyOf,
  quarterKeys,
  quarterLabel,
  quarterRangeOf,
  summarizeByTruck,
  summarizeDays,
  truckDays,
  truckIfta,
  type DayView,
  type MileageDay,
  type ReviewReason,
  type TruckDay,
} from '@/lib/load-desk/mileage';
import {
  getDaysSnapshot,
  getServerDaysSnapshot,
  loadDays,
  loadRanges,
  subscribeDays,
} from '@/lib/load-desk/mileage-days';
import { ticketDateColumn } from '@/lib/load-desk/record-input';
import type { SavedRecord } from '@/lib/load-desk/types';

// IFTA: what a quarter adds up to for fuel-tax reporting. Every figure here is
// read from the days Mileage worked out — this page asks the server for the
// quarter on screen and changes nothing. Where a day is not settled it says so
// and sends the person to Mileage, which owns the routes.

const useDays = () =>
  useSyncExternalStore(subscribeDays, getDaysSnapshot, getServerDaysSnapshot);

/** How many days needing attention are listed before the count takes over. */
const MAX_LISTED = 50;

const ticketNumber = (record: SavedRecord | undefined, id: number | undefined) =>
  record?.ticket.ticket_number || (id === undefined ? '' : `#${id}`);

/** A day of the quarter the totals cannot count yet, and what is stored for it. */
type Attention = { day: TruckDay; view: DayView; row: MileageDay | undefined };

export default function IftaPage() {
  const { records, ready: recordsReady } = useRecords();
  const profiles = useProfiles();
  const days = useDays();
  const tr = useT();
  const { t, date } = tr;
  const { trucks } = profiles;
  const [now] = useState(() => new Date());
  const thisQuarter = quarterKeyOf(periodRange('quarter', now).from);
  const [quarter, setQuarter] = useState(thisQuarter);
  const fieldId = useId();

  const range = useMemo(
    () => quarterRangeOf(quarter) ?? periodRange('quarter', now),
    [quarter, now],
  );

  // Only the quarter on screen is asked for. A past quarter is loaded once and
  // kept; the current one is asked again while the page is being looked at.
  useEffect(() => {
    if (quarter !== thisQuarter) {
      void loadRanges([range]);
      return;
    }
    void loadDays(range);
    return watchForChanges(() => void loadDays(range));
  }, [quarter, thisQuarter, range]);

  // Every quarter from the first dated ticket to the current one, newest first.
  const quarters = useMemo(() => {
    const current = periodRange('quarter', now);
    let earliest = current.from;
    for (const record of records) {
      const day = ticketDateColumn(record.ticket);
      if (day && day < earliest) earliest = day;
    }
    return quarterKeys(earliest, current.to);
  }, [records, now]);

  const stored = useMemo(() => Object.values(days.days), [days.days]);
  const summary = useMemo(
    () => summarizeDays(stored, range.from, range.to),
    [stored, range],
  );
  const perTruck = useMemo(
    () => summarizeByTruck(stored, range.from, range.to),
    [stored, range],
  );
  const expected = useMemo(
    () => truckDays(records, trucks, range),
    [records, trucks, range],
  );
  const recordById = useMemo(
    () => new Map(records.map((record) => [record.id, record])),
    [records],
  );

  // What the tickets say the quarter has, next to what is stored for it.
  const readiness = useMemo(() => {
    let complete = 0;
    let review = 0;
    let failed = 0;
    let waiting = 0;
    const attention: Attention[] = [];
    for (const day of expected.days) {
      const row = days.days[day.key];
      const view = dayView(row, day.input_hash);
      if (view === 'current') complete += 1;
      else if (view === 'needs_review') review += 1;
      else if (view === 'failed') failed += 1;
      else waiting += 1;
      if (view !== 'current') attention.push({ day, view, row });
    }
    return { complete, review, failed, waiting, attention };
  }, [expected, days.days]);

  const active = trucks.filter((truck) => truck.active);
  const withoutYard = active.filter((truck) => !truck.ifta?.yard_address);
  const withoutMpg = active.filter((truck) => !((truckIfta(truck).mpg ?? 0) > 0));
  const numbersOf = (list: typeof trucks) =>
    list.map((truck) => `#${truck.truck_number}`).join(', ');

  /** The wording of a review reason, short enough for one line. */
  const reasonText = (reason: ReviewReason, day: TruckDay) => {
    const number = ticketNumber(
      reason.ticket_id === undefined ? undefined : recordById.get(reason.ticket_id),
      reason.ticket_id,
    );
    switch (reason.code) {
      case 'yard_missing':
        return t('No yard address on this truck.');
      case 'place_unresolved':
        return t('Could not place “{query}”.', { query: reason.query ?? '' });
      case 'missing_pickup_address':
        return t('Ticket {number} has no pickup address.', { number });
      case 'missing_delivery_address':
        return t('Ticket {number} has no delivery address.', { number });
      case 'order_ambiguous':
        return t('The order of the loads is uncertain.');
      case 'no_route':
        return t('No truck route found: {detail}', { detail: reason.detail ?? '' });
      case 'too_many_tickets':
        return t('Too many tickets on one day to route ({count}).', {
          count: day.records.length,
        });
      case 'mpg_missing':
        return t('No average MPG on this truck, so fuel cannot be estimated.');
    }
  };

  const dayReason = ({ day, view, row }: Attention) => {
    if (view !== 'needs_review' && view !== 'failed') {
      return t('Not calculated yet. Open Mileage to calculate.');
    }
    const first = row?.review_reasons[0];
    if (first) return reasonText(first, day);
    if (row?.error) return t(row.error);
    return t('Could not calculate this day.');
  };

  const loading = !recordsReady || !profiles.ready || !days.ready;
  const listed = readiness.attention.slice(0, MAX_LISTED);
  const quarterOptions = quarters.map((key) => ({ value: key, label: quarterLabel(key) }));

  return (
    <div className="ifta-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t('FUEL-TAX REPORTING')}</p>
          <h1>{t('IFTA')}</h1>
          <p className="muted">
            {t('Quarterly mileage for fuel-tax reporting, from the routes worked out in Mileage.')}
          </p>
          <Link href="/mileage" className="ifta-open">
            {t('Open Mileage')}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <dl className="ld-stats">
          <div>
            <dt>{t('Quarter')}</dt>
            <dd>{quarterLabel(quarter)}</dd>
          </div>
          <div>
            <dt>{t('Est. miles')}</dt>
            <dd>{formatNumber(summary.miles)}</dd>
          </div>
          <div>
            <dt>{t('Days to review')}</dt>
            <dd>{readiness.review + readiness.failed}</dd>
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
        {profiles.ready && withoutYard.length ? (
          <div className="ld-notice pf-notice" data-tone="warning">
            {t('{trucks} without a yard address: {numbers}. Enter each truck’s yard in Truck Fleet.', {
              trucks: tr.plural(withoutYard.length, 'truck'),
              numbers: numbersOf(withoutYard),
            })}{' '}
            <Link href="/fleet">{t('Open Truck Fleet')}</Link>
          </div>
        ) : null}
        {profiles.ready && withoutMpg.length ? (
          <div className="ld-notice pf-notice" data-tone="warning">
            {t('{trucks} without an average MPG: {numbers}. Fuel cannot be estimated for them.', {
              trucks: tr.plural(withoutMpg.length, 'truck'),
              numbers: numbersOf(withoutMpg),
            })}{' '}
            <Link href="/fleet">{t('Open Truck Fleet')}</Link>
          </div>
        ) : null}

        <div className="ifta-toolbar">
          <label className="ifta-quarter-field" htmlFor={`${fieldId}-quarter`}>
            <span>{t('Quarter')}</span>
            <SelectField
              id={`${fieldId}-quarter`}
              value={quarter}
              options={quarterOptions}
              onValueChange={(value) => setQuarter(value)}
            />
          </label>
          <p className="ld-hint">
            {date(range.from)} – {date(range.to)}
          </p>
        </div>

        <div className="ifta-tiles">
          <div className="ld-panel hm-stat ifta-tile">
            <p className="hm-stat-label">{t('Estimated miles')}</p>
            <p className="hm-stat-value">
              {formatNumber(summary.miles)} <small>{t('mi')}</small>
            </p>
            <p className="hm-stat-sub">
              {t('{days} counted', { days: tr.plural(summary.days, 'day') })}
            </p>
          </div>
          <div className="ld-panel hm-stat ifta-tile">
            <p className="hm-stat-label">{t('Estimated fuel used')}</p>
            <p className="hm-stat-value">
              {formatNumber(summary.gallons)} <small>{t('gal')}</small>
            </p>
            <p className="hm-stat-sub">{t('At each truck’s average MPG')}</p>
          </div>
          <div className="ld-panel hm-stat ifta-tile">
            <p className="hm-stat-label">{t('Loads')}</p>
            <p className="hm-stat-value">{summary.loads}</p>
            <p className="hm-stat-sub">{t('Tickets on the days counted')}</p>
          </div>
          <div className="ld-panel hm-stat ifta-tile">
            <p className="hm-stat-label">{t('Trucks')}</p>
            <p className="hm-stat-value">{summary.trucks}</p>
            <p className="hm-stat-sub">{t('Trucks with miles this quarter')}</p>
          </div>
        </div>
        <p className="ld-hint ifta-footnote">
          <Fuel aria-hidden="true" />
          {t('Estimated Fuel Used = route miles ÷ average MPG. Not purchased fuel.')}
        </p>

        <section className="ld-panel pf-section" aria-labelledby="ifta-jurisdiction-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('Fuel-tax filing')}</p>
              <h2 id="ifta-jurisdiction-title">{t('Miles by jurisdiction')}</h2>
            </div>
          </div>
          <p className="ld-notice">
            <strong>{t('Jurisdiction mileage is not calculated yet.')}</strong>{' '}
            {t('Route geometry is stored for every leg, so the miles can be split by state in a later release; until then the quarter is one line.')}
          </p>
          <table className="ifta-table">
            <thead>
              <tr>
                <th scope="col">{t('Jurisdiction')}</th>
                <th scope="col" className="pf-num">{t('Est. miles')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{t('All jurisdictions')}</th>
                <td className="pf-num">
                  {formatNumber(summary.miles)} <small>{t('mi')}</small>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="ld-panel pf-section" aria-labelledby="ifta-readiness-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('Before filing')}</p>
              <h2 id="ifta-readiness-title">{t('Reporting readiness')}</h2>
            </div>
            <span className="ld-hint">
              {t('Every truck-day the tickets say this quarter has.')}
            </span>
          </div>
          {loading ? (
            <p className="ld-empty">{t('Loading mileage…')}</p>
          ) : (
            <>
              <dl className="ifta-ready">
                <div>
                  <dt>{t('Days complete')}</dt>
                  <dd>{readiness.complete}</dd>
                </div>
                <div data-tone={readiness.review ? 'warning' : undefined}>
                  <dt>{t('Days needing review')}</dt>
                  <dd>{readiness.review}</dd>
                </div>
                <div data-tone={readiness.failed ? 'error' : undefined}>
                  <dt>{t('Failed')}</dt>
                  <dd>{readiness.failed}</dd>
                </div>
                <div>
                  <dt>{t('Not calculated yet')}</dt>
                  <dd>{readiness.waiting}</dd>
                </div>
                <div>
                  <dt>{t('Trucks missing a yard')}</dt>
                  <dd>
                    {withoutYard.length}
                    {withoutYard.length ? <small>{numbersOf(withoutYard)}</small> : null}
                  </dd>
                </div>
                <div>
                  <dt>{t('Trucks missing MPG')}</dt>
                  <dd>
                    {withoutMpg.length}
                    {withoutMpg.length ? <small>{numbersOf(withoutMpg)}</small> : null}
                  </dd>
                </div>
              </dl>
              {readiness.attention.length ? (
                <>
                  <ul className="pf-suggestions ifta-attention">
                    {listed.map((item) => (
                      <li key={item.day.key}>
                        <div>
                          <strong>
                            #{item.day.truck_number} · {date(item.day.date)}
                          </strong>
                          <small>{dayReason(item)}</small>
                        </div>
                        <Link
                          href={`/mileage?truck=${item.day.truck_id}&date=${item.day.date}`}
                          className={buttonVariants({ variant: 'secondary', size: 'sm' })}
                        >
                          {t('Review in Mileage')}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {readiness.attention.length > MAX_LISTED ? (
                    <p className="ld-hint ifta-more">
                      {t('and {n} more', { n: readiness.attention.length - MAX_LISTED })}
                    </p>
                  ) : null}
                </>
              ) : expected.days.length ? (
                <p className="ld-notice" data-tone="good">
                  {t('Every day in this quarter is calculated.')}
                </p>
              ) : (
                <p className="ld-empty">
                  {t('No tickets with a truck and a date in this quarter.')}
                </p>
              )}
            </>
          )}
        </section>

        <section className="ld-panel pf-section" aria-labelledby="ifta-trucks-title">
          <div className="ld-panel-head">
            <div>
              <p className="ld-step">{t('This quarter')}</p>
              <h2 id="ifta-trucks-title">{t('By truck')}</h2>
            </div>
          </div>
          {loading ? (
            <p className="ld-empty">{t('Loading mileage…')}</p>
          ) : perTruck.length === 0 ? (
            <p className="ld-empty">{t('No calculated days in this quarter.')}</p>
          ) : (
            <>
              <div className="pf-table-wrap">
                <table className="pf-table">
                  <thead>
                    <tr>
                      <th scope="col">{t('Truck')}</th>
                      <th scope="col" className="pf-num">{t('Days')}</th>
                      <th scope="col" className="pf-num">{t('Loads')}</th>
                      <th scope="col" className="pf-num">{t('Est. miles')}</th>
                      <th scope="col" className="pf-num">{t('Est. fuel used')}</th>
                      <th scope="col" className="pf-num">{t('To review')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perTruck.map((truck) => (
                      <tr key={truck.truck_id}>
                        <th scope="row" className="pf-name">
                          <strong>#{truck.truck_number}</strong>
                        </th>
                        <td className="pf-num">{truck.days}</td>
                        <td className="pf-num">{truck.loads}</td>
                        <td className="pf-num">{formatNumber(truck.miles)}</td>
                        <td className="pf-num">{formatNumber(truck.gallons)}</td>
                        <td className="pf-num">
                          {truck.review || <span className="pf-muted">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="pf-cards">
                {perTruck.map((truck) => (
                  <li key={truck.truck_id} className="pf-card">
                    <div className="pf-card-head">
                      <div>
                        <strong>#{truck.truck_number}</strong>
                        <small>
                          {tr.plural(truck.days, 'day')} · {tr.plural(truck.loads, 'load')}
                        </small>
                      </div>
                      {truck.review ? (
                        <span className="ld-chip">{t('{n} to review', { n: truck.review })}</span>
                      ) : null}
                    </div>
                    <dl className="rec-card-facts">
                      <div>
                        <dt>{t('Miles')}</dt>
                        <dd>{formatNumber(truck.miles)}</dd>
                      </div>
                      <div>
                        <dt>{t('Fuel')}</dt>
                        <dd>{formatNumber(truck.gallons)}</dd>
                      </div>
                      <div>
                        <dt>{t('Loads')}</dt>
                        <dd>{truck.loads}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <p className="ld-hint ifta-footer">
          {t(
            'Routes follow roads open to each truck’s configured profile as far as TomTom data allows. They are estimates, not legal guidance. Jurisdiction split and filing exports are not available yet.',
          )}
        </p>
      </div>
    </div>
  );
}
