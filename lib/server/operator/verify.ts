import type { SupabaseClient } from '@supabase/supabase-js';
import type { MileageDay } from '@/lib/load-desk/mileage';
import type { SavedRecord } from '@/lib/load-desk/types';
import { getRecord } from '@/lib/server/load-desk-store';
import { getDay } from '@/lib/server/mileage-store';

// Reading the state back after writing it.
//
// A service answering without an error is not a result. It says the call was
// accepted; it does not say the ticket now carries the figure, or that the day
// was worked out, and an agent that reported success on that basis would be
// reporting its own intentions. So every write tool in this folder reads the
// rows it wrote, through the ordinary read path, and compares what it finds
// against what it meant to do. What the re-read says is what the tool reports.
//
// The reads are narrow and bounded: one row each, never a workspace scan.

/** At most this many rows are read back in one verification. */
export const MAX_REREADS = 60;

/**
 * The saved tickets as they stand now, by id. A ticket that has gone missing
 * between the write and the read is simply absent, which the caller reports as
 * a failed check rather than as an error.
 */
export async function reReadRecords(
  client: SupabaseClient,
  workspace: string,
  ids: number[],
): Promise<Map<number, SavedRecord>> {
  const wanted = [...new Set(ids)].slice(0, MAX_REREADS);
  const found = new Map<number, SavedRecord>();
  for (const id of wanted) {
    const record = await getRecord(client, workspace, id);
    if (record) found.set(id, record);
  }
  return found;
}

/** One truck-day as it stands now, or null when it no longer has a row. */
export async function reReadDay(
  client: SupabaseClient,
  workspace: string,
  truckId: number,
  date: string,
): Promise<MileageDay | null> {
  return getDay(client, workspace, truckId, date);
}
