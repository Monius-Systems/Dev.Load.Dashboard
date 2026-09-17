import {
  isFuelType,
  isRateType,
  NUMBER_FIELDS,
  TEXT_FIELDS,
  type InvoiceDraft,
  type SavedRecord,
  type Ticket,
  type TicketSource,
} from './types.ts';
import type {
  ClientProfile,
  CompanyProfile,
  CustomerProfile,
  TruckProfile,
} from './profiles.ts';

// Validation for data the browser sends to the server. Everything is checked
// field by field and bounded, so stored rows always have the shape the app
// reads back. Pure functions, shared by API routes and tests.

export type NewRecord = Omit<SavedRecord, 'id'> & { invoice_batch_id: string };
export type NewCustomer = Omit<CustomerProfile, 'id'>;
export type NewTruck = Omit<TruckProfile, 'id'>;
export type NewCompany = Omit<CompanyProfile, 'id'>;
export type NewClient = Omit<ClientProfile, 'id'>;
export type ProfileKind = 'customer' | 'truck' | 'company' | 'client';

export const MAX_ORIGINAL_BYTES = 20 * 1024 * 1024;
export const SHA256 = /^[0-9a-f]{64}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

type Parsed<T> = { value: T } | { error: string };

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown, max: number) =>
  typeof value === 'string' && value.length <= max;
const nullableText = (value: unknown, max: number) =>
  value === null || text(value, max);
const amount = (value: unknown) =>
  value === null || (typeof value === 'number' && Number.isFinite(value));
const optionalId = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === 'number' && Number.isSafeInteger(value) && value > 0);
const dateOrEmpty = (value: unknown) =>
  typeof value === 'string' && (value === '' || ISO_DATE.test(value));

export function parseTicket(value: unknown): Ticket | null {
  if (!isObject(value)) return null;
  const ticket: Record<string, string | number | null> = {};
  for (const field of TEXT_FIELDS) {
    const field_value = value[field] ?? null;
    if (!nullableText(field_value, 500)) return null;
    ticket[field] = field_value as string | null;
  }
  for (const field of NUMBER_FIELDS) {
    const field_value = value[field] ?? null;
    if (!amount(field_value)) return null;
    ticket[field] = field_value as number | null;
  }
  if (ticket.rate_type !== null && !isRateType(ticket.rate_type)) return null;
  if (ticket.fuel_type !== null && !isFuelType(ticket.fuel_type)) return null;
  if (typeof ticket.hours === 'number' && ticket.hours < 0) return null;
  return ticket as Ticket;
}

export function parseInvoice(value: unknown): InvoiceDraft | null {
  if (!isObject(value) || !isObject(value.bill_to)) return null;
  const { bill_to: billTo } = value;
  const lines = billTo.address_lines;
  if (
    !text(value.invoice_number, 60) ||
    !(value.invoice_number as string).trim() ||
    !dateOrEmpty(value.invoice_date) ||
    !value.invoice_date ||
    !dateOrEmpty(value.return_date) ||
    !text(value.truck_number, 40) ||
    !text(billTo.name, 120) ||
    !Array.isArray(lines) ||
    lines.length !== 2 ||
    !lines.every((line) => text(line, 160)) ||
    !text(billTo.phone, 40)
  ) {
    return null;
  }
  return {
    invoice_number: (value.invoice_number as string).trim(),
    invoice_date: value.invoice_date as string,
    return_date: value.return_date as string,
    truck_number: value.truck_number as string,
    bill_to: {
      name: billTo.name as string,
      address_lines: [lines[0] as string, lines[1] as string],
      phone: billTo.phone as string,
    },
  };
}

export function parseSource(value: unknown): TicketSource | null {
  if (!isObject(value)) return null;
  const page = value.page;
  if (
    !text(value.file_name, 255) ||
    typeof value.sha256 !== 'string' ||
    !SHA256.test(value.sha256) ||
    !(page === undefined || (Number.isSafeInteger(page) && (page as number) >= 1 && (page as number) <= 500)) ||
    !(Number.isSafeInteger(value.size) && (value.size as number) >= 0 && (value.size as number) <= MAX_ORIGINAL_BYTES) ||
    !text(value.type, 100) ||
    (value.kind !== 'upload' && value.kind !== 'sample')
  ) {
    return null;
  }
  return {
    file_name: value.file_name as string,
    sha256: value.sha256,
    ...(page === undefined ? {} : { page: page as number }),
    size: value.size as number,
    type: value.type as string,
    kind: value.kind,
  };
}

