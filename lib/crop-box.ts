// Fitting a picture into the shape it will be shown in.
//
// The window is the shape the icon has in the app — a circle for a person, a
// rounded square for a company — and it does not move. What moves is the
// picture behind it: dragged about and zoomed until the part worth keeping is
// the part showing through. This is the same way a phone crops a contact photo,
// and it has the property that matters here: whatever the person does, the
// window is always full. A free-form box can be dragged half off the picture
// and leave a corner of nothing in the icon; this cannot.
//
// Kept apart from the cropper so the arithmetic can be checked without a
// browser. Everything is in pixels of the original picture except `offset`,
// which is in pixels of the screen, because that is what a finger moves.

export type Size = { width: number; height: number };
export type Offset = { x: number; y: number };
/** The square of the original that ends up in the window. */
export type Source = { x: number; y: number; size: number };
/** A box as the browser laid it out, in the screen's own coordinates. */
export type Box = { left: number; top: number; width: number; height: number };

/** As far in as the picture may be pushed. Past this it is showing its grain. */
export const MAX_ZOOM = 5;

/**
 * The scale at which the picture just fills the window — its shorter side
 * exactly spanning it. Zoom is measured from here, so zoom 1 is always a full
 * window whatever shape the picture arrived in.
 */
export function coverScale(natural: Size, frame: number): number {
  const shorter = Math.min(natural.width, natural.height);
  return shorter > 0 ? frame / shorter : 1;
}

/**
 * The offset, held so the picture never pulls away from an edge of the window.
 * At zoom 1 along the picture's shorter side there is no room to move at all,
 * and the offset is pinned to nothing.
 */
export function clampOffset(
  offset: Offset,
  natural: Size,
  frame: number,
  drawScale: number,
): Offset {
  const roomX = Math.max(0, (natural.width * drawScale - frame) / 2);
  const roomY = Math.max(0, (natural.height * drawScale - frame) / 2);
  return {
    x: Math.min(roomX, Math.max(-roomX, offset.x)),
    y: Math.min(roomY, Math.max(-roomY, offset.y)),
  };
}

/**
 * The square of the original showing through the window, ready to be cut out.
 *
 * The picture is drawn centred in the window and then moved by `offset`, so a
 * point at `n` in the original lands at `frame / 2 + offset + (n - natural / 2)
 * * drawScale`. This reads that backwards for the two corners of the window.
 */
export function sourceRect(
  natural: Size,
  frame: number,
  drawScale: number,
  offset: Offset,
): Source {
  const size = frame / drawScale;
  return {
    x: natural.width / 2 - size / 2 - offset.x / drawScale,
    y: natural.height / 2 - size / 2 - offset.y / drawScale,
    size,
  };
}

/**
 * The same square, read off the two boxes as the browser actually laid them
 * out rather than worked out from the numbers that were meant to produce them.
 *
 * This is what is cut, because it cannot disagree with what was on the screen.
 * `sourceRect` describes a picture centred in the window, and for a while the
 * browser was not centring it: a box that clips its contents pushes an
 * oversized item back to its top-left corner, so the window showed the left of
 * a wide photograph while the sums cut its middle. Nothing that is measured can
 * drift from the thing it measures, however the picture comes to be placed.
 *
 * `picture` is the box the picture occupies on the screen, transform and all,
 * and `frame` the window in front of it. Both in the same coordinates — two
 * `getBoundingClientRect()` readings taken together.
 */
export function sourceRectFromBoxes(
  frame: Box,
  picture: Box,
  natural: Size,
): Source | null {
  // Drawn pixels per pixel of the original. Zero before the picture has been
  // laid out, and there is nothing to measure until it has.
  const scale = natural.width > 0 ? picture.width / natural.width : 0;
  if (!(scale > 0)) return null;
  return {
    x: (frame.left - picture.left) / scale,
    y: (frame.top - picture.top) / scale,
    size: Math.min(frame.width, frame.height) / scale,
  };
}
