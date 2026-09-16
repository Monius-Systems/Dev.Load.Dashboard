'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Loader2, ScanLine } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { useT } from '@/lib/i18n/use-t';
import {
  deskSnapshot,
  serverDeskSnapshot,
  subscribeDesk,
} from '@/lib/load-desk/desk-session';

const LOAD_DESK = '/load-desk';

/**
 * What Load Desk is doing while another page is open: a reading scan keeps
 * going, so the top bar carries its progress and says when the tickets are
 * ready. On Load Desk itself the page already shows all of this.
 */
export default function DeskActivity() {
  const desk = useSyncExternalStore(subscribeDesk, deskSnapshot, serverDeskSnapshot);
  const pathname = usePathname();
  const { t, plural } = useT();
  const away = pathname !== LOAD_DESK;
  const { extraction, queue } = desk;
  const waiting = queue.filter((item) => item.saved_record_id === null).length;
  // The scan that was running the last time this was rendered.
  const wasExtracting = useRef(false);

  useEffect(() => {
    const finished = wasExtracting.current && extraction === null;
    wasExtracting.current = extraction !== null;
    if (!finished || !waiting) return;
    // Told once, when the reading ends, and only while another page is open.
    if (pathname === LOAD_DESK) return;
    toast.add({
      title: t('Tickets are ready for review'),
      description: t('{tickets} waiting in Load Desk.', {
        tickets: plural(waiting, 'ticket'),
      }),
      type: 'success',
    });
  }, [extraction, waiting, pathname, t, plural]);

  if (!away || (!extraction && !waiting)) return null;

  return (
    <Link href={LOAD_DESK} className="desk-activity" data-busy={extraction !== null}>
      {extraction ? (
        <>
          <Loader2 className="desk-activity-spin" aria-hidden="true" />
          <span>
            {t('Extracting tickets')} · {extraction.percent}%
          </span>
        </>
      ) : (
        <>
          <ScanLine aria-hidden="true" />
          <span>{t('{tickets} ready for review.', { tickets: plural(waiting, 'ticket') })}</span>
        </>
      )}
    </Link>
  );
}