/** A ticket to save: its fields, invoice, source file and profile links. */
export function parseNewRecord(value: unknown): Parsed<NewRecord> {
  if (!isObject(value)) return { error: 'Expected a ticket.' };
  const ticket = parseTicket(value.ticket);
  if (!ticket) return { error: 'The ticket fields are not valid.' };
  const invoice = parseInvoice(value.invoice);
  if (!invoice) return { error: 'The invoice details are not valid.' };
  const source = parseSource(value.source);
  if (!source) return { error: 'The source file details are not valid.' };
  if (
    !text(value.saved_at, 40) ||
    Number.isNaN(Date.parse(value.saved_at as string)) ||
    typeof value.original_stored !== 'boolean' ||
    !text(value.ocr_text, 200_000) ||
    !optionalId(value.customer_profile_id) ||
    !optionalId(value.truck_id) ||
    !text(value.invoice_batch_id, 64) ||
    !(value.invoice_batch_id as string) ||
    !(value.reviewed_at === undefined ||
      value.reviewed_at === null ||
      (text(value.reviewed_at, 40) && !Number.isNaN(Date.parse(value.reviewed_at as string))))
  ) {
    return { error: 'The ticket record is not valid.' };
  }
  return {
    value: {
      saved_at: value.saved_at as string,
      ticket,
      invoice,
      source,
      original_stored: value.original_stored,
      ocr_text: value.ocr_text as string,
      customer_profile_id: (value.customer_profile_id as number | null | undefined) ?? null,
      truck_id: (value.truck_id as number | null | undefined) ?? null,
      invoice_batch_id: value.invoice_batch_id as string,
      // Absent means nobody has checked it yet; see SavedRecord.reviewed_at.
      reviewed_at: (value.reviewed_at as string | null | undefined) ?? null,
    },
  };
}

/** Changes to a saved ticket: the fields a person can edit after saving. */
export type RecordEdit = {
  id: number;
  ticket: Ticket;
  invoice: InvoiceDraft;
  ocr_text: string;
  customer_profile_id: number | null;
  truck_id: number | null;
};

export const MAX_EDITS = 200;

/** Changes to one or more saved tickets, such as every ticket on an invoice. */
export function parseRecordEdits(value: unknown): Parsed<RecordEdit[]> {
  if (!Array.isArray(value) || !value.length || value.length > MAX_EDITS) {
    return { error: `Send between 1 and ${MAX_EDITS} ticket changes.` };
  }
  const edits: RecordEdit[] = [];
  const seen = new Set<number>();
  for (const item of value) {
    if (!isObject(item)) return { error: 'Expected ticket changes.' };
    const { id } = item;
    if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0 || seen.has(id)) {
      return { error: 'Each change needs a different saved ticket id.' };
    }
    seen.add(id);
    const ticket = parseTicket(item.ticket);
    if (!ticket) return { error: 'The ticket fields are not valid.' };
    const invoice = parseInvoice(item.invoice);
    if (!invoice) return { error: 'The invoice details are not valid.' };
    if (
      !text(item.ocr_text, 200_000) ||
      !optionalId(item.customer_profile_id) ||
      !optionalId(item.truck_id)
    ) {
      return { error: 'The ticket changes are not valid.' };
    }
    edits.push({
      id,
      ticket,
      invoice,
      ocr_text: item.ocr_text as string,
      customer_profile_id: (item.customer_profile_id as number | null | undefined) ?? null,
      truck_id: (item.truck_id as number | null | undefined) ?? null,
    });
  }
  return { value: edits };
}

/**
 * A saved ticket with changes applied. Its source file, upload, stored
 * original and first save time never change.
 */
export function applyRecordEdit<T extends Omit<SavedRecord, 'id'>>(
  record: T,
  edit: RecordEdit,
  editedAt: string,
): T {
  return {
    ...record,
    ticket: edit.ticket,
    invoice: edit.invoice,
    ocr_text: edit.ocr_text,
    customer_profile_id: edit.customer_profile_id,
    truck_id: edit.truck_id,
    edited_at: editedAt,
    // Saving the fields after looking at them is the review.
    reviewed_at: editedAt,
  };
}

const stringList = (value: unknown, maxItems: number, maxLength: number) =>
  Array.isArray(value) &&
  value.length <= maxItems &&
  value.every((item) => text(item, maxLength));

/** Stored addresses are single-spaced, and blank ones are dropped. */
const cleanAddresses = (value: unknown): string[] =>
  ((value as string[] | undefined) ?? [])
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

export function parseCustomer(value: unknown): Parsed<NewCustomer> {
  if (
    !isObject(value) ||
    !text(value.name, 120) ||
    !(value.name as string).trim() ||
    !stringList(value.ticket_customer_ids, 20, 60) ||
    !stringList(value.ticket_names, 20, 160) ||
    // Job-site addresses are optional: profiles saved before them have none.
    !(value.addresses === undefined || stringList(value.addresses, 40, 200)) ||
    !amount(value.flat_rate) ||
    !(value.rate_type === undefined || value.rate_type === null || isRateType(value.rate_type)) ||
    !(value.fuel_type === undefined || value.fuel_type === null || isFuelType(value.fuel_type)) ||
    !amount(value.fuel_charge) ||
    (typeof value.flat_rate === 'number' && value.flat_rate < 0) ||
    (typeof value.fuel_charge === 'number' && value.fuel_charge < 0) ||
    !text(value.notes, 2000) ||
    !text(value.created_at, 40)
  ) {
    return { error: 'The customer details are not valid.' };
  }
  return {
    value: {
      name: (value.name as string).trim(),
      ticket_customer_ids: value.ticket_customer_ids as string[],
      ticket_names: value.ticket_names as string[],
      addresses: cleanAddresses(value.addresses),
      flat_rate: value.flat_rate as number | null,
      rate_type: isRateType(value.rate_type) ? value.rate_type : 'flat',
      fuel_type: isFuelType(value.fuel_type) ? value.fuel_type : 'flat',
      fuel_charge: value.fuel_charge as number | null,
      notes: value.notes as string,
      created_at: value.created_at as string,
    },
  };
}

