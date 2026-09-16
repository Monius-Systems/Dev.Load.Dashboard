import { downloadOriginal, uploadOriginal } from '@/lib/server/load-desk-store';
import { badRequest, memberRoute } from '@/lib/server/member-route';
import { MAX_ORIGINAL_BYTES, SHA256 } from '@/lib/load-desk/record-input';

type Context = { params: Promise<{ sha: string }> };

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/tiff',
  'image/webp',
  'text/plain',
  'application/octet-stream',
]);

/** Streams a stored ticket scan to a signed-in member. */
export async function GET(request: Request, { params }: Context) {
  const { sha } = await params;
  return memberRoute(request, async (client, member) => {
    if (!SHA256.test(sha)) return badRequest('Invalid file reference.');
    const blob = await downloadOriginal(client, member.workspaceId, sha);
    if (!blob) {
      return Response.json(
        { error: 'The original is not stored for this ticket.' },
        { status: 404 },
      );
    }
    return new Response(blob, {
      headers: {
        'Content-Type': blob.type || 'application/octet-stream',
        'Content-Disposition': 'inline',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    });
  });
}

/** Stores a ticket scan under its SHA-256. The body is the raw file. */
export async function PUT(request: Request, { params }: Context) {
  const { sha } = await params;
  return memberRoute(
    request,
    async (client, member) => {
      if (!SHA256.test(sha)) return badRequest('Invalid file reference.');
      const contentType = (request.headers.get('Content-Type') || 'application/octet-stream')
        .split(';')[0]
        .trim()
        .toLowerCase();
      if (!ALLOWED_TYPES.has(contentType)) {
        return badRequest('Use a PDF, image or text file.');
      }
      const declared = Number(request.headers.get('Content-Length') || 0);
      if (declared > MAX_ORIGINAL_BYTES) {
        return Response.json({ error: 'The file is larger than 20 MB.' }, { status: 413 });
      }
      const body = await request.arrayBuffer();
      if (body.byteLength === 0) return badRequest('The file is empty.');
      if (body.byteLength > MAX_ORIGINAL_BYTES) {
        return Response.json({ error: 'The file is larger than 20 MB.' }, { status: 413 });
      }
      await uploadOriginal(client, member.workspaceId, sha, body, contentType);
      return Response.json({ ok: true }, { status: 201 });
    },
    { write: true },
  );
}
