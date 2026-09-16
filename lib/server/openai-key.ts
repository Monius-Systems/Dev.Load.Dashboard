import { env } from 'cloudflare:workers';
import { workspaceKeyName } from './workspace-key.ts';

// Which OpenAI key reads a workspace's tickets.
//
// Every company on this deployment is a workspace, and reading tickets costs
// money per page, so each one brings its own key and is billed for its own
// work. A & D's key reads A & D's tickets and nobody else's.
//
// The keys are server variables, never rows in the database. The app holds only
// Supabase's publishable key and works through row level security, so anything
// it can read from a table, a signed-in member of that workspace could read
// straight from Supabase with their own session. A table is the right place for
// a customer's address and the wrong place for a credential.

/** A variable's value, trimmed, or null when it is unset or blank. */
const valueOf = (name: string) => {
  const value = (env as unknown as Record<string, string | undefined>)[name];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

export { workspaceKeyName };

export type KeyLookup =
  | { key: string; name: string }
  | { key: null; name: string | null };

/**
 * The key to read this workspace's tickets with: its own if it has one, and
 * otherwise the shared `OPENAI_API_KEY`. Leave the shared one unset to make
 * every workspace bring its own and have an unconfigured client fail loudly
 * rather than quietly spending somebody else's allowance.
 *
 * `null` workspace is the unprotected local preview, which has no workspace and
 * uses the shared key.
 */
export function openaiKeyFor(workspaceId: string | null): KeyLookup {
  const name = workspaceId ? workspaceKeyName(workspaceId) : null;
  if (name) {
    const own = valueOf(name);
    if (own) return { key: own, name };
  }
  const shared = valueOf('OPENAI_API_KEY');
  if (shared) return { key: shared, name: 'OPENAI_API_KEY' };
  return { key: null, name };
}
