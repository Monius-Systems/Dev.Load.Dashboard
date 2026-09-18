import OpenAI from 'openai';
import { authClient, localPreview, noStore, sameOrigin, workspaceUser } from '@/lib/server/auth';
import { OPENAI_KEY_NAME, openaiKey } from '@/lib/server/openai-key';
import { recordAiUsage } from '@/lib/server/ai-usage';
import {
  EXTRACTION_INSTRUCTIONS,
  EXTRACTION_MODEL,
  EXTRACTION_SCHEMA,
  readExtracted,
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
  let binary = '';
  for (let at = 0; at < bytes.length; at += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(at, at + 0x8000));
  }
  return `data:${type};base64,${btoa(binary)}`;
}

/** Asks the model to read the ticket, once, as structured JSON. */
async function extract(client: OpenAI, imageUrl: string) {
  const request = {
    model: EXTRACTION_MODEL,
    instructions: EXTRACTION_INSTRUCTIONS,
    input: [
      {
        role: 'user' as const,
        content: [
          { type: 'input_text' as const, text: 'Read this load ticket.' },
          { type: 'input_image' as const, image_url: imageUrl, detail: 'high' as const },
        ],
      },
    ],
    text: {
      format: {
        type: 'json_schema' as const,
        name: 'load_ticket',
        strict: true,
        schema: EXTRACTION_SCHEMA,
      },
    },
  };
  try {
    return await client.responses.create(
      sendsTemperature ? { ...request, temperature: 0 } : request,
    );
  } catch (error) {
    // Only the one retry, and only for the one parameter.
    const message = error instanceof Error ? error.message : '';
    if (!sendsTemperature || !/temperature/i.test(message)) throw error;
    sendsTemperature = false;
    return client.responses.create(request);
  }
}

/**
 * Reads one ticket image. The answer is the thirteen extracted fields; turning
 * them into one of the app's tickets happens in the browser, where the rest of
 * the review already lives.
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
    const response = await extract(new OpenAI({ apiKey }), imageUrl);
    recordAiUsage({
      userId,
      workspaceId,
      requestType: 'load-ticket-extraction',
      model: EXTRACTION_MODEL,
      inputTokens: response.usage?.input_tokens ?? null,
      outputTokens: response.usage?.output_tokens ?? null,
      at: new Date().toISOString(),
    });
    const answer = response.output_text;
    if (!answer) return failure('The reader returned nothing for this ticket.', 502);
    return Response.json(
      { extracted: readExtracted(JSON.parse(answer) as unknown) },
      { headers: noStore },
    );
  } catch (error) {
    // The model's own errors are not shown to the customer; they carry request
    // ids and account detail that belong in the log, not on a ticket.
    console.error('ticket extraction failed', error);
    const status =
      error instanceof Error && /\b(401|403|invalid[_ ]api[_ ]key)\b/i.test(error.message)
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
