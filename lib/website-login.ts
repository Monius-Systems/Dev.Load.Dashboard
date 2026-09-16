// Where signing in happens. The dashboard is reached from the Client Login on
// the Monius website, so signing out returns there rather than to the
// dashboard's own page. The address comes from the server (WEBSITE_URL), which
// only accepts https, or http on a loopback address in development.

/** The website's Client Login, or the dashboard's own page when unset. */
export function websiteLoginUrl(website: string | null | undefined): string {
  if (!website) return '/login';
  try {
    const base = website.endsWith('/') ? website : `${website}/`;
    const url = new URL('login', base);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '/login';
  } catch {
    return '/login';
  }
}
