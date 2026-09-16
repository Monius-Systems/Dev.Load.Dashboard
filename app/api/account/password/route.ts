import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';

// Matches MIN_PASSWORD in lib/account.ts, which the Account page checks first.
const MIN_PASSWORD = 10;
// Supabase stores passwords with bcrypt, which reads at most 72 bytes.
const MAX_PASSWORD_BYTES = 72;

/**
 * Changes the signed-in member's password after confirming the current one,
 * so an unattended signed-in browser cannot be used to take over the account.
 */
export function POST(request: Request) {
  return memberRoute(
    request,
    async (client) => {
      let input: Record<string, unknown>;
      try {
        input = await boundedJson(request, 4_000);
      } catch {
        return badRequest('Enter your current and new password.');
      }
      const current = input.current_password;
      const next = input.new_password;
      if (
        typeof current !== 'string' ||
        typeof next !== 'string' ||
        !current ||
        current.length > 1024
      ) {
        return badRequest('Enter your current and new password.');
      }
      if (next.length < MIN_PASSWORD) {
        return badRequest(`Use at least ${MIN_PASSWORD} characters for the new password.`);
      }
      if (new TextEncoder().encode(next).length > MAX_PASSWORD_BYTES) {
        return badRequest(`Use at most ${MAX_PASSWORD_BYTES} characters for the new password.`);
      }
      if (next === current) {
        return badRequest('Choose a new password that is different from the current one.');
      }

      const { data } = await client.auth.getUser();
      const email = data.user?.email;
      if (!email) return badRequest('This account has no email address to confirm.');
      const confirm = await client.auth.signInWithPassword({ email, password: current });
      if (confirm.error) {
        return badRequest('Your current password is incorrect.');
      }

      const { error } = await client.auth.updateUser({ password: next });
      if (error) {
        const message =
          error.code === 'weak_password'
            ? 'That password is too easy to guess. Try a longer one.'
            : error.code === 'same_password'
              ? 'Choose a new password that is different from the current one.'
              : error.code === 'reauthentication_needed'
                ? 'For security, sign out and sign in again, then change your password.'
                : 'Could not change your password. Please try again.';
        return badRequest(message);
      }
      return Response.json({ ok: true });
    },
    { write: true },
  );
}
