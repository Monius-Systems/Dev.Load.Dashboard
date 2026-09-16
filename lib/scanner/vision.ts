import type CV from '@techstark/opencv-js';
import { dimensions, distance, expandCorners, movement, orderCorners, scannerConfig, type Detection, type Quad } from './geometry.ts';
export type OpenCV = typeof CV;

/** Contours locate physical boundaries; no supplier, paper color or aspect-ratio template. */
export function detectDocument(cv: OpenCV, image: ImageData, previous: Quad | null = null): Detection | null {
  const owned: { delete(): void }[] = [];
  const keep = <T extends { delete(): void }>(value: T): T => { owned.push(value); return value; };
  try {
    const src = keep(cv.matFromImageData(image)), gray = keep(new cv.Mat()), blurred = keep(new cv.Mat());
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    const edge = keep(new cv.Mat()), threshold = keep(new cv.Mat()), closed = keep(new cv.Mat());
    cv.Canny(blurred, edge, 35, 110);
    const kernel = keep(cv.Mat.ones(3, 3, cv.CV_8U));
    cv.morphologyEx(edge, closed, cv.MORPH_CLOSE, kernel);
    cv.adaptiveThreshold(blurred, threshold, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 31, 7);
    const w = image.width, h = image.height;
    let best: Detection | null = null;
    for (const binary of [closed, threshold]) {
      const contours = new cv.MatVector(), hierarchy = new cv.Mat();
      try {
        cv.findContours(binary, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
        for (let index = 0; index < contours.size(); index++) {
          const contour = contours.get(index), approx = new cv.Mat();
          try {
            const area = Math.abs(cv.contourArea(contour)) / (w * h);
            if (area < scannerConfig.minArea || area > 0.96) continue;
            cv.approxPolyDP(contour, approx, cv.arcLength(contour, true) * 0.018, true);
            if (approx.rows !== 4 || !cv.isContourConvex(approx)) continue;
            const q = orderCorners(Array.from({ length: 4 }, (_, i) => ({ x: approx.data32S[i * 2], y: approx.data32S[i * 2 + 1] })));
            const sides = q.map((p, i) => distance(p, q[(i + 1) % 4]));
            if (Math.min(...sides) < 25) continue;
            const cosines = q.map((p, i) => {
              const a = q[(i + 3) % 4], b = q[(i + 1) % 4];
              return Math.abs(((a.x - p.x) * (b.x - p.x) + (a.y - p.y) * (b.y - p.y)) / (distance(a, p) * distance(b, p)));
            });
            if (Math.max(...cosines) > 0.8) continue;
            const normalized = q.map(p => ({ x: p.x / w, y: p.y / h })) as Quad;
            const metrics = sampleMetrics(gray.data, edge.data, image.data, w, h, q);
            const center = normalized.reduce((s, p) => ({ x: s.x + p.x / 4, y: s.y + p.y / 4 }), { x: 0, y: 0 });
            const centered = Math.max(0, 1 - Math.hypot(center.x - 0.5, center.y - 0.5) * 1.7);
            const geometry = 1 - cosines.reduce((a, b) => a + b, 0) / 4;
            const useful = Math.min(1, area / 0.35) * (area > 0.85 ? 0.6 : 1);
            const consistent = previous ? Math.max(0, 1 - movement(normalized, previous) * 8) : 0.5;
            // Text-like interior detail and actual edge support prevent area alone winning.
            const confidence = 0.17 * centered + 0.12 * useful + 0.2 * geometry + 0.23 * metrics.boundary + 0.2 * Math.min(1, metrics.texture / 0.045) + 0.08 * consistent;
            if (metrics.boundary < 0.42 || metrics.texture < 0.006) continue;
            const perspective = Math.max(sides[0] / sides[2], sides[2] / sides[0], sides[1] / sides[3], sides[3] / sides[1], 1 / Math.sqrt(1 - Math.max(...cosines) ** 2));
            if (!best || confidence > best.confidence) best = { corners: normalized, confidence, area, perspective, ...metrics };
          } finally { contour.delete(); approx.delete(); }
        }
      } finally { contours.delete(); hierarchy.delete(); }
    }
    return best;
  } finally { owned.reverse().forEach(value => value.delete()); }
}

function sampleMetrics(gray: Uint8Array, edges: Uint8Array, rgba: Uint8ClampedArray, w: number, h: number, q: Quad) {
  let count = 0, sum = 0, dark = 0, glare = 0, texture = 0, lap = 0, lap2 = 0;
  const minX = Math.max(2, Math.floor(Math.min(...q.map(p => p.x)))), maxX = Math.min(w - 3, Math.ceil(Math.max(...q.map(p => p.x))));
  const minY = Math.max(2, Math.floor(Math.min(...q.map(p => p.y)))), maxY = Math.min(h - 3, Math.ceil(Math.max(...q.map(p => p.y))));
  for (let y = minY; y <= maxY; y += 2) for (let x = minX; x <= maxX; x += 2) {
    if (!q.every((p, i) => { const b = q[(i + 1) % 4]; return (b.x - p.x) * (y - p.y) - (b.y - p.y) * (x - p.x) > 3 * distance(p, b); })) continue;
    const i = y * w + x, v = gray[i], l = gray[i - 1] + gray[i + 1] + gray[i - w] + gray[i + w] - 4 * v;
    count++; sum += v; dark += v < 30 ? 1 : 0; texture += edges[i] > 0 ? 1 : 0; lap += l; lap2 += l * l;
    // Clipped, locally flat highlights. White paper below clipping is not glare.
    if (rgba[i * 4] > 252 && rgba[i * 4 + 1] > 252 && rgba[i * 4 + 2] > 252 && Math.abs(l) < 3) glare++;
  }
  let supported = 0, samples = 0;
  q.forEach((a, i) => { const b = q[(i + 1) % 4]; for (let t = 0.05; t < 0.96; t += 0.025) {
    const x = Math.round(a.x + (b.x - a.x) * t), y = Math.round(a.y + (b.y - a.y) * t);
    let found = false;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) if (x + dx >= 0 && x + dx < w && y + dy >= 0 && y + dy < h && edges[(y + dy) * w + x + dx]) found = true;
    samples++; if (found) supported++;
  } });
  count = Math.max(1, count);
  return { brightness: sum / count, darkFraction: dark / count, glareFraction: glare / count, sharpness: lap2 / count - (lap / count) ** 2, texture: texture / count, boundary: supported / samples };
}

export function rectifyDocument(cv: OpenCV, image: ImageData, normalized: Quad): ImageData {
  const q = expandCorners(normalized.map(p => ({ x: p.x * image.width, y: p.y * image.height })) as Quad, image.width, image.height);
  const { width, height } = dimensions(q);
  const src = cv.matFromImageData(image), dst = new cv.Mat();
  const from = cv.matFromArray(4, 1, cv.CV_32FC2, q.flatMap(p => [p.x, p.y]));
  const to = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width - 1, 0, width - 1, height - 1, 0, height - 1]);
  const transform = cv.getPerspectiveTransform(from, to);
  try {
    cv.warpPerspective(src, dst, transform, new cv.Size(width, height), cv.INTER_CUBIC, cv.BORDER_REPLICATE);
    return new ImageData(new Uint8ClampedArray(dst.data), width, height);
  } finally { src.delete(); dst.delete(); from.delete(); to.delete(); transform.delete(); }
}
