import {
  authClient,
  noStore,
  sameOrigin,
  workspaceUser,
} from '@/lib/server/auth';
import { boundedJson } from '@/lib/server/json';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 });
  let input: Record<string, unknown>;
  try {
    input = await boundedJson(request, 4_000);
  } catch {
    return Response.json(
      { error: 'Enter your email and password.' },
      { status: 400, headers: noStore },
    );
  }
  if (
    typeof input.email !== 'string' ||
    typeof input.password !== 'string' ||
    !input.email.trim() ||
    input.email.length > 254 ||
    input.password.length > 1024
  ) {
    return Response.json(
      { error: 'Enter your email and password.' },
      { status: 400, headers: noStore },
    );
  }
  try {
    const { client, finish } = authClient(request);
    const { error } = await client.auth.signInWithPassword({
      email: input.email.trim(),
      password: input.password,
    });
    if (error || !(await workspaceUser(client))) {
      await client.auth.signOut({ scope: 'local' });
      // One message for both cases, so it does not reveal which accounts exist.
      return finish(
        Response.json(
          {
            error:
              'Sign-in failed, or this account has not been given access to this workspace.',
          },
          { status: 401 },
        ),
      );
    }
    return finish(Response.json({ ok: true }));
  } catch {
    return Response.json(
      { error: 'Sign-in is unavailable right now. Please try again later.' },
      { status: 503, headers: noStore },
    );
  }
}
