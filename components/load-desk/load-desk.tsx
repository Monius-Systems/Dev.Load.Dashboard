'use client';

import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type DragEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import Image from 'next/image';
import DocumentScanner from '@/components/scanner/document-scanner';
import { useIsPhone } from '@/hooks/use-phone';
import Link from 'next/link';
import {
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileSearch,
  FileText,
  FileUp,
  MapPin,
  Pencil,
  ReceiptText,
  Trash2,
  X,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lens } from '@/components/ui/lens';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { SelectField } from '@/components/ui/select-field';
import { toast } from '@/components/ui/toast';
import InvoiceDialog, {
  type InvoiceView,
} from '@/components/load-desk/invoice-dialog';
import TicketViewer from '@/components/load-desk/ticket-viewer';
import {
  formatFuel,
  formatRate,
  fileSize,
  FUEL_TYPE_LABELS,
  invoiceTons,
  ledgerCsv,
  lineBreakdown,
  lineTotal,
  money,
  pounds,
  RATE_TYPE_LABELS,
  RATE_UNITS,
  sha256Hex,
  todayIso,
} from '@/lib/load-desk/format';
import { extractPages, type ExtractedPage } from '@/lib/load-desk/extract';
import {
  ticketFromExtraction,
  weightDisagreement,
} from '@/lib/load-desk/ticket-extraction';
import { batchPercent } from '@/lib/load-desk/extract-progress';
import { parseTicket } from '@/lib/load-desk/parser';
import { fillFromSameOrder } from '@/lib/load-desk/same-order';
import {
  addCustomerAddress,
  clientForBillTo,
  customerAddresses,
  defaultClient,
  getProfilesSnapshot,
  getServerProfilesSnapshot,
  matchCustomer,
  matchCustomerDetailed,
  subscribeProfiles,
  normalizeAddress,
  normalizeName,
  saveProfile,
  truckLabel,
  type ClientProfile,
  type CustomerProfile,
  type TruckProfile,
} from '@/lib/load-desk/profiles';
import type { RecordEdit } from '@/lib/load-desk/record-input';
import {
  batchInvoiceFor,
  findInvoiceClash,
  needsReview,
  invoiceLines,
  batchesByRecency,
  groupByTicketDate,
  openingInvoiceNumber,
  joinsInvoiceFor,
  numbersForWaitingBatches,
  recordBatch,
} from '@/lib/load-desk/records';
import { SAMPLE_TICKET } from '@/lib/load-desk/samples';
import { PHONE_MASK, phoneDisplay, phoneEdit } from '@/lib/phone';
import {
  clearLocalRecords,
  deleteSavedRecord,
  getRecordsSnapshot,
  getServerRecordsSnapshot,
  loadStoredOriginal,
  openStoredOriginal,
  saveRecord,
  subscribeRecords,
  updateSavedRecords,
} from '@/lib/load-desk/storage';
import {
  emptyTicket,
  FUEL_TYPES,
  fuelTypeOf,
  isNumberField,
  RATE_TYPES,
  rateTypeOf,
  type BillTo,
  type InvoiceDraft,
  type NumberField,
  type QueueItem,
  type SavedRecord,
  type SourceKind,
  type TextField,
  type Ticket,
} from '@/lib/load-desk/types';
import { validateTicket, WEIGHT_TOLERANCE_LB } from '@/lib/load-desk/validate';
import {
  deskSnapshot,
  serverDeskSnapshot,
  setDeskField,
  subscribeDesk,
  type DeskSession,
} from '@/lib/load-desk/desk-session';
import type { Translator } from '@/lib/i18n/translate';
import { useT } from '@/lib/i18n/use-t';

const MAX_BYTES = 20 * 1024 * 1024;
const ACCEPTED_NAME = /\.(pdf|png|jpe?g|tiff?|webp|txt)$/i;
const ACCEPT_ATTRIBUTE = '.pdf,.png,.jpg,.jpeg,.tif,.tiff,.webp,.txt';

type Entry = { blob: Blob; name: string };
type FieldDef = {
  name: TextField | NumberField;
  label: string;
  span?: 2;
  type?: 'date' | 'time';
  step?: string;
  required?: boolean;
  /**
   * The run of fields this one opens, on a phone. A step of seven boxes reads
   * as a list to get to the end of; the same seven under two short headings
   * read as two things to check. Only the phone shows them — a wide screen has
   * the section headings and the room to lay the fields out in.
   */
  group?: string;
};

const TICKET_FIELDS: FieldDef[] = [
  { name: 'ticket_number', label: 'Ticket / BOL', required: true, group: 'Ticket' },
  { name: 'ticket_date', label: 'Date', type: 'date', required: true },
  { name: 'time_in', label: 'Time in', type: 'time' },
  { name: 'time_out', label: 'Time out', type: 'time' },
  { name: 'plant_code', label: 'Plant code', group: 'Plant' },
  { name: 'plant_name', label: 'Plant name', span: 2 },
  { name: 'dispatch_number', label: 'Dispatch' },
];
const JOB_FIELDS: FieldDef[] = [
  { name: 'customer_id', label: 'Customer ID', group: 'Customer' },
  { name: 'customer_name', label: 'Customer name', span: 2, required: true },
  { name: 'order_number', label: 'Order number' },
  { name: 'project_name', label: 'Project', span: 2, group: 'Job' },
  { name: 'project_address', label: 'Destination address', span: 2 },
  { name: 'po_number', label: 'PO' },
  { name: 'product_code', label: 'Product code', group: 'Material' },
  { name: 'product_description', label: 'Product description', span: 2 },
];
const WEIGHT_FIELDS: FieldDef[] = [
  { name: 'gross_lb', label: 'Gross pounds' },
  { name: 'tare_lb', label: 'Tare pounds' },
  { name: 'net_lb', label: 'Net pounds', required: true },
  { name: 'net_tons', label: 'Net tons', step: '0.01' },
];
const HAULING_FIELDS: FieldDef[] = [
  { name: 'carrier_id', label: 'Carrier ID' },
  { name: 'carrier_name', label: 'Carrier name', span: 2 },
  { name: 'vehicle_id', label: 'Vehicle' },
];

/**
 * Pixels along the long edge, below which a ticket page cannot be read. A
 * letter page at 1600px is about 145 dots per inch, which puts a capital in
 * the 10pt field type around 12 pixels tall — Tesseract's floor, and that is
 * before the page is photographed at an angle. A copy shared through a chat
 * app or saved from a screenshot is routinely half of this.
 */
const MIN_READABLE_EDGE = 1600;

/** The long edge of an image blob, or null when the browser cannot decode it. */
async function imageEdge(blob: Blob): Promise<number | null> {
  if (typeof createImageBitmap !== 'function') return null;
  try {
    const bitmap = await createImageBitmap(blob);
    const edge = Math.max(bitmap.width, bitmap.height);
    bitmap.close();
    return edge;
  } catch {
    // PDFs and anything else the browser will not decode as an image.
    return null;
  }
}

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

/** The same file picked or dropped twice is only added once. */
const fileKey = (file: File) =>
  `${file.name}|${file.size}|${file.lastModified}`;

function guessType(name: string, type: string) {
  if (type) return type;
  if (/\.pdf$/i.test(name)) return 'application/pdf';
  if (/\.txt$/i.test(name)) return 'text/plain';
  if (/\.tiff?$/i.test(name)) return 'image/tiff';
  return 'application/octet-stream';
}

/**
 * Invoice details for a new upload. Its number is set when the upload is
 * queued, and its truck number comes from the chosen truck profile.
 */
/** Bill-to details of a client profile, as printed on an invoice. */
const clientBillTo = (client: ClientProfile): BillTo => ({
  name: client.name,
  address_lines: [client.address_lines[0], client.address_lines[1]],
  phone: client.phone,
});

/** Bill to client choices besides the client profiles themselves. */
const NO_CLIENT = '';
const NEW_CLIENT = '__new-client';
const NEW_CUSTOMER = '__new-customer';

type NewClientDraft = {
  name: string;
  phone: string;
  street: string;
  city: string;
  error: string | null;
  saving: boolean;
};

/** A customer being created from a scanned ticket, its name open to edit. */
type NewCustomerDraft = {
  /** The queue item it was opened for; the form shows only on that ticket. */
  itemId: string;
  name: string;
  error: string | null;
  saving: boolean;
};

/**
 * An invoice is dated by its ticket. Always: whatever date is read off the
 * ticket, or typed onto it afterwards, is the date of the invoice it goes on,
 * and there is no way to set one that differs. It is applied wherever an item
 * is built, filed or saved rather than trusted to the screen, because a ticket
 * is now filed into its batch the moment it is read — before anyone has looked
 * at it — and what was filed then carried the day it was photographed.
 *
 * The only invoice that is not dated this way is one whose ticket has no date
 * on it at all: there is nothing to go by, so the draft's own date stands until
 * the ticket's date is filled in, and filling it in moves the invoice.
 */
function invoiceDated(item: QueueItem): QueueItem {
  const date = item.ticket.ticket_date?.trim();
  if (!date || date === item.invoice.invoice_date) return item;
  return { ...item, invoice: { ...item.invoice, invoice_date: date } };
}

function defaultInvoice(): InvoiceDraft {
  return {
    invoice_number: '',
    invoice_date: todayIso(),
    return_date: '',
    truck_number: '',
    // Filled from the client chosen for the invoice.
    bill_to: { name: '', address_lines: ['', ''], phone: '' },
  };
}

type ProfileContext = {
  customers: CustomerProfile[];
  truck: TruckProfile | null;
};

/** Links a queue item to a customer profile and fills its rate and rate type. */
function applyCustomer(
  item: QueueItem,
  customer: CustomerProfile | null,
): QueueItem {
  if (!customer) return { ...item, customer_profile_id: null };
  return {
    ...item,
    customer_profile_id: customer.id,
    ticket: {
      ...item.ticket,
      rate: customer.flat_rate ?? item.ticket.rate,
      rate_type:
        customer.flat_rate !== null
          ? (customer.rate_type ?? 'flat')
          : item.ticket.rate_type,
      fuel_charge: customer.fuel_charge ?? item.ticket.fuel_charge,
      fuel_type:
        customer.fuel_charge !== null
          ? (customer.fuel_type ?? 'flat')
          : item.ticket.fuel_type,
    },
  };
}

/** Links a queue item to a truck profile; its number goes on the invoice. */
function applyTruck(item: QueueItem, truck: TruckProfile | null): QueueItem {
  return truck
    ? {
        ...item,
        truck_id: truck.id,
        invoice: { ...item.invoice, truck_number: truck.truck_number },
      }
    : { ...item, truck_id: null, invoice: { ...item.invoice, truck_number: '' } };
}

async function buildQueueItem(
  entry: Entry,
  kind: SourceKind,
  profiles: ProfileContext,
  extracted?: ExtractedPage & { total: number },
): Promise<QueueItem> {
  const type = guessType(entry.name, entry.blob.type);
  const sha256 = await sha256Hex(entry.blob);
  let ocrText = extracted?.text ?? '';
  let note =
    'Extracted locally. Review the fields against the original before saving.';
  if (!extracted && sha256 === SAMPLE_TICKET.sha256) {
    ocrText = SAMPLE_TICKET.ocrText;
    note =
      'Matched the supplied Heidelberg sample by SHA-256. This is its saved OCR text, scan errors included.';
  } else if (type === 'text/plain') {
    ocrText = await entry.blob.text();
    note = 'Parsed the ticket text in this file.';
  }
  let ticket = emptyTicket();
  let noteProblem = false;
  if (extracted?.extracted) {
    // Read by the model behind /api/extract: its thirteen fields become this
    // ticket directly. Everything it was not asked for stays blank and is
    // filled in during review, as an unreadable field always has been.
    ticket = ticketFromExtraction(extracted.extracted);
    note = 'Read from the ticket image. Check the fields against the original before saving.';
    const disagreement = weightDisagreement(extracted.extracted);
    if (disagreement) {
      note = disagreement;
      noteProblem = true;
    } else if (!ticket.ticket_number) {
      note = 'No ticket number could be read from this page. Check the original, or enter the fields by hand.';
      noteProblem = true;
    }
  } else if (ocrText) {
    const parsed = parseTicket(ocrText);
    ticket = parsed.ticket;
    if (parsed.error) { note = parsed.error; noteProblem = true; }
  } else if (extracted) {
    // The reader ran and came back with nothing at all: a blank page, a photo
    // too dark or blurred to make out, or a scan of a ticket face-down.
    note = 'Nothing could be read from this page. Check the original, or enter the fields by hand.';
    noteProblem = true;
  }
  // No ticket number means nothing useful was read. If the picture is simply
  // too small to have print in it, say so rather than leaving it a mystery:
  // it is the one cause the person holding the phone can do something about.
  if (!ticket.ticket_number && type !== 'text/plain') {
    const edge = await imageEdge(entry.blob);
    if (edge !== null && edge < MIN_READABLE_EDGE) {
      note = `This picture is only ${edge} pixels on its long edge, too small for the print on a ticket to be read. Photograph the ticket again with the phone, or upload the original file rather than a screenshot or a copy shared through a chat app.`;
      noteProblem = true;
    }
  }
  const item: QueueItem = {
    id: makeId(),
    source: {
      file_name:
        extracted && extracted.total > 1
          ? `${entry.name} · page ${extracted.page}`
          : entry.name,
      sha256,
      page: extracted?.page,
      size: entry.blob.size,
      type,
      kind,
    },
    original: entry.blob,
    preview_url:
      URL.createObjectURL(entry.blob) +
      (extracted ? `#page=${extracted.page}` : ''),
    ocr_text: ocrText,
    note,
    note_problem: noteProblem,
    ticket,
    invoice: defaultInvoice(),
    preview_status: 'ready',
    saved_record_id: null,
    customer_profile_id: null,
    truck_id: null,
    // Assigned when the whole upload has been extracted.
    batch_id: '',
    baseline: null,
    from_saved: false,
  };
  return invoiceDated(
    applyTruck(
      applyCustomer(item, matchCustomer(profiles.customers, ticket)),
      profiles.truck,
    ),
  );
}

