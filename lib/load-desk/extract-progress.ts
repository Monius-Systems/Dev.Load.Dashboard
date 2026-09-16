// One steady percentage for ticket extraction. Each page is opened, then read,
// and the reading is one request whose progress is not reported from inside.
// This maps each step onto its share of the file and never lets the result go
// backwards.

/** Each step over one page, its share of that page's work, and its label. Shares add up to 1. */
export const PAGE_STEPS = [
  ['render', 0.15, 'Opening page'],
  ['read', 0.85, 'Reading the ticket'],
] as const;

export type PageStep = (typeof PAGE_STEPS)[number][0];

/**
 * Reserved before any page is read. Nothing is loaded up front now that the
 * reading happens on the server, so the bar starts at the first page.
 */
export const START_SHARE = 0;

export type FileProgress = { fraction: number; label: string };

const clamp = (value: number) =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;

/** Tracks one file. `report` receives how much of the file is done (0 to 1). */
export function createFileProgress(report: (update: FileProgress) => void) {
  let pages = 1;
  let last = 0;
  const emit = (fraction: number, label: string) => {
    last = Math.max(last, clamp(fraction));
    report({ fraction: last, label });
  };
  return {
    setPages(count: number) {
      pages = Math.max(1, Math.floor(count) || 1);
    },
    /** Progress (0 to 1) through one pass on a 1-based page. */
    step(page: number, step: PageStep, progress: number) {
      let before = 0;
      let share = 0;
      let label = '';
      for (const [name, weight, text] of PAGE_STEPS) {
        if (name === step) {
          share = weight;
          label = text;
          break;
        }
        before += weight;
      }
      const pageIndex = Math.min(pages, Math.max(1, Math.floor(page) || 1)) - 1;
      emit(
        START_SHARE +
          ((1 - START_SHARE) * (pageIndex + before + share * clamp(progress))) / pages,
        pages > 1 ? `${label} · page ${pageIndex + 1} of ${pages}` : label,
      );
    },
    done() {
      emit(1, 'Done');
    },
  };
}

/** Whole-batch percentage (0-100) while file `index` (0-based) is `fraction` done. */
export function batchPercent(index: number, total: number, fraction: number) {
  if (total <= 0) return 0;
  const finished = Math.min(Math.max(0, index), total);
  return Math.min(100, Math.floor(((finished + clamp(fraction)) / total) * 100));
}
