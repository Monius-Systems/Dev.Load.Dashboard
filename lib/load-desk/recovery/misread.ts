// What a faded print does to a figure, and how far a misread is from the
// figure that printed. No imports: the resolver and the weight check both
// lean on this, and neither may lean on the other.

/**
 * The pairs of digits a faded or smudged print turns into one another: a 3
 * for a 5 with its top gone, a 1 for a 7, an 8 for a 0 or a 6 with a bar
 * lost, a 2 for a 7, a 9 for a 0.
 */
export const CONFUSABLE_DIGITS: Record<string, string> = {
  '3': '5', '5': '3',
  '1': '7', '7': '1',
  '0': '8', '8': '0',
  '6': '8',
  '2': '7',
  '9': '0',
};

const confusable = (a: string, b: string) =>
  CONFUSABLE_DIGITS[a] === b || CONFUSABLE_DIGITS[b] === a;

/**
 * Whether two strings of digits are the same figure but for one faded digit.
 * Both must be the same length; exactly one position differs, and by a pair
 * faded print confuses.
 */
export function oneDigitConfused(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let differ = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    differ += 1;
    if (!confusable(a[i], b[i])) return false;
  }
  return differ === 1;
}

/**
 * Whether a printed figure is one faded digit, one lost digit or one
 * imagined digit from a value: a 3 for a 5, a trailing 0 that faded out, a
 * speck read as a 1. Anything further apart is not a misread of the print
 * but a different figure. A figure not read at all is nothing to disagree.
 */
export function oneMisreadApart(read: number | null, value: number): boolean {
  if (read === null) return true;
  const a = String(read);
  const b = String(value);
  if (a === b) return false;
  if (a.length === b.length) return oneDigitConfused(a, b);
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  if (long.length !== short.length + 1) return false;
  for (let i = 0; i < long.length; i++) {
    if (long.slice(0, i) + long.slice(i + 1) === short) return true;
  }
  return false;
}
