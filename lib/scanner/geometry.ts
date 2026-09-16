export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];
export const scannerConfig = {
  analysisSize: 720, intervalMs: 125, stableMs: 700, movement: 0.012,
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
export class StabilityTracker {
  private anchor: Quad | null = null;
  private since = 0;
  private last = 0;
  reset() { this.anchor = null; this.since = this.last = 0; }
  update(corners: Quad | null, acceptable: boolean, now: number) {
    if (!corners || !acceptable) { this.reset(); return false; }
    if (!this.anchor || now - this.last > 350 || movement(this.anchor, corners) > scannerConfig.movement) {
      this.anchor = corners; this.since = now;
    }
    this.last = now;
    return now - this.since >= scannerConfig.stableMs;
  }
}
export type Detection = {
  corners: Quad; confidence: number; area: number; sharpness: number;
  brightness: number; darkFraction: number; glareFraction: number; perspective: number;
};
export function guidance(d: Detection | null, sourceWidth: number, sourceHeight: number): string {
  if (!d || d.confidence < scannerConfig.minConfidence) return 'Find ticket';
  if (d.corners.some(p => p.x < scannerConfig.frameMargin || p.y < scannerConfig.frameMargin || p.x > 1 - scannerConfig.frameMargin || p.y > 1 - scannerConfig.frameMargin) || d.area > scannerConfig.maxArea) return 'Move back';
  const size = dimensions(d.corners.map(p => ({ x: p.x * sourceWidth, y: p.y * sourceHeight })) as Quad);
  if (d.area < scannerConfig.usefulArea || Math.min(size.width, size.height) < scannerConfig.minShortEdge) return 'Move closer';
  if (d.perspective > 2.0) return 'Hold phone straighter';
  if (d.brightness < scannerConfig.minBrightness || d.darkFraction > scannerConfig.maxDarkFraction) return 'More light needed';
  if (d.glareFraction > scannerConfig.maxGlareFraction) return 'Reduce glare';
  return 'Hold still...';
}
