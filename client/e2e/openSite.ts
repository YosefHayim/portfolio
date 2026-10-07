import { expect, type Page } from '@playwright/test';
import type { Language } from '../src/features/language/savedLanguage';

export const languages: Language[] = ['en', 'he'];

export const openSite = async (page: Page, language: Language) => {
  await page.addInitScript((saved) => localStorage.setItem('jts-language', saved), language);
  return page.goto('/');
};

export const revealEverySection = async (page: Page) => {
  for (const revealed of await page.locator('.reveal-on-scroll').all()) {
    await revealed.scrollIntoViewIfNeeded();
  }
  await expect(page.locator('.reveal-on-scroll:not(.is-revealed)')).toHaveCount(0);
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll('.reveal-on-scroll')).every(
      (element) => getComputedStyle(element).opacity === '1',
    ),
  );
};
