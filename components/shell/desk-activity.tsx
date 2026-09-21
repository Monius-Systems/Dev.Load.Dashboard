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

/**
 * Where the scanning happens. It is one page — the camera, the upload and the
 * review are all on it — so there is no nest of scan routes to allow for, and
 * anything that is not this page is somewhere the scan is out of sight.
 */
const LOAD_DESK = '/load-desk';

/**
 * What Load Desk is doing while another page is open: a reading scan keeps
 * going, so the top bar carries its progress and says when the tickets are
 * ready.
 *
 * Only while another page is open. On Load Desk itself the page shows its own
 * progress against the upload it belongs to, and a second copy of it in the bar
 * would be the same scan reported twice.
 */
export default function DeskActivity() {
  const desk = useSyncExternalStore(subscribeDesk, deskSnapshot, serverDeskSnapshot);
  const pathname = usePathname();
  const { t, plural } = useT();
  const onScanPage = pathname === LOAD_DESK;
  const { extraction, queue, needsInput } = desk;
  const waiting = queue.filter((item) => item.saved_record_id === null).length;
  const asked = needsInput.groups + needsInput.tickets;
  // The scan that was running the last time this was rendered.
  const wasExtracting = useRef(false);

  useEffect(() => {
    const finished = wasExtracting.current && extraction === null;
    wasExtracting.current = extraction !== null;
    if (!finished) return;
    // Told once, when the reading ends, and only while another page is open.
    if (onScanPage) return;
    if (asked) {
      toast.add({
        title: t('Tickets processed'),
        description: needsInput.groups
          ? t('{groups} need your input in Load Desk.', { groups: plural(needsInput.groups, 'group') })
          : t('{tickets} need your input in Load Desk.', { tickets: plural(needsInput.tickets, 'ticket') }),
        type: 'success',
      });
      return;
    }
    if (!waiting) return;
    toast.add({
      title: t('Tickets are ready for review'),
      description: t('{tickets} waiting in Load Desk.', {
        tickets: plural(waiting, 'ticket'),
      }),
      type: 'success',
    });
  }, [extraction, waiting, asked, needsInput, onScanPage, t, plural]);

  // A scan being read, and this not being the page it is on. Nothing in the bar
  // otherwise: no scan running and nothing waiting is an ordinary header, and
  // the scan page is where the scan already reports itself.
  const showExtracting = extraction !== null && !onScanPage;
  const showAsked = !extraction && asked > 0 && !onScanPage;
  const showWaiting = !extraction && !asked && waiting > 0 && !onScanPage;
  if (!showExtracting && !showAsked && !showWaiting) return null;

  return (
    <Link href={LOAD_DESK} className="desk-activity" data-busy={showExtracting}>
      {extraction ? (
        <>
          <Loader2 className="desk-activity-spin" aria-hidden="true" />
          <span>
            {/* The figure when there is one. A reading that has not reported a
                percentage yet still says it is reading. */}
            {Number.isFinite(extraction.percent)
              ? `${t('Extracting tickets')} · ${extraction.percent}%`
              : t('Extracting tickets…')}
          </span>
        </>
      ) : showAsked ? (
        <>
          <ScanLine aria-hidden="true" />
          <span>
            {needsInput.groups
              ? t('{groups} need input', { groups: plural(needsInput.groups, 'group') })
              : t('{tickets} need input', { tickets: plural(needsInput.tickets, 'ticket') })}
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
