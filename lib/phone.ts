// Phone numbers are written one way everywhere here: XXX-XXX-XXXX. Tickets and
// invoices are read side by side, and a column where one number is (708)
// 555-0100 and the next is 7085550100 is slower to scan than it looks.

/** The shape shown in an empty phone field. */
export const PHONE_MASK = 'XXX-XXX-XXXX';

const digitsOf = (value: string) => value.replace(/\D/g, '');

/**
 * The ten digits of a number, or null when it is not ten digits long.
 * A leading 1 is the country code and is not part of the number.
 */
function tenDigits(value: string): string | null {
  let digits = digitsOf(value);
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  return digits.length === 10 ? digits : null;
}

/**
 * Formats what someone is typing, as they type it. Anything that is not a
 * digit is dropped, dashes appear once there are digits to separate, and the
 * eleventh digit is refused rather than silently changing the number.
 */
export function phoneInput(value: string): string {
  let digits = digitsOf(value);
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Formats a change to a phone field, given what the box held before.
 *
 * Backspace onto a dash is the case worth handling: the dash is deleted, the
 * formatter puts it straight back, and the field looks frozen — press it again
 * and a digit disappears from somewhere else. Here the digit before the dash
 * goes instead, which is what pressing backspace there means.
 */
export function phoneEdit(previous: string, next: string): string {
  if (next.length === previous.length - 1) {
    let cut = 0;
    while (cut < next.length && next[cut] === previous[cut]) cut += 1;
    // Everything after the cut still matches: exactly one character was removed.
    if (previous[cut] === '-' && next.slice(cut) === previous.slice(cut + 1)) {
      return phoneInput(next.slice(0, Math.max(0, cut - 1)) + next.slice(cut));
    }
  }
  return phoneInput(next);
}

/**
 * Formats a stored number for display. Anything that is not a plain ten-digit
 * number — an extension, a note, an overseas number — is left exactly as it
 * was entered rather than mangled into a shape it does not fit.
 */
export function phoneDisplay(value: string | null | undefined): string {
  if (!value) return '';
  const digits = tenDigits(value);
  if (!digits) return value.trim();
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}
