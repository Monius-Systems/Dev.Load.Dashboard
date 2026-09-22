import {
  BASE_RATE_TYPES,
  FUEL_RATE_TYPES,
  isBaseRateType,
  isFuelRateType,
  type BaseRateType,
  type NormalizedMessage,
  type ParsedRateLine,
  type RateUnit,
  type RequestItem,
} from '@/lib/load-desk/rates';
import { EXTRACTION_MODEL } from '@/lib/load-desk/ticket-extraction';
import { recordAiUsage } from '@/lib/server/ai-usage';

// The only two places a model is asked anything about rates, and neither of
// them decides anything.
//
// `understandReply` observes: it says what each sentence of a customer's reply
// appears to state, in the customer's own words, and stops there. What that
// means against the jobs actually worked, whether it is out of line with what
// was agreed before and whether it may be applied without a person looking are
// all settled afterwards by the rules in lib/load-desk/rates.ts, which cannot
// be talked round.
//
// `naturalBody` rewrites the request email a little more like a person wrote
// it. The words that matter — every job, every field, every figure — are
// checked against the deterministic draft afterwards, and the deterministic
// draft is kept whenever the check fails. So the worst a bad rewrite can do is
// nothing.
//
// Both are written as a plain fetch to the Responses API rather than the
// client library, for the same reason app/api/extract/route.ts is: the library
// stays resident in the worker, and one POST with a JSON body is all this
// needs.

/** Anything the model is asked is given up on well before a request times out. */
const TIMEOUT_MS = 20_000;

/** The most lines that are read out of one reply, however long it is. */
export const MAX_LINES = 50;

/** How much of a reply is shown to the model. Longer than any real one. */
const MAX_REPLY_CHARS = 20_000;

const UNITS = [...new Set<string>([...BASE_RATE_TYPES, ...FUEL_RATE_TYPES, 'UNKNOWN'])];

/**
 * What one sentence of a reply appears to say. Strict, and every field
 * required, so the model cannot answer with a half-line: a line with no figure
 * is still a line, and says so with nulls rather than by being left out.
 */
export const REPLY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lines'],
  properties: {
    lines: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'raw_text',
          'job_text',
          'field',
          'extracted_value',
          'interpreted_value',
          'unit',
          'validity_hint',
          'note',
        ],
        properties: {
          raw_text: { type: 'string' },
          job_text: { type: ['string', 'null'] },
          field: { type: 'string', enum: ['base', 'fuel', 'both', 'unknown'] },
          extracted_value: { type: ['string', 'null'] },
          interpreted_value: { type: ['number', 'null'] },
          unit: { type: 'string', enum: UNITS },
          validity_hint: { type: ['string', 'null'], enum: ['period', 'project_duration', null] },
          note: { type: ['string', 'null'] },
        },
      },
    },
  },
} as const;

const REPLY_INSTRUCTIONS = [
  'You are reading one reply from a hauling customer about what they pay for',
  'work already done. Observe; do not decide.',
  '',
  'Return one line for each statement about a price. Rules, all of them hard:',
  '- raw_text is the sentence exactly as it was written, copied, not tidied.',
  '- job_text is the job or place the sentence names, in the words it used, or',
  '  null when it names none. Never guess a job, never map a name onto another.',
  '- field: "base" for the hauling rate, "fuel" for the fuel surcharge, "both"',
  '  when one sentence gives the two of them, "unknown" when it is not said.',
  '- extracted_value is the figure as it was written ("$8.75", "11%").',
  '- interpreted_value is that figure as a number, and must be a number that',
  '  actually appears in the sentence. Never convert, never total, never round.',
  '- unit only when the reply states it or it is unmistakable from the wording',
  `  (${UNITS.join(', ')}); otherwise "UNKNOWN". A bare number has no unit.`,
  '- validity_hint is "project_duration" when the reply says the figure holds',
  '  for the rest of the job or the project, "period" when it is given for this',
  '  billing period only, and null when nothing is said about how long it lasts.',
  '- note carries anything a person would want to read, such as the customer',
  '  saying the fuel surcharge changes weekly. Keep it short and factual.',
  '',
  'Invent nothing. A sentence with no figure in it is not a line. If the reply',
  'is about something else entirely, return no lines at all.',
].join('\n');

/** What the Responses API answers with, as much of it as is read here. */
type ModelAnswer = {
  output?: { type?: string; content?: { type?: string; text?: string }[] }[];
  usage?: { input_tokens?: number; output_tokens?: number };
  error?: { message?: string };
};

