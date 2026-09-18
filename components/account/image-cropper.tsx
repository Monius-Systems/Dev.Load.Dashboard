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
import { suspendSmoothCursor } from '@/components/shell/cursor-suspend';

/**
 * Fitting a picture into the shape it will be shown in.
 *
 * The window is that shape and it does not move: a circle for a person, a
 * rounded square for a company, the same shapes the app draws those icons in.
 * What moves is the picture behind it — dragged about, and zoomed by pinching
 * with two fingers, or with the wheel, the buttons or the slider — until the
 * part worth keeping is the part showing through.
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
  const frame = useRef<HTMLDivElement>(null);
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
    // A modal dialog is painted over the smooth cursor, which would leave the
    // pointer invisible on the one screen where aiming it is the whole task.
    const restoreCursor = suspendSmoothCursor();
    return () => {
      document.body.style.overflow = previous;
      restoreCursor();
    };
  }, []);

  // The scale the picture is actually drawn at: covering the window, times the
  // zoom asked for.
  const drawScale = natural ? coverScale(natural, FRAME) * zoom : 1;

  // What the gesture below reads. It is bound once, so it cannot close over
  // this render's values; written after each commit rather than during the
  // render, which is not a ref's to change.
  const live = useRef({ natural, zoom, offset });
  useEffect(() => {
    live.current = { natural, zoom, offset };
  }, [natural, zoom, offset]);

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

  /**
   * Moving the picture behind the window: one finger or the mouse drags it, two
   * fingers pinch it about the point between them.
   *
   * Every pointer down on the frame is captured by it, so the moves and the
   * release come back here wherever the hand has gone — off the frame, off the
   * dialog, off the window. Without that a release the frame never hears leaves
   * a live pointermove listener behind, and the picture then follows the mouse
   * with no button held: the drag that starts again by itself when you go to
   * click something else.
   *
   * Bound as native listeners rather than React props because a pinch has to be
   * able to refuse the browser's own zoom, which needs a non-passive listener.
   */
  useEffect(() => {
    const box = frame.current;
    if (!box) return;
    // The pointers down on the frame right now, in the order they arrived.
    const down = new Map<number, { x: number; y: number }>();
    let mode: 'none' | 'drag' | 'pinch' = 'none';
    let fromOffset: Offset = { x: 0, y: 0 };
    let fromZoom = 1;
    let fromSpan = 1;
    let fromPoint = { x: 0, y: 0 };
    // The point of the picture under the middle of the fingers, which is what a
    // pinch keeps under them.
    let anchor = { x: 0, y: 0 };

    const middleOfFrame = () => {
      const seen = box.getBoundingClientRect();
      return { x: seen.left + seen.width / 2, y: seen.top + seen.height / 2 };
    };
    const scaleAt = (zoomed: number) => {
      const size = live.current.natural;
      return size ? coverScale(size, FRAME) * zoomed : 1;
    };

    /**
     * Takes the gesture's bearings from where the fingers are now. Called again
     * whenever their number changes, so a finger lifted out of a pinch leaves
     * the other one dragging from where it is rather than from where the pinch
     * began.
     */
    const begin = () => {
      const points = [...down.values()];
      fromOffset = live.current.offset;
      fromZoom = live.current.zoom;
      if (points.length >= 2) {
        const [a, b] = points;
        fromSpan = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const centre = middleOfFrame();
        const mid = { x: (a.x + b.x) / 2 - centre.x, y: (a.y + b.y) / 2 - centre.y };
        const scale = scaleAt(fromZoom);
        anchor = {
          x: (mid.x - fromOffset.x) / scale,
          y: (mid.y - fromOffset.y) / scale,
        };
        mode = 'pinch';
        return;
      }
      if (points.length === 1) {
        fromPoint = { ...points[0] };
        mode = 'drag';
        return;
      }
      mode = 'none';
    };

    const onDown = (event: PointerEvent) => {
      if (!live.current.natural) return;
      // Two is all a pinch needs; a third finger is left out of it.
      if (down.has(event.pointerId) || down.size >= 2) return;
      event.preventDefault();
      box.setPointerCapture(event.pointerId);
      down.set(event.pointerId, { x: event.clientX, y: event.clientY });
      begin();
    };

    const onMove = (event: PointerEvent) => {
      if (!down.has(event.pointerId)) return;
      const size = live.current.natural;
      if (!size) return;
      event.preventDefault();
      down.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const points = [...down.values()];

      if (mode === 'pinch' && points.length >= 2) {
        const [a, b] = points;
        const span = Math.hypot(a.x - b.x, a.y - b.y);
        const next = Math.min(MAX_ZOOM, Math.max(1, (fromZoom * span) / fromSpan));
        const scale = coverScale(size, FRAME) * next;
        const centre = middleOfFrame();
        const mid = { x: (a.x + b.x) / 2 - centre.x, y: (a.y + b.y) / 2 - centre.y };
        setZoom(next);
        setOffset(
          clampOffset(
            { x: mid.x - anchor.x * scale, y: mid.y - anchor.y * scale },
            size,
            FRAME,
            scale,
          ),
        );
        return;
      }

      if (mode === 'drag') {
        const point = points[0];
        if (!point) return;
        setOffset(
          clampOffset(
            {
              x: fromOffset.x + (point.x - fromPoint.x),
              y: fromOffset.y + (point.y - fromPoint.y),
            },
            size,
            FRAME,
            scaleAt(live.current.zoom),
          ),
        );
      }
    };

    const onUp = (event: PointerEvent) => {
      if (!down.delete(event.pointerId)) return;
      if (box.hasPointerCapture(event.pointerId)) {
        box.releasePointerCapture(event.pointerId);
      }
      begin();
    };

    // Safari sends its own page pinch alongside the touches on some versions,
    // which would zoom the dialog instead of the picture.
    const refuse = (event: Event) => event.preventDefault();

    box.addEventListener('pointerdown', onDown);
    box.addEventListener('pointermove', onMove, { passive: false });
    box.addEventListener('pointerup', onUp);
    box.addEventListener('pointercancel', onUp);
    box.addEventListener('gesturestart', refuse);
    box.addEventListener('gesturechange', refuse);
    return () => {
      for (const id of down.keys()) {
        if (box.hasPointerCapture(id)) box.releasePointerCapture(id);
      }
      box.removeEventListener('pointerdown', onDown);
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerup', onUp);
      box.removeEventListener('pointercancel', onUp);
      box.removeEventListener('gesturestart', refuse);
      box.removeEventListener('gesturechange', refuse);
    };
  }, []);

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
      {/* The window, and the picture behind it. The gesture is on this whole
          square rather than on anything drawn over it: there is one thing to
          take hold of and nothing to miss. */}
      <div
        ref={frame}
        className="ac-cropper-frame"
        data-shape={shape}
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
