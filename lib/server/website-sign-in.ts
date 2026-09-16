// Sign-in from the Monius website's Client Login form. The form posts here as
// a normal page submit, so this app sets its own httpOnly session cookies and
// opens the workspace. Kept free of server imports so it can be tested.

export type WebsiteSignInError = 'failed' | 'invalid' | 'unavailable';

/**
 * Only the configured Monius website may submit this form. Browsers send the
 * page's origin with every cross-site form post, so a missing or different
 * origin is refused.
 */
export function fromWebsite(origin: string | null, website: string): boolean {
  if (!origin) return false;
  try {
    return origin === new URL(website).origin;
  } catch {
    return false;
  }
}

/** Back to the website's Client Login, with a code it turns into a message. */
export function websiteLoginUrl(website: string, error: WebsiteSignInError): string {
  const url = new URL('/login', website);
  url.searchParams.set('error', error);
  return url.href;
}

/** The email and password from a url-encoded form body, or null when unusable. */
export function parseSignInForm(body: string): { email: string; password: string } | null {
  const form = new URLSearchParams(body);
  const email = form.get('email')?.trim() ?? '';
  const password = form.get('password') ?? '';
  if (!email || email.length > 254 || !password || password.length > 1024) return null;
  return { email, password };
}
