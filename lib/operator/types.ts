// Monius Operator: the one file every part of it agrees on.
//
// The Operator is the operational intelligence layer over the dashboard. A
// model reads the business, investigates, and proposes or performs work —
// but only ever through the tools registered here, each of which wraps an
// existing deterministic service. The model supplies judgement; the app
// supplies every figure, every rule, and every write.
//
// Nothing in this file touches a database or a network. It is the contract
// between the run engine, the tools, the policy, the audit trail and the
// panel, so that each of them can be built and tested apart and still fit.
// Isomorphic: imported by both server and client code.

// ------------------------------------------------------------- permissions

/**
 * What the Operator may be allowed to do in a workspace. Reads are always
 * granted; each write is granted by a person in the workspace's Operator
 * settings, and enforced on the server before any tool runs. The model has no
 * way to add to this list: a permission is a fact about the workspace, never a
 * conclusion the model reaches.
 */
export const READ_PERMISSIONS = [
  'tickets.read',
  'invoices.read',
  'customers.read',
  'rates.read',
  'mileage.read',
  'ifta.read',
  'system.read',
] as const;

export const WRITE_PERMISSIONS = [
  'tickets.reprocess',
  'tickets.correct',
  'exceptions.resolve',
  'mileage.recalculate',
  'invoices.recalculate',
  'rates.draft',
] as const;

export type ReadPermission = (typeof READ_PERMISSIONS)[number];
export type WritePermission = (typeof WRITE_PERMISSIONS)[number];
export type OperatorPermission = ReadPermission | WritePermission;

export const isWritePermission = (value: string): value is WritePermission =>
  (WRITE_PERMISSIONS as readonly string[]).includes(value);
export const isOperatorPermission = (value: string): value is OperatorPermission =>
  (READ_PERMISSIONS as readonly string[]).includes(value) || isWritePermission(value);

// -------------------------------------------------------------- risk levels

/**
 * How much a tool can cost if it is wrong.
 *
 * 0 — reads only: search, inspect, explain, preview.
 * 1 — safe and reversible: reprocess, recalculate, draft, note.
 * 2 — changes business data: correct tickets, move a job, re-price a draft.
 * 3 — high impact: send, finalize, delete, unlock, change users or settings.
 *     Level 3 ALWAYS requires a person to confirm, in every autonomy mode.
 *     V1 registers no level-3 tools; the policy still encodes the rule.
 */
export type RiskLevel = 0 | 1 | 2 | 3;

/**
 * When a tool asks before it acts.
 * - 'never'       — reads, which act on nothing.
 * - 'conditional' — decided by policy from autonomy mode, permission, impact.
 * - 'always'      — a person confirms every time, whatever the mode.
 * A level-3 tool may only ever be 'always'; the registry refuses otherwise.
 */
export type ConfirmationMode = 'never' | 'conditional' | 'always';

// ------------------------------------------------------------ autonomy mode

/**
 * How far the Operator may go on its own in a workspace.
 * - assist:     investigate, explain, recommend; every write is confirmed.
 * - controlled: granted level-1 writes run; anything higher is confirmed.
 * - autonomous: granted level-1/2 writes run within record limits; level 3
 *               is still confirmed, always.
 * DEV default is 'assist'.
 */
export type AutonomyMode = 'assist' | 'controlled' | 'autonomous';
export const AUTONOMY_MODES: readonly AutonomyMode[] = ['assist', 'controlled', 'autonomous'];
export const DEFAULT_AUTONOMY: AutonomyMode = 'assist';

/** A workspace's Operator settings, as the server stores and enforces them. */
export type OperatorSettings = {
  autonomy: AutonomyMode;
  /** Writes a person in the workspace has granted. Reads need no grant. */
  granted: WritePermission[];
  updated_at: string | null;
  updated_by: string | null;
};

export const DEFAULT_SETTINGS: OperatorSettings = {
  autonomy: DEFAULT_AUTONOMY,
  granted: [],
  updated_at: null,
  updated_by: null,
};

// ------------------------------------------------------------- entity refs

/** The things the Operator talks about, so the panel can make each one a link. */
export type EntityType =
  | 'ticket'
  | 'invoice'
  | 'customer'
  | 'client'
  | 'project'
  | 'truck'
  | 'mileage_day'
  | 'rate_request'
  | 'rate_period'
  | 'exception';

