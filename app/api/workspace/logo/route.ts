import type { SupabaseClient } from '@supabase/supabase-js';
import type { CompanyProfile } from '@/lib/load-desk/profiles';
import {
  createProfile,
  listProfiles,
  updateProfile,
} from '@/lib/server/load-desk-store';
import {
  LOGO_VERSION,
  loadLogo,
  MAX_LOGO_BYTES,
  removeLogos,
  saveLogo,
} from '@/lib/server/logo-store';
import { sniffImage } from '@/lib/server/image-type';
import { badRequest, memberRoute } from '@/lib/server/member-route';

// The workspace's own logo, shown wherever its initials were. One per
// workspace: it stands for the company, so whoever uploads it, every member
// signed in to that workspace sees it. Which version is current is kept on the
// company profile, because that is the record the whole workspace already
// shares (a member's own photo goes in their user metadata instead).

const tooLarge = () =>
  Response.json({ error: 'Use a logo under 2 MB.' }, { status: 413 });

/**
 * Writes `logo_version` onto the company profile, starting one if the
 * workspace has not filled its invoice details in yet. Returns the profile as
 * it now stands, for the browser to show without reloading everything.
 */
async function setLogoVersion(
  client: SupabaseClient,
  workspace: string,
  version: string | null,
): Promise<CompanyProfile> {
  const { company } = await listProfiles(client, workspace);
  const profile = {
    ...(company?.display_name ? { display_name: company.display_name } : {}),
    ...(company?.default_client_id != null
      ? { default_client_id: company.default_client_id }
      : {}),
    ...(company?.default_truck_id != null
      ? { default_truck_id: company.default_truck_id }
      : {}),
    ...(company?.invoice_start ? { invoice_start: company.invoice_start } : {}),
    ...(version ? { logo_version: version } : {}),
    name: company?.name ?? '',
    address_lines: (company?.address_lines ?? ['', '']) as [string, string],
    updated_at: new Date().toISOString(),
  };
  const id = company
    ? (await updateProfile(client, workspace, company.id, 'company', profile), company.id)
    : await createProfile(client, workspace, 'company', profile);
  return { ...profile, id };
}

/** The workspace's logo (?v=<version>). */
export function GET(request: Request) {
  return memberRoute(request, async (client, member) => {
    const version = new URL(request.url).searchParams.get('v') ?? '';
    if (!LOGO_VERSION.test(version)) return badRequest('Invalid logo reference.');
    const blob = await loadLogo(client, member.workspaceId, version);
    const bytes = blob ? new Uint8Array(await blob.arrayBuffer()) : null;
    const type = bytes ? sniffImage(bytes) : null;
    if (!bytes || !type) {
      return Response.json({ error: 'No logo.' }, { status: 404 });
    }
    return new Response(bytes, {
      headers: {
        'Content-Type': type,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
        // The address carries the logo's version, so this browser never fetches
        // the same picture twice; a new logo has a new address. Private: it
        // belongs to one workspace and is never held by a shared cache.
        'Cache-Control': 'private, max-age=31536000, immutable',
      },
    });
  });
}

/** Replaces the workspace's logo. The body is the image itself. */
export function PUT(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      if (Number(request.headers.get('Content-Length') || 0) > MAX_LOGO_BYTES) {
        return tooLarge();
      }
      const body = await request.arrayBuffer();
      if (body.byteLength === 0) return badRequest('Choose a logo.');
      if (body.byteLength > MAX_LOGO_BYTES) return tooLarge();
      const type = sniffImage(new Uint8Array(body));
      if (!type) return badRequest('Use a JPG, PNG or WebP image.');
      const workspace = member.workspaceId;
      const version = await saveLogo(client, workspace, body, type);
      let company: CompanyProfile;
      try {
        company = await setLogoVersion(client, workspace, version);
      } catch {
        // The picture is stored but nothing points at it, so take it back out
        // rather than leave the workspace paying for a file it cannot see.
        await removeLogos(client, workspace, null);
        return Response.json(
          { error: 'Could not save the logo. Please try again.' },
          { status: 502 },
        );
      }
      await removeLogos(client, workspace, version);
      return Response.json({ company });
    },
    { write: true },
  );
}

/** Removes the workspace's logo; its initials show again. */
export function DELETE(request: Request) {
  return memberRoute(
    request,
    async (client, member) => {
      const workspace = member.workspaceId;
      let company: CompanyProfile;
      try {
        company = await setLogoVersion(client, workspace, null);
      } catch {
        return Response.json(
          { error: 'Could not remove the logo. Please try again.' },
          { status: 502 },
        );
      }
      await removeLogos(client, workspace, null);
      return Response.json({ company });
    },
    { write: true },
  );
}
