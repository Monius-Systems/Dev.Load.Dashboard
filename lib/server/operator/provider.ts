import type { ToolSpec } from '@/lib/operator/registry';
import { EXTRACTION_MODEL } from '@/lib/load-desk/ticket-extraction';
import { openaiKey } from '@/lib/server/openai-key';
import { env } from 'cloudflare:workers';

// The one place the Operator talks to a model, and the only place that knows
// which model it is.
//
// The run engine is given an `AgentModel` and never learns anything else about
// it: it hands over instructions, a transcript and the tool specs, and gets
// back text, tool calls and token counts. That is what makes the engine
// testable without a network and what would make a second provider a file
// rather than a rewrite. It is also what keeps the interesting rules — policy,
// dry runs, verification, audit — on this side of the wire, where a model
// cannot reach them.
//
// Written as a plain fetch to the Responses API for the same reason the ticket
// reader and the rate reader are: the client library would sit resident in the
// worker, and one POST with a JSON body is the whole of what this needs.

export type ToolCall = { id: string; name: string; arguments: string };

/**
 * One turn of the conversation as the engine keeps it. Deliberately not the
 * provider's own shape: a tool result is a role of its own here, and the
 * translation into whatever items an API wants happens below.
 */
export type ModelMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  text?: string;
  tool_call_id?: string;
  name?: string;
  tool_calls?: ToolCall[];
};

export type ModelRequest = {
  instructions: string;
  input: ModelMessage[];
  tools: ToolSpec[];
};

export type ModelResponse = {
  text: string | null;
  toolCalls: ToolCall[];
  usage: { input: number | null; output: number | null };
  model: string;
};

export interface AgentModel {
  readonly name: string;
  respond(request: ModelRequest, signal: AbortSignal): Promise<ModelResponse>;
}

/** One model call is given up on well before a run's own time limit. */
const TIMEOUT_MS = 25_000;

/** The variable a deployment may pin the Operator's model with. */
const MODEL_NAME = 'OPERATOR_MODEL';

/** What the Responses API answers with, as much of it as is read here. */
type ModelAnswer = {
  output?: {
    type?: string;
    id?: string;
    call_id?: string;
    name?: string;
    arguments?: string;
    content?: { type?: string; text?: string }[];
  }[];
  usage?: { input_tokens?: number; output_tokens?: number };
  error?: { message?: string };
};

/**
 * Whether the model takes a sampling temperature. The reasoning models refuse
 * the request outright rather than ignoring the parameter, so it is asked once
 * and the answer kept for the life of the worker — the same trick, for the
 * same reason, as the ticket reader and the rate reader.
 */
let sendsTemperature = true;

/** The engine's transcript as Responses API input items. */
function inputItems(messages: ModelMessage[]): unknown[] {
  const items: unknown[] = [];
  for (const message of messages) {
    if (message.role === 'tool') {
      items.push({
        type: 'function_call_output',
        call_id: message.tool_call_id ?? '',
        output: message.text ?? '',
      });
      continue;
    }
    if (message.text?.trim()) {
      const part = message.role === 'assistant' ? 'output_text' : 'input_text';
      items.push({ role: message.role, content: [{ type: part, text: message.text }] });
    }
    for (const call of message.tool_calls ?? []) {
      items.push({
        type: 'function_call',
        call_id: call.id,
        name: call.name,
        arguments: call.arguments,
      });
    }
  }
  return items;
}

const outputText = (answer: ModelAnswer): string =>
  (answer.output ?? [])
    .flatMap((item) => (item.type === 'message' ? (item.content ?? []) : []))
    .filter((part) => part.type === 'output_text')
    .map((part) => part.text ?? '')
    .join('');

const toolCallsOf = (answer: ModelAnswer): ToolCall[] =>
  (answer.output ?? [])
    .filter((item) => item.type === 'function_call' && typeof item.name === 'string')
    .map((item) => ({
      id: item.call_id ?? item.id ?? '',
      name: item.name ?? '',
      arguments: typeof item.arguments === 'string' ? item.arguments : '',
    }));

/**
 * The OpenAI Responses API as an AgentModel.
 *
 * Neither the key nor the body is ever logged or attached to an error: what
 * comes back out of here on a failure is the API's own message, which the
 * engine turns into one plain sentence before anybody sees it.
 */
export function openaiResponsesModel(apiKey: string, modelId: string): AgentModel {
  const post = async (body: object, signal: AbortSignal): Promise<ModelAnswer> => {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
    const answer = (await response.json().catch(() => ({}))) as ModelAnswer;
    if (!response.ok) {
      throw new Error(answer.error?.message ?? `The model answered ${response.status}.`);
    }
    return answer;
  };

  return {
    name: modelId,
    async respond(request: ModelRequest, signal: AbortSignal): Promise<ModelResponse> {
      const body = {
        model: modelId,
        instructions: request.instructions,
        input: inputItems(request.input),
        tools: request.tools,
        tool_choice: 'auto',
        parallel_tool_calls: true,
      };
      // The run's own deadline and this call's, whichever comes first.
      const deadline = AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]);
      let answer: ModelAnswer;
      try {
        answer = await post(sendsTemperature ? { ...body, temperature: 0 } : body, deadline);
      } catch (error) {
        // Only the one retry, and only for the one parameter.
        const message = error instanceof Error ? error.message : '';
        if (!sendsTemperature || !/temperature/i.test(message)) throw error;
        sendsTemperature = false;
        answer = await post(body, deadline);
      }
      const text = outputText(answer).trim();
      return {
        text: text || null,
        toolCalls: toolCallsOf(answer),
        usage: {
          input: answer.usage?.input_tokens ?? null,
          output: answer.usage?.output_tokens ?? null,
        },
        model: modelId,
      };
    },
  };
}

/**
 * The model this deployment runs the Operator on, or null when no key is
 * configured — which the routes turn into a plain "not configured here"
 * rather than a half-working panel.
 */
export function agentModel(): AgentModel | null {
  const key = openaiKey();
  if (!key) return null;
  const pinned = (env as unknown as Record<string, string | undefined>)[MODEL_NAME];
  const modelId = typeof pinned === 'string' && pinned.trim() ? pinned.trim() : EXTRACTION_MODEL;
  return openaiResponsesModel(key, modelId);
}
