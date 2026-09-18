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
