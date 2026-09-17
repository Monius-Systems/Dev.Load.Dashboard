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
 * ── How three pages exist when the router only renders one ──
 *
 * A section is a route, and a route renders one page. Dragging between two
 * pages means both of them are on the screen at once, so the neighbours are
 * kept as copies: the page is photographed — cloneNode — while it is on screen
 * and idle, and the copy is parked off the side of the screen in a pane of its
 * own, ready, before any finger goes down. Dragging moves the live page and the
 * two panes together; the route is not touched until the gesture is over and
 * the destination's pane is already covering the screen, so the change of route
 * happens behind a picture of itself and is never seen.
 *
 * Everything the finger touches is a transform on three elements, written from
 * one animation frame. No React render takes place between touchdown and the
 * settle: the gesture holds its state in this closure and writes to the DOM.
 *
 * ── Never halfway ──
 *
 * A gesture has exactly three ends — back where it started, one section on, one
 * section back — and each of them normalises the DOM explicitly when its spring
 * lands. Every frame carries the token of the gesture that scheduled it, so a
 * frame from a gesture that has ended cannot write anything.
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
/** The spring that finishes the journey: firm, and just short of a bounce. */
const STIFFNESS = 380;
const DAMPING = 38;
const MASS = 0.75;
/** Where it is close enough to be there, in pixels and pixels a second. */
const REST = 0.4;
const RESTING = 40;
/** How hard a pull past the end of the row gives — iOS's own curve. */
const BAND = 0.55;
/** The depth the page arriving comes up out of. Barely there on purpose. */
const DEPTH = 0.985;
const FADE = 0.92;
/** A spring is never given a step longer than this, however late the frame is. */
const MAX_STEP = 1 / 60;

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
  // Where we are is read when a drag starts rather than depended on. The
  // gesture is set up once and kept: the copies of the neighbouring sections
  // are gathered over a session, and an effect that re-ran on every navigation
  // would throw them away every time — and could take the listeners out from
  // under a finger that is still down.
  const where = useRef(current);
  const engine = useRef<{ look: () => void; photograph: () => void } | null>(null);

  useEffect(() => {
    const page = document.getElementById('workspace-content');
    if (!page || !window.matchMedia('(max-width: 767px)').matches) return;
    const root = document.documentElement;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* ------------------------------------------------- the two neighbours */
    /** A copy of each section as it last stood, taken while it was idle. */
    const shots = new Map<string, HTMLElement>();
    const pane = (side: 'prev' | 'next') => {
      const box = document.createElement('div');
      box.className = 'page-swipe-pane';
      box.dataset.side = side;
      box.setAttribute('aria-hidden', 'true');
      box.style.transform = `translate3d(${side === 'prev' ? '-100%' : '100%'}, 0, 0)`;
      document.body.appendChild(box);
      return box;
    };
    const panes = { prev: pane('prev'), next: pane('next') };

    /** Where the row stands from here: what is either side, and their panes. */
    let before: string | null = null;
    let after: string | null = null;
    const look = () => {
      // Not while the destination's own picture is the thing on the screen:
      // moving it out of its pane now would take the screen with it.
      if (committing) return;
      const here = pages.indexOf(where.current);
      before = here > 0 ? pages[here - 1] : null;
      after = here >= 0 ? (pages[here + 1] ?? null) : null;
      // The copy itself is moved into the pane, not copied again: a section is
      // only ever on one side of where you are standing.
      const fill = (box: HTMLElement, path: string | null) => {
        const shot = path ? shots.get(path) : null;
        if (shot) {
          if (shot.parentElement !== box) box.replaceChildren(shot);
        } else {
          box.replaceChildren();
        }
      };
      fill(panes.prev, before);
      fill(panes.next, after);
    };

    /** Photograph this section, once it has settled, for the next time over. */
    let shooting = 0;
    let dead = false;
    const photograph = () => {
      window.clearTimeout(shooting);
      shooting = window.setTimeout(() => {
        if (dead || committing) return;
        const path = where.current;
        const shot = page.cloneNode(true) as HTMLElement;
        shot.removeAttribute('id');
        shots.set(path, shot);
        // Only the row's worth is kept; the oldest goes when there are more.
        if (shots.size > pages.length) {
          const oldest = shots.keys().next().value;
          if (oldest && oldest !== path) shots.delete(oldest);
        }
        look();
      }, 450);
    };

    /* ---------------------------------------------------------- the frame */
    let token = 0;
    let frame = 0;
    let x = 0;
    let width = window.innerWidth;
    let running = false;
    let committing = false;

    /**
     * The three of them, from one write. Only transform and opacity, and every
     * frame writes the same three properties, so nothing here can make Safari
     * lay anything out again.
     */
    const paint = () => {
      frame = 0;
      page.style.transform = `translate3d(${x}px, 0, 0)`;
      const going = x < 0 ? panes.next : panes.prev;
      const other = x < 0 ? panes.prev : panes.next;
      const near = Math.min(1, Math.abs(x) / width);
      const size = DEPTH + (1 - DEPTH) * near;
      going.style.transform = `translate3d(${x + (x < 0 ? width : -width)}px, 0, 0) scale(${size})`;
      going.style.opacity = `${FADE + (1 - FADE) * near}`;
      other.style.transform = `translate3d(${x < 0 ? -width : width}px, 0, 0)`;
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
      page.style.transform = '';
      page.style.willChange = '';
      for (const box of [panes.prev, panes.next]) {
        box.style.transform = `translate3d(${box.dataset.side === 'prev' ? '-100%' : '100%'}, 0, 0)`;
        box.style.opacity = '';
      }
      delete root.dataset.swiping;
    };

    /* --------------------------------------------------------- the spring */
    /**
     * Critically damped enough to have no bounce in it, and given the speed the
     * finger let go at, so a flick carries its own momentum into the landing
     * and a slow release is set down gently.
     */
    const settle = (to: number, speed: number, then?: () => void) => {
      const mine = ++token;
      if (calm.matches) {
        // Dragging is the finger's own movement and stays; the flight after it
        // lets go is animation, and is not played.
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
        let step = Math.min((now - last) / 1000, MAX_STEP * 3);
        last = now;
        // Small fixed steps: a long frame cannot make the spring overshoot.
        while (step > 0) {
          const slice = Math.min(step, MAX_STEP / 2);
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

    /** The route, once the destination is already the thing on the screen. */
    const arrive = (path: string) => {
      committing = true;
      router.push(path);
      const gave = performance.now();
      const land = () => {
        // Held until the section is really the one rendered, so the swap of one
        // page for another happens behind its own picture.
        if (where.current === path || performance.now() - gave > 900) {
          normalise();
          // In this order: both of these stand back while a commit is on the
          // screen, and the commit is over.
          committing = false;
          look();
          photograph();
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
      // Cached once: nothing in the loop below reads the layout back.
      width = window.innerWidth;
      if (touch.clientX < EDGE || touch.clientX > width - EDGE) return;
      if (scrollsSideways(event.target, page)) return;
      look();
      startX = lastX = touch.clientX;
      startY = touch.clientY;
      lastAt = performance.now();
      speed = 0;
      tracking = true;
      dragging = false;
      // A settle still running is taken over from wherever it has got to,
      // rather than fought with or waited for.
      if (running) {
        token++;
        running = false;
        dragging = true;
        startX = touch.clientX - x;
        root.dataset.swiping = 'true';
      }
    };

    const move = (event: TouchEvent) => {
      if (!tracking || event.touches.length !== 1) return;
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
          return;
        }
        dragging = true;
        startX = touch.clientX - Math.sign(dx) * DEAD;
        page.style.willChange = 'transform';
        root.dataset.swiping = 'true';
      }
      const travel = touch.clientX - startX;
      // Past either end of the row there is nothing to bring on, so the pull
      // stretches instead.
      const free = travel < 0 ? after !== null : before !== null;
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
      if (!dragging) return;
      dragging = false;
      // Held still before letting go, however fast it was going before that:
      // a finger that has stopped has thrown nothing.
      if (performance.now() - lastAt > 80) speed = 0;
      const showing = x < 0 ? after : x > 0 ? before : null;
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

    const off = () => {
      if (!tracking && !dragging) return;
      tracking = dragging = false;
      settle(0, speed, normalise);
    };

    const resize = () => {
      width = window.innerWidth;
      if (!running && !dragging) normalise();
    };

    page.addEventListener('touchstart', down, { passive: true });
    page.addEventListener('touchmove', move, { passive: true });
    page.addEventListener('touchend', up, { passive: true });
    page.addEventListener('touchcancel', off, { passive: true });
    window.addEventListener('orientationchange', resize);
    window.addEventListener('resize', resize);

    engine.current = { look, photograph };
    look();
    photograph();

    return () => {
      dead = true;
      engine.current = null;
      window.clearTimeout(shooting);
      token++;
      if (frame) cancelAnimationFrame(frame);
      page.removeEventListener('touchstart', down);
      page.removeEventListener('touchmove', move);
      page.removeEventListener('touchend', up);
      page.removeEventListener('touchcancel', off);
      window.removeEventListener('orientationchange', resize);
      window.removeEventListener('resize', resize);
      panes.prev.remove();
      panes.next.remove();
      page.style.transform = '';
      page.style.willChange = '';
      delete root.dataset.swiping;
    };
  }, [pages, router]);

  // Arriving somewhere: the neighbours either side of it are fetched, their
  // panes are filled from whatever has been photographed before, and this
  // section is photographed in its turn once it has settled. All of it while
  // nothing is happening, so a gesture has nothing left to prepare.
  useEffect(() => {
    where.current = current;
    const here = pages.indexOf(current);
    if (here < 0 || !window.matchMedia('(max-width: 767px)').matches) return;
    for (const near of [pages[here - 1], pages[here + 1]]) {
      try {
        if (near) router.prefetch(near);
      } catch {}
    }
    engine.current?.look();
    engine.current?.photograph();
  }, [pages, current, router]);
}
