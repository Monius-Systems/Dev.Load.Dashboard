'use client';

import type { ReactNode } from 'react';

// The two shapes a turn takes on screen: what you asked, and what came back.
//
// The Operator's reply is text and nothing else — never markup from the
// server, never a rendered document. What little structure an operational
// answer has is the structure of a list of findings, so the text is split on
// its own line breaks and a run of lines that begin with a bullet becomes a
// list. That is the whole of it: no markdown library, no links parsed out of
// prose, no HTML.

/** A line that is one of several, rather than a sentence of its own. */
const BULLET = /^\s*([-•✓✗])\s+/;

type Block = { kind: 'text'; text: string } | { kind: 'list'; items: string[] };

/** The paragraphs and lists a plain answer is made of, in the order written. */
export function blocksOf(text: string): Block[] {
  const blocks: Block[] = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const bullet = BULLET.exec(trimmed);
    if (bullet) {
      const item = trimmed.slice(bullet[0].length);
      const last = blocks.at(-1);
      if (last?.kind === 'list') last.items.push(item);
      else blocks.push({ kind: 'list', items: [item] });
      continue;
    }
    blocks.push({ kind: 'text', text: trimmed });
  }
  return blocks;
}

export function AnswerText({ text }: { text: string }) {
  const blocks = blocksOf(text);
  if (!blocks.length) return null;
  return (
    <div className="op-answer-text">
      {blocks.map((block, at) =>
        block.kind === 'list' ? (
          <ul key={at}>
            {block.items.map((item, item_at) => (
              <li key={item_at}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={at}>{block.text}</p>
        ),
      )}
    </div>
  );
}

/** What the person asked, set against the right the way a sent line reads. */
export function YouSaid({ text }: { text: string }) {
  return (
    <div className="op-you">
      <p>{text}</p>
    </div>
  );
}

/** The card an answer, a result or a confirmation sits in. */
export function OperatorCard({
  children,
  live = false,
  tone,
}: {
  children: ReactNode;
  /** Only the newest card announces itself; older ones have been read. */
  live?: boolean;
  tone?: 'warning';
}) {
  return (
    <div
      className="op-answer"
      data-tone={tone}
      aria-live={live ? 'polite' : undefined}
    >
      {children}
    </div>
  );
}
