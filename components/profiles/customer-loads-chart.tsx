'use client';

import { useId, useState } from 'react';
import LoadsAreaChart from '@/components/charts/loads-area-chart.lazy';
import { SelectField } from '@/components/ui/select-field';
import { useT } from '@/lib/i18n/use-t';
import { isPeriod, loadSeries, PERIOD_PHRASE } from '@/lib/load-desk/load-series';
import { PERIODS, type Period } from '@/lib/load-desk/profiles';
import type { SavedRecord } from '@/lib/load-desk/types';

/** A customer's loads over a chosen timeline, with tons in the tooltip. */
export default function CustomerLoadsChart({
  name,
  records,
  now,
}: {
  name: string;
  records: SavedRecord[];
  now: Date;
}) {
  const [period, setPeriod] = useState<Period>('month');
  const id = useId();
  const { t, plural } = useT();
  const series = loadSeries(records, period, now);
  const phrase = t(PERIOD_PHRASE[period]);
  const tons = t('{tons} Tons', {
    tons: series.tons.toLocaleString('en-US', { maximumFractionDigits: 2 }),
  });
  const total = `${plural(series.loads, 'load')} ${phrase} · ${tons}`;

  return (
    <figure className="pf-chart">
      <div className="pf-chart-head">
        <figcaption className="pf-chart-total" aria-live="polite">
          <span className="sr-only">{name}: </span>
          {total}
        </figcaption>
        <label htmlFor={`${id}-period`} className="sr-only">
          {t('Timeline for {name}', { name })}
        </label>
        <SelectField
          id={`${id}-period`}
          className="pf-chart-period"
          value={period}
          onValueChange={(value) => {
            if (isPeriod(value)) setPeriod(value);
          }}
          options={PERIODS.map(([value, label]) => ({ value, label: t(label) }))}
        />
      </div>
      <LoadsAreaChart
        points={series.points}
        lines={null}
        height={170}
        label={t('Loads for {name} {period}', { name, period: phrase })}
      />
      {period === 'today' && series.untimed ? (
        <p className="pf-chart-note">
          {t(
            series.untimed === 1
              ? '{count} load without a time is counted but not charted.'
              : '{count} loads without a time are counted but not charted.',
            { count: series.untimed },
          )}
        </p>
      ) : null}
    </figure>
  );
}
