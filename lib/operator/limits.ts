import type { RunLimits } from './types.ts';

// Every Operator run is bounded, and the bounds are here rather than spread
// through the engine, so that they can be read in one place and pinned by one
// test. A run that reaches any of them stops and says which one it reached.
//
// The figures are for a worker with a CPU budget per request and a person
// waiting on the other end: a dozen tool calls is a thorough investigation, and
// three writes in one breath is as much as anyone should do without looking.

export const RUN_LIMITS: RunLimits = {
  maxToolCalls: 12,
  maxModelTurns: 8,
  maxWrites: 3,
  /** Past this many records one action needs a person, whatever the mode. */
  maxRecordsWithoutConfirmation: 25,
  maxRunMs: 40_000,
  maxHistoryTurns: 12,
  maxMessageChars: 4_000,
  /** What one tool result may put in front of the model. The rest is cut, and says so. */
  maxToolResultChars: 12_000,
  confirmationTtlMs: 15 * 60_000,
};
