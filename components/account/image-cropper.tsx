'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus } from 'lucide-react';
import {
  clampOffset,
  coverScale,
  sourceRect,
  MAX_ZOOM,
  type Offset,
  type Size,
} from '@/lib/crop-box';
import { useT } from '@/lib/i18n/use-t';

/**
 * Fitting a picture into the shape it will be shown in.
 *
 * The window is that shape and it does not move: a circle for a person, a
 * rounded square for a company, the same shapes the app draws those icons in.
 * What moves is the picture behind it — dragged about, and zoomed with the
 * wheel, the buttons or the slider — until the part worth keeping is the part
 * showing through.
 *
 * The window is always full, whatever is done to the picture, because zoom is
 * measured from the scale at which the picture just covers it and the drag is
 * held inside its edges. There is no way to leave a corner of nothing in an
 * icon, which a box dragged freely over a picture allowed.
 *
 * What is cut is the square behind that window, not the shape: the shape is the
 * app's, drawn in CSS wherever the icon appears, and a person's photo is stored
 * as a JPEG, which has no transparent corners to cut into.
 */

/** The window on the screen. The stored picture is larger; see the uploads. */
const FRAME = 280;

export default function ImageCropper({
  file,
  shape,
  title,
  onCancel,
  onCropped,
}: {
  file: File;
  /** The shape this picture is shown in, once it is in place. */
  shape: 'circle' | 'rounded';
  title: string;
  onCancel: () => void;
  onCropped: (cropped: File) => void;
}) {
  const { t } = useT();
  const dialog = useRef<HTMLDialogElement>(null);
  // Made once, for the file this cropper was mounted with, and let go of when
  // it closes.
  const [url] = useState(() => URL.createObjectURL(file));
  const [natural, setNatural] = useState<Size | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // The scale the picture is actually drawn at: covering the window, times the
  // zoom asked for.
  const drawScale = natural ? coverScale(natural, FRAME) * zoom : 1;

  /** Zooms, and pulls the picture back inside the window if that left a gap. */
  function zoomTo(next: number) {
    const held = Math.min(MAX_ZOOM, Math.max(1, next));
    setZoom(held);
    if (natural) {
      setOffset((current) =>
        clampOffset(current, natural, FRAME, coverScale(natural, FRAME) * held),
      );
    }
  }

  function reset() {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }

  /** Dragging the picture behind the window. */
  function grab(event: React.PointerEvent) {
    if (!natural) return;
    event.preventDefault();
    const fromX = event.clientX;
    const fromY = event.clientY;
    const start = offset;
    const move = (moved: PointerEvent) =>
      setOffset(
        clampOffset(
          { x: start.x + (moved.clientX - fromX), y: start.y + (moved.clientY - fromY) },
          natural,
          FRAME,
          drawScale,
        ),
      );
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  /** Cuts the square behind the window out of the original, at its own size. */
  async function keep() {
    if (!natural || busy) return;
    setBusy(true);
    setError(null);
    try {
      const rect = sourceRect(natural, FRAME, drawScale, offset);
      const bitmap = await createImageBitmap(file);
      // Never larger than what was actually there to cut.
      const side = Math.max(1, Math.round(Math.min(rect.size, 1024)));
      const surface = Object.assign(document.createElement('canvas'), {
        width: side,
        height: side,
      });
      const context = surface.getContext('2d');
      if (!context) throw new Error('This browser cannot prepare the picture.');
      context.imageSmoothingQuality = 'high';
      context.drawImage(
        bitmap,
        rect.x,
        rect.y,
        rect.size,
        rect.size,
        0,
        0,
        side,
        side,
      );
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) =>
        surface.toBlob(resolve, 'image/png'),
      );
      if (!blob) throw new Error('That picture could not be read.');
      onCropped(new File([blob], 'cropped.png', { type: 'image/png' }));
    } catch (thrown) {
      setBusy(false);
      setError(
        thrown instanceof Error ? thrown.message : 'That picture could not be read.',
      );
    }
  }

  return createPortal(
    <dialog
      ref={dialog}
      className="ac-cropper"
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <p className="ac-cropper-title">{title}</p>
      {/* The window, and the picture behind it. The drag is on this whole
          square rather than on anything drawn over it: there is one thing to
          take hold of and nothing to miss. */}
      <div
        className="ac-cropper-frame"
        data-shape={shape}
        onPointerDown={grab}
        onWheel={(event) => zoomTo(zoom * Math.exp(-event.deltaY * 0.002))}
      >
        {/* Not next/image: an object URL for a file picked a moment ago, whose
            size is not known until the browser has decoded it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt=""
          draggable={false}
          className="ac-cropper-picture"
          style={
            natural
              ? {
                  width: natural.width * drawScale,
                  height: natural.height * drawScale,
                  transform: `translate(${offset.x}px, ${offset.y}px)`,
                }
              : { visibility: 'hidden' }
          }
          onLoad={(event) => {
            const shown = event.currentTarget;
            setNatural({ width: shown.naturalWidth, height: shown.naturalHeight });
          }}
        />
        {/* The shape, cut out of a dim sheet. It takes no pointer events, so
            the picture under it stays the thing being dragged. */}
        <span className="ac-cropper-mask" data-shape={shape} aria-hidden="true" />
      </div>
      <div className="ac-cropper-zoom">
        <button
          type="button"
          aria-label={t('Zoom out')}
          onClick={() => zoomTo(zoom / 1.3)}
          disabled={busy}
        >
          <Minus size={16} />
        </button>
        <input
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          aria-label={t('Zoom')}
          disabled={busy || !natural}
          onChange={(event) => zoomTo(Number(event.target.value))}
        />
        <button
          type="button"
          aria-label={t('Zoom in')}
          onClick={() => zoomTo(zoom * 1.3)}
          disabled={busy}
        >
          <Plus size={16} />
        </button>
      </div>
      <p className="ac-cropper-hint">
        {t('Drag the picture to move it, and zoom until it sits the way you want.')}
      </p>
      {error ? (
        <p className="ld-status" data-tone="error" role="alert">
          {t(error)}
        </p>
      ) : null}
      <div className="ac-cropper-actions">
        <button type="button" className="ac-cropper-reset" onClick={reset} disabled={busy}>
          {t('Reset')}
        </button>
        <button type="button" className="ac-cropper-cancel" onClick={onCancel} disabled={busy}>
          {t('Cancel')}
        </button>
        <button
          type="button"
          className="ac-cropper-save"
          onClick={() => void keep()}
          disabled={busy || !natural}
        >
          {busy ? t('Saving…') : t('Save')}
        </button>
      </div>
    </dialog>,
    document.body,
  );
}
