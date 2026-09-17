'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import InvoiceSheet, { type InvoiceLine } from '@/components/load-desk/invoice-sheet';
import { useT } from '@/lib/i18n/use-t';
import { lineTotal } from '@/lib/load-desk/format';
import type { InvoiceDraft } from '@/lib/load-desk/types';

/** An invoice and its ticket lines (with their customer profiles), in print order. */
export type InvoiceView = { lines: InvoiceLine[]; invoice: InvoiceDraft };

/** Space kept around the page inside the preview area, in pixels. */
const FIT_INSET = 24;
/** How far in the invoice can be pinched, from the size it is shown at. */
const MAX_ZOOM = 5;

/**
 * The invoice page scaled down to fit the preview area whole, so nothing
 * needs scrolling. The page keeps its real size underneath, so it lays out
 * (and prints) exactly as on paper.
 */
function FittedInvoice({ view }: { view: InvoiceView }) {
  const area = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, width: 0, height: 0 });

  useEffect(() => {
    const areaElement = area.current;
    const pageElement = page.current;
    if (!areaElement || !pageElement) return;
    const measure = () => {
      const width = pageElement.offsetWidth;
      const height = pageElement.offsetHeight;
      if (!width || !height) return;
      const scale = Math.max(
        0.05,
        Math.min(
          1,
          (areaElement.clientWidth - FIT_INSET) / width,
          (areaElement.clientHeight - FIT_INSET) / height,
        ),
      );
      setFit((current) =>
        current.scale === scale && current.width === width && current.height === height
          ? current
          : { scale, width, height },
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(areaElement);
    observer.observe(pageElement);
    return () => observer.disconnect();
  }, []);

  /**
   * Pinching the invoice zooms the invoice, and nothing else.
   *
   * A phone's own pinch zooms the whole page — the dialog, the bar, the lot —
   * which is no way to read a line of a bill. So the preview takes the gesture
   * itself: touch-action tells the browser to keep its hands off anything that
   * starts in here, and what the fingers do is applied to the page's box as a
   * transform. Two fingers scale it about the point between them, one finger
   * moves it once it is bigger than the frame, and letting go of the zoom puts
   * it back where it started.
   *
   * Written straight to the element from an animation frame, like the swipe:
   * a pinch that re-rendered React on every touchmove would stutter.
   */
  useEffect(() => {
    const frame_ = area.current;
    const sheet = box.current;
    if (!frame_ || !sheet) return;
    let scale = 1,
      x = 0,
      y = 0,
      frame = 0;
    // Cached when a gesture starts; nothing below reads the layout back.
    let width = 0,
      height = 0,
      centreX = 0,
      centreY = 0;
    let fromScale = 1,
      fromSpan = 0,
      anchorX = 0,
      anchorY = 0,
      pinching = false,
      panning = false,
      panX = 0,
      panY = 0;

    const write = () => {
      frame = 0;
      sheet.style.transform =
        scale === 1 && !x && !y
          ? ''
          : `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };
    const draw = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };
    /** Never further than the edge of what is being looked at. */
    const hold = () => {
      const roomX = Math.max(0, (width * scale - frame_.clientWidth) / 2);
      const roomY = Math.max(0, (height * scale - frame_.clientHeight) / 2);
      x = Math.min(roomX, Math.max(-roomX, x));
      y = Math.min(roomY, Math.max(-roomY, y));
    };
    const measure = () => {
      const seen = frame_.getBoundingClientRect();
      width = sheet.offsetWidth;
      height = sheet.offsetHeight;
      centreX = seen.left + seen.width / 2;
      centreY = seen.top + seen.height / 2;
    };

    const start = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        measure();
        const [a, b] = [event.touches[0], event.touches[1]];
        fromSpan = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        fromScale = scale;
        // The point of the invoice between the fingers, which stays there.
        const midX = (a.clientX + b.clientX) / 2 - centreX;
        const midY = (a.clientY + b.clientY) / 2 - centreY;
        anchorX = (midX - x) / scale;
        anchorY = (midY - y) / scale;
        pinching = true;
        panning = false;
        return;
      }
      if (event.touches.length === 1 && scale > 1) {
        measure();
        panX = event.touches[0].clientX - x;
        panY = event.touches[0].clientY - y;
        panning = true;
      }
    };

    const move = (event: TouchEvent) => {
      if (pinching && event.touches.length === 2) {
        event.preventDefault();
        const [a, b] = [event.touches[0], event.touches[1]];
        const span = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        scale = Math.min(MAX_ZOOM, Math.max(1, (fromScale * span) / (fromSpan || 1)));
        x = (a.clientX + b.clientX) / 2 - centreX - anchorX * scale;
        y = (a.clientY + b.clientY) / 2 - centreY - anchorY * scale;
        hold();
        draw();
        return;
      }
      if (panning && event.touches.length === 1) {
        event.preventDefault();
        x = event.touches[0].clientX - panX;
        y = event.touches[0].clientY - panY;
        hold();
        draw();
      }
    };

    const end = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        pinching = panning = false;
        // All the way out is all the way back: no drifted corner to find.
        if (scale <= 1.01) {
          scale = 1;
          x = y = 0;
          draw();
        }
        return;
      }
      if (event.touches.length === 1 && pinching) {
        pinching = false;
        if (scale > 1) {
          measure();
          panX = event.touches[0].clientX - x;
          panY = event.touches[0].clientY - y;
          panning = true;
        }
      }
    };

    // Safari's own pinch, which arrives as well as the touches on older
    // versions, and would zoom the page underneath.
    const refuse = (event: Event) => event.preventDefault();

    frame_.addEventListener('touchstart', start, { passive: true });
    frame_.addEventListener('touchmove', move, { passive: false });
    frame_.addEventListener('touchend', end, { passive: true });
    frame_.addEventListener('touchcancel', end, { passive: true });
    frame_.addEventListener('gesturestart', refuse);
    frame_.addEventListener('gesturechange', refuse);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      frame_.removeEventListener('touchstart', start);
      frame_.removeEventListener('touchmove', move);
      frame_.removeEventListener('touchend', end);
      frame_.removeEventListener('touchcancel', end);
      frame_.removeEventListener('gesturestart', refuse);
      frame_.removeEventListener('gesturechange', refuse);
      sheet.style.transform = '';
    };
  }, [view]);

  return (
    <div ref={area} className="ld-invoice-fit">
      <div
        ref={box}
        className="ld-invoice-fit-box"
        style={
          fit.width
            ? { width: fit.width * fit.scale, height: fit.height * fit.scale }
            : { visibility: 'hidden' }
        }
      >
        <div
          ref={page}
          className="ld-invoice-fit-page"
          style={{ transform: `scale(${fit.scale})` }}
        >
          <InvoiceSheet lines={view.lines} invoice={view.invoice} />
        </div>
      </div>
    </div>
  );
}

/**
 * Invoice preview with printing. While open, a print-only copy is mounted on
 * <body> so the printed page contains the invoice alone.
 */
export default function InvoiceDialog({
  view,
  onClose,
}: {
  view: InvoiceView | null;
  onClose: () => void;
}) {
  const count = view?.lines.length ?? 0;
  // The window around the invoice follows the chosen language; the invoice
  // itself always prints in English.
  const { t, plural } = useT();
  return (
    <>
      <Dialog
        open={view !== null}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent className="h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden sm:max-w-[min(1280px,calc(100%-2rem))]">
          {view ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {t('Invoice {number}', { number: view.invoice.invoice_number })}
                </DialogTitle>
                <DialogDescription>
                  {t('Tickets on this invoice: {count}.', { count: plural(count, 'ticket') })}{' '}
                  {view.lines.some((line) => lineTotal(line.ticket) === null)
                    ? t('Draft until every line has a rate (and hours on hourly lines).')
                    : t('Every line has a rate.')}{' '}
                  {t('To save a PDF, print and choose Save as PDF.')}
                </DialogDescription>
              </DialogHeader>
              <FittedInvoice view={view} />
              <DialogFooter showCloseButton>
                <Button onClick={() => window.print()}>
                  <Printer />
                  {t('Print or save PDF')}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      {view
        ? createPortal(
            <div className="ld-print-root">
              <InvoiceSheet lines={view.lines} invoice={view.invoice} />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
