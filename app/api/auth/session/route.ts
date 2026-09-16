import {
  authClient,
  localPreview,
  noStore,
  websiteUrl,
  workspaceUser,
} from '@/lib/server/auth';

/**
 * Who is signed in, whether the app runs as the local browser preview, and
 * the Monius website address for the login page's way back.
 */
export async function GET(request: Request) {
  const website = websiteUrl();
  if (localPreview(request)) {
    return Response.json({ mode: 'local', user: null, websiteUrl: website }, { headers: noStore });
  }
  try {
    const { client, finish } = authClient(request);
    return finish(
      Response.json({
        mode: 'supabase',
        user: await workspaceUser(client),
        websiteUrl: website,
      }),
    );
  } catch {
    return Response.json({ mode: 'setup', user: null, websiteUrl: website }, { headers: noStore });
  }
}
