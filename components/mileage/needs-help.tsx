'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, Files, Fuel, MapPin, Pencil, RefreshCw, Truck } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import FixLocation from '@/components/mileage/fix-location';
import FixOrder from '@/components/mileage/fix-order';
import { useT } from '@/lib/i18n/use-t';
import { setDeskField } from '@/lib/load-desk/desk-session';
import { fixPlace } from '@/lib/load-desk/mileage-days';
import type { MileageDay, Problem, ProblemKind, TruckDay } from '@/lib/load-desk/mileage';
import type { TruckProfile } from '@/lib/load-desk/profiles';
import type { SavedRecord } from '@/lib/load-desk/types';

// What a day needs a person for, said in the words a dispatcher would use.
// One panel, one block per thing wrong, one thing to press in each: set the
// yard, say where a location is, put the loads in order, open the ticket that
// is missing an address, or ask for the day again. Nothing here names a code,
// a key or anything else the app keeps to itself — the block says what is
// wrong and offers the one fix for it.

/** Every problem worth its own block: the same location asked about once. */
function oneEach(problems: Problem[]): Problem[] {
  const seen = new Set<string>();
  const kept: Problem[] = [];
  for (const problem of problems) {
    const key = `${problem.kind}|${problem.place_key ?? problem.ticket_id ?? problem.detail ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(problem);
  }
  return kept;
}

/** "Thornton → Markham: no road route" as its two ends, when it reads that way. */
function routeEnds(detail: string | undefined): { from: string; to: string } | null {
  const parts = (detail ?? '').split('→');
  if (parts.length !== 2) return null;
  const from = parts[0].trim();
  const to = parts[1].split(':')[0].trim();
  return from && to ? { from, to } : null;
}

export default function NeedsHelp({
  problems,
  day,
  row,
  truck,
  records,
  busy,
  onTryAgain,
  onUpdateDay,
  onOrderConfirmed,
  onLocationFixed,
}: {
  problems: Problem[];
  day: TruckDay;
  row: MileageDay | undefined;
  truck: TruckProfile;
  records: SavedRecord[];
  busy: boolean;
  onTryAgain: () => void;
  onUpdateDay: () => void;
  onOrderConfirmed: () => void;
  onLocationFixed: (placeKey: string) => void;
}) {
  const { t, date } = useT();
  const headingId = useId();
  /** The order editor, open below the sentence that offered it. */
  const [ordering, setOrdering] = useState(false);
  /** The location being typed in, when the suggestion is not the one. */
  const [locating, setLocating] = useState<Problem | null>(null);
  const [saving, setSaving] = useState(false);
  const working = busy || saving;

  const shown = oneEach(problems);
  if (!shown.length) return null;

  // The heading says what the panel is about; a day that only failed to
  // update, or whose truck has been changed, is not the person's mistake.
  const only = (...kinds: ProblemKind[]) => shown.every((problem) => kinds.includes(problem.kind));
  const heading = only('could_not_update', 'stuck')
    ? t('Couldn’t update')
    : only('settings_changed')
      ? t('Settings changed')
      : t('Needs your help');

  const byId = new Map(records.map((record) => [record.id, record]));
  const ticketNumber = (id: number | undefined) => {
    const printed = (id === undefined ? '' : byId.get(id)?.ticket.ticket_number ?? '').trim();
    return printed || (id === undefined ? '' : `#${id}`);
  };
  const lastGood = (problem: Problem) => problem.last_success_at ?? row?.calculated_at ?? null;

  /** The location the provider suggested, taken as given. */
  async function takeSuggestion(problem: Problem) {
    const key = problem.place_key;
    if (working || !key || !problem.suggestion) return;
    setSaving(true);
    const failed = await fixPlace(key, problem.suggestion);
    setSaving(false);
    if (failed) {
      toast.add({ title: t('Could not save the location'), description: t(failed), type: 'error' });
      return;
    }
    toast.add({ title: t('Location saved'), type: 'success' });
    onLocationFixed(key);
  }

  const tryAgain = (
    <Button className="fix-button" disabled={working} onClick={onTryAgain}>
      <RefreshCw data-icon="inline-start" />
      {t('Try again')}
    </Button>
  );

  const block = (problem: Problem) => {
    switch (problem.kind) {
      case 'missing_yard':
        return (
          <>
            <p className="fix-says">
              {t('Truck {number} needs a home yard before mileage can be calculated.', {
                number: truck.truck_number,
              })}
            </p>
            <Link
              href={`/fleet?edit=${truck.id}`}
              className={buttonVariants({ variant: 'secondary', className: 'fix-button' })}
            >
              <Truck data-icon="inline-start" />
              {t('Set yard')}
            </Link>
          </>
        );
      case 'unknown_place':
        return (
          <>
            <p className="fix-says">{t('We couldn’t find this location.')}</p>
            <p className="fix-quote">{t('Ticket says: {query}', { query: problem.query ?? '' })}</p>
            {problem.suggestion ? (
              <>
                <p className="fix-says">
                  {t('Possible location: {suggestion}', { suggestion: problem.suggestion })}
                </p>
                <div className="fix-actions">
                  <Button
                    className="fix-button"
                    disabled={working}
                    onClick={() => void takeSuggestion(problem)}
                  >
                    <MapPin data-icon="inline-start" />
                    {t('Use this location')}
                  </Button>
                  <Button
                    variant="secondary"
                    className="fix-button"
                    disabled={working}
                    onClick={() => setLocating(problem)}
                  >
                    {t('Choose another')}
                  </Button>
                </div>
              </>
            ) : (
              <Button className="fix-button" disabled={working} onClick={() => setLocating(problem)}>
                <MapPin data-icon="inline-start" />
                {t('Choose location')}
              </Button>
            )}
          </>
        );
      case 'uncertain_order':
        return (
          <>
            <p className="fix-says">{t('We’re not sure which load happened first.')}</p>
            {ordering ? (
              <FixOrder
                day={day}
                row={row}
                records={records}
                busy={working}
                onConfirmed={() => {
                  setOrdering(false);
                  onOrderConfirmed();
                }}
                onCancel={() => setOrdering(false)}
              />
            ) : (
              <Button className="fix-button" disabled={working} onClick={() => setOrdering(true)}>
                <ArrowUpDown data-icon="inline-start" />
                {t('Fix order')}
              </Button>
            )}
          </>
        );
      case 'missing_pickup':
      case 'missing_delivery':
        return (
          <>
            <p className="fix-says">
              {problem.kind === 'missing_pickup'
                ? t('Ticket {number} has no pickup address.', {
                    number: ticketNumber(problem.ticket_id),
                  })
                : t('Ticket {number} has no delivery address.', {
                    number: ticketNumber(problem.ticket_id),
                  })}
            </p>
            <Link
              href="/load-desk"
              onClick={() => {
                if (problem.ticket_id !== undefined) setDeskField('editRequest', problem.ticket_id);
              }}
              className={buttonVariants({ variant: 'secondary', className: 'fix-button' })}
            >
              <Pencil data-icon="inline-start" />
              {t('Open ticket')}
            </Link>
          </>
        );
      case 'no_route': {
        const ends = routeEnds(problem.detail);
        return (
          <>
            <p className="fix-says">
              {ends
                ? t('We couldn’t calculate this part of the route: {from} to {to}.', ends)
                : t('We couldn’t calculate part of this route.')}
            </p>
            {tryAgain}
          </>
        );
      }
      case 'too_many_tickets':
        return (
          <>
            <p className="fix-says">
              {t('This day has too many tickets to calculate ({n}). Split it or check the dates.', {
                n: day.records.length,
              })}
            </p>
            <Link
              href="/records"
              className={buttonVariants({ variant: 'secondary', className: 'fix-button' })}
            >
              <Files data-icon="inline-start" />
              {t('Open tickets')}
            </Link>
          </>
        );
      case 'missing_mpg':
        return (
          <>
            <p className="fix-says">
              {t('Truck {number} has no average MPG, so fuel can’t be estimated.', {
                number: truck.truck_number,
              })}
            </p>
            <Link
              href={`/fleet?edit=${truck.id}`}
              className={buttonVariants({ variant: 'secondary', className: 'fix-button' })}
            >
              <Fuel data-icon="inline-start" />
              {t('Set MPG')}
            </Link>
          </>
        );
      case 'could_not_update':
      case 'stuck': {
        const good = lastGood(problem);
        return (
          <>
            <p className="fix-says">
              {t('We couldn’t update mileage right now.')}
              {good
                ? ` ${t('Showing the last good result from {date}.', { date: date(good.slice(0, 10)) })}`
                : ''}
            </p>
            {tryAgain}
          </>
        );
      }
      case 'settings_changed':
        return (
          <>
            <p className="fix-says">
              {t('Truck settings have changed since this day was calculated.')}
            </p>
            <Button className="fix-button" disabled={working} onClick={onUpdateDay}>
              <RefreshCw data-icon="inline-start" />
              {t('Update this day')}
            </Button>
          </>
        );
    }
  };

  // A section labelled by its own heading is the region; the role is implicit.
  return (
    <section className="fix-panel" aria-labelledby={headingId}>
      <h3 id={headingId} className="fix-panel-title">
        {heading}
      </h3>
      <ul className="fix-problems">
        {shown.map((problem) => (
          <li
            key={`${problem.kind}|${problem.place_key ?? problem.ticket_id ?? problem.detail ?? ''}`}
            className="fix-problem"
          >
            {block(problem)}
          </li>
        ))}
      </ul>
      {locating?.place_key ? (
        <FixLocation
          placeKey={locating.place_key}
          query={locating.query ?? ''}
          suggestion={locating.suggestion}
          busy={working}
          onFixed={(key) => {
            setLocating(null);
            onLocationFixed(key);
          }}
          onCancel={() => setLocating(null)}
        />
      ) : null}
    </section>
  );
}
