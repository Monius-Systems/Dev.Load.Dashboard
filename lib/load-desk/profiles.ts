import { sellerAddressLines, sellerName } from './business.ts';
import { apiJson, dataMode, type DataMode } from './data-mode.ts';
import { lineTotal } from './format.ts';
import type { BillTo, FuelType, RateType, SavedRecord, Ticket } from './types.ts';

// Customer and truck profiles. Signed-in members use the workspace database
// through /api/profiles; the unprotected local preview keeps them in this
// browser's localStorage.

export type CustomerProfile = {
  id: number;
  name: string;
  /** Customer numbers as printed on tickets, e.g. "60311596". */
  ticket_customer_ids: string[];
  /** Customer names as printed on tickets. The profile name also matches. */
  ticket_names: string[];
  /**
   * Job-site addresses this customer's loads go to, ready to pick in review.
   * Scanned tickets are often cut off or smudged down the left edge, where the
   * delivery address is printed; picking the address the customer is known to
   * haul to beats squinting at the scan or typing it out again. Profiles saved
   * before addresses existed have none.
   */
  addresses?: string[];
  /**
   * Default rate filled into matching tickets, charged as rate_type (per load,
   * hour or ton). Null means the rate is entered per ticket. The name predates
   * rate types and is kept so saved profiles still read.
   */
  flat_rate: number | null;
  /** How flat_rate is charged. Profiles saved before rate types are flat. */
  rate_type?: RateType;
  fuel_charge: number | null;
  /** flat: fuel_charge dollars; percent: fuel_charge percent of the rate amount. */
  fuel_type?: FuelType;
  notes: string;
  created_at: string;
};

export type TruckProfile = {
  id: number;
  /** Printed as TRUCK # on invoices. */
  truck_number: string;
  nickname: string;
  driver: string;
  license_plate: string;
  notes: string;
  active: boolean;
  created_at: string;
};

/** The workspace's own details for invoices. One per workspace. */
export type CompanyProfile = {
  id: number;
  /** Printed at the top of every invoice. Older saved profiles may lack it. */
  name?: string;
  /** The company name shown around the dashboard (sidebar, menus); invoices use `name`. */
  display_name?: string;
  /** Street, then city, state and ZIP; printed under the company name. */
  address_lines: [string, string];
  /** The client new invoices start billed to, or nothing for no default. */
  default_client_id?: number | null;
  updated_at: string;
};

/** A company invoices are billed to, chosen as the bill-to in Load Desk. */
export type ClientProfile = {
  id: number;
  name: string;
  /** Street, then city, state and ZIP. */
  address_lines: [string, string];
  phone: string;
  notes: string;
  created_at: string;
};

export type Profiles = {
  customers: CustomerProfile[];
  trucks: TruckProfile[];
  clients: ClientProfile[];
  /** Null until an invoice address is saved; invoices then use the default. */
  company: CompanyProfile | null;
};

export type ProfilesSnapshot = Profiles & {
  error: string | null;
  ready: boolean;
  mode: DataMode | null;
};

const PROFILES_KEY = 'monius-demo.load-desk.profiles.v1';
const SERVER_SNAPSHOT: ProfilesSnapshot = {
  customers: [],
  trucks: [],
  clients: [],
  company: null,
  error: null,
  ready: false,
  mode: null,
};

let snapshot: ProfilesSnapshot = SERVER_SNAPSHOT;
let loading = false;
const listeners = new Set<() => void>();

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');
const isAmount = (value: unknown) =>
  value === null || (typeof value === 'number' && Number.isFinite(value));

function isCustomer(value: unknown): value is CustomerProfile {
  if (!value || typeof value !== 'object') return false;
  const customer = value as Partial<CustomerProfile>;
  return (
    typeof customer.id === 'number' &&
    typeof customer.name === 'string' &&
    isStringList(customer.ticket_customer_ids) &&
    isStringList(customer.ticket_names) &&
    (customer.addresses === undefined || isStringList(customer.addresses)) &&
    isAmount(customer.flat_rate) &&
    (customer.rate_type === undefined || typeof customer.rate_type === 'string') &&
    (customer.fuel_type === undefined || typeof customer.fuel_type === 'string') &&
    isAmount(customer.fuel_charge)
  );
}

