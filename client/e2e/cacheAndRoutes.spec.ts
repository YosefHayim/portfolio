import { expect, test } from '@playwright/test';
import { openSite } from './openSite';

const retiredPaths = [
  '/v1/',
  '/v2/',
  '/v3/',
  '/v4/',
  '/blog',
  '/jts',
  '/sorqa',
  '/prompt-queue',
  '/privacy',
  '/api/chat',
  '/missing.png',
  '/assets/missing.js',
];

test('the page revalidates on every visit and repeat visits get a 304', async ({ request }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
  const headers = response.headers();
  expect(headers['cache-control']).toBe('public, max-age=0, must-revalidate, no-transform');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers.etag).toBeTruthy();
  const repeatVisit = await request.get('/', { headers: { 'If-None-Match': headers.etag } });
  expect(repeatVisit.status()).toBe(304);
});

test('hashed files are cached for a year', async ({ page, request }) => {
  await openSite(page, 'en');
  const assetUrls = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((name) => new URL(name).pathname.startsWith('/assets/')),
  );
  expect(assetUrls.length).toBeGreaterThan(2);
  for (const assetUrl of assetUrls) {
    const asset = await request.get(assetUrl);
    expect(asset.status(), assetUrl).toBe(200);
    expect(asset.headers()['cache-control'], assetUrl).toBe(
      'public, max-age=31536000, immutable, no-transform',
    );
  }
});

test('retired and unknown routes are real 404s that are never cached for long', async ({
  request,
}) => {
  for (const path of retiredPaths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    expect(response.headers()['cache-control'], path).not.toContain('immutable');
    const body = await response.text();
    expect(body, path).not.toContain('<div id="root">');
  }
});
