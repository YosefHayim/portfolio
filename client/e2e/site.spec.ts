import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { copy, type Language } from '../src/copy';
import { scenarios } from '../src/scenarios';

const widths = [320, 390, 430, 768, 1440];
const languages: Language[] = ['en', 'he'];

for (const language of languages) {
  for (const width of widths) {
    test(`${language} layout and contacts at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((choice) => localStorage.setItem('jts-language', choice), language);
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      const response = await page.goto('/');
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      await expect(page.locator('html')).toHaveAttribute('dir', language === 'he' ? 'rtl' : 'ltr');
      await expect(page.getByRole('heading', { level: 1 })).toContainText(copy[language].hero);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);
      const images = page.locator('img');
      for (const portrait of await images.all()) {
        await portrait.scrollIntoViewIfNeeded();
        await expect(portrait).toHaveJSProperty('complete', true);
        const naturalWidth = await portrait.evaluate((image) =>
          image instanceof HTMLImageElement ? image.naturalWidth : 0,
        );
        expect(naturalWidth).toBeGreaterThan(0);
      }
      for (const contact of await page.locator('a.contact').all()) {
        const href = await contact.getAttribute('href');
        expect(href).toBeTruthy();
        const address = new URL(href || '');
        expect(address.origin).toBe('https://wa.me');
        expect(address.pathname).toBe('/972546187549');
        expect(address.searchParams.get('text')).toBe(copy[language].message);
      }
      for (const section of await page.locator('.sheet').all()) {
        await section.scrollIntoViewIfNeeded();
        const clipping = await section.evaluate((sheet) => {
          const bounds = sheet.getBoundingClientRect();
          return [...sheet.querySelectorAll('h1,h2,h3,p,button,li,a.contact')]
            .filter((element) => {
              const rectangle = element.getBoundingClientRect();
              return (
                rectangle.width > 0 &&
                (rectangle.left < bounds.left - 1 ||
                  rectangle.right > bounds.right + 1 ||
                  element.scrollWidth > element.clientWidth + 2)
              );
            })
            .map((element) => element.textContent);
        });
        expect(clipping).toEqual([]);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      const violations = await new AxeBuilder({ page }).analyze();
      expect(violations.violations).toEqual([]);
      expect(pageErrors).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`full-${language}-${width}.png`),
        fullPage: true,
      });
      for (const sectionId of ['hero', 'services', 'situations', 'about', 'contact']) {
        const section = page.locator(`#${sectionId}`);
        await section.screenshot({
          path: testInfo.outputPath(`${sectionId}-${language}-${width}.png`),
        });
      }
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      for (const sectionId of ['hero', 'services', 'situations', 'about', 'contact']) {
        await page.evaluate((id) => {
          const sheets = [...document.querySelectorAll<HTMLElement>('.sheet')];
          const position = sheets.findIndex((sheet) => sheet.id === id);
          const previous = sheets.slice(0, position);
          const top = previous.reduce((height, sheet) => height + sheet.offsetHeight + 8, 0);
          window.scrollTo({ top, behavior: 'instant' });
        }, sectionId);
        const heading = page.locator(`#${sectionId}`).getByRole('heading').first();
        await expect(heading).toBeInViewport();
        const uncovered = await heading.evaluate((title) => {
          const bounds = title.getBoundingClientRect();
          const foreground = document.elementFromPoint(
            bounds.left + bounds.width / 2,
            bounds.top + bounds.height / 2,
          );
          return title.contains(foreground);
        });
        expect(uncovered, `${sectionId} heading must remain readable during stacking`).toBe(true);
      }
    });
  }
}

