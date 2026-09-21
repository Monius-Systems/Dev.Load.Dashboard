import { apiJson, dataMode } from './data-mode.ts';
import { setLearnedConfusions } from './recovery/misread.ts';
import type { Misread } from './recovery/learned.ts';

// The browser's side of the shared misread counts: loaded once so the
// misread rule knows what people across the deployment have corrected, and
// added to whenever a person types over a misread here. Quiet on every
// failure — learning is a nicety, and a save is not.

let loaded = false;

/** Teaches the misread rule what the deployment has learned. Once per page. */
export async function loadLearnedMisreads(): Promise<void> {
  if (loaded) return;
  loaded = true;
  if ((await dataMode()) !== 'remote') return;
  const result = await apiJson<{
    pairs: { vendor: string; field: string; read: string; actual: string; count: number }[];
  }>(
    '/api/learn/misreads',
  );
  if (result.ok) setLearnedConfusions(result.data.pairs);
}

/** Notes one misread a person has just corrected. Never throws. */
export async function noteMisread(misread: Misread | null): Promise<void> {
  if (!misread) return;
  if ((await dataMode()) !== 'remote') return;
  await apiJson('/api/learn/misreads', { method: 'POST', body: JSON.stringify(misread) });
}
