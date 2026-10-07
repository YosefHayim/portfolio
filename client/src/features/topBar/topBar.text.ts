import type { Language } from '../language/savedLanguage';

type TopBarText = {
  navigationLabel: string;
  callLabel: string;
  callHoverLabel: string;
};

export const topBarText: Record<Language, TopBarText> = {
  en: { navigationLabel: 'Primary', callLabel: "Let's talk", callHoverLabel: '15 min · free' },
  he: { navigationLabel: 'ראשי', callLabel: 'בואו נדבר', callHoverLabel: '15 דק׳ · בחינם' },
};
