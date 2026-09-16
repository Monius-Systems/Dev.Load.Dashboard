import {
  authClient,
  localPreview,
  noStore,
  websiteUrl,
  workspaceUser,
} from '@/lib/server/auth';
import { boundedText } from '@/lib/server/json';
import {
  fromWebsite,
  parseSignInForm,
  websiteLoginUrl,
  type WebsiteSignInError,
} from '@/lib/server/website-sign-in';

const redirect = (location: string) =>
  new Response(null, { status: 303, headers: { Location: location, ...noStore } });

/**
 * The Monius website's Client Login form posts here. Success opens the
 * workspace; anything else goes back to the website's Client Login with an
 * error code. Same checks as /api/auth/login: Supabase password sign-in and a
 * membership row for this workspace.
 */
export async function POST(request: Request) {
  const website = websiteUrl();
  if (!website || !fromWebsite(request.headers.get('origin'), website)) {
    return new Response('Forbidden', { status: 403, headers: noStore });
  }
  const back = (error: WebsiteSignInError) => redirect(websiteLoginUrl(website, error));
  const workspace = new URL('/', request.url).href;

  // The unprotected local preview (development on this computer only) has no
  // accounts to check.
  if (localPreview(request)) return redirect(workspace);

  let form: { email: string; password: string } | null;
  try {
    form = parseSignInForm(
      await boundedText(request, 4_000, 'application/x-www-form-urlencoded'),
    );
  } catch {
    return back('invalid');
  }
  if (!form) return back('invalid');

  try {
    const { client, finish } = authClient(request);
    const { error } = await client.auth.signInWithPassword(form);
    if (error || !(await workspaceUser(client))) {
      await client.auth.signOut({ scope: 'local' });
      // One message for both cases, so it does not reveal which accounts exist.
      return finish(back('failed'));
    }
    return finish(redirect(workspace));
  } catch {
    return back('unavailable');
  }
}
