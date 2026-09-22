'use client';

import { useState } from 'react';
import { CircleCheck, Search, TriangleAlert, Wrench } from 'lucide-react';
import { useT } from '@/lib/i18n/use-t';
import { toolLabel } from '@/lib/operator/tool-labels';
import type { ActivityItem } from '@/lib/operator/types';

// What the Operator actually looked at, under the answer it gave.
//
// An operational answer is only worth as much as the working behind it, so
// every tool call the run made is here: what was checked and what came back,
// one line each. It is folded away by default because the answer is the point
// and the working is the proof — but it is never left out, and a call that
// policy refused is in the list in the warning tone rather than quietly
// missing.
//
// No reasoning is shown here because none is kept: a run stores tool names,
// summaries and outcomes, and nothing else.

const ICONS = {
  read: Search,
  write: Wrench,
  confirm: CircleCheck,
  denied: TriangleAlert,
};

export default function ActivityTrail({ activity }: { activity: ActivityItem[] }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  if (!activity.length) return null;
  return (
    <div className="op-trail" data-open={open || undefined}>
      <button
        type="button"
        className="op-trail-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? t('Hide the checks') : t('{n} checks', { n: activity.length })}
      </button>
      {open ? (
        <ul className="op-trail-list">
          {activity.map((item, at) => {
            const Icon = ICONS[item.kind] ?? Search;
            return (
              <li
                key={`${item.at}-${item.tool}-${at}`}
                className="op-trail-row"
                data-kind={item.kind}
              >
                <Icon aria-hidden="true" />
                <span>
                  <strong>{t(toolLabel(item.tool))}</strong>
                  {item.summary ? <> — {item.summary}</> : null}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
