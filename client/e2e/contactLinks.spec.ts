import { expect, test } from '@playwright/test';
import { contactText } from '../src/features/contact/contact.text';
import { whatsappText } from '../src/features/whatsapp/whatsapp.text';
import { languages, openSite } from './openSite';

for (const language of languages) {
  test(`${language} WhatsApp buttons open a chat with the prefilled message`, async ({ page }) => {
    await openSite(page, language);
    const whatsappLinks = page.locator('a[href^="https://wa.me/"]');
    await expect(whatsappLinks).toHaveCount(4);
    for (const link of await whatsappLinks.all()) {
      const href = await link.evaluate((anchor: HTMLAnchorElement) => anchor.href);
      const address = new URL(href);
      expect(address.pathname).toBe('/972546187549');
      expect(address.searchParams.get('text')).toBe(whatsappText[language].message);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener');
    }
  });
}

test('profile links point to LinkedIn and GitHub', async ({ page }) => {
  await openSite(page, 'en');
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/yosef-hayim-sabag/',
  );
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    /^https:\/\/github\.com\//,
  );
});

test('copying the X handle shows the copied notice', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Only Chromium lets Playwright grant clipboard access');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openSite(page, 'he');
  await page.getByRole('button', { name: contactText.he.copyHandleLabel }).click();
  await expect(page.getByRole('status')).toHaveText(contactText.he.copiedNotice);
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toBe('@yosefhayim');
});
