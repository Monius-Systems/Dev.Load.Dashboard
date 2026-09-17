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
  // The neighbours are a phone's: on a wider screen there is no swipe to make
  // them worth their memory. False for the server's render and the first one
  // here, so what is hydrated is what was sent.
  const [near, setNear] = useState(false);
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 767px)');
    const read = () => setNear(phone.matches);
    read();
    phone.addEventListener('change', read);
    return () => phone.removeEventListener('change', read);
  }, []);

  const here = ORDER.indexOf(pathname);
  const known = here >= 0;
  const window_ =
    known && near
      ? [ORDER[here - 1], pathname, ORDER[here + 1]].filter(Boolean)
      : [pathname];

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
    // And a section opened by a tap rather than carried in by a finger is
    // given the entrance one gets; a finger has been moving it all along.
    if (document.documentElement.dataset.swiping) return;
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
        const role = current ? 'current' : ORDER.indexOf(path) < here ? 'prev' : 'next';
        return (
          <div
            key={path}
            className="section-pane"
            data-section={path}
            data-role={role}
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
