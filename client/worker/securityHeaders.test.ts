import { describe, expect, it } from 'vitest';
import { addSecurityHeaders } from './securityHeaders';

describe('security headers', () => {
  it('locks framing, sniffing, referrers and outside sources', () => {
    const headers = new Headers({ 'Content-Type': 'text/html' });
    addSecurityHeaders(headers);
    expect(headers.get('Content-Type')).toBe('text/html');
    expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headers.get('X-Frame-Options')).toBe('DENY');
    expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    const policy = headers.get('Content-Security-Policy');
    expect(policy).toContain("font-src 'self'");
    expect(policy).toContain("frame-ancestors 'none'");
  });
});
