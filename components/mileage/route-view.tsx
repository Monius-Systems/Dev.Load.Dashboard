'use client';

import { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayStatus, longDate, type DayHeadline } from '@/components/mileage/day-card';
import NeedsHelp from '@/components/mileage/needs-help';
import RouteChoice from '@/components/mileage/route-choice';
import RouteMap from '@/components/mileage/route-map';
import type { Translator } from '@/lib/i18n/translate';
import {
  formatNumber,
  truckIfta,
  type MileageDay,
  type Problem,
  type TruckDay,
} from '@/lib/load-desk/mileage';
import type { TruckProfile } from '@/lib/load-desk/profiles';
import {
  FINISH,
  legsWithStops,
  sequenceLabels,
  START,
  START_FINISH,
  stopsFromLegs,
  type RouteGeometry,
  type RouteStop,
} from '@/lib/load-desk/route-geometry';
import type { SavedRecord } from '@/lib/load-desk/types';

// One day's route, in the order the truck drove it: the three figures that
// answer "how far", whatever the day needs a person for, the drawing of the
// roads, and then the stops by name. The per-leg figures are behind a toggle,
// because a dispatcher reads the stops far more often than the legs.

/** "24 min", or "1 hr 05 min" once a leg is longer than an hour. */
const driveTime = (seconds: number, tr: Translator) => {
  const total = Math.round(seconds / 60);
  const hours = Math.floor(total / 60);
  return hours
    ? tr.t('{hours} hr {minutes} min', { hours, minutes: String(total % 60).padStart(2, '0') })
    : tr.t('{minutes} min', { minutes: total });
};

/** "1234 Front St" out of "1234 Front St, Joliet, IL 60431". */
const firstLine = (address: string) => address.split(',')[0].trim();

