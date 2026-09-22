// The shape of a routed day, for drawing it.
//
// A stored leg carries the miles and the two places; the road it actually
// follows comes back from the routing provider as an encoded polyline. This
// module turns those polylines into points, the legs into the distinct places
// the truck stood at (in visiting order, with the marker text a map shows),
// and a set of points into a projection that fits a box. Nothing here touches
// the DOM or React, so the same arithmetic runs in tests.

import type { LatLon, MileageLeg, RouteGeometry, StopKind } from './mileage.ts';

/** Re-exported so a drawing needs this module alone. */
export type { RouteGeometry };

// ------------------------------------------------------------- the polyline

/**
 * One value of the encoded-polyline algorithm: five-bit chunks, little end
 * first, the high bit set on every chunk but the last, zig-zag signed. Returns
 * null on a character outside the alphabet, on a chunk that never ends, and on
 * a run too long to be a delta — each of which means the rest is not readable.
 */
function readValue(encoded: string, start: number): { delta: number; next: number } | null {
  let result = 0;
  let shift = 0;
  let index = start;
  while (index < encoded.length) {
    const code = encoded.charCodeAt(index) - 63;
    index += 1;
    if (code < 0 || code > 63) return null;
    result |= (code & 0x1f) << shift;
    shift += 5;
    if (code < 0x20) return { delta: result & 1 ? ~(result >> 1) : result >> 1, next: index };
    if (shift > 30) return null;
  }
  return null;
}

/**
 * Points from an encoded polyline at the provider's precision (five decimal
 * places, or seven where it sends them). Malformed input never throws: what
 * could be read is returned and the rest is dropped, so a bad cache entry
 * costs a partial line rather than a blank page.
 */
export function decodePolyline(encoded: string, precision: 5 | 7): LatLon[] {
  const points: LatLon[] = [];
  if (typeof encoded !== 'string' || !encoded) return points;
  const factor = precision === 7 ? 1e7 : 1e5;
  let index = 0;
  let lat = 0;
  let lon = 0;
  while (index < encoded.length) {
    const latDelta = readValue(encoded, index);
    if (!latDelta) break;
    const lonDelta = readValue(encoded, latDelta.next);
    if (!lonDelta) break;
    lat += latDelta.delta;
    lon += lonDelta.delta;
    index = lonDelta.next;
    points.push({ lat: lat / factor, lon: lon / factor });
  }
  return points;
}

// ------------------------------------------------------------------- stops

/**
 * A place the truck stood at, once per position however many times it was
 * visited. `short` is the ticket shorthand — 'Y' for the yard, '1P' and '1D'
 * for the first ticket, and the stacked '1D·2P' where two visits share a
 * position; a marker shows `sequenceLabels` instead, which reads as words and
 * numbers. `seqs` are the 1-based places in the visiting order. `name` and
 * `address` are what the place is called where the stored place carried them,
 * and a marker prefers the name over the raw label.
 */
export type RouteStop = {
  index: number;
  kind: StopKind;
  label: string;
  short: string;
  lat: number;
  lon: number;
  ticket_id: number | null;
  place_key: string;
  seqs: number[];
  name?: string;
  address?: string;
};

/**
 * A leg's place as this module reads it. A stored place may carry the name and
 * the address it was resolved from; both are optional, so a day saved before
 * they existed still draws.
 */
type RoutePlace = MileageLeg['from'] & { name?: string; address?: string };

/**
 * The three words a marker can read instead of a number. Exported because
 * this module stays pure English and the drawing translates them.
 */
export const START = 'Start';
export const FINISH = 'Finish';
export const START_FINISH = 'Start/Finish';

const placed = (place: { lat: number; lon: number }) =>
  Number.isFinite(place.lat) && Number.isFinite(place.lon);

/** Two visits are the same position when the place key matches, else the coordinates. */
const positionKey = (place: { place_key?: string; lat: number; lon: number }) =>
  place.place_key ? `k:${place.place_key}` : `c:${place.lat.toFixed(5)},${place.lon.toFixed(5)}`;

/**
 * What each end of a leg is. A stored leg names its kind except where two
 * stops share an address ('same_place'), which says nothing about either end;
 * there the day's shape decides — the last stop is the yard, and otherwise
 * stops alternate pickup, delivery.
 */
const endsOf = (leg: MileageLeg, previous: StopKind, last: boolean): [StopKind, StopKind] => {
  if (leg.kind === 'yard_to_pickup') return ['yard', 'pickup'];
  if (leg.kind === 'delivery_to_yard') return ['delivery', 'yard'];
  if (leg.kind === 'pickup_to_delivery') return ['pickup', 'delivery'];
  if (leg.kind === 'delivery_to_pickup') return ['delivery', 'pickup'];
  return [previous, last ? 'yard' : previous === 'pickup' ? 'delivery' : 'pickup'];
};

