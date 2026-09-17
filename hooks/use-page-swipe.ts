'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Swiping between the sections along the bottom of a phone.
 *
 * The bar is the order: a drag to the left is the next tab, a drag to the right
 * the one before, and the ends do not wrap — a pull past either end stretches
 * against the hand and lets go, the way a phone says "that is the end".
 *
 * What moves are three live sections, mounted and parked a screen apart by
 * SectionPager: this reads where they are, writes where they should be, and
 * touches nothing else. There is no picture of a page anywhere in it — the page
 * arriving is the page, with its own data, rendered long before the finger went
 * down — so there is no moment when one is exchanged for the other.
 *
 * The route follows. When the spring has landed and the section is already
 * where it belongs, the address is changed to match; React finds the same pane
 * by its key and keeps it, and the only thing that happens at that moment is
 * that a different pane is called the current one (see SectionPager, which
 * takes the hand-written transforms off in the same paint).
 *
 * Between touchdown and the settle, no React render happens at all: the gesture
 * keeps its state in this closure and writes transforms from one animation
 * frame, on three elements, in properties the compositor owns.
 *
 * ── Never halfway ──
 *
 * A gesture has exactly three ends — back where it started, one section on, one
 * section back — and each normalises the panes when its spring lands. Every
 * frame carries the token of the gesture that scheduled it, so a frame from a
 * gesture that is over cannot write anything.
 */

/* ------------------------------------------------------------------ feel */
/** The first and last strip of the screen belong to Safari's own back and forward. */
const EDGE = 20;
/** A finger has to travel this far before it is a drag rather than a tap. */
const DEAD = 8;
/** And be going this much more sideways than up for it to be this gesture. */
const SIDEWAYS = 1.2;
/** How much of the screen commits a page change on distance alone. */
const COMMIT = 0.22;
/** Or how fast it is moving when it is let go, in pixels a second. */
const FLICK = 500;
/** A finger still for this long has thrown nothing, however fast it was. */
const STILL = 80;
/** The spring that finishes the journey: firm, and just short of a bounce. */
const STIFFNESS = 380;
const DAMPING = 38;
const MASS = 0.75;
/** Where it is close enough to be there, in pixels and pixels a second. */
const REST = 0.4;
const RESTING = 40;
/** How hard a pull past the end of the row gives — iOS's own curve. */
const BAND = 0.55;
/** The depth the section arriving comes up out of. Barely there on purpose. */
const DEPTH = 0.985;
const FADE = 0.92;
/** A spring is never given a step longer than this, however late the frame is. */
const MAX_STEP = 1 / 120;

