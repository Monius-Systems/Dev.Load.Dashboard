'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Translator } from '@/lib/i18n/translate';
import { useT } from '@/lib/i18n/use-t';
import { formatNumber, type LegKind } from '@/lib/load-desk/mileage';
import {
  decodePolyline,
  FINISH,
  fitBounds,
  fitTiles,
  googleMapsDirectionsUrl,
  sequenceLabels,
  START,
  START_FINISH,
  visitLabel,
  visitTag,
  type RouteGeometry,
  type RouteStop,
} from '@/lib/load-desk/route-geometry';

// The day's route on a map: the roads the router actually returned, drawn over
// the streets they ran along. The map is made of square pictures fetched from
// /api/mileage/tiles, which is this app's own address — the browser never
// talks to a map company, and no key of ours is in the page. There is no map
// library either: the pictures are laid out by the same Mercator arithmetic
// that places the roads, in route-geometry, so the two agree.
//
// The map is an aid and never the answer. When the pictures do not come —
// nothing configured, no network, a source having a bad day — the route is
// drawn on the plain canvas it has always had, and everything else on the page
// reads the same. Where a leg has no geometry it is drawn as a dashed straight
// line, which is a reminder rather than a road.
//
// The markers say where the truck started, where it went in what order and
// where it came back, in those words, so nothing on the canvas needs a legend
// to decode. Pickups and deliveries also differ in fill and outline, never in
// colour alone.

export type RouteMapLeg = {
  seq: number;
  kind: LegKind;
  miles: number;
  /** How long the provider said it takes, where the caller knows. */
  seconds?: number;
  from: RouteStop;
  to: RouteStop;
  geometry: RouteGeometry | null;
};

/** The canvas is this much of its width tall, between these bounds. */
const ASPECT = 0.58;
/** A phone gets a taller canvas, or the route is a sliver across 375px. */
const COMPACT_ASPECT = 0.72;
const MIN_HEIGHT = 210;
const MAX_HEIGHT = 420;
const COMPACT_MAX_HEIGHT = 360;
/** Below this the drawing counts as a phone, whatever the page said. */
const COMPACT_WIDTH = 420;
/** Clear space for the markers and their labels, so nothing is cut off. */
const PADDING = 44;
const COMPACT_PADDING = 36;
/** This app's own tiles, which fetch the map on the browser's behalf. */
const TILES = '/api/mileage/tiles';
/**
 * Past this the map has more detail than a route needs, and a day whose stops
 * are a few streets apart would fill the canvas with one junction.
 */
const MAX_ZOOM = 16;

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

/** "24 min", or "1 hr 05 min" once a leg is longer than an hour. */
const driveTime = (seconds: number, tr: { t: Translator['t'] }) => {
  const total = Math.round(seconds / 60);
  const hours = Math.floor(total / 60);
  return hours
    ? tr.t('{hours} hr {minutes} min', { hours, minutes: String(total % 60).padStart(2, '0') })
    : tr.t('{minutes} min', { minutes: total });
};

/** Loaded legs carry a ticket; everything else is the truck running empty. */
const toneOf = (kind: LegKind) => (kind === 'pickup_to_delivery' ? 'loaded' : 'empty');

/**
 * A marker is a pill, so 'Start' fits at the same text size a number does; at
 * a number's width the pill is a disc. Sized off the glyph width rather than a
 * measurement, which is enough for the two or three characters shown here.
 */
const markerWidth = (label: string, radius: number, glyph: number) =>
  Math.max(radius * 2, label.length * glyph + 16);

