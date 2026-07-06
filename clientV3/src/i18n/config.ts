import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/common.json' with { type: 'json' };
import he from './locales/he/common.json' with { type: 'json' };
import { LANGUAGES, type Language, normalizeLanguage, RTL_LANGUAGES } from './localized.ts';

export const resources = {
  en: { common: en },
  he: { common: he },
};

/** Sync `<html lang>` + `dir` so RTL layout and screen readers follow the choice. */
const applyDocumentDirection = (language: string): void => {
  const normalized = normalizeLanguage(language);
  const root = document.documentElement;
  root.lang = normalized;
  root.dir = RTL_LANGUAGES.has(normalized) ? 'rtl' : 'ltr';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: LANGUAGES,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'portfolio-language',
    },
  });

applyDocumentDirection(i18n.language);
i18n.on('languageChanged', applyDocumentDirection);

export const changeLanguage = (language: Language): Promise<unknown> =>
  i18n.changeLanguage(language);
