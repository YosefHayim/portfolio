import type { Language } from './savedLanguage';

type LanguageText = {
  switchLabel: string;
};

export const languageText: Record<Language, LanguageText> = {
  en: { switchLabel: 'Switch language: English / Hebrew' },
  he: { switchLabel: 'החלפת שפה: אנגלית / עברית' },
};
