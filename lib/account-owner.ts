// Whether the account details remembered in this browser belong to the person
// who is signed in now. Two people share a computer far more often than they
// get their own, so nothing remembered is shown until this says so.

/**
 * True when the remembered account is this session's own.
 *
 * `cached` is the id stored with the remembered details, `session` the id the
 * server read from the sign-in cookie for this request. A remembered account
 * with no id came from the local preview, which has no session at all; it is
 * only reusable when there is still no session.
 *
 * Anything else — a different id, a session that cannot be identified, details
 * remembered before ids were stored — is somebody else's until proven
 * otherwise, and the caller must forget it.
 */
export function remembersSamePerson(
  cached: string | null | undefined,
  session: string | null | undefined,
): boolean {
  if (cached === null || cached === undefined) {
    return session === null || session === undefined;
  }
  return cached === session;
}