/**
 * The distinct positions of a day's legs, in the order they were first
 * visited. Legs are read in `seq` order; a leg whose place has no coordinates
 * is skipped, because an unplaced stop is listed beside the map rather than
 * drawn on it.
 */
export function stopsFromLegs(legs: MileageLeg[]): RouteStop[] {
  const ordered = [...legs].sort((a, b) => a.seq - b.seq).filter((leg) => placed(leg.from) && placed(leg.to));
  if (!ordered.length) return [];

  // Each ticket keeps one number for the whole day, taken when its first stop
  // is reached, so a pickup and its delivery read as '2P' and '2D'.
  const ticketNumbers = new Map<number, number>();
  let numbered = 0;
  const numberFor = (ticketId: number | null) => {
    const key = ticketId ?? 0;
    const known = ticketNumbers.get(key);
    if (known !== undefined) return known;
    numbered += 1;
    ticketNumbers.set(key, numbered);
    return numbered;
  };
  const shortFor = (kind: StopKind, ticketId: number | null) =>
    kind === 'yard' ? 'Y' : `${numberFor(ticketId)}${kind === 'pickup' ? 'P' : 'D'}`;

  const byPosition = new Map<string, { stop: RouteStop; shorts: string[] }>();
  const stops: RouteStop[] = [];
  const visit = (place: RoutePlace, kind: StopKind, ticketId: number | null, seq: number) => {
    const key = positionKey(place);
    const short = shortFor(kind, ticketId);
    const seen = byPosition.get(key);
    if (seen) {
      seen.stop.seqs.push(seq);
      if (!seen.shorts.includes(short)) seen.shorts.push(short);
      return;
    }
    const stop: RouteStop = {
      index: stops.length,
      kind,
      label: place.label,
      short,
      lat: place.lat,
      lon: place.lon,
      ticket_id: ticketId,
      place_key: place.place_key,
      seqs: [seq],
      ...(place.name ? { name: place.name } : {}),
      ...(place.address ? { address: place.address } : {}),
    };
    stops.push(stop);
    byPosition.set(key, { stop, shorts: [short] });
  };

  let seq = 1;
  let previous: StopKind = endsOf(ordered[0], 'yard', ordered.length === 1)[0];
  visit(ordered[0].from, previous, ordered[0].ticket_id, seq);
  for (const [at, leg] of ordered.entries()) {
    const [, to] = endsOf(leg, previous, at === ordered.length - 1);
    seq += 1;
    visit(leg.to, to, leg.ticket_id, seq);
    previous = to;
  }

  // The marker text last, once every visit is known: '1P·2P' where the truck
  // loaded twice at one place, 'Y' however often it passed the yard.
  for (const { stop, shorts } of byPosition.values()) stop.short = shorts.join('·');
  return stops;
}

/**
 * What each marker reads, in words a dispatcher does not have to decode. The
 * first visit of the day is 'Start' and the last is 'Finish'; every visit in
 * between is numbered 1, 2, 3… in the order it happened. A place visited more
 * than once carries the rest of its visits as `secondary` — the yard comes
 * back as 'Start' with a 'Finish' beside it, a plant loaded twice as '1' with
 * '3'. Where the whole day is one visit there is nothing to tell apart, so it
 * reads 'Start/Finish'. Returned in the order the stops were given.
 */
export function sequenceLabels(
  stops: RouteStop[],
): { index: number; primary: string; secondary: string | null }[] {
  const labels = visitWords(stops);
  return stops.map((stop) => {
    const mine = [...stop.seqs].sort((a, b) => a - b).map((seq) => labels.get(seq) ?? '');
    return {
      index: stop.index,
      primary: mine[0] ?? '',
      secondary: mine.length > 1 ? mine.slice(1).join(' · ') : null,
    };
  });
}

/**
 * What one visit reads, rather than every visit its place ever had. A leg
 * connects two visits and nothing else, so a list of legs asks for those two
 * by their visiting number — on a nine-load day the row for leg three says
 * '2 → 3' instead of reciting all nine times the truck stood at that plant.
 * Empty where there is no such visit.
 */
export function visitLabel(stops: RouteStop[], seq: number): string {
  return visitWords(stops).get(seq) ?? '';
}

/**
 * What sits beside a marker, or null where the place was stood at once and
 * there is nothing to add. Two visits name the second one — the yard comes
 * back as 'Finish', a plant loaded twice as '3'. Past two visits the list
 * would run wider than the disc it sits next to, so it becomes a count
 * instead: a twelve-load shuttle reads '×12' rather than eleven numbers
 * nobody can take in on a phone.
 */
