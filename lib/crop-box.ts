// The box that says what part of a picture is kept, and the two things that
// happen to it: it is moved, or one of its corners is dragged. Kept apart from
// the cropper itself so the arithmetic can be checked without a browser — it is
// the part of cropping that is easy to get subtly wrong and hard to see.
//
// Every measurement is in pixels of the picture as it is shown on the screen,
// which is the space the finger or the pointer works in. The cropper scales it
// up to the original only at the moment it cuts.

export type Box = { x: number; y: number; w: number; h: number };
export type Corner = 'nw' | 'ne' | 'sw' | 'se';
export type Limit = { width: number; height: number };

/** Small enough to crop tightly, large enough to still have corners to grab. */
export const MIN_SIDE = 64;

/** The whole picture, or the largest square inside it. */
export function wholeOf(width: number, height: number, square: boolean): Box {
  const side = Math.min(width, height);
  return square
    ? { x: (width - side) / 2, y: (height - side) / 2, w: side, h: side }
    : { x: 0, y: 0, w: width, h: height };
}

/** The same box, dragged by (dx, dy) and kept inside the picture. */
export function movedBox(start: Box, dx: number, dy: number, limit: Limit): Box {
  return {
    ...start,
    x: Math.min(limit.width - start.w, Math.max(0, start.x + dx)),
    y: Math.min(limit.height - start.h, Math.max(0, start.y + dy)),
  };
}

/**
 * One corner dragged by (dx, dy). The corner opposite it does not move, the box
 * never leaves the picture and never shrinks past MIN_SIDE, and with `square`
 * it stays as tall as it is wide.
 */
export function resizedBox(
  start: Box,
  corner: Corner,
  dx: number,
  dy: number,
  limit: Limit,
  square: boolean,
): Box {
  const right = start.x + start.w;
  const bottom = start.y + start.h;
  const west = corner === 'nw' || corner === 'sw';
  const north = corner === 'nw' || corner === 'ne';

  let x = west ? Math.min(right - MIN_SIDE, Math.max(0, start.x + dx)) : start.x;
  let y = north ? Math.min(bottom - MIN_SIDE, Math.max(0, start.y + dy)) : start.y;
  let w = west
    ? right - x
    : Math.min(limit.width - start.x, Math.max(MIN_SIDE, start.w + dx));
  let h = north
    ? bottom - y
    : Math.min(limit.height - start.y, Math.max(MIN_SIDE, start.h + dy));

  if (square) {
    // The smaller of the two, so a square corner never pushes the box out of
    // the picture on the axis that had less room left.
    const side = Math.max(MIN_SIDE, Math.min(w, h));
    w = h = side;
    // The fixed corner stays fixed: the sides that moved are the ones that
    // take up the difference.
    if (west) x = right - side;
    if (north) y = bottom - side;
  }
  return { x, y, w, h };
}
