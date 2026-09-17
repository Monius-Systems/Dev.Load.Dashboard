'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { usePinchZoom } from '@/hooks/use-pinch-zoom';
import { useT } from '@/lib/i18n/use-t';
import { fileSize } from '@/lib/load-desk/format';
import type { QueueItem } from '@/lib/load-desk/types';

/**
 * The photographed ticket, over the whole screen, for checking a field against.
 *
 * Reviewing a ticket is reading one number off a picture and typing it into a
 * box, over and over. On a desk the picture is beside the form; on a phone
 * there is no beside, and a picture laid out in the form pushes the fields a
 * screen apart. So it is kept as a thumbnail in the flow and opened over
 * everything when it is wanted — pinched and moved about like a photograph,
 * and closed back onto the field that was being filled in.
 */
export default function TicketViewer({
  item,
  onClose,
}: {
  item: QueueItem;
  onClose: () => void;
}) {
  const { t } = useT();
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const subject = useRef<HTMLDivElement>(null);
  const pdf = item.source.type === 'application/pdf';
  usePinchZoom(frame, subject, { max: 6, reset: item.id });

  // A real dialog, so it is in the top layer over everything the page has, and
  // Escape and the page behind it are the browser's business rather than ours.
  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialog}
      className="ld-viewer"
      aria-label={t('Original ticket')}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="ld-viewer-head">
        <span className="ld-viewer-name">{item.source.file_name}</span>
        <button
          type="button"
          className="ld-viewer-close"
          aria-label={t('Close')}
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </header>
      <div className="ld-viewer-stage" ref={frame}>
        <div className="ld-viewer-page" ref={subject}>
          {pdf ? (
            <iframe
              src={item.preview_url}
              title={t('Original: {name}', { name: item.source.file_name })}
            />
          ) : (
            // Not next/image: this is an object URL for a blob held in this
            // session, with no size known until it is decoded.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.preview_url} alt={t('Original: {name}', { name: item.source.file_name })} />
          )}
        </div>
      </div>
      <p className="ld-viewer-foot">
        {fileSize(item.source.size)}
        {pdf ? null : ` · ${t('Pinch to zoom')}`}
      </p>
    </dialog>,
    document.body,
  );
}
