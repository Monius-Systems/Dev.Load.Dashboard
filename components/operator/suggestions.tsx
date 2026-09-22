'use client';

import { ArrowUpRight } from 'lucide-react';
import { useT } from '@/lib/i18n/use-t';
import { suggestionsFor } from '@/lib/operator/suggestions';
import type { PageContext } from '@/lib/operator/types';

// What the panel offers before anybody has typed.
//
// The questions come from the page underneath, so the first thing on screen is
// already about the work in front of the person rather than an invitation to
// think of something. Pressing one asks it; it is not a form to edit first.

export default function Suggestions({
  context,
  disabled,
  onAsk,
}: {
  context: PageContext | null;
  disabled: boolean;
  onAsk: (question: string) => void;
}) {
  const { t } = useT();
  const questions = suggestionsFor(context);
  return (
    <div className="op-empty">
      <p className="ld-step">{t('Where to start')}</p>
      <div className="op-suggestions">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            className="op-suggestion"
            disabled={disabled}
            onClick={() => onAsk(t(question))}
          >
            <span>{t(question)}</span>
            <ArrowUpRight aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
