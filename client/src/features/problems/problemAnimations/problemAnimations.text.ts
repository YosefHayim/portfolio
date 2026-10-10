import type { Language } from '../../language/savedLanguage';

type Notification = { title: string; detail: string };
type SentMessage = { text: string; day: string };
type CodeIssue = { problem: string; fix: string };

type ProblemAnimationsText = {
  stuckOnLocalhost: {
    problemBadge: string;
    fixBadge: string;
    proPlan: Notification;
    teamPlan: Notification;
    feedback: Notification;
  };
  developerGone: {
    problemAvatar: string;
    fixAvatar: string;
    developerName: string;
    lastSeen: string;
    josephName: string;
    online: string;
    sentMessages: SentMessage[];
    fixedReply: string;
    handoverReply: string;
  };
  untrustedAiCode: {
    exposedSecret: CodeIssue;
    missingAuth: CodeIssue;
    typeError: CodeIssue;
    problemStatus: string;
    fixStatus: string;
  };
  missedDeadline: {
    launchDate: string;
    slippingDates: string[];
    unknownDate: string;
    firstExcuse: string;
    secondExcuse: string;
    lockedDate: string;
    weeks: string[];
    demo: string;
    launch: string;
    launchDay: string;
    weeklyNote: string;
  };
  slowSite: {
    loadTime: string;
    visitorLeft: string;
    cartAbandoned: string;
    visitorsStay: string;
  };
  disconnectedTools: {
    hub: string;
    crm: string;
    sheets: string;
    email: string;
    shop: string;
    invoices: string;
    problemCaption: string;
    fixCaption: string;
  };
  noTechPartner: {
    idea: string;
    postTitle: string;
    postAge: string;
    replies: string;
    visitor: string;
    joseph: string;
    paidProject: string;
    equityPartner: string;
    creativeMix: string;
  };
  manualDataEntry: {
    columns: string[];
    problemTime: string;
    fixTime: string;
  };
};