export type EntityRef = {
  type: EntityType;
  /** The app's own identifier: a record id, an invoice key, a "truck|date". */
  id: string;
  /** What a person calls it: "Invoice #284", "Truck 321", "Five Construction". */
  label: string;
  /** Where the dashboard shows it, or null when no page does yet. */
  href: string | null;
};

// -------------------------------------------------------------- JSON schema

/**
 * The subset of JSON Schema a tool's input and output are described in. Kept
 * to what the model API accepts in strict mode: objects with every property
 * required, no additional properties, and plain scalar/array/enum types.
 */
export type JsonSchema = {
  type: 'object' | 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'null' | string[];
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  additionalProperties?: false;
  items?: JsonSchema;
  enum?: (string | number | null)[];
  minimum?: number;
  maximum?: number;
  maxLength?: number;
  maxItems?: number;
};

// ------------------------------------------------------------------- tools

/**
 * Who is asking, as the server established it. Passed to every tool handler.
 * The workspace here is the ONLY workspace a tool may touch: it comes from the
 * signed-in member, never from the model, never from a request body.
 */
export type ToolContext = {
  workspaceId: string;
  userId: string;
  runId: string;
  /** Passed to every event or record the tool writes, so nothing it does can
      start another run: an Operator-made event is never an Operator trigger. */
  origin: 'operator';
  now: Date;
};

/** What a dry run says would happen, in figures a person can weigh. */
export type ToolImpact = {
  /** How many records the action would change. Drives the record limit. */
  records: number;
  /** Whether any affected record is on a finalized invoice. Stops the action. */
  touches_finalized: boolean;
  /** A short list a confirmation card can show: "3 tickets", "2 draft invoices". */
  lines: string[];
  affected: EntityRef[];
  /** Anything that makes the action unsafe as asked. Non-empty means refuse. */
  blockers: string[];
  /** A fingerprint of the state the preview was taken from, so a confirmation
      can tell whether anything changed in between. */
  state_hash: string;
};

/** How a write tool went, in the exact terms the brief asks for. */
export type ActionOutcome = 'done' | 'partial' | 'failed' | 'refused';

/**
 * What a write tool re-read after acting. Every write tool verifies by reading
 * the state again through a read path; a 200 from a service is not a result.
 */
export type Verification = {
  checked: number;
  passed: number;
  /** One line per check that failed, in plain words. Empty when all passed. */
  failures: string[];
};

export type ReadResult = {
  kind: 'read';
  /** What the model is shown. Bounded by MAX_TOOL_RESULT_CHARS in the engine. */
  data: unknown;
  /** One sentence the panel shows as activity: "Found 84 tickets." */
  summary: string;
  entities: EntityRef[];
};

export type ActionResult = {
  kind: 'action';
  outcome: ActionOutcome;
  /** Exactly what happened, in three lists, so partial success is never silent. */
  succeeded: EntityRef[];
  failed: { entity: EntityRef; reason: string }[];
  not_attempted: EntityRef[];
  verification: Verification;
  /** For the audit row: what changed, where a tool can say. Never a whole record. */
  before?: unknown;
  after?: unknown;
  summary: string;
  entities: EntityRef[];
};

export type ToolResult = ReadResult | ActionResult;

/**
 * One capability the Operator has. Registered once, in the central registry;
 * future modules add capabilities by adding a definition, not by teaching the
 * model anything.
 *
 * `handler` for a read tool returns a ReadResult. For a write tool it performs
 * the action AND verifies it, returning an ActionResult. `dryRun` previews
 * what the action would do without doing it; the engine calls it before any
 * confirmation card and again on confirmation, and refuses when the two
 * disagree. `execute` is never reached without policy having said so.
 */
export type ToolDefinition<Input = Record<string, unknown>> = {
  name: string;
  description: string;
  input: JsonSchema;
  /** Described for documentation and for the model; the engine does not validate output. */
  output: JsonSchema;
  type: 'read' | 'write';
  permission: OperatorPermission;
  risk: RiskLevel;
  confirmation: ConfirmationMode;
  /** The most records one call may touch, where that is meaningful. */
  maxRecords?: number;
  /** Parses the model's arguments. Returns an error string for anything invalid. */
  parse: (args: unknown) => { value: Input } | { error: string };
  /** Reads only. Required for write tools; undefined for reads. */
  dryRun?: (input: Input, ctx: ToolContext, deps: ToolDeps) => Promise<ToolImpact>;
  handler: (input: Input, ctx: ToolContext, deps: ToolDeps) => Promise<ToolResult>;
};

