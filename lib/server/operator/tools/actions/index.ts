import type { ToolDefinition } from '@/lib/operator/types';

// Every write tool the Operator has, in one list. Owned by the action-tools
// workstream. Each of these wraps an existing service, previews itself with a
// dry run, and verifies itself by reading the state again afterwards.
export const ACTION_TOOLS: ToolDefinition[] = [];
