import { expect, type Page, test } from '@playwright/test';
import { problemsText } from '../src/features/problems/problems.text';
import { languages, openSite } from './openSite';

const problemDuration = 3800;
const cycleDuration = 10600;
const cycleWithMargin = cycleDuration + 500;

const activeProblemTitle = (page: Page) =>
  page.locator('.problem-tab[aria-selected="true"] .problem-tab-title');

for (const language of languages) {
  test(`${language} problems show their fix, move on, and never repeat back to back`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.clock.install();
    await openSite(page, language);
    const text = problemsText[language];
    const panel = page.locator('#problem-animation-panel');
    await panel.scrollIntoViewIfNeeded();

    await expect(activeProblemTitle(page)).toHaveText(text.problems[0].title);
    await page.clock.runFor(300);
    await expect(page.locator('.problem-fix-text')).toContainText(text.problems[0].fix);
    await expect(panel).not.toHaveClass(/is-showing-fix/);
    await page.clock.runFor(problemDuration);
    await expect(panel).toHaveClass(/is-showing-fix/);

    const titles = [text.problems[0].title];
    for (const cycle of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      const previousTitle = String(titles.at(-1));
      await page.clock.runFor(cycleWithMargin);
      await expect(activeProblemTitle(page), `cycle ${cycle}`).not.toHaveText(previousTitle);
      const title = await activeProblemTitle(page).textContent();
      titles.push(String(title));
    }
  });
}

test('problems wait until they are on screen and pause while covered', async ({ page }) => {
  test.setTimeout(60000);
  await page.clock.install();
  await openSite(page, 'en');
  await page.clock.runFor(20000);
  await expect(page.locator('.problem-progress-bar.is-running')).toHaveCount(0);

  await page.locator('#problem-animation-panel').scrollIntoViewIfNeeded();
  await expect(page.locator('.problem-progress-bar.is-running')).toHaveCount(1);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  const problemsCoverDim = () =>
    page.locator('#problems').evaluate((section) => section.style.getPropertyValue('--cover-dim'));
  await expect.poll(problemsCoverDim).toBe('0.300');
  await page.clock.runFor(cycleDuration);
  const pausedTitle = await activeProblemTitle(page).textContent();
  await page.clock.runFor(cycleDuration * 3);
  await expect(activeProblemTitle(page)).toHaveText(String(pausedTitle));
});

test('with reduced motion every problem still reaches its fix', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await openSite(page, 'en');
  const text = problemsText.en;
  const panel = page.locator('#problem-animation-panel');
  await page.locator('.problem-tab[aria-selected="true"]').focus();
  for (const [problem, details] of text.problems.entries()) {
    if (problem > 0) await page.keyboard.press('ArrowDown');
    await expect(activeProblemTitle(page)).toHaveText(details.title);
    await page.clock.runFor(700);
    await expect(panel).toHaveClass(/is-showing-fix/);
    await expect(page.locator('.problem-fix-text')).toContainText(details.fix);
  }
});

test('the iceberg dives under water and comes back up', async ({ page }) => {
  await page.clock.install();
  await openSite(page, 'en');
  const iceberg = page.locator('.iceberg');
  await iceberg.scrollIntoViewIfNeeded();
  await expect(iceberg).not.toHaveClass(/is-showing-underwater/);
  await page.clock.runFor(3100);
  await expect(iceberg).toHaveClass(/is-showing-underwater/);
  await page.clock.runFor(6400);
  await expect(iceberg).not.toHaveClass(/is-showing-underwater/);
});
