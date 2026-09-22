import { apiJson, dataMode, type DataMode } from './data-mode.ts';
import { RUN_LIMITS } from '../operator/limits.ts';
import { getPanelSnapshot } from '../operator/panel-store.ts';
import type {
  ActionResult,
  ActivityItem,
  AutonomyMode,
  EntityRef,
  OperatorResponse,
  OperatorSettings,
  OperatorTurn,
  PendingConfirmation,
  RunStatus,
  RunSummary,
  WritePermission,
} from '../operator/types.ts';

// The conversation with the Operator, in the shape of the other stores in this
// folder: one snapshot, subscribers, and the calls that change it.
//
// It lives outside React because the panel is opened and closed all day and a
// conversation is not something a person expects to lose by closing a drawer;
// and because the trigger in the top bar shows that a run is going while the
// panel that started it is shut.
//
// The server keeps no chat state. What it is told is this store's last few
// turns, bounded here to the same number the engine bounds them to, so that a
// long afternoon of questions never grows the request. Nothing here fetches
// until somebody opens the panel and asks.

export type UserTurn = { id: string; role: 'user'; text: string };

export type AnswerTurn = {
  id: string;
  role: 'operator';
  text: string;
  status: RunStatus;
  activity: ActivityItem[];
  entities: EntityRef[];
  actions: ActionResult[];
  /** Set when a limit ended the run early, in the server's plain words. */
  limited: string | null;
  /**
   * Written by the panel rather than by the server — "nothing was changed"
   * after a confirmation is turned down. The panel translates these and shows
   * the server's own text as it came.
   */
  local?: true;
};

export type PanelTurn = UserTurn | AnswerTurn;

export type OperatorSnapshot = {
  turns: PanelTurn[];
  pending: PendingConfirmation | null;
  busy: boolean;
  /** What went wrong with the last call, in words a person can read. */
  error: string | null;
  /** The deployment has no model configured: a 503 from the run route. */
  notConfigured: boolean;
  /** Where this session keeps its data; the panel needs the server. */
  mode: DataMode | null;
  settings: OperatorSettings | null;
  permissions: { reads: string[]; writes: string[] } | null;
  modes: AutonomyMode[];
  settingsBusy: boolean;
  settingsError: string | null;
  runs: RunSummary[] | null;
  runsBusy: boolean;
};

const SERVER_SNAPSHOT: OperatorSnapshot = {
  turns: [],
  pending: null,
  busy: false,
  error: null,
  notConfigured: false,
  mode: null,
  settings: null,
  permissions: null,
  modes: [],
  settingsBusy: false,
  settingsError: null,
  runs: null,
  runsBusy: false,
};