/** iOS's resistance: the further it is pulled, the less it gives. */
function band(distance: number, width: number) {
  const pull = Math.abs(distance);
  return (
    Math.sign(distance) * (1 - 1 / (pull / (width * BAND) + 1)) * width * BAND
  );
}

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
  // Where we are is read when a drag starts rather than depended on: an effect
  // that re-ran on every navigation could take the listeners out from under a
  // finger that is still down.
  const where = useRef(current);
  useEffect(() => {
    where.current = current;
  }, [current]);

  useEffect(() => {
    const pager = document.querySelector<HTMLElement>('.section-pager');
    if (!pager || !window.matchMedia('(max-width: 767px)').matches) return;
    const root = document.documentElement;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* ------------------------------------------------------- the three panes */
    type Panes = {
      live: HTMLElement;
      prev: HTMLElement | null;
      next: HTMLElement | null;
      before: string | null;
      after: string | null;
    };
    let held: Panes | null = null;
    /** Read once, when a finger goes down. Nothing below reads the DOM again. */
    const hold = (): Panes | null => {
      const live = pager.querySelector<HTMLElement>('[data-role="current"]');
      if (!live) return null;
      const prev = pager.querySelector<HTMLElement>('[data-role="prev"]');
      const next = pager.querySelector<HTMLElement>('[data-role="next"]');
      return {
        live,
        prev,
        next,
        before: prev?.dataset.section ?? null,
        after: next?.dataset.section ?? null,
      };
    };

    /* ---------------------------------------------------------- the frame */
    let token = 0;
    let frame = 0;
    let x = 0;
    let width = window.innerWidth;
    let running = false;
    let committing = false;

    /**
     * The three of them, from one write. Only transform and opacity, and the
     * same properties every frame, so nothing here can make Safari lay
     * anything out again.
     */
    const paint = () => {
      frame = 0;
      const panes = held;
      if (!panes) return;
      panes.live.style.transform = `translate3d(${x}px, 0, 0)`;
      const going = x < 0 ? panes.next : panes.prev;
      const other = x < 0 ? panes.prev : panes.next;
      const near = Math.min(1, Math.abs(x) / width);
      if (going) {
        const size = DEPTH + (1 - DEPTH) * near;
        going.style.transform = `translate3d(${x + (x < 0 ? width : -width)}px, 0, 0) scale(${size})`;
        going.style.opacity = `${FADE + (1 - FADE) * near}`;
      }
      if (other) {
        other.style.transform = `translate3d(${x < 0 ? -width : width}px, 0, 0)`;
        other.style.opacity = '';
      }
    };
    const draw = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    /** The one rest state, written out rather than left to a render. */
    const normalise = () => {
      token++;
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      x = 0;
      const panes = held;
      if (panes) {
        for (const pane of [panes.live, panes.prev, panes.next]) {
          if (!pane) continue;
          // Emptied rather than set: the stylesheet parks each pane by the
          // part it is playing, and the part may have changed since.
          pane.style.transform = '';
          pane.style.opacity = '';
          pane.style.willChange = '';
        }
      }
      held = null;
      delete root.dataset.swiping;
    };

    /* --------------------------------------------------------- the spring */
    /**
     * Damped just short of a bounce, and given the speed the finger let go at,
     * so a flick carries its own momentum into the landing and a slow release
     * is set down gently.
     */
    const settle = (to: number, speed: number, then?: () => void) => {
      const mine = ++token;
      if (calm.matches) {
        x = to;
        paint();
        then?.();
        return;
      }
      running = true;
      let velocity = speed;
      let last = performance.now();
      const tick = (now: number) => {
        if (mine !== token) return;
        let step = Math.min((now - last) / 1000, MAX_STEP * 6);
        last = now;
        // Small fixed steps: a long frame cannot make the spring overshoot.
        while (step > 0) {
          const slice = Math.min(step, MAX_STEP);
          step -= slice;
          const force = -STIFFNESS * (x - to) - DAMPING * velocity;
          velocity += (force / MASS) * slice;
          x += velocity * slice;
        }
        if (Math.abs(x - to) < REST && Math.abs(velocity) < RESTING) {
          x = to;
          paint();
          running = false;
          then?.();
          return;
        }
        paint();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    /**
     * The address, once the section is already the thing on the screen. The
     * pane it lands in is the pane that was arriving: React is given the same
     * key, keeps the subtree, and changes only which pane is called current.
     */
    const arrive = (path: string) => {
      committing = true;
      router.push(path);
      const gave = performance.now();
      const land = () => {
        if (where.current === path || performance.now() - gave > 900) {
          normalise();
          committing = false;
          return;
        }
        requestAnimationFrame(land);
      };
      requestAnimationFrame(land);
    };

    /* -------------------------------------------------------- the gesture */
    let tracking = false,
      dragging = false,
      startX = 0,
      startY = 0,
      lastX = 0,
      lastAt = 0,
      speed = 0;

    const down = (event: TouchEvent) => {
      if (committing || event.touches.length !== 1) return;
      if (document.querySelector('dialog[open]')) return;
      const touch = event.touches[0];
      // Cached here: nothing in the loop below reads the layout back.
      width = window.innerWidth;
      if (touch.clientX < EDGE || touch.clientX > width - EDGE) return;
      // Read fresh every time: which pane is playing which part changes with
      // the address, and a gesture must not start from a stale answer.
      const taken = hold();
      if (!taken) return;
      if (scrollsSideways(event.target, taken.live)) return;
      held = taken;
      startX = lastX = touch.clientX;
      startY = touch.clientY;
      lastAt = performance.now();
      speed = 0;
      tracking = true;
      dragging = false;
      // A settle still running is taken over from where it has got to, rather
      // than fought with or waited for.
      if (running) {
        token++;
        running = false;
        dragging = true;
        startX = touch.clientX - x;
        root.dataset.swiping = 'true';
      }
    };

    const move = (event: TouchEvent) => {
      if (!tracking || !held || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - startX;
      if (!dragging) {
        const dy = touch.clientY - startY;
        if (Math.abs(dx) < DEAD && Math.abs(dy) < DEAD) return;
        // One decision, once: sideways enough and it stays this gesture;
        // otherwise the page scrolls and this stays out of the way until the
        // finger comes up.
        if (Math.abs(dx) <= Math.abs(dy) * SIDEWAYS) {
          tracking = false;
          held = null;
          return;
        }
        dragging = true;
        startX = touch.clientX - Math.sign(dx) * DEAD;
        root.dataset.swiping = 'true';
        for (const pane of [held.live, held.prev, held.next]) {
          if (pane) pane.style.willChange = 'transform';
        }
      }
      const travel = touch.clientX - startX;
      // Past either end of the row there is nothing to bring on, so the pull
      // stretches instead.
      const free = travel < 0 ? held.after !== null : held.before !== null;
      x = free ? travel : band(travel, width);
      const at = performance.now();
      const gap = at - lastAt;
      if (gap > 0) {
        // Smoothed, so one stray sample cannot decide a flick.
        const now = ((touch.clientX - lastX) / gap) * 1000;
        speed = speed === 0 ? now : speed * 0.7 + now * 0.3;
        lastX = touch.clientX;
        lastAt = at;
      }
      draw();
    };

    /**
     * Three ends and no fourth: on to the next, back to the one before, or
     * back where it started.
     *
     * Which one is decided by the side of the screen the drag has opened — a
     * drag to the left has the next section showing, and nothing else can be
     * arrived at from there — and then by how far it went or how fast it was
     * going. A finger that turns round and is moving the other way at the
     * moment it lets go has changed its mind, and that beats the distance.
     */
    const up = () => {
      if (!tracking) return;
      tracking = false;
      if (!dragging || !held) {
        held = null;
        return;
      }
      dragging = false;
      if (performance.now() - lastAt > STILL) speed = 0;
      const showing = x < 0 ? held.after : x > 0 ? held.before : null;
      const toward = x < 0 ? -1 : 1;
      const far = Math.abs(x) > width * COMMIT;
      const thrown = Math.sign(speed) === toward && Math.abs(speed) > FLICK;
      const turned = Math.sign(speed) === -toward && Math.abs(speed) > FLICK;
      if (showing && (far || thrown) && !turned) {
        settle(toward * width, speed, () => arrive(showing));
        return;
      }
      settle(0, speed, normalise);
    };

    // A drag the system takes away — a call arriving, a gesture of its own —
    // is a drag that ends where it started.
    const off = () => {
      if (!tracking && !dragging) return;
      tracking = dragging = false;
      if (held) settle(0, speed, normalise);
    };

    const resize = () => {
      width = window.innerWidth;
      if (!running && !dragging && !committing) normalise();
    };

    pager.addEventListener('touchstart', down, { passive: true });
    pager.addEventListener('touchmove', move, { passive: true });
    pager.addEventListener('touchend', up, { passive: true });
    pager.addEventListener('touchcancel', off, { passive: true });
    window.addEventListener('orientationchange', resize);
    window.addEventListener('resize', resize);
    return () => {
      token++;
      if (frame) cancelAnimationFrame(frame);
      pager.removeEventListener('touchstart', down);
      pager.removeEventListener('touchmove', move);
      pager.removeEventListener('touchend', up);
      pager.removeEventListener('touchcancel', off);
      window.removeEventListener('orientationchange', resize);
      window.removeEventListener('resize', resize);
      delete root.dataset.swiping;
    };
  }, [router]);

  // The section either side is fetched while nothing is happening, so the
  // address change at the end of a swipe is a render and not a wait.
  useEffect(() => {
    const here = pages.indexOf(current);
    if (here < 0 || !window.matchMedia('(max-width: 767px)').matches) return;
    const soon = window.setTimeout(() => {
      for (const near of [pages[here - 1], pages[here + 1]]) {
        try {
          if (near) router.prefetch(near);
        } catch {}
      }
    }, 400);
    return () => window.clearTimeout(soon);
  }, [pages, current, router]);
}
