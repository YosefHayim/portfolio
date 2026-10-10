import { expect, test } from '@playwright/test';
import { introText } from '../src/features/intro/intro.text';
import { languages, openSite, revealEverySection } from './openSite';

const widths = [320, 390, 430, 768, 1440];

for (const language of languages) {
  for (const width of widths) {
    test(`${language} page fits ${width}px without clipping or errors`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') pageErrors.push(message.text());
      });
      page.on('requestfailed', (request) => pageErrors.push(request.url()));

      const response = await openSite(page, language);
      expect(response?.status()).toBe(200);
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', language);
      await expect(html).toHaveAttribute('dir', language === 'he' ? 'rtl' : 'ltr');
      const headline = page.getByRole('heading', { level: 1 });
      await expect(headline).toContainText(introText[language].headline);

      const photo = page.getByRole('img', { name: introText[language].photoAlt });
      await expect(photo).toHaveJSProperty('complete', true);
      const photoWidth = await photo.evaluate((image: HTMLImageElement) => image.naturalWidth);
      expect(photoWidth).toBeGreaterThan(0);

      await revealEverySection(page);
      const pageOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(pageOverflow).toBe(0);

      for (const section of await page.locator('main > section').all()) {
        const clippedText = await section.evaluate((sectionElement) => {
          const bounds = sectionElement.getBoundingClientRect();
          const textElements = sectionElement.querySelectorAll('h1, h2, p, a, button, li');
          return Array.from(textElements)
            .filter((element) => {
              const box = element.getBoundingClientRect();
              const hasText = Boolean(element.textContent?.trim());
              const isOutside = box.left < bounds.left - 1 || box.right > bounds.right + 1;
              const isCut = element.scrollWidth > element.clientWidth + 2;
              return hasText && box.width > 0 && (isOutside || isCut);
            })
            .map((element) => element.textContent);
        });
        expect(clippedText).toEqual([]);
      }
      expect(pageErrors).toEqual([]);
    });
  }

  test(`${language} section headings stay readable while sections stack`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openSite(page, language);
    const sectionTops = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('main > section')).map(
        (section) => section.getBoundingClientRect().top + window.scrollY,
      ),
    );
    for (const [position, sectionTop] of sectionTops.entries()) {
      await page.evaluate(
        (top) => window.scrollTo({ top: top - 8, behavior: 'instant' }),
        sectionTop,
      );
      const heading = page.locator('main > section').nth(position).getByRole('heading').first();
      await expect(heading).toBeInViewport();
      const isUncovered = await heading.evaluate((title) => {
        const box = title.getBoundingClientRect();
        const topElement = document.elementFromPoint(box.left + box.width / 2, box.bottom - 4);
        return title.contains(topElement);
      });
      expect(isUncovered, `section ${position} heading`).toBe(true);
    }
  });
}
