import { memberRoute } from '@/lib/server/member-route';

/** Signs the member out on every device and browser, including this one. */
export function DELETE(request: Request) {
  return memberRoute(
    request,
    async (client) => {
      const { error } = await client.auth.signOut({ scope: 'global' });
      if (error) {
        return Response.json(
          { error: 'Could not sign out of other devices. Please try again.' },
          { status: 502 },
        );
      }
      return Response.json({ ok: true });
    },
    { write: true },
  );
}
