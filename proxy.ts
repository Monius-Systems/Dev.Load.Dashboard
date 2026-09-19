import { NextResponse, type NextRequest } from 'next/server';
import { authClient, localPreview, workspaceUser } from '@/lib/server/auth';

// Every page and API requires a signed-in member of this workspace. The login
// page and the auth endpoints stay open; static assets are not matched.
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === '/login' || path.startsWith('/api/auth/')) {
    return NextResponse.next();
  }
  if (localPreview(request)) return NextResponse.next();
  try {
    const { client, finish } = authClient(request);
    if (await workspaceUser(client)) return finish(NextResponse.next());
    return finish(
      path.startsWith('/api/')
        ? Response.json(
            { error: 'Sign in with an authorized account.' },
            { status: 401 },
          )
        : NextResponse.redirect(new URL('/login', request.url)),
    );
  } catch {
    return path.startsWith('/api/')
      ? Response.json(
          { error: 'Sign-in is unavailable.' },
          { status: 503, headers: { 'Cache-Control': 'no-store' } },
        )
      : NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/load-desk/:path*',
    '/records/:path*',
    '/customers/:path*',
    '/fleet/:path*',
    '/mileage/:path*',
    '/ifta/:path*',
    '/account/:path*',
    '/api/:path*',
  ],
};
