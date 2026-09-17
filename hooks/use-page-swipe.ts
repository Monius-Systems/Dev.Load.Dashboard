'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Swiping between the sections along the bottom of a phone.
 *
 * The bar is the order: a drag to the left is the next tab, a drag to the right
 * the one before, and the ends of the row do not wrap — a drag with nowhere to
 * go pulls a short way and springs back, which is how a phone says "that is the
 * end" without a message.
 *
 * The page being dragged to is the real one, moving with the finger, edge to
 * edge with the page being dragged away from. That is what a phone does and
 * there is only one way to get it: the section is opened as soon as the drag
 * means it, early, while the finger is still down. The page that is leaving is
 * kept on the screen as a copy of itself — React has taken the real one down by
 * then — and the copy is what the finger appears to be pushing.
 *
 * Letting go carries both the rest of the way. Dragging back instead takes them
 * back, and the section that was opened early is closed again with the copy
 * standing over it, so nothing of that shows.
 */

/** The left and right edges belong to the browser's own back and forward. */
const EDGE = 24;
/** How far a finger travels before a drag is a drag and not a tap. */
const START = 12;
/** How far before the section being dragged to is opened behind the finger. */
const PEEK = 0.1;
/** How much of the screen turns a drag into a page change. */
const COMMIT = 0.28;
/** Or how fast it is going when it is let go, in screens per second. */
const FLICK = 0.8;
/** How long the rest of the journey takes once the finger is off. */
const REST = 280;
const EASE = 'cubic-bezier(0.22, 0.61, 0.24, 1)';

/** A drag that started on something with its own sideways scroll is that thing's. */
function scrollsSideways(from: EventTarget | null, until: HTMLElement) {
  let node = from instanceof Element ? from : null;
  while (node && node !== until) {
    if (node.scrollWidth - node.clientWidth > 2) {
      const overflow = getComputedStyle(node).overflowX;
      if (overflow === 'auto' || overflow === 'scroll') return true;
    }
    node = node.parentElement;
  }
  return false;
}

