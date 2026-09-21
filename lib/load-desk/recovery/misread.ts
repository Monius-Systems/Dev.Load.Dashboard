// What a faded print does to a figure, and how far a misread is from the
// figure that printed. No imports: the resolver and the weight check both
// lean on this, and neither may lean on the other.

/**
 * The digits a faded or smudged print turns into one another, in groups: any
 * two of a group are one misread apart. A 5 read as 8 or 3, a 1 as 7, a 0 as
 * 6, 8 or 9, a 4 as 9. The space in the first group is only so it reads as
 * one line; it matches no digit.
 */
export const CONFUSABLE_GROUPS: readonly string[] = [
  // Loops and their broken forms: a 5 with a closed top is an 8, a 3 is a 5
  // with its spine gone, a 6 or a 9 with a bar lost is a 0 or an 8.
  '03568 9',
  '17',
  '27',
  '49',
];

const confusable = (a: string, b: string) =>
  CONFUSABLE_GROUPS.some((group) => group.includes(a) && group.includes(b));

/**
 * Whether two strings of digits are the same figure but for one faded digit.
 * Both must be the same length; exactly one position differs, and by a pair
 * faded print confuses.
 */
export function oneDigitConfused(a: string, b: string, faded = false): boolean {
  if (a.length !== b.length) return false;
  let differ = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    differ += 1;
    // Print the reader itself called faded can turn a digit into anything —
    // the same faded 5 has been read as 3, 1 and 8 — so any one digit may be
    // the misread. Clear print only misreads along the shapes.
    if (!faded && !confusable(a[i], b[i])) return false;
  }
  return differ === 1;
}

/**
 * Whether a printed figure is one faded digit, one lost digit or one
 * imagined digit from a value: a 3 for a 5, a trailing 0 that faded out, a
 * speck read as a 1. Anything further apart is not a misread of the print
 * but a different figure. A figure not read at all is nothing to disagree.
 */
export function oneMisreadApart(read: number | null, value: number, faded = false): boolean {
  if (read === null) return true;
  const a = String(read);
  const b = String(value);
  if (a === b) return false;
  if (a.length === b.length) return oneDigitConfused(a, b, faded);
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  if (long.length !== short.length + 1) return false;
  for (let i = 0; i < long.length; i++) {
    if (long.slice(0, i) + long.slice(i + 1) === short) return true;
  }
  return false;
}
