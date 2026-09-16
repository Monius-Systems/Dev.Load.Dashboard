import type { SupabaseClient } from '@supabase/supabase-js';
import {
  authClient,
  localPreview,
  noStore,
  sameOrigin,
  workspaceUser,
  type WorkspaceUser,
} from '@/lib/server/auth';
import { StoreError } from '@/lib/server/load-desk-store';

/**
 * Runs an API handler for a signed-in member of a workspace. The proxy also
 * guards these routes; checking here keeps each route safe on its own.
 * Writes must come from the app's own origin.
 *
 * The handler is given the member, whose `workspaceId` scopes everything it
 * reads or writes. Routes take it from here rather than looking it up again,
 * so there is one answer per request to which company's data is in play.
 */
export async function memberRoute(
  request: Request,
  handler: (client: SupabaseClient, member: WorkspaceUser) => Promise<Response>,
  { write = false } = {},
): Promise<Response> {
  if (write && !sameOrigin(request)) {
    return new Response('Forbidden', { status: 403 });
  }
  if (localPreview(request)) {
    return Response.json(
      { error: 'Not available in the local preview, which saves in the browser.' },
      { status: 409, headers: noStore },
    );
  }
  let auth: ReturnType<typeof authClient>;
  try {
    auth = authClient(request);
  } catch {
    return Response.json(
      { error: 'Sign-in is unavailable.' },
      { status: 503, headers: noStore },
    );
  }
  const { client, finish } = auth;
  try {
    const member = await workspaceUser(client);
    if (!member) {
      return finish(
        Response.json({ error: 'Sign in with an authorized account.' }, { status: 401 }),
      );
    }
    return finish(await handler(client, member));
  } catch (error) {
    if (error instanceof StoreError) {
      return finish(Response.json({ error: error.message }, { status: error.status }));
    }
    return finish(
      Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 }),
    );
  }
}

export const badRequest = (message: string) =>
  Response.json({ error: message }, { status: 400 });