function isTruck(value: unknown): value is TruckProfile {
  if (!value || typeof value !== 'object') return false;
  const truck = value as Partial<TruckProfile>;
  return (
    typeof truck.id === 'number' &&
    typeof truck.truck_number === 'string' &&
    typeof truck.active === 'boolean'
  );
}

function isCompany(value: unknown): value is CompanyProfile {
  if (!value || typeof value !== 'object') return false;
  const company = value as Partial<CompanyProfile>;
  return (
    typeof company.id === 'number' &&
    (company.name === undefined || typeof company.name === 'string') &&
    (company.display_name === undefined || typeof company.display_name === 'string') &&
    (company.default_client_id === undefined ||
      company.default_client_id === null ||
      typeof company.default_client_id === 'number') &&
    Array.isArray(company.address_lines) &&
    company.address_lines.length === 2 &&
    isStringList(company.address_lines)
  );
}

function isClient(value: unknown): value is ClientProfile {
  if (!value || typeof value !== 'object') return false;
  const client = value as Partial<ClientProfile>;
  return (
    typeof client.id === 'number' &&
    typeof client.name === 'string' &&
    Array.isArray(client.address_lines) &&
    client.address_lines.length === 2 &&
    isStringList(client.address_lines) &&
    typeof client.phone === 'string'
  );
}

const EMPTY_PROFILES: Profiles = { customers: [], trucks: [], clients: [], company: null };

function readProfiles(): Omit<ProfilesSnapshot, 'mode'> {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(PROFILES_KEY);
  } catch {
    return {
      ...EMPTY_PROFILES,
      error: 'Browser storage is unavailable, so profiles cannot be saved here.',
      ready: true,
    };
  }
  if (!raw) return { ...EMPTY_PROFILES, error: null, ready: true };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const { customers, trucks, clients, company } = parsed as Partial<Profiles>;
      if (
        Array.isArray(customers) &&
        customers.every(isCustomer) &&
        Array.isArray(trucks) &&
        trucks.every(isTruck) &&
        // Browsers that saved profiles before clients existed have none.
        (clients === undefined || (Array.isArray(clients) && clients.every(isClient))) &&
        (company === undefined || company === null || isCompany(company))
      ) {
        return {
          customers,
          trucks,
          clients: clients ?? [],
          company: company ?? null,
          error: null,
          ready: true,
        };
      }
    }
  } catch {
    // Reported below; stored data is never silently overwritten.
  }
  return {
    ...EMPTY_PROFILES,
    error:
      'Saved customer and truck profiles in this browser could not be read and were left untouched.',
    ready: true,
  };
}

