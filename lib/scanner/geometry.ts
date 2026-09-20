import { UNKNOWN_FRAME, type EdgeState, type PaperFrame } from '../load-desk/recovery/contract.ts';

export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];
// stableMs and movement went with the automatic shutter: how long a ticket had
// to be held still, and how still. The photograph is taken by the person now.
export const scannerConfig = {
  analysisSize: 720, intervalMs: 125,
  minConfidence: 0.73, minArea: 0.07, usefulArea: 0.18, maxArea: 0.9,
  frameMargin: 0.012, minShortEdge: 600, minSharpness: 65,
  minBrightness: 55, maxDarkFraction: 0.35, maxGlareFraction: 0.08,
  safetyMargin: 0.006,
};
export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
export function orderCorners(points: Point[]): Quad {
  const center = points.reduce((s, p) => ({ x: s.x + p.x / 4, y: s.y + p.y / 4 }), { x: 0, y: 0 });
  const sorted = [...points].sort((a, b) => Math.atan2(a.y - center.y, a.x - center.x) - Math.atan2(b.y - center.y, b.x - center.x));
  const first = sorted.reduce((best, p, i) => p.x + p.y < sorted[best].x + sorted[best].y ? i : best, 0);
  return [...sorted.slice(first), ...sorted.slice(0, first)] as Quad;
}
export function movement(a: Quad, b: Quad) { return Math.max(...a.map((p, i) => distance(p, b[i]))); }
export function dimensions(q: Quad) {
  return { width: Math.round(Math.max(distance(q[0], q[1]), distance(q[3], q[2]))), height: Math.round(Math.max(distance(q[0], q[3]), distance(q[1], q[2]))) };
}
export function expandCorners(q: Quad, width: number, height: number, margin = scannerConfig.safetyMargin): Quad {
  const center = q.reduce((s, p) => ({ x: s.x + p.x / 4, y: s.y + p.y / 4 }), { x: 0, y: 0 });
  return q.map(p => ({ x: Math.max(0, Math.min(width - 1, center.x + (p.x - center.x) * (1 + 2 * margin))), y: Math.max(0, Math.min(height - 1, center.y + (p.y - center.y) * (1 + 2 * margin))) })) as Quad;
}
export type Detection = {
  corners: Quad; confidence: number; area: number; sharpness: number;
  brightness: number; darkFraction: number; glareFraction: number; perspective: number;
};
/**
 * Whether the bottom of the sheet runs off the bottom of the frame. On these
 * tickets everything that is billed — the number, the date, the customer, the
 * weights — is printed in the top half, and the rest of the page is the
 * printed warranty. Held close enough to read, the bottom leaves the frame.
 */
export const clippedAtBottom = (q: Quad) =>
  q.some(p => p.y > 1 - scannerConfig.frameMargin);

/**
 * Whether enough of the sheet is in view to photograph. Its top, left and right
 * edges have to be inside the frame — those bound the part that is read. The
 * bottom is allowed to run off, so filling the frame with the top half of a
 * ticket is a good photograph rather than one the scanner refuses to take.
 */
export const withinFrame = (q: Quad) =>
  q.every(
    p =>
      p.x > scannerConfig.frameMargin &&
      p.x < 1 - scannerConfig.frameMargin &&
      p.y > scannerConfig.frameMargin,
  );

export function guidance(d: Detection | null, sourceWidth: number, sourceHeight: number): string {
  if (!d || d.confidence < scannerConfig.minConfidence) return 'Find ticket';
  if (!withinFrame(d.corners)) return 'Move back';
  // Too close only means anything when the whole sheet is in the frame; a
  // ticket deliberately filling it from the top cannot be "too big".
  if (!clippedAtBottom(d.corners) && d.area > scannerConfig.maxArea) return 'Move back';
  const size = dimensions(d.corners.map(p => ({ x: p.x * sourceWidth, y: p.y * sourceHeight })) as Quad);
  if (d.area < scannerConfig.usefulArea || Math.min(size.width, size.height) < scannerConfig.minShortEdge) return 'Move closer';
  if (d.perspective > 2.0) return 'Hold phone straighter';
  if (d.brightness < scannerConfig.minBrightness || d.darkFraction > scannerConfig.maxDarkFraction) return 'More light needed';
  if (d.glareFraction > scannerConfig.maxGlareFraction) return 'Reduce glare';
  return 'Hold still...';
}

/**
 * Where each edge of the sheet stands in the picture, from the corners the
 * detector reported.
 *
 * This is the one thing that tells a camera crop from source clipping. A
 * ticket number with its last digit missing means two entirely different
 * things depending on whether the right-hand edge of the paper is in the
 * photograph: if it is, the printer put the digit past the edge of the sheet
 * and no retake will ever find it, so the app has to recover it from evidence;
 * if it is not, the photographer cut it off and the answer is to take the
 * picture again. Guessing in the second case would be inventing a digit that
 * is sitting there on the paper, a foot away from the phone.
 *
 * An edge is `cut` when a corner of the sheet sits on or past the margin the
 * rest of the scanner treats as the border of the frame — the same test, and
 * the same margin, that `withinFrame` and `clippedAtBottom` already use, so
 * the camera's coaching and this never disagree about the same picture.
 *
 * Nothing detected means nothing is known: every side comes back `unknown`,
 * which blocks nothing and excuses nothing.
 */
export function paperFrameOf(corners: Quad | null | undefined): PaperFrame {
  if (!corners || corners.length !== 4) return UNKNOWN_FRAME;
  const m = scannerConfig.frameMargin;
  const state = (cut: boolean): EdgeState => (cut ? 'cut' : 'inside');
  return {
    detected: true,
    left: state(corners.some(p => p.x <= m)),
    right: state(corners.some(p => p.x >= 1 - m)),
    top: state(corners.some(p => p.y <= m)),
    bottom: state(corners.some(p => p.y >= 1 - m)),
  };
}
