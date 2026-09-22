'use client';

import { useEffect, useState } from 'react';
import { Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import RouteMap from '@/components/mileage/route-map';
import type { Translator } from '@/lib/i18n/translate';
import {
  formatNumber,
  runsOfDay,
  type DayRun,
  type MileageLeg,
  type MileagePlace,
} from '@/lib/load-desk/mileage';
import { chooseRouteWay, loadRouteWays, type RouteWays } from '@/lib/load-desk/mileage-days';
import type { RouteStop } from '@/lib/load-desk/route-geometry';

// Which way the truck goes between two places, settled once.
//
// A day of shuttle work is the same run over and over: yard to the quarry,
// the quarry to the job, back to the quarry, and home at the end. The router
// picks a way for each of those runs, and it is not always the way the driver
// drives. So the day is shown as the handful of runs it is really made of —
// not thirty legs — and each one can be set to the way it is actually driven.
//
// That choice is the run's, not this day's: every load between those two
// places uses it, today and on the days ahead, and the empty run home from
// the last job is a run like any other. What each way is worth in miles comes
// from the server, and a choice says only which of them was picked.

/** What a place is called on the page: its name where it has one. */
const nameOf = (place: MileagePlace) => place.name || place.label;

/** "24 min", or "1 hr 05 min" past the hour. */
const driveTime = (seconds: number, tr: Translator) => {
  const total = Math.round(seconds / 60);
  const hours = Math.floor(total / 60);
  return hours
    ? tr.t('{hours} hr {minutes} min', { hours, minutes: String(total % 60).padStart(2, '0') })
    : tr.t('{minutes} min', { minutes: total });
};

/** The two ends of a run, as the map draws stops. */
const stopsOf = (ways: RouteWays): RouteStop[] =>
  [ways.from, ways.to].map((place, at) => ({
    index: at,
    kind: at === 0 ? ('pickup' as const) : ('delivery' as const),
    label: place.label,
    short: place.label,
    lat: place.lat,
    lon: place.lon,
    ticket_id: null,
    place_key: place.place_key,
    seqs: [at + 1],
    ...(place.name ? { name: place.name } : {}),
    ...(place.address ? { address: place.address } : {}),
  }));

export default function RouteChoice({
  truckId,
  date,
  legs,
  busy,
  phone,
  mapCredit,
  modes,
  tr,
  onChosen,
}: {
  truckId: number;
  date: string;
  legs: MileageLeg[];
  busy: boolean;
  phone: boolean;
  mapCredit: string;
  /** For runs somebody settled, what that way was worked out for. */
  modes: Record<string, 'truck' | 'car'>;
  tr: Translator;
  onChosen: () => void;
}) {
  const { t } = tr;
  const [open, setOpen] = useState<DayRun | null>(null);
  const runs = runsOfDay(legs);
  if (!runs.length) return null;

  return (
    <div className="rc">
      <p className="ld-step">{t('Routes this day uses')}</p>
      <ul className="rc-runs">
        {runs.map((run) => (
          <li key={run.route_id} className="rc-run">
            <span className="rc-run-where">
              {nameOf(run.from)} <span aria-hidden="true">→</span> {nameOf(run.to)}
              {/* A run somebody settled says so on every day that drives it,
                  this one and the ones to come, so the choice is not a thing
                  a person has to open something to find out. A way that was
                  never checked against this truck says which it is. */}
              {modes[String(run.route_id)] === 'car' ? (
                <span className="ld-chip rc-run-chip" data-tone="warning">
                  {t('Any vehicle')}
                </span>
              ) : modes[String(run.route_id)] ? (
                <span className="ld-chip rc-run-chip" data-tone="good">
                  {t('Your route')}
                </span>
              ) : null}
              <small>
                {t('{miles} miles', { miles: formatNumber(run.miles) })}
                {run.uses > 1 ? ` · ${t('{n} times today', { n: run.uses })}` : ''}
              </small>
            </span>
            <Button
              variant="secondary"
              disabled={busy}
              aria-label={t('Change the route from {from} to {to}', {
                from: nameOf(run.from),
                to: nameOf(run.to),
              })}
              onClick={() => setOpen(run)}
            >
              <Route />
              {t('Change route')}
            </Button>
          </li>
        ))}
      </ul>
      <p className="ld-hint rc-note">
        {t('A route you choose is used for every trip between those two places — the rest of this day, and every ticket that comes in for it afterwards.')}
      </p>
      {open ? (
        <ChooseWay
          truckId={truckId}
          date={date}
          run={open}
          phone={phone}
          mapCredit={mapCredit}
          tr={tr}
          onClose={() => setOpen(null)}
          onChosen={onChosen}
        />
      ) : null}
    </div>
  );
}

/** The ways one run may be driven, each drawn, with the miles it comes to. */
function ChooseWay({
  truckId,
  date,
  run,
  phone,
  mapCredit,
  tr,
  onClose,
  onChosen,
}: {
  truckId: number;
  date: string;
  run: DayRun;
  phone: boolean;
  mapCredit: string;
  tr: Translator;
  onClose: () => void;
  onChosen: () => void;
}) {
  const { t } = tr;
  const [ways, setWays] = useState<RouteWays | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    void loadRouteWays(truckId, date, run.seq).then((answer) => {
      if (!live) return;
      if ('error' in answer) setError(answer.error);
      else setWays(answer.ways);
    });
    return () => {
      live = false;
    };
  }, [truckId, date, run.seq]);

  async function choose(option: number) {
    if (saving !== null) return;
    setSaving(option);
    const answer = await chooseRouteWay(truckId, date, run.seq, option);
    setSaving(null);
    if ('error' in answer) {
      setError(answer.error);
      return;
    }
    toast.add({
      title: t('Route saved'),
      description:
        answer.days > 1
          ? t('Used on {n} days that drive this run.', { n: answer.days })
          : t('Used for every trip between these two places.'),
      type: 'success',
    });
    onChosen();
    onClose();
  }

  // The shortest way is what a day's miles turn on, so it is said in words
  // rather than left to be worked out from three figures.
  const shortest = ways?.options.length
    ? Math.min(...ways.options.map((way) => way.miles))
    : null;
  const quickest = ways?.options.length
    ? Math.min(...ways.options.map((way) => way.seconds))
    : null;

  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="rc-dialog sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {nameOf(run.from)} <span aria-hidden="true">→</span> {nameOf(run.to)}
          </DialogTitle>
          <DialogDescription>
            {t('Pick the roads the truck really takes.')}
            {run.uses > 1
              ? ` ${t('It drives this {n} times on this day.', { n: run.uses })}`
              : ''}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="fix-error" role="alert">
            {t(error)}
          </p>
        ) : null}

        {!ways && !error ? <p className="ld-empty">{t('Looking up the routes…')}</p> : null}

        {ways ? (
          <ul className="rc-ways">
            {ways.options.map((way) => {
              const inUse = ways.in_use === way.index;
              const [from, to] = stopsOf(ways);
              return (
                <li key={way.index} className="rc-way" data-in-use={inUse || undefined}>
                  <RouteMap
                    stops={[from, to]}
                    legs={[
                      {
                        seq: 1,
                        kind: 'pickup_to_delivery',
                        miles: way.miles,
                        from,
                        to,
                        geometry: way.geometry,
                      },
                    ]}
                    status={way.geometry ? 'complete' : 'incomplete'}
                    title={t('Route {n}', { n: way.index + 1 })}
                    credit={mapCredit || null}
                    compact
                  />
                  <p className="rc-way-figures">
                    <strong>{t('{miles} miles', { miles: formatNumber(way.miles) })}</strong>
                    <span>{driveTime(way.seconds, tr)}</span>
                    {way.miles === shortest ? (
                      <span className="ld-chip" data-tone="good">
                        {t('Fewest miles')}
                      </span>
                    ) : null}
                    {way.seconds === quickest && way.miles !== shortest ? (
                      <span className="ld-chip">{t('Quickest')}</span>
                    ) : null}
                  </p>
                  {/* A truck's way is the default and says nothing; a way
                      worked out for any vehicle has to say so, because the
                      roads it uses were not checked against this truck. */}
                  <p className="rc-way-mode" data-mode={way.mode}>
                    {way.mode === 'car'
                      ? t('Any vehicle · not checked for bridges or truck bans')
                      : t('Legal for this truck’s size and weight')}
                  </p>
                  {inUse ? (
                    <p className="rc-way-now">{t('In use now')}</p>
                  ) : (
                    <Button
                      className="rc-way-pick"
                      disabled={saving !== null}
                      onClick={() => void choose(way.index)}
                    >
                      {saving === way.index ? t('Saving…') : t('Use this route')}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}

        {ways && !phone ? (
          <p className="ld-hint">
            {t('The miles are the route’s own, off the map. Choosing one changes what this run is worth on every day the truck drives it.')}
          </p>
        ) : null}

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {t('Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
