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
    heading: 'What people message me about most',
    mutedHeading: 'and what I do about it',
    tablistLabel: 'Common problems',
    fixLabel: 'The fix:',
    problems: [
      {
        title: '"It works on my laptop, I swear."',
        subtitle: "Customers still can't buy it",
        fix: "I put it online properly: domain, payments, sign-in, alerts and backups, and for an app, all the way through the App Store. I've done this enough times that it's boring, and trust me, boring is exactly what you want here.",
      },
      {
        title: '"Back to you tomorrow." That was May.',
        subtitle: 'Half-done code, zero docs',
        fix: "I take over the mess, no judgment. First I sort out what's there, then I close the risky parts, then we move. And I pick up the phone. Turns out that's not a given.",
      },
      {
        title: '"AI wrote it. I just hit enter."',
        subtitle: 'Now nobody wants to touch it',
        fix: 'AI is a fast junior with no memory. I do the senior part: go through the code, close the holes, add tests and leave code the next person can follow. No wiping it all and starting over.',
      },
      {
        title: '"It\'s 90% done." Since March.',
        subtitle: 'The date moves, so does the budget',
        fix: 'We write a short scope together: what\'s in, what\'s out. Every week you see a working demo, and I commit to a date. No more "just a few more days".',
      },
      {
        title: '"Why does nobody finish checkout?"',
        subtitle: 'The page takes 8 seconds to load',
        fix: "Measure first, touch second. It's usually heavy images or slow database calls. I fix whatever hurts most, then the next one. The goal is under a second.",
      },
      {
        title: '"Wait, which spreadsheet is the real one?"',
        subtitle: 'Five tools, all copy-paste',
        fix: 'I connect the tools you already pay for, so the CRM, sheets, shop and invoices talk to each other. You stop being the copy-paste in between.',
      },
      {
        title: '"I just need a tech co-founder."',
        subtitle: 'The post still has 0 replies',
        fix: 'I join as your engineer. Per project, for equity, or a mix that feels fair to both of us. You bring the customers, I build something that lasts.',
      },
      {
        title: '"Can someone please automate this?"',
        subtitle: 'Your team types it all by hand',
        fix: 'I find the stuff someone does the same way every day and hand it to a script. Your team gets their afternoons back, and their sanity.',
      },
    ],
  },
  he: {
    heading: 'על מה כותבים לי הכי הרבה',
    mutedHeading: 'ומה אני עושה עם זה',
    tablistLabel: 'בעיות נפוצות',
    fixLabel: 'הפתרון:',
    problems: [
      {
        title: '"אצלי במחשב זה עובד, נשבע."',
        subtitle: 'אבל לקוחות עדיין לא יכולים לקנות',
        fix: 'אני מעלה את זה לאוויר כמו שצריך: דומיין, תשלומים, התחברות, התראות וגיבויים, ואם זו אפליקציה, גם עד ה-App Store. עשיתי את זה מספיק פעמים שזה כבר משעמם, ותאמינו לי, משעמם זה בדיוק מה שאתם רוצים פה.',
      },
      {
        title: '"אחזור אליך מחר." זה היה במאי.',
        subtitle: 'קוד חצי גמור, אפס תיעוד',
        fix: 'אני לוקח את הבלגן בלי לשפוט. קודם עושה סדר במה שיש, אחר כך סוגר את מה שמסוכן, ואז מתקדמים. ואני עונה לטלפון. מסתבר שזה לא מובן מאליו.',
      },
      {
        title: '"ה-AI כתב, אני רק לחצתי אנטר."',
        subtitle: 'ועכשיו אף אחד לא מעז לגעת בזה',
        fix: "AI זה ג'וניור זריז בלי זיכרון. אני עושה את החלק של הסניור: עובר על הקוד, סוגר פרצות, מוסיף טסטים ומשאיר קוד שגם הבא בתור יבין. בלי למחוק הכול ולהתחיל מאפס.",
      },
      {
        title: '"זה 90% מוכן." מאז מרץ.',
        subtitle: 'התאריך זז, והתקציב איתו',
        fix: 'כותבים יחד תכולה קצרה, מה נכנס ומה לא. כל שבוע אתם רואים דמו שעובד, ואני מתחייב לתאריך. נגמר הסיפור של "עוד כמה ימים וזהו".',
      },
      {
        title: '"למה אף אחד לא מסיים לקנות?"',
        subtitle: 'הדף נטען 8 שניות',
        fix: 'קודם מודדים, אחר כך נוגעים. בדרך כלל זה תמונות כבדות או שאילתות איטיות. אני מתקן קודם את מה שהכי מעיק, ואז את הבא בתור. המטרה: פחות משנייה.',
      },
      {
        title: '"רגע, איזה אקסל הוא הנכון?"',
        subtitle: 'חמישה כלים, והכול בהעתק-הדבק',
        fix: 'אני מחבר את הכלים שאתם כבר משלמים עליהם, כך שה-CRM, האקסלים, החנות והחשבוניות מדברים אחד עם השני. חלאס להיות ההעתק-הדבק באמצע.',
      },
      {
        title: '"רק צריך שותף טכני."',
        subtitle: 'והפוסט עדיין על 0 תגובות',
        fix: 'אני נכנס כמהנדס שלכם. לפי פרויקט, תמורת אקוויטי, או שילוב שמרגיש הוגן לשנינו. אתם מביאים את הלקוחות, אני בונה משהו שמחזיק מעמד.',
      },
      {
        title: '"מישהו יכול כבר לעשות לזה אוטומציה?"',
        subtitle: 'הצוות מקליד הכול ידנית',
        fix: 'אני מוצא את מה שמישהו עושה כל יום באותה צורה ומעביר את זה לסקריפט. הצוות מקבל בחזרה את אחר הצהריים, ואת השפיות.',
      },
    ],
  },
};
