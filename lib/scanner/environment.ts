// Who gets the camera scanner. It is built for a phone held over a ticket:
// a finger-operated screen, a camera, and a phone-sized viewport. A desk
// computer (even with a touch screen) and a tablet keep the file upload.

export type ScreenEnvironment = {
  /** A finger-operated screen, rather than a mouse or trackpad. */
  coarsePointer: boolean;
  /** True when the screen can hover, which a phone cannot. */
  canHover: boolean;
  width: number;
  height: number;
  /** The browser offers a camera at all (and the page is on a secure origin). */
  hasCamera: boolean;
};

/** Widest a phone's short edge gets; a small tablet starts around 744. */
export const MAX_PHONE_SHORT_EDGE = 600;
/** Longest a phone gets, so a tablet in landscape does not slip through. */
export const MAX_PHONE_LONG_EDGE = 1024;

/** True only for a phone that can actually take the photo. */
export function isPhoneEnvironment(screen: ScreenEnvironment): boolean {
  if (!screen.hasCamera || !screen.coarsePointer || screen.canHover) return false;
  const shortEdge = Math.min(screen.width, screen.height);
  const longEdge = Math.max(screen.width, screen.height);
  return shortEdge <= MAX_PHONE_SHORT_EDGE && longEdge <= MAX_PHONE_LONG_EDGE;
}
