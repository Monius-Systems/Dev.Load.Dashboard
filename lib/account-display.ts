// The name and photo the shell shows before the account store has loaded.
// Shared by the server (which reads them from the session so they are in the
// HTML from the first paint) and the sidebar that displays them.

/** Display-only account details: never used to decide what anyone may read. */
export type ShellAccount = {
  /**
   * Who the session belongs to. Not used to grant anything — the server checks
   * that on every request — only to tell whether details this browser
   * remembered are this person's or the last person's.
   */
  id: string | null;
  name: string | null;
  email: string | null;
  /** Where to load the profile photo from, or null to show initials. */
  avatarUrl: string | null;
};

type SessionUser = {
  id?: string | null;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

const text = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/**
 * The name and photo address carried by a signed-in session's own claims.
 * Only for display: the photo itself is fetched from /api/account/avatar,
 * which authorizes the request in the usual way.
 */
export function shellAccountFrom(user: SessionUser | null | undefined): ShellAccount | null {
  if (!user) return null;
  const metadata = user.user_metadata ?? {};
  const version = text(metadata.avatar_version);
  const name = text(metadata.full_name);
  const email = text(user.email);
  const id = text(user.id);
  // An id alone is still worth returning: it is what says whether the details
  // this browser remembered belong to the person signing in now.
  if (!id && !name && !email && !version) return null;
  return {
    id,
    name,
    email,
    avatarUrl: version ? `/api/account/avatar?v=${encodeURIComponent(version)}` : null,
  };
}
