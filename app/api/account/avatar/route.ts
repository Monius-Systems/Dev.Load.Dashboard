import { workspaceUser } from '@/lib/server/auth';
import {
  AVATAR_VERSION,
  loadAvatar,
  MAX_AVATAR_BYTES,
  removeAvatars,
  saveAvatar,
} from '@/lib/server/avatar-store';
import { sniffImage } from '@/lib/server/image-type';
import { badRequest, memberRoute } from '@/lib/server/member-route';

const tooLarge = () =>
  Response.json({ error: 'Use a photo under 2 MB.' }, { status: 413 });

/** The signed-in member's own profile photo (?v=<version>). */
export function GET(request: Request) {
  return memberRoute(request, async (client, member) => {
    const version = new URL(request.url).searchParams.get('v') ?? '';
    if (!AVATAR_VERSION.test(version)) return badRequest('Invalid photo reference.');
    const blob = await loadAvatar(client, member.workspaceId, member.id, version);
    const bytes = blob ? new Uint8Array(await blob.arrayBuffer()) : null;
    const type = bytes ? sniffImage(bytes) : null;
    if (!bytes || !type) {
      return Response.json({ error: 'No profile photo.' }, { status: 404 });
    }
    return new Response(bytes, {
      headers: {
        'Content-Type': type,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
        // The address carries the photo's version, so this browser never
        // fetches the same photo twice; a new photo has a new address.
        // Private: a photo is the member's own, never held by a shared cache.
        'Cache-Control': 'private, max-age=31536000, immutable',
      },
    });
  });
}

/** Replaces the member's profile photo. The body is the image itself. */
export function PUT(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      if (Number(request.headers.get('Content-Length') || 0) > MAX_AVATAR_BYTES) {
        return tooLarge();
      }
      const body = await request.arrayBuffer();
      if (body.byteLength === 0) return badRequest('Choose a photo.');
      if (body.byteLength > MAX_AVATAR_BYTES) return tooLarge();
      const type = sniffImage(new Uint8Array(body));
      if (!type) return badRequest('Use a JPG, PNG or WebP photo.');
      const userId = member.id;
      const version = await saveAvatar(client, member.workspaceId, userId, body, type);
      const { error } = await client.auth.updateUser({ data: { avatar_version: version } });
      if (error) {
        await removeAvatars(client, member.workspaceId, userId, null);
        return Response.json(
          { error: 'Could not save your photo. Please try again.' },
          { status: 502 },
        );
      }
      await removeAvatars(client, member.workspaceId, userId, version);
      return Response.json({ account: await workspaceUser(client) });
    },
    { write: true },
  );
}

/** Removes the member's profile photo; their initials show again. */
export function DELETE(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      const userId = member.id;
      const { error } = await client.auth.updateUser({ data: { avatar_version: null } });
      if (error) {
        return Response.json(
          { error: 'Could not remove your photo. Please try again.' },
          { status: 502 },
        );
      }
      await removeAvatars(client, member.workspaceId, userId, null);
      return Response.json({ account: await workspaceUser(client) });
    },
    { write: true },
  );
}
