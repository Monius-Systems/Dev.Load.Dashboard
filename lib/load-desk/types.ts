// Ticket fields mirror load_ticket_mvp/models.py so records stay compatible
// with the Python Load Desk ledger.
export const TEXT_FIELDS = [
  'plant_code',
  'plant_name',
  'plant_address',
  'ticket_number',
  'ticket_date',
  'time_in',
  'time_out',
  'customer_id',
  'customer_name',
  'order_number',
  'project_name',
  'project_address',
  'po_number',
  'product_code',
  'product_description',
  'other_charge',
  'dispatch_number',
  'delivery_status',
  'carrier_id',
  'carrier_name',
  'vehicle_id',
  'weighmaster',
  /** flat, hourly or per_ton (see RATE_TYPES); null means flat. */
  'rate_type',
  /** flat or percent (see FUEL_TYPES); null means flat. */
  'fuel_type',
] as const;

export const NUMBER_FIELDS = [
  'gross_lb',
  'tare_lb',
  'net_lb',
  'gross_tons',
  'tare_tons',
  'net_tons',
  'ordered_loads',
  'remaining_loads',
  'today_tons',
  'today_loads',
  'rate',
  'fuel_charge',
  /** Hours billed on an hourly rate. */
  'hours',
] as const;

export type TextField = (typeof TEXT_FIELDS)[number];
export type NumberField = (typeof NUMBER_FIELDS)[number];

export type Ticket = { [K in TextField]: string | null } & {
  [K in NumberField]: number | null;
};

export const isNumberField = (name: string): name is NumberField =>
  (NUMBER_FIELDS as readonly string[]).includes(name);

/**
 * How a ticket's rate is charged: once per load, per hour worked, or per net
 * ton hauled. Tickets saved before rate types existed are flat.
 */
export const RATE_TYPES = ['flat', 'hourly', 'per_ton'] as const;
export type RateType = (typeof RATE_TYPES)[number];

export const isRateType = (value: unknown): value is RateType =>
  (RATE_TYPES as readonly unknown[]).includes(value);

export const rateTypeOf = (ticket: Pick<Ticket, 'rate_type'>): RateType =>
  isRateType(ticket.rate_type) ? ticket.rate_type : 'flat';

/**
 * How a fuel charge is added: a flat dollar amount, or a percentage of the
 * rate amount. Fuel charges saved before fuel types existed are flat.
 */
export const FUEL_TYPES = ['flat', 'percent'] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export const isFuelType = (value: unknown): value is FuelType =>
  (FUEL_TYPES as readonly unknown[]).includes(value);

export const fuelTypeOf = (ticket: Pick<Ticket, 'fuel_type'>): FuelType =>
  isFuelType(ticket.fuel_type) ? ticket.fuel_type : 'flat';

export function emptyTicket(): Ticket {
  const ticket: Record<string, null> = {};
  for (const name of [...TEXT_FIELDS, ...NUMBER_FIELDS]) ticket[name] = null;
  return ticket as Ticket;
}

export type BillTo = {
  name: string;
  address_lines: [string, string];
  phone: string;
};

export type InvoiceDraft = {
  invoice_number: string;
  invoice_date: string;
  return_date: string;
  truck_number: string;
  bill_to: BillTo;
};

export type SourceKind = 'upload' | 'sample';

export type TicketSource = {
  file_name: string;
  sha256: string;
  page?: number;
  size: number;
  type: string;
  kind: SourceKind;
};

/** A ticket waiting for review in the current tab. */
export type QueueItem = {
  id: string;
  source: TicketSource;
  original: Blob;
  preview_url: string;
  /** A scan reopened from saved records loads after the ticket opens. */
  preview_status: 'ready' | 'loading' | 'missing';
  ocr_text: string;
  note: string;
  /**
   * The note says why the ticket came back empty, rather than how it was read.
   * A ticket from a supplier whose layout is not supported parses to nothing,
   * and saying so is the difference between a puzzle and an instruction.
   */
  note_problem?: boolean;
  ticket: Ticket;
  invoice: InvoiceDraft;
  saved_record_id: number | null;
  /** Customer profile matched from the ticket or chosen in review. */
  customer_profile_id: number | null;
  /** Truck profile chosen for the upload or in review. */
  truck_id: number | null;
  /** Tickets extracted together share one invoice. */
  batch_id: string;
  /** The editable fields as last saved, to spot unsaved changes; null until saved. */
  baseline: string | null;
  /** Reopened from saved records for editing, rather than uploaded in this tab. */
  from_saved: boolean;
};

/** A saved ticket, its invoice and a pointer to the stored original. */
export type SavedRecord = {
  id: number;
  saved_at: string;
  ticket: Ticket;
  invoice: InvoiceDraft;
  source: TicketSource;
  original_stored: boolean;
  ocr_text: string;
  /** Absent on tickets saved before customer profiles existed. */
  customer_profile_id?: number | null;
  /** Absent on tickets saved before truck profiles existed. */
  truck_id?: number | null;
  /** The upload whose tickets share this invoice number. */
  invoice_batch_id?: string;
  /** When the ticket or its invoice was last changed after saving. */
  edited_at?: string;
};
