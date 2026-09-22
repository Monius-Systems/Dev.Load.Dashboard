import { createRegistry, type Registry } from '@/lib/operator/registry';
import type { ToolDefinition } from '@/lib/operator/types';
import { ACTION_TOOLS } from './actions/index';
import { READ_TOOLS } from './read/index';

// The whole toolbox, as the registry receives it. Reads first, then writes.
export const ALL_TOOLS: ToolDefinition[] = [...READ_TOOLS, ...ACTION_TOOLS];

/**
 * The registry, built on first use and held for the life of the isolate. The
 * checks in `createRegistry` are worth running, but they are worth running once
 * per worker rather than once per request, and nothing at all on a cold start
 * that never reaches the Operator.
 */
let registry: Registry | null = null;

export function toolRegistry(): Registry {
  registry ??= createRegistry(ALL_TOOLS);
  return registry;
}
