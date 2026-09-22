import { sellerAddressLines, sellerName } from './business.ts';
import { watchForChanges } from './live.ts';
import { apiJson, dataMode, type DataMode } from './data-mode.ts';
import { lineTotal } from './format.ts';
import type { BillTo, SavedRecord, Ticket } from './types.ts';
import type { FuelType, RateType } from './types.ts';
import {
  customerAddresses,
  customerLocationRates,
  locationRateFor,
  normalizeAddress,
  normalizeName,
  rateFor,
  type LocationRate,
  type RateSet,
} from './customer-rates.ts';
import type { CustomerRateProfile, RateContact } from './rates.ts';

// The address and site-rate arithmetic lives in customer-rates.ts, which has no
// store in it, so the server's request parser can use it without bringing this
// module's browser-side store along. Re-exported here so callers have one place
// to look.
export {
  customerAddresses,
  customerLocationRates,
  locationRateFor,
  normalizeAddress,
  normalizeName,
  rateFor,
};
export type { LocationRate, RateSet };

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
   * Rates that apply at particular job sites, for a customer whose loads go to
   * several places at different prices. Each names one of `addresses`; a site
   * without one is charged at the customer's own rate below. Profiles saved
   * before site rates existed have none.
   */
  location_rates?: LocationRate[];
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
  /**
   * How the rate agent treats this customer: whether it asks them for rates at
   * all, the period it asks about, and the job names their tickets are known
   * by. Absent on customers the agent has never been set up for, who are
   * priced from the figures above as they always were.
   */
  rate_profile?: CustomerRateProfile;
  /** Who the agent writes to about rates. Absent means nobody has been named. */
  rate_contacts?: RateContact[];
  notes: string;
  created_at: string;
};

/**
 * What IFTA & Mileage needs to know about a truck: where its day starts and
 * ends, how far it goes on a gallon, and the size and weight the routing
 * provider keeps it off roads it may not use. US units, as they are typed;
 * lib/load-desk/mileage.ts converts them for the provider.
 */
