// One steady percentage for ticket extraction. Tesseract reports 0-100% for
// each recognition pass, and every page gets several passes, so its raw numbers
// restart again and again. This maps each pass onto its share of the file and
// never lets the result go backwards.

/** Each pass over one page, its share of that page's work, and its label. Shares add up to 1. */
export const PAGE_STEPS = [
  ['render', 0.05, 'Opening page'],
  ['page', 0.45, 'Reading text'],
  ['fields', 0.3, 'Checking ticket fields'],
  ['tables', 0.2, 'Checking weights'],
] as const;

export type PageStep = (typeof PAGE_STEPS)[number][0];

/** Loading the OCR engine, once per file, before any page is read. */
export const START_SHARE = 0.1;

/** Tesseract's start-up statuses, in the order it reports them. */
const START_STATUSES = [
  'loading tesseract core',
  'initializing tesseract',
  'loading language traineddata',
  'initializing api',
];

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
    /** A Tesseract start-up event. Unknown statuses are ignored. */
    engine(status: string, progress: number) {
      const index = START_STATUSES.indexOf(status);
      if (index < 0) return;
      emit(
        (START_SHARE * (index + clamp(progress))) / START_STATUSES.length,
        'Starting text recognition',
      );
    },
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
