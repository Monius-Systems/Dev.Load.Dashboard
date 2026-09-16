import { boundedJson } from '@/lib/server/json';
import { badRequest, memberRoute } from '@/lib/server/member-route';

const LANGUAGES = new Set(['en', 'pl']);

/** Saves the signed-in member's dashboard language on their account. */
export function PUT(request: Request) {
  return memberRoute(
    request,
    async (client) => {
      let input: Record<string, unknown>;
      try {
        input = await boundedJson(request, 1_000);
      } catch {
        return badRequest('Choose a language.');
      }
      if (typeof input.locale !== 'string' || !LANGUAGES.has(input.locale)) {
        return badRequest('Choose English or Polish.');
      }
      const { error } = await client.auth.updateUser({ data: { locale: input.locale } });
      if (error) {
        return Response.json(
          { error: 'Could not save your language. Please try again.' },
          { status: 502 },
        );
      }
      return Response.json({ ok: true });
    },
    { write: true },
  );
}
