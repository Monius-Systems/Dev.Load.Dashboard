'use client';

import { useEffect, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import {
  getPanelSnapshot,
  getServerPanelSnapshot,
  setPage,
  subscribePanel,
} from '@/lib/operator/panel-store';

// What the shell mounts, and the only thing it knows about the Operator.
//
// The shell imports this module lazily and without server rendering, so none
// of the panel's code is evaluated on a request for a page and none of it runs
// until the browser is idle. The panel itself is a second split behind that:
// until somebody presses the trigger there is nothing on the screen to render
// and nothing fetched, so the cost of having the Operator on every page is the
// cost of the button in the bar.
//
// The page the Operator is told about follows the router from here, because
// the panel may be open while the person moves around behind it.

const OperatorPanel = dynamic(() => import('@/components/operator/operator-panel'), {
  ssr: false,
});

export { default as OperatorTrigger } from '@/components/operator/operator-trigger';

export default function OperatorMount() {
  const panel = useSyncExternalStore(subscribePanel, getPanelSnapshot, getServerPanelSnapshot);
  const pathname = usePathname();

  // The context the server is sent is the page in the address bar now, not the
  // one the panel was opened from.
  useEffect(() => {
    setPage(pathname);
  }, [pathname]);

  // Nothing at all until the panel has been opened once; from then on it stays
  // mounted, so closing it is a drawer sliding shut rather than a disappearance
  // and the conversation is where it was left on the way back.
  if (!panel.open && panel.context === null) return null;
  return <OperatorPanel />;
}