export const problemAnimationsText: Record<Language, ProblemAnimationsText> = {
  en: {
    stuckOnLocalhost: {
      problemBadge: 'Only works on my machine',
      fixBadge: 'Live',
      proPlan: { title: 'New customer', detail: 'Pro plan · $29/mo' },
      teamPlan: { title: 'New customer', detail: 'Team plan · ₪149/mo' },
      feedback: { title: 'Feedback', detail: '“Exactly what we needed”' },
    },
    developerGone: {
      problemAvatar: '?',
      fixAvatar: 'J',
      developerName: 'Your developer',
      lastSeen: 'last seen 3 weeks ago',
      josephName: 'Joseph',
      online: 'online',
      sentMessages: [
        { text: 'Any update on the release?', day: 'Mon' },
        { text: 'Hello??', day: 'Wed' },
        { text: 'The site is down. Customers are emailing me.', day: 'Fri' },
      ],
      fixedReply: 'Found it. Fixed and deployed.',
      handoverReply: 'Handover doc for everything I touched is in your inbox.',
    },
    untrustedAiCode: {
      exposedSecret: { problem: 'Exposed secret', fix: 'Moved to env' },
      missingAuth: { problem: 'No auth', fix: 'Auth added' },
      typeError: { problem: 'TypeError', fix: 'Typed + tested' },
      problemStatus: '3 critical issues · 0 tests',
      fixStatus: '128 tests passing · 0 critical',
    },
    missedDeadline: {
      launchDate: 'Launch date',
      slippingDates: ['Mar 3', 'Mar 17', 'Apr 2'],
      unknownDate: '???',
      firstExcuse: "“It's 90% done”",
      secondExcuse: '“Just a few more days”',
      lockedDate: 'Apr 2, locked',
      weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      demo: 'Demo',
      launch: 'Launch',
      launchDay: 'Apr 2',
      weeklyNote: "Every Friday: what shipped, what's next, what's blocking.",
    },
    slowSite: {
      loadTime: 'Page load time',
      visitorLeft: 'visitor left',
      cartAbandoned: 'cart abandoned',
      visitorsStay: 'Visitors stay, sign up and buy',
    },
    disconnectedTools: {
      hub: 'Automated',
      crm: 'CRM',
      sheets: 'Sheets',
      email: 'Email',
      shop: 'Shop',
      invoices: 'Invoices',
      problemCaption: '5 tools · 0 connections · copy-paste',
      fixCaption: 'Everything syncs on its own',
    },
    noTechPartner: {
      idea: 'My idea, v0.1',
      postTitle: 'Looking for a technical co-founder',
      postAge: 'Posted 3 weeks ago',
      replies: '0 replies',
      visitor: 'You',
      joseph: 'J',
      paidProject: 'Paid project',
      equityPartner: 'Equity partner',
      creativeMix: 'Creative mix',
    },
    manualDataEntry: {
      columns: ['Order', 'Customer', 'Amount', 'Status'],
      problemTime: '3 hours a day, by hand',
      fixTime: '0 minutes · runs on its own',
    },
  },
  he: {
    stuckOnLocalhost: {
      problemBadge: 'עובד רק אצלי',
      fixBadge: 'באוויר',
      proPlan: { title: 'לקוח חדש', detail: 'מסלול Pro · $29 לחודש' },
      teamPlan: { title: 'לקוח חדש', detail: 'מסלול צוות · ₪149 לחודש' },
      feedback: { title: 'פידבק', detail: '"בדיוק מה שהיינו צריכים"' },
    },
    developerGone: {
      problemAvatar: '?',
      fixAvatar: 'י',
      developerName: 'המתכנת שלכם',
      lastSeen: 'נראה לאחרונה לפני 3 שבועות',
      josephName: 'יוסף',
      online: 'מחובר',
      sentMessages: [
        { text: 'יש עדכון על הגרסה?', day: 'יום ב׳' },
        { text: 'הלו??', day: 'יום ד׳' },
        { text: 'האתר נפל. לקוחות שולחים לי מיילים.', day: 'יום ו׳' },
      ],
      fixedReply: 'מצאתי. תיקנתי והעליתי.',
      handoverReply: 'מסמך חפיפה על כל מה שנגעתי בו מחכה לכם במייל.',
    },
    untrustedAiCode: {
      exposedSecret: { problem: 'מפתח חשוף', fix: 'הועבר ל-env' },
      missingAuth: { problem: 'אין אימות', fix: 'אימות נוסף' },
      typeError: { problem: 'TypeError', fix: 'טיפוסים + טסטים' },
      problemStatus: '3 בעיות קריטיות · 0 טסטים',
      fixStatus: '128 טסטים עוברים · 0 קריטיות',
    },
    missedDeadline: {
      launchDate: 'תאריך השקה',
      slippingDates: ['3 במרץ', '17 במרץ', '2 באפריל'],
      unknownDate: '???',
      firstExcuse: '"זה 90% מוכן"',
      secondExcuse: '"עוד כמה ימים וזהו"',
      lockedDate: '2 באפריל, סגור',
      weeks: ['שבוע 1', 'שבוע 2', 'שבוע 3', 'שבוע 4'],
      demo: 'דמו',
      launch: 'השקה',
      launchDay: '2 באפריל',
      weeklyNote: 'בכל יום שישי: מה עלה, מה הבא בתור ומה תקוע.',
    },
    slowSite: {
      loadTime: 'זמן טעינה',
      visitorLeft: 'גולש עזב',
      cartAbandoned: 'עגלה ננטשה',
      visitorsStay: 'גולשים נשארים, נרשמים וקונים',
    },
    disconnectedTools: {
      hub: 'אוטומטי',
      crm: 'CRM',
      sheets: 'אקסל',
      email: 'מייל',
      shop: 'חנות',
      invoices: 'חשבוניות',
      problemCaption: '5 כלים · 0 חיבורים · העתק-הדבק',
      fixCaption: 'הכול מסתנכרן לבד',
    },
    noTechPartner: {
      idea: 'הרעיון שלי, v0.1',
      postTitle: 'דרוש שותף טכני',
      postAge: 'פורסם לפני 3 שבועות',
      replies: '0 תגובות',
      visitor: 'אתם',
      joseph: 'י',
      paidProject: 'פרויקט בתשלום',
      equityPartner: 'שותף באקוויטי',
      creativeMix: 'שילוב יצירתי',
    },
    manualDataEntry: {
      columns: ['הזמנה', 'לקוח', 'סכום', 'סטטוס'],
      problemTime: '3 שעות ביום, ידנית',
      fixTime: '0 דקות · רץ לבד',
    },
  },
};
