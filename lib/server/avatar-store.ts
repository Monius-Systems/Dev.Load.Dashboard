import type { SupabaseClient } from '@supabase/supabase-js';
import { ORIGINALS_BUCKET, StoreError } from '@/lib/server/load-desk-store';

// Profile photos live in the workspace's private bucket under
// <workspace>/avatars/<user id>/<version>, so the existing storage policies
// (members of this workspace only) cover them. Each upload gets a new version
// name, because members may add and delete files but not overwrite them.

export const MAX_AVATAR_BYTES = 2_000_000;
export const AVATAR_VERSION = /^[a-z0-9]{8,40}$/;

const folder = (workspace: string, userId: string) => `${workspace}/avatars/${userId}`;

/** Stores a photo as a new version and returns the version name. */
export async function saveAvatar(
  client: SupabaseClient,
  workspace: string,
  userId: string,
  body: ArrayBuffer,
  contentType: string,
): Promise<string> {
  const version = `${Date.now().toString(36)}${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
  const { error } = await client.storage
    .from(ORIGINALS_BUCKET)
    .upload(`${folder(workspace, userId)}/${version}`, body, { contentType, upsert: false });
  if (error) throw new StoreError('Could not save your photo. Please try again.', 503);
  return version;
}

export async function loadAvatar(
  client: SupabaseClient,
  workspace: string,
  userId: string,
  version: string,
): Promise<Blob | null> {
  const { data, error } = await client.storage
    .from(ORIGINALS_BUCKET)
    .download(`${folder(workspace, userId)}/${version}`);
  return error ? null : data;
}

/** Deletes every stored photo of the user except `keep` (all of them when null). */
export async function removeAvatars(
  client: SupabaseClient,
  workspace: string,
  userId: string,
  keep: string | null,
): Promise<void> {
  const bucket = client.storage.from(ORIGINALS_BUCKET);
  const { data, error } = await bucket.list(folder(workspace, userId), { limit: 100 });
  if (error) return;
  const stale = (data ?? [])
    .map((item) => item.name)
    .filter((name) => name !== keep)
    .map((name) => `${folder(workspace, userId)}/${name}`);
  if (stale.length) await bucket.remove(stale);
}
