import { describe, expect, it } from '@effect/vitest';
import {
  chromeExtensionUrl,
  extractChromeUsers,
  isValidChromeExtensionId,
} from './chromeExtensionUsers.js';

describe('extractChromeUsers', () => {
  it('parses plain and comma-separated user counts from store HTML', () => {
    expect(extractChromeUsers('<div>>1,234 users</div>')).toBe(1234);
    expect(extractChromeUsers('<span>>42 user</span>')).toBe(42);
    expect(extractChromeUsers('>10,000+ users')).toBe(10000);
    expect(extractChromeUsers('>  9,876+  Users  ')).toBe(9876);
  });

  it('returns null when no user count marker is present', () => {
    expect(extractChromeUsers('<html><body>no stats</body></html>')).toBeNull();
    expect(extractChromeUsers('')).toBeNull();
    expect(extractChromeUsers('users without a leading count')).toBeNull();
  });
});

// Chrome Web Store ids are 32 chars drawn only from a–p (16-letter alphabet).
const VALID_EXTENSION_ID = 'abcdefghijklmnopabcdefghijklmnop';

describe('isValidChromeExtensionId', () => {
  it('accepts 32-character a–p store ids only', () => {
    expect(VALID_EXTENSION_ID).toHaveLength(32);
    expect(isValidChromeExtensionId(VALID_EXTENSION_ID)).toBe(true);

    expect(isValidChromeExtensionId('abcdefghijklmnopabcdefghijklmno')).toBe(false); // 31
    expect(isValidChromeExtensionId('abcdefghijklmnopabcdefghijklmnopq')).toBe(false); // 33
    expect(isValidChromeExtensionId('abcdefghijklmnopabcdefghijklmnqq')).toBe(false); // q outside a-p
    expect(isValidChromeExtensionId('ABCDEFGHIJKLMNOPABCDEFGHIJKLMNOP')).toBe(false); // uppercase
    expect(isValidChromeExtensionId('not-an-id')).toBe(false);
  });
});

describe('chromeExtensionUrl', () => {
  it('builds the public Chrome Web Store detail URL', () => {
    expect(chromeExtensionUrl(VALID_EXTENSION_ID)).toBe(
      `https://chromewebstore.google.com/detail/${VALID_EXTENSION_ID}`,
    );
  });
});
