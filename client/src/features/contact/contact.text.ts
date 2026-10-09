import type { Language } from '../language/savedLanguage';

type ContactText = {
  headingLines: [string, string];
  mutedLine: string;
  callLabel: string;
  backToTopLabel: string;
  copyHandleLabel: string;
  copyHandleTooltip: string;
  copiedNotice: string;
};

export const contactText: Record<Language, ContactText> = {
  en: {
    headingLines: ['Worst case, you get', 'a free second opinion'],
    mutedLine: 'Best case, a launch date',
    callLabel: 'Grab 15 minutes →',
    backToTopLabel: '↑ Back to top',
    copyHandleLabel: 'Copy X handle @yosefhayim',
    copyHandleTooltip: 'Copy @yosefhayim',
    copiedNotice: 'Copied @yosefhayim',
  },
  he: {
    headingLines: ['במקרה הגרוע, קיבלתם', 'חוות דעת שנייה בחינם'],
    mutedLine: 'במקרה הטוב, תאריך השקה',
    callLabel: 'לתפוס רבע שעה ←',
    backToTopLabel: '↑ חזרה למעלה',
    copyHandleLabel: 'העתקת שם המשתמש ב-X: @yosefhayim',
    copyHandleTooltip: 'העתקת @yosefhayim',
    copiedNotice: 'הועתק: @yosefhayim',
  },
};
