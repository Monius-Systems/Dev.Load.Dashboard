'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Swiping between the sections along the bottom of a phone.
 *
 * The bar is the order: a drag to the left is the next tab, a drag to the right
 * the one before, and the ends of the row do not wrap — a drag with nowhere to
 * go pulls a short way and springs back, which is how a phone says "that is the
 * end" without a message.
 *
 * The page that is leaving is animated as a copy of itself, over the top of the
 * one arriving: React has taken the real one down by then, and a copy is the one
 * way to have both on the screen at once. It is pinned under the account and
 * under the arriving page's sheet, so the sheet slides in over it and the shell
 * around them both stays put.
 */

/** The left and right edges belong to the browser's own back and forward. */
const EDGE = 24;
/** How far a finger travels before a drag is a drag and not a tap. */
const START = 12;
/** How much of the screen turns a drag into a page change. */
const COMMIT = 0.28;
/** Or how fast it is going when it is let go, in screens per second. */
const FLICK = 0.8;
const OUT = 260;
const BACK = 190;
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';

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
  useEffect(() => {
    const page = document.getElementById('workspace-content');
    const here = pages.indexOf(current);
    if (!page || here < 0 || !window.matchMedia('(max-width: 767px)').matches) {
      return;
    }
    const root = document.documentElement;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Each swipe is numbered, so a second one starting while the first is still
    // sliding is the one that decides which way the arriving page comes in.
    let swipes = 0;
    let startX = 0,
      startY = 0,
      startAt = 0,
      tracking = false,
      dragging = false;
    /** Where a drag this way leads, if anywhere. */
    const destination = (dx: number) => pages[here + (dx < 0 ? 1 : -1)] ?? null;

    const clear = () => {
      tracking = dragging = false;
      page.style.transform = '';
      page.style.willChange = '';
    };

    const start = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      // Not while the camera or a dialog is up, and not over something that
      // scrolls sideways of its own accord.
      if (document.querySelector('dialog[open]')) return;
      const touch = event.touches[0];
      if (touch.clientX < EDGE || touch.clientX > window.innerWidth - EDGE) return;
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
      // A drag towards a section that is not there pulls against the hand.
      const travel = destination(dx) ? dx : dx * 0.22;
      page.style.transform = `translate3d(${travel}px, 0, 0)`;
    };

    const end = (event: TouchEvent) => {
      if (!dragging) {
        tracking = false;
        return;
      }
      const dx = (event.changedTouches[0]?.clientX ?? startX) - startX;
      const next = destination(dx);
      const seconds = Math.max(1, event.timeStamp - startAt) / 1000;
      const speed = Math.abs(dx) / window.innerWidth / seconds;
      const far = Math.abs(dx) > window.innerWidth * COMMIT || speed > FLICK;
      if (!next || !far) {
        // Back where it was, from wherever the finger left it.
        if (!calm.matches) {
          page.animate(
            [{ transform: `translate3d(${dx}px, 0, 0)` }, { transform: 'none' }],
            { duration: BACK, easing: EASE },
          );
        }
        clear();
        return;
      }
      // Somebody who has asked for less movement gets the page, not the
      // journey. The stylesheet turns the arriving half off the same way.
      if (calm.matches) {
        clear();
        router.push(next);
        return;
      }
      // The page as it is now, kept on the screen while the next one arrives
      // over it. Fixed and offset by the scroll, so the copy stands exactly
      // where the original was standing.
      const ghost = page.cloneNode(true) as HTMLElement;
      ghost.removeAttribute('id');
      ghost.setAttribute('aria-hidden', 'true');
      ghost.style.cssText = `position:fixed;left:0;right:0;top:${-window.scrollY}px;z-index:4;pointer-events:none;background:var(--ui-accent);transform:translate3d(${dx}px,0,0)`;
      document.body.appendChild(ghost);
      clear();
      // Which way the arriving page comes in from; the stylesheet has the rest.
      const mine = ++swipes;
      root.dataset.swipe = dx < 0 ? 'next' : 'prev';
      router.push(next);
      const leaving = ghost.animate(
        [
          { transform: `translate3d(${dx}px, 0, 0)`, opacity: 1 },
          { transform: `translate3d(${dx < 0 ? '-100%' : '100%'}, 0, 0)`, opacity: 0.55 },
        ],
        { duration: OUT, easing: EASE },
      );
      const done = () => {
        ghost.remove();
        if (swipes === mine) delete root.dataset.swipe;
      };
      leaving.addEventListener('finish', done);
      leaving.addEventListener('cancel', done);
    };

    page.addEventListener('touchstart', start, { passive: true });
    page.addEventListener('touchmove', move, { passive: true });
    page.addEventListener('touchend', end, { passive: true });
    page.addEventListener('touchcancel', clear, { passive: true });
    return () => {
      page.removeEventListener('touchstart', start);
      page.removeEventListener('touchmove', move);
      page.removeEventListener('touchend', end);
      page.removeEventListener('touchcancel', clear);
      clear();
    };
  }, [pages, current, router]);
}
