'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Pinching one thing on the screen, rather than the whole page.
 *
 * A phone's own pinch zooms everything — the dialog, the bar along the bottom,
 * the lot — which is no way to read a line of a bill or a weight off a ticket.
 * So the frame takes the gesture itself: touch-action tells the browser to keep
 * its hands off anything that starts in there (the frame's own stylesheet has
 * to say `touch-action: none`), and what the fingers do is applied to the
 * subject as a transform. Two fingers scale it about the point between them,
 * one finger moves it once it is bigger than the frame, and letting go of the
 * zoom puts it back where it started.
 *
 * A desk has no fingers to pinch with, so the same frame also takes the wheel
 * (zooming about the pointer, the way a map does) and a drag of the mouse to
 * move what is under it. The returned handle is the third way in: buttons the
 * caller draws, for anyone who would rather press than scroll.
 *
 * Written straight to the element from an animation frame: a pinch that
 * re-rendered React on every touchmove would stutter.
 */
/** Zooming from something other than a gesture: the caller's own buttons. */
export type ZoomHandle = {
  /** Multiplies the scale, about the middle of the frame. */
  zoomBy(factor: number): void;
  /** All the way back out. */
  home(): void;
};

export function usePinchZoom(
  frame: RefObject<HTMLElement | null>,
  subject: RefObject<HTMLElement | null>,
  { max = 5, reset }: { max?: number; reset?: unknown } = {},
) {
  // The gesture state lives in the effect below, so buttons reach it through
  // here rather than by lifting scale into React and re-rendering on every
  // touchmove.
  const handle = useRef<ZoomHandle>({ zoomBy: () => {}, home: () => {} });
  useEffect(() => {
    const box = frame.current;
    const sheet = subject.current;
    if (!box || !sheet) return;
    let scale = 1,
      x = 0,
      y = 0,
      frameId = 0;
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
      frameId = 0;
      sheet.style.transform =
        scale === 1 && !x && !y
          ? ''
          : `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };
    const draw = () => {
      if (!frameId) frameId = requestAnimationFrame(write);
    };
    /** Never further than the edge of what is being looked at. */
    const hold = () => {
      const roomX = Math.max(0, (width * scale - box.clientWidth) / 2);
      const roomY = Math.max(0, (height * scale - box.clientHeight) / 2);
      x = Math.min(roomX, Math.max(-roomX, x));
      y = Math.min(roomY, Math.max(-roomY, y));
    };
    const measure = () => {
      const seen = box.getBoundingClientRect();
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
        // The point between the fingers, which stays between them.
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
        scale = Math.min(max, Math.max(1, (fromScale * span) / (fromSpan || 1)));
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

    /** Scales to `next`, keeping whatever is under (clientX, clientY) there. */
    const zoomAbout = (clientX: number, clientY: number, next: number) => {
      const target = Math.min(max, Math.max(1, next));
      const pointX = clientX - centreX;
      const pointY = clientY - centreY;
      const heldX = (pointX - x) / scale;
      const heldY = (pointY - y) / scale;
      scale = target;
      x = pointX - heldX * scale;
      y = pointY - heldY * scale;
      // All the way out is all the way back, as it is after a pinch.
      if (scale === 1) x = y = 0;
      hold();
      draw();
    };

    // The wheel, and the trackpad pinch a browser sends as a ctrl-wheel.
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      measure();
      zoomAbout(event.clientX, event.clientY, scale * Math.exp(-event.deltaY * 0.002));
    };

    // Dragging with the mouse once there is more picture than frame. Bound to
    // the window while the button is down, so the drag survives the pointer
    // leaving the frame.
    const mouseMove = (event: MouseEvent) => {
      x = event.clientX - panX;
      y = event.clientY - panY;
      hold();
      draw();
    };
    const mouseUp = () => {
      panning = false;
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
    const mouseDown = (event: MouseEvent) => {
      if (event.button !== 0 || scale <= 1) return;
      event.preventDefault();
      measure();
      panX = event.clientX - x;
      panY = event.clientY - y;
      panning = true;
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    };

    handle.current = {
      // From the middle, because a button is not pointing at anywhere in
      // particular.
      zoomBy: (factor) => {
        measure();
        zoomAbout(centreX, centreY, scale * factor);
      },
      home: () => {
        scale = 1;
        x = y = 0;
        draw();
      },
    };

    // Safari's own pinch, which arrives as well as the touches on older
    // versions and would zoom the page underneath.
    const refuse = (event: Event) => event.preventDefault();

    box.addEventListener('wheel', wheel, { passive: false });
    box.addEventListener('mousedown', mouseDown);
    box.addEventListener('touchstart', start, { passive: true });
    box.addEventListener('touchmove', move, { passive: false });
    box.addEventListener('touchend', end, { passive: true });
    box.addEventListener('touchcancel', end, { passive: true });
    box.addEventListener('gesturestart', refuse);
    box.addEventListener('gesturechange', refuse);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      handle.current = { zoomBy: () => {}, home: () => {} };
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
      box.removeEventListener('wheel', wheel);
      box.removeEventListener('mousedown', mouseDown);
      box.removeEventListener('touchstart', start);
      box.removeEventListener('touchmove', move);
      box.removeEventListener('touchend', end);
      box.removeEventListener('touchcancel', end);
      box.removeEventListener('gesturestart', refuse);
      box.removeEventListener('gesturechange', refuse);
      sheet.style.transform = '';
    };
  }, [frame, subject, max, reset]);
  return handle;
}