/**
 * Keeps a ticket the moment it has been read, on the invoice for its own date.
 *
 * A driver photographs a ticket at the plant with one hand and closes the app;
 * nobody is entering rates on a weighbridge. Until now the ticket lived in the
 * tab and a reload threw it away. Now the picture and the fields are saved
 * straight into that date's batch, unreviewed, and whoever does the invoicing
 * picks the batch up later — on the phone, or on the desk.
 *
 * Returns the item as a saved one. If it cannot be filed — no signal in a yard,
 * a session that has ended — the item is handed back exactly as it was, so it
 * stays in the queue to be saved by hand rather than being lost.
 */
async function fileInBatch(
  original: QueueItem,
  records: SavedRecord[],
): Promise<{ item: QueueItem; error: string | null }> {
  const item = invoiceDated(original);
  const batch = batchInvoiceFor(records, item.ticket.ticket_date);
  const result = await saveRecord(
    {
      saved_at: new Date().toISOString(),
      ticket: item.ticket,
      invoice: { ...item.invoice, invoice_number: batch.invoice_number },
      source: item.source,
      ocr_text: item.ocr_text,
      customer_profile_id: item.customer_profile_id,
      truck_id: item.truck_id,
      invoice_batch_id: batch.batch_id,
      // Nobody has checked it yet; that is the whole point of filing it here.
      reviewed_at: null,
    },
    item.original,
  );
  if ('error' in result) return { item, error: result.error };
  const filed: QueueItem = {
    ...item,
    invoice: result.record.invoice,
    batch_id: batch.batch_id,
    saved_record_id: result.record.id,
    from_saved: true,
    baseline: null,
    note: 'Kept in this date’s batch. Check the fields against the picture when you invoice it.',
  };
  // What was filed is what is on the screen, so that is the mark to measure
  // later edits against. Without it nothing typed afterwards reads as a change
  // and the ticket sits on "Saved" with the button disabled, unsaveable.
  return { item: { ...filed, baseline: editKey(filed) }, error: null };
}

function nextUnsaved(queue: QueueItem[], from: number) {
  const later = queue.findIndex(
    (item, index) => index > from && item.saved_record_id === null,
  );
  return later >= 0
    ? later
    : queue.findIndex((item) => item.saved_record_id === null);
}

/** The fields a person edits, compared to spot unsaved changes. */
const editKey = (edit: Omit<RecordEdit, 'id'>) =>
  JSON.stringify([
    edit.ticket,
    edit.invoice,
    edit.ocr_text,
    edit.customer_profile_id,
    edit.truck_id,
  ]);

/** A saved ticket whose fields differ from what is saved. */
const hasChanges = (item: QueueItem) =>
  item.baseline !== null && editKey(item) !== item.baseline;

function editOf(source: QueueItem): RecordEdit {
  const item = invoiceDated(source);
  return {
    id: item.saved_record_id!,
    ticket: item.ticket,
    invoice: {
      ...item.invoice,
      invoice_number: item.invoice.invoice_number.trim(),
    },
    ocr_text: item.ocr_text,
    customer_profile_id: item.customer_profile_id,
    truck_id: item.truck_id,
  };
}

/** A saved ticket reopened for editing. Its stored scan loads separately. */
function itemFromRecord(record: SavedRecord, batchId: string): QueueItem {
  const savedOn = new Date(record.edited_at ?? record.saved_at).toLocaleDateString(
    'en-US',
  );
  const item: QueueItem = {
    id: makeId(),
    source: record.source,
    original: new Blob(),
    preview_url: '',
    preview_status: 'loading',
    ocr_text: record.ocr_text,
    note: `${record.edited_at ? 'Last edited' : 'Saved'} ${savedOn}. Change any field, then save the changes.`,
    ticket: record.ticket,
    invoice: record.invoice,
    saved_record_id: record.id,
    customer_profile_id: record.customer_profile_id ?? null,
    truck_id: record.truck_id ?? null,
    batch_id: batchId,
    baseline: null,
    from_saved: true,
  };
  // The baseline is what is stored, and the date is corrected after it: a
  // record filed before the rule was enforced opens with the ticket's date and
  // says so as an unsaved change, rather than keeping the wrong one quietly.
  return invoiceDated({ ...item, baseline: editKey(item) });
}

function weightCheck(ticket: Ticket, t: Translator['t']) {
  const { gross_lb, tare_lb, net_lb } = ticket;
  if (gross_lb === null || tare_lb === null || net_lb === null) {
    return {
      tone: 'neutral',
      text: t('Enter gross, tare and net pounds to check the balance.'),
    };
  }
  const difference = Math.abs(gross_lb - tare_lb - net_lb);
  return difference <= WEIGHT_TOLERANCE_LB
    ? {
        tone: 'good',
        text: t('Gross minus tare matches net within {difference} lb.', {
          difference: difference.toLocaleString('en-US'),
        }),
      }
    : {
        tone: 'bad',
        text: t('Gross minus tare is {weight} lb, {difference} lb off the net weight.', {
          weight: (gross_lb - tare_lb).toLocaleString('en-US'),
          difference: difference.toLocaleString('en-US'),
        }),
      };
}

function SourcePreview({ item }: { item: QueueItem }) {
  const { t } = useT();
  const { type, file_name } = item.source;
  if (type === 'text/plain') {
    return (
      <div className="ld-preview ld-preview-empty">
        {t('Text file. Its contents are under Ticket text.')}
      </div>
    );
  }
  if (item.preview_status === 'loading') {
    return (
      <div className="ld-preview ld-preview-empty">
        {t('Loading the stored original…')}
      </div>
    );
  }
  if (item.preview_status === 'missing') {
    return (
      <div className="ld-preview ld-preview-empty">
        {t('The original is not stored for this ticket.')}
      </div>
    );
  }
  if (type === 'application/pdf') {
    return (
      <div className="ld-preview">
        <iframe src={item.preview_url} title={t('Original: {name}', { name: file_name })} />
      </div>
    );
  }
  if (/^image\/(png|jpe?g|webp|gif)$/.test(type)) {
    return (
      <div className="ld-preview">
        <Image
          unoptimized
          src={item.preview_url}
          width={760}
          height={980}
          alt={t('Original ticket {name}', { name: file_name })}
        />
      </div>
    );
  }
  return (
    <div className="ld-preview ld-preview-empty">
      {t('This browser cannot preview {name}. It is still stored with the record.', {
        name: file_name,
      })}
    </div>
  );
}

