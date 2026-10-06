import type { Language } from './copy';

export type Scenario = {
  id: string;
  title: string;
  detail: string;
  solution: string;
  before: string[];
  after: string[];
};

export const scenarios: Record<Language, Scenario[]> = {
  en: [
    {
      id: 'launch',
      title: 'It works on your laptop. Now what?',
      detail: 'Your customers still can’t use it.',
      solution:
        'I help bring your first version online, with an address, sign-in, and payments where needed. We check the full customer journey before opening the doors.',
      before: ['Your laptop', 'A working demo', 'No way to share it'],
      after: ['Your website', 'Easy to sign up', 'Ready for first users'],
    },
    {
      id: 'communication',
      title: 'Your developer went quiet.',
      detail: 'Half a product. No clear answers.',
      solution:
        'I review what you have, address the urgent problems, and make a practical recovery plan. You get clear updates and a documented handover.',
      before: ['Any news on the project?', 'Is anyone there?', 'No reply'],
      after: [
        'Here’s this week’s progress.',
        'Let’s review the next step.',
        'Everything is documented.',
      ],
    },
    {
      id: 'quality',
      title: 'AI built it. Can you trust it?',
      detail: 'A convincing demo can hide real problems.',
      solution:
        'I review the important parts, check who can access what, and test the paths your customers rely on. We keep what works and fix what doesn’t.',
      before: [
        'Who can see customer details?',
        'Will checkout work?',
        'What happens when it fails?',
      ],
      after: ['Access checked', 'Checkout tested', 'Recovery planned'],
    },
    {
      id: 'timeline',
      title: '“Almost done.” For months.',
      detail: 'The finish line keeps moving.',
      solution:
        'We agree on a manageable first version, visible milestones, and regular demos. Risks and changes are discussed before they become surprises.',
      before: ['Maybe next week', 'Just one more feature', 'Still waiting'],
      after: ['Agree on the essentials', 'Review a working version', 'Prepare the launch'],
    },
    {
      id: 'speed',
      title: 'Your website makes people wait.',
      detail: 'Even a simple task feels slow.',
      solution:
        'I measure where people get stuck and fix the biggest delays, from oversized images to slow requests. Then we check the difference on real devices.',
      before: ['Loading the page', 'Waiting for images', 'Trying again'],
      after: ['Lighter pages', 'Quicker responses', 'Checked on mobile'],
    },
    {
      id: 'tools',
      title: 'Five tools. None connected.',
      detail: 'The same details, copied everywhere.',
      solution:
        'I connect the tools your business already uses, with clear rules for which information goes where. We add checks so missing updates don’t go unnoticed.',
      before: ['Customer list', 'Email and shop', 'Spreadsheets and invoices'],
      after: ['One connected flow', 'Updates in the right place', 'Exceptions flagged'],
    },
    {
      id: 'partner',
      title: 'A great idea. No technical partner.',
      detail: 'You need someone to build it with you.',
      solution:
        'You bring your understanding of the business; I bring the technical work. We can discuss a project contract, a selective equity partnership, or a flexible arrangement.',
      before: ['Your idea', 'An unanswered question', 'Where do I start?'],
      after: ['You + Joseph', 'A shared plan', 'A first version to test'],
    },
    {
      id: 'manual',
      title: 'Your team does it all by hand.',
      detail: 'Repeat tasks eat up the day.',
      solution:
        'I automate routine imports, reports, reminders, and updates. Your team stays in control of the decisions that need a person.',
      before: ['Copy an order', 'Update the spreadsheet', 'Send the same reminder'],
      after: ['Orders brought in', 'Information kept in sync', 'Reminders prepared'],
    },
  ],
  he: [
    {
      id: 'launch',
      title: 'זה עובד במחשב שלך. ומה עכשיו?',
      detail: 'הלקוחות עדיין לא יכולים להשתמש בזה.',
      solution:
        'אעזור להעלות גרסה ראשונה לאוויר, עם כתובת, הרשמה ותשלומים לפי הצורך. לפני שפותחים ללקוחות, נבדוק את כל הדרך שהם עוברים.',
      before: ['המחשב שלך', 'גרסת הדגמה עובדת', 'אין דרך לשתף'],
      after: ['האתר שלך', 'הרשמה פשוטה', 'מוכנים למשתמשים הראשונים'],
    },
    {
      id: 'communication',
      title: 'המפתח הפסיק לענות.',
      detail: 'חצי מוצר. בלי תשובות ברורות.',
      solution:
        'אבדוק מה כבר קיים, אטפל בבעיות הדחופות ואבנה תוכנית להמשך. לאורך הדרך תקבלו עדכונים ברורים ותיעוד שאפשר להבין.',
      before: ['יש חדש עם הפרויקט?', 'יש מישהו בצד השני?', 'אין תשובה'],
      after: ['הנה ההתקדמות השבוע.', 'נעבור יחד על הצעד הבא.', 'הכול מתועד.'],
    },
    {
      id: 'quality',
      title: 'נבנה עם AI. אפשר לסמוך על זה?',
      detail: 'הדגמה מרשימה יכולה להסתיר בעיות.',
      solution:
        'אעבור על החלקים החשובים, אבדוק למי יש גישה למידע ואבחן את הפעולות שהלקוחות צריכים. נשמור את מה שעובד ונתקן את מה שלא.',
      before: ['מי רואה את פרטי הלקוחות?', 'התשלום יעבור?', 'מה קורה כשיש תקלה?'],
      after: ['ההרשאות נבדקו', 'התשלום נבדק', 'יש תוכנית לטיפול בתקלות'],
    },
    {
      id: 'timeline',
      title: '״כמעט סיימנו״. כבר חודשים.',
      detail: 'תאריך הסיום כל הזמן זז.',
      solution:
        'נסכם על גרסה ראשונה בהיקף מציאותי, אבני דרך והדגמות קבועות. נדבר על סיכונים ושינויים בזמן, לפני שיהפכו להפתעות.',
      before: ['אולי בשבוע הבא', 'רק עוד תוספת אחת', 'עדיין מחכים'],
      after: ['מסכמים מה הכרחי', 'בודקים גרסה עובדת', 'מתכוננים להשקה'],
    },
    {
      id: 'speed',
      title: 'האתר גורם לאנשים לחכות.',
      detail: 'גם פעולה פשוטה מרגישה איטית.',
      solution:
        'אמדוד איפה אנשים נתקעים ואטפל בעיכובים המשמעותיים, מתמונות כבדות ועד בקשות איטיות. אחר כך נבדוק את השיפור במכשירים אמיתיים.',
      before: ['העמוד נטען', 'מחכים לתמונות', 'מנסים שוב'],
      after: ['עמודים קלים יותר', 'תגובה מהירה יותר', 'נבדק גם בנייד'],
    },
    {
      id: 'tools',
      title: 'חמישה כלים. אף אחד לא מחובר.',
      detail: 'אותם פרטים מועתקים שוב ושוב.',
      solution:
        'אחבר בין הכלים שכבר משמשים את העסק, עם כללים ברורים להעברת המידע ובדיקות שיעזרו לזהות עדכונים שלא הגיעו ליעד.',
      before: ['רשימת לקוחות', 'דוא״ל וחנות', 'גיליונות וחשבוניות'],
      after: ['תהליך אחד מחובר', 'עדכונים במקום הנכון', 'חריגות מסומנות לבדיקה'],
    },
    {
      id: 'partner',
      title: 'רעיון טוב. בלי שותף טכנולוגי.',
      detail: 'צריך מישהו שיבנה את זה איתך.',
      solution:
        'ההיכרות עם העסק מגיעה ממך, והעבודה הטכנולוגית ממני. אפשר לדבר על חוזה לפרויקט, שותפות תמורת אחוזים במקרים מתאימים או הסדר גמיש.',
      before: ['הרעיון שלך', 'שאלה פתוחה', 'מאיפה מתחילים?'],
      after: ['אתם + יוסף', 'תוכנית משותפת', 'גרסה ראשונה לבדיקה'],
    },
    {
      id: 'manual',
      title: 'הצוות עושה הכול ידנית.',
      detail: 'משימות חוזרות ממלאות את היום.',
      solution:
        'אהפוך ייבוא מידע, דוחות, תזכורות ועדכונים לאוטומטיים. ההחלטות שדורשות שיקול דעת יישארו בידי הצוות.',
      before: ['מעתיקים הזמנה', 'מעדכנים גיליון', 'שולחים שוב אותה תזכורת'],
      after: ['ההזמנות נקלטות', 'המידע מתעדכן', 'התזכורות מוכנות'],
    },
  ],
};

export const nextScenario = (remaining: string[], current: string, random: number) => {
  const available = remaining.filter((id) => id !== current);
  const pool = available.length > 0 ? available : scenarios.en.map((scenario) => scenario.id);
  const candidates = pool.filter((id) => id !== current);
  const position = Math.floor(random * candidates.length);
  const selected = candidates[position];
  return { selected, remaining: pool.filter((id) => id !== selected) };
};
