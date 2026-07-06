import { portfolioKnowledge } from '@shared/portfolio/portfolioKnowledge.js';
import type { Localized } from '@/i18n/localized';

export type RecruiterMetric = {
  label: string;
  value: string;
};

export type RecruiterCertification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  link: string;
};

export type ImpactHighlight = {
  id: string;
  label: string;
  value: string;
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: Localized<string>;
  companyUrl?: string;
  logoUrl?: string;
  logoMonogram?: string;
  /** ISO month "YYYY-MM" — used to derive months-on-the-job alongside `dateRange`. */
  startDate?: string;
  /** ISO month "YYYY-MM"; omit for ongoing roles. */
  endDate?: string;
  dateRange: Localized<string>;
  bullets: Localized<string[]>;
};

export type FeaturedOffGitHubProject = {
  id: string;
  name: string;
  url?: string;
  logoUrl?: string;
  logoMonogram?: string;
  /** Chrome Web Store extension id; presence triggers a live user-count fetch. */
  chromeExtensionId?: string;
  description: Localized<string>;
  status: Localized<string>;
  dateRange: Localized<string>;
  techStack: string[];
};

const PROFILE_EXPERIENCE_IDS = new Set(['predicto', 'wotch']);
const PROFILE_FEATURED_PRODUCT_IDS = new Set([
  'small-bites',
  'wise-note-taker',
  'omri-association',
  'sora-auto-queue-prompts',
  'batchbeam-bulk-prompt-queue',
]);

/** Hebrew overlay for the recruiter-facing bio, keyed to English from portfolioKnowledge. */
const PROFILE_HE = {
  role: 'מהנדס תוכנה AI',
  shortBio:
    'אני בונה מוצרי AI ו-full-stack פרקטיים שמאפשרים אוטומציה של תהליכי עבודה אמיתיים, מצמצמים עבודה ידנית ומגיעים לייצור במהירות ובאמינות — כולל שיפורים במערכות שמשרתות מעל 83 מיליון בקשות ביום, מיגרציה ללא אובדן נתונים של 10 שנות מידע, מוצרים שהגיעו ל-500+ משתמשים פעילים, ופיתוח אפליקציות iOS בייצור.',
};

/** Hebrew overlay for each experience item, keyed by portfolioKnowledge id. */
const EXPERIENCE_HE: Record<string, { role: string; dateRange: string; bullets: string[] }> = {
  predicto: {
    role: 'מהנדס תוכנה',
    dateRange: 'יולי 2025 - מאי 2026',
    bullets: [
      'תיקנתי באגים ושחררתי פיצ׳רים בייצור בפלטפורמת הרכישה עם React 18.',
      'ביצעתי מיגרציה ללא אובדן נתונים של 10 שנות מידע ייצור ל-Cloudflare.',
      'בניתי ערכת נושא ל-CMS ושיפרתי כלים כדי לסייע בשמירה על איכות הכנסות הפרסום.',
    ],
  },
  wotch: {
    role: 'מתמחה בהנדסת תוכנה',
    dateRange: 'פברואר 2025 - אפריל 2025',
    bullets: [
      'ייעלתי תהליכי CI/CD ובדיקות לאספקת שירותי בריאות בזמן אמת.',
      'בניתי כיסוי בדיקות ל-WebSocket עם Jest ו-Playwright.',
      'פיתחתי כלי דיבוג לייצור שמסתיר מידע רגיש של מטופלים.',
    ],
  },
};

/** Hebrew overlay for each off-GitHub product, keyed by portfolioKnowledge id. */
const PRODUCT_HE: Record<string, { description: string; status: string; dateRange: string }> = {
  'small-bites': {
    description:
      'לוותר על פאניקת המחית. SmallBites עוזרת להורים להתחיל מזון מוצק בביטחון דרך הדרכת BLW מבוססת מומחים, מאגר של 400+ מזונות ראשונים, תוכניות ארוחות מותאמות אישית, מעקב התקדמות ו-300+ מתכונים פרקטיים.',
    status: 'פורסם',
    dateRange: '2026',
  },
  'wise-note-taker': {
    description:
      'אפליקציית סיכום פגישות מבוססת AI שמקליטה, מתמללת ומסכמת שיחות בלחיצה אחת, והופכת הקלטות קוליות גולמיות לפתקים מדויקים, מובנים ומעשיים עבור צוותים, אנשי מקצוע וסטודנטים.',
    status: 'בבדיקה',
    dateRange: '2026',
  },
  'omri-association': {
    description:
      'פיתחתי ומתחזק פלטפורמה פיננסית לעמותת צדקה לניהול נהנים, תורמים, תרומות, הוצאות ודיווח חודשי.',
    status: 'באוויר',
    dateRange: '2026',
  },
  'sora-auto-queue-prompts': {
    description:
      'תוסף לכרום שמכניס פרומפטים לתור ב-Sora ומריץ אותם ברצף באופן אוטומטי — בלי לחיצות ידניות בין ההרצות.',
    status: 'חנות התוספים של כרום',
    dateRange: '2025',
  },
  'batchbeam-bulk-prompt-queue': {
    description:
      'מריץ פרומפטים בכמות עבור Gemini, AI Studio ו-ChatGPT — ייבוא CSV, ניסיונות חוזרים, הורדות אוטומטיות ועריכות המוניות בין ההרצות.',
    status: 'חנות התוספים של כרום',
    dateRange: '2025',
  },
};

