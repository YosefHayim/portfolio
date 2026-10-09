import { expect, type Page, test } from '@playwright/test';
import { introText } from '../src/features/intro/intro.text';
import type { WorkTypeName } from '../src/features/intro/workTypes';
import type { Language } from '../src/features/language/savedLanguage';
import { languages, openSite } from './openSite';

const rotationDelay = 2800;

const findShowcase = (page: Page, language: Language) => {
  const text = introText[language];
  const showcase = page.getByRole('figure', { name: text.showcaseLabel });
  const workTypeButton = (workType: WorkTypeName) =>
    showcase.getByRole('button', { name: text.workTypes[workType].label, exact: true });
  return {
    text,
    panel: showcase.locator('.work-showcase-panel'),
    caption: showcase.locator('.work-showcase-caption'),
    workTypeButton,
  };
};

for (const language of languages) {
  test(`${language} showcase moves through the work types until a visitor picks one`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.clock.install();
    await openSite(page, language);
    const { text, panel, caption, workTypeButton } = findShowcase(page, language);
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toHaveClass(/is-visible/);
    await expect(workTypeButton('website')).toHaveAttribute('aria-pressed', 'true');
    await expect(caption).toHaveText(text.workTypes.website.caption);

    await page.clock.runFor(rotationDelay);
    await expect(workTypeButton('app')).toHaveAttribute('aria-pressed', 'true');
    await expect(workTypeButton('website')).toHaveAttribute('aria-pressed', 'false');
    await expect(caption).toHaveText(text.workTypes.app.caption);

    await workTypeButton('extension').click();
    await expect(caption).toHaveText(text.workTypes.extension.caption);
    await page.clock.runFor(rotationDelay * 3);
    await expect(workTypeButton('extension')).toHaveAttribute('aria-pressed', 'true');
  });
}

test('the showcase pauses while the next section covers it', async ({ page }) => {
  await page.clock.install();
  await openSite(page, 'en');
  const { panel } = findShowcase(page, 'en');
  await panel.scrollIntoViewIfNeeded();
  await expect(panel).toHaveClass(/is-visible/);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(panel).not.toHaveClass(/is-visible/);
  const pressedButton = panel.locator('.work-type-button[aria-pressed="true"]');
  const pausedLabel = String(await pressedButton.textContent());
  await page.clock.runFor(rotationDelay * 3);
  await expect(pressedButton).toHaveText(pausedLabel);
});

test('with reduced motion the showcase stays still until a visitor picks one', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await openSite(page, 'he');
  const { text, panel, caption, workTypeButton } = findShowcase(page, 'he');
  await panel.scrollIntoViewIfNeeded();
  await expect(panel).toHaveClass(/is-visible/);
  await page.clock.runFor(rotationDelay * 3);
  await expect(workTypeButton('website')).toHaveAttribute('aria-pressed', 'true');

  await workTypeButton('aiTool').click();
  await expect(workTypeButton('aiTool')).toHaveAttribute('aria-pressed', 'true');
  await expect(caption).toHaveText(text.workTypes.aiTool.caption);
});
