'use client';

import { useEffect, useId, useRef, useState } from 'react';
import LoadsAreaChart, { type ChartLine } from '@/components/charts/loads-area-chart';
import { SelectField } from '@/components/ui/select-field';
import { useT } from '@/lib/i18n/use-t';
import { money } from '@/lib/load-desk/format';
import { isPeriod, loadSeries, PERIOD_PHRASE } from '@/lib/load-desk/load-series';
import { customerKey, customerTotals, type MonthBucket } from '@/lib/load-desk/overview';
import { PERIODS, type CustomerProfile, type Period } from '@/lib/load-desk/profiles';
import type { SavedRecord } from '@/lib/load-desk/types';

/** Colored series slots (--series-1…8); past that, customers share one line. */
const SERIES_SLOTS = 8;
const OTHER_LINE = 'other';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const PLOT_HEIGHT = 180;
/** Room above the tallest bar for its value label. */
const TOP = 22;
/** The x-axis label band, inside the chart's height. */
const AXIS = 28;
const LEFT = 36;
const RIGHT = 4;
const HEIGHT = TOP + PLOT_HEIGHT + AXIS;
const MAX_BAR = 24;

/** Whole-number ticks on a 1-2-5 step, about four of them. */
function niceScale(max: number) {
  const target = Math.max(max, 1) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(target));
  const step = Math.max(
    1,
    [1, 2, 5, 10].map((m) => m * magnitude).find((value) => value >= target) ??
      10 * magnitude,
  );
  const top = Math.max(step, Math.ceil(Math.max(max, 1) / step) * step);
  const ticks: number[] = [];
  for (let value = 0; value <= top; value += step) ticks.push(value);
  return { top, ticks };
}

/** A column with a 4px rounded top and a square base on the baseline. */
function barPath(x: number, y: number, width: number, height: number) {
  const r = Math.min(4, width / 2, height);
  return `M${x},${y + height}V${y + r}Q${x},${y} ${x + r},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${y + height}Z`;
}

/**
 * Loads by customer over a chosen timeline, one colored line each (the main
 * view), or loads per month as columns with a per-column tooltip.
 */