/**
 * What a tool needs from the server that is not its arguments: the signed-in
 * member's Supabase client (RLS applies as them), and the routing provider
 * where one is configured. Kept loose here so this file stays isomorphic;
 * the engine builds it, and the server-side tool files narrow it.
 */
export type ToolDeps = {
  client: unknown;
  routing: unknown;
};

// ------------------------------------------------------------------ policy

export type PolicyInput = {
  tool: Pick<ToolDefinition, 'name' | 'type' | 'permission' | 'risk' | 'confirmation' | 'maxRecords'>;
  settings: OperatorSettings;
  /** From the dry run, when there was one. Reads have none. */
  impact: ToolImpact | null;
  /** True only on the confirm route, after a person pressed the button. */
  confirmed: boolean;
};

export type PolicyDecision =
  | { action: 'run' }
  | { action: 'confirm'; reason: string }
  | { action: 'deny'; reason: string };

// ----------------------------------------------------------- runs & audit

export type RunStatus = 'running' | 'completed' | 'awaiting_confirmation' | 'failed' | 'limited';

/** One tool call as the panel shows it and the run stores it. No reasoning. */
export type ActivityItem = {
  at: string;
  tool: string;
  kind: 'read' | 'write' | 'denied' | 'confirm';
  summary: string;
};

/**
 * A finished run as a list shows it: no activity, no page context, no input,
 * and never a word of what the model thought on the way. The panel's run list
 * and the server's store agree on this one shape, which is why it lives here
 * rather than beside the queries that read it.
 */
export type RunSummary = {
  id: string;
  user_id: string;
  request: string;
  status: RunStatus;
  started_at: string;
  finished_at: string | null;
  summary: string;
  entities: EntityRef[];
  error: string | null;
  tool_calls: number;
  writes: number;
};

/** A write the run wanted but policy said a person must confirm first. */
export type PendingConfirmation = {
  id: string;
  run_id: string;
  tool: string;
  /** The tool's parsed arguments, exactly as it will run them. */
  input: Record<string, unknown>;
  impact: ToolImpact;
  risk: RiskLevel;
  reason: string;
  expires_at: string;
};

/** What the panel receives for one turn. */
export type OperatorResponse = {
  run_id: string;
  status: RunStatus;
  /** The Operator's reply, concise and operational. */
  text: string;
  activity: ActivityItem[];
  entities: EntityRef[];
  actions: ActionResult[];
  pending: PendingConfirmation | null;
  /** Set when a limit ended the run early, in plain words. */
  limited: string | null;
};

/** What the panel sends. `history` is bounded by the engine; the server keeps no chat state. */
export type OperatorTurn = { role: 'user' | 'operator'; text: string };

export type PageContext = {
  /** The dashboard page the person is on, for suggestions and framing. */
  page: string;
  /** The entity the person is looking at, when there is one. */
  entity: EntityRef | null;
};

export type OperatorRequest = {
  message: string;
  context: PageContext | null;
  history: OperatorTurn[];
};

/** The audit row every write leaves, whether it succeeded or not. */
export type AuditEntry = {
  run_id: string;
  tool: string;
  risk: RiskLevel;
  confirmation: 'auto' | 'confirmed';
  entity_type: EntityType | null;
  entity_id: string | null;
  before: unknown;
  after: unknown;
  reason: string;
  outcome: ActionOutcome;
  verification: Verification;
  at: string;
};

// ------------------------------------------------------------------ limits

/** Every run is bounded. The numbers live in lib/operator/limits.ts. */
export type RunLimits = {
  maxToolCalls: number;
  maxModelTurns: number;
  maxWrites: number;
  maxRecordsWithoutConfirmation: number;
  maxRunMs: number;
  maxHistoryTurns: number;
  maxMessageChars: number;
  maxToolResultChars: number;
  confirmationTtlMs: number;
};
