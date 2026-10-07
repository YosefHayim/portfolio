import type { Language } from './features/language/savedLanguage';

type PageTitleText = {
  title: string;
};

export const pageTitleText: Record<Language, PageTitleText> = {
  en: { title: 'Joseph Sabag | Software engineer for founders' },
  he: { title: 'יוסף סבג | מהנדס תוכנה ליזמים ולעסקים' },
};