/**
 * Whether the model takes a sampling temperature. The reasoning models do not
 * and refuse the request outright, so it is asked once and the answer kept for
 * the life of the worker — the same trick, for the same reason, as the ticket
 * reader.
 */
let sendsTemperature = true;

async function send(apiKey: string, body: object): Promise<ModelAnswer> {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const answer = (await response.json().catch(() => ({}))) as ModelAnswer;
  if (!response.ok) {
    throw new Error(answer.error?.message ?? `The model answered ${response.status}.`);
  }
  return answer;
}

async function ask(apiKey: string, request: object): Promise<ModelAnswer> {
  try {
    return await send(apiKey, sendsTemperature ? { ...request, temperature: 0 } : request);
  } catch (error) {
    // Only the one retry, and only for the one parameter.
    const message = error instanceof Error ? error.message : '';
    if (!sendsTemperature || !/temperature/i.test(message)) throw error;
    sendsTemperature = false;
    return send(apiKey, request);
  }
}

/** The text the model produced, across its output items. */
const outputText = (answer: ModelAnswer): string =>
  (answer.output ?? [])
    .flatMap((item) => (item.type === 'message' ? (item.content ?? []) : []))
    .filter((part) => part.type === 'output_text')
    .map((part) => part.text ?? '')
    .join('');

// ------------------------------------------------------------ reading a reply

const NUMBERS = /\d+(?:\.\d+)?/g;

/** Every number written in a piece of text, as numbers. */
const numbersIn = (text: string): number[] =>
  [...text.matchAll(NUMBERS)].map((match) => Number(match[0])).filter(Number.isFinite);

const asText = (value: unknown, max: number): string | null =>
  typeof value === 'string' && value.trim() ? value.slice(0, max) : null;

/**
 * One line of the model's answer, believed only as far as it can be checked.
 *
 * The figure is the part that becomes money, so it is the part that is
 * checked hardest: a number the sentence does not contain is dropped rather
 * than carried, which turns the one failure that would cost a customer money
 * — a model that computes, converts or invents — into a line a person is
 * asked about.
 */
function readLine(value: unknown): ParsedRateLine | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const rawText = asText(row.raw_text, 2_000);
  if (!rawText) return null;
  const extracted = asText(row.extracted_value, 200);
  const field =
    row.field === 'base' || row.field === 'fuel' || row.field === 'both' ? row.field : 'unknown';
  const unit = isBaseRateType(row.unit) || isFuelRateType(row.unit) ? row.unit : 'UNKNOWN';
  const written = numbersIn(`${extracted ?? ''} ${rawText}`);
  const interpreted =
    typeof row.interpreted_value === 'number' &&
    Number.isFinite(row.interpreted_value) &&
    written.includes(row.interpreted_value)
      ? row.interpreted_value
      : null;
  return {
    raw_text: rawText,
    job_text: asText(row.job_text, 300),
    field,
    extracted_value: extracted,
    interpreted_value: interpreted,
    unit,
    validity_hint:
      row.validity_hint === 'period' || row.validity_hint === 'project_duration'
        ? row.validity_hint
        : null,
    note: asText(row.note, 500),
  };
}

/**
 * What a customer's reply says about prices, as the model reads it.
 *
 * The jobs and the fields that were asked about are sent along as context, so
 * "the first one" and "same as before" have something to be read against — but
 * only as context: nothing here may turn a job the customer did not name into
 * one that they did. That is what `matchLines` is for, and it is deterministic.
 */
