import { watchForChanges } from './live.ts';
import { apiJson, dataMode, type DataMode } from './data-mode';
import { staleTicketDates, withInvoiceDate } from './invoice-dates';
import { applyRecordEdit, type RecordEdit } from './record-input';
import { findInvoiceClash, recordBatch } from './records';
import type { SavedRecord } from './types';

// Saved tickets. Signed-in members read and write the workspace database
// through /api/records, with scans in private storage via /api/originals.
// The unprotected local preview keeps records in localStorage and scans in
// IndexedDB instead; it is never available in a production build.

export type RecordsSnapshot = {
  records: SavedRecord[];
  error: string | null;
  ready: boolean;
  mode: DataMode | null;
};

/** A ticket to save; the id and whether the scan was stored come back. */
export type RecordDraft = Omit<SavedRecord, 'id' | 'original_stored'> & {
  invoice_batch_id: string;
};

const RECORDS_KEY = 'monius-demo.load-desk.records.v1';
const SERVER_SNAPSHOT: RecordsSnapshot = {
  records: [],
  error: null,
  ready: false,
  mode: null,
};

let snapshot: RecordsSnapshot = SERVER_SNAPSHOT;
let loading = false;
const listeners = new Set<() => void>();

function publish(next: RecordsSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

function isSavedRecord(value: unknown): value is SavedRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<SavedRecord>;
  return (
    typeof record.id === 'number' &&
    typeof record.ticket === 'object' &&
    record.ticket !== null &&
    typeof record.invoice?.invoice_number === 'string' &&
    typeof record.invoice?.bill_to === 'object' &&
    typeof record.source?.sha256 === 'string'
  );
}

function readLocalRecords(): RecordsSnapshot {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(RECORDS_KEY);
  } catch {
    return {
      records: [],
      error: 'Browser storage is unavailable, so tickets cannot be saved here.',
      ready: true,
      mode: 'local',
    };
  }
  if (!raw) return { records: [], error: null, ready: true, mode: 'local' };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isSavedRecord)) {
      return { records: parsed, error: null, ready: true, mode: 'local' };
    }
  } catch {
    // Reported below; stored data is never silently overwritten.
  }
  return {
    records: [],
    error: 'Saved tickets in this browser could not be read and were left untouched.',
    ready: true,
    mode: 'local',
  };
}

/**
 * Local records, with ticket dates brought in line for invoices whose date was
 * changed before ticket dates followed it (see staleTicketDates). The repair
 * is written back once; later reads find nothing to repair.
 */
function readRepairedLocalRecords(): RecordsSnapshot {
  const read = readLocalRecords();
  const repaired = read.error ? [] : staleTicketDates(read.records);
  if (!repaired.length) return read;
  const byId = new Map(repaired.map((record) => [record.id, record]));
  const records = read.records.map((record) => byId.get(record.id) ?? record);
  try {
    window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch {
    // Shown repaired anyway; the repair is tried again on the next load.
  }
  return { ...read, records };
}

async function load() {
  const mode = await dataMode();
  if (mode === 'local') {
    publish(readRepairedLocalRecords());
    return;
  }
  if (mode === 'unavailable') {
    publish({
      records: [],
      error: 'Your session has ended. Sign in again to see saved tickets.',
      ready: true,
      mode,
    });
    return;
  }
  const result = await apiJson<{ records: SavedRecord[] }>('/api/records');
  publish(
    result.ok
      ? { records: result.data.records, error: null, ready: true, mode }
      : { records: [], error: result.error, ready: true, mode },
  );
  if (!result.ok) return;
  // The same repair for the workspace database, saved like any other edit.
  const repaired = staleTicketDates(result.data.records);
  if (repaired.length) {
    void updateSavedRecords(
      repaired.map((record) => ({
        id: record.id,
        ticket: record.ticket,
        invoice: record.invoice,
        ocr_text: record.ocr_text,
        customer_profile_id: record.customer_profile_id ?? null,
        truck_id: record.truck_id ?? null,
      })),
    );
  }
}

/** One catch-up at a time; a slow answer must not stack up behind itself. */
let reloading = false;
async function reload() {
  if (reloading || snapshot.mode === 'local') return;
  reloading = true;
  try {
    await load();
  } finally {
    reloading = false;
  }
}

export function subscribeRecords(listener: () => void) {
  listeners.add(listener);
  if (!loading) {
    loading = true;
    void load();
  }
  // A ticket saved on a phone shows up here without anyone reloading.
  const stopWatching = watchForChanges(() => void reload());
  const onStorage = (event: StorageEvent) => {
    if (snapshot.mode !== 'local') return;
    if (event.key !== RECORDS_KEY && event.key !== null) return;
    publish(readRepairedLocalRecords());
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    stopWatching();
    window.removeEventListener('storage', onStorage);
  };
}

export const getRecordsSnapshot = () => snapshot;
export const getServerRecordsSnapshot = () => SERVER_SNAPSHOT;

function writeLocalRecords(records: SavedRecord[]): string | null {
  try {
    window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch {
    return 'Could not write to browser storage. Nothing was changed.';
  }
  publish({ records, error: null, ready: true, mode: 'local' });
  return null;
}

/** Local preview only: discards unreadable saved tickets in this browser. */
export function clearLocalRecords() {
  if (snapshot.mode === 'local') writeLocalRecords([]);
}

const UPLOAD_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/tiff',
  'image/webp',
  'text/plain',
]);
const uploadType = (type: string) => {
  const normalized = type === 'image/jpg' ? 'image/jpeg' : type;
  return UPLOAD_TYPES.has(normalized) ? normalized : 'application/octet-stream';
};

