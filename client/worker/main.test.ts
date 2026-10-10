import { describe, expect, it } from 'vitest';
import site from './main';

const siteServing = (fetchFile: () => Promise<Response>): Env => ({
  ASSETS: {
    fetch: fetchFile,
    connect: () => {
      throw new Error('The site never opens sockets');
    },
  },
});

const revalidatingFile = () =>
  Promise.resolve(
    new Response('file', { headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' } }),
  );

describe('site worker', () => {
  it('sends former domains to the canonical site', async () => {
    const env = siteServing(revalidatingFile);
    const request = new Request('https://yosefhayimsabag.com/page?ref=old');
    const response = await site.fetch(request, env);
    expect(response.status).toBe(308);
    expect(response.headers.get('Location')).toBe('https://joseph-tech-solutions.dev/page?ref=old');
  });
  it('serves hashed files with a long cache and security headers', async () => {
    const env = siteServing(revalidatingFile);
    const request = new Request('https://joseph-tech-solutions.dev/assets/main-Bx81kQ2a.js');
    const response = await site.fetch(request, env);
    expect(response.headers.get('Cache-Control')).toBe(
      'public, max-age=31536000, immutable, no-transform',
    );
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });
  it('keeps the page itself revalidating', async () => {
    const env = siteServing(revalidatingFile);
    const request = new Request('https://joseph-tech-solutions.dev/');
    const response = await site.fetch(request, env);
    expect(response.headers.get('Cache-Control')).toBe(
      'public, max-age=0, must-revalidate, no-transform',
    );
  });
  it('answers 503 when the file store fails', async () => {
    const env = siteServing(() => Promise.reject(new Error('asset store down')));
    const request = new Request('https://joseph-tech-solutions.dev/');
    const response = await site.fetch(request, env);
    expect(response.status).toBe(503);
  });
});
