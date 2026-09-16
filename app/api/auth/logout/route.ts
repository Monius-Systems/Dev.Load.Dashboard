import { authClient, noStore, sameOrigin } from '@/lib/server/auth';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 });
  try {
    const { client, finish } = authClient(request);
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) {
      return finish(
        Response.json(
          { error: 'Could not sign out. Please try again.' },
          { status: 503 },
        ),
      );
    }
    return finish(Response.json({ ok: true }));
  } catch {
    return Response.json(
      { error: 'Sign-out is unavailable.' },
      { status: 503, headers: noStore },
    );
  }
}