export default function LoadsChart({
  buckets,
  shifted,
  records,
  customers,
  now,
}: {
  buckets: MonthBucket[];
  shifted: boolean;
  records: SavedRecord[];
  customers: CustomerProfile[];
  now: Date;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [view, setView] = useState<'customers' | 'months'>('customers');
  const [period, setPeriod] = useState<Period>('month');
  const fieldId = useId();
  const { t, plural } = useT();
  const monthName = (bucket: MonthBucket) => `${t(FULL_MONTHS[bucket.month])} ${bucket.year}`;

  // One line per customer. Colors follow the customer (ranked by all-time
  // loads), so changing the timeline never repaints a line; past seven
  // customers the rest share an "Other customers" line.
  const ranking = customerTotals(records, customers);
  const names = new Map(ranking.map((entry) => [entry.key, entry.name]));
  const colored =
    ranking.length > SERIES_SLOTS ? ranking.slice(0, SERIES_SLOTS - 1) : ranking;
  const colorOf = new Map(
    colored.map((entry, index) => [entry.key, `var(--series-${index + 1})`]),
  );
  const series = loadSeries(records, period, now, (record) => {
    const { key } = customerKey(record, customers);
    return colorOf.has(key) ? key : OTHER_LINE;
  });
  const lines: ChartLine[] = Object.entries(series.groupTotals)
    .map(([key, loads]) => ({
      key,
      name: key === OTHER_LINE ? t('Other customers') : (names.get(key) ?? key),
      color: colorOf.get(key) ?? 'var(--series-other)',
      loads,
    }))
    .sort((a, b) => b.loads - a.loads || a.name.localeCompare(b.name));
  const periodLabel = t(PERIODS.find(([key]) => key === period)?.[1] ?? '');
  const phrase = t(PERIOD_PHRASE[period]);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [view]);

  const total = buckets.reduce((sum, bucket) => sum + bucket.loads, 0);
  const first = buckets[0];
  const last = buckets[buckets.length - 1];
  const range = first && last
    ? `${t(MONTHS[first.month])} ${first.year} – ${t(MONTHS[last.month])} ${last.year}`
    : '';
  const { top, ticks } = niceScale(Math.max(0, ...buckets.map((b) => b.loads)));
  const band = buckets.length ? Math.max(0, width - LEFT - RIGHT) / buckets.length : 0;
  const barWidth = Math.min(MAX_BAR, Math.max(4, band * 0.56));
  const yFor = (value: number) => TOP + PLOT_HEIGHT - (value / top) * PLOT_HEIGHT;
  const maxIndex = buckets.reduce(
    (best, bucket, index) => (bucket.loads > buckets[best].loads ? index : best),
    0,
  );
  const lastIndex = buckets.length - 1;
  // Label selectively: the busiest month and the latest one.
  const labelled = new Set(
    [maxIndex, lastIndex].filter((index) => (buckets[index]?.loads ?? 0) > 0),
  );
  const labelEvery = band < 34 ? 2 : 1;
  const axisLabel = (bucket: MonthBucket, index: number) =>
    band >= 44 && (index === 0 || bucket.month === 0)
      ? `${t(MONTHS[bucket.month])} ’${String(bucket.year).slice(2)}`
      : t(MONTHS[bucket.month]);

  const activeBucket = active === null ? null : buckets[active];
  const tooltipLeft =
    active === null
      ? 0
      : Math.min(Math.max(LEFT + active * band + band / 2, 80), Math.max(80, width - 80));
  const tooltipTop =
    activeBucket === null ? 0 : Math.max(yFor(activeBucket.loads) - 10, 64);

  return (
    <section className="ld-panel hm-chart" aria-labelledby="hm-chart-title">
      <div className="ld-panel-head">
        {view === 'customers' ? (
          <div>
            <p className="ld-step">{periodLabel}</p>
            <h2 id="hm-chart-title">{t('Loads by Customer')}</h2>
            <p className="hm-subtle">
              {plural(series.loads, 'load')} {phrase} · {plural(lines.length, 'customer')} ·{' '}
              {t('by ticket date')}
            </p>
          </div>
        ) : (
          <div>
            <p className="ld-step">
              {shifted ? t('Up to your latest load') : t('Last 12 months')}
            </p>
            <h2 id="hm-chart-title">{t('Loads by Month')}</h2>
            <p className="hm-subtle">
              {plural(total, 'load')} · {range} · {t('by ticket date')}
            </p>
          </div>
        )}
        <div className="hm-chart-controls">
          {view === 'customers' ? (
            <>
              <label htmlFor={`${fieldId}-period`} className="sr-only">
                {t('Timeline')}
              </label>
              <SelectField
                id={`${fieldId}-period`}
                className="hm-chart-period"
                value={period}
                onValueChange={(value) => {
                  if (isPeriod(value)) setPeriod(value);
                }}
                options={PERIODS.map(([value, label]) => ({ value, label: t(label) }))}
              />
            </>
          ) : null}
          <fieldset className="ui-segmented">
            <legend className="sr-only">{t('Show loads')}</legend>
            <button
              type="button"
              aria-pressed={view === 'customers'}
              onClick={() => setView('customers')}
            >
              {t('By customer')}
            </button>
            <button
              type="button"
              aria-pressed={view === 'months'}
              onClick={() => setView('months')}
            >
              {t('By month')}
            </button>
          </fieldset>
        </div>
      </div>

      {view === 'customers' ? (
        <>
          <LoadsAreaChart
            points={series.points}
            lines={lines}
            height={230}
            label={t('Loads by customer {period}', { period: phrase })}
          />
          {period === 'today' && series.untimed ? (
            <p className="hm-subtle">
              {t(
                series.untimed === 1
                  ? '{count} load without a time is counted but not charted.'
                  : '{count} loads without a time are counted but not charted.',
                { count: series.untimed },
              )}
            </p>
          ) : null}
        </>
      ) : (
        <div
          ref={box}
          className="hm-chart-box"
          style={{ height: HEIGHT }}
          onPointerLeave={() => setActive(null)}
        >
          {width > 0 ? (
            <svg
              width={width}
              height={HEIGHT}
              aria-label={t('Loads by month, {range}', { range })}
            >
              {ticks.map((tick) => (
                <g key={tick}>
                  <line
                    className="hm-gridline"
                    x1={LEFT}
                    x2={width - RIGHT}
                    y1={Math.round(yFor(tick)) + 0.5}
                    y2={Math.round(yFor(tick)) + 0.5}
                  />
                  <text
                    className="hm-tick"
                    x={LEFT - 8}
                    y={yFor(tick)}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {tick.toLocaleString('en-US')}
                  </text>
                </g>
              ))}
              {buckets.map((bucket, index) => {
                const x = LEFT + index * band + (band - barWidth) / 2;
                const height = (bucket.loads / top) * PLOT_HEIGHT;
                return (
                  <g key={bucket.key} className="hm-bar" data-active={active === index}>
                    {bucket.loads > 0 ? (
                      <path d={barPath(x, yFor(bucket.loads), barWidth, height)} />
                    ) : null}
                    {labelled.has(index) ? (
                      <text
                        className="hm-value"
                        x={x + barWidth / 2}
                        y={yFor(bucket.loads) - 7}
                        textAnchor="middle"
                      >
                        {bucket.loads}
                      </text>
                    ) : null}
                    {(lastIndex - index) % labelEvery === 0 ? (
                      <text
                        className="hm-tick"
                        x={LEFT + index * band + band / 2}
                        y={TOP + PLOT_HEIGHT + 18}
                        textAnchor="middle"
                      >
                        {axisLabel(bucket, index)}
                      </text>
                    ) : null}
                    <rect
                      className="hm-hit"
                      x={LEFT + index * band}
                      y={TOP}
                      width={band}
                      height={PLOT_HEIGHT}
                      tabIndex={0}
                      aria-label={t('{month}: {loads}, {tons} Tons, {billed} billed', {
                        month: monthName(bucket),
                        loads: plural(bucket.loads, 'load'),
                        tons: bucket.tons.toFixed(1),
                        billed: money(bucket.billed),
                      })}
                      onPointerEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onBlur={() => setActive(null)}
                    />
                  </g>
                );
              })}
            </svg>
          ) : null}
          {activeBucket ? (
            <div
              className="hm-tooltip"
              style={{ left: tooltipLeft, top: tooltipTop }}
              aria-hidden="true"
            >
              <strong>{plural(activeBucket.loads, 'load')}</strong>
              <span>{monthName(activeBucket)}</span>
              <span>
                {t('{tons} Tons · {billed} billed', {
                  tons: activeBucket.tons.toFixed(1),
                  billed: money(activeBucket.billed),
                })}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