function publish(next: ProfilesSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

async function loadProfiles() {
  const mode = await dataMode();
  if (mode === 'local') {
    publish({ ...readProfiles(), mode });
    return;
  }
  if (mode === 'unavailable') {
    publish({
      ...EMPTY_PROFILES,
      error: 'Your session has ended. Sign in again to see customers and trucks.',
      ready: true,
      mode,
    });
    return;
  }
  const result = await apiJson<Profiles>('/api/profiles');
  publish(
    result.ok
      ? {
          customers: result.data.customers,
          trucks: result.data.trucks,
          clients: result.data.clients ?? [],
          company: result.data.company ?? null,
          error: null,
          ready: true,
          mode,
        }
      : { ...EMPTY_PROFILES, error: result.error, ready: true, mode },
  );
}

export function subscribeProfiles(listener: () => void) {
  listeners.add(listener);
  if (!loading) {
    loading = true;
    void loadProfiles();
  }
  const onStorage = (event: StorageEvent) => {
    if (snapshot.mode !== 'local') return;
    if (event.key !== PROFILES_KEY && event.key !== null) return;
    publish({ ...readProfiles(), mode: 'local' });
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export const getProfilesSnapshot = () => snapshot;
export const getServerProfilesSnapshot = () => SERVER_SNAPSHOT;

function writeLocalProfiles(next: Profiles): string | null {
  try {
    window.localStorage.setItem(
      PROFILES_KEY,
      JSON.stringify({
        customers: next.customers,
        trucks: next.trucks,
        clients: next.clients,
        company: next.company,
      }),
    );
  } catch {
    return 'Could not write to browser storage. Nothing was changed.';
  }
  publish({ ...next, error: null, ready: true, mode: 'local' });
  return null;
}

type ProfileKind = 'customer' | 'truck' | 'client';
const LIST_KEYS = { customer: 'customers', truck: 'trucks', client: 'clients' } as const;

function withList(
  kind: ProfileKind,
  update: (list: { id: number }[]) => { id: number }[],
): Profiles {
  const key = LIST_KEYS[kind];
  return {
    customers: snapshot.customers,
    trucks: snapshot.trucks,
    clients: snapshot.clients,
    company: snapshot.company,
    [key]: update(snapshot[key]),
  } as Profiles;
}

/** Adds (id null) or replaces a profile. Returns an error message. */
export async function saveProfile(
  kind: 'customer',
  profile: Omit<CustomerProfile, 'id'>,
  id: number | null,
): Promise<string | null>;
export async function saveProfile(
  kind: 'truck',
  profile: Omit<TruckProfile, 'id'>,
  id: number | null,
): Promise<string | null>;
export async function saveProfile(
  kind: 'client',
  profile: Omit<ClientProfile, 'id'>,
  id: number | null,
): Promise<string | null>;
export async function saveProfile(
  kind: ProfileKind,
  profile:
    | Omit<CustomerProfile, 'id'>
    | Omit<TruckProfile, 'id'>
    | Omit<ClientProfile, 'id'>,
  id: number | null,
): Promise<string | null> {
  if (snapshot.mode === 'remote') {
    const body = JSON.stringify({ kind, profile });
    const result =
      id === null
        ? await apiJson<{ id: number }>('/api/profiles', { method: 'POST', body })
        : await apiJson<{ ok: true }>(`/api/profiles/${id}`, { method: 'PUT', body });
    if (!result.ok) return result.error;
    const savedId = id ?? (result.data as { id: number }).id;
    const item = { ...profile, id: savedId };
    const next = withList(kind, (list) =>
      id === null ? [...list, item] : list.map((entry) => (entry.id === id ? item : entry)),
    );
    publish({ ...snapshot, ...next });
    return null;
  }
  if (snapshot.mode !== 'local') return 'Your session has ended. Sign in again to save.';
  if (snapshot.error) return snapshot.error;
  return writeLocalProfiles(
    withList(kind, (list) => {
      const item = { ...profile, id: id ?? nextId(list) };
      return id === null
        ? [...list, item]
        : list.map((entry) => (entry.id === id ? item : entry));
    }),
  );
}

export async function deleteProfile(kind: ProfileKind, id: number): Promise<string | null> {
  const without = (list: { id: number }[]) => list.filter((entry) => entry.id !== id);
  if (snapshot.mode === 'remote') {
    const result = await apiJson<{ ok: true }>(`/api/profiles/${id}`, { method: 'DELETE' });
    if (!result.ok && result.status !== 404) return result.error;
    publish({ ...snapshot, ...withList(kind, without) });
    return null;
  }
  if (snapshot.mode !== 'local') return 'Your session has ended. Sign in again.';
  if (snapshot.error) return snapshot.error;
  return writeLocalProfiles(withList(kind, without));
}

/**
 * Saves the company name and address printed at the top of every invoice, for
 * everyone in the workspace. Returns an error message, or null when saved.
 */
export async function saveCompanyDetails(
  name: string,
  addressLines: [string, string],
): Promise<string | null> {
  const clean = (line: string) => line.replace(/\s+/g, ' ').trim();
  const current = snapshot.company;
  return writeCompany({
    ...(current?.display_name ? { display_name: current.display_name } : {}),
    ...(current?.default_client_id != null
      ? { default_client_id: current.default_client_id }
      : {}),
    name: clean(name),
    address_lines: [clean(addressLines[0]), clean(addressLines[1])],
    updated_at: new Date().toISOString(),
  });
}

/**
 * Sets the client new invoices start billed to, or clears it with null. The
 * invoice name and address are kept as they are.
 */
export async function saveDefaultClient(clientId: number | null): Promise<string | null> {
  const current = snapshot.company;
  const [street = '', city = ''] = sellerAddressLines(current);
  return writeCompany({
    ...(current?.display_name ? { display_name: current.display_name } : {}),
    ...(clientId === null ? {} : { default_client_id: clientId }),
    name: sellerName(current).trim(),
    address_lines: [street, city],
    updated_at: new Date().toISOString(),
  });
}

/** The client new invoices start billed to, when one is set and still exists. */
export const defaultClient = (
  clients: ClientProfile[],
  company: CompanyProfile | null,
): ClientProfile | null =>
  clients.find((client) => client.id === company?.default_client_id) ?? null;

/**
 * Saves the company name shown around the dashboard. The invoice name and
 * address are kept; until those are saved, their defaults are stored with it.
 */
export async function saveCompanyDisplayName(displayName: string): Promise<string | null> {
  const current = snapshot.company;
  const [street = '', city = ''] = sellerAddressLines(current);
  return writeCompany({
    display_name: displayName.replace(/\s+/g, ' ').trim(),
    ...(current?.default_client_id != null
      ? { default_client_id: current.default_client_id }
      : {}),
    name: sellerName(current).trim(),
    address_lines: [street, city],
    updated_at: new Date().toISOString(),
  });
}

async function writeCompany(profile: Omit<CompanyProfile, 'id'>): Promise<string | null> {
  const current = snapshot.company;
  if (snapshot.mode === 'remote') {
    const body = JSON.stringify({ kind: 'company', profile });
    const result = current
      ? await apiJson<{ ok: true }>(`/api/profiles/${current.id}`, { method: 'PUT', body })
      : await apiJson<{ id: number }>('/api/profiles', { method: 'POST', body });
    if (!result.ok) return result.error;
    const id = current?.id ?? (result.data as { id: number }).id;
    publish({ ...snapshot, company: { ...profile, id } });
    return null;
  }
  if (snapshot.mode !== 'local') return 'Your session has ended. Sign in again to save.';
  if (snapshot.error) return snapshot.error;
  return writeLocalProfiles({
    customers: snapshot.customers,
    trucks: snapshot.trucks,
    clients: snapshot.clients,
    company: { ...profile, id: current?.id ?? 1 },
  });
}

export const nextId = (items: { id: number }[]) =>
  items.reduce((max, item) => Math.max(max, item.id), 0) + 1;

/** "Witech Company, Inc." -> "WITECH COMPANY INC". */
export const normalizeName = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim();

/** Identifiers compare without spaces or punctuation: "ZF-0321" = "zf0321". */
export const normalizeKey = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, '');

const sameText = (a: string, b: string) =>
  a.replace(/\s+/g, ' ').trim().toLowerCase() ===
  b.replace(/\s+/g, ' ').trim().toLowerCase();

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
 * The customer's addresses with this one added, or the list unchanged when it
 * is blank or already there. Comparing with normalizeName means a comma or a
 * capital letter out of place is the same address, not a second copy of it.
 */
export function addCustomerAddress(
  customer: Pick<CustomerProfile, 'addresses'>,
  value: string,
): string[] {
  const address = normalizeAddress(value);
  const addresses = customerAddresses(customer);
  if (!address) return addresses;
  const key = normalizeName(address);
  return addresses.some((known) => normalizeName(known) === key)
    ? addresses
    : [...addresses, address];
}

/**
 * The client whose name, address and phone are exactly this bill-to (ignoring
 * case and spacing), or null when the bill-to was typed or edited by hand.
 */
export function clientForBillTo(
  clients: ClientProfile[],
  billTo: Pick<BillTo, 'name' | 'phone'> & { address_lines: readonly string[] },
): ClientProfile | null {
  return (
    clients.find(
      (client) =>
        sameText(client.name, billTo.name) &&
        sameText(client.address_lines[0], billTo.address_lines[0] ?? '') &&
        sameText(client.address_lines[1], billTo.address_lines[1] ?? '') &&
        sameText(client.phone, billTo.phone),
    ) ?? null
  );
}

export const truckLabel = (truck: TruckProfile) =>
  `#${truck.truck_number}${truck.nickname ? ` · ${truck.nickname}` : ''}`;

/**
 * Finds the customer for a ticket: first by customer number, then by the
 * longest profile or printed name contained in the ticket's customer name.
 */
/**
 * Letters a printed name may differ by and still count as the same customer.
 * Printers drop or double a character now and then ("WITECH COMPANY IN"), so
 * longer names get more room; short ones must be exact, since two letters is
 * most of the name.
 */
export function allowedMisprints(length: number): number {
  if (length < 6) return 0;
  if (length < 10) return 1;
  if (length <= 18) return 2;
  return 3;
}

/**
 * Levenshtein distance between two names, giving up once it passes `cap`
 * (the caller only cares whether the names are close, not how far apart).
 */
export function editDistance(a: string, b: string, cap: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let rowBest = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + cost);
      row.push(value);
      if (value < rowBest) rowBest = value;
    }
    if (rowBest > cap) return cap + 1;
    previous = row;
  }
  return previous[b.length];
}

