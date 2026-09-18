import { env } from 'cloudflare:workers';

// The OpenAI key that reads load tickets.
//
// One credential, held by Monius, for every workspace on this deployment. It is
// a server variable and never a row in the database: the app holds only
// Supabase's publishable key and works through row level security, so anything
// it can read from a table, a signed-in member of that workspace could read
// straight from Supabase with their own session. A table is the right place for
// a customer's address and the wrong place for a credential.
//
// The key is not an identity. Which company's tickets are being read is decided
// by the signed-in member's workspace, checked in the route before the key is
// touched, so one shared credential mixes nothing together.

/** The variable the key is read from. Used in setup messages; never its value. */
export const OPENAI_KEY_NAME = 'OPENAI_API_KEY';

/**
 * The key, trimmed, or null when it is unset or blank — an unconfigured
 * deployment then says so at the first ticket rather than half-working.
 */
export function openaiKey(): string | null {
  const value = (env as unknown as Record<string, string | undefined>)[OPENAI_KEY_NAME];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}