/**
 * Looks up the required Hebrew experience overlay by source id.
 *
 * @param id - Experience id from shared portfolio knowledge.
 * @returns Hebrew role, date range, and bullets.
 * @example
 * requireExperienceHebrew('predicto')
 */
const requireExperienceHebrew = (
  id: string,
): { role: string; dateRange: string; bullets: string[] } => {
  const he = EXPERIENCE_HE[id];

  if (he === undefined) {
    throw new Error(`Missing Hebrew experience translation for ${id}`);
  }

  return he;
};

/**
 * Looks up the required Hebrew featured-product overlay by source id.
 *
 * @param id - Product id from shared portfolio knowledge.
 * @returns Hebrew product description, status, and date range.
 * @example
 * requireProductHebrew('small-bites')
 */
const requireProductHebrew = (
  id: string,
): { description: string; status: string; dateRange: string } => {
  const he = PRODUCT_HE[id];

  if (he === undefined) {
    throw new Error(`Missing Hebrew product translation for ${id}`);
  }

  return he;
};

export const recruiterProfile = {
  name: portfolioKnowledge.person.displayName,
  role: { en: portfolioKnowledge.person.role, he: PROFILE_HE.role } satisfies Localized<string>,
  shortBio: {
    en: portfolioKnowledge.person.shortBio,
    he: PROFILE_HE.shortBio,
  } satisfies Localized<string>,
  githubUsername: portfolioKnowledge.links.githubUsername,
  linkedinUrl: portfolioKnowledge.links.linkedin,
  whatsappUrl: portfolioKnowledge.links.whatsapp,
  contactEmail: portfolioKnowledge.links.contactEmail,
  resumeUrl: portfolioKnowledge.links.resume,
};

export const recruiterMetrics: RecruiterMetric[] = [
  { label: 'Public Repositories', value: 'Live from GitHub' },
  { label: 'Open-Source Focus', value: 'Shipping weekly' },
  { label: 'Core Stack', value: 'React + Node + TS + AI' },
];

export const coreTechStack: string[] = [...portfolioKnowledge.coreTechStack];

export const experienceItems: ExperienceItem[] = portfolioKnowledge.experience
  .filter((item) => PROFILE_EXPERIENCE_IDS.has(item.id))
  .map(({ promptDateRange: _promptDateRange, ...item }) => {
    const he = requireExperienceHebrew(item.id);
    return {
      ...item,
      role: { en: item.role, he: he.role },
      dateRange: { en: item.dateRange, he: he.dateRange },
      bullets: { en: item.bullets, he: he.bullets },
    };
  });

export const featuredOffGitHubProjects: FeaturedOffGitHubProject[] =
  portfolioKnowledge.featuredProducts
    .filter((product) => PROFILE_FEATURED_PRODUCT_IDS.has(product.id))
    .map(({ promptSummary: _promptSummary, ...product }) => {
      const he = requireProductHebrew(product.id);
      return {
        ...product,
        description: { en: product.description, he: he.description },
        status: { en: product.status, he: he.status },
        dateRange: { en: product.dateRange, he: he.dateRange },
      };
    });

export const recruiterCertifications: RecruiterCertification[] = [
  {
    id: 'github-actions',
    title: 'GitHub Actions - The Complete Guide',
    issuer: 'Udemy',
    date: 'Sep 2025',
    link: 'https://www.udemy.com/certificate/UC-6da4399d-15db-4b8c-84ec-3b56953a0766/',
  },
  {
    id: 'nextjs',
    title: 'Next.js App Router Fundamentals',
    issuer: 'Vercel',
    date: 'Sep 2025',
    link: 'https://www.linkedin.com/in/yosef-hayim-sabag/details/certifications/1758366776092/single-media-viewer/?profileId=ACoAADtj-18BDUMzABOGjZh335dfWV5OYcgy63g',
  },
  {
    id: 'react-native',
    title: 'React Native - The Practical Guide [2025]',
    issuer: 'Udemy',
    date: 'Jun 2025',
    link: 'https://www.udemy.com/certificate/UC-fb20f1dd-ba51-4300-b378-b46c170f30b8/',
  },
  {
    id: 'nodejs-bootcamp',
    title: 'Node.js, Express, MongoDB and More Bootcamp',
    issuer: 'Udemy',
    date: 'Feb 2025',
    link: 'https://www.udemy.com/certificate/UC-830343b5-2bb6-44ae-baf3-af70748ea84c/',
  },
  {
    id: 'python-bootcamp',
    title: '100 Days of Code: Complete Python Pro Bootcamp',
    issuer: 'Udemy',
    date: 'Oct 2024',
    link: 'https://www.udemy.com/certificate/UC-65f92c9d-6851-4700-9ced-8cfa8d192b41/',
  },
];