/**
 * How a ticket lines up with a customer profile: by the customer number, by a
 * name the profile knows, or by a printed name that is a letter or two off.
 */
export type CustomerMatch = {
  customer: CustomerProfile;
  how: 'id' | 'name' | 'near';
  /** For 'near': the profile spelling the printed name came closest to. */
  alias?: string;
};

/** The matching customer and how it was found; null when nothing matches. */
export function matchCustomerDetailed(
  customers: CustomerProfile[],
  ticket: Pick<Ticket, 'customer_id' | 'customer_name'>,
): CustomerMatch | null {
  const id = ticket.customer_id ? normalizeKey(ticket.customer_id) : '';
  if (id) {
    const byId = customers.find((customer) =>
      customer.ticket_customer_ids.some((value) => normalizeKey(value) === id),
    );
    if (byId) return { customer: byId, how: 'id' };
  }
  const name = ticket.customer_name ? normalizeName(ticket.customer_name) : '';
  if (!name) return null;

  // A name the profile already knows, printed somewhere in the ticket's name.
  let best: CustomerProfile | null = null;
  let bestLength = 0;
  for (const customer of customers) {
    for (const alias of [customer.name, ...customer.ticket_names]) {
      const normalized = normalizeName(alias);
      if (
        normalized &&
        ` ${name} `.includes(` ${normalized} `) &&
        normalized.length > bestLength
      ) {
        best = customer;
        bestLength = normalized.length;
      }
    }
  }
  if (best) return { customer: best, how: 'name' };

  // Otherwise the printer may have dropped or added a letter. Only one
  // customer may be close, so a misprint never picks between two of them.
  let near: { customer: CustomerProfile; alias: string; distance: number } | null = null;
  let ambiguous = false;
  for (const customer of customers) {
    for (const alias of [customer.name, ...customer.ticket_names]) {
      const normalized = normalizeName(alias);
      if (!normalized) continue;
      const cap = allowedMisprints(Math.max(normalized.length, name.length));
      if (cap === 0) continue;
      const distance = editDistance(name, normalized, cap);
      if (distance > cap) continue;
      if (!near || distance < near.distance) {
        near = { customer, alias, distance };
        ambiguous = false;
      } else if (near.customer.id !== customer.id && distance === near.distance) {
        ambiguous = true;
      }
    }
  }
  if (!near || ambiguous) return null;
  return { customer: near.customer, how: 'near', alias: near.alias };
}