export async function understandReply(
  apiKey: string,
  message: NormalizedMessage,
  context: {
    items: RequestItem[];
    jobs: { job_key: string; job_label: string }[];
    typical_rate_type: BaseRateType;
  },
  usage: { userId: string | null; workspaceId: string | null } = { userId: null, workspaceId: null },
): Promise<{ lines: ParsedRateLine[]; model: string }> {
  const brief = {
    asked_about: context.items.map((item) => ({ job: item.job_label, fields: item.fields })),
    jobs_worked: context.jobs.map((job) => job.job_label),
    this_customer_usually_quotes: context.typical_rate_type,
  };
  const answer = await ask(apiKey, {
    model: EXTRACTION_MODEL,
    instructions: REPLY_INSTRUCTIONS,
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: [
              `Context (what was asked, for reading only): ${JSON.stringify(brief)}`,
              `Subject: ${message.subject ?? ''}`,
              'Reply:',
              message.body_text.slice(0, MAX_REPLY_CHARS),
            ].join('\n'),
          },
        ],
      },
    ],
    text: {
      format: { type: 'json_schema', name: 'rate_reply', strict: true, schema: REPLY_SCHEMA },
    },
  });
  recordAiUsage({
    userId: usage.userId,
    workspaceId: usage.workspaceId,
    requestType: 'rate-reply-understanding',
    model: EXTRACTION_MODEL,
    inputTokens: answer.usage?.input_tokens ?? null,
    outputTokens: answer.usage?.output_tokens ?? null,
    at: new Date().toISOString(),
  });
  const text = outputText(answer);
  if (!text) throw new Error('The reader returned nothing for this reply.');
  const parsed = JSON.parse(text) as unknown;
  const rows =
    parsed && typeof parsed === 'object' && Array.isArray((parsed as { lines?: unknown }).lines)
      ? ((parsed as { lines: unknown[] }).lines)
      : [];
  const lines: ParsedRateLine[] = [];
  for (const row of rows.slice(0, MAX_LINES)) {
    const line = readLine(row);
    if (line) lines.push(line);
  }
  return { lines, model: EXTRACTION_MODEL };
}

// ------------------------------------------------------ reading without a model

/**
 * Words that sit between a job's name and its figure, and say nothing about
 * which job it is. Stripped from both ends so "Markham fuel is" and "the rate
 * for Markham" both come down to "Markham" — and so a line that names no job
 * at all comes down to nothing, which is a question for a person rather than a
 * guess at whose rate this was.
 */
const FILLER = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'charge', 'charges', 'for', 'fuel', 'is',
  'of', 'on', 'price', 'pricing', 'rate', 'rates', 'surcharge', 'the', 'to', 'was',
  'we', 'will', 'per',
]);

/** A number that stands on its own — never the 159 of "159th". */
const STANDALONE_NUMBER = /(?<![A-Za-z0-9.])(\d+(?:\.\d+)?)(?![A-Za-z0-9])/;

const PER_TON_TEXT = /\/\s*ton|per\s+ton|a\s+ton/i;
const PER_LOAD_TEXT = /\/\s*load|per\s+load|a\s+load/i;
const PER_HOUR_TEXT = /\/\s*(?:hr|hour)|per\s+hour|an\s+hour/i;
const PROJECT_TEXT = /rest of the (?:project|job)|for the (?:whole |entire )?(?:project|job)|duration of the (?:project|job)|stay(?:s|ing)? (?:the same|at)/i;

