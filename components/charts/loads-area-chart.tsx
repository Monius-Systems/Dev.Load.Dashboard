'use client';

import { useEffect, useId, useRef } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useT } from '@/lib/i18n/use-t';
import type { Translator } from '@/lib/i18n/translate';
import type { SeriesPoint } from '@/lib/load-desk/load-series';

/** One colored line, such as a customer; `loads` is its total for the legend. */
export type ChartLine = { key: string; name: string; color: string; loads: number };

const tonsText = (tr: Translator, value: number) =>
  tr.t('{tons} Tons', { tons: value.toLocaleString('en-US', { maximumFractionDigits: 2 }) });

const AXIS_TICK = { fill: 'var(--ui-text-3)', fontSize: 11 };

function PointTooltip({
  active,
  payload,
  lines,
  tr,
}: {
  active?: boolean;
  payload?: readonly { payload?: SeriesPoint }[];
  lines: ChartLine[];
  tr: Translator;
}) {
  const item = active ? payload?.[0]?.payload : undefined;
  if (!item) return null;
  const rows = lines
    .map((line) => ({ line, loads: item.groups[line.key] ?? 0 }))
    .filter((row) => row.loads > 0)
    .sort((a, b) => b.loads - a.loads);
  return (
    <div className="lc-tooltip">
      <strong>{tr.t(item.detail)}</strong>
      <span>
        {tr.plural(item.loads, 'load')} · {tonsText(tr, item.tons)}
      </span>
      {rows.length ? (
        <ul>
          {rows.map(({ line, loads }) => (
            <li key={line.key}>
              <span className="lc-swatch" style={{ background: line.color }} />
              <span className="lc-name">{line.name}</span>
              <span className="lc-count">{loads}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Loads over time as an area chart. Without lines it is one filled blue line;
 * with lines, one colored line per group and a legend. A table of the same
 * figures is kept for screen readers.
 */
export default function LoadsAreaChart({
  points,
  lines,
  height,
  label,
}: {
  points: SeriesPoint[];
  lines: ChartLine[] | null;
  height: number;
  label: string;
}) {
  const id = useId();
  const tr = useT();
  // SVG url() references break on the colons useId produces.
  const fill = `lc-fill-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const shown = lines ?? [];
  const multi = shown.length > 0;
  const data = multi
    ? points.map((item) => ({
        ...item,
        ...Object.fromEntries(shown.map((line, index) => [`s${index}`, item.groups[line.key] ?? 0])),
      }))
    : points;
  const activeDot = (color: string) => ({
    r: 4,
    fill: color,
    stroke: 'var(--ui-surface)',
    strokeWidth: 2,
  });

  // A tap on a phone leaves the tooltip where it was put: there is no pointer
  // to move away, so the chart never hears that the finger has gone. Scrolling
  // the page tells it — otherwise the reading hangs over the chart while the
  // page moves underneath it, which is what it does on a phone today.
  const plot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const clear = () => {
      // React makes "mouse left" out of a mouseout whose relatedTarget is
      // outside the element, so that is the event the chart is listening for.
      // A plain mouseleave is not delivered and the reading stays put.
      const wrapper = plot.current?.querySelector('.recharts-wrapper');
      wrapper?.dispatchEvent(
        new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }),
      );
    };
    window.addEventListener('scroll', clear, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', clear, { capture: true });
  }, []);

  return (
    <div className="lc-chart">
      <div className="lc-plot" ref={plot} aria-hidden="true">
        <ResponsiveContainer width="100%" height={height}>
          {/* Room at the right for the last date label: the axis centres it on the
              final point, and on a full-width plot it would run off the glass. */}
            <AreaChart data={data} margin={{ top: 8, right: 22, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ui-accent)" stopOpacity={0.32} />
                <stop offset="95%" stopColor="var(--ui-accent)" stopOpacity={0.02} />
              </linearGradient>
              {/* One fading fill per line, in the line's own color. */}
              {shown.map((line, index) => (
                <linearGradient
                  key={line.key}
                  id={`${fill}-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={line.color} stopOpacity={0.6} />
                  <stop offset="55%" stopColor={line.color} stopOpacity={0.24} />
                  <stop offset="100%" stopColor={line.color} stopOpacity={0.03} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="var(--ui-separator)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tick={AXIS_TICK}
              tickFormatter={(value) => tr.t(String(value))}
            />
            <YAxis
              width={30}
              tickLine={false}
              axisLine={false}
              tickCount={4}
              allowDecimals={false}
              tick={AXIS_TICK}
            />
            <Tooltip
              cursor={{ stroke: 'var(--ui-border-strong)' }}
              content={<PointTooltip lines={shown} tr={tr} />}
              isAnimationActive={false}
            />
            {multi ? (
              shown.map((line, index) => (
                <Area
                  key={line.key}
                  dataKey={`s${index}`}
                  name={line.name}
                  type="monotone"
                  stroke={line.color}
                  strokeWidth={2}
                  fill={`url(#${fill}-${index})`}
                  activeDot={activeDot(line.color)}
                  isAnimationActive={false}
                />
              ))
            ) : (
              <Area
                dataKey="loads"
                name={tr.t('Loads')}
                type="monotone"
                stroke="var(--ui-accent)"
                strokeWidth={2}
                fill={`url(#${fill})`}
                activeDot={activeDot('var(--ui-accent)')}
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {multi ? (
        <ul className="lc-legend" aria-hidden="true">
          {shown.map((line) => (
            <li key={line.key}>
              <span className="lc-swatch" style={{ background: line.color }} />
              <span className="lc-name">{line.name}</span>
              <span className="lc-count">{tr.plural(line.loads, 'load')}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{tr.t('When')}</th>
            <th scope="col">{tr.t('Loads')}</th>
            <th scope="col">{tr.t('Tons')}</th>
            {shown.map((line) => (
              <th key={line.key} scope="col">
                {line.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {points
            .filter((item) => item.loads > 0)
            .map((item) => (
              <tr key={item.key}>
                <th scope="row">{tr.t(item.detail)}</th>
                <td>{item.loads}</td>
                <td>{item.tons}</td>
                {shown.map((line) => (
                  <td key={line.key}>{item.groups[line.key] ?? 0}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
