'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import HomePage from '@/components/home/home-page';
import LoadDesk from '@/components/load-desk/load-desk';
import RecordsPage from '@/components/records/records-page';
import CustomersPage from '@/components/profiles/customers-page';
import FleetPage from '@/components/profiles/fleet-page';
import { shellConfig } from '@/lib/shell-config';

/**
 * The page area, as a window of three live sections rather than one.
 *
 * On a phone the section either side of the one you are looking at is really
 * mounted — the same components the router would mount, reading the same
 * stores, rendered at the same moment — and parked a screen away. Swiping moves
 * the two of them together (hooks/use-page-swipe.ts), so what arrives is the
 * section itself and not a picture of it: nothing is loaded on the way in,
 * nothing is stale, and there is no hand-off from a stand-in to a real page.
 *
 * ── Why the sections are rendered here and not by the route ──
 *
 * A route renders one page and replaces it when the route changes, which is
 * precisely the thing that cannot happen to a page the finger has just carried
 * into place. So the panes are keyed by section rather than by route: when the
 * route follows the swipe, React finds the same key and keeps the subtree — the
 * pane that arrived at the middle of the screen is the pane that stays, down to
 * the DOM node. All the route does afterwards is change which pane is called
 * the current one, and where the other two are parked.
 *
 * The router still owns the address, the title and the metadata; `children` is
 * what it rendered, and is used for anything that is not one of the sections in
 * the bar — the account page, or anything added later.
 */

/** The sections, by the address the bar gives them. */
const SECTIONS: Record<string, () => ReactNode> = {
  '/': () => <HomePage />,
  '/load-desk': () => <LoadDesk />,
  '/records': () => <RecordsPage />,
  '/customers': () => <CustomersPage />,
  '/fleet': () => <FleetPage />,
};

/** In the bar's order, which is the order a swipe moves through them. */
const ORDER = shellConfig.navigation
  .map(({ href }) => href)
  .filter((href) => href in SECTIONS);

export default function SectionPager({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pager = useRef<HTMLDivElement>(null);
  /** The sections that have been on the screen already, this session. */
  const seen = useRef(new Set<string>());
  /**
   * How much of the row is alive, and when.
   *
   * 0 — the section asked for, and nothing else. What the server sends and
   *     what is hydrated, so the first paint costs exactly what it used to.
   * 1 — the two either side, a moment later: what a swipe moves.
   * 2 — the rest of the bar, once the page is quiet: what the bar itself jumps
   *     to. A tap on a section that was never mounted has to build it while
   *     you watch, and that is the flick the bar had; built in advance and
   *     parked, a tap is a page that is already there.
   *
   * A wider screen stops at 0: there is no swipe and no bar to jump from.
   */
  const [reach, setReach] = useState(0);
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 767px)');
    let slower = 0;
    const read = () => {
      window.clearTimeout(slower);
      if (!phone.matches) {
        setReach(0);
        return;
      }
      setReach(1);
      slower = window.setTimeout(() => setReach(2), 1200);
    };
    read();
    phone.addEventListener('change', read);
    return () => {
      window.clearTimeout(slower);
      phone.removeEventListener('change', read);
    };
  }, []);

  const here = ORDER.indexOf(pathname);
  const known = here >= 0;
  const window_ = !known
    ? [pathname]
    : // Stage two is the whole bar, not two either side: the bar can jump from
      // one end of the row to the other, and everything it can reach has to be
      // standing there when it does.
      ORDER.filter((path, index) => reach > 1 || Math.abs(index - here) <= reach);

  /**
   * The moment the route catches up with the swipe: the panes change which one
   * they are, and the transforms the gesture wrote by hand come off in the same
   * breath — before the browser paints, so there is no frame where a pane is in
   * its new role and still carrying its old position.
   */
  useLayoutEffect(() => {
    const box = pager.current;
    if (!box) return;
    for (const pane of Array.from(box.children) as HTMLElement[]) {
      pane.style.transform = '';
      pane.style.opacity = '';
    }
    // The page area is one column and its scroll is the document's, so the
    // section arriving starts where a page starts. (The shell scrolls to the
    // top as well; this is the one that happens before anything is drawn.)
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    window.scrollTo(0, 0);
    // And a section being shown for the first time is given the entrance one
    // gets. A section that was already mounted — every one of them, once the
    // row is alive — is simply shown: it has nothing to arrive from, and
    // fading in a page that is already there is the flick, not the polish.
    // A finger gets no entrance either; it has been moving it all along.
    const fresh = !seen.current.has(pathname);
    seen.current.add(pathname);
    if (!fresh || document.documentElement.dataset.swiping) return;
    const live = box.querySelector<HTMLElement>('[data-role="current"]');
    if (!live) return;
    live.dataset.appear = 'true';
    const done = () => {
      delete live.dataset.appear;
      live.removeEventListener('animationend', done);
    };
    live.addEventListener('animationend', done);
  }, [pathname]);

  return (
    <div className="section-pager" ref={pager}>
      {window_.map((path) => {
        const current = path === pathname;
        const index = ORDER.indexOf(path);
        // Only the two next to this one are what a swipe moves; the rest of
        // the row waits off the side of the screen, laid out and unlit.
        const role = current
          ? 'current'
          : index === here - 1
            ? 'prev'
            : index === here + 1
              ? 'next'
              : 'far';
        return (
          <div
            key={path}
            className="section-pane"
            data-section={path}
            data-role={role}
            data-side={role === 'far' ? (index < here ? 'before' : 'after') : undefined}
            aria-hidden={current ? undefined : true}
            // A section nobody is looking at is not in the way of anything:
            // not the pointer, not the keyboard, not a screen reader.
            inert={!current}
          >
            <div
              className="page-content"
              id={current ? 'workspace-content' : undefined}
              tabIndex={current ? -1 : undefined}
            >
              <div className="page-enter">
                {known ? SECTIONS[path]!() : children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
