import type { ClippedEdge } from './contract.ts';

// Whether a piece of cut-off print could be part of a value on file.
//
// The first rule here was the obvious one — print cut off on the left has to
// be the tail of the value, print cut off on the right its head — and it was
// too literal for the paper. A ticket that lost its left edge reads
//
//     22 Western Ave
//     ARKHAM, IL 60428 US
//
// against a saved job site of "222 WESTERN AVE, MARKHAM, IL 60428": every
// line lost its first character or two, not just the first line, so the
// fragment is not the tail of anything, and the "US" the ticket prints after
// the ZIP is not on the saved address at all. So the comparison is made word
// by word instead. Cut off on the left, the words are lined up from the
// right, and each word of the print has to be the end of the word it lines
// up with — whole, or with its beginning missing. Cut off on the right, the
// mirror. That reads "22" as the end of "222" and "ARKHAM" as the end of
// "MARKHAM", and still refuses "ARKHAM" against "GRAHAM", because it is not
// the end of it.
//
// Both texts arrive already normalised (letters, digits and single spaces).

/** A trailing country the ticket prints and the saved address does not carry. */
const COUNTRY = new Set(['US', 'USA']);

const words = (text: string): string[] => {
  const list = text.split(' ').filter(Boolean);
  while (list.length && COUNTRY.has(list[list.length - 1])) list.pop();
  return list;
};

/**
 * Lined up from one end, every word of the print is the corresponding word
 * of the value, or the part of it that would survive the cut. The word at the
 * uncut end has to be whole: that end of the print was not lost.
 */
function alignedFrom(
  end: 'left' | 'right',
  print: string[],
  value: string[],
): boolean {
  if (!print.length || print.length > value.length) return false;
  const offset = value.length - print.length;
  for (let i = 0; i < print.length; i++) {
    const p = print[i];
    const v = end === 'left' ? value[offset + i] : value[i];
    if (p === v) continue;
    // The cut is on the left: a word may have lost its start. On the right:
    // its end. The word at the far end from the cut is never partial.
    const partialAllowed = end === 'left' ? i < print.length - 1 || print.length === 1 : i > 0 || print.length === 1;
    if (!partialAllowed) return false;
    if (end === 'left' ? !v.endsWith(p) : !v.startsWith(p)) return false;
  }
  return true;
}

/**
 * Whether `fragment` could be `candidate` with print cut off at `edge`.
 *
 * Top, bottom or an unnamed edge — torn, smudged, a hole — only asks that the
 * print's words appear in order somewhere in the value, the first and last
 * of them allowed to be partial.
 */
export function fragmentFits(
  fragment: string,
  candidate: string,
  edge: ClippedEdge | null,
): boolean {
  if (!fragment) return false;
  if (fragment === candidate) return true;
  const print = words(fragment);
  const value = words(candidate);
  if (!print.length || !value.length) return false;
  if (edge === 'left') return alignedFrom('left', print, value);
  if (edge === 'right') return alignedFrom('right', print, value);
  // Somewhere inside: try every placement, with both ends allowed partial.
  if (candidate.includes(fragment)) return true;
  for (let start = 0; start + print.length <= value.length; start++) {
    let ok = true;
    for (let i = 0; i < print.length && ok; i++) {
      const p = print[i];
      const v = value[start + i];
      if (p === v) continue;
      const first = i === 0;
      const last = i === print.length - 1;
      ok =
        (first && v.endsWith(p)) ||
        (last && v.startsWith(p)) ||
        (first && last && v.includes(p));
    }
    if (ok) return true;
  }
  return false;
}