export function usePageSwipe(pages: string[], current: string) {
  const router = useRouter();
  // Read when a drag starts rather than depended on: re-running the gesture
  // while a finger is down — which opening a section does — would take the
  // listeners and the drag with it.
  const where = useRef(current);
  useEffect(() => {
    where.current = current;
  }, [current]);

  // Both neighbours are fetched as soon as a section settles, so opening one
  // mid-drag is a render and not a wait. This is what the old version felt
  // like a page reload for: nothing was ready until the finger came off.
  useEffect(() => {
    const here = pages.indexOf(current);
    if (here < 0 || !window.matchMedia('(max-width: 767px)').matches) return;
    const ready = () => {
      for (const near of [pages[here - 1], pages[here + 1]]) {
        // Nothing here needs it to have worked.
        try {
          if (near) router.prefetch(near);
        } catch {}
      }
    };
    // After the section itself has settled, not instead of it.
    const soon = window.setTimeout(ready, 500);
    return () => window.clearTimeout(soon);
  }, [pages, current, router]);

  useEffect(() => {
    const page = document.getElementById('workspace-content');
    if (!page || !window.matchMedia('(max-width: 767px)').matches) return;
    const root = document.documentElement;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    let startX = 0,
      startY = 0,
      startAt = 0,
      tracking = false,
      dragging = false,
      /** Where the section being dragged to came in from: +width or -width. */
      from = 0,
      going: string | null = null,
      lastDx = 0,
      ghost: HTMLElement | null = null;

    const width = () => window.innerWidth;
    /** Where a drag this way leads, if anywhere. */
    const destination = (dx: number) => {
      const here = pages.indexOf(where.current);
      if (here < 0) return null;
      return pages[here + (dx < 0 ? 1 : -1)] ?? null;
    };
    /** The two pages, side by side, with the finger at dx. */
    const place = (dx: number) => {
      page.style.transform = `translate3d(${going ? dx + from : dx}px, 0, 0)`;
      if (ghost) ghost.style.transform = `translate3d(${dx}px, 0, 0)`;
    };
    const settle = () => {
      tracking = dragging = false;
      going = null;
      from = 0;
      page.style.transform = '';
      page.style.willChange = '';
      delete root.dataset.swiping;
      ghost?.remove();
      ghost = null;
    };

    /**
     * Opens the section being dragged to, now, behind the finger: a copy of the
     * page being left takes its place on the screen and the real new one lines
     * up beside it.
     */
    const open = (next: string, dx: number) => {
      const copy = page.cloneNode(true) as HTMLElement;
      copy.removeAttribute('id');
      copy.setAttribute('aria-hidden', 'true');
      copy.style.cssText = `position:fixed;left:0;right:0;top:${-window.scrollY}px;z-index:4;pointer-events:none;background:var(--ui-accent);transform:translate3d(${dx}px,0,0)`;
      document.body.appendChild(copy);
      ghost = copy;
      going = next;
      from = dx < 0 ? width() : -width();
      // The arriving page is being carried by the finger, so it must not also
      // play the entrance a page normally gets.
      root.dataset.swiping = 'true';
      page.style.willChange = 'transform';
      place(dx);
      router.push(next);
    };

    /** The rest of the journey, both pages together, after the finger is off. */
    const finish = (dx: number, keep: boolean) => {
      const options = { duration: REST, easing: EASE, fill: 'both' as const };
      const live = page.animate(
        [
          { transform: `translate3d(${dx + from}px, 0, 0)` },
          { transform: `translate3d(${keep ? 0 : from}px, 0, 0)` },
        ],
        options,
      );
      const shadow = ghost?.animate(
        [
          { transform: `translate3d(${dx}px, 0, 0)` },
          { transform: `translate3d(${keep ? -from : 0}px, 0, 0)` },
        ],
        options,
      );
      let ended = false;
      const done = () => {
        if (ended) return;
        ended = true;
        // Both are held at the end of their journey by fill; letting them go
        // and clearing the transform in the same breath leaves no frame in
        // between for either to be drawn anywhere else.
        live.cancel();
        shadow?.cancel();
        if (keep) {
          settle();
          return;
        }
        // Back where it started: the copy is over the screen at rest, so
        // closing the section again happens behind it.
        router.back();
        const copy = ghost;
        ghost = null;
        window.setTimeout(() => {
          copy?.remove();
          settle();
        }, 320);
      };
      live.addEventListener('finish', done);
    };

    const start = (event: TouchEvent) => {
      if (event.touches.length !== 1 || ghost || going) return;
      if (document.querySelector('dialog[open]')) return;
      const touch = event.touches[0];
      if (touch.clientX < EDGE || touch.clientX > width() - EDGE) return;
      if (scrollsSideways(event.target, page)) return;
      startX = touch.clientX;
      startY = touch.clientY;
      startAt = event.timeStamp;
      tracking = true;
      dragging = false;
    };

    const move = (event: TouchEvent) => {
      if (!tracking || event.touches.length !== 1) return;
      const dx = event.touches[0].clientX - startX;
      const dy = event.touches[0].clientY - startY;
      if (!dragging) {
        if (Math.abs(dx) < START && Math.abs(dy) < START) return;
        // Up and down is the page's own; this only takes the sideways ones.
        if (Math.abs(dy) >= Math.abs(dx)) {
          tracking = false;
          return;
        }
        dragging = true;
        page.style.willChange = 'transform';
      }
      lastDx = dx;
      const next = destination(dx);
      // A drag towards a section that is not there pulls against the hand.
      if (!going && !next) {
        page.style.transform = `translate3d(${dx * 0.22}px, 0, 0)`;
        return;
      }
      if (!going && next && Math.abs(dx) > width() * PEEK && !calm.matches) {
        open(next, dx);
        return;
      }
      place(dx);
    };

    const end = (event: TouchEvent) => {
      if (!dragging) {
        tracking = false;
        return;
      }
      const dx = (event.changedTouches[0]?.clientX ?? startX) - startX;
      const seconds = Math.max(1, event.timeStamp - startAt) / 1000;
      const speed = Math.abs(dx) / width() / seconds;
      const far = Math.abs(dx) > width() * COMMIT || speed > FLICK;
      if (going) {
        // Committed only if the finger is still going the way it opened.
        finish(dx, far && Math.sign(dx) === -Math.sign(from));
        tracking = dragging = false;
        return;
      }
      const next = destination(dx);
      if (!next || !far) {
        if (!calm.matches) {
          page.animate(
            [{ transform: page.style.transform || 'none' }, { transform: 'none' }],
            { duration: 190, easing: EASE },
          );
        }
        settle();
        return;
      }
      // Gone before it was ever opened — a flick, over and done inside the
      // tenth of a screen. Open it now and carry it the rest of the way.
      if (calm.matches) {
        settle();
        router.push(next);
        return;
      }
      open(next, dx);
      finish(dx, true);
      tracking = dragging = false;
    };

    // A drag the system takes away — a call arriving, a gesture of its own —
    // leaves the two pages where they are unless they are sent home.
    const cancel = () => {
      if (going) {
        finish(lastDx, false);
        tracking = dragging = false;
        return;
      }
      settle();
    };

    page.addEventListener('touchstart', start, { passive: true });
    page.addEventListener('touchmove', move, { passive: true });
    page.addEventListener('touchend', end, { passive: true });
    page.addEventListener('touchcancel', cancel, { passive: true });
    return () => {
      page.removeEventListener('touchstart', start);
      page.removeEventListener('touchmove', move);
      page.removeEventListener('touchend', end);
      page.removeEventListener('touchcancel', cancel);
      settle();
    };
  }, [pages, router]);
}
