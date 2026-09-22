'use client';

import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useT } from '@/lib/i18n/use-t';
import { openOperator } from '@/lib/operator/panel-store';
import {
  getOperatorSnapshot,
  getServerOperatorSnapshot,
  subscribeOperator,
} from '@/lib/load-desk/operator-client';

// The way in, from every page: a pill in the top bar beside the scan progress.
//
// It is in the bar rather than on a page because the Operator is not a page —
// it is asked about whatever is in front of you — and because a run started on
// one page is still going when another is opened. That is what the dot is for:
// while a run is in flight the trigger pulses, so closing the panel and
// carrying on does not mean losing sight of the work.
//
// Pressing it opens the panel on this page with nothing typed. A page that
// wants to open it on a particular invoice calls openOperator itself.

export default function OperatorTrigger() {
  const { t } = useT();
  const operator = useSyncExternalStore(
    subscribeOperator,
    getOperatorSnapshot,
    getServerOperatorSnapshot,
  );
  const pathname = usePathname();
  return (
    <Button
      variant="secondary"
      className="op-trigger"
      data-busy={operator.busy || undefined}
      aria-label={t('Ask Monius')}
      onClick={() => openOperator({ page: pathname })}
    >
      <MessageSquareText aria-hidden="true" />
      <span className="op-trigger-label">{t('Ask Monius')}</span>
      {operator.busy ? <span className="op-trigger-dot" aria-hidden="true" /> : null}
    </Button>
  );
}
