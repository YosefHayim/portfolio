import { describe, expect, it } from 'vitest';
import { whatsappLink } from './whatsappLink';

describe('WhatsApp link', () => {
  it.each(['en', 'he'] as const)(
    'uses the international number and a filled-in %s message',
    (language) => {
      const link = whatsappLink(language);
      const url = new URL(link);
      expect(url.origin).toBe('https://wa.me');
      expect(url.pathname).toBe('/972546187549');
      const message = url.searchParams.get('text');
      expect(message).toContain(language === 'he' ? 'היי יוסף' : 'Hi Joseph');
    },
  );
});
