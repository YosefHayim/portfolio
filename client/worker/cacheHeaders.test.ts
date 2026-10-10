import { describe, expect, it } from 'vitest';
import { cacheControlFor } from './cacheHeaders';

const revalidate = 'public, max-age=0, must-revalidate';

describe('cache headers', () => {
  it('keeps hashed build files for a year', () => {
    const cacheControl = cacheControlFor('/assets/main-Bx81kQ2a.js', 200, revalidate);
    expect(cacheControl).toBe('public, max-age=31536000, immutable, no-transform');
  });
  it.each(['/', '/favicon.svg', '/robots.txt', '/sitemap.xml'])(
    'revalidates %s on every visit',
    (pathname) =>
      expect(cacheControlFor(pathname, 200, revalidate)).toBe(`${revalidate}, no-transform`),
  );
  it.each([304, 404])('does not pin a %s answer for a hashed path', (status) =>
    expect(cacheControlFor('/assets/missing.js', status, revalidate)).toBe(
      `${revalidate}, no-transform`,
    ),
  );
});