export function visitTag(stops: RouteStop[], stop: RouteStop): string | null {
  const mine = [...stop.seqs].sort((a, b) => a - b);
  if (mine.length < 2) return null;
  if (mine.length > 2) return `×${mine.length}`;
  return visitWords(stops).get(mine[1]) ?? null;
}

/**
 * One label per visit, walked in visiting order, so the numbering never
 * depends on which stop a visit happens to belong to: the first visit of the
 * day is 'Start', the last is 'Finish', the rest are 1, 2, 3…
 */
function visitWords(stops: RouteStop[]): Map<number, string> {
  const labels = new Map<number, string>();
  const visits = stops.flatMap((stop) => stop.seqs).filter((seq) => Number.isFinite(seq));
  if (!visits.length) return labels;
  const first = Math.min(...visits);
  const last = Math.max(...visits);
  let numbered = 0;
  for (const seq of [...new Set(visits)].sort((a, b) => a - b)) {
    if (seq === first && seq === last) labels.set(seq, START_FINISH);
    else if (seq === first) labels.set(seq, START);
    else if (seq === last) labels.set(seq, FINISH);
    else {
      numbered += 1;
      labels.set(seq, String(numbered));
    }
  }
  return labels;
}

/**
 * Each leg with the stops it runs between. Legs whose places were not placed
 * are left out, matching what `stopsFromLegs` drew.
 */
export function legsWithStops(
  legs: MileageLeg[],
  stops: RouteStop[],
): { leg: MileageLeg; from: RouteStop; to: RouteStop }[] {
  const byPosition = new Map<string, RouteStop>();
  for (const stop of stops) byPosition.set(positionKey(stop), stop);
  const paired: { leg: MileageLeg; from: RouteStop; to: RouteStop }[] = [];
  for (const leg of [...legs].sort((a, b) => a.seq - b.seq)) {
    if (!placed(leg.from) || !placed(leg.to)) continue;
    const from = byPosition.get(positionKey(leg.from));
    const to = byPosition.get(positionKey(leg.to));
    if (from && to) paired.push({ leg, from, to });
  }
  return paired;
}

// -------------------------------------------------------------- projection

/** Web Mercator, clamped where the projection runs away at the poles. */
const MAX_LATITUDE = 85.05112878;
const mercatorY = (lat: number) => {
  const clamped = Math.min(Math.max(lat, -MAX_LATITUDE), MAX_LATITUDE);
  return Math.log(Math.tan(Math.PI / 4 + (clamped * Math.PI) / 360));
};
const mercatorX = (lon: number) => (lon * Math.PI) / 180;

/**
 * A projection that puts every point inside a `width` × `height` box with
 * `padding` clear on each side, centred, at one scale for both axes so the
 * roads keep their shape. Null when there is nothing to fit; a single point
 * lands in the middle.
 */
export function fitBounds(
  points: LatLon[],
  width: number,
  height: number,
  padding: number,
): { project(p: LatLon): { x: number; y: number }; scale: number } | null {
  const usable = points.filter((point) => placed(point));
  if (!usable.length) return null;
  const xs = usable.map((point) => mercatorX(point.lon));
  const ys = usable.map((point) => mercatorY(point.lat));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const innerWidth = Math.max(width - padding * 2, 1);
  const innerHeight = Math.max(height - padding * 2, 1);
  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const scale =
    spanX <= 0 && spanY <= 0
      ? 1
      : Math.min(spanX > 0 ? innerWidth / spanX : Infinity, spanY > 0 ? innerHeight / spanY : Infinity);
  const centreX = (minX + maxX) / 2;
  const centreY = (minY + maxY) / 2;
  const midX = padding + innerWidth / 2;
  const midY = padding + innerHeight / 2;
  return {
    scale,
    project: (point: LatLon) => ({
      x: midX + (mercatorX(point.lon) - centreX) * scale,
      y: midY - (mercatorY(point.lat) - centreY) * scale,
    }),
  };
}

/** A map tile is this many pixels square, as the source draws it. */
export const TILE_SIZE = 256;

export type MapTile = {
  key: string;
  z: number;
  x: number;
  y: number;
  left: number;
  top: number;
  /** Drawn at this size, which is TILE_SIZE except between two zooms. */
  size: number;
};

export type TileView = {
  /** The whole-number zoom the pictures are fetched at. */
  zoom: number;
  project(point: LatLon): { x: number; y: number };
  /** The pictures that cover the canvas, with where each one sits on it. */
  tiles: MapTile[];
};