export function matchCustomer(
  customers: CustomerProfile[],
  ticket: Pick<Ticket, 'customer_id' | 'customer_name'>,
): CustomerProfile | null {
  return matchCustomerDetailed(customers, ticket)?.customer ?? null;
}

export function matchTruck(
  trucks: TruckProfile[],
  truckNumber: string | null | undefined,
): TruckProfile | null {
  const key = truckNumber ? normalizeKey(truckNumber) : '';
  if (!key) return null;
  return trucks.find((truck) => normalizeKey(truck.truck_number) === key) ?? null;
}

/**
 * The customer a saved ticket counts under: the profile chosen when it was
 * saved, or, for older tickets or deleted profiles, today's best match.
 */
export function customerIdFor(
  record: Pick<SavedRecord, 'ticket' | 'customer_profile_id'>,
  customers: CustomerProfile[],
): number | null {
  const saved = record.customer_profile_id;
  if (saved != null && customers.some((customer) => customer.id === saved)) {
    return saved;
  }
  return matchCustomer(customers, record.ticket)?.id ?? null;
}

/**
 * The customer name for an invoice line: the customer profile's name, or the
 * name scanned off the ticket when no profile matches.
 */
export function customerNameFor(
  record: Pick<SavedRecord, 'ticket' | 'customer_profile_id'>,
  customers: CustomerProfile[],
): string {
  const id = customerIdFor(record, customers);
  return (
    customers.find((customer) => customer.id === id)?.name ??
    record.ticket.customer_name ??
    ''
  );
}

