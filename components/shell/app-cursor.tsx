'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import {
  smoothCursorSuspended,
  watchSmoothCursorSuspended,
} from '@/components/shell/cursor-suspend';

const POINTER = '(any-hover: hover) and (any-pointer: fine)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(POINTER), window.matchMedia(REDUCED_MOTION)];
  for (const query of queries) query.addEventListener('change', onChange);
  return () => {
    for (const query of queries) query.removeEventListener('change', onChange);
  };
}

const wanted = () =>
  window.matchMedia(POINTER).matches && !window.matchMedia(REDUCED_MOTION).matches;

/**
 * Magic UI's smooth cursor for mouse and trackpad users. While it is on, the
 * system pointer is hidden everywhere (globals.css), including over buttons and
 * fields. It stays off on touch screens and when reduced motion is requested.
 *
 * It also stands down while a dialog in the browser's top layer is open, which
 * is painted over this cursor and would otherwise leave the pointer invisible
 * there; see cursor-suspend.ts.
 */
export default function AppCursor() {
  const wantsCursor = useSyncExternalStore(subscribe, wanted, () => false);
  const suspended = useSyncExternalStore(
    watchSmoothCursorSuspended,
    smoothCursorSuspended,
    () => false,
  );
  const enabled = wantsCursor && !suspended;

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.dataset.smoothCursor = 'on';

    // Chrome on macOS shows its default arrow after a click or focus change
    // (such as a menu opening or a page change) and only hides it again when
    // the pointer style changes or the mouse moves. Swapping between the two
    // invisible pointers in globals.css is such a change. Chrome applies a
    // style-driven pointer change on a short internal delay (about 50ms) and
    // skips values equal to the last one it applied, so after each of those
    // events the pointer is swapped at once and then every 60ms for a moment:
    // every time Chrome applies the pointer it finds a new invisible one.
    // Each swap restyles the whole page, so it runs only after the events that
    // bring the arrow back (clicks and focus changes), never while typing.
    const SWAP_EVERY_MS = 60;
    const KEEP_SWAPPING_MS = 420;
    let swapUntil = 0;
    let timer = 0;
    const swap = () => {
      root.dataset.smoothCursor = root.dataset.smoothCursor === 'on' ? 'alt' : 'on';
    };
    const tick = () => {
      swap();
      timer =
        performance.now() < swapUntil ? window.setTimeout(tick, SWAP_EVERY_MS) : 0;
    };
    const keepHidden = () => {
      swapUntil = performance.now() + KEEP_SWAPPING_MS;
      if (!timer) tick();
    };
    const events = ['pointerdown', 'click', 'focusin'] as const;
    for (const type of events) document.addEventListener(type, keepHidden, true);
    window.addEventListener('focus', keepHidden);

    return () => {
      for (const type of events) document.removeEventListener(type, keepHidden, true);
      window.removeEventListener('focus', keepHidden);
      window.clearTimeout(timer);
      delete root.dataset.smoothCursor;
    };
  }, [enabled]);

  return enabled ? <SmoothCursor /> : null;
}
