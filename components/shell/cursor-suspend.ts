'use client';

// Giving the system pointer back for a moment.
//
// The smooth cursor (app-cursor.tsx) hides the real pointer everywhere and
// draws its own in its place. That arrow is an ordinary element, so anything in
// the browser's top layer — a dialog opened with showModal() — is painted over
// it: the drawn cursor stays behind the dialog, on the page underneath, while
// the real one is invisible over the dialog itself. Nothing is then pointing at
// what the hand is doing, which matters most where a pointer is the tool rather
// than a way to reach a button, as in the cropper.
//
// So a top-layer dialog says so while it is open and the smooth cursor stands
// down. Counted rather than a flag, because closing one dialog opened over
// another must not hand the pointer back while the first is still up.

let held = 0;
const watchers = new Set<() => void>();

/**
 * Asks for the system pointer while something in the top layer is open. Call
 * the returned function to give it back; calling it twice is harmless.
 */
export function suspendSmoothCursor(): () => void {
  held += 1;
  for (const watcher of watchers) watcher();
  let given = false;
  return () => {
    if (given) return;
    given = true;
    held -= 1;
    for (const watcher of watchers) watcher();
  };
}

export function watchSmoothCursorSuspended(onChange: () => void) {
  watchers.add(onChange);
  return () => {
    watchers.delete(onChange);
  };
}

export const smoothCursorSuspended = () => held > 0;

// Taking the drawn cursor away without handing the system pointer back.
//
// Suspending is for a dialog painted over the drawn cursor, where the answer is
// the real pointer. This is the other case: something on the page is itself
// standing in for the pointer — the lens over a ticket preview is a round window
// that follows the hand — and a drawn arrow on top of it is a second mark where
// the eye wants one. So the drawn cursor goes and the system pointer stays
// hidden, leaving only the thing that replaced it.
//
// Counted for the same reason as above, and written straight onto the document
// rather than through a re-render: this runs on entering and leaving a picture,
// and rendering the app again on the way past is not worth it.

const HIDDEN_ATTRIBUTE = 'data-cursor-hidden';
let hiddenBy = 0;

const writeHidden = () => {
  const root = document.documentElement;
  if (hiddenBy > 0) root.setAttribute(HIDDEN_ATTRIBUTE, '');
  else root.removeAttribute(HIDDEN_ATTRIBUTE);
};

/**
 * Hides the drawn cursor while something else is pointing for it. Call the
 * returned function to bring it back; calling it twice is harmless, and calling
 * it when a view unmounts is what keeps a cursor from being lost for good.
 */
export function hideDrawnCursor(): () => void {
  hiddenBy += 1;
  writeHidden();
  let shown = false;
  return () => {
    if (shown) return;
    shown = true;
    hiddenBy -= 1;
    writeHidden();
  };
}
