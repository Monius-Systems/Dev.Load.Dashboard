import type { ToolDefinition } from '@/lib/operator/types';

// Every read tool the Operator has, in one list. Owned by the read-tools
// workstream: each file in this folder exports its definitions and is added
// here. The registry in ../index.ts takes this list as it is.
export const READ_TOOLS: ToolDefinition[] = [];
