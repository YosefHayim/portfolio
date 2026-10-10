import type { Language } from '../language/savedLanguage';

type ContactText = {
  headingLines: [string, string];
  mutedLine: string;
  callLabel: string;
  copyHandleLabel: string;
  copyHandleTooltip: string;
  copiedNotice: string;
};

export const contactText: Record<Language, ContactText> = {
  en: {
    headingLines: ['My WhatsApp is open', "and I'm the one who answers"],
    mutedLine: 'No assistant, no bot, no forms',
    callLabel: 'Message me →',
    copyHandleLabel: 'Copy X handle @yosefhayim',
    copyHandleTooltip: 'Copy @yosefhayim',
    copiedNotice: 'Copied @yosefhayim',
  },
  he: {
    headingLines: ['הוואטסאפ שלי פתוח', 'ומי שעונה זה אני'],
    mutedLine: 'בלי מזכירה, בלי בוט, בלי טפסים',
    callLabel: 'כתבו לי ←',
    copyHandleLabel: 'העתקת שם המשתמש ב-X: @yosefhayim',
    copyHandleTooltip: 'העתקת @yosefhayim',
    copiedNotice: 'הועתק: @yosefhayim',
  },
};