const stripFiller = (text: string): string | null => {
  const words = text
    .replace(/[^\p{L}\p{N}\s.&/'-]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  while (words.length && FILLER.has(words[0].toLowerCase())) words.shift();
  while (words.length && FILLER.has(words[words.length - 1].toLowerCase())) words.pop();
  const job = words.join(' ').trim();
  return job || null;
};

/**
 * The same reading, without a model: one line of the reply at a time, the
 * first figure that stands on its own, and the unit only when the words say it.
 *
 * This is what runs when no key is configured and what the reply falls back to
 * when the model cannot be reached — deliberately dull, and pure, so it can be
 * tested figure by figure. It is not a second opinion on the model: whatever
 * it produces goes through the same `matchLines` rules, which is where an
 * uncertain reading becomes a question rather than a rate.
 */
export function rulesOnlyLines(text: string): ParsedRateLine[] {
  const lines: ParsedRateLine[] = [];
  for (const raw of text.split(/\r?\n/)) {
    if (lines.length >= MAX_LINES) break;
    const line = raw.trim();
    if (!line) continue;
    const found = STANDALONE_NUMBER.exec(line);
    if (!found) continue;
    const value = Number(found[1]);
    if (!Number.isFinite(value)) continue;
    const before = line.slice(0, found.index);
    const percent = /(\d+(?:\.\d+)?)\s*%/.exec(line);
    const mentionsFuel = /fuel/i.test(line);
    const baseUnit = PER_TON_TEXT.test(line)
      ? 'PER_TON'
      : PER_LOAD_TEXT.test(line)
        ? 'PER_LOAD'
        : PER_HOUR_TEXT.test(line)
          ? 'PER_HOUR'
          : null;
    // A dollar sign is a hauling rate — unless the line is about fuel and
    // gives one figure, which is a fuel surcharge in dollars and not a rate.
    const hasBase =
      baseUnit !== null ||
      (line.includes('$') &&
        (!mentionsFuel || (percent !== null && Number(percent[1]) !== value)));
    const hasFuel = percent !== null || mentionsFuel;
    const figures = [...line.matchAll(new RegExp(STANDALONE_NUMBER.source, 'g'))].map((match) =>
      Number(match[1]),
    );
    const field: ParsedRateLine['field'] =
      hasBase && hasFuel && figures.some((figure) => figure !== value)
        ? 'both'
        : hasFuel && !hasBase
          ? 'fuel'
          : hasBase
            ? 'base'
            : 'unknown';
    const fuelOnly = field === 'fuel';
    const reading: { value: number; unit: RateUnit; written: string } =
      fuelOnly && percent
        ? { value: Number(percent[1]), unit: 'PERCENTAGE' as const, written: `${percent[1]}%` }
        : {
            value,
            unit: fuelOnly
              ? line.includes('$')
                ? ('FIXED_AMOUNT' as const)
                : ('UNKNOWN' as const)
              : (baseUnit ?? 'UNKNOWN'),
            written: found[1],
          };
    lines.push({
      raw_text: line,
      job_text: stripFiller(before),
      field,
      extracted_value: reading.written,
      interpreted_value: Number.isFinite(reading.value) ? reading.value : null,
      unit: reading.unit,
      validity_hint: PROJECT_TEXT.test(line) ? 'project_duration' : null,
      note: null,
    });
  }
  return lines;
}

// ------------------------------------------------------------ wording a request

const WORDING_INSTRUCTIONS = [
  'Rewrite this short business email so it reads as a person wrote it, not a',
  'form. You may change greetings, connecting words and sentence order.',
  '',
  'You may not: add a job, remove a job, rename a job, add or remove a field',
  'that is being asked for, or write any number, date or amount that is not',
  'already in the draft. Keep every job name exactly as it is spelt. Keep the',
  'words "rate" and "fuel" wherever the draft asks for them. Do not promise',
  'anything, do not mention software, and do not sign it with a name.',
  '',
  'Answer with the body of the email and nothing else.',
].join('\n');

const digitsIn = (text: string): string[] => [...text.matchAll(/\d+/g)].map((match) => match[0]);

/**
 * Whether a rewritten body still says what the draft said: every job named,
 * every field still asked for, and not one digit that was not already there.
 *
 * Exported for the test, and the whole safety of letting a model near a
 * customer's email: a rewrite that fails any of this is thrown away and the
 * deterministic wording goes out instead, so the worst outcome is the email
 * the agent would have sent anyway.
 */
export function wordingIsFaithful(
  draft: string,
  rewritten: string,
  items: RequestItem[],
): boolean {
  const body = rewritten.toLowerCase();
  if (!body.trim() || rewritten.length > draft.length * 3 + 400) return false;
  for (const item of items) {
    if (!body.includes(item.job_label.toLowerCase())) return false;
  }
  const fields = new Set(items.flatMap((item) => item.fields));
  if (fields.has('base') && !body.includes('rate')) return false;
  if (fields.has('fuel') && !body.includes('fuel')) return false;
  const allowed = new Set(digitsIn(draft));
  return digitsIn(rewritten).every((run) => allowed.has(run));
}

/**
 * The request body, rephrased — or the draft back unchanged, which is the
 * answer whenever the model is slow, unreachable, or says something the draft
 * did not. The caller never has to handle a failure, because there is nothing
 * to handle: the wording it passed in is the worst case.
 */
export async function naturalBody(
  apiKey: string,
  draft: string,
  items: RequestItem[],
  usage: { userId: string | null; workspaceId: string | null } = { userId: null, workspaceId: null },
): Promise<string> {
  try {
    const answer = await ask(apiKey, {
      model: EXTRACTION_MODEL,
      instructions: WORDING_INSTRUCTIONS,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Jobs and fields, for reference only: ${JSON.stringify(items)}\n\nDraft:\n${draft}`,
            },
          ],
        },
      ],
    });
    recordAiUsage({
      userId: usage.userId,
      workspaceId: usage.workspaceId,
      requestType: 'rate-request-wording',
      model: EXTRACTION_MODEL,
      inputTokens: answer.usage?.input_tokens ?? null,
      outputTokens: answer.usage?.output_tokens ?? null,
      at: new Date().toISOString(),
    });
    const rewritten = outputText(answer).trim();
    return wordingIsFaithful(draft, rewritten, items) ? rewritten : draft;
  } catch {
    // Wording is a nicety; the draft is the product. A failure here is not
    // worth failing a request generation over, and is not logged with it.
    return draft;
  }
}