test('browser language, manual choice, reload, and keyboard access', async ({
  browser,
}, testInfo) => {
  const tabKey =
    testInfo.project.name === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  const context = await browser.newContext({ locale: 'he-IL', reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'he');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto('about:blank');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press(tabKey);
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  const options = page.locator('.scenario-choice');
  await options.first().focus();
  await page.keyboard.press(tabKey);
  await page.keyboard.press('Enter');
  await expect(options.nth(1)).toHaveAttribute('aria-pressed', 'true');
  const focusVisible = await page.evaluate(() => {
    const active = document.activeElement;
    if (!active) return false;
    const bounds = active.getBoundingClientRect();
    const topElement = document.elementFromPoint(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    return active.contains(topElement);
  });
  expect(focusVisible).toBe(true);
  await context.close();
});

test('reduced motion leaves all eight situations selectable in both languages', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const language of languages) {
    await page.getByRole('button', { name: language === 'he' ? 'עב' : 'EN', exact: true }).click();
    for (const [position, scenario] of scenarios[language].entries()) {
      await page.locator('.scenario-choice').nth(position).click();
      await expect(page.locator('#scenario-panel')).toHaveAttribute('aria-label', scenario.title);
      await expect(page.locator('.scene')).toHaveAttribute('data-resolved', 'true');
      await expect(page.locator('.solution')).toContainText(scenario.solution);
      await expect(page.locator('.problem-carousel')).toHaveAttribute('data-running', 'false');
    }
  }
  await expect(page.locator('.pause-control')).toHaveCount(0);
});

for (const language of languages) {
  test(`${language} animation advances, pauses during interaction and offscreen, and loops without immediate repeats`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.addInitScript((choice) => localStorage.setItem('jts-language', choice), language);
    await page.clock.install();
    await page.goto('/');
    await page.locator('.scenario-preview').scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const carousel = page.locator('.problem-carousel');
    await expect(carousel).toHaveAttribute('data-running', 'true');
    await page.clock.runFor(3800);
    await expect(page.locator('.scene')).toHaveAttribute('data-resolved', 'true');
    await page
      .locator('.scenario-preview')
      .screenshot({ path: testInfo.outputPath('mobile-scene-resolved.png') });
    const first = await page.locator('#scenario-panel').getAttribute('aria-label');
    await page.clock.runFor(5500);
    await expect(page.locator('#scenario-panel')).not.toHaveAttribute('aria-label', first || '');
    await expect(page.locator('.scene')).toHaveAttribute('data-resolved', 'false');
    await page
      .locator('.scenario-preview')
      .screenshot({ path: testInfo.outputPath('mobile-scene-restarted.png') });
    const labels = [await page.locator('#scenario-panel').getAttribute('aria-label')];
    for (const cycle of [1, 2, 3, 4, 5, 6, 7, 8]) {
      await page.clock.runFor(9100);
      const title = await page.locator('#scenario-panel').getAttribute('aria-label');
      expect(title, `cycle ${cycle}`).not.toBe(labels[labels.length - 1]);
      labels.push(title);
    }
    await page.locator('.pause-control').click();
    await expect(carousel).toHaveAttribute('data-running', 'false');
    const pausedScene = await page.locator('#scenario-panel').getAttribute('aria-label');
    await page.clock.runFor(20000);
    await expect(page.locator('#scenario-panel')).toHaveAttribute('aria-label', pausedScene || '');
    await page.locator('.pause-control').click();
    await page.locator('.pause-control').evaluate((button) => button.blur());
    await page.mouse.move(0, 0);
    await expect(carousel).toHaveAttribute('data-running', 'true');
    await page.locator('.scene').hover();
    await expect(carousel).toHaveAttribute('data-running', 'false');
    await page.mouse.move(0, 0);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(carousel).toHaveAttribute('data-running', 'false');
  });
}

test('retired routes are actual 404s and assets have security headers', async ({ request }) => {
  for (const path of [
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
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    const body = await response.text();
    expect(body).not.toContain('<div id="root">');
  }
  const response = await request.get('/');
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
  const portrait = await request.get('/portrait.webp');
  expect(portrait.status()).toBe(200);
  expect(portrait.headers()['content-type']).toContain('image/webp');
});
