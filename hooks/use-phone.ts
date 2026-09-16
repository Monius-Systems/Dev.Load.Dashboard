'use client';

import { useEffect, useState } from 'react';
import { isPhoneEnvironment } from '@/lib/scanner/environment';

/**
 * True on a phone that can take a photo. False while rendering on the server
 * and on anything else, so the camera scanner is offered to phones alone.
 */
export function useIsPhone() {
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia('(pointer: coarse)');
    const hover = window.matchMedia('(hover: hover)');
    const read = () =>
      setPhone(
        isPhoneEnvironment({
          coarsePointer: pointer.matches,
          canHover: hover.matches,
          width: window.innerWidth,
          height: window.innerHeight,
          hasCamera: !!navigator.mediaDevices?.getUserMedia,
        }),
      );
    read();
    pointer.addEventListener('change', read);
    hover.addEventListener('change', read);
    window.addEventListener('resize', read);
    window.addEventListener('orientationchange', read);
    return () => {
      pointer.removeEventListener('change', read);
      hover.removeEventListener('change', read);
      window.removeEventListener('resize', read);
      window.removeEventListener('orientationchange', read);
    };
  }, []);

  return phone;
}
