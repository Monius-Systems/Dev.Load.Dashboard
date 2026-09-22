'use client';

import { MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useT } from '@/lib/i18n/use-t';
import { openOperator } from '@/lib/operator/panel-store';
import type { EntityRef } from '@/lib/operator/types';

// "Ask Monius", on the thing itself.
//
// The trigger in the top bar opens the panel on the page. This opens it on one
// invoice, one ticket, one customer, one day — so that a person who is already
// looking at the invoice that will not go out does not have to describe it to
// the Operator first. The entity goes into the panel's context, the engine puts
// it into the instructions, and "why isn't this ready?" means that invoice.
//
// It fetches nothing and knows nothing about the Operator beyond the store it
// publishes to: a page is not a client of /api/operator, and adding a button to
// a page must not add a request to that page's load. Everything after the press
// is the panel's work.

export default function AskMonius({
  entity = null,
  ask,
  variant = 'ghost',
  size = 'sm',
  label,
}: {
  /** The thing the panel opens on; null asks about the page itself. */
  entity?: EntityRef | null;
  /** A question to put in the box ready to send, from the page's own words. */
  ask?: string;
  variant?: 'ghost' | 'secondary';
  size?: 'sm' | 'icon-sm';
  /** An accessible name naming the thing, where a row of icons needs one. */
  label?: string;
}) {
  const { t } = useT();
  const name = label ?? t('Ask Monius');
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className="op-ask"
      aria-label={name}
      title={t('Ask Monius')}
      onClick={() =>
        openOperator({
          // The page is read at the press rather than held in a prop, so a
          // button rendered once on a page that routes elsewhere still opens
          // the panel on wherever the person actually is.
          page: window.location.pathname,
          entity,
          ask,
        })
      }
    >
      <MessageSquareText data-icon={size === 'icon-sm' ? undefined : 'inline-start'} />
      {size === 'icon-sm' ? null : t('Ask Monius')}
    </Button>
  );
}
