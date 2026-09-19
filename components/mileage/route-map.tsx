'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useT } from '@/lib/i18n/use-t';
import { formatNumber, type LegKind } from '@/lib/load-desk/mileage';
import {
  decodePolyline,
  fitBounds,
  googleMapsDirectionsUrl,
  type RouteGeometry,
  type RouteStop,
} from '@/lib/load-desk/route-geometry';

// The day's route as a drawing of its own: the roads the router actually
// returned, on a plain canvas. No map library and no tiles — the routing key
// never reaches the browser — so what is on screen is the geometry, the stops
// and nothing else. Where a leg has no geometry it is drawn as a dashed
// straight line, which is a reminder rather than a road.

export type RouteMapLeg = {
  seq: number;
  kind: LegKind;
  miles: number;
  from: RouteStop;
  to: RouteStop;
  geometry: RouteGeometry | null;
};

/** The canvas is this much of its width tall, between these bounds. */
const ASPECT = 0.58;
const MIN_HEIGHT = 210;
const MAX_HEIGHT = 420;
/** Below this the labels and discs step down a size for a phone. */
const COMPACT_WIDTH = 420;

type Point = { x: number; y: number };

const path = (points: Point[]) =>
  points
    .map((point, at) => `${at ? 'L' : 'M'}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(' ');

/** A chevron halfway along a leg, so the direction of travel reads at a glance. */
function midpoint(points: Point[]): { x: number; y: number; angle: number } | null {
  if (points.length < 2) return null;
  const at = Math.max(1, Math.floor(points.length / 2));
  const before = points[at - 1];
  const after = points[at];
  const dx = after.x - before.x;
  const dy = after.y - before.y;
  if (Math.hypot(dx, dy) < 1) return null;
  return {
    x: (before.x + after.x) / 2,
    y: (before.y + after.y) / 2,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}

/** Loaded legs carry a ticket; everything else is the truck running empty. */
const toneOf = (kind: LegKind) => (kind === 'pickup_to_delivery' ? 'loaded' : 'empty');

export default function RouteMap({
  stops,
  legs,
  status,
  unresolved = [],
  title,
  selectedLeg = null,
  onSelectLeg,
}: {
  stops: RouteStop[];
  legs: RouteMapLeg[];
  status: 'complete' | 'incomplete' | 'review' | 'empty';
  unresolved?: { label: string }[];
  title?: string;
  selectedLeg?: number | null;
  onSelectLeg?: (seq: number | null) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const { t } = useT();
  // Two maps can share a page, so the pattern and the title are named apart.
  const domId = useId();
  const titleId = `${domId}-title`;
  const dotsId = `${domId}-dots`;

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const compact = width > 0 && width < COMPACT_WIDTH;
  const height = Math.round(Math.min(Math.max(width * ASPECT, MIN_HEIGHT), MAX_HEIGHT));
  const padding = compact ? 26 : 38;

  // Roads first: every leg that has geometry decoded once, so the bounds hold
  // the whole route rather than only the stops it passes through.
  const drawn = legs.map((leg) => ({
    leg,
    points: leg.geometry ? decodePolyline(leg.geometry.polyline, leg.geometry.precision) : [],
  }));
  const fit = width
    ? fitBounds(
        [...drawn.flatMap((entry) => entry.points), ...stops.map(({ lat, lon }) => ({ lat, lon }))],
        width,
        height,
        padding,
      )
    : null;

  const directions = googleMapsDirectionsUrl(stops);
  const missing = drawn.filter((entry) => !entry.points.length && entry.leg.from.index !== entry.leg.to.index).length;
  const miles = legs.reduce((sum, leg) => sum + (Number.isFinite(leg.miles) ? leg.miles : 0), 0);
  const interactive = typeof onSelectLeg === 'function';
  const pick = (seq: number) => onSelectLeg?.(selectedLeg === seq ? null : seq);
  const heading = title ?? t('Route map');
  // A day with nothing routed yet says so plainly: no legend to read, no
  // link to follow, and never a count of zero straight legs.
  const blank = status === 'empty' || (status === 'incomplete' && missing === 0);

  return (
    <figure className="rm" data-status={status}>
      <div className="rm-head">
        <p className="ld-step">{heading}</p>
        {directions && !blank ? (
          <a className="rm-open" href={directions} target="_blank" rel="noreferrer">
            {t('Open in Google Maps')}
          </a>
        ) : null}
      </div>

      <div className="rm-canvas" ref={box} style={{ minHeight: MIN_HEIGHT }}>
        {fit ? (
          <svg
            className="rm-svg"
            width={width}
            height={height}
            aria-labelledby={titleId}
            data-focused={selectedLeg === null ? undefined : ''}
          >
            <title id={titleId}>
              {t('The day’s route, {stops} stops and {legs} legs', {
                stops: stops.length,
                legs: legs.length,
              })}
            </title>
            <defs>
              <pattern id={dotsId} width="26" height="26" patternUnits="userSpaceOnUse">
                <circle className="rm-dot" cx="1" cy="1" r="0.8" />
              </pattern>
            </defs>
            <rect className="rm-field" x="0" y="0" width={width} height={height} fill={`url(#${dotsId})`} />

            {drawn.map(({ leg, points }) => {
              if (leg.from.index === leg.to.index && !points.length) return null;
              const line = points.length
                ? points.map((point) => fit.project(point))
                : [fit.project(leg.from), fit.project(leg.to)];
              const shape = path(line);
              const arrow = midpoint(line);
              return (
                <g
                  key={leg.seq}
                  className="rm-leg"
                  data-tone={toneOf(leg.kind)}
                  data-missing={points.length ? undefined : ''}
                  data-selected={selectedLeg === leg.seq ? '' : undefined}
                >
                  <path className="rm-line" d={shape} />
                  {arrow ? (
                    <path
                      className="rm-arrow"
                      d="M-2.6,-3 L3,0 L-2.6,3 Z"
                      transform={`translate(${arrow.x.toFixed(1)} ${arrow.y.toFixed(1)}) rotate(${arrow.angle.toFixed(1)})`}
                    />
                  ) : null}
                  {interactive ? (
                    <path className="rm-hit" d={shape} onClick={() => pick(leg.seq)} />
                  ) : null}
                </g>
              );
            })}

            {stops.map((stop) => {
              const { x, y } = fit.project(stop);
              const radius = compact ? 9 : 10.5;
              const [first, ...rest] = stop.short.split('·');
              const right = x > width * 0.72;
              return (
                <g className="rm-stop" key={stop.index} data-kind={stop.kind}>
                  <circle className="rm-disc" cx={x} cy={y} r={radius} />
                  <text className="rm-disc-text" x={x} y={y} dominantBaseline="central" textAnchor="middle">
                    {first}
                  </text>
                  {rest.length ? (
                    <text
                      className="rm-stack"
                      x={right ? x - radius - 4 : x + radius + 4}
                      y={y}
                      dominantBaseline="central"
                      textAnchor={right ? 'end' : 'start'}
                    >
                      {`·${rest.join('·')}`}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        ) : (
          <p className="rm-empty">{width ? t('No route to draw yet.') : ''}</p>
        )}
      </div>

      <figcaption
        className="rm-caption"
        data-tone={status === 'complete' || blank ? undefined : 'warning'}
      >
        {blank
          ? t('No route to draw yet.')
          : status === 'review'
            ? t('Some stops could not be placed, so the route is only part of the day.')
            : status === 'incomplete'
              ? t(
                  missing === 1
                    ? 'One leg has no road to follow and is drawn straight.'
                    : '{count} legs have no road to follow and are drawn straight.',
                  { count: missing },
                )
              : t('Routed roads, {miles} mi over {count} legs.', {
                  miles: formatNumber(miles),
                  count: legs.length,
                })}
      </figcaption>

      {unresolved.length ? (
        <div className="rm-unresolved">
          <p className="ld-step">{t('Not on the map')}</p>
          <ul>
            {unresolved.map((stop, at) => (
              <li key={`${stop.label}-${at}`}>{stop.label}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {blank ? null : (
        <ul className="rm-legend">
          <li className="rm-key" data-tone="loaded">{t('Loaded')}</li>
          <li className="rm-key" data-tone="empty">{t('Empty')}</li>
          {missing ? (
            <li className="rm-key" data-tone="missing">{t('Straight line')}</li>
          ) : null}
        </ul>
      )}

      <ul className="rm-legs">
        {legs.map((leg) => {
          const row = (
            <>
              <span className="rm-leg-mark" data-tone={toneOf(leg.kind)} aria-hidden="true" />
              <span className="rm-leg-where">
                <b>{leg.from.short}</b> {leg.from.label} <span aria-hidden="true">→</span>{' '}
                <b>{leg.to.short}</b> {leg.to.label}
              </span>
              <span className="rm-leg-miles">
                {formatNumber(leg.miles)} <small>{t('mi')}</small>
              </span>
            </>
          );
          return (
            <li key={leg.seq} data-selected={selectedLeg === leg.seq ? '' : undefined}>
              {interactive ? (
                <button type="button" className="rm-leg-row" onClick={() => pick(leg.seq)}>
                  {row}
                </button>
              ) : (
                <span className="rm-leg-row">{row}</span>
              )}
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
