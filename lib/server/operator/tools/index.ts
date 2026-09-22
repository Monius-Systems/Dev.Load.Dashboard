import type { ToolDefinition } from '@/lib/operator/types';
import { ACTION_TOOLS } from './actions/index';
import { READ_TOOLS } from './read/index';

// The whole toolbox, as the registry receives it. Reads first, then writes.
export const ALL_TOOLS: ToolDefinition[] = [...READ_TOOLS, ...ACTION_TOOLS];