/** The truck a saved ticket counts under, falling back to its invoice truck #. */
export function truckIdFor(
  record: SavedRecord,
  trucks: TruckProfile[],
): number | null {
  const saved = record.truck_id;
  if (saved != null && trucks.some((truck) => truck.id === saved)) return saved;
  return matchTruck(trucks, record.invoice.truck_number)?.id ?? null;
}

export const PERIODS = [
  ['today', 'Today'],
  ['week', 'This week'],
  ['month', 'This month'],
  ['year', 'This year'],
  ['lifetime', 'Lifetime'],
] as const;

export type Period = (typeof PERIODS)[number][0];
export type LoadSummary = {
  periods: Record<Period, { loads: number; tons: number }>;
  /** Sum of invoice line totals (rate + fuel) for loads that have a rate. */
  billed: number;
  lastLoad: string | null;
};

const pad2 = (value: number) => String(value).padStart(2, '0');

export const localIso = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

/** A load counts on its ticket date, or the day it was saved without one. */
export function loadDate(record: SavedRecord): string {
  const date = record.ticket.ticket_date;
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return localIso(new Date(record.saved_at));
}

/** Loads and tons per period. Weeks start on Monday, in local time. */
export function summarize(records: SavedRecord[], now: Date): LoadSummary {
  const today = localIso(now);
  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ((now.getDay() + 6) % 7),
  );
  const weekStart = localIso(monday);
  const weekEnd = localIso(
    new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7),
  );
  const periods = Object.fromEntries(
    PERIODS.map(([key]) => [key, { loads: 0, tons: 0 }]),
  ) as LoadSummary['periods'];
  let billed = 0;
  let lastLoad: string | null = null;
  for (const record of records) {
    const date = loadDate(record);
    const tons = record.ticket.net_tons ?? (record.ticket.net_lb ?? 0) / 2000;
    const hits: Period[] = ['lifetime'];
    if (date.slice(0, 4) === today.slice(0, 4)) hits.push('year');
    if (date.slice(0, 7) === today.slice(0, 7)) hits.push('month');
    if (date >= weekStart && date < weekEnd) hits.push('week');
    if (date === today) hits.push('today');
    for (const period of hits) {
      periods[period].loads += 1;
      periods[period].tons += tons;
    }
    billed += lineTotal(record.ticket) ?? 0;
    if (!lastLoad || date > lastLoad) lastLoad = date;
  }
  return { periods, billed: Math.round(billed * 100) / 100, lastLoad };
}
