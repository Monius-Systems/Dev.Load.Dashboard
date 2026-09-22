import {
  READ_PERMISSIONS,
  isWritePermission,
  type JsonSchema,
  type ToolDefinition,
} from './types.ts';

// The toolbox, checked once at the door.
//
// Every capability the Operator has is a ToolDefinition, and every one of them
// passes through here before a model is told it exists. The checks below are
// the ones that cannot be left to the person writing the tool, because getting
// them wrong is silent: a write tool with no dry run would reach a person's
// data with nothing to preview; a high-impact tool that did not declare itself
// as always-confirmed would inherit whatever the workspace's autonomy mode
// happened to be. A registry that refuses is a deployment that fails at its
// first request, which is the loudest failure available and the right one.
//
// Nothing here runs a tool, and nothing here decides whether one may run. That
// is lib/operator/policy.ts, which reads the same registered facts.

/** One tool as the model API is told about it. Strict, so arguments match the schema. */
export type ToolSpec = {
  type: 'function';
  name: string;
  description: string;
  parameters: JsonSchema;
  strict: true;
};

export type Registry = {
  get(name: string): ToolDefinition | undefined;
  list(): ToolDefinition[];
  specs(): ToolSpec[];
};

/** A tool that cannot be registered stops the deployment rather than the run. */
export class RegistryError extends Error {}

const refuse = (name: string, why: string): never => {
  throw new RegistryError(`Tool "${name}" cannot be registered: ${why}`);
};

/**
 * The registry for a set of tools. Built once per isolate and held; building
 * it twice is harmless but pointless, and building it at import time is not
 * done anywhere, so a cold request pays for nothing it does not use.
 */
export function createRegistry(tools: ToolDefinition[]): Registry {
  const byName = new Map<string, ToolDefinition>();
  for (const tool of tools) {
    if (!tool.name.trim()) refuse('(unnamed)', 'it has no name.');
    if (byName.has(tool.name)) refuse(tool.name, 'another tool is already registered under that name.');
    if (tool.risk === 3 && tool.confirmation !== 'always') {
      refuse(tool.name, "it is a level-3 tool, which must be confirmed every time ('always').");
    }
    if (tool.type === 'write') {
      if (!tool.dryRun) refuse(tool.name, 'a write tool must have a dry run to preview itself.');
      if (!isWritePermission(tool.permission)) {
        refuse(tool.name, `a write tool needs a write permission, not "${tool.permission}".`);
      }
    } else {
      if (!(READ_PERMISSIONS as readonly string[]).includes(tool.permission)) {
        refuse(tool.name, `a read tool needs a read permission, not "${tool.permission}".`);
      }
    }
    byName.set(tool.name, tool);
  }
  const ordered = [...byName.values()];
  return {
    get: (name) => byName.get(name),
    list: () => [...ordered],
    specs: () =>
      ordered.map((tool) => ({
        type: 'function' as const,
        name: tool.name,
        description: tool.description,
        parameters: tool.input,
        strict: true as const,
      })),
  };
}
