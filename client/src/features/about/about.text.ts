import type { Language } from '../language/savedLanguage';
import type { IcebergLayerName } from './icebergLayers';

type AboutText = {
  heading: string;
  mutedHeadingLines: string[];
  paragraphs: string[];
  icebergLabel: string;
  icebergCaption: string;
  icebergCaptionBold: string;
  demoLabel: string;
  visibleShare: string;
  hiddenShare: string;
  layers: Record<IcebergLayerName, string>;
};

export const aboutText: Record<Language, AboutText> = {
  en: {
    heading: 'No agency, no middlemen',
    mutedHeadingLines: ['You talk to the person', 'who writes the code'],
    paragraphs: [
      "There's no account manager between us. The person answering your WhatsApp is the one writing your code. And if a feature isn't worth the money, I'll tell you straight, before we even start.",
      "How I got here: I used to be on your side. In 2022, when ChatGPT had just come out, I paid a Fiverr developer to automate my online store and got something late that I never ordered. So I sat down and learned to build it myself, and to do it properly: clean code that works and doesn't need fixing every week. Since then I've worked at startups, built websites and apps, and helped clients sort out their apps and get them onto the App Store. I know exactly what waiting on a developer feels like, and I make sure you won't have to.",
      "Here's how I work: a clear plan, a clear date, and an update every Friday on what shipped, what's next and what's blocking. Even when the week was a mess, you'll hear it from me. No chasing me down.",
    ],
    icebergLabel: 'Iceberg: everyone sees the demo, I build the part under the water',
    icebergCaption: 'Everyone sees the demo.',
    icebergCaptionBold: 'I build the part underneath.',
    demoLabel: 'The demo',
    visibleShare: '10% people see',
    hiddenShare: '90% that keeps it running',
    layers: {
      safeSignIn: 'Sign-in that holds',
      payments: 'Payments that go through',
      organizedData: 'Data that makes sense',
      testedUpdates: 'Tested on every change',
      attackProtection: 'Locked against attacks',
      earlyAlerts: 'Alerts before complaints',
      automaticBackups: 'Backups that restore',
      readyToGrow: 'Room to grow',
    },
  },
  he: {
    heading: 'בלי סוכנות, בלי טלפון שבור',
    mutedHeadingLines: ['מדברים ישר עם מי', 'שכותב את הקוד'],
    paragraphs: [
      "אין בינינו מנהל לקוח. מי שעונה לכם בוואטסאפ הוא מי שכותב את הקוד. ואם פיצ'ר לא שווה את הכסף, אני אגיד לכם את זה דוגרי, עוד לפני שהתחלנו.",
      'איך הגעתי לזה? פעם הייתי בצד שלכם. ב-2022, כש-ChatGPT רק יצא, שילמתי למתכנת מפייבר על אוטומציה לחנות שלי וקיבלתי באיחור משהו שלא הזמנתי. אז ישבתי ולמדתי לבנות בעצמי, ולעשות את זה כמו שצריך: קוד נקי שעובד, ולא צריך לתקן אותו כל שבוע. מאז עבדתי בסטארטאפים, בניתי אתרים ואפליקציות, ועזרתי ללקוחות לסדר את האפליקציה שלהם ולעלות איתה ל-App Store. אז אני יודע בדיוק איך זה לחכות למתכנת, ודואג שאצלי לא תצטרכו.',
      'ככה זה עובד אצלי: תוכנית ברורה, תאריך ברור, ועדכון בכל יום שישי על מה עלה, מה הבא בתור ומה תקוע. גם כשהשבוע היה על הפנים, תשמעו את זה ממני ולא תצטרכו לרדוף אחריי.',
    ],
    icebergLabel: 'קרחון: כולם רואים את הדמו, אני בונה את מה שמתחת למים',
    icebergCaption: 'כולם רואים את הדמו.',
    icebergCaptionBold: 'אני בונה את מה שמתחת.',
    demoLabel: 'הדמו',
    visibleShare: '10% שרואים',
    hiddenShare: '90% שמחזיקים את זה באוויר',
    layers: {
      safeSignIn: 'התחברות שמחזיקה',
      payments: 'תשלומים שעוברים',
      organizedData: 'נתונים שמסתדרים',
      testedUpdates: 'טסטים על כל שינוי',
      attackProtection: 'נעול מפני תקיפות',
      earlyAlerts: 'התראה לפני תלונה',
      automaticBackups: 'גיבויים שבאמת משחזרים',
      readyToGrow: 'מקום לגדול',
    },
  },
};
