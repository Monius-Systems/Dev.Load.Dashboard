import { Buffer } from 'node:buffer';
import { authClient, localPreview, noStore, sameOrigin, workspaceUser } from '@/lib/server/auth';
import { OPENAI_KEY_NAME, openaiKey } from '@/lib/server/openai-key';
import { recordAiUsage } from '@/lib/server/ai-usage';
import {
  EXTRACTION_INSTRUCTIONS,
  EXTRACTION_MODEL,
  EXTRACTION_SCHEMA,
  observedToExtracted,
  readObserved,
} from '@/lib/load-desk/ticket-extraction';

// Reading one ticket. The image is posted here by the browser and sent on to
// the model; the key never leaves the server, so it is never in a page, a
// bundle or a network tab the customer can open.
//
// Every workspace reads on the one Monius key. Who is signed in and which
// company's ticket this is are settled before the key is touched, and the answer
// goes back to that request alone, so the shared credential keeps no two
// customers' work together.

/** Images are capped well under the model's limit and the Worker's memory. */
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Whether the model takes a sampling temperature. The reasoning models do not,
 * and reject the request outright rather than ignoring it. Asked for once, so
 * a model that refuses it costs one retry for the life of the worker and not
 * one per ticket.
 */
let sendsTemperature = true;

const failure = (message: string, status: number) =>
  Response.json({ error: message }, { status, headers: noStore });

/** Reads the posted image, refusing anything too large before it is buffered. */
async function readImage(request: Request) {
  const type = request.headers.get('Content-Type')?.split(';')[0]?.trim() ?? '';
  if (!ALLOWED_TYPES.includes(type)) {
    throw new Error('Post the ticket as a JPEG, PNG or WebP image.');
  }
  const declared = Number(request.headers.get('Content-Length') ?? '');
  if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES) {
    throw new Error('That image is too large to read.');
  }
  const bytes = new Uint8Array(await request.arrayBuffer());
  if (!bytes.byteLength) throw new Error('No image was posted.');
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new Error('That image is too large to read.');
  // Encoded natively. Building a binary string a chunk at a time and
  // handing it to btoa costs the worker CPU time and three copies of the
  // image; Buffer does it in one pass.
  return `data:${type};base64,${Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64')}`;
}

/** What the Responses API answers with, as much of it as is read here. */
type ModelAnswer = {
  output?: { type?: string; content?: { type?: string; text?: string }[] }[];
  usage?: { input_tokens?: number; output_tokens?: number };
  error?: { message?: string };
};

/** A model call that failed, with the status the API gave. */
class ModelError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/**
 * Asks the model to read the ticket, once, as structured JSON.
 *
 * A plain fetch to the Responses API rather than the OpenAI client library.
 * The library is a large module that stays resident in the worker once the
 * first ticket has loaded it, and everything this route needs of it is one
 * POST with a JSON body: the less the worker holds between requests, the
 * more room every request has.
 */
async function extract(apiKey: string, imageUrl: string): Promise<ModelAnswer> {
  const request = {
    model: EXTRACTION_MODEL,
    instructions: EXTRACTION_INSTRUCTIONS,
    input: [
      {
        role: 'user',
        content: [
          { type: 'input_text', text: 'Read this load ticket.' },
          { type: 'input_image', image_url: imageUrl, detail: 'high' },
        ],
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'load_ticket',
        strict: true,
        schema: EXTRACTION_SCHEMA,
      },
    },
  };
  const send = async (body: object): Promise<ModelAnswer> => {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const answer = (await response.json().catch(() => ({}))) as ModelAnswer;
    if (!response.ok) {
      throw new ModelError(answer.error?.message ?? `The model answered ${response.status}.`, response.status);
    }
    return answer;
  };
  try {
    return await send(sendsTemperature ? { ...request, temperature: 0 } : request);
  } catch (error) {
    // Only the one retry, and only for the one parameter.
    const message = error instanceof Error ? error.message : '';
    if (!sendsTemperature || !/temperature/i.test(message)) throw error;
    sendsTemperature = false;
    return send(request);
  }
}

/** The text the model produced, across its output items. */
const outputText = (answer: ModelAnswer): string =>
  (answer.output ?? [])
    .flatMap((item) => (item.type === 'message' ? (item.content ?? []) : []))
    .filter((part) => part.type === 'output_text')
    .map((part) => part.text ?? '')
    .join('');

/**
 * Reads one ticket image. The answer is what the reader saw, field by field,
 * and the flat view of it that carries only the fields it saw whole; turning
 * either into one of the app's tickets happens in the browser, where the rest
 * of the review already lives.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure('Forbidden', 403);
  // The unprotected local preview reads tickets too; it is development on this
  // computer only, and the key is still only ever on this side of the wire.
  if (!localPreview(request)) {
    let auth: ReturnType<typeof authClient>;
    try {
      auth = authClient(request);
    } catch {
      return failure('Sign-in is unavailable.', 503);
    }
    const { client, finish } = auth;
    const member = await workspaceUser(client);
    if (!member) {
      return finish(failure('Sign in with an authorized account.', 401));
    }
    // The session cookies are refreshed on the way out even when the read fails.
    // Every company reads on the same Monius key; the member decides only whose
    // ticket this is and who the page is counted against.
    return finish(await read(request, member.id, member.workspaceId));
  }
  return read(request, null, null);
}

async function read(request: Request, userId: string | null, workspaceId: string | null) {
  const apiKey = openaiKey();
  if (!apiKey) {
    return failure(`Ticket reading is not configured. Set ${OPENAI_KEY_NAME}.`, 503);
  }
  let imageUrl: string;
  try {
    imageUrl = await readImage(request);
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Post a ticket image.', 400);
  }
  try {
    const response = await extract(apiKey, imageUrl);
    recordAiUsage({
      userId,
      workspaceId,
      requestType: 'load-ticket-extraction',
      model: EXTRACTION_MODEL,
      inputTokens: response.usage?.input_tokens ?? null,
      outputTokens: response.usage?.output_tokens ?? null,
      at: new Date().toISOString(),
    });
    const answer = outputText(response);
    if (!answer) return failure('The reader returned nothing for this ticket.', 502);
    // Both shapes go back: `observed` is the reading with its damage intact,
    // for the recovery layer, and `extracted` is the same reading with only
    // the fields that were seen whole, which is what every caller written
    // before any of this already expects.
    const observed = readObserved(JSON.parse(answer) as unknown);
    return Response.json(
      { extracted: observedToExtracted(observed), observed },
      { headers: noStore },
    );
  } catch (error) {
    // The model's own errors are not shown to the customer; they carry request
    // ids and account detail that belong in the log, not on a ticket.
    console.error('ticket extraction failed', error);
    const status =
      (error instanceof ModelError && (error.status === 401 || error.status === 403)) ||
      (error instanceof Error && /invalid[_ ]api[_ ]key/i.test(error.message))
        ? 503
        : 502;
    return failure(
      status === 503
        ? `Ticket reading is not configured correctly. Check ${OPENAI_KEY_NAME}.`
        : 'The ticket could not be read. Try again, or enter the fields by hand.',
      status,
    );
  }
}
