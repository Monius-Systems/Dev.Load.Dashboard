import type { SupabaseClient } from '@supabase/supabase-js';
import { invoiceKeyOf } from '@/lib/load-desk/record-input';
import { getLock, listLocks } from '@/lib/server/rates-store';

// The one question every Operator write about a ticket has to ask first: is
// the invoice it is on finalized?
//
// What a finalized invoice says is what the customer was billed. The pricing
// engine already refuses to touch one (see `ticketEdits`), but `updateRecords`
// does not — it is the plain save path, and a correction typed in review goes
// through it. An agent writing through that path would therefore change a
// billed figure with nothing in its way, which is exactly the failure that
// would end the feature. So the check is made here, before the write, by every
// tool that touches a ticket, and a record on a locked invoice is reported as
// not attempted rather than quietly skipped or silently failed.
//
// A lock is in force when the row exists and has not been unlocked: an invoice
// somebody opened again is an ordinary invoice.

/** Every invoice key the workspace has finalized and not unlocked since. */
export async function finalizedKeys(
  client: SupabaseClient,
  workspace: string,
): Promise<Set<string>> {
  const locks = await listLocks(client, workspace);
  return new Set(
    locks.filter((lock) => lock.unlocked_at === null).map((lock) => lock.invoice_key),
  );
}

/**
 * Whether one invoice is finalized, by the key a ticket's invoice number makes
 * — the same normalisation the lock was stored under, so an invoice is the
 * same invoice however its number was typed.
 */
export async function isFinalized(
  client: SupabaseClient,
  workspace: string,
  invoiceKey: string,
): Promise<boolean> {
  const lock = await getLock(client, workspace, invoiceKeyOf(invoiceKey));
  return lock !== null && lock.unlocked_at === null;
}
