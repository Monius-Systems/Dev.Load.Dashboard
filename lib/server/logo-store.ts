import type { SupabaseClient } from '@supabase/supabase-js';
import { ORIGINALS_BUCKET, StoreError } from '@/lib/server/load-desk-store';

// The company logo lives in the workspace's private bucket under
// <workspace>/logo/<version>, so the existing storage policies (members of this
// workspace only) cover it. Each upload gets a new version name, because
// members may add and delete files but not overwrite them.
//
// One logo per workspace, not per member: it stands for the company, so
// whoever uploads it, everyone signed in to that workspace sees it.

export const MAX_LOGO_BYTES = 2_000_000;
export const LOGO_VERSION = /^[a-z0-9]{8,40}$/;

const folder = (workspace: string) => `${workspace}/logo`;

/** Stores a logo as a new version and returns the version name. */
export async function saveLogo(
  client: SupabaseClient,
  workspace: string,
  body: ArrayBuffer,
  contentType: string,
): Promise<string> {
  const version = `${Date.now().toString(36)}${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
  const { error } = await client.storage
    .from(ORIGINALS_BUCKET)
    .upload(`${folder(workspace)}/${version}`, body, { contentType, upsert: false });
  if (error) throw new StoreError('Could not save the logo. Please try again.', 503);
  return version;
}

export async function loadLogo(
  client: SupabaseClient,
  workspace: string,
  version: string,
): Promise<Blob | null> {
  const { data, error } = await client.storage
    .from(ORIGINALS_BUCKET)
    .download(`${folder(workspace)}/${version}`);
  return error ? null : data;
}

/** Deletes every stored logo except `keep` (all of them when null). */
export async function removeLogos(
  client: SupabaseClient,
  workspace: string,
  keep: string | null,
): Promise<void> {
  const bucket = client.storage.from(ORIGINALS_BUCKET);
  const { data, error } = await bucket.list(folder(workspace), { limit: 100 });
  if (error) return;
  const stale = (data ?? [])
    .map((item) => item.name)
    .filter((name) => name !== keep)
    .map((name) => `${folder(workspace)}/${name}`);
  if (stale.length) await bucket.remove(stale);
}
