/**
 * The ways one day gets printed on a delivery ticket, so a surviving corner
 * of a date can be held against each. Index 1 is the padded M/D/YYYY form.
 */
export function printedDays(iso: string): string[] {
  const [year, month, day] = iso.split('-');
  return [
    `${Number(month)}/${Number(day)}/${year}`,
    `${month}/${day}/${year}`,
    `${Number(month)}/${Number(day)}/${year.slice(2)}`,
    `${month}/${day}/${year.slice(2)}`,
    `${year}-${month}-${day}`,
  ];
}
