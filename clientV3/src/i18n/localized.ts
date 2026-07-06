import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'he';

export const LANGUAGES: Language[] = ['en', 'he'];

export const RTL_LANGUAGES = new Set<Language>(['he']);

const SUPPORTED_LANGUAGES = new Set<string>(LANGUAGES);

/** A value authored in every supported language — EN and HE side by side. */
export type Localized<T> = Record<Language, T>;

const isLanguage = (value: string): value is Language => SUPPORTED_LANGUAGES.has(value);

/**
 * Coerces an i18next language string to a supported language.
 *
 * @param value - Browser, stored, or i18next language code.
 * @returns Supported portfolio language code.
 * @example
 * normalizeLanguage('he-IL') // 'he'
 */
export const normalizeLanguage = (value: string): Language => {
  // Raw example: "he-IL" -> ["he", "IL"]
  const [base = 'en'] = value.split('-');

  return isLanguage(base) ? base : 'en';
};

/**
 * Resolves localized content for the requested language.
 *
 * @param value - Content authored for every supported language.
 * @param language - Requested language code from the app or browser.
 * @returns Content in the normalized language.
 * @example
 * pick({ en: 'Hello', he: 'שלום' }, 'he-IL') // 'שלום'
 */
export const pick = <T>(value: Localized<T>, language: string): T =>
  value[normalizeLanguage(language)];

/**
 * Access the active language plus a bound `pick` — the one hook components use
 * to read `Localized` content (blog posts, profile bullets, project blurbs).
 */
export const useLocale = () => {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.language);
  return {
    language,
    isRtl: RTL_LANGUAGES.has(language),
    localize: <T>(value: Localized<T>): T => pick(value, language),
  };
};
