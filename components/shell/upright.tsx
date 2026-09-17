'use client';

import { RotateCcw } from 'lucide-react';
import { useT } from '@/lib/i18n/use-t';

/**
 * The app is a portrait app, and says so when a phone is turned on its side.
 *
 * A phone cannot be made to stay upright by a web page: the one API for it,
 * screen.orientation.lock(), is not implemented in Safari at all and elsewhere
 * only in fullscreen. The manifest asks for portrait, which an installed app on
 * Android honours, and this is what happens everywhere else — the app stops and
 * asks for the phone back the right way up, rather than laying out sideways.
 *
 * Only a phone on its side: short and wide and touched rather than pointed at.
 * A tablet or a laptop window of the same shape is a screen the app is built
 * for. The camera is the exception and is left alone — it is a modal dialog in
 * the top layer, above anything this can paint, and photographing a ticket
 * sideways is a real thing to want.
 */
export default function Upright() {
  const { t } = useT();
  return (
    <div className="upright" role="alert">
      <RotateCcw aria-hidden="true" />
      <strong>{t('Turn your phone upright')}</strong>
      <span>{t('Load Desk is built for a phone held the tall way.')}</span>
    </div>
  );
}
