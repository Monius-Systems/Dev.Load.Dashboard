// A number as it is printed on a ticket, read as the number it is.
//
// A weight does not print as bare digits. On a Heidelberg ticket the line
// reads "27140 * 13.57 *": the pounds, a mark the scale prints beside them,
// the tons, another mark. The reader is asked for the ink exactly as printed,
// so that is what arrives, and a parser that accepts nothing but digits sent
// every tare weight on every ticket to review for confirmation with "27600 *"
// quoted back as unreadable — which no reviewer could do anything about,
// because the value was right there.
//
// So the marks a scale prints around a number are read past, and a number
// printed with its tons beside it is read as the pounds — but only when the
// tons agree with the pounds, because then the pair vouches for itself. A pair
// that disagrees is refused: one of the two figures is misread, and only the
// paper knows which.

/** A plain decimal, optionally negative. */
const DECIMAL = /^-?(\d+\.?\d*|\.\d+)$/;
/**
 * Pounds and the tons printed beside them, with the scale's marks around
 * each. Something has to stand between the two figures — a space or a mark —
 * or "22.31" would be read as 2 and 2.31.
 */
const POUNDS_AND_TONS = /^(-?\d+(?:\.\d+)?)(?:\s*[*#]+\s*|\s+)(\d+\.\d+)\s*[*#]*$/;
/** Half a hundredweight of slack, the app's tolerance for tons everywhere. */
const TON_TOLERANCE = 0.011;

/**
 * The number a piece of print carries, or null when it carries none the app
 * can be sure of. Commas, spaces, a currency sign and the marks a scale prints
 * are not value; a unit written after the figure is not value either.
 */
export function printedNumber(text: string | null | undefined): number | null {
  if (!text) return null;
  let cleaned = text.replace(/[,$]/g, '').trim();
  // The marks and the unit after the figure: "27600 *", "27600 lb", "27600 #".
  cleaned = cleaned.replace(/\s*(?:lbs?|tons?|tn|t|kgs?|#|\*)+\s*$/i, '').trim();
  // Two figures first, before any space is closed up: "27140 13.57" is the
  // pounds and the tons, not one number with a space in it. A figure printed
  // with a space for its thousands ("68 000") has no decimal second part and
  // falls through to be read as the one number it is.
  const pair = POUNDS_AND_TONS.exec(cleaned);
  if (pair) {
    const pounds = Number(pair[1]);
    const tons = Number(pair[2]);
    if (!Number.isFinite(pounds) || !Number.isFinite(tons)) return null;
    return Math.abs(pounds / 2000 - tons) <= TON_TOLERANCE ? pounds : null;
  }
  const digits = cleaned.replace(/\s/g, '');
  if (!DECIMAL.test(digits)) return null;
  const value = Number(digits);
  return Number.isFinite(value) ? value : null;
}
