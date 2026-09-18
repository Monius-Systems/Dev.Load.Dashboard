// What a customer is charged at each of its job sites.
//
// Pure arithmetic over a customer profile, kept apart from profiles.ts because
// that module is the browser's profile store, and the server's request parser
// needs these sums without it.

import type { FuelType, RateType } from './types.ts';
import type { CustomerProfile } from './profiles.ts';

/** "Witech Company, Inc." -> "WITECH COMPANY INC": names compare without case, spacing or punctuation. */
export const normalizeName = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();

/** An address as it is stored: one line, single spaces, no trailing comma. */
export const normalizeAddress = (value: string) =>
  value.replace(/\s+/g, ' ').replace(/[\s,]+$/, '').trim();

/**
 * A customer's saved job-site addresses, cleaned and without repeats. Profiles
 * saved before addresses existed have none.
 */
export function customerAddresses(
  customer: Pick<CustomerProfile, 'addresses'> | null | undefined,
): string[] {
  const seen = new Set<string>();
  const addresses: string[] = [];
  for (const line of customer?.addresses ?? []) {
    const address = normalizeAddress(line);
    const key = normalizeName(address);
    if (!address || seen.has(key)) continue;
    seen.add(key);
    addresses.push(address);
  }
  return addresses;
}

/**
 * What a customer is charged at one of its job sites, where that differs from
 * its usual rate. Each figure left null falls back to the customer's own: a
 * site can have its own haul rate and share the customer's fuel charge.
 */
export type LocationRate = {
  /** One of the customer's `addresses`, as stored there. */
  address: string;
  flat_rate: number | null;
  rate_type?: RateType;
  fuel_charge: number | null;
  fuel_type?: FuelType;
};

/** The figures a ticket is rated with, wherever they came from. */
export type RateSet = {
  flat_rate: number | null;
  rate_type: RateType;
  fuel_charge: number | null;
  fuel_type: FuelType;
};

/**
 * The customer's site rates, cleaned: each names one of the customer's
 * addresses (compared the way addresses are, so a comma out of place is the
 * same site), one per site, and only where it actually says something — a site
 * with every figure blank is charged at the customer's rate anyway, and is not
 * kept. The address is stored as the customer's own spelling of it.
 */
export function customerLocationRates(
  customer: Pick<CustomerProfile, 'addresses' | 'location_rates'> | null | undefined,
): LocationRate[] {
  const addresses = customerAddresses(customer);
  const seen = new Set<string>();
  const sites: LocationRate[] = [];
  for (const site of customer?.location_rates ?? []) {
    const key = normalizeName(normalizeAddress(site.address));
    const address = addresses.find((known) => normalizeName(known) === key);
    if (!address || seen.has(key)) continue;
    if (site.flat_rate === null && site.fuel_charge === null) continue;
    seen.add(key);
    sites.push({
      address,
      flat_rate: site.flat_rate,
      ...(site.flat_rate !== null ? { rate_type: site.rate_type ?? 'flat' } : {}),
      fuel_charge: site.fuel_charge,
      ...(site.fuel_charge !== null ? { fuel_type: site.fuel_type ?? 'flat' } : {}),
    });
  }
  return sites;
}

/** The site rate for this delivery address, or null when the site has none. */
export function locationRateFor(
  customer: Pick<CustomerProfile, 'addresses' | 'location_rates'> | null | undefined,
  address: string | null | undefined,
): LocationRate | null {
  const wanted = normalizeName(normalizeAddress(address ?? ''));
  if (!wanted) return null;
  return (
    customerLocationRates(customer).find(
      (site) => normalizeName(site.address) === wanted,
    ) ?? null
  );
}

/**
 * What a ticket delivered to `address` is charged: the site's rate where the
 * site has one, and the customer's otherwise — figure by figure, so a site
 * with its own haul rate still takes the customer's fuel charge.
 *
 * Some customers have their loads go to several places at different prices;
 * before this, one rate covered every site and the others were corrected by
 * hand on each ticket.
 */
export function rateFor(
  customer: Pick<
    CustomerProfile,
    'addresses' | 'location_rates' | 'flat_rate' | 'rate_type' | 'fuel_charge' | 'fuel_type'
  >,
  address: string | null | undefined,
): RateSet {
  const site = locationRateFor(customer, address);
  const rated = site && site.flat_rate !== null;
  const fuelled = site && site.fuel_charge !== null;
  return {
    flat_rate: rated ? site.flat_rate : customer.flat_rate,
    rate_type: rated ? (site.rate_type ?? 'flat') : (customer.rate_type ?? 'flat'),
    fuel_charge: fuelled ? site.fuel_charge : customer.fuel_charge,
    fuel_type: fuelled ? (site.fuel_type ?? 'flat') : (customer.fuel_type ?? 'flat'),
  };
}
