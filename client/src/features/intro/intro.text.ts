import type { Language } from '../language/savedLanguage';

type IntroText = {
  sectionLabel: string;
  greeting: string;
  photoAlt: string;
  headline: string;
  mutedLine: string;
  summary: string;
  callLabel: string;
  callHoverLabel: string;
};

export const introText: Record<Language, IntroText> = {
  en: {
    sectionLabel: 'Intro',
    greeting: "Hi, I'm Joseph",
    photoAlt: 'Joseph Sabag',
    headline: 'Stuck at "almost done"?',
    mutedLine: "Let's finish it",
    summary:
      "Most people who message me come with the same story. There's an idea, sometimes half an app already, and it's been stuck for months. Honestly, those are my favorite projects. I'm a software engineer, and I take it from \"almost\" to live, with real customers paying. Hire me per project, bring me in as a partner for equity, or a bit of both. Either way, you'll hear from me every Friday.",
    callLabel: "Let's talk",
    callHoverLabel: '15 minutes, no sales pitch',
  },
  he: {
    sectionLabel: 'פתיחה',
    greeting: 'היי, אני יוסף',
    photoAlt: 'יוסף סבג',
    headline: 'תקועים על "כמעט מוכן"?',
    mutedLine: 'בואו נסיים את זה',
    summary:
      'רוב מי שכותב לי מגיע עם אותו סיפור. יש רעיון, לפעמים כבר חצי אפליקציה, והכול תקוע כבר כמה חודשים. בכנות, אלה הפרויקטים שאני הכי אוהב. אני מהנדס תוכנה, ואני לוקח את זה מ"כמעט" לאוויר, עם לקוחות אמיתיים שמשלמים. אפשר לעבוד איתי לפי פרויקט, לצרף אותי כשותף תמורת אקוויטי, או קצת מזה וקצת מזה. בכל מקרה, בסוף כל שבוע תקבלו ממני עדכון.',
    callLabel: 'בואו נדבר',
    callHoverLabel: 'רבע שעה, בלי חפירות',
  },
};
