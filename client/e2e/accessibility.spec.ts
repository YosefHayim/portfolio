import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { languageText } from '../src/features/language/language.text';
import { problemsText } from '../src/features/problems/problems.text';
import { topBarText } from '../src/features/topBar/topBar.text';
import { languages, openSite, revealEverySection } from './openSite';

for (const language of languages) {
  test(`${language} page passes axe`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openSite(page, language);
    await revealEverySection(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('keyboard reaches the top bar and arrow keys move through the problems', async ({
  page,
}, testInfo) => {
  const tabKey =
    testInfo.project.name === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await openSite(page, 'en');

  await page.keyboard.press(tabKey);
  await expect(page.getByRole('button', { name: languageText.en.switchLabel })).toBeFocused();
  await page.keyboard.press(tabKey);
  const callLink = page
    .getByRole('navigation')
    .getByRole('link', { name: topBarText.en.callLabel });
  await expect(callLink).toBeFocused();

  const activeTab = page.locator('.problem-tab[aria-selected="true"]');
  await activeTab.focus();
  await page.keyboard.press('ArrowDown');
  await expect(activeTab.locator('.problem-tab-title')).toHaveText(
    problemsText.en.problems[1].title,
  );
  await expect(activeTab).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(activeTab.locator('.problem-tab-title')).toHaveText(
    problemsText.en.problems[7].title,
  );
  await expect(activeTab).toBeFocused();
});
