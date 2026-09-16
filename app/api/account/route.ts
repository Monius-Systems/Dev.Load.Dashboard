import { workspaceUser } from '@/lib/server/auth';
import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';

const PHONE = /^[0-9+().\-\s]*(?:(?:x|ext\.?)\s*[0-9]+)?$/i;

const oneLine = (value: unknown) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : null;

/** The signed-in member's own account details. */
export function GET(request: Request) {
  return memberRoute(request, async (client) =>
    Response.json({ account: await workspaceUser(client) }),
  );
}

/** Updates the signed-in member's name and phone (their Supabase user metadata). */
export function PUT(request: Request) {
  return memberRoute(
    request,
    async (client) => {
      let input: Record<string, unknown>;
      try {
        input = await boundedJson(request, 4_000);
      } catch {
        return badRequest('Send your name and phone number.');
      }
      const name = oneLine(input.full_name);
      const phone = oneLine(input.phone);
      if (name === null || phone === null) {
        return badRequest('Send your name and phone number.');
      }
      if (name.length > 120) {
        return badRequest('Keep your name under 120 characters.');
      }
      if (phone.length > 40 || !PHONE.test(phone)) {
        return badRequest(
          'Enter a phone number using digits, spaces, +, -, parentheses or ext.',
        );
      }
      const { error } = await client.auth.updateUser({
        data: { full_name: name || null, phone: phone || null },
      });
      if (error) {
        return Response.json(
          { error: 'Could not save your profile. Please try again.' },
          { status: 502 },
        );
      }
      return Response.json({ account: await workspaceUser(client) });
    },
    { write: true },
  );
}