export default function RouteMap({
  stops,
  legs,
  status,
  unresolved = [],
  title,
  credit = null,
  selectedLeg = null,
  onSelectLeg,
  compact: compactProp = false,
}: {
  stops: RouteStop[];
  legs: RouteMapLeg[];
  status: 'complete' | 'incomplete' | 'review' | 'empty';
  unresolved?: { label: string }[];
  title?: string;
  /** The words the map source must be credited with, or null for no map. */
  credit?: string | null;
  selectedLeg?: number | null;
  onSelectLeg?: (seq: number | null) => void;
  compact?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  // How the map is doing. One picture arriving is proof the source works, so
  // a single missing tile — the sea, the edge of the world — is not a reason
  // to throw the map away; nothing arriving at all is.
  const [drawn, setDrawn] = useState(0);
  const [refused, setRefused] = useState(0);
  // Leg by leg is the long way to read a day, and a shuttle day has thirty of
  // them. The map, the caption and the stops answer the question; the legs are
  // there for whoever is checking the arithmetic, so they start folded away.
  const [listed, setListed] = useState(false);
  const { t } = useT();
  // Two maps can share a page, so the pattern and the title are named apart.
  const domId = useId();
  const titleId = `${domId}-title`;
  const dotsId = `${domId}-dots`;

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const compact = compactProp || (width > 0 && width < COMPACT_WIDTH);
  const height = Math.round(
    compact
      ? Math.min(Math.max(width * COMPACT_ASPECT, MIN_HEIGHT), COMPACT_MAX_HEIGHT)
      : Math.min(Math.max(width * ASPECT, MIN_HEIGHT), MAX_HEIGHT),
  );
  const padding = compact ? COMPACT_PADDING : PADDING;
  const radius = compact ? 16 : 13;
  const glyph = compact ? 7.8 : 7.2;

  // Roads first: every leg that has geometry decoded once, so the bounds hold
  // the whole route rather than only the stops it passes through.
  const roads = legs.map((leg) => ({
    leg,
    points: leg.geometry ? decodePolyline(leg.geometry.polyline, leg.geometry.precision) : [],
  }));
  const points = [
    ...roads.flatMap((entry) => entry.points),
    ...stops.map(({ lat, lon }) => ({ lat, lon })),
  ];
  // The map is dropped for this render only when nothing has ever loaded.
  const mapped = Boolean(credit) && !(refused > 0 && drawn === 0);
  const view = mapped && width ? fitTiles(points, width, height, padding, MAX_ZOOM) : null;
  const fit = view ?? (width ? fitBounds(points, width, height, padding) : null);

  const directions = googleMapsDirectionsUrl(stops);
  const missing = roads.filter(
    (entry) => !entry.points.length && entry.leg.from.index !== entry.leg.to.index,
  ).length;
  const miles = legs.reduce((sum, leg) => sum + (Number.isFinite(leg.miles) ? leg.miles : 0), 0);
  const interactive = typeof onSelectLeg === 'function';
  const pick = (seq: number) => onSelectLeg?.(selectedLeg === seq ? null : seq);
  const heading = title ?? t('Route map');

  // 'Start', '1', 'Finish' — the words the markers read, by stop index. The
  // arithmetic is in route-geometry; only the three words are translated.
  const word = (label: string) =>
    label === START
      ? t('Start')
      : label === FINISH
        ? t('Finish')
        : label === START_FINISH
          ? t('Start/Finish')
          : label;
  const marks = new Map(sequenceLabels(stops).map((mark) => [mark.index, mark]));
  const markOf = (stop: RouteStop) => marks.get(stop.index) ?? { primary: '', secondary: null };
  const nameOf = (stop: RouteStop) => stop.name || stop.label;
  const lastVisit = (stop: RouteStop) => (stop.seqs.length ? Math.max(...stop.seqs) : 0);
  const start = stops[0] ?? null;
  const finish = stops.reduce<RouteStop | null>(
    (latest, stop) => (!latest || lastVisit(stop) > lastVisit(latest) ? stop : latest),
    null,
  );
  /** A word marker is wider than a number and reads dark on its own fill. */
  const isWord = (label: string) => label === START || label === FINISH || label === START_FINISH;

  // One plain sentence about the day, said once: inside the canvas when there
  // is nothing to draw, under it when there is. Never a count of zero.
  const note =
    status === 'empty'
      ? t('The route will appear here once mileage is calculated.')
      : status === 'review'
        ? t('Some stops couldn’t be placed yet.')
        : status === 'incomplete' && missing > 0
          ? t('We couldn’t draw part of this route.')
          : t('{miles} miles over {legs} legs', { miles: formatNumber(miles), legs: legs.length });
  const warned = status === 'review' || (status === 'incomplete' && missing > 0);

  return (
    <figure className="rm" data-status={status} data-compact={compact ? '' : undefined}>
      <div className="rm-head">
        <p className="ld-step">{heading}</p>
        {directions && status !== 'empty' ? (
          <a className="rm-open" href={directions} target="_blank" rel="noreferrer">
            {t('Open in Google Maps')}
          </a>
        ) : null}
      </div>

      <div
        className="rm-canvas"
        ref={box}
        style={{ minHeight: MIN_HEIGHT }}
        data-mapped={view ? '' : undefined}
      >
        {view ? (
          <div className="rm-tiles" style={{ width, height }} aria-hidden="true">
            {view.tiles.map((tile) => (
              // Not next/image: a map tile is already exactly 256 pixels
              // square, served by this app's own route and cached for a week.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={tile.key}
                className="rm-tile"
                src={`${TILES}/${tile.z}/${tile.x}/${tile.y}.png`}
                alt=""
                width={tile.size}
                height={tile.size}
                loading="eager"
                decoding="async"
                draggable={false}
                style={{ left: tile.left, top: tile.top, width: tile.size, height: tile.size }}
                onLoad={() => setDrawn((count) => count + 1)}
                onError={() => setRefused((count) => count + 1)}
              />
            ))}
          </div>
        ) : null}
        {fit ? (
          <svg
            className="rm-svg"
            data-mapped={view ? '' : undefined}
            width={width}
            height={height}
            aria-labelledby={titleId}
            data-focused={selectedLeg === null ? undefined : ''}
          >
            <title id={titleId}>
              {start
                ? t('Route with {stops} stops, from {start} to {finish}', {
                    stops: stops.length,
                    start: nameOf(start),
                    finish: nameOf(finish ?? start),
                  })
                : heading}
            </title>
            <defs>
              <pattern id={dotsId} width="26" height="26" patternUnits="userSpaceOnUse">
                <circle className="rm-dot" cx="1" cy="1" r="0.8" />
              </pattern>
            </defs>
            {view ? null : (
              <rect
                className="rm-field"
                x="0"
                y="0"
                width={width}
                height={height}
                fill={`url(#${dotsId})`}
              />
            )}

            {/* Empty miles first and loaded miles over them: a shuttle day
                runs the same road both ways, and what the truck was carrying
                is the thing being shown. */}
            {[...roads]
              .sort(
                (a, b) =>
                  Number(toneOf(a.leg.kind) === 'loaded') - Number(toneOf(b.leg.kind) === 'loaded'),
              )
              .map(({ leg, points }) => {
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
                    {view ? <path className="rm-casing" d={shape} /> : null}
                    <path className="rm-line" d={shape} />
                    {arrow ? (
                      <path
                        className="rm-arrow"
                        d="M-3.2,-3.6 L3.6,0 L-3.2,3.6 Z"
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
              const mark = markOf(stop);
              // The disc is the first visit; the tag is the second, or a
              // count past that, so a shuttle day never grows a label wider
              // than the canvas.
              const primary = word(mark.primary);
              const tagged = visitTag(stops, stop);
              const secondary = tagged ? word(tagged) : null;
              const pill = markerWidth(primary, radius, glyph);
              // The second visit sits on whichever side has room for it.
              const left = x > width * 0.68;
              const tag = secondary ? markerWidth(secondary, radius * 0.7, glyph) : 0;
              const tagX = left ? x - pill / 2 - 6 - tag : x + pill / 2 + 6;
              return (
                <g
                  className="rm-stop"
                  key={stop.index}
                  data-kind={stop.kind}
                  data-word={isWord(mark.primary) ? '' : undefined}
                >
                  <title>{[primary, secondary, nameOf(stop)].filter(Boolean).join(' · ')}</title>
                  <rect
                    className="rm-disc"
                    x={x - pill / 2}
                    y={y - radius}
                    width={pill}
                    height={radius * 2}
                    rx={radius}
                  />
                  <text
                    className="rm-disc-text"
                    x={x}
                    y={y}
                    dominantBaseline="central"
                    textAnchor="middle"
                  >
                    {primary}
                  </text>
                  {secondary ? (
                    <>
                      <rect
                        className="rm-tag"
                        x={tagX}
                        y={y - radius * 0.7}
                        width={tag}
                        height={radius * 1.4}
                        rx={radius * 0.7}
                      />
                      <text
                        className="rm-tag-text"
                        x={tagX + tag / 2}
                        y={y}
                        dominantBaseline="central"
                        textAnchor="middle"
                      >
                        {secondary}
                      </text>
                    </>
                  ) : null}
                </g>
              );
            })}
          </svg>
        ) : (
          <p className="rm-empty">{width ? note : ''}</p>
        )}

        {view && credit ? <p className="rm-credit">{credit}</p> : null}
      </div>

      {fit ? (
        <figcaption
          className="rm-caption"
          data-tone={warned ? 'warning' : undefined}
          title={
            status === 'incomplete' && missing > 0
              ? t('{count} of {legs} legs have no road to follow.', {
                  count: missing,
                  legs: legs.length,
                })
              : undefined
          }
        >
          {note}
        </figcaption>
      ) : null}

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

      {fit ? (
        <ul className="rm-legend">
          <li className="rm-key" data-tone="loaded">
            {t('Carrying a load')}
          </li>
          <li className="rm-key" data-tone="empty">
            {t('Empty')}
          </li>
          {missing ? (
            <li className="rm-key" data-tone="missing">
              {t('Route not drawn')}
            </li>
          ) : null}
        </ul>
      ) : null}

      {/* On a phone the rows are only worth their height when they do something. */}
      {compact && !interactive ? null : (
        <Button
          variant="ghost"
          className="rm-legs-toggle"
          aria-expanded={listed}
          onClick={() => setListed(!listed)}
        >
          <ChevronDown aria-hidden="true" />
          {listed ? t('Hide the legs') : t('Show all {n} legs', { n: legs.length })}
        </Button>
      )}
      {(compact && !interactive) || !listed ? null : (
        <ul className="rm-legs">
          {legs.map((leg, at) => {
            // A row names the two visits this leg runs between and no others:
            // the nth drawn leg leaves visit n and arrives at visit n + 1,
            // which is the walk stopsFromLegs numbered. The drawn order is
            // used rather than the stored seq, since a leg left out for an
            // unplaced stop would put the two out of step.
            const from = word(visitLabel(stops, at + 1));
            const to = word(visitLabel(stops, at + 2));
            const row = (
              <>
                <span className="rm-leg-mark" data-tone={toneOf(leg.kind)} aria-hidden="true" />
                <span className="rm-leg-where">
                  <b>{from}</b> {nameOf(leg.from)} <span aria-hidden="true">→</span> <b>{to}</b>{' '}
                  {nameOf(leg.to)}
                </span>
                <span className="rm-leg-miles">
                  {formatNumber(leg.miles)} <small>{t('mi')}</small>
                  {typeof leg.seconds === 'number' ? (
                    <small className="rm-leg-time">{driveTime(leg.seconds, { t })}</small>
                  ) : null}
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
      )}
    </figure>
  );
}