export function parseTruck(value: unknown): Parsed<NewTruck> {
  if (
    !isObject(value) ||
    !text(value.truck_number, 40) ||
    !(value.truck_number as string).trim() ||
    !text(value.nickname, 80) ||
    !text(value.driver, 80) ||
    !text(value.license_plate, 40) ||
    !text(value.notes, 2000) ||
    typeof value.active !== 'boolean' ||
    !text(value.created_at, 40)
  ) {
    return { error: 'The truck details are not valid.' };
  }
  return {
    value: {
      truck_number: (value.truck_number as string).trim(),
      nickname: value.nickname as string,
      driver: value.driver as string,
      license_plate: value.license_plate as string,
      notes: value.notes as string,
      active: value.active,
      created_at: value.created_at as string,
    },
  };
}

/**
 * The company on invoices: its name and a street line (both required), and a
 * city, state and ZIP line.
 */
export function parseCompany(value: unknown): Parsed<NewCompany> {
  const lines = isObject(value) ? value.address_lines : undefined;
  if (
    !isObject(value) ||
    !text(value.name, 120) ||
    !Array.isArray(lines) ||
    lines.length !== 2 ||
    !lines.every((line) => text(line, 160)) ||
    !text(value.updated_at, 40) ||
    !(value.display_name === undefined || value.display_name === null || text(value.display_name, 120)) ||
    !(
      value.default_client_id === undefined ||
      value.default_client_id === null ||
      (typeof value.default_client_id === 'number' &&
        Number.isInteger(value.default_client_id) &&
        value.default_client_id > 0)
    )
  ) {
    return { error: 'The company name and address are not valid.' };
  }
  const oneLine = (line: unknown) => (line as string).replace(/\s+/g, ' ').trim();
  const name = oneLine(value.name);
  const [street, city] = lines.map(oneLine);
  const displayName = typeof value.display_name === 'string' ? oneLine(value.display_name) : '';
  if (!name) return { error: 'Enter the company name for invoices.' };
  if (!street) return { error: 'Enter the street address for invoices.' };
  return {
    value: {
      ...(displayName ? { display_name: displayName } : {}),
      ...(typeof value.default_client_id === 'number'
        ? { default_client_id: value.default_client_id }
        : {}),
      name,
      address_lines: [street, city],
      updated_at: value.updated_at as string,
    },
  };
}

/** A profile to add or replace: { kind, profile }, checked for its kind. */
export function parseProfileBody(
  body: Record<string, unknown>,
): Parsed<{
  kind: ProfileKind;
  profile: NewCustomer | NewTruck | NewCompany | NewClient;
}> {
  const { kind } = body;
  if (kind !== 'customer' && kind !== 'truck' && kind !== 'company' && kind !== 'client') {
    return { error: 'Choose customer, truck, company or client.' };
  }
  const parsed =
    kind === 'customer'
      ? parseCustomer(body.profile)
      : kind === 'truck'
        ? parseTruck(body.profile)
        : kind === 'company'
          ? parseCompany(body.profile)
          : parseClient(body.profile);
  return 'error' in parsed ? parsed : { value: { kind, profile: parsed.value } };
}

/** A client billed on invoices: a name (required), two address lines and a phone. */
export function parseClient(value: unknown): Parsed<NewClient> {
  const lines = isObject(value) ? value.address_lines : undefined;
  if (
    !isObject(value) ||
    !text(value.name, 120) ||
    !Array.isArray(lines) ||
    lines.length !== 2 ||
    !lines.every((line) => text(line, 160)) ||
    !text(value.phone, 40) ||
    !text(value.notes, 2000) ||
    !text(value.created_at, 40)
  ) {
    return { error: 'The client details are not valid.' };
  }
  const oneLine = (line: unknown) => (line as string).replace(/\s+/g, ' ').trim();
  const name = oneLine(value.name);
  if (!name) return { error: 'Enter the client name.' };
  const [street, city] = lines.map(oneLine);
  return {
    value: {
      name,
      address_lines: [street, city],
      phone: oneLine(value.phone),
      notes: (value.notes as string).trim(),
      created_at: value.created_at as string,
    },
  };
}

/** Invoice numbers compare without case or surrounding spaces. */
export const invoiceKeyOf = (invoiceNumber: string) =>
  invoiceNumber.trim().toLowerCase();

/** A usable ticket date for the database column, or null. */
export const ticketDateColumn = (ticket: Ticket) =>
  ticket.ticket_date && ISO_DATE.test(ticket.ticket_date) &&
  !Number.isNaN(Date.parse(`${ticket.ticket_date}T00:00:00Z`))
    ? ticket.ticket_date
    : null;

/** Positive integer id from a route segment, or null. */
export function routeId(value: string): number | null {
  if (!/^\d{1,15}$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
