// Ticket-reading details that belong to the plant, not to any company here.
export const business = {
  origin_label: 'HEIDELBERG THORNTON IL',
} as const;

/**
 * The company name printed on invoices: the one saved on the Account page, or
 * empty until one is saved.
 *
 * There is deliberately no built-in company here. More than one company uses
 * this app, and a name baked into the build would be the wrong company's for
 * everybody else — printed on their invoices, in front of their customers. An
 * empty name shows as a prompt to fill it in, which is recoverable; another
 * company's name on an invoice is not.
 */
export const sellerName = (company: { name?: string } | null) =>
  company?.name?.trim() || '';

/** The company name for page text, without trailing punctuation ("INC,." → "INC"). */
export const sellerDisplayName = (company: { name?: string } | null) =>
  sellerName(company).replace(/[,.\s]+$/, '');

/**
 * The company name shown around the dashboard (sidebar, menus, Account): the
 * one saved on the Account page, or the workspace's configured name.
 */
export const workspaceCompanyName = (
  company: { display_name?: string } | null,
  fallback: string,
) => company?.display_name?.trim() || fallback;

const FILLER_WORDS = new Set(['of', 'the', 'and', 'inc', 'llc', 'co', 'corp', 'ltd']);

/**
 * Two letters for a company's icon: the first letters of its first two
 * significant words, so "R&K Hauling of Detroit" and "R & K Hauling" are
 * both "RK", not "RH".
 */
export function companyInitials(name: string): string {
  const words = name
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word && !FILLER_WORDS.has(word.toLowerCase()));
  return (
    words
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || '?'
  );
}

/**
 * The address printed under the company name on invoices: the one saved on the
 * Account page, or none until one is saved. No built-in address, for the same
 * reason as the name above.
 */
export function sellerAddressLines(
  company: { address_lines: readonly string[] } | null,
): string[] {
  return (company?.address_lines ?? []).map((line) => line.trim()).filter(Boolean);
}
