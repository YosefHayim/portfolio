import type { Language } from '../language/savedLanguage';

type ProblemText = {
  title: string;
  subtitle: string;
  fix: string;
};

type ProblemsText = {
  heading: string;
  mutedHeading: string;
  tablistLabel: string;
  fixLabel: string;
  problems: ProblemText[];
};

export const problemsText: Record<Language, ProblemsText> = {
  en: {
    heading: 'Sound familiar?',
    mutedHeading: "I've fixed every one of these",
    tablistLabel: 'Common problems',
    fixLabel: 'The fix:',
    problems: [
      {
        title: '"It works on my laptop, I swear."',
        subtitle: "Customers still can't buy it",
        fix: "I put it online properly: a real domain, payments, sign-in, alerts and backups. I've done this enough times that it's boring, and boring is exactly what you want.",
      },
      {
        title: '"Back to you tomorrow." That was May.',
        subtitle: 'Half-done code, zero docs',
        fix: "I take over the mess, no judgment. First I map what's there, then I fix the risky parts, then we move. And I answer my phone. Apparently that's rare.",
      },
      {
        title: '"AI wrote it. I just hit enter."',
        subtitle: 'Now nobody wants to touch it',
        fix: 'AI is a fast junior with no memory. I do the senior part: read it, lock it down, add tests, and leave code the next person can follow. No rewrite.',
      },
      {
        title: '"It\'s 90% done." Since March.',
        subtitle: 'The date moves, so does the budget',
        fix: 'I write a short scope we both agree on, show you a working demo every week, and commit to a date. No more "almost".',
      },
      {
        title: '"Why does nobody finish checkout?"',
        subtitle: 'The page takes 8 seconds to load',
        fix: "I measure before I touch anything. Usually it's heavy images or slow database calls. I fix the worst one first, then the next. The goal is under a second.",
      },
      {
        title: '"Wait, which spreadsheet is the real one?"',
        subtitle: 'Five tools, all copy-paste',
        fix: 'I connect the tools you already pay for, so the CRM, sheets, shop and invoices update each other. You stop being the copy-paste in between.',
      },
      {
        title: '"I just need a tech co-founder."',
        subtitle: 'The post still has 0 replies',
        fix: 'I join as your engineer. Per project, for equity, or a mix that feels fair to both of us. You bring the customers, I build something that lasts.',
      },
      {
        title: '"Can someone please automate this?"',
        subtitle: 'Your team types it all by hand',
        fix: 'I find the stuff someone does the same way every day and hand it to a script. Your team gets their afternoons back.',
      },
    ],
  },
  he: {
    heading: 'נשמע מוכר?',
    mutedHeading: 'תיקנתי כל אחד מאלה',
    tablistLabel: 'בעיות נפוצות',
    fixLabel: 'הפתרון:',
    problems: [
      {
        title: '"אצלי במחשב זה עובד, נשבע."',
        subtitle: 'אבל לקוחות עדיין לא יכולים לקנות',
        fix: 'אני מעלה את זה לאוויר כמו שצריך: דומיין אמיתי, תשלומים, התחברות, התראות וגיבויים. עשיתי את זה מספיק פעמים שזה כבר משעמם, ומשעמם זה בדיוק מה שאתם צריכים.',
      },
      {
        title: '"אחזור אליך מחר." זה היה במאי.',
        subtitle: 'קוד חצי גמור, אפס תיעוד',
        fix: 'אני לוקח את הבלגן בלי לשפוט. קודם ממפה מה יש, אחר כך מתקן את מה שמסוכן, ואז מתקדמים. ואני עונה לטלפון. מסתבר שזה נדיר.',
      },
      {
        title: '"ה-AI כתב, אני רק לחצתי אנטר."',
        subtitle: 'ועכשיו אף אחד לא מעז לגעת בזה',
        fix: "AI זה ג'וניור מהיר בלי זיכרון. אני עושה את החלק של הסניור: קורא את הקוד, סוגר פרצות, מוסיף טסטים ומשאיר קוד שגם הבא בתור יבין. בלי לכתוב מאפס.",
      },
      {
        title: '"זה 90% מוכן." מאז מרץ.',
        subtitle: 'התאריך זז, והתקציב איתו',
        fix: 'אני כותב תכולה קצרה ששנינו מסכימים עליה, מראה לכם דמו עובד כל שבוע ומתחייב לתאריך. בלי עוד "כמעט".',
      },
      {
        title: '"למה אף אחד לא מסיים לקנות?"',
        subtitle: 'הדף נטען 8 שניות',
        fix: 'אני מודד לפני שאני נוגע במשהו. בדרך כלל זה תמונות כבדות או שאילתות איטיות. מתקן קודם את הכי גרוע, ואז את הבא. המטרה: פחות משנייה.',
      },
      {
        title: '"רגע, איזה אקסל הוא הנכון?"',
        subtitle: 'חמישה כלים, והכול בהעתק-הדבק',
        fix: 'אני מחבר את הכלים שאתם כבר משלמים עליהם, כך שה-CRM, האקסלים, החנות והחשבוניות מעדכנים אחד את השני. אתם מפסיקים להיות ההעתק-הדבק באמצע.',
      },
      {
        title: '"רק צריך שותף טכני."',
        subtitle: 'והפוסט עדיין על 0 תגובות',
        fix: 'אני מצטרף כמהנדס שלכם. לפי פרויקט, תמורת אקוויטי, או שילוב שמרגיש הוגן לשנינו. אתם מביאים את הלקוחות, אני בונה משהו שמחזיק.',
      },
      {
        title: '"מישהו יכול לעשות לזה אוטומציה כבר?"',
        subtitle: 'הצוות מקליד הכול ידנית',
        fix: 'אני מוצא את מה שמישהו עושה כל יום באותה דרך ומעביר את זה לסקריפט. הצוות שלכם מקבל בחזרה את אחר הצהריים.',
      },
    ],
  },
};