/**
 * The same fit as `fitBounds`, on a map made of tiles.
 *
 * Pictures exist only at whole-number zooms, but a route rarely fits one
 * exactly: taking the smaller zoom can leave the day drawn at half the size
 * of the canvas it is in. So the pictures of the zoom below are drawn a
 * little larger — never more than twice — and the route is projected at that
 * same scale, which is how the day comes out filling its canvas. Both this
 * and `fitBounds` are Web Mercator, the projection the pictures are drawn in,
 * so the roads land on their own streets.
 *
 * Null when there is nothing to fit. A single point is centred at a zoom
 * close enough to read the street it is on.
 */
export function fitTiles(
  points: LatLon[],
  width: number,
  height: number,
  padding: number,
  maxZoom = 17,
): TileView | null {
  const usable = points.filter((point) => placed(point));
  if (!usable.length || width <= 0 || height <= 0) return null;
  // World pixels at zoom 0, where the whole world is one tile.
  const worldX = (lon: number) => ((lon + 180) / 360) * TILE_SIZE;
  const worldY = (lat: number) => {
    const clamped = Math.min(Math.max(lat, -MAX_LATITUDE), MAX_LATITUDE);
    const sin = Math.sin((clamped * Math.PI) / 180);
    return (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * TILE_SIZE;
  };
  const xs = usable.map((point) => worldX(point.lon));
  const ys = usable.map((point) => worldY(point.lat));
  const spanX = Math.max(...xs) - Math.min(...xs);
  const spanY = Math.max(...ys) - Math.min(...ys);
  const innerWidth = Math.max(width - padding * 2, 1);
  const innerHeight = Math.max(height - padding * 2, 1);
  const room = Math.min(
    spanX > 0 ? innerWidth / spanX : Infinity,
    spanY > 0 ? innerHeight / spanY : Infinity,
  );
  // The scale the day wants, and the zoom whose pictures are stretched to it.
  const wanted = Math.min(room === Infinity ? 2 ** maxZoom : room, 2 ** maxZoom);
  const zoom = Math.max(0, Math.min(maxZoom, Math.floor(Math.log2(wanted))));
  const scale = Math.max(wanted, 2 ** zoom);
  const size = TILE_SIZE * (scale / 2 ** zoom);
  const centreX = ((Math.min(...xs) + Math.max(...xs)) / 2) * scale;
  const centreY = ((Math.min(...ys) + Math.max(...ys)) / 2) * scale;
  const originX = centreX - width / 2;
  const originY = centreY - height / 2;

  const across = 2 ** zoom;
  const tiles: MapTile[] = [];
  const firstColumn = Math.floor(originX / size);
  const lastColumn = Math.floor((originX + width - 1) / size);
  const firstRow = Math.floor(originY / size);
  const lastRow = Math.floor((originY + height - 1) / size);
  for (let row = firstRow; row <= lastRow; row += 1) {
    // Above the north pole or below the south there is no picture; the canvas
    // shows its own background there.
    if (row < 0 || row >= across) continue;
    for (let column = firstColumn; column <= lastColumn; column += 1) {
      // East of the date line the world starts again.
      const wrapped = ((column % across) + across) % across;
      tiles.push({
        key: `${zoom}/${column}/${row}`,
        z: zoom,
        x: wrapped,
        y: row,
        left: Math.round(column * size - originX),
        top: Math.round(row * size - originY),
        // A whole pixel over, so two neighbours never leave a hairline gap
        // between them when the scale is not a round number.
        size: Math.ceil(size) + 1,
      });
    }
  }

  return {
    zoom,
    tiles,
    project: (point: LatLon) => ({
      x: worldX(point.lon) * scale - originX,
      y: worldY(point.lat) * scale - originY,
    }),
  };
}

// ----------------------------------------------------------------- hand-off

/** Google takes ten points in a directions link. */
const MAX_DIRECTIONS_STOPS = 10;

const coordinate = (stop: RouteStop) => `${stop.lat.toFixed(6)},${stop.lon.toFixed(6)}`;

/**
 * The day's stops as a Google Maps directions link, in visiting order. Past
 * ten stops the first nine are kept with the last one, so the link still ends
 * where the truck did. Null when there is nothing to route.
 */
export function googleMapsDirectionsUrl(stops: RouteStop[]): string | null {
  const usable = stops.filter((stop) => placed(stop));
  if (usable.length < 2) return null;
  const kept =
    usable.length <= MAX_DIRECTIONS_STOPS
      ? usable
      : [...usable.slice(0, MAX_DIRECTIONS_STOPS - 1), usable[usable.length - 1]];
  return `https://www.google.com/maps/dir/${kept.map(coordinate).join('/')}`;
}