export default function LoadDesk() {
  const { t, plural, date } = useT();
  const store = useSyncExternalStore(
    subscribeRecords,
    getRecordsSnapshot,
    getServerRecordsSnapshot,
  );
  const records = store.records;
  const profileStore = useSyncExternalStore(
    subscribeProfiles,
    getProfilesSnapshot,
    getServerProfilesSnapshot,
  );
  const { customers, trucks, clients } = profileStore;
  const fieldId = useId();
  // The queue, the files waiting and the extraction live outside React, so
  // opening another page and coming back does not throw the work away, and an
  // extraction started here keeps running while another page is open.
  const desk = useSyncExternalStore(subscribeDesk, deskSnapshot, serverDeskSnapshot);
  const {
    queue,
    activeIndex,
    pending,
    busy,
    uploadStatus,
    extraction,
    saveStatus,
    scannerOpen,
    editRequest,
    truckChoice,
    addingTo,
  } = desk;
  type Field<K extends keyof DeskSession> =
    | DeskSession[K]
    | ((current: DeskSession[K]) => DeskSession[K]);
  const setQueue = (value: Field<'queue'>) => setDeskField('queue', value);
  const setActiveIndex = (value: Field<'activeIndex'>) => setDeskField('activeIndex', value);
  const setPending = (value: Field<'pending'>) => setDeskField('pending', value);
  const setBusy = (value: Field<'busy'>) => setDeskField('busy', value);
  const setUploadStatus = (value: Field<'uploadStatus'>) => setDeskField('uploadStatus', value);
  const setExtraction = (value: Field<'extraction'>) => setDeskField('extraction', value);
  const setSaveStatus = (value: Field<'saveStatus'>) => setDeskField('saveStatus', value);
  const setTruckChoice = (value: Field<'truckChoice'>) => setDeskField('truckChoice', value);
  const setAddingTo = (value: Field<'addingTo'>) => setDeskField('addingTo', value);
  const [dragging, setDragging] = useState(false);
  // A client being created from the Bill to client menu.
  const [newClient, setNewClient] = useState<NewClientDraft | null>(null);
  // A customer being created from the Customer profile menu.
  const [newCustomer, setNewCustomer] = useState<NewCustomerDraft | null>(null);
  const newCustomerInput = useRef<HTMLInputElement>(null);
  // Saving a ticket's printed spelling onto the customer it belongs to.
  const [rememberBusy, setRememberBusy] = useState(false);
  // Saving the destination address onto the chosen customer's profile.
  const [addressBusy, setAddressBusy] = useState(false);
  const addFileInput = useRef<HTMLInputElement>(null);
  const [invoiceView, setInvoiceView] = useState<InvoiceView | null>(null);
  /** The photographed ticket, over the screen, while a field is being checked. */
  const [viewingTicket, setViewingTicket] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<SavedRecord | null>(
    null,
  );
  const fileInput = useRef<HTMLInputElement>(null);
  /**
   * The camera is the session's, not this page's: "Scan ticket" on the home
   * page opens it from there (lib/scanner/hand-off.ts), and this page is
   * mounted whether or not it is the one on the screen. Read the same way as
   * the rest of the session, so there is no effect to run and nothing to miss.
   */
  const setScannerOpen = (value: boolean) => setDeskField('scannerOpen', value);
  const closeScanner = () => setScannerOpen(false);
  const isPhone = useIsPhone();
  /**
   * Which part of the ticket a phone is being asked about. The four sections
   * of the review are one screen each there: a page of thirty boxes is a desk
   * job, and the person holding the phone is standing next to a truck.
   */
  const [step, setStep] = useState(0);
  // Opening a different ticket starts its review at the beginning. Adjusted
  // while rendering rather than in an effect, so the first paint of a new
  // ticket is already its first step instead of the last one of the ticket before.
  const [stepTicket, setStepTicket] = useState(activeIndex);
  if (stepTicket !== activeIndex) {
    setStepTicket(activeIndex);
    setStep(0);
  }
  const reviewPanel = useRef<HTMLElement>(null);

  const active = queue[activeIndex] ?? null;
  const ticket = active?.ticket ?? null;
  const issues = ticket ? validateTicket(ticket) : [];
  const activeSaved = active?.saved_record_id != null;
  /**
   * A ticket filed by "Review later" is saved before anyone has looked at it,
   * and saving it after looking is what marks it checked (see reviewed_at).
   * So it can be saved with nothing changed: otherwise a ticket whose fields
   * were all read correctly could never be taken off the batch's "to check".
   */
  const activeUnchecked =
    active?.saved_record_id != null &&
    (records.find((record) => record.id === active.saved_record_id)?.reviewed_at ??
      null) === null;
  const savedInQueue = queue.filter(
    (item) => item.saved_record_id !== null,
  ).length;
  const reviewCount = records.filter(
    (record) => validateTicket(record.ticket).length > 0,
  ).length;
  const netTons = records.reduce(
    (sum, record) => sum + (record.ticket.net_lb ?? 0) / 2000,
    0,
  );

  const updateActive = (update: (item: QueueItem) => QueueItem) =>
    setQueue((current) =>
      current.map((item, index) =>
        index === activeIndex ? update(item) : item,
      ),
    );

  const setField = (name: TextField | NumberField, raw: string) =>
    setQueue((current) => {
      const target = current[activeIndex];
      if (!target) return current;
      let value: string | number | null = raw === '' ? null : raw;
      if (value !== null && isNumberField(name)) {
        const parsed = Number(raw);
        value = Number.isFinite(parsed) ? parsed : null;
      }
      // The invoice is dated from its ticket, so correcting the ticket date
      // moves the invoice's — and every ticket on that invoice moves with it,
      // since they are one date's work.
      const moveInvoiceDate = name === 'ticket_date' && typeof value === 'string';
      return current.map((item, index) => {
        let next = item;
        if (index === activeIndex) {
          next = { ...next, ticket: { ...next.ticket, [name]: value } };
        }
        if (moveInvoiceDate && item.batch_id === target.batch_id) {
          next = { ...next, invoice: { ...next.invoice, invoice_date: value as string } };
        }
        return next;
      });
    });

  /** Invoice details are shared by every ticket from the same upload. */
  const updateBatch = (update: (item: QueueItem) => QueueItem) =>
    setQueue((current) => {
      const batch = current[activeIndex]?.batch_id;
      return current.map((item) =>
        item.batch_id === batch ? update(item) : item,
      );
    });

  /**
   * Invoice details are shared by every ticket from the same upload. The date
   * is not among them and cannot be passed here: it is the ticket's, and the
   * way to move it is to correct the date on the ticket. Spelled out in the
   * type so the compiler refuses any other way of setting it.
   */
  const setInvoice = (patch: Partial<Omit<InvoiceDraft, 'invoice_date'>>) =>
    updateBatch((item) => ({
      ...item,
      invoice: { ...item.invoice, ...patch },
    }));

  const setBillTo = (
    update: (billTo: InvoiceDraft['bill_to']) => InvoiceDraft['bill_to'],
  ) =>
    updateBatch((item) => ({
      ...item,
      invoice: { ...item.invoice, bill_to: update(item.invoice.bill_to) },
    }));

  /**
   * Adds picked or dropped files to the list waiting to be extracted, so
   * tickets can be added in several goes (even during an extraction) and
   * extracted together onto one invoice.
   */
  function chooseFiles(files: FileList | File[] | null) {
    const chosen = Array.from(files ?? []);
    // Reset so choosing the same file again still fires a change event.
    if (fileInput.current) fileInput.current.value = '';
    if (!chosen.length) return;
    setPending((current) => {
      const seen = new Set(current.map(fileKey));
      const added = chosen.filter((file) => {
        const key = fileKey(file);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return [...current, ...added];
    });
  }

  function removePending(key: string) {
    setPending((current) => current.filter((file) => fileKey(file) !== key));
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    chooseFiles(event.dataTransfer.files);
  }

  /**
   * The client a new upload starts billed to: the one chosen as the default,
   * else the client on the most recent queued or saved invoice.
   */
  const recentClientBillTo = (): BillTo | null => {
    const preferred = defaultClient(clients, profileStore.company);
    if (preferred) return clientBillTo(preferred);
    const billTos = [
      ...queue.map((item) => item.invoice.bill_to).reverse(),
      ...[...records].sort((a, b) => b.id - a.id).map((record) => record.invoice.bill_to),
    ];
    for (const billTo of billTos) {
      const client = clientForBillTo(clients, billTo);
      if (client) return clientBillTo(client);
    }
    return null;
  };

  /** Saved, then queued, invoice numbers, oldest first, for numbering the next invoice. */
  const invoiceNumbersInOrder = (items: QueueItem[]) => [
    ...[...records]
      .sort((a, b) => a.id - b.id)
      .map((record) => record.invoice.invoice_number),
    ...items.map((item) => item.invoice.invoice_number),
  ];

  /**
   * Gives uploads still waiting without an invoice number the next numbers in
   * the series, once there is a number to follow.
   *
   * In ticket-date order, not the order the files came out of the reader: a
   * morning's photographs can be taken in any order, and a run of invoices
   * whose numbers climb while their dates jump about is not a set of books
   * anyone wants to send. See `numbersForWaitingBatches`.
   */
  const numberWaitingBatches = (items: QueueItem[]) => {
    const waiting = items.filter(
      (item) => item.saved_record_id === null && !item.invoice.invoice_number.trim(),
    );
    const assigned = numbersForWaitingBatches(
      invoiceNumbersInOrder(items.filter((item) => item.invoice.invoice_number.trim())),
      waiting.map((item) => ({
        batchId: item.batch_id,
        ticketDate: item.ticket.ticket_date,
      })),
    );
    return items.map((item) => {
      if (item.saved_record_id !== null || item.invoice.invoice_number.trim()) {
        return item;
      }
      const number = assigned.get(item.batch_id);
      return number
        ? { ...item, invoice: { ...item.invoice, invoice_number: number } }
        : item;
    });
  };

  /**
   * Callers set busy first; this clears it. With a target, the tickets join
   * that ticket's invoice; otherwise each ticket date gets its own invoice.
   *
   * `open` is whether to put the first of them up for review when it is done.
   * Without it the tickets are read and filed exactly the same way, and simply
   * wait in their date's batch until someone asks for them — which is what
   * "Review later" on a phone does with a photo taken beside a truck.
   */
  async function addToQueue(
    entries: Entry[],
    kind: SourceKind,
    target: QueueItem | null = null,
    open = true,
  ) {
    const start = queue.length;
    const added: QueueItem[] = [];
    const failures: string[] = [];
    setUploadStatus(null);
    for (const [index, entry] of entries.entries()) {
      const show = (fraction: number, label: string) =>
        setExtraction({
          index,
          total: entries.length,
          file: entry.name,
          percent: batchPercent(index, entries.length, fraction),
          label,
          quiet: !open,
        });
      show(0, 'Starting');
      try {
        if (kind === 'upload') {
          if (!ACCEPTED_NAME.test(entry.name)) {
            throw new Error('use PDF, PNG, JPG, TIFF, WebP or text');
          }
          if (entry.blob.size === 0) throw new Error('the file is empty');
          if (entry.blob.size > MAX_BYTES) {
            throw new Error('the file is larger than 20 MB');
          }
        }
        if (kind === 'sample') {
          added.push(await buildQueueItem(entry, kind, profileContext));
        } else {
          const pages = await extractPages(
            entry.blob,
            guessType(entry.name, entry.blob.type),
            (update) => show(update.fraction, update.label),
          );
          for (const page of pages) {
            const built = await buildQueueItem(entry, kind, profileContext, {
              ...page,
              total: pages.length,
            });
            // Kept before anyone is asked to look at it.
            const filed = await fileInBatch(built, getRecordsSnapshot().records);
            if (filed.error) failures.push(`${entry.name}: ${t(filed.error)}`);
            added.push(filed.item);
          }
        }
      } catch (error) {
        failures.push(`${entry.name}: ${t(errorMessage(error))}`);
      }
    }
    setExtraction(null);
    setBusy(false);
    if (target) {
      const number = target.invoice.invoice_number.trim();
      toast.add({
        title: added.length
          ? number
            ? t('Added {tickets} to invoice {number}', {
                tickets: plural(added.length, 'ticket'),
                number,
              })
            : t('Added {tickets} to the invoice being reviewed', {
                tickets: plural(added.length, 'ticket'),
              })
          : t('No tickets were added'),
        description: [
          added.length ? t('Review and save each new ticket.') : '',
          ...failures,
        ]
          .filter(Boolean)
          .join(' · '),
        type: failures.length ? 'error' : 'success',
      });
    }
    if (!added.length) {
      if (!target) {
        setUploadStatus({
          message: [t('No tickets were added.'), ...failures].join(' · '),
          tone: failures.length ? 'error' : 'info',
        });
      }
      return;
    }
    // One job's scans often miss a field another page read: fill blanks from
    // tickets in this upload with the same order number.
    for (const [index, result] of fillFromSameOrder(
      added.map((item) => item.ticket),
    ).entries()) {
      if (!result.filled.length) continue;
      const item = added[index];
      const filled: QueueItem = {
        ...item,
        ticket: result.ticket,
        note: `${item.note} Filled the ${result.filled.join(', ')} from another ticket with order ${result.ticket.order_number}.`,
      };
      added[index] =
        item.customer_profile_id === null
          ? applyCustomer(filled, matchCustomer(profileContext.customers, result.ticket))
          : filled;
    }
    let grouped: QueueItem[];
    // Tickets added to an invoice join it only if they are that invoice's date.
    // An invoice is one date's work, and a ticket for another day goes to its
    // own date's invoice instead of being billed on somebody else's.
    const joining = target
      ? added.filter((item) =>
          joinsInvoiceFor(target.ticket.ticket_date, item.ticket.ticket_date),
        )
      : [];
    const elsewhere = target
      ? added.filter((item) => !joining.includes(item))
      : added;
    // Whatever did not join the target, and everything on an ordinary upload,
    // is filed by its own ticket date below.
    const onTarget =
      target && joining.length
        ? joining.map((item) => ({
            ...item,
            batch_id: target.batch_id,
            truck_id: target.truck_id,
            invoice: { ...target.invoice, bill_to: { ...target.invoice.bill_to } },
          }))
        : [];
    if (target && elsewhere.length) {
      failures.push(
        t('{count} for another date went to its own invoice, not {number}.', {
          count: plural(elsewhere.length, 'ticket'),
          number: target.invoice.invoice_number.trim() || t('this one'),
        }),
      );
    }
    {
      // One invoice per ticket date, dated that day, oldest first. Invoice
      // numbers continue in order after the latest saved or queued invoice, and
      // a workspace with none yet starts its series here.
      const numbers = invoiceNumbersInOrder(queue);
      const billTo = recentClientBillTo();
      // A ticket already filed on its own date's invoice keeps it: fileInBatch
      // put it there and saved it. Renumbering it here is what used to pull a
      // day's tickets onto another day's bill.
      const filed = elsewhere.filter((item) => item.saved_record_id !== null);
      const unfiled = elsewhere.filter((item) => item.saved_record_id === null);
      const groups = groupByTicketDate(unfiled, (item) => item.ticket.ticket_date);
      grouped = groups.flatMap((group) => {
        const batchId = makeId();
        const number = openingInvoiceNumber(numbers);
        numbers.push(number);
        return group.items.map((item) => ({
          ...item,
          batch_id: batchId,
          invoice: {
            ...item.invoice,
            invoice_number: number,
            invoice_date: group.date ?? item.invoice.invoice_date,
            bill_to: { ...(billTo ?? item.invoice.bill_to) },
          },
        }));
      });
      grouped = [...onTarget, ...filed, ...grouped];
      const invoices =
        new Set(
          grouped.map((item) => item.invoice.invoice_number.trim().toLowerCase()),
        ).size;
      const summary = !open
        ? t('{tickets} filed to check later. Open the batch below when you are ready.', {
            tickets: plural(added.length, 'ticket'),
          })
        : invoices > 1
          ? t('{tickets} ready for review on {invoices}, one per ticket date.', {
              tickets: plural(added.length, 'ticket'),
              invoices: plural(invoices, 'invoice'),
            })
          : t('{tickets} ready for review.', { tickets: plural(added.length, 'ticket') });
      setUploadStatus({
        message: [summary, ...failures].join(' · '),
        tone: failures.length ? 'error' : 'info',
      });
    }
    setQueue((current) => [...current, ...grouped]);
    setSaveStatus(null);
    // Filed either way — they are in their date's batch already, marked as
    // nobody having checked them. This is only whether to ask about them now.
    if (!open) return;
    setActiveIndex(start);
    scrollToReview();
  }

  /** Extracts more tickets onto the invoice under review, such as a saved one being edited. */
  async function addTicketsToInvoice(files: FileList | null) {
    const chosen = Array.from(files ?? []);
    // Reset so choosing the same file again still fires a change event.
    if (addFileInput.current) addFileInput.current.value = '';
    if (!active || busy || !chosen.length) return;
    setBusy(true);
    setAddingTo(active.batch_id);
    await addToQueue(
      chosen.map((file) => ({ blob: file, name: file.name })),
      'upload',
      active,
    );
    setAddingTo(null);
  }

  async function extractPending(open = true) {
    if (busy || !pending.length) return;
    setBusy(true);
    const entries = pending.map((file) => ({ blob: file, name: file.name }));
    setPending([]);
    if (fileInput.current) fileInput.current.value = '';
    await addToQueue(entries, 'upload', null, open);
  }

  function chooseCustomer(value: string) {
    if (value === NEW_CUSTOMER) {
      openNewCustomer();
      return;
    }
    setNewCustomer(null);
    const customer =
      customers.find((item) => String(item.id) === value) ?? null;
    updateActive((item) => applyCustomer(item, customer));
  }

  /**
   * Opens the new customer form with the name scanned off this ticket, or
   * chooses the customer's profile when it already has one.
   */
  function openNewCustomer() {
    if (!active) return;
    const scannedName = active.ticket.customer_name?.replace(/\s+/g, ' ').trim() ?? '';
    const scannedId = active.ticket.customer_id?.trim() ?? '';
    if (!scannedName && !scannedId) {
      toast.add({
        title: t('No customer on this scan'),
        description: t(
          'The ticket has no customer name or number. Enter them in Customer and Job first.',
        ),
        type: 'error',
      });
      return;
    }
    const existing =
      matchCustomer(customers, active.ticket) ??
      customers.find(
        (customer) => scannedName && normalizeName(customer.name) === normalizeName(scannedName),
      ) ??
      null;
    if (existing) {
      setNewCustomer(null);
      updateActive((item) => applyCustomer(item, existing));
      toast.add({
        title: t('{name} already has a customer profile', { name: existing.name }),
        description: t('It is now chosen for this ticket.'),
        type: 'success',
      });
      return;
    }
    setNewCustomer({
      itemId: active.id,
      name: scannedName || `Customer ${scannedId}`,
      error: null,
      saving: false,
    });
    requestAnimationFrame(() => newCustomerInput.current?.focus());
  }

  /**
   * Saves the new customer under the name in the form, with the customer
   * number scanned off this ticket, then links every open ticket it matches.
   */
  async function saveNewCustomer() {
    if (!active || !newCustomer || newCustomer.saving || newCustomer.itemId !== active.id) {
      return;
    }
    const name = newCustomer.name.replace(/\s+/g, ' ').trim();
    if (!name) {
      setNewCustomer({ ...newCustomer, error: t('Enter the customer name.') });
      return;
    }
    const clash = customers.find(
      (customer) => normalizeName(customer.name) === normalizeName(name),
    );
    if (clash) {
      setNewCustomer({
        ...newCustomer,
        error: t('{name} already has a customer profile. Choose it from the list.', {
          name: clash.name,
        }),
      });
      return;
    }
    const ticket = active.ticket;
    const scannedName = ticket.customer_name?.replace(/\s+/g, ' ').trim() ?? '';
    const scannedId = ticket.customer_id?.trim() ?? '';
    const profile = {
      name,
      ticket_customer_ids: scannedId ? [scannedId] : [],
      // A corrected name still matches tickets that print the scanned one.
      ticket_names:
        scannedName && normalizeName(scannedName) !== normalizeName(name)
          ? [scannedName]
          : [],
      // The destination this ticket was delivered to starts the customer's
      // address list, ready to pick on the next ticket whose address is cut
      // off in the scan.
      addresses: addCustomerAddress({}, ticket.project_address ?? ''),
      flat_rate: ticket.rate,
      rate_type: rateTypeOf(ticket),
      fuel_charge: ticket.fuel_charge,
      fuel_type: fuelTypeOf(ticket),
      notes: '',
      created_at: new Date().toISOString(),
    };
    setNewCustomer({ ...newCustomer, saving: true, error: null });
    const error = await saveProfile('customer', profile, null);
    if (error) {
      setNewCustomer((current) => current && { ...current, saving: false, error });
      return;
    }
    setNewCustomer(null);
    const created = getProfilesSnapshot().customers.find(
      (customer) =>
        customer.created_at === profile.created_at && customer.name === profile.name,
    );
    if (!created) return;
    // Other open tickets from the same customer use the new profile too.
    setQueue((current) =>
      current.map((item, index) =>
        index === activeIndex ||
        (!item.saved_record_id &&
          item.customer_profile_id === null &&
          matchCustomer([created], item.ticket))
          ? applyCustomer(item, created)
          : item,
      ),
    );
    toast.add({
      title: t('Added customer {name}', { name: created.name }),
      description: t('Made from the scanned ticket. Edit it any time on Customers & Clients.'),
      type: 'success',
    });
  }

  /**
   * Bills the invoice to a client profile (for every ticket on it), or opens
   * the new client form. A bill-to without a profile starts that form.
   */
  function chooseClient(value: string) {
    if (value === NEW_CLIENT) {
      const current = active?.invoice.bill_to;
      const unsaved =
        current && current.name.trim() && !clientForBillTo(clients, current) ? current : null;
      setNewClient({
        name: unsaved?.name ?? '',
        phone: unsaved?.phone ?? '',
        street: unsaved?.address_lines[0] ?? '',
        city: unsaved?.address_lines[1] ?? '',
        error: null,
        saving: false,
      });
      return;
    }
    setNewClient(null);
    const client = clients.find((item) => String(item.id) === value);
    if (client) setBillTo(() => clientBillTo(client));
  }

  /** Saves the new client as a profile and bills this invoice to it. */
  async function saveNewClient() {
    if (!newClient || newClient.saving) return;
    const name = newClient.name.replace(/\s+/g, ' ').trim();
    if (!name) {
      setNewClient({ ...newClient, error: t('Enter the client company name.') });
      return;
    }
    const existing = clients.find(
      (client) => normalizeName(client.name) === normalizeName(name),
    );
    if (existing) {
      setNewClient({
        ...newClient,
        error: t('{name} already has a client profile. Choose it from the list.', {
          name: existing.name,
        }),
      });
      return;
    }
    setNewClient({ ...newClient, saving: true, error: null });
    const profile = {
      name,
      address_lines: [newClient.street.trim(), newClient.city.trim()] as [string, string],
      phone: newClient.phone.trim(),
      notes: '',
      created_at: new Date().toISOString(),
    };
    const error = await saveProfile('client', profile, null);
    if (error) {
      setNewClient((current) => current && { ...current, saving: false, error });
      return;
    }
    setBillTo(() => ({
      name: profile.name,
      address_lines: profile.address_lines,
      phone: profile.phone,
    }));
    setNewClient(null);
    toast.add({
      title: t('Added client {name}', { name }),
      description: t('This invoice is billed to it, and it can be chosen on future invoices.'),
      type: 'success',
    });
  }

  function chooseTruck(value: string) {
    const truck = trucks.find((item) => String(item.id) === value) ?? null;
    updateBatch((item) => applyTruck(item, truck));
  }

  /** A saved invoice with every saved ticket that carries its number. */
  function savedInvoice(record: SavedRecord): InvoiceView {
    return {
      lines: invoiceLines(records, record.invoice.invoice_number),
      invoice: record.invoice,
    };
  }

  async function saveActive(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active || busy) return;
    if (activeSaved) {
      await saveChanges();
      return;
    }
    if (store.error) {
      setSaveStatus({ message: store.error, tone: 'error' });
      return;
    }
    if (!active.invoice.bill_to.name.trim()) {
      setSaveStatus({
        message: t('Choose the client this invoice is billed to, or create a new client.'),
        tone: 'error',
      });
      return;
    }
    const duplicate = records.find(
      (record) =>
        record.source.sha256 === active.source.sha256 &&
        (record.source.page ?? 1) === (active.source.page ?? 1),
    );
    if (duplicate) {
      updateActive((item) => ({ ...item, saved_record_id: duplicate.id }));
      setSaveStatus({
        message: t(
          'This file is already saved as record {id} (ticket {ticket}). Nothing was added.',
          { id: duplicate.id, ticket: duplicate.ticket.ticket_number ?? t('unnumbered') },
        ),
        tone: 'info',
      });
      return;
    }
    const invoiceNumber = active.invoice.invoice_number.trim();
    // recordBatch also covers tickets saved before uploads were recorded, so a
    // ticket added to one of their invoices is not refused.
    if (
      findInvoiceClash(records, [
        { id: null, invoiceNumber, batchId: active.batch_id },
      ])
    ) {
      setSaveStatus({
        message: t(
          'Invoice number {number} is already used by another upload. Choose another.',
          { number: invoiceNumber },
        ),
        tone: 'error',
      });
      return;
    }

    setBusy(true);
    // Saved tickets on this invoice with changes are saved first, so the
    // invoice details stay the same on every ticket.
    const changedSiblings = queue.filter(
      (item) => item.batch_id === active.batch_id && hasChanges(item),
    );
    if (changedSiblings.length) {
      const error = await persistChanges(changedSiblings);
      if (error) {
        setBusy(false);
        setSaveStatus({ message: error, tone: 'error' });
        return;
      }
    }
    const result = await saveRecord(
      {
        saved_at: new Date().toISOString(),
        ticket: active.ticket,
        invoice: { ...active.invoice, invoice_number: invoiceNumber },
        source: active.source,
        ocr_text: active.ocr_text,
        customer_profile_id: active.customer_profile_id,
        truck_id: active.truck_id,
        invoice_batch_id: active.batch_id,
      },
      active.original,
    );
    setBusy(false);
    if ('error' in result) {
      setSaveStatus({ message: result.error, tone: 'error' });
      return;
    }
    const { record } = result;
    const originalStored = record.original_stored;

    const label = record.ticket.ticket_number ?? active.source.file_name;
    const markSaved = (item: QueueItem): QueueItem => {
      const saved = {
        ...item,
        invoice: { ...item.invoice, invoice_number: invoiceNumber },
        saved_record_id: record.id,
      };
      return { ...saved, baseline: editKey(saved) };
    };
    const updated = queue.map((item, index) =>
      index === activeIndex ? markSaved(item) : item,
    );
    setQueue((current) =>
      current.map((item) => (item.id === active.id ? markSaved(item) : item)),
    );
    // A first invoice number sets the order for uploads still waiting for one.
    setQueue(numberWaitingBatches);
    const next = nextUnsaved(updated, activeIndex);
    if (next >= 0) {
      setActiveIndex(next);
      setSaveStatus({
        message: t('Saved {label}. Now reviewing ticket {next}.', { label, next: next + 1 }),
        tone: 'info',
      });
    } else {
      // Every ticket has been reviewed: the review block closes and the page is
      // ready for the next upload. The tickets are on Saved Tickets below.
      const reviewed = updated.length;
      clearQueue();
      setUploadStatus({
        message: t('Every ticket in the queue is saved ({tickets}).', {
          tickets: plural(reviewed, 'ticket'),
        }),
        tone: 'info',
      });
    }
    toast.add({
      title: t('Saved ticket {label}', { label }),
      description: [
        lineTotal(record.ticket) === null
          ? t('Invoice {number} is a draft until its rate is complete.', { number: invoiceNumber })
          : t('Invoice {number} created.', { number: invoiceNumber }),
        originalStored ? '' : t('The original could not be stored in this browser.'),
      ]
        .filter(Boolean)
        .join(' '),
      type: 'success',
    });
  }

  /**
   * Saves changes to saved tickets, then marks what was sent as saved. Edits
   * typed while it saves stay unsaved. Returns an error message, or null.
   */
  async function persistChanges(items: QueueItem[]): Promise<string | null> {
    const edits = items.map(editOf);
    const result = await updateSavedRecords(edits);
    if ('error' in result) return result.error;
    const sent = new Map(items.map((item, index) => [item.id, edits[index]]));
    setQueue((current) =>
      current.map((item) => {
        const edit = sent.get(item.id);
        if (!edit) return item;
        const number = edit.invoice.invoice_number;
        return {
          ...item,
          invoice:
            item.invoice.invoice_number.trim() === number
              ? { ...item.invoice, invoice_number: number }
              : item.invoice,
          baseline: editKey(edit),
        };
      }),
    );
    return null;
  }

  /** Saves the changes on this invoice's saved tickets together. */
  async function saveChanges() {
    if (!active) return;
    const changed = queue.filter(
      (item) => item.batch_id === active.batch_id && hasChanges(item),
    );
    // Nothing to correct on a ticket nobody has checked yet is still something
    // to save: saving it is the checking.
    const toSave =
      activeUnchecked && !changed.some((item) => item.id === active.id)
        ? [...changed, active]
        : changed;
    if (!toSave.length) return;
    const clash = findInvoiceClash(
      records,
      toSave.map((item) => ({
        id: item.saved_record_id,
        invoiceNumber: item.invoice.invoice_number,
        batchId: item.batch_id,
      })),
    );
    if (clash) {
      setSaveStatus({
        message: t(
          'Invoice number {number} is already used by another upload. Choose another.',
          { number: clash },
        ),
        tone: 'error',
      });
      return;
    }
    setBusy(true);
    const error = await persistChanges(toSave);
    setBusy(false);
    if (error) {
      setSaveStatus({ message: error, tone: 'error' });
      return;
    }
    const invoiceNumber = active.invoice.invoice_number.trim();
    const label = active.ticket.ticket_number ?? active.source.file_name;
    const message = !changed.length
      ? t('Checked. Nothing needed changing.')
      : toSave.length > 1
        ? t('Saved changes to {tickets} on invoice {number}.', {
            tickets: plural(toSave.length, 'ticket'),
            number: invoiceNumber,
          })
        : t('Changes saved.');
    // Nothing is left to review once every ticket is saved and unchanged.
    const allReviewed =
      queue.every((item) => item.saved_record_id !== null) &&
      queue.filter(hasChanges).length === changed.length;
    if (allReviewed) {
      clearQueue();
      setUploadStatus({ message, tone: 'info' });
    } else {
      setSaveStatus({ message, tone: 'info' });
    }
    toast.add({
      title:
        changed.length > 1
          ? t('Updated invoice {number}', { number: invoiceNumber })
          : t('Updated ticket {label}', { label }),
      description:
        changed.length > 1
          ? t('Saved with your changes: {tickets}.', {
              tickets: plural(changed.length, 'ticket'),
            })
          : t('Your changes are saved for everyone in your workspace.'),
      type: 'success',
    });
  }

  /**
   * Where a review starts from. On a phone that is the top of the page: the
   * band carries the ticket's own head now — which ticket, which step, the
   * checks, the way round the other tickets — so bringing the panel into view
   * would open the review with the first thing to read already above the
   * screen. On a desk the panel is still what to scroll to.
   */
  const scrollToReview = () =>
    requestAnimationFrame(() => {
      if (isPhone) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      reviewPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

  /** Reopens a saved ticket, with the other saved tickets on its invoice, to edit. */
  function editSaved(record: SavedRecord) {
    const open = queue.findIndex((item) => item.saved_record_id === record.id);
    if (open >= 0) {
      setActiveIndex(open);
      scrollToReview();
      return;
    }
    const batchId = recordBatch(record);
    const lines = invoiceLines(records, record.invoice.invoice_number).filter(
      (line) => !queue.some((item) => item.saved_record_id === line.id),
    );
    const added = lines.map((line) => itemFromRecord(line, batchId));
    setQueue((current) => [...current, ...added]);
    setActiveIndex(
      queue.length + Math.max(0, lines.findIndex((line) => line.id === record.id)),
    );
    setSaveStatus(null);
    scrollToReview();
    for (const [index, line] of lines.entries()) {
      const itemId = added[index].id;
      void loadStoredOriginal(line).then((blob) =>
        setQueue((current) =>
          current.map((item) => {
            if (item.id !== itemId) return item;
            if (!blob) return { ...item, preview_status: 'missing' };
            return {
              ...item,
              original: blob,
              preview_url:
                URL.createObjectURL(blob) +
                (line.source.page ? `#page=${line.source.page}` : ''),
              preview_status: 'ready',
            };
          }),
        ),
      );
    }
  }

  function clearQueue() {
    for (const item of queue)
      URL.revokeObjectURL(item.preview_url.split('#')[0]);
    setQueue([]);
    setActiveIndex(-1);
    setSaveStatus(null);
  }

  function downloadLedger() {
    const url = URL.createObjectURL(
      new Blob([ledgerCsv(records)], { type: 'text/csv;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'load_tickets.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function openOriginal(record: SavedRecord) {
    try {
      await openStoredOriginal(record);
    } catch (error) {
      toast.add({
        title: t('Original unavailable'),
        description: t(errorMessage(error)),
        type: 'error',
      });
    }
  }

  async function confirmDelete() {
    const record = recordToDelete;
    if (!record) return;
    const error = await deleteSavedRecord(records, record);
    if (error) {
      toast.add({ title: t('Delete failed'), description: t(error), type: 'error' });
      return;
    }
    setRecordToDelete(null);
    // A ticket reopened from saved records leaves the queue with its record;
    // one uploaded in this tab can be saved again.
    const reopened = (item: QueueItem) =>
      item.from_saved && item.saved_record_id === record.id;
    for (const item of queue) {
      if (reopened(item) && item.preview_url) {
        URL.revokeObjectURL(item.preview_url.split('#')[0]);
      }
    }
    const remaining = queue
      .filter((item) => !reopened(item))
      .map((item) =>
        item.saved_record_id === record.id
          ? { ...item, saved_record_id: null, baseline: null }
          : item,
      );
    setQueue(remaining);
    setActiveIndex((index) => Math.min(index, remaining.length - 1));
    toast.add({
      title: t('Deleted ticket {number}', {
        number: record.ticket.ticket_number ?? t('unnumbered'),
      }),
      description: t(
        'Its line was removed from invoice {number}, and the stored original was deleted.',
        { number: record.invoice.invoice_number },
      ),
      type: 'success',
    });
  }

  function clearUnreadableRecords() {
    if (
      window.confirm(
        t('Clear the unreadable saved tickets in this browser? This cannot be undone.'),
      )
    ) {
      clearLocalRecords();
    }
  }

  /** `under` goes below the box, for a field with more than a box to it. */
  /**
   * A step's fields, with the short heading each run of them opens with on a
   * phone. Returned as a list so the headings sit in the same grid as the
   * fields and can span it.
   */
  const renderFields = (defs: FieldDef[], under?: (def: FieldDef) => ReactNode) =>
    defs.flatMap((def) => {
      const field = renderField(def, under?.(def));
      if (!isPhone || !def.group) return field ? [field] : [];
      return [
        <p key={`run-${def.group}`} className="ld-run">
          {t(def.group)}
        </p>,
        ...(field ? [field] : []),
      ];
    });

  const renderField = (def: FieldDef, under?: ReactNode) => {
    if (!ticket) return null;
    const value = ticket[def.name];
    const numeric = isNumberField(def.name);
    const caption = (
      <>
        {t(def.label)}
        {def.required ? (
          <span className="ld-required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </>
    );
    const box = (
      <Input
        id={under ? `${fieldId}-${def.name}` : undefined}
        name={def.name}
        type={def.type ?? (numeric ? 'number' : 'text')}
        min={numeric ? 0 : undefined}
        step={def.step}
        required={def.required}
        value={value === null ? '' : String(value)}
        onChange={(event) => setField(def.name, event.target.value)}
      />
    );
    // A label may only wrap the one control it names, so a field with buttons
    // under it names its box with htmlFor instead.
    return under ? (
      <div key={def.name} className="ld-field" data-span={def.span}>
        <label htmlFor={`${fieldId}-${def.name}`}>{caption}</label>
        {box}
        {under}
      </div>
    ) : (
      <label key={def.name} className="ld-field" data-span={def.span}>
        <span>{caption}</span>
        {box}
      </label>
    );
  };

  const invoiceField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: {
      type?: string;
      required?: boolean;
      span?: 2;
      newRow?: boolean;
      placeholder?: string;
      hint?: string;
      /** Shown, not asked for: the value is worked out from something else. */
      readOnly?: boolean;
    } = {},
  ) => (
    <label
      className="ld-field"
      data-span={options.span}
      data-new-row={options.newRow || undefined}
    >
      <span>
        {label}
        {options.required ? (
          <span className="ld-required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </span>
      <Input
        type={options.type ?? 'text'}
        required={options.required}
        placeholder={options.placeholder}
        readOnly={options.readOnly}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {options.hint ? <small className="ld-field-hint">{options.hint}</small> : null}
    </label>
  );

  const activeTrucks = trucks.filter((truck) => truck.active);
  const uploadTruck =
    activeTrucks.find((truck) => String(truck.id) === truckChoice) ?? null;
  const profileContext: ProfileContext = { customers, truck: uploadTruck };
  const activeCustomer = active
    ? (customers.find((item) => item.id === active.customer_profile_id) ?? null)
    : null;
  const activeTruck = active
    ? (trucks.find((item) => item.id === active.truck_id) ?? null)
    : null;
  const printedName = active?.ticket.customer_name?.replace(/\s+/g, ' ').trim() ?? '';
  const scannedMatch =
    active && printedName ? matchCustomerDetailed(customers, active.ticket) : null;
  /** The chosen customer was found through a printed name that is slightly off. */
  const misprint =
    scannedMatch?.how === 'near' && scannedMatch.customer.id === activeCustomer?.id
      ? scannedMatch
      : null;

  /** Keeps this ticket's spelling on the customer, so it matches exactly next time. */
  async function rememberSpelling() {
    if (!activeCustomer || !printedName || rememberBusy) return;
    setRememberBusy(true);
    const error = await saveProfile(
      'customer',
      {
        name: activeCustomer.name,
        ticket_customer_ids: activeCustomer.ticket_customer_ids,
        ticket_names: [...activeCustomer.ticket_names, printedName],
        addresses: customerAddresses(activeCustomer),
        flat_rate: activeCustomer.flat_rate,
        rate_type: activeCustomer.rate_type ?? 'flat',
        fuel_charge: activeCustomer.fuel_charge,
        fuel_type: activeCustomer.fuel_type ?? 'flat',
        notes: activeCustomer.notes,
        created_at: activeCustomer.created_at,
      },
      activeCustomer.id,
    );
    setRememberBusy(false);
    toast.add(
      error
        ? { title: t('Could not save the spelling'), description: t(error), type: 'error' }
        : {
            title: t('Spelling remembered'),
            description: t('Tickets printed “{printed}” now match {name} exactly.', {
              printed: printedName,
              name: activeCustomer.name,
            }),
            type: 'success',
          },
    );
  }
  /**
   * Destinations saved on the chosen customer's profile. Tickets are scanned
   * with the left edge cut off often enough that the delivery address on them
   * cannot be read; where this customer hauls to is known, so it is offered
   * for one click rather than squinted at or typed out again.
   */
  const savedAddresses = customerAddresses(activeCustomer);
  const typedAddress = normalizeAddress(ticket?.project_address ?? '');
  const sameAddress = (value: string) =>
    normalizeName(value) === normalizeName(typedAddress);
  const addressOnFile = Boolean(typedAddress) && savedAddresses.some(sameAddress);

  /** Keeps this ticket's destination on the customer, to pick on the next one. */
  async function rememberAddress() {
    if (!activeCustomer || !typedAddress || addressBusy) return;
    setAddressBusy(true);
    const error = await saveProfile(
      'customer',
      {
        name: activeCustomer.name,
        ticket_customer_ids: activeCustomer.ticket_customer_ids,
        ticket_names: activeCustomer.ticket_names,
        addresses: addCustomerAddress(activeCustomer, typedAddress),
        flat_rate: activeCustomer.flat_rate,
        rate_type: activeCustomer.rate_type ?? 'flat',
        fuel_charge: activeCustomer.fuel_charge,
        fuel_type: activeCustomer.fuel_type ?? 'flat',
        notes: activeCustomer.notes,
        created_at: activeCustomer.created_at,
      },
      activeCustomer.id,
    );
    setAddressBusy(false);
    toast.add(
      error
        ? { title: t('Could not save the address'), description: t(error), type: 'error' }
        : {
            title: t('Address saved to {name}', { name: activeCustomer.name }),
            description: t('Pick it on the next ticket instead of typing it again.'),
            type: 'success',
          },
    );
  }

  const addressPicker = (
    <div className="ld-address-picker">
      {savedAddresses.length ? (
        <>
          <span id={`${fieldId}-addresses`}>
            {t('Saved for {name}', { name: activeCustomer?.name ?? '' })}
          </span>
          <ul aria-labelledby={`${fieldId}-addresses`}>
            {savedAddresses.map((address) => (
              <li key={address}>
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  data-chosen={sameAddress(address) || undefined}
                  onClick={() => setField('project_address', address)}
                >
                  <MapPin data-icon="inline-start" />
                  <span className="ui-literal">{address}</span>
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {activeCustomer && typedAddress && !addressOnFile ? (
        <Button
          type="button"
          variant="link"
          size="xs"
          disabled={addressBusy}
          onClick={() => void rememberAddress()}
        >
          {addressBusy
            ? t('Saving…')
            : t('Save this address to {name}', { name: activeCustomer.name })}
        </Button>
      ) : null}
      <small className="ld-field-hint">
        {!activeCustomer
          ? t('Choose a customer profile below to pick one of its saved addresses.')
          : savedAddresses.length
            ? t('Straight from the profile, for a scan whose address is cut off.')
            : t(
                '{name} has no saved addresses yet. Save this one to pick it on the next ticket.',
                { name: activeCustomer.name },
              )}
      </small>
    </div>
  );

  // The client whose details the bill-to matches; null when it has no profile.
  const activeClient = active ? clientForBillTo(clients, active.invoice.bill_to) : null;
  const billToName = active?.invoice.bill_to.name.trim() ?? '';
  // Always the same number of choices while picking: a changing list would
  // lose the pick (see SelectField). Only the first choice's label changes.
  const clientOptions = [
    {
      value: NO_CLIENT,
      label:
        billToName && !activeClient
          ? t('{name} (no client profile)', { name: billToName })
          : t('Choose a client'),
    },
    ...clients.map((client) => ({ value: String(client.id), label: client.name })),
    { value: NEW_CLIENT, label: t('+ Create new client') },
  ];
  const clientChoice = newClient
    ? NEW_CLIENT
    : activeClient
      ? String(activeClient.id)
      : NO_CLIENT;
  const clientDetails = activeClient
    ? [
        activeClient.address_lines.filter((line) => line.trim()).join(', '),
        activeClient.phone && t('Tel: {phone}', { phone: phoneDisplay(activeClient.phone) }),
      ]
        .filter(Boolean)
        .join(' · ') || t('No address or phone on this client profile.')
    : billToName
      ? t('This invoice’s bill-to has no client profile. Choose a client, or create one from it.')
      : clients.length
        ? t('Choose who this invoice is billed to.')
        : t('No clients yet. Create one to bill this invoice.');

  const newClientField = (
    key: 'name' | 'phone' | 'street' | 'city',
    label: string,
    options: { required?: boolean; type?: string; placeholder?: string } = {},
  ) =>
    newClient ? (
      <div className="ld-field" data-span={2}>
        <label htmlFor={`${fieldId}-new-client-${key}`}>
          {label}
          {options.required ? (
            <span className="ld-required" aria-hidden="true">
              {' '}
              *
            </span>
          ) : null}
        </label>
        <Input
          id={`${fieldId}-new-client-${key}`}
          type={options.type ?? 'text'}
          placeholder={options.placeholder}
          value={newClient[key]}
          disabled={newClient.saving}
          onChange={(event) => {
            // The phone box formats as it is typed; the rest take what is typed.
            const value =
              key === 'phone'
                ? phoneEdit(newClient[key], event.target.value)
                : event.target.value;
            setNewClient((current) => current && { ...current, [key]: value });
          }}
          onKeyDown={(event) => {
            // Enter saves the client, not the ticket form around it.
            if (event.key === 'Enter') {
              event.preventDefault();
              void saveNewClient();
            }
          }}
        />
      </div>
    ) : null;
  // The new customer form belongs to the ticket it was opened on.
  const customerFormOpen = newCustomer !== null && newCustomer.itemId === active?.id;
  const customerHint = activeCustomer
    ? activeCustomer.flat_rate !== null
      ? t('Filled in: {rate}.', {
          rate: `${t(RATE_TYPE_LABELS[activeCustomer.rate_type ?? 'flat'])} ${money(activeCustomer.flat_rate)} ${t(RATE_UNITS[activeCustomer.rate_type ?? 'flat'])}${
            activeCustomer.fuel_charge
              ? ` ${t('+ {amount} fuel', { amount: formatFuel(activeCustomer.fuel_charge, activeCustomer.fuel_type ?? 'flat') })}`
              : ''
          }`,
        })
      : t('This customer has no default rate; enter the rate for this ticket.')
    : ticket?.customer_name
      ? t('No customer profile matches this ticket.')
      : t('Choose the customer to use its rate.');
  const truckHint = activeTruck
    ? [
        t('Truck #{number} on the invoice', { number: activeTruck.truck_number }),
        activeTruck.driver && t('Driver {name}', { name: activeTruck.driver }),
        activeTruck.license_plate && t('Plate {plate}', { plate: activeTruck.license_plate }),
      ]
        .filter(Boolean)
        .join(' · ')
    : active?.invoice.truck_number
      ? t('Truck #{number} on the invoice. Choose a truck profile to change it.', {
          number: active.invoice.truck_number,
        })
      : t('Choose a truck; its number goes on the invoice.');

  // One batch per ticket date, the one added to most recently first, with how
  // many of its tickets nobody has checked yet. This is the pile the invoicing
  // is done from, so it is ordered by when the work happened rather than by
  // the date printed on the paper (see batchesByRecency).
  const batchesByDate = batchesByRecency(records).map((group) => ({
    ...group,
    waiting: group.items.filter(needsReview).length,
  }));

  const STEPS = ['Ticket', 'Customer and job', 'Weight', 'Invoice'];
  const lastStep = STEPS.length - 1;
  const atStep = Math.min(step, lastStep);

  /**
   * Whether the picture beside the form is one a magnifying glass can do
   * anything with: a photograph that has arrived. A PDF is the browser's own
   * viewer, and the other states are a line of text in a box.
   */
  const zoomablePreview =
    !!active &&
    active.preview_status === 'ready' &&
    /^image\/(png|jpe?g|webp|gif)$/.test(active.source.type);

  const batchItems = active
    ? queue.filter((item) => item.batch_id === active.batch_id)
    : [];
  const batchChanged = batchItems.filter(hasChanges);
  const activeChanged = active ? hasChanges(active) : false;
  const batchNote =
    batchItems.length > 1
      ? t(
          'Shared by every ticket on this invoice ({tickets}). Changes to invoice details apply to all of them; rates stay per ticket.',
          { tickets: plural(batchItems.length, 'ticket') },
        )
      : null;

  const check = ticket ? weightCheck(ticket, t) : null;
  const rateType = ticket ? rateTypeOf(ticket) : 'flat';
  const fuelType = ticket ? fuelTypeOf(ticket) : 'flat';
  // Collapsed section headers show the key values of their fields.
  const ticketDetail = ticket
    ? [ticket.ticket_number, date(ticket.ticket_date), ticket.plant_name]
        .filter(Boolean)
        .join(' · ')
    : '';
  const jobDetail = ticket
    ? [ticket.customer_name, ticket.project_name].filter(Boolean).join(' · ')
    : '';
  const tons = ticket ? invoiceTons(ticket) : '';
  const weightDetail = ticket
    ? [
        ticket.net_lb === null ? null : pounds(ticket.net_lb),
        tons ? t('{tons} Tons', { tons }) : null,
        ticket.carrier_name,
        check?.tone === 'bad' ? t('Weights do not balance') : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : '';

  /**
   * Reading a ticket. The bar sits under the Extract button on every screen,
   * phone included: it used to take over the phone's whole screen, which hid
   * the page it was working on and the tickets already waiting on it.
   *
   * A quiet one shows nothing at all: "Review later" means the page stays
   * exactly as it was, ready for the next photograph, and the status line under
   * the button says where the ticket went once it lands.
   */
  const extractionProgress = extraction && !extraction.quiet ? (
    <Progress value={extraction.percent} className="ld-progress">
      <div className="ld-progress-head">
        <ProgressLabel className="ld-progress-label">
          {extraction.total > 1
            ? t('Extracting file {index} of {total}', {
                index: extraction.index + 1,
                total: extraction.total,
              })
            : t('Extracting tickets')}
        </ProgressLabel>
        <ProgressValue className="ld-progress-value" />
      </div>
      <p className="ld-progress-detail">
        {t(extraction.label)} · {extraction.file}
      </p>
    </Progress>
  ) : null;

  const sectionSummary = (title: string, detail: string, tone?: string) => (
    <summary className="ld-section-summary">
      <h3>{t(title)}</h3>
      <span className="ld-section-detail" data-tone={tone}>
        {detail || t('Nothing entered yet')}
      </span>
      <ChevronDown className="ld-section-chevron" aria-hidden="true" />
    </summary>
  );

  /** A required field in a closed section: open it so the browser can point to the field. */
  const openInvalidSection = (event: SyntheticEvent<HTMLFormElement>) => {
    const section = (event.target as HTMLElement).closest('details');
    if (section && !section.open) section.open = true;
  };
  const saveLabel = activeSaved
    ? batchChanged.length
      ? t('Save changes')
      : activeUnchecked
        ? t('Save as checked')
        : t('Saved')
    : queue.some(
          (item, index) =>
            index !== activeIndex && item.saved_record_id === null,
        )
      ? t('Save & review next')
      : t('Save ticket & create invoice');

  // Reads the latest records and queue without re-running the effect below.
  const openEditRequest = useEffectEvent(() => {
    const id = editRequest;
    if (id === null) return;
    setDeskField('editRequest', null);
    const record = records.find((item) => item.id === id);
    if (record) {
      editSaved(record);
    } else {
      toast.add({
        title: t('Ticket not found'),
        description: t('It may have been deleted. Nothing was opened.'),
        type: 'error',
      });
    }
  });
  // Asked for as a request rather than answered on the way in: this page is
  // mounted whether or not it is the one on the screen, so there is no arrival
  // to catch. Invoices & Tickets asks (requestEdit), and this hears it.
  useEffect(() => {
    if (store.ready && editRequest !== null) openEditRequest();
  }, [store.ready, editRequest]);

  // Reloading or closing the tab would lose unsaved changes to saved tickets.
  const unsavedEdits = queue.some(hasChanges);
  useEffect(() => {
    if (!unsavedEdits) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [unsavedEdits]);

  /**
   * The way round the other tickets. It heads the panel on a desk as it always
   * has, and on a phone it follows the block the review opens on: it is for
   * reaching the next ticket, not for checking this one.
   *
   * Null until there is a ticket open: this is worked out on every render of
   * the page, including the one where the queue is empty and the review is not
   * on the screen at all, and the summary below reads straight off the ticket.
   */
  /**
   * The tickets the selector may reach: the ones on the invoice being
   * reviewed. Stepping from one invoice's ticket straight onto another's
   * changes what is being billed without saying so, and the invoice details on
   * the last step belong to whichever invoice is open.
   */
  const invoiceStops = active
    ? queue.flatMap((item, index) => (item.batch_id === active.batch_id ? [index] : []))
    : [];
  const stopHere = invoiceStops.indexOf(activeIndex);
  const previousStop = stopHere > 0 ? invoiceStops[stopHere - 1] : null;
  const nextStop =
    stopHere >= 0 && stopHere < invoiceStops.length - 1 ? invoiceStops[stopHere + 1] : null;

  /**
   * Anything still to be filled in before this ticket is done with — a missing
   * rate included. A rate only keeps the invoice a draft rather than the ticket
   * incomplete, but a draft is not finished either, and a tick beside a ticket
   * that still needs a rate says it is. The same rule the batch list marks
   * "Needs review" by, so a ticket does not read as two different things in two
   * places.
   */
  const missingInformation = (item: QueueItem) =>
    validateTicket(item.ticket).length > 0;

  const queueRow =
    active && ticket ? (
    <>
          <div className="ld-review-head">
            <div>
              <p className="ld-step">{t('02 · Review')}</p>
              <h2 id="ld-review-title">
                {t('Ticket {index} of {total}', { index: activeIndex + 1, total: queue.length })}
              </h2>
            </div>
            <nav className="ld-queue" aria-label={t('Ticket queue')}>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t('Previous ticket')}
                disabled={previousStop === null}
                onClick={() => previousStop !== null && setActiveIndex(previousStop)}
              >
                <ChevronLeft />
              </Button>
              {queue.map((item, index) => {
                const changed = hasChanges(item);
                const saved = item.saved_record_id !== null && !changed;
                const incomplete = missingInformation(item);
                const elsewhere = item.batch_id !== active.batch_id;
                // A cross for a ticket still missing something, a tick for one
                // saved and whole, and its number until it is either.
                const mark = incomplete ? (
                  <X aria-hidden="true" />
                ) : saved ? (
                  <Check aria-hidden="true" />
                ) : (
                  index + 1
                );
                const state = incomplete
                  ? `, ${t('missing information')}`
                  : saved
                    ? `, ${t('saved')}`
                    : changed
                      ? `, ${t('unsaved changes')}`
                      : '';
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="ld-queue-tab"
                    aria-current={index === activeIndex ? 'true' : undefined}
                    data-saved={saved}
                    data-changed={changed}
                    data-incomplete={incomplete || undefined}
                    disabled={elsewhere}
                    title={elsewhere ? t('On another invoice') : undefined}
                    aria-label={`${t('Ticket {index}: {name}', { index: index + 1, name: item.source.file_name })}${state}${elsewhere ? `, ${t('on another invoice')}` : ''}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    {mark}
                  </button>
                );
              })}
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t('Next ticket')}
                disabled={nextStop === null}
                onClick={() => nextStop !== null && setActiveIndex(nextStop)}
              >
                <ChevronRight />
              </Button>
              <span className="ld-queue-count">
                {t('{saved} of {total} saved', { saved: savedInQueue, total: queue.length })}
              </span>
              {savedInQueue === queue.length && !unsavedEdits ? (
                <Button variant="secondary" size="sm" onClick={clearQueue}>
                  {t('Clear queue')}
                </Button>
              ) : null}
            </nav>
          </div>

          <dl className="ld-summary">
            <div>
              <dt>{t('Ticket')}</dt>
              <dd>{ticket.ticket_number ?? t('Not found')}</dd>
            </div>
            <div>
              <dt>{t('Customer')}</dt>
              <dd>{ticket.customer_name ?? t('Not found')}</dd>
            </div>
            <div>
              <dt>{t('Net tons')}</dt>
              <dd>{tons ? t('{tons} Tons', { tons }) : t('Not found')}</dd>
            </div>
            <div>
              <dt>{t('Status')}</dt>
              <dd>
                {activeSaved
                  ? activeChanged
                    ? t('Unsaved changes')
                    : t('Saved as record {id}', { id: active.saved_record_id ?? '' })
                  : issues.length
                    ? t('To review: {items}', { items: plural(issues.length, 'item') })
                    : t('Ready to save')}
              </dd>
            </div>
          </dl>
    </>
    ) : null;

  /**
   * What the ticket still needs, or that it needs nothing. The phone keeps it
   * in the block the review opens on; the desk keeps it at the head of the
   * form, where it has always been.
   */
  const checkRow = (
          <div className="ld-check-row">
            <div
              className="ld-notice"
              data-tone={issues.length ? 'warning' : 'good'}
              aria-live="polite"
            >
              {issues.length ? (
                <>
                  <strong>{t('Check before saving')}</strong>
                  <ul>
                    {issues.map((issue) => (
                      <li key={issue}>{t(issue)}</li>
                    ))}
                  </ul>
                </>
              ) : isPhone ? (
                <>
                  <Check aria-hidden="true" />
                  {t('All checks pass')}
                </>
              ) : (
                t('All checks pass.')
              )}
            </div>
            {/* And a tap away from every step, rather than a scroll to
                the bottom of the form. Only on a phone: a desk has the
                photograph standing beside the form already (.ld-aside), so the
                button would open what is on the screen anyway. */}
            {isPhone ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="ld-view-ticket"
                onClick={() => setViewingTicket(true)}
              >
                <FileSearch data-icon="inline-start" />
                {t('View ticket')}
              </Button>
            ) : null}
          </div>
  );

  /**
   * On a phone the review takes the blue band at the top of the page for its
   * own head: which ticket, how it stands, which step, the checks and the way
   * to the picture. The page's own title and figures are a screenful the
   * review has no use for, and the page they belong to is one tap back.
   */
  const phoneReview = isPhone && !!active && !!ticket && !!check;
  /**
   * Every step opens at the top of the page, where the band is. The foot of
   * the step before is not where the next one starts: what a step opens on is
   * which ticket this is, how far through it you are and what it still needs.
   * Only on a phone — a desk has the whole review on one screen.
   */
  useEffect(() => {
    if (!phoneReview) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phoneReview, atStep, activeIndex]);

  const reviewBand = phoneReview ? (
    <div className="ld-review-band">
      <div className="ld-mobile-head">
        <div className="ld-mobile-head-top">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveIndex(-1)}
          >
            <ChevronLeft data-icon="inline-start" />
            {t('Tickets')}
          </Button>
          <strong>{t('Review')}</strong>
        </div>
        <div className="ld-mobile-head-row">
          <strong>
            {t('Ticket {index} of {total}', {
              index: activeIndex + 1,
              total: queue.length,
            })}
          </strong>
          <span
            className="ld-chip"
            data-tone={
              activeChanged
                ? 'warning'
                : activeSaved && !activeUnchecked
                  ? 'good'
                  : undefined
            }
          >
            {activeChanged ? (
              t('Unsaved')
            ) : activeSaved && !activeUnchecked ? (
              <>
                <Check aria-hidden="true" />
                {t('Saved')}
              </>
            ) : (
              t('To check')
            )}
          </span>
          {savedInQueue === queue.length && !unsavedEdits ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t('Clear queue')}
              title={t('Clear queue')}
              onClick={clearQueue}
            >
              <X />
            </Button>
          ) : null}
        </div>
        <p className="ld-mobile-step">
          {t('Step {number} of {total}', {
            number: atStep + 1,
            total: STEPS.length,
          })}{' '}
          · {t(STEPS[atStep])}
        </p>
        <span className="ld-steps-track" aria-hidden="true">
          {STEPS.map((name, index) => (
            <i key={name} data-done={index <= atStep || undefined} />
          ))}
        </span>
      </div>

      {checkRow}
      {queueRow}
    </div>
  ) : null;

  return (
    <>
      {/* The band every page opens on. While a ticket is being checked on a
          phone it carries the review's head instead of this page's title and
          figures: what the band is for is saying where you are, and where you
          are is inside one ticket. */}
      <div className="page-heading" data-review={phoneReview || undefined}>
        {reviewBand ?? (
          <>
            <div>
              <p className="eyebrow">LOAD DESK</p>
              <h1>{t('Load Tickets to Invoices')}</h1>
              <p className="muted">
                {t(
                  'Upload tickets, check the extracted fields, then save each one with its original and an invoice.',
                )}
              </p>
            </div>
            <dl className="ld-stats">
              <div>
                <dt>{t('Saved tickets')}</dt>
                <dd>{records.length}</dd>
              </div>
              <div>
                <dt>{t('Needs review')}</dt>
                <dd>{reviewCount}</dd>
              </div>
              <div>
                <dt>{t('Net tons')}</dt>
                <dd>{netTons.toFixed(2)}</dd>
              </div>
            </dl>
          </>
        )}
      </div>

      {/* Everything below the band rides in one sheet, as on every page. On a
          phone it is the panel that slides up over the band; on a wider screen
          it is display:contents and lays out as if it were not here. */}
      <div className="page-sheet">

        <div className="ld-grid">
          <section className="ld-panel" aria-labelledby="ld-upload-title">
            <div className="ld-panel-head">
              <div>
                <p className="ld-step">{t('01 · Upload')}</p>
                <h2 id="ld-upload-title">{t('New Load Tickets')}</h2>
              </div>
              <span className="ld-hint">
                {t('PDF, image or text · 20 MB each')}
              </span>
            </div>
            {/* The camera scanner is for phones; everything else uploads files. */}
            {isPhone ? (
              <>
                {scannerOpen && (
                  <DocumentScanner
                    onClose={closeScanner}
                    onUse={(file) => {
                      chooseFiles([file]);
                      closeScanner();
                    }}
                  />
                )}
                <Button
                  type="button"
                  className="ld-scan-button"
                  onClick={() => setScannerOpen(true)}
                >
                  <Camera data-icon="inline-start" />
                  {t('Scan ticket')}
                </Button>
              </>
            ) : null}
            <input
              ref={fileInput}
              type="file"
              accept={ACCEPT_ATTRIBUTE}
              multiple
              hidden
              onChange={(event) => chooseFiles(event.target.files)}
            />
            <button
              type="button"
              className="ld-drop"
              data-phone-hidden={isPhone || undefined}
              data-dragging={dragging}
              onClick={() => fileInput.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <span className="ld-drop-icon" aria-hidden="true">
                <FileUp />
              </span>
              <strong>
                {pending.length ? t('Add more tickets') : t('Drop tickets here')}
              </strong>
              <span>
                {busy
                  ? t('Files added now wait for the next extraction')
                  : pending.length
                    ? t('Drop or click to add files to the list below')
                    : t('or click to choose one or several files')}
              </span>
            </button>
            {pending.length ? (
              <div className="ld-pending" aria-live="polite">
                <div className="ld-pending-head">
                  <strong>
                    {t('Ready to extract: {files}', { files: plural(pending.length, 'file') })}
                  </strong>
                  <Button variant="ghost" size="xs" onClick={() => setPending([])}>
                    {t('Clear')}
                  </Button>
                </div>
                <ul>
                  {pending.map((file) => (
                    <li key={fileKey(file)}>
                      <FileText aria-hidden="true" />
                      <span className="ld-pending-name" title={file.name}>
                        {file.name}
                      </span>
                      <span className="ld-pending-size">{fileSize(file.size)}</span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={t('Remove {name}', { name: file.name })}
                        onClick={() => removePending(fileKey(file))}
                      >
                        <X />
                      </Button>
                    </li>
                  ))}
                </ul>
                <p className="ld-hint">
                  {t(
                    'Tickets from the same date go on one invoice, dated that day. Tickets from different dates get separate invoices.',
                  )}
                </p>
              </div>
            ) : null}
            <div className="ld-field ld-truck-pick">
              <label htmlFor={`${fieldId}-upload-truck`}>
                {t('Truck for these tickets')}
              </label>
              <SelectField
                id={`${fieldId}-upload-truck`}
                aria-describedby={`${fieldId}-upload-truck-hint`}
                value={uploadTruck ? String(uploadTruck.id) : ''}
                disabled={busy}
                onValueChange={setTruckChoice}
                options={[
                  { value: '', label: t('No truck profile') },
                  ...activeTrucks.map((truck) => ({
                    value: String(truck.id),
                    label: `${truckLabel(truck)}${truck.driver ? ` · ${truck.driver}` : ''}`,
                  })),
                ]}
              />
              <small
                id={`${fieldId}-upload-truck-hint`}
                className="ld-field-hint"
              >
                {activeTrucks.length ? (
                  t('Its truck number goes on every invoice from this upload.')
                ) : (
                  <>
                    {t('Add trucks in')} <Link href="/fleet">{t('Truck Fleet')}</Link>{' '}
                    {t('to choose one here.')}
                  </>
                )}
              </small>
            </div>
            <div className="ld-actions">
              <Button
                onClick={() => void extractPending()}
                disabled={busy || !pending.length}
              >
                {t('Extract tickets')}
                <ChevronRight data-icon="inline-end" />
              </Button>
              {/* Beside a truck there is another ticket to photograph, not
                  thirty boxes to check. This reads the picture and files it in
                  its date's batch without asking anything; the batch below
                  says how many are waiting, and opens them when there is time. */}
              {isPhone ? (
                <Button
                  variant="secondary"
                  onClick={() => void extractPending(false)}
                  disabled={busy || !pending.length}
                >
                  <Clock data-icon="inline-start" />
                  {t('Review later')}
                </Button>
              ) : null}
            </div>
            {addingTo ? null : extractionProgress}
            <p
              className="ld-status"
              data-tone={uploadStatus?.tone}
              aria-live="polite"
            >
              {uploadStatus?.message}
            </p>
          </section>

          <section className="ld-panel" aria-labelledby="ld-saved-title">
            <div className="ld-panel-head">
              <div>
                <p className="ld-step">{t('By ticket date')}</p>
                <h2 id="ld-saved-title">{t('Batches')}</h2>
              </div>
              <div className="ld-actions ld-actions-flush">
                <Link
                  href="/records"
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  {t('All invoices & tickets')}
                </Link>
                <Button
                  className="ld-ledger-csv"
                  variant="secondary"
                  size="sm"
                  onClick={downloadLedger}
                  disabled={!records.length}
                >
                  <Download />
                  {t('Ledger CSV')}
                </Button>
              </div>
            </div>
            {store.error ? (
              <div className="ld-notice" data-tone="warning">
                {t(store.error)}{' '}
                {store.error.includes('could not be read') ? (
                  <Button
                    variant="link"
                    size="xs"
                    onClick={clearUnreadableRecords}
                  >
                    {t('Clear saved tickets')}
                  </Button>
                ) : null}
              </div>
            ) : null}
            {!store.ready ? (
              <p className="ld-empty">{t('Loading batches…')}</p>
            ) : records.length === 0 ? (
              <p className="ld-empty">
                {store.mode === 'local'
                  ? t('Nothing photographed yet. In this local preview batches stay in this browser.')
                  : t('Nothing photographed yet. A ticket goes into its date’s batch as soon as it is read.')}
              </p>
            ) : (
              batchesByDate.map((batch) => (
              <section key={batch.date ?? 'undated'} className="ld-batch">
                <div className="ld-batch-head">
                  <strong>{batch.date ? date(batch.date) : t('No date read')}</strong>
                  <span>
                    {plural(batch.items.length, 'ticket')}
                    {batch.waiting
                      ? ` · ${t('{count} to check', { count: batch.waiting })}`
                      : ` · ${t('all checked')}`}
                  </span>
                  {/* What "Review later" is later. The first ticket nobody has
                      checked opens with the rest of its invoice behind it, the
                      same as Edit on any one of them. */}
                  {batch.waiting ? (
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => {
                        const first = batch.items.find(needsReview);
                        if (first) editSaved(first);
                      }}
                    >
                      <Pencil />
                      {t('Review batch')}
                    </Button>
                  ) : null}
                </div>
              <ul className="ld-records">
                {batch.items.map((record) => {
                  const valid = validateTicket(record.ticket).length === 0;
                  return (
                    <li key={record.id} className="ld-record">
                      <div className="ld-record-main">
                        <strong>
                          {record.ticket.ticket_number ?? t('Unnumbered')}
                        </strong>
                        <span className="ld-record-meta">
                          {record.ticket.customer_name ?? t('No customer')} ·{' '}
                          {pounds(record.ticket.net_lb)} ·{' '}
                          <span>{t('Invoice {number}', { number: record.invoice.invoice_number })}</span>
                        </span>
                      </div>
                      <span
                        className="ld-chip"
                        data-tone={valid ? 'good' : 'warning'}
                      >
                        {valid ? t('Valid') : t('Needs review')}
                      </span>
                      <div className="ld-record-actions">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => editSaved(record)}
                        >
                          <Pencil />
                          {t('Edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setInvoiceView(savedInvoice(record))}
                        >
                          <ReceiptText />
                          {t('Invoice')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => void openOriginal(record)}
                        >
                          <FileSearch />
                          {t('Original')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="ld-danger"
                          onClick={() => setRecordToDelete(record)}
                        >
                          <Trash2 />
                          {t('Delete')}
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              </section>
              ))
            )}
          </section>
        </div>

        {active && ticket && check ? (
          <section
            ref={reviewPanel}
            className="ld-panel ld-review"
            aria-labelledby="ld-review-title"
          >
            {/* On a phone the head of the review and the way round the other
                tickets are both up in the band (see reviewBand); a desk has
                room for the ticket and its photograph at once and keeps the
                review it always had. */}
            {isPhone ? null : queueRow}

            <div className="ld-review-body">
              <form
                className="ld-form"
                onSubmit={(event) => void saveActive(event)}
                onInvalidCapture={openInvalidSection}
              >
                {/* What the reader made of this page. Until now this was worked
                    out, stored on the ticket and never shown, so a ticket that
                    came back empty — an unsupported supplier's layout, a page
                    nothing could be read from — looked like the app doing
                    nothing at all. */}
                {active.note_problem ? (
                  <div className="ld-notice" data-tone="warning" aria-live="polite">
                    <strong>{t('This ticket was not read')}</strong>
                    <p>{t(active.note)}</p>
                    <details className="ld-scan-text">
                      <summary>{t('What the scan read')}</summary>
                      {active.ocr_text.trim() ? (
                        <>
                          <pre>{active.ocr_text}</pre>
                          <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            onClick={() => void navigator.clipboard?.writeText(active.ocr_text)}
                          >
                            {t('Copy text')}
                          </Button>
                        </>
                      ) : (
                        <p>{t('Nothing at all. The page itself is the problem, not the layout.')}</p>
                      )}
                    </details>
                  </div>
                ) : null}
                {isPhone ? null : checkRow}

                <fieldset
                  className="ld-fieldset"
                  disabled={busy}
                  data-phone-step={isPhone ? atStep : undefined}
                >
                  <details className="ld-section ld-collapsible" data-step="0" open={isPhone || undefined}>
                    {sectionSummary('Ticket', ticketDetail)}
                    <div className="ld-fields">
                      {renderFields(TICKET_FIELDS)}
                    </div>
                  </details>

                  <details className="ld-section ld-collapsible" data-step="1" open={isPhone || undefined}>
                    {sectionSummary('Customer and Job', jobDetail)}
                    <div className="ld-fields">
                      {renderFields(JOB_FIELDS, (def) =>
                        def.name === 'project_address' ? addressPicker : undefined,
                      )}
                    </div>
                  </details>

                  <details className="ld-section ld-collapsible" data-step="2" open={isPhone || undefined}>
                    {sectionSummary(
                      'Weight and Hauling',
                      weightDetail,
                      check.tone === 'bad' ? 'bad' : undefined,
                    )}
                    <div className="ld-fields">
                      {renderFields(WEIGHT_FIELDS)}
                      <p
                        className="ld-weight"
                        data-tone={check.tone}
                        aria-live="polite"
                      >
                        {check.text}
                      </p>
                      {renderFields(HAULING_FIELDS)}
                    </div>
                  </details>

                  <div className="ld-section" data-step="3">
                    <h3>{t('Invoice')}</h3>
                    {batchNote ? (
                      <p className="ld-section-note">{batchNote}</p>
                    ) : null}
                    <div className="ld-add-tickets">
                      <input
                        ref={addFileInput}
                        type="file"
                        accept={ACCEPT_ATTRIBUTE}
                        multiple
                        hidden
                        onChange={(event) => void addTicketsToInvoice(event.target.files)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={busy}
                        onClick={() => addFileInput.current?.click()}
                      >
                        <FileUp data-icon="inline-start" />
                        {t('Add tickets to this invoice')}
                      </Button>
                      <small className="ld-field-hint">
                        {active.invoice.invoice_number.trim()
                          ? t('They join invoice {number}, whatever their ticket dates.', {
                              number: active.invoice.invoice_number.trim(),
                            })
                          : t('They join the invoice being reviewed, whatever their ticket dates.')}
                      </small>
                      {addingTo === active.batch_id ? extractionProgress : null}
                    </div>
                    <div className="ld-fields">
                      {invoiceField(
                        t('Invoice number'),
                        active.invoice.invoice_number,
                        (value) => setInvoice({ invoice_number: value }),
                        {
                          required: true,
                          placeholder: t('e.g. 1001'),
                          hint: active.invoice.invoice_number.trim()
                            ? undefined
                            : t('Enter your first invoice number. The ones after it follow in order.'),
                        },
                      )}
                      {/* Read-only on purpose: an invoice is dated by its
                          ticket, so this follows the date in step 1 rather
                          than being a second date to keep in step with it. A
                          plain box, not a date picker, so it matches the
                          fields around it instead of whatever control the
                          phone draws for type="date". */}
                      {invoiceField(
                        t('Invoice date'),
                        active.ticket.ticket_date
                          ? date(active.ticket.ticket_date)
                          : date(active.invoice.invoice_date),
                        () => {},
                        {
                          readOnly: true,
                          hint: active.ticket.ticket_date
                            ? t('The ticket’s date. Change it on the ticket to move the invoice.')
                            : t('No date was read off the ticket. Fill the date in on the ticket and the invoice follows.'),
                        },
                      )}
                      <div className="ld-field" data-span={2} data-new-row>
                        <label htmlFor={`${fieldId}-customer`}>
                          {t('Customer profile')}
                        </label>
                        <SelectField
                          key={`customer-${activeIndex}-${customers.length}`}
                          id={`${fieldId}-customer`}
                          aria-describedby={`${fieldId}-customer-hint`}
                          value={
                            customerFormOpen
                              ? NEW_CUSTOMER
                              : activeCustomer
                                ? String(activeCustomer.id)
                                : ''
                          }
                          onValueChange={chooseCustomer}
                          disabled={customerFormOpen && newCustomer.saving}
                          options={[
                            { value: '', label: t('No customer profile') },
                            ...customers.map((customer) => ({
                              value: String(customer.id),
                              label: `${customer.name}${
                                customer.flat_rate !== null
                                  ? ` · ${formatRate(customer.flat_rate, customer.rate_type ?? 'flat')}${(customer.rate_type ?? 'flat') === 'flat' ? ` ${t('flat')}` : ''}`
                                  : ''
                              }`,
                            })),
                            { value: NEW_CUSTOMER, label: t('+ Create new customer') },
                          ]}
                        />
                        <small
                          id={`${fieldId}-customer-hint`}
                          className="ld-field-hint"
                        >
                          {customerFormOpen
                            ? t('Check the name below, then save the customer.')
                            : activeCustomer || !ticket?.customer_name
                              ? customerHint
                              : t(
                                  'No customer profile matches this ticket. Choose + Create new customer to add it from the scan.',
                                )}
                        </small>
                        {misprint ? (
                          <p className="ld-near-match">
                            <span>
                              {t('The ticket prints “{printed}”, a letter or two off {name}.', {
                                printed: printedName,
                                name: misprint.alias ?? misprint.customer.name,
                              })}
                            </span>
                            <Button
                              type="button"
                              variant="link"
                              size="xs"
                              disabled={rememberBusy}
                              onClick={() => void rememberSpelling()}
                            >
                              {rememberBusy ? t('Saving…') : t('Remember this spelling')}
                            </Button>
                          </p>
                        ) : null}
                      </div>
                      {customerFormOpen ? (
                        <fieldset
                          className="ld-new-client"
                          aria-labelledby={`${fieldId}-new-customer-title`}
                        >
                          <p
                            id={`${fieldId}-new-customer-title`}
                            className="ld-new-client-title"
                          >
                            {t('New customer')}
                          </p>
                          <div className="ld-fields">
                            <div className="ld-field" data-span={2}>
                              <label htmlFor={`${fieldId}-new-customer-name`}>
                                {t('Customer name')}
                                <span className="ld-required" aria-hidden="true">
                                  {' '}
                                  *
                                </span>
                              </label>
                              <Input
                                ref={newCustomerInput}
                                id={`${fieldId}-new-customer-name`}
                                aria-describedby={`${fieldId}-new-customer-hint`}
                                value={newCustomer.name}
                                disabled={newCustomer.saving}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setNewCustomer(
                                    (current) => current && { ...current, name: value, error: null },
                                  );
                                }}
                                onKeyDown={(event) => {
                                  // Enter saves the customer, not the ticket form around it.
                                  if (event.key === 'Enter') {
                                    event.preventDefault();
                                    void saveNewCustomer();
                                  }
                                }}
                              />
                              <small
                                id={`${fieldId}-new-customer-hint`}
                                className="ld-field-hint"
                              >
                                {[
                                  ticket.customer_name &&
                                    t('Scanned as {name}', { name: ticket.customer_name }),
                                  ticket.customer_id &&
                                    t('customer number {number}', { number: ticket.customer_id }),
                                ]
                                  .filter(Boolean)
                                  .join(' · ')}
                                .{' '}
                                {t('Tickets with the scanned name or number will match this customer.')}
                              </small>
                            </div>
                          </div>
                          {newCustomer.error ? (
                            <p className="ld-status" data-tone="error" role="alert">
                              {t(newCustomer.error)}
                            </p>
                          ) : null}
                          <div className="ld-actions ld-actions-flush">
                            <Button
                              type="button"
                              variant="ghost"
                              disabled={newCustomer.saving}
                              onClick={() => setNewCustomer(null)}
                            >
                              {t('Cancel')}
                            </Button>
                            <Button
                              type="button"
                              disabled={newCustomer.saving}
                              onClick={() => void saveNewCustomer()}
                            >
                              {newCustomer.saving ? t('Saving…') : t('Save customer')}
                            </Button>
                          </div>
                        </fieldset>
                      ) : null}
                      <div className="ld-field" data-span={2}>
                        <label htmlFor={`${fieldId}-truck`}>{t('Truck profile')}</label>
                        <SelectField
                          id={`${fieldId}-truck`}
                          aria-describedby={`${fieldId}-truck-hint`}
                          value={activeTruck ? String(activeTruck.id) : ''}
                          onValueChange={chooseTruck}
                          options={[
                            { value: '', label: t('No truck profile') },
                            ...trucks
                              .filter(
                                (truck) =>
                                  truck.active || truck.id === active.truck_id,
                              )
                              .map((truck) => ({
                                value: String(truck.id),
                                label: truckLabel(truck),
                              })),
                          ]}
                        />
                        <small
                          id={`${fieldId}-truck-hint`}
                          className="ld-field-hint"
                        >
                          {truckHint}
                        </small>
                      </div>
                      {/* Rate type, rate, fuel type and fuel charge share a row,
                          and an hourly rate puts its hours at the end of it: the
                          hours are part of what the line is worked out from, so
                          they come before the total rather than after it. */}
                      <div className="ld-field" data-new-row>
                        <label htmlFor={`${fieldId}-rate-type`}>{t('Rate type')}</label>
                        <SelectField
                          key={`rate-type-${activeIndex}`}
                          id={`${fieldId}-rate-type`}
                          value={rateType}
                          onValueChange={(value) => setField('rate_type', value)}
                          options={RATE_TYPES.map((type) => ({
                            value: type,
                            label: t(RATE_TYPE_LABELS[type]),
                          }))}
                        />
                      </div>
                      {renderField({
                        name: 'rate',
                        label: t('Rate {unit}', { unit: t(RATE_UNITS[rateType]) }),
                        step: '0.01',
                      })}
                      <div className="ld-field">
                        <label htmlFor={`${fieldId}-fuel-type`}>{t('Fuel charge type')}</label>
                        <SelectField
                          key={`fuel-type-${activeIndex}`}
                          id={`${fieldId}-fuel-type`}
                          value={fuelType}
                          onValueChange={(value) => setField('fuel_type', value)}
                          options={FUEL_TYPES.map((type) => ({
                            value: type,
                            label: t(FUEL_TYPE_LABELS[type]),
                          }))}
                        />
                      </div>
                      {renderField({
                        name: 'fuel_charge',
                        label:
                          fuelType === 'percent' ? 'Fuel charge %' : 'Fuel charge ($)',
                        step: '0.01',
                      })}
                      {rateType === 'hourly'
                        ? renderField({ name: 'hours', label: 'Hours', step: '0.25' })
                        : null}
                      <div className="ld-field" data-span={2} data-new-row>
                        <span>{t('Line total')}</span>
                        <output className="ld-output" aria-describedby={`${fieldId}-line-math`}>
                          {money(lineTotal(ticket)) || t('Draft')}
                        </output>
                        <small id={`${fieldId}-line-math`} className="ld-field-hint">
                          {t(lineBreakdown(ticket))}
                        </small>
                      </div>
                      <div className="ld-field" data-span={2} data-new-row>
                        <label htmlFor={`${fieldId}-client`}>
                          {t('Bill to client')}
                          <span className="ld-required" aria-hidden="true">
                            {' '}
                            *
                          </span>
                        </label>
                        <SelectField
                          // A new client changes the list: start the menu afresh.
                          key={`client-${activeIndex}-${clients.length}`}
                          id={`${fieldId}-client`}
                          aria-describedby={`${fieldId}-client-hint`}
                          value={clientChoice}
                          onValueChange={chooseClient}
                          options={clientOptions}
                        />
                        <small id={`${fieldId}-client-hint`} className="ld-field-hint">
                          {clientDetails}{' '}
                          <Link href="/customers">{t('Manage clients')}</Link>
                        </small>
                      </div>
                      {newClient ? (
                        <fieldset
                          className="ld-new-client"
                          aria-labelledby={`${fieldId}-new-client-title`}
                        >
                          <p id={`${fieldId}-new-client-title`} className="ld-new-client-title">
                            {t('New client')}
                          </p>
                          <div className="ld-fields">
                            {/* The examples describe each box; they never name a real client. */}
                            {newClientField('name', t('Company name'), {
                              required: true,
                              placeholder: t('Company name'),
                            })}
                            {newClientField('phone', t('Phone'), {
                              type: 'tel',
                              placeholder: PHONE_MASK,
                            })}
                            {newClientField('street', t('Address line 1'), {
                              placeholder: t('Street address'),
                            })}
                            {newClientField('city', t('Address line 2'), {
                              placeholder: t('City, state and ZIP'),
                            })}
                          </div>
                          {newClient.error ? (
                            <p className="ld-status" data-tone="error" role="alert">
                              {t(newClient.error)}
                            </p>
                          ) : null}
                          <div className="ld-actions ld-actions-flush">
                            <Button
                              type="button"
                              variant="ghost"
                              disabled={newClient.saving}
                              onClick={() => setNewClient(null)}
                            >
                              {t('Cancel')}
                            </Button>
                            <Button
                              type="button"
                              disabled={newClient.saving}
                              onClick={() => void saveNewClient()}
                            >
                              {newClient.saving ? t('Saving…') : t('Save client')}
                            </Button>
                          </div>
                        </fieldset>
                      ) : null}
                    </div>
                  </div>
                </fieldset>

                <div className="ld-save">
                  <div>
                    <strong>
                      {activeSaved
                        ? batchChanged.length
                          ? t('Unsaved changes')
                          : activeUnchecked
                            ? t('Not checked yet')
                            : t('Ticket saved')
                        : t('Ready to save?')}
                    </strong>
                    <p>
                      {activeSaved
                        ? batchChanged.length
                          ? batchChanged.length > 1
                            ? t(
                                'Saving updates the saved tickets on this invoice ({tickets}) for everyone in your workspace.',
                                { tickets: plural(batchChanged.length, 'saved ticket') },
                              )
                            : t('Saving updates this saved ticket for everyone in your workspace.')
                          : activeUnchecked
                            ? t(
                                'It was read off the picture and kept in this date’s batch. Correct anything that is wrong, then save it to mark it checked.',
                              )
                            : t(
                                'Change any field to edit this ticket or its invoice, then save the changes.',
                              )
                        : t(
                            'The original file is stored with this record. Without a rate the invoice stays a draft.',
                          )}
                    </p>
                  </div>
                  <div className="ld-actions ld-actions-flush">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setInvoiceView({
                          lines: batchItems,
                          invoice: active.invoice,
                        })
                      }
                    >
                      <ReceiptText />
                      {t('Preview invoice')}
                    </Button>
                    <Button
                      type="submit"
                      data-phone-hidden={isPhone || undefined}
                      disabled={
                        busy ||
                        (activeSaved && !batchChanged.length && !activeUnchecked)
                      }
                    >
                      {activeSaved && !batchChanged.length && !activeUnchecked ? (
                        <Check />
                      ) : null}
                      {busy && activeSaved ? t('Saving…') : saveLabel}
                      {activeSaved ? null : (
                        <ChevronRight data-icon="inline-end" />
                      )}
                    </Button>
                  </div>
                </div>
                {/* The picture, at the foot of every step under the way to
                    the invoice: a stamp of it here, and the whole of it over
                    the screen when it is tapped. Laid out among the fields it
                    put a screen between one and the next; a desk has it
                    standing beside the form already (.ld-aside). */}
                {isPhone ? (
                  <button
                    type="button"
                    className="ld-thumb"
                    onClick={() => setViewingTicket(true)}
                  >
                    <span className="ld-thumb-shot">
                      <SourcePreview item={active} />
                    </span>
                    <span className="ld-thumb-copy">
                      <strong>{t('Original ticket')}</strong>
                      <small>
                        {active.source.file_name} · {fileSize(active.source.size)}
                      </small>
                    </span>
                    <FileSearch aria-hidden="true" />
                  </button>
                ) : null}
                <p
                  className="ld-status"
                  data-tone={saveStatus?.tone}
                  aria-live="polite"
                >
                  {saveStatus?.message}
                </p>
                <div className="ld-step-nav">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={atStep === 0}
                    onClick={() => setStep((current) => Math.max(0, current - 1))}
                  >
                    <ChevronLeft data-icon="inline-start" />
                    {t('Back')}
                  </Button>
                  {/* Two buttons, keyed apart, and not one button that changes
                      what it is. They sit in the same place, so without the
                      keys React keeps the one element and swaps its type from
                      button to submit — which it does in the middle of the tap
                      that moved you on. The browser reads the type after the
                      tap has been handled, finds a submit button, and does
                      what a submit button does: the last step saved the ticket
                      the moment you arrived on it, and the fields went dead
                      (the fieldset is disabled while a save is in flight)
                      before you could read the step, let alone edit it. Keyed
                      apart, the Next button leaves the page instead, taking
                      its form owner with it, and nothing is submitted. */}
                  {atStep < lastStep ? (
                    <Button
                      key="next"
                      type="button"
                      onClick={() => setStep((current) => Math.min(lastStep, current + 1))}
                    >
                      {t('Next')}
                      <ChevronRight data-icon="inline-end" />
                    </Button>
                  ) : (
                    <Button
                      key="save"
                      type="submit"
                      disabled={
                        busy ||
                        (activeSaved && !batchChanged.length && !activeUnchecked)
                      }
                    >
                      {activeSaved && !batchChanged.length && !activeUnchecked ? (
                        <Check />
                      ) : null}
                      {busy && activeSaved ? t('Saving…') : saveLabel}
                    </Button>
                  )}
                </div>
              </form>

              {isPhone ? null : (
                <aside className="ld-aside" aria-label={t('Source ticket')}>
                  <div>
                    <h3>{t('Original')}</h3>
                    {/* The column is as wide as the column is, and a weight
                        printed small on a photographed ticket is not readable
                        at that size. Rather than send the reviewer to another
                        screen and back for every field, the pointer carries a
                        magnifying glass over the picture: the file is far
                        larger than the box it is shown in, so what the lens
                        enlarges is detail that was already there.
                        Only over a photograph. A PDF is the browser's own
                        viewer in an iframe — drawing it twice would load it
                        twice — and the rest are words in a box, which do not
                        need magnifying. */}
                    {zoomablePreview ? (
                      <Lens
                        className="ld-aside-lens"
                        zoomFactor={1.8}
                        lensSize={190}
                        ariaLabel={t('Magnify the original ticket')}
                      >
                        <SourcePreview item={active} />
                      </Lens>
                    ) : (
                      <SourcePreview item={active} />
                    )}
                    <p className="ld-aside-note">
                      {active.source.file_name} · {fileSize(active.source.size)} ·
                      SHA-256 <code>{active.source.sha256.slice(0, 12)}</code>
                    </p>
                  </div>
                </aside>
              )}
            </div>
          </section>
        ) : null}
      </div>


      {viewingTicket && active ? (
        <TicketViewer item={active} onClose={() => setViewingTicket(false)} />
      ) : null}

      <InvoiceDialog view={invoiceView} onClose={() => setInvoiceView(null)} />

      <AlertDialog
        open={recordToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setRecordToDelete(null);
        }}
      >
        <AlertDialogContent>
          {recordToDelete ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('Delete ticket {number}?', {
                    number: recordToDelete.ticket.ticket_number ?? t('unnumbered'),
                  })}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    'This permanently removes the saved record and its stored original for everyone in your workspace, and takes its line off invoice {number}. The same file can then be uploaded again; the invoice number can be reused once every ticket on it is deleted.',
                    { number: recordToDelete.invoice.invoice_number },
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => void confirmDelete()}
                >
                  {t('Delete ticket')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
