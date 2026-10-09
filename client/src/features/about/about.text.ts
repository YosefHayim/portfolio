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
    heading: 'No agency, no handoffs',
    mutedHeadingLines: ['You talk to the person', 'who writes the code'],
    paragraphs: [
      "There's no account manager between us. The person answering your WhatsApp is the one writing your code. And if a feature isn't worth the money, you'll hear it from me first.",
      "Quick background: I've worked on systems that handle 83 million requests a day, moved ten years of data without losing a single row, put an app on the App Store and built an open-source eBay server with 387 tools. Mostly it taught me which shortcuts are fine and which ones come back to bite you on a Saturday.",
      "Before all that I served in Nahal's 931st Battalion, as a combat soldier and then as a commander, with an excellence award in both. What stuck with me: clear plan, clear owner, clear date. That's how I run projects. You'll get an update every Friday, even when the week was a mess.",
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
    heading: 'בלי סוכנות, בלי מתווכים',
    mutedHeadingLines: ['מדברים ישר עם מי', 'שכותב את הקוד'],
    paragraphs: [
      "אין בינינו מנהל לקוח. מי שעונה לכם בוואטסאפ הוא מי שכותב לכם את הקוד. ואם פיצ'ר מסוים לא שווה את הכסף, תשמעו את זה ממני ראשון.",
      'קצת רקע: עבדתי על מערכות שמטפלות ב-83 מיליון בקשות ביום, העברתי עשר שנים של נתונים בלי לאבד שורה אחת, העליתי אפליקציה ל-App Store ובניתי שרת קוד פתוח ל-eBay עם 387 כלים. בעיקר למדתי מזה אילו קיצורי דרך בסדר, ואילו יחזרו אליכם בשבת בבוקר.',
      'לפני כל זה שירתתי בגדוד 931 של הנח"ל, כלוחם ואחר כך כמפקד, וקיבלתי הצטיינות בשני התפקידים. מה שנשאר איתי: תוכנית ברורה, אחראי ברור, תאריך ברור. ככה אני מנהל פרויקטים. בסוף כל שבוע תקבלו עדכון, גם כשהשבוע היה בלגן.',
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
