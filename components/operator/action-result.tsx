'use client';

import { useT } from '@/lib/i18n/use-t';
import { EntityChip } from '@/components/operator/entity-chips';
import type { ActionResult, EntityRef } from '@/lib/operator/types';

// What a write actually did, after it did it.
//
// Three lists rather than one sentence, because partial success is the common
// case and it must never be silent: what went through, what did not and why,
// and what was never attempted once something went wrong. Underneath is the
// verification — what the tool read back afterwards — since a service
// answering 200 is not evidence that anything changed.

const TONES: Record<string, 'good' | 'warning' | 'danger'> = {
  done: 'good',
  partial: 'warning',
  failed: 'danger',
  refused: 'danger',
};

const OUTCOMES: Record<string, string> = {
  done: 'Done',
  partial: 'Partly done',
  failed: 'Failed',
  refused: 'Refused',
};

function Group({ title, entities }: { title: string; entities: EntityRef[] }) {
  if (!entities.length) return null;
  return (
    <div className="op-result-group">
      <p className="ld-step">{title}</p>
      <div className="op-entities">
        {entities.map((entity) => (
          <EntityChip key={`${entity.type}:${entity.id}`} entity={entity} />
        ))}
      </div>
    </div>
  );
}

export default function ActionResultCard({ result }: { result: ActionResult }) {
  const { t } = useT();
  const succeeded = result.succeeded ?? [];
  const failed = result.failed ?? [];
  const notAttempted = result.not_attempted ?? [];
  const check = result.verification;
  const firstFailure = check?.failures?.[0] ?? null;
  return (
    <section className="op-result" data-outcome={result.outcome}>
      <header className="op-result-head">
        <span className="ld-chip" data-tone={TONES[result.outcome] ?? 'warning'}>
          {t(OUTCOMES[result.outcome] ?? result.outcome)}
        </span>
        {result.summary ? <p className="op-result-summary">{result.summary}</p> : null}
      </header>
      <Group title={t('Succeeded')} entities={succeeded} />
      {failed.length ? (
        <div className="op-result-group">
          <p className="ld-step">{t('Failed')}</p>
          <ul className="op-result-failed">
            {failed.map((item, at) => (
              <li key={`${item.entity?.id ?? at}`}>
                <span className="ui-literal">{item.entity?.label ?? ''}</span>
                {item.reason ? <> — {item.reason}</> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <Group title={t('Not attempted')} entities={notAttempted} />
      {check ? (
        <p className="op-result-verified">
          {firstFailure
            ? t('Verified {passed} of {checked} — {failure}', {
                passed: check.passed,
                checked: check.checked,
                failure: firstFailure,
              })
            : t('Verified {passed} of {checked}', {
                passed: check.passed,
                checked: check.checked,
              })}
        </p>
      ) : null}
    </section>
  );
}
