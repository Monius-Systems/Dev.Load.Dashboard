import { env } from 'cloudflare:workers';

// The TomTom key that geocodes addresses and routes trucks for IFTA & Mileage.
//
// One credential, held by Monius, for every workspace on this deployment, kept
// exactly as the OpenAI key is (see openai-key.ts): a server variable, never a
// row in the database and never in a page, a response or a log. Which
// company's trucks are being routed is decided by the signed-in member's
// workspace, checked in the route before the key is touched.

/** The variable the key is read from. Used in setup messages; never its value. */
export const TOMTOM_KEY_NAME = 'TOMTOM_API_KEY';

/**
 * The key, trimmed, or null when it is unset or blank — an unconfigured
 * deployment then says so on the IFTA page rather than half-working.
 */
export function tomtomKey(): string | null {
  const value = (env as unknown as Record<string, string | undefined>)[TOMTOM_KEY_NAME];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}
