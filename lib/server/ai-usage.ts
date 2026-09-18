// What one model request cost, and who it was for.
//
// Now that every workspace reads on the same Monius key, the bill arrives as one
// number, so what a company spent has to be counted here rather than read off
// separate OpenAI accounts. Nothing is stored yet; this is the shape and the one
// call site, so adding the ledger later is a write in `recordAiUsage` and not a
// change to the request path.

export type AiUsage = {
  /** The signed-in user who asked. Null only in the unprotected local preview. */
  userId: string | null;
  /** The company the read was for, which is who the cost belongs to. */
  workspaceId: string | null;
  /** Which kind of request this was, so later kinds are told apart. */
  requestType: 'load-ticket-extraction';
  model: string;
  /** Null when the model answered without telling us what it counted. */
  inputTokens: number | null;
  outputTokens: number | null;
  at: string;
};

/**
 * Notes one request's usage. A no-op until there is somewhere to put it: the
 * cost in money is a function of `model` and the token counts, so it is worked
 * out wherever this is written rather than frozen into a price here.
 *
 * Deliberately silent. Token counts per customer are not log material, and a
 * failure to count must never fail a ticket the customer already paid for.
 */
export function recordAiUsage(usage: AiUsage): void {
  void usage;
}