export type TruckIfta = {
  /** The yard the day starts from and returns to; empty until entered. */
  yard_address: string;
  /** Average miles per gallon, for Estimated Fuel Used; null when unknown. */
  mpg: number | null;
  height_ft: number;
  width_ft: number;
  length_ft: number;
  gross_weight_lb: number;
  axle_weight_lb: number;
  axles: number;
  /** Routed as a commercial vehicle, which some roads do not allow. */
  commercial: boolean;
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
  /** Yard, MPG and routing dimensions; absent on trucks saved before IFTA. */
  ifta?: TruckIfta;
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
  /**
   * The truck a scan is put down to unless another is chosen on Load Desk:
   * the owner-driver's own truck, on a workspace with one. Nothing for no
   * default; a truck that has since been deleted or retired is ignored.
   */
  default_truck_id?: number | null;
  /**
   * The number the invoice series starts at — "1001", "INV-0100" — its
   * prefix and padding kept for every number after it. The ledger's
   * date-order pass numbers the oldest invoice with this and counts on.
   * Nothing means the series starts at the lowest number on file, or at 1.
   * Set under Account, or by typing a number onto an invoice in review.
   */
  invoice_start?: string | null;
  /**
   * The company logo shown in place of its initials, as the version name the
   * picture is stored under (see lib/server/logo-store.ts). Absent or null
   * means no logo has been uploaded and the initials stand.
   */
  logo_version?: string | null;
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
    (customer.location_rates === undefined ||
      (Array.isArray(customer.location_rates) &&
        customer.location_rates.every(
          (site) =>
            !!site &&
            typeof site === 'object' &&
            typeof site.address === 'string' &&
            isAmount(site.flat_rate) &&
            isAmount(site.fuel_charge),
        ))) &&
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
    (company.default_truck_id === undefined ||
      company.default_truck_id === null ||
      typeof company.default_truck_id === 'number') &&
    (company.invoice_start === undefined ||
      company.invoice_start === null ||
      typeof company.invoice_start === 'string') &&
    (company.logo_version === undefined ||
      company.logo_version === null ||
      typeof company.logo_version === 'string') &&
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

/** One catch-up at a time; a slow answer must not stack up behind itself. */
let reloading = false;
async function reloadProfiles() {
  if (reloading || snapshot.mode === 'local') return;
  reloading = true;
  try {
    await loadProfiles();
  } finally {
    reloading = false;
  }
}

export function subscribeProfiles(listener: () => void) {
  listeners.add(listener);
  if (!loading) {
    loading = true;
    void loadProfiles();
  }
  // A customer or truck added on one device reaches the others.
  const stopWatching = watchForChanges(() => void reloadProfiles());
  const onStorage = (event: StorageEvent) => {
    if (snapshot.mode !== 'local') return;
    if (event.key !== PROFILES_KEY && event.key !== null) return;
    publish({ ...readProfiles(), mode: 'local' });
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    stopWatching();
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
    ...(current?.default_truck_id != null
      ? { default_truck_id: current.default_truck_id }
      : {}),
    ...(current?.invoice_start ? { invoice_start: current.invoice_start } : {}),
    ...(current?.logo_version ? { logo_version: current.logo_version } : {}),
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
    ...(current?.default_truck_id != null
      ? { default_truck_id: current.default_truck_id }
      : {}),
    ...(current?.invoice_start ? { invoice_start: current.invoice_start } : {}),
    ...(current?.logo_version ? { logo_version: current.logo_version } : {}),
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
 * Sets the truck a scan is put down to unless another is chosen, or clears
 * it with null. Everything else on the company is kept as it is.
 */
export async function saveDefaultTruck(truckId: number | null): Promise<string | null> {
  const current = snapshot.company;
  const [street = '', city = ''] = sellerAddressLines(current);
  return writeCompany({
    ...(current?.display_name ? { display_name: current.display_name } : {}),
    ...(current?.default_client_id != null
      ? { default_client_id: current.default_client_id }
      : {}),
    ...(truckId === null ? {} : { default_truck_id: truckId }),
    ...(current?.invoice_start ? { invoice_start: current.invoice_start } : {}),
    ...(current?.logo_version ? { logo_version: current.logo_version } : {}),
    name: sellerName(current).trim(),
    address_lines: [street, city],
    updated_at: new Date().toISOString(),
  });
}

/**
 * Sets the number the invoice series starts at, or clears it with an empty
 * string. Everything else on the company is kept as it is.
 */
export async function saveInvoiceStart(start: string): Promise<string | null> {
  const current = snapshot.company;
  const [street = '', city = ''] = sellerAddressLines(current);
  const clean = start.trim();
  return writeCompany({
    ...(current?.display_name ? { display_name: current.display_name } : {}),
    ...(current?.default_client_id != null
      ? { default_client_id: current.default_client_id }
      : {}),
    ...(current?.default_truck_id != null
      ? { default_truck_id: current.default_truck_id }
      : {}),
    ...(clean ? { invoice_start: clean } : {}),
    ...(current?.logo_version ? { logo_version: current.logo_version } : {}),
    name: sellerName(current).trim(),
    address_lines: [street, city],
    updated_at: new Date().toISOString(),
  });
}

/** The truck a scan is put down to by default, when one is set, still exists and is in service. */
export const defaultTruck = (
  trucks: TruckProfile[],
  company: CompanyProfile | null,
): TruckProfile | null =>
  trucks.find((truck) => truck.id === company?.default_truck_id && truck.active) ?? null;

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
    ...(current?.default_truck_id != null
      ? { default_truck_id: current.default_truck_id }
      : {}),
    ...(current?.invoice_start ? { invoice_start: current.invoice_start } : {}),
    ...(current?.logo_version ? { logo_version: current.logo_version } : {}),
    name: sellerName(current).trim(),
    address_lines: [street, city],
    updated_at: new Date().toISOString(),
  });
}

/**
 * Where the workspace's logo is served from, or null when it has none and its
 * initials stand instead. The address carries the version, so a new logo is a
 * new address and no browser shows the old one.
 */
export const companyLogoUrl = (company: CompanyProfile | null): string | null =>
  company?.logo_version ? `/api/workspace/logo?v=${company.logo_version}` : null;

/** Longest edge of a stored logo. Larger than any place it is shown. */
const MAX_LOGO_EDGE = 512;

