'use client';

import { Button } from '@/components/ui/button';
import { useT } from '@/lib/i18n/use-t';
import EntityChips from '@/components/operator/entity-chips';
import { riskLabel, riskTone, toolLabel } from '@/lib/operator/tool-labels';
import { mergeEntities } from '@/lib/load-desk/operator-client';
import type { PendingConfirmation } from '@/lib/operator/types';

// The moment a person decides whether work happens.
//
// Everything on this card came from a dry run: the tool that would run, how
// many records it would touch, which ones they are, and why the policy is
// asking rather than doing. The figures are the app's own — the model never
// supplies a number here — and pressing Confirm sends nothing but the
// action's id, so the server previews it again and refuses if the world moved
// underneath the card.

export default function ConfirmationCard({
  pending,
  busy,
  onConfirm,
  onCancel,
}: {
  pending: PendingConfirmation;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useT();
  const impact = pending.impact;
  const lines = Array.isArray(impact?.lines) ? impact.lines : [];
  const affected = mergeEntities(Array.isArray(impact?.affected) ? impact.affected : []);
  const blockers = Array.isArray(impact?.blockers) ? impact.blockers : [];
  return (
    <section className="op-confirm" aria-live="polite">
      <header className="op-confirm-head">
        <p className="ld-step">{t('Needs your go-ahead')}</p>
        <span className="ld-chip op-risk" data-tone={riskTone(pending.risk)}>
          {t(riskLabel(pending.risk))}
        </span>
      </header>
      <h3 className="op-confirm-title">{t(toolLabel(pending.tool))}</h3>
      {lines.length ? (
        <ul className="op-confirm-lines">
          {lines.map((line, at) => (
            <li key={at}>{line}</li>
          ))}
        </ul>
      ) : null}
      <EntityChips entities={affected} />
      {pending.reason ? <p className="op-confirm-why">{pending.reason}</p> : null}
      {blockers.length ? (
        <div className="ld-notice" data-tone="warning">
          <ul>
            {blockers.map((blocker, at) => (
              <li key={at}>{blocker}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="op-confirm-buttons">
        <Button disabled={busy || blockers.length > 0} onClick={onConfirm}>
          {busy ? t('Working…') : t('Confirm')}
        </Button>
        <Button variant="secondary" disabled={busy} onClick={onCancel}>
          {t('Not now')}
        </Button>
      </div>
    </section>
  );
}
