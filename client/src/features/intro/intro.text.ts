import type { Language } from '../language/savedLanguage';
import type { WorkTypeName } from './workTypes';

type WorkTypeText = {
  label: string;
  caption: string;
};

type IntroText = {
  sectionLabel: string;
  greeting: string;
  photoAlt: string;
  headline: string;
  mutedLine: string;
  summary: string;
  callLabel: string;
  callHoverLabel: string;
  showcaseLabel: string;
  workTypes: Record<WorkTypeName, WorkTypeText>;
};

export const introText: Record<Language, IntroText> = {
  en: {
    sectionLabel: 'Intro',
    greeting: "Hi, I'm Joseph",
    photoAlt: 'Joseph Sabag',
    headline: 'I turn ideas into software',
    mutedLine: 'that works for real customers',
    summary:
      'It can be a website, an app, an automation or an AI tool. Sometimes we start from scratch, sometimes from something that got stuck halfway. Work with me per project, as a partner for equity, or a mix of both.',
    callLabel: "Let's talk",
    callHoverLabel: '15 minutes, no sales pitch',
    showcaseLabel: 'What I build',
    workTypes: {
      website: {
        label: 'Websites',
        caption: "A nonprofit's system for donors, donations and reports",
      },
      app: { label: 'Apps', caption: 'Apps with AI that runs right on the phone' },
      automation: { label: 'Automations', caption: 'Automations that end hours of copy-paste' },
      aiTool: { label: 'AI tools', caption: 'Open-source AI tools, like AI that talks to eBay' },
      extension: {
        label: 'Extensions',
        caption: 'Chrome extensions that do the work on their own',
      },
    },
  },
  he: {
    sectionLabel: 'פתיחה',
    greeting: 'היי, אני יוסף',
    photoAlt: 'יוסף סבג',
    headline: 'אני הופך רעיונות לתוכנה',
    mutedLine: 'שעובדת אצל לקוחות אמיתיים',
    summary:
      'זה יכול להיות אתר, אפליקציה, אוטומציה או כלי AI. לפעמים מתחילים מאפס, ולפעמים ממשהו שנתקע באמצע הדרך. אפשר לעבוד איתי לפי פרויקט, כשותף תמורת אקוויטי, או שילוב של שניהם.',
    callLabel: 'בואו נדבר',
    callHoverLabel: 'רבע שעה, בלי חפירות',
    showcaseLabel: 'מה אני בונה',
    workTypes: {
      website: { label: 'אתרים ומערכות', caption: 'מערכת ניהול לעמותה: תורמים, תרומות ודוחות' },
      app: { label: 'אפליקציות', caption: 'אפליקציות עם AI שרץ ישר על הטלפון' },
      automation: { label: 'אוטומציות', caption: 'אוטומציות שחוסכות שעות של העתק-הדבק' },
      aiTool: { label: 'כלי AI', caption: 'כלי AI בקוד פתוח, למשל AI שמדבר עם eBay' },
      extension: { label: 'תוספים לכרום', caption: 'תוספים לכרום שעושים את העבודה לבד' },
    },
  },
};