export default function RouteView({
  day,
  truck,
  row,
  problems,
  headline,
  geometry,
  records,
  busy,
  phone,
  canUpdate,
  mapCredit,
  tr,
  onBack,
  onTryAgain,
  onUpdateDay,
  onOrderConfirmed,
  onLocationFixed,
  onRouteChosen,
}: {
  day: TruckDay;
  truck: TruckProfile;
  row: MileageDay | undefined;
  problems: Problem[];
  headline: DayHeadline;
  geometry: Record<string, RouteGeometry>;
  records: SavedRecord[];
  busy: boolean;
  phone: boolean;
  canUpdate: boolean;
  /** The words the map source is credited with; '' where there is no map. */
  mapCredit: string;
  tr: Translator;
  onBack: () => void;
  onTryAgain: () => void;
  onUpdateDay: () => void;
  onOrderConfirmed: () => void;
  onLocationFixed: (placeKey: string) => void;
  onRouteChosen: () => void;
}) {
  const { t } = tr;
  const [details, setDetails] = useState(false);

  const when = longDate(day.date);
  const legs = row?.legs ?? [];
  const miles = row?.total_miles ?? null;
  const gallons = row?.est_gallons ?? null;
  const mpg = row?.mpg ?? truckIfta(truck).mpg;

  // The route on the map: the day's stops, and each leg with the line the
  // provider drew for it, as far as the stored geometry reaches.
  const mapStops = stopsFromLegs(legs);
  const mapLegs = legsWithStops(legs, mapStops).map(({ leg, from, to }) => ({
    seq: leg.seq,
    kind: leg.kind,
    miles: leg.miles,
    from,
    to,
    geometry: (leg.route_id === null ? null : geometry[String(leg.route_id)]) ?? null,
  }));
  const unresolved = problems
    .filter((problem) => problem.kind === 'missing_yard' || problem.kind === 'unknown_place')
    .map((problem) => ({
      label: problem.kind === 'missing_yard' ? t('Home yard') : (problem.query ?? ''),
    }));
  // A stop that could not be placed is missing from the drawing; a leg without
  // geometry is drawn straight; a day not worked out yet has nothing to draw at
  // all. Either way the map says so itself.
  const mapStatus = unresolved.length
    ? ('review' as const)
    : !mapLegs.length
      ? ('empty' as const)
      : mapLegs.some((leg) => !leg.geometry)
        ? ('incomplete' as const)
        : ('complete' as const);

  // Where each stop came in the day. Counted by visit rather than by place in
  // the list, because a stop the truck came back to is one row carrying both of
  // its visits — the yard reads "Start · Finish", and the list never ends on a
  // plant that happened to be the last new place of the day. The arithmetic is
  // in route-geometry, the same as the map's; only the three words translate.
  const marks = new Map(sequenceLabels(mapStops).map((mark) => [mark.index, mark]));
  const word = (label: string) =>
    label === START
      ? t('Start')
      : label === FINISH
        ? t('Finish')
        : label === START_FINISH
          ? t('Start/Finish')
          : label;
  const isWord = (label: string) =>
    label === START || label === FINISH || label === START_FINISH;

  // What each stop is called: a stored stop carries the plant or project name
  // and the address, and where it does not the ticket's own text stands in.
  const byId = new Map(records.map((record) => [record.id, record]));
  const ticketName = (stop: RouteStop) => {
    const record = stop.ticket_id === null ? undefined : byId.get(stop.ticket_id);
    // The yard is the company's own place. It rides along on a ticket's legs,
    // so without this it would read as that ticket's project.
    if (!record || stop.kind === 'yard') return '';
    return (stop.kind === 'pickup' ? record.ticket.plant_name : record.ticket.project_name) ?? '';
  };

  return (
    <section
      className="ld-panel pf-section mileage-route-view"
      id="mileage-route"
      aria-labelledby="mileage-route-title"
    >
      <div className="ld-panel-head">
        <div>
          <p className="ld-step">{t('Route')}</p>
          <h2 id="mileage-route-title">
            {t('Truck {number} · {date}', { number: truck.truck_number, date: when })}
          </h2>
        </div>
        {phone ? (
          <Button variant="secondary" className="mileage-back" onClick={onBack}>
            <ArrowLeft />
            {t('Back to all trucks')}
          </Button>
        ) : null}
      </div>

      <dl className="mileage-facts">
        <div>
          <dt>{t('Miles')}</dt>
          <dd>{miles === null ? '—' : formatNumber(miles)}</dd>
        </div>
        <div>
          <dt>{t('Loads')}</dt>
          <dd>{day.records.length}</dd>
        </div>
        <div>
          <dt>{t('Estimated fuel')}</dt>
          <dd>
            {gallons === null ? '—' : formatNumber(gallons)} <small>{t('gal')}</small>
          </dd>
        </div>
      </dl>
      <p className="mileage-mpg">
        {t('Average MPG {mpg}', { mpg: mpg === null ? '—' : formatNumber(mpg) })}
      </p>

      <DayStatus headline={headline} row={row} tr={tr} live />

      {problems.length ? (
        <NeedsHelp
          problems={problems}
          day={day}
          row={row}
          truck={truck}
          records={records}
          busy={busy}
          onTryAgain={onTryAgain}
          onUpdateDay={onUpdateDay}
          onOrderConfirmed={onOrderConfirmed}
          onLocationFixed={onLocationFixed}
        />
      ) : null}

      <RouteMap
        stops={mapStops}
        legs={mapLegs}
        status={mapStatus}
        unresolved={unresolved}
        title={t('Truck {number} · {date}', { number: truck.truck_number, date: when })}
        credit={mapCredit || null}
        compact={phone}
      />

      {mapStops.length ? (
        <ol className="mileage-stops">
          {mapStops.map((stop) => {
            const mark = marks.get(stop.index);
            const name = stop.name || ticketName(stop) || stop.label;
            const under = stop.address
              ? stop.kind === 'yard'
                ? firstLine(stop.address)
                : stop.address
              : name === stop.label
                ? ''
                : stop.label;
            return (
              <li key={`${stop.index}-${stop.place_key}`}>
                <span className="mileage-stop-mark">
                  {word(mark?.primary ?? '')}
                  {/* The yard reads "Start · Finish"; a shuttle run that loaded
                      twelve times says so in words rather than in twelve
                      numbers a person has to count. */}
                  {mark?.secondary && isWord(mark.primary) ? (
                    <small> · {word(mark.secondary)}</small>
                  ) : null}
                  {stop.seqs.length > 1 && !isWord(mark?.primary ?? '') ? (
                    <small className="mileage-stop-visits">
                      {t('visited {n} times', { n: stop.seqs.length })}
                    </small>
                  ) : null}
                </span>
                <span className="mileage-stop-name">
                  {name}
                  {under ? <small>{under}</small> : null}
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}

      {legs.length ? (
        <RouteChoice
          truckId={truck.id}
          date={day.date}
          legs={legs}
          busy={busy}
          phone={phone}
          mapCredit={mapCredit}
          tr={tr}
          onChosen={onRouteChosen}
        />
      ) : null}

      {legs.length ? (
        <>
          <Button
            variant="ghost"
            className="mileage-details-toggle"
            aria-expanded={details}
            onClick={() => setDetails(!details)}
          >
            {details ? t('Hide details') : t('Show details')}
          </Button>
          {details ? (
            <ul className="mileage-legs">
              {legs.map((leg) => (
                <li key={leg.seq}>
                  {leg.from.label} → {leg.to.label}
                  <small>
                    {' · '}
                    {t('{miles} miles', {
                      miles: leg.kind === 'same_place' ? '0' : formatNumber(leg.miles),
                    })}
                    {' · '}
                    {driveTime(leg.seconds, tr)}
                  </small>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}

      {canUpdate ? (
        <div className="mileage-actions">
          <Button variant="secondary" disabled={busy} onClick={onUpdateDay}>
            <RefreshCw />
            {t('Update mileage')}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
