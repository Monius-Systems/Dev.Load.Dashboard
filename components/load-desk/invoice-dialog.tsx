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

/**
 * The invoice page scaled down to fit the preview area whole, so nothing
 * needs scrolling. The page keeps its real size underneath, so it lays out
 * (and prints) exactly as on paper.
 */
function FittedInvoice({ view }: { view: InvoiceView }) {
  const area = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
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

  return (
    <div ref={area} className="ld-invoice-fit">
      <div
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
