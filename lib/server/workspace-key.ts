// Which server variable holds a workspace's OpenAI key. Kept free of server
// imports, like website-sign-in.ts, so it can be tested.

/**
 * The variable a workspace's key is set in: `ad-trucking-chicago` reads its
 * tickets with `OPENAI_API_KEY_AD_TRUCKING_CHICAGO`. Workspace ids are
 * lowercase with dashes (see CLIENT-LAUNCH.md), and anything else a workspace
 * id could contain is folded to an underscore so the name is always a legal
 * environment variable. Null when nothing usable is left, because one name
 * shared by every such workspace would be worse than none.
 */
export function workspaceKeyName(workspaceId: string): string | null {
  const suffix = workspaceId
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return suffix ? `OPENAI_API_KEY_${suffix}` : null;
}