let snapshot: OperatorSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function publish(next: OperatorSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

export function subscribeOperator(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getOperatorSnapshot = () => snapshot;
export const getServerOperatorSnapshot = () => SERVER_SNAPSHOT;

/**
 * Which conversation an answer belongs to. "New conversation" moves this on,
 * so a run started before it lands in nothing rather than in the fresh one.
 */
let generation = 0;

let nextId = 0;
const idOf = (role: string) => `${role}-${(nextId += 1)}`;

// ------------------------------------------------------------ pure helpers

/**
 * The turns the server is told about: the most recent ones, oldest first, and
 * never more than the engine itself will keep. Notes the panel wrote to itself
 * are part of the conversation a person sees, so they go too.
 */
export function boundHistory(turns: readonly PanelTurn[]): OperatorTurn[] {
  const kept = turns.slice(-RUN_LIMITS.maxHistoryTurns);
  return kept.map((turn) => ({ role: turn.role, text: turn.text }));
}

/**
 * One chip per thing, however many tools mentioned it. Tools that look at the
 * same invoice from three directions each name it, and a row of the same chip
 * three times says nothing the first one did not. The first mention wins: it
 * is the one whose label the answer was written around.
 */
export function mergeEntities(entities: readonly EntityRef[]): EntityRef[] {
  const seen = new Set<string>();
  const kept: EntityRef[] = [];
  for (const entity of entities) {
    if (!entity || typeof entity.id !== 'string' || !entity.label) continue;
    const key = `${entity.type}:${entity.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(entity);
  }
  return kept;
}

/**
 * Where a chip may send somebody. An entity's href is a path inside this
 * dashboard, so anything that is not one — an absolute address, a scheme, a
 * protocol-relative path — is not followed at all: the chip is drawn as plain
 * text instead. The server writes these hrefs, but the panel is the last place
 * that can refuse to make a link out of one.
 */
export function safeHref(href: string | null | undefined): string | null {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return null;
  return href;
}

/** An answer turn built from whatever the server actually sent. */
function answerOf(response: OperatorResponse): AnswerTurn {
  return {
    id: idOf('operator'),
    role: 'operator',
    text: typeof response.text === 'string' ? response.text : '',
    status: response.status,
    activity: Array.isArray(response.activity) ? response.activity : [],
    entities: mergeEntities(Array.isArray(response.entities) ? response.entities : []),
    actions: Array.isArray(response.actions) ? response.actions : [],
    limited: response.limited ?? null,
  };
}

/** A line the panel says to itself, in English, for the panel to translate. */
function note(text: string): AnswerTurn {
  return {
    id: idOf('note'),
    role: 'operator',
    text,
    status: 'completed',
    activity: [],
    entities: [],
    actions: [],
    limited: null,
    local: true,
  };
}

// ------------------------------------------------------------ the two calls

/** Where this session keeps its data, asked once, when the panel first opens. */
export async function loadMode(): Promise<DataMode> {
  if (snapshot.mode) return snapshot.mode;
  const mode = await dataMode();
  publish({ ...snapshot, mode });
  return mode;
}

/**
 * Asks the Operator something. A second question while one is in flight is
 * ignored rather than queued: the run carries the conversation with it, and
 * two runs on the same history would each answer half of it.
 */
export async function ask(message: string): Promise<void> {
  const text = message.trim();
  if (!text || snapshot.busy) return;
  if ((await loadMode()) !== 'remote') return;
  const mine = generation;
  const history = boundHistory(snapshot.turns);
  publish({
    ...snapshot,
    turns: [...snapshot.turns, { id: idOf('you'), role: 'user', text }],
    pending: null,
    busy: true,
    error: null,
  });
  const result = await apiJson<OperatorResponse>('/api/operator/run', {
    method: 'POST',
    body: JSON.stringify({
      message: text.slice(0, RUN_LIMITS.maxMessageChars),
      context: getPanelSnapshot().context,
      history,
    }),
  });
  if (mine !== generation) return;
  if (!result.ok) {
    publish({
      ...snapshot,
      busy: false,
      error: result.error,
      notConfigured: result.status === 503,
    });
    return;
  }
  publish({
    ...snapshot,
    turns: [...snapshot.turns, answerOf(result.data)],
    pending: result.data.pending ?? null,
    busy: false,
    error: null,
    notConfigured: false,
  });
}

/**
 * The person pressed Confirm. The server decides again — the permission, the
 * policy and the preview are all re-checked there — so a 409 here means the
 * world moved while the card was on screen, and the card goes with it.
 */
export async function confirmAction(actionId: string): Promise<void> {
  if (snapshot.busy || !snapshot.pending) return;
  const mine = generation;
  publish({ ...snapshot, busy: true, error: null });
  const result = await apiJson<OperatorResponse>('/api/operator/confirm', {
    method: 'POST',
    body: JSON.stringify({ action_id: actionId }),
  });
  if (mine !== generation) return;
  if (!result.ok) {
    publish({
      ...snapshot,
      busy: false,
      pending: result.status === 409 ? null : snapshot.pending,
      error: result.error,
      notConfigured: result.status === 503,
    });
    return;
  }
  publish({
    ...snapshot,
    turns: [...snapshot.turns, answerOf(result.data)],
    pending: result.data.pending ?? null,
    busy: false,
    error: null,
  });
}

/** "Not now": the card goes and the conversation says so. Nothing is sent. */
export function cancelPending() {
  if (!snapshot.pending) return;
  publish({
    ...snapshot,
    pending: null,
    turns: [...snapshot.turns, note('Okay — nothing was changed.')],
  });
}

/**
 * Puts an answer the store did not ask for into the conversation.
 *
 * Everything else here asks a question and lands its own answer. A standing
 * inspection is a question nobody typed — the settings view presses "Run now"
 * and the server answers in exactly the shape a turn answers in — so it lands
 * here, in the conversation, where the person reads every other answer. It is
 * written as one call rather than left to the view because the conversation is
 * this module's, and a view that published into it would be a second writer.
 */
export function pushResponse(response: OperatorResponse): void {
  publish({
    ...snapshot,
    turns: [...snapshot.turns, answerOf(response)],
    pending: response.pending ?? null,
    error: null,
    notConfigured: false,
  });
}

/**
 * Runs one standing inspection now, on demand, and lands its answer in the
 * conversation. Nothing calls this on a page load or a timer: it exists so
 * that a person can ask a question that is otherwise only asked on a rhythm.
 * Returns the error in plain words, or null when the answer arrived.
 */
export async function runInspection(name: string): Promise<string | null> {
  if (snapshot.busy) return null;
  if ((await loadMode()) !== 'remote') return 'The Operator works on the server.';
  publish({ ...snapshot, busy: true, error: null });
  const result = await apiJson<OperatorResponse>('/api/operator/inspections', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  if (!result.ok) {
    publish({
      ...snapshot,
      busy: false,
      error: result.error,
      notConfigured: result.status === 503,
    });
    return result.error;
  }
  publish({ ...snapshot, busy: false });
  pushResponse(result.data);
  return null;
}

/** Starts again. Anything still in flight lands in the conversation it left. */
export function reset() {
  generation += 1;
  publish({ ...snapshot, turns: [], pending: null, busy: false, error: null });
}

// --------------------------------------------------------------- settings

const asStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const asModes = (value: unknown): AutonomyMode[] =>
  asStrings(value).filter(
    (mode): mode is AutonomyMode =>
      mode === 'assist' || mode === 'controlled' || mode === 'autonomous',
  );

type SettingsAnswer = {
  settings: OperatorSettings;
  permissions?: { reads?: unknown; writes?: unknown };
  modes?: unknown;
};

/** Read when the panel first opens, so the header can say which mode it is in. */
export async function loadSettings(): Promise<void> {
  if (snapshot.settingsBusy) return;
  if ((await loadMode()) !== 'remote') return;
  publish({ ...snapshot, settingsBusy: true, settingsError: null });
  const result = await apiJson<SettingsAnswer>('/api/operator/settings');
  if (!result.ok) {
    publish({ ...snapshot, settingsBusy: false, settingsError: result.error });
    return;
  }
  publish({
    ...snapshot,
    settingsBusy: false,
    settingsError: null,
    settings: result.data.settings,
    permissions: {
      reads: asStrings(result.data.permissions?.reads),
      writes: asStrings(result.data.permissions?.writes),
    },
    modes: asModes(result.data.modes),
  });
}

/** Saves what the settings view has on screen. True when the server took it. */
export async function saveSettings(patch: {
  autonomy?: AutonomyMode;
  granted?: WritePermission[];
}): Promise<boolean> {
  if (snapshot.settingsBusy) return false;
  publish({ ...snapshot, settingsBusy: true, settingsError: null });
  const result = await apiJson<{ settings: OperatorSettings }>('/api/operator/settings', {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
  if (!result.ok) {
    publish({ ...snapshot, settingsBusy: false, settingsError: result.error });
    return false;
  }
  publish({
    ...snapshot,
    settingsBusy: false,
    settingsError: null,
    settings: result.data.settings ?? snapshot.settings,
  });
  return true;
}

/** The entities a run row carries, keeping only the ones that read as one. */
const asEntities = (value: unknown): EntityRef[] =>
  (Array.isArray(value) ? value : []).flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const ref = entry as Record<string, unknown>;
    if (typeof ref.type !== 'string' || typeof ref.id !== 'string') return [];
    return [
      {
        type: ref.type as EntityRef['type'],
        id: ref.id,
        label: typeof ref.label === 'string' ? ref.label : ref.id,
        href: typeof ref.href === 'string' ? ref.href : null,
      },
    ];
  });

const RUN_STATUSES: readonly RunStatus[] = [
  'running',
  'completed',
  'awaiting_confirmation',
  'failed',
  'limited',
];

/**
 * One past run, read the way this file reads everything the server sends: a
 * row that is missing a field, or holding a status this build has never heard
 * of, becomes a run that reads sensibly rather than a list that fails to draw.
 * The shape is the shared one in lib/operator/types.ts — there is one run shape
 * in this app, and the tolerance lives in the reader instead of a second type.
 */
const readRunSummary = (value: unknown): RunSummary | null => {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== 'string') return null;
  const text = (key: string) => (typeof row[key] === 'string' ? (row[key] as string) : null);
  const count = (key: string) => (typeof row[key] === 'number' ? (row[key] as number) : 0);
  const status = text('status');
  return {
    id: row.id,
    user_id: text('user_id') ?? '',
    request: text('request') ?? '',
    status: RUN_STATUSES.find((known) => known === status) ?? 'completed',
    started_at: text('started_at') ?? '',
    finished_at: text('finished_at'),
    summary: text('summary') ?? '',
    entities: asEntities(row.entities),
    error: text('error'),
    tool_calls: count('tool_calls'),
    writes: count('writes'),
  };
};

/** The last few runs, read when the settings view is opened and not before. */
export async function loadRuns(): Promise<void> {
  if (snapshot.runsBusy) return;
  if ((await loadMode()) !== 'remote') return;
  publish({ ...snapshot, runsBusy: true });
  const result = await apiJson<{ runs?: unknown }>('/api/operator/runs?limit=20');
  if (!result.ok) {
    publish({ ...snapshot, runsBusy: false, runs: [] });
    return;
  }
  const rows = Array.isArray(result.data.runs) ? result.data.runs : [];
  publish({
    ...snapshot,
    runsBusy: false,
    runs: rows.map(readRunSummary).filter((run): run is RunSummary => run !== null),
  });
}
