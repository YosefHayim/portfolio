import type { Language } from '../language/savedLanguage';

type WhatsappText = {
  message: string;
};

export const whatsappText: Record<Language, WhatsappText> = {
  en: {
    message:
      "Hi Joseph, I found you through your site. I've got a project and would love 15 minutes to talk it through.",
  },
  he: { message: 'היי יוסף, הגעתי דרך האתר. יש לי פרויקט ואשמח לרבע שעה כדי לדבר עליו.' },
};
