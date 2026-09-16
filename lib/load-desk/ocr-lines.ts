import type { Block } from 'tesseract.js';

/** Reassemble sparse OCR words into reading rows without losing boxed values. */
export function readingRows(blocks: Block[] | null): string {
  const words = (blocks ?? []).flatMap((b) =>
    b.paragraphs.flatMap((p) => p.lines.flatMap((l) => l.words)),
  );
  const rows: {
    y: number;
    top: number;
    bottom: number;
    height: number;
    words: typeof words;
  }[] = [];
  for (const word of words.sort((a, b) => a.bbox.y0 - b.bbox.y0)) {
    const y = (word.bbox.y0 + word.bbox.y1) / 2;
    const height = word.bbox.y1 - word.bbox.y0;
    const row = rows.find(
      (r) =>
        Math.abs(r.y - y) < Math.min(r.height, height) * 0.55 ||
        // Short marks such as "-" belong to the row they sit inside.
        (height < r.height * 0.4 && y > r.top && y < r.bottom),
    );
    if (row) row.words.push(word);
    else
      rows.push({
        y,
        top: word.bbox.y0,
        bottom: word.bbox.y1,
        height,
        words: [word],
      });
  }
  return rows
    .sort((a, b) => a.y - b.y)
    .map((r) =>
      r.words
        .sort((a, b) => a.bbox.x0 - b.bbox.x0)
        .map((w) => w.text)
        .join(' '),
    )
    .join('\n');
}