/**
 * Saves a ticket with its scan. On the server the scan is stored first, then
 * the record; the database refuses a duplicate page or an invoice number
 * already used by another upload.
 */
export async function saveRecord(
  draft: RecordDraft,
  original: Blob,
): Promise<{ record: SavedRecord } | { error: string }> {
  const mode = snapshot.mode ?? (await dataMode());
  if (mode === 'remote') {
    const upload = await apiJson<{ ok: true }>(
      `/api/originals/${draft.source.sha256}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': uploadType(draft.source.type) },
        body: original,
      },
    );
    if (!upload.ok) return { error: upload.error };
    const result = await apiJson<{ record: SavedRecord }>('/api/records', {
      method: 'POST',
      body: JSON.stringify({ record: { ...draft, original_stored: true } }),
    });
    if (!result.ok) return { error: result.error };
    publish({ ...snapshot, records: [result.data.record, ...snapshot.records] });
    return { record: result.data.record };
  }
  if (mode !== 'local') return { error: 'Your session has ended. Sign in again to save.' };
  if (snapshot.error) return { error: snapshot.error };
  let originalStored = true;
  try {
    await putOriginal(draft.source.sha256, original);
  } catch {
    originalStored = false;
  }
  const record: SavedRecord = {
    ...draft,
    original_stored: originalStored,
    id: snapshot.records.reduce((max, item) => Math.max(max, item.id), 0) + 1,
  };
  const error = writeLocalRecords([record, ...snapshot.records]);
  return error ? { error } : { record };
}

/**
 * Saves changes to saved tickets, all together (every ticket on an invoice
 * when its details change). Returns the updated records or an error message.
 */
export async function updateSavedRecords(
  requested: RecordEdit[],
): Promise<{ records: SavedRecord[] } | { error: string }> {
  if (!requested.length) return { records: [] };
  // Every save keeps ticket dates with a changed invoice date, whichever page
  // sent the change.
  const edits = requested.map((edit) =>
    withInvoiceDate(snapshot.records.find((record) => record.id === edit.id), edit),
  );
  const replaced = (updated: SavedRecord[]) => {
    const byId = new Map(updated.map((record) => [record.id, record]));
    return snapshot.records.map((record) => byId.get(record.id) ?? record);
  };
  if (snapshot.mode === 'remote') {
    const result = await apiJson<{ records: SavedRecord[] }>('/api/records', {
      method: 'PATCH',
      body: JSON.stringify({ edits }),
    });
    if (!result.ok) return { error: result.error };
    publish({ ...snapshot, records: replaced(result.data.records) });
    return { records: result.data.records };
  }
  if (snapshot.mode !== 'local') return { error: 'Your session has ended. Sign in again to save.' };
  if (snapshot.error) return { error: snapshot.error };
  const editedAt = new Date().toISOString();
  const updated: SavedRecord[] = [];
  for (const edit of edits) {
    const record = snapshot.records.find((item) => item.id === edit.id);
    if (!record) {
      return { error: 'A ticket you changed no longer exists. Reload and try again.' };
    }
    // Older tickets get their upload recorded, so a new invoice number stays theirs.
    const withBatch = { ...record, invoice_batch_id: recordBatch(record) };
    updated.push({ ...applyRecordEdit(withBatch, edit, editedAt), id: edit.id });
  }
  const clash = findInvoiceClash(
    snapshot.records,
    updated.map((record) => ({
      id: record.id,
      invoiceNumber: record.invoice.invoice_number,
      batchId: recordBatch(record),
    })),
  );
  if (clash) {
    return { error: `Invoice number ${clash} is already used by another upload. Choose another.` };
  }
  const error = writeLocalRecords(replaced(updated));
  return error ? { error } : { records: updated };
}

/**
 * Deletes a saved ticket, and its scan unless another saved ticket (another
 * page of the same PDF) still uses it. Returns an error message.
 */
export async function deleteSavedRecord(
  records: SavedRecord[],
  record: SavedRecord,
): Promise<string | null> {
  if (snapshot.mode === 'remote') {
    const result = await apiJson<{ ok: true }>(`/api/records/${record.id}`, {
      method: 'DELETE',
    });
    // Already gone elsewhere: drop it here too.
    if (!result.ok && result.status !== 404) return result.error;
    publish({
      ...snapshot,
      records: snapshot.records.filter((item) => item.id !== record.id),
    });
    return null;
  }
  if (snapshot.mode !== 'local') return 'Your session has ended. Sign in again.';
  const error = writeLocalRecords(records.filter((item) => item.id !== record.id));
  if (error) return error;
  const shared = records.some(
    (other) => other.id !== record.id && other.source.sha256 === record.source.sha256,
  );
  if (!shared) {
    try {
      await deleteOriginal(record.source.sha256);
    } catch {
      // The record is gone; an orphaned blob is unreachable and harmless.
    }
  }
  return null;
}

/** A saved ticket's stored original, or null when it is not stored or unreachable. */
export async function loadStoredOriginal(record: SavedRecord): Promise<Blob | null> {
  try {
    if (snapshot.mode === 'remote') {
      const response = await fetch(`/api/originals/${record.source.sha256}`, {
        cache: 'no-store',
      });
      if (response.status === 401) window.location.assign('/login');
      return response.ok ? await response.blob() : null;
    }
    return record.original_stored ? await getOriginal(record.source.sha256) : null;
  } catch {
    return null;
  }
}

/**
 * Opens a saved ticket's original in a new tab. Call it directly from a click
 * handler: the tab opens before any await, so pop-up blockers allow it.
 * Throws an Error with a user-facing message when it cannot.
 */
export async function openStoredOriginal(record: SavedRecord) {
  const opened = window.open('', '_blank');
  try {
    if (!opened) throw new Error('Allow pop-ups to open the original.');
    const blob = await loadStoredOriginal(record);
    if (!blob) throw new Error('The original is not stored for this ticket.');
    const url = URL.createObjectURL(blob);
    opened.location.href =
      url + (record.source.page ? `#page=${record.source.page}` : '');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    opened?.close();
    throw error;
  }
}

// Local preview scans, keyed by SHA-256 in IndexedDB.
const DB_NAME = 'monius-demo-load-desk';
const ORIGINALS = 'originals';

function openOriginals(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('This browser cannot store original files.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(ORIGINALS);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Could not open original storage.'));
  });
}

async function withOriginals<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openOriginals();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(ORIGINALS, mode);
      const request = run(transaction.objectStore(ORIGINALS));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () =>
        reject(transaction.error ?? new Error('Original storage failed.'));
      transaction.onabort = () =>
        reject(transaction.error ?? new Error('Original storage was aborted.'));
    });
  } finally {
    db.close();
  }
}

async function putOriginal(sha256: string, blob: Blob) {
  await withOriginals('readwrite', (store) => store.put(blob, sha256));
}

async function getOriginal(sha256: string): Promise<Blob | null> {
  const found = await withOriginals(
    'readonly',
    (store) => store.get(sha256) as IDBRequest<Blob | undefined>,
  );
  return found ?? null;
}

async function deleteOriginal(sha256: string) {
  await withOriginals('readwrite', (store) => store.delete(sha256));
}
