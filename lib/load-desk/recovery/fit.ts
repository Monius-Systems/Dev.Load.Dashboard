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

/**
 * Whether a printed job site is a saved one, read leniently: the fragment
 * fits it as print; or the saved site is in the print (the reader ran the
 * job line and the site line together, "20430 BURNHAM--LYNWOOD 20430
 * BURNHAM LYNWOOD,IL 60411 US"); or, punctuation and spaces aside, the
 * print is the saved site with characters dropped along it — "DGE ARYN
 * 46406 US" is "RIDGE GARY,IN 46406 US" with its left edge gone and two
 * letters lost, "1640 S HALSTED ST VERDALE" is "13640 S HALSTED ST
 * RIVERDALE" — as long as what printed is at least half of it and the ZIP,
 * where one printed, is the same; or the two are within two characters.
 * "ARKHAM, IL 60428" is not "100 Graham Rd, Graham, IL 60428" for sharing
 * a ZIP. A customer's saved sites are few, and the resolver still refuses
 * two that fit alike.
 */
export function siteFits(fragment: string, candidate: string, edge: ClippedEdge | null): boolean {
  if (fragmentFits(fragment, candidate, edge)) return true;
  if (!fragment || !candidate) return false;
  if (fragment.length >= 8 && ` ${fragment} `.includes(` ${candidate} `)) return true;
  const squash = (text: string) => text.replace(/[^A-Z0-9]/g, '');
  const zip = (text: string) => /\b(\d{5})\b(?!.*\b\d{5}\b)/.exec(text)?.[1] ?? null;
  const a = squash(fragment);
  const b = squash(candidate);
  const printedZip = zip(fragment);
  if (
    a.length >= 8 &&
    a.length * 2 >= b.length &&
    (!printedZip || printedZip === zip(candidate)) &&
    subsequence(a, b)
  ) {
    return true;
  }
  return fragment.length >= 8 && editsApart(fragment, candidate, 2) <= 2;
}

/** Whether every character of `a` appears in `b`, in order. */
function subsequence(a: string, b: string): boolean {
  let at = 0;
  for (const char of a) {
    at = b.indexOf(char, at);
    if (at < 0) return false;
    at += 1;
  }
  return true;
}

/** Levenshtein distance, stopped once it passes `limit`. */
function editsApart(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
      best = Math.min(best, current[j]);
    }
    if (best > limit) return limit + 1;
    previous = current;
  }
  return previous[b.length];
}

