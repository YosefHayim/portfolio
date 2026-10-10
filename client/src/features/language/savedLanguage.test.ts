import { describe, expect, it } from 'vitest';
import { browserLanguage } from './savedLanguage';

describe('browser language', () => {
  it.each(['he', 'he-IL', 'HE-il'])('detects Hebrew locale %s', (locale) =>
    expect(browserLanguage(locale)).toBe('he'),
  );

  it.each(['en-US', 'ar', 'fr', 'hello', ''])('defaults %s to English', (locale) =>
    expect(browserLanguage(locale)).toBe('en'),
  );
});
