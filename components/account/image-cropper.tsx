'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useT } from '@/lib/i18n/use-t';

/**
 * Choosing what part of a picture is kept, before it is uploaded.
 *
 * A photo taken on a phone is whatever was in frame, and a logo arrives with
 * whatever white space the file was saved with. Taking the middle of it and
 * hoping is what this replaces: a box over the picture, moved by dragging it
 * and resized by its corners, and what is inside the box is what is stored.
 *
 * The box is held in pixels of the picture as it is displayed rather than in
 * fractions of the original, because that is the space the fingers and the
 * pointer work in; it is scaled back up to the original when it is cut.
 */

type Box = { x: number; y: number; w: number; h: number };
type Corner = 'nw' | 'ne' | 'sw' | 'se';
/** Small enough to crop tightly, large enough to still have corners to grab. */
const MIN_SIDE = 40;

export default function ImageCropper({
  file,
  square = false,
  title,
  onCancel,
  onCropped,
}: {
  file: File;
  /** Locks the box to a square, for a picture shown in a round or square slot. */
  square?: boolean;
  title: string;
  onCancel: () => void;
  onCropped: (cropped: File) => void;
}) {
  const { t } = useT();
  const dialog = useRef<HTMLDialogElement>(null);
  const picture = useRef<HTMLImageElement>(null);
  // Made once, for the file this cropper was mounted with, and let go of when
  // it closes. Not in an effect: an effect that sets state on mount renders the
  // picture a frame late and costs a second pass for nothing.
  const [url] = useState(() => URL.createObjectURL(file));
  const [box, setBox] = useState<Box | null>(null);
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

  /** The whole picture to start with, or the largest square inside it. */
  function fitBox() {
    const shown = picture.current;
    if (!shown) return;
    const width = shown.clientWidth;
    const height = shown.clientHeight;
    if (!width || !height) return;
    const side = Math.min(width, height);
    setBox(
      square
        ? { x: (width - side) / 2, y: (height - side) / 2, w: side, h: side }
        : { x: 0, y: 0, w: width, h: height },
    );
  }

  /** Dragging the box itself, or one of its corners. */
  function grab(event: React.PointerEvent, corner: Corner | null) {
    const shown = picture.current;
    if (!shown || !box) return;
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).setPointerCapture(event.pointerId);
    const limitW = shown.clientWidth;
    const limitH = shown.clientHeight;
    const fromX = event.clientX;
    const fromY = event.clientY;
    const start = box;

    const move = (moved: PointerEvent) => {
      const dx = moved.clientX - fromX;
      const dy = moved.clientY - fromY;
      if (!corner) {
        setBox({
          ...start,
          x: Math.min(limitW - start.w, Math.max(0, start.x + dx)),
          y: Math.min(limitH - start.h, Math.max(0, start.y + dy)),
        });
        return;
      }
      // The corner opposite the one being dragged stays where it is.
      const right = start.x + start.w;
      const bottom = start.y + start.h;
      const west = corner === 'nw' || corner === 'sw';
      const north = corner === 'nw' || corner === 'ne';
      let x = west ? Math.min(right - MIN_SIDE, Math.max(0, start.x + dx)) : start.x;
      let y = north ? Math.min(bottom - MIN_SIDE, Math.max(0, start.y + dy)) : start.y;
      let w = west ? right - x : Math.min(limitW - start.x, Math.max(MIN_SIDE, start.w + dx));
      let h = north ? bottom - y : Math.min(limitH - start.y, Math.max(MIN_SIDE, start.h + dy));
      if (square) {
        // The smaller of the two, so the box never leaves the picture.
        const side = Math.min(w, h);
        w = h = side;
        if (west) x = right - side;
        if (north) y = bottom - side;
      }
      setBox({ x, y, w, h });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  /** Cuts the box out of the original, at the original's own resolution. */
  async function keep() {
    const shown = picture.current;
    if (!shown || !box || busy) return;
    setBusy(true);
    setError(null);
    try {
      const bitmap = await createImageBitmap(file);
      const scaleX = bitmap.width / shown.clientWidth;
      const scaleY = bitmap.height / shown.clientHeight;
      const width = Math.max(1, Math.round(box.w * scaleX));
      const height = Math.max(1, Math.round(box.h * scaleY));
      const surface = Object.assign(document.createElement('canvas'), { width, height });
      const context = surface.getContext('2d');
      if (!context) throw new Error('This browser cannot prepare the picture.');
      context.imageSmoothingQuality = 'high';
      context.drawImage(
        bitmap,
        box.x * scaleX,
        box.y * scaleY,
        box.w * scaleX,
        box.h * scaleY,
        0,
        0,
        width,
        height,
      );
      bitmap.close();
      // PNG: a logo with a cut-out background keeps it, and nothing downstream
      // is the worse for it — both uploads re-encode at the size they store.
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
      <div className="ac-cropper-stage">
        {/* Not next/image: an object URL for a file picked a moment ago, whose
            size is not known until the browser has decoded it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={picture}
          src={url}
          alt=""
          className="ac-cropper-picture"
          onLoad={fitBox}
          draggable={false}
        />
        {box ? (
          <div
            className="ac-cropper-box"
            style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
            onPointerDown={(event) => grab(event, null)}
          >
            {(['nw', 'ne', 'sw', 'se'] as Corner[]).map((corner) => (
              <span
                key={corner}
                className="ac-cropper-corner"
                data-corner={corner}
                onPointerDown={(event) => grab(event, corner)}
              />
            ))}
          </div>
        ) : null}
      </div>
      <p className="ac-cropper-hint">
        {t('Drag the box to move it, and its corners to change what is kept.')}
      </p>
      {error ? (
        <p className="ld-status" data-tone="error" role="alert">
          {t(error)}
        </p>
      ) : null}
      <div className="ac-cropper-actions">
        <button type="button" className="ac-cropper-reset" onClick={fitBox} disabled={busy}>
          {t('Reset')}
        </button>
        <button type="button" className="ac-cropper-cancel" onClick={onCancel} disabled={busy}>
          {t('Cancel')}
        </button>
        <button type="button" className="ac-cropper-save" onClick={() => void keep()} disabled={busy}>
          {busy ? t('Saving…') : t('Save')}
        </button>
      </div>
    </dialog>,
    document.body,
  );
}