/**
 * The picture at a size worth keeping, as a PNG.
 *
 * Not squared off the way a profile photo is: a logo is whatever shape it was
 * drawn, and cropping one to a circle takes the name off half of them. PNG
 * because a logo with a cut-out background should keep it — a JPEG would fill
 * it in white and it would sit on the page as a white tile.
 */
async function logoImage(file: File): Promise<Blob> {
  // Upright as the cropper showed it: a file can carry the way the camera was
  // held as a tag, which decoding the file again would otherwise ignore.
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, MAX_LOGO_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const surface = Object.assign(document.createElement('canvas'), { width, height });
  const context = surface.getContext('2d');
  if (!context) throw new Error('That image could not be read.');
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    surface.toBlob(resolve, 'image/png'),
  );
  if (!blob) throw new Error('That image could not be read.');
  return blob;
}

/**
 * Replaces the workspace's logo. Returns null when it saved, or the message to
 * show. Everyone signed in to the workspace sees it: it stands for the company,
 * not for the person who uploaded it.
 */
export async function saveCompanyLogo(file: File): Promise<string | null> {
  if (!file.type.startsWith('image/')) return 'Choose an image file (JPG, PNG or WebP).';
  if (file.size > 20_000_000) return 'Choose a logo under 20 MB.';
  if (snapshot.mode !== 'remote') {
    return 'Not available in the local preview, which saves in the browser.';
  }
  let logo: Blob;
  try {
    logo = await logoImage(file);
  } catch (error) {
    return error instanceof Error ? error.message : 'That image could not be read.';
  }
  const result = await apiJson<{ company: CompanyProfile }>('/api/workspace/logo', {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: logo,
  });
  if (!result.ok) return result.error;
  publish({ ...snapshot, company: result.data.company });
  return null;
}

/** Removes the workspace's logo; its initials show again. */
export async function removeCompanyLogo(): Promise<string | null> {
  if (snapshot.mode !== 'remote') {
    return 'Not available in the local preview, which saves in the browser.';
  }
  const result = await apiJson<{ company: CompanyProfile }>('/api/workspace/logo', {
    method: 'DELETE',
  });
  if (!result.ok) return result.error;
  publish({ ...snapshot, company: result.data.company });
  return null;
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

/** Identifiers compare without spaces or punctuation: "ZF-0321" = "zf0321". */
export const normalizeKey = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, '');

const sameText = (a: string, b: string) =>
  a.replace(/\s+/g, ' ').trim().toLowerCase() ===
  b.replace(/\s+/g, ' ').trim().toLowerCase();

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

/**
 * The pairs OCR trades for one another: a shape it cannot tell apart is read as
 * whichever the language model liked better. Folding both sides to one letter
 * makes "ZFO32I" and "ZF0321" the same key.
 */
const OCR_SHAPES: Record<string, string> = {
  O: '0', Q: '0', D: '0', I: '1', L: '1', S: '5', B: '8', Z: '2', G: '6', T: '7',
};

/** An identifier with the shapes OCR confuses folded together. */
export const ocrKey = (value: string) =>
  // normalizeKey has already reduced this to A-Z and 0-9.
  normalizeKey(value).replace(/[OQDILSBZGT]/g, (shape) => OCR_SHAPES[shape]);

/**
 * The truck a ticket was hauled by. An exact match on the printed vehicle
 * number first; failing that, one that differs only where OCR cannot tell two
 * shapes apart — a vehicle read as "ZFO32I" is truck ZF0321. That fallback is
 * only taken when it picks out a single truck, so two trucks a misread apart
 * are left to be chosen by hand rather than guessed between.
 */
export function matchTruck(
  trucks: TruckProfile[],
  truckNumber: string | null | undefined,
): TruckProfile | null {
  const key = truckNumber ? normalizeKey(truckNumber) : '';
  if (!key) return null;
  const exact = trucks.find((truck) => normalizeKey(truck.truck_number) === key);
  if (exact) return exact;
  const folded = ocrKey(key);
  const near = trucks.filter((truck) => ocrKey(truck.truck_number) === folded);
  return near.length === 1 ? near[0] : null;
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
