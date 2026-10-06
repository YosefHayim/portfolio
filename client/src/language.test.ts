import { describe, expect, it } from 'vitest';
import { browserLanguage, contactUrl } from './language';

describe('language and contact boundaries', () => {
  it.each(['he', 'he-IL', 'HE-il'])('detects Hebrew locale %s', (locale) =>
    expect(browserLanguage(locale)).toBe('he'),
  );
  it.each(['en-US', 'ar', 'fr', 'hello', ''])('defaults %s to English', (locale) =>
    expect(browserLanguage(locale)).toBe('en'),
  );
  it.each(['en', 'he'] as const)(
    'uses the international WhatsApp number and a localized message in %s',
    (language) => {
      const address = contactUrl(language);
      const url = new URL(address);
      expect(url.origin).toBe('https://wa.me');
      expect(url.pathname).toBe('/972546187549');
      const message = url.searchParams.get('text');
      expect(message).toContain(language === 'he' ? 'היי יוסף' : 'Hi Joseph');
    },
  );
});
