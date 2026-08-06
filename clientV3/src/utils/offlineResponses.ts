import { SAMPLE_RESPONSES } from '@/data/chatContext';
import { normalizeLanguage } from '@/i18n/localized';

const SAMPLE_RESPONSES_HE: Record<string, string> = {
  skills: `הכישורים הטכניים המרכזיים של יוסף כוללים:

**Backend**
- Node.js ו-Express עם TypeScript
- Python לאוטומציה וסקריפטים
- תכנון REST APIs ו-GraphQL
- תכנון בסיסי נתונים כמו MongoDB, PostgreSQL ו-Supabase

**Frontend**
- React ו-React Native
- Next.js לאפליקציות full-stack
- Tailwind CSS לעיצוב
- Framer Motion לאנימציות

**DevOps וכלים**
- פריסה ב-AWS
- GitHub Actions ל-CI/CD
- Docker
- OAuth 2.0/2.1

האזורים החזקים ביותר שלו הם ארכיטקטורת backend, אינטגרציות API ובניית כלי אוטומציה.`,

  projects: `הפרויקטים הבולטים של יוסף:

**1. SmallBites** (פורסם)
מוצר React Native/Expo להדרכת baby-led weaning עם מאגר 400+ מזונות ראשונים, תוכניות ארוחות, מעקב התקדמות ו-300+ מתכונים.

**2. WiseNoteTaker** (בבדיקה)
אפליקציית סיכום פגישות מבוססת AI שמקליטה, מתמללת ומסכמת שיחות לפתקים מובנים.

**3. eBay MCP API Server** (קוד פתוח)
שרת MCP פתוח ל-eBay Sell APIs עם כיסוי כלים רחב, בדיקות, OAuth והפצה דרך npm.

הפרויקטים האלה מראים יכולת לשלוח מובייל לפרודקשן, לבנות אוטומציות AI, ולעבוד עמוק ב-backend ו-APIs.`,

  experience: `**פרופיל נוכחי**
מהנדס תוכנה ב-Predicto AI (יולי 2025 - פרופיל נוכחי)
- פיצ׳רי React 18 בפרודקשן
- מיגרציה ללא אובדן נתונים של 10 שנות מידע ייצור ל-Cloudflare
- עבודת CMS, תבניות וכלים לשמירה על איכות הכנסות פרסום

**תפקידים קודמים**
- מתמחה בהנדסת תוכנה ב-Wotch Health (פברואר - אפריל 2025)
- מפתח אוטומציה (אוגוסט 2023 - ספטמבר 2024)

**השכלה**
- B.Sc במדעי המחשב באוניברסיטה הפתוחה
- Bootcamp Full Stack ב-IITC, תוכנית של 795 שעות, בהצטיינות`,

  hire: `**למה להעסיק את יוסף?**

1. **השפעה בפרודקשן**: ניסיון במערכות שמשרתות 83M+ בקשות ביום ועבודת מיגרציה ללא אובדן נתונים.

2. **טווח מוצרי AI**: בנה עוזרי AI, אפליקציות מובייל, תוספי דפדפן, כלי אוטומציה ומערכות MCP/API.

3. **בעלות full-stack**: יכול לעבוד על React, React Native, Node.js, APIs, דאטה, פריסה ובדיקות.

4. **משמעת משלוח**: רקע פיקודי בצבא יחד עם היסטוריה של שחרור מוצרים פרקטיים מהר.

5. **הוכחות שקל לבדוק**: GitHub ציבורי, אפליקציות בפרודקשן ומדדי השפעה קונקרטיים.`,
};

/**
 * Checks whether a lowercased message contains any keyword in the set.
 *
 * @param message - Lowercased user message.
 * @param needles - Keywords that route to the same reply.
 * @returns Whether one keyword was found.
 * @example
 * includesAny('tell me about projects', ['project'])
 */
const includesAny = (message: string, needles: readonly string[]): boolean =>
  needles.some((needle) => message.includes(needle));

/**
 * Selects the best Hebrew local fallback reply for a user message.
 *
 * @param lowerMessage - Lowercased user message.
 * @returns Hebrew offline assistant reply.
 * @example
 * getHebrewOfflineResponse('פרויקטים')
 */
const getHebrewOfflineResponse = (lowerMessage: string): string => {
  if (includesAny(lowerMessage, ['skill', 'tech', 'proficien', 'כישור', 'טכנולוג'])) {
    return SAMPLE_RESPONSES_HE.skills;
  }

  if (includesAny(lowerMessage, ['project', 'built', 'portfolio', 'פרויקט', 'בנית'])) {
    return SAMPLE_RESPONSES_HE.projects;
  }

  if (includesAny(lowerMessage, ['experience', 'work', 'job', 'career', 'ניסיון', 'עבודה'])) {
    return SAMPLE_RESPONSES_HE.experience;
  }

  if (includesAny(lowerMessage, ['hire', 'why', 'candidate', 'good fit', 'להעסיק', 'מועמד'])) {
    return SAMPLE_RESPONSES_HE.hire;
  }

  if (includesAny(lowerMessage, ['contact', 'reach', 'email', 'צור', 'אימייל', 'וואטסאפ'])) {
    return `אפשר ליצור קשר עם יוסף דרך:

- **GitHub**: github.com/YosefHayim
- **WhatsApp**: זמין באתר
- **LinkedIn**: הקישור זמין בסרגל הצד

אפשר גם להוריד את קורות החיים שלו לפרטים נוספים.`;
  }

  if (includesAny(lowerMessage, ['education', 'degree', 'bootcamp', 'השכלה', 'תואר', 'קורס'])) {
    return `**השכלה**

- **האוניברסיטה הפתוחה** - B.Sc במדעי המחשב (אוקטובר 2025 - היום)
- **IITC College** - פיתוח Full Stack (יולי 2024 - מרץ 2025)
 - תוכנית אינטנסיבית של 795 שעות
 - סיום בהצטיינות
 - JavaScript, React, Node.js, Python ועוד`;
  }

  if (includesAny(lowerMessage, ['military', 'idf', 'צבא', 'צה״ל', 'צה"ל'])) {
    return `**שירות צבאי**

יוסף שירת כמפקד חי״ר בצה״ל (נובמבר 2018 - יולי 2021):

- **יחידה**: גדוד 931
- **תפקיד**: מפקד חי״ר
- **הישגים**: 2 הצטיינויות

הניסיון הזה עיצב את המשמעת, המנהיגות והיכולת שלו לעבוד תחת לחץ - תכונות שהוא מביא גם לפיתוח תוכנה.`;
  }

  return `אני יכול לעזור לך ללמוד על יוסף. אפשר לשאול אותי על:

- **כישורים טכניים** והתמחויות
- **פרויקטים** שהוא בנה
- **ניסיון תעסוקתי** ומסלול הקריירה
- **השכלה** ותעודות
- **רקע צבאי**
- **למה הוא יכול להיות מועמד חזק**

מה תרצה לדעת?`;
};

/**
 * Selects the best English local fallback reply for a user message.
 *
 * @param lowerMessage - Lowercased user message.
 * @returns English offline assistant reply.
 * @example
 * getEnglishOfflineResponse('tell me about projects')
 */
const getEnglishOfflineResponse = (lowerMessage: string): string => {
  if (includesAny(lowerMessage, ['skill', 'tech', 'proficien'])) {
    return SAMPLE_RESPONSES.skills;
  }

  if (includesAny(lowerMessage, ['project', 'built', 'portfolio'])) {
    return SAMPLE_RESPONSES.projects;
  }

  if (includesAny(lowerMessage, ['experience', 'work', 'job', 'career'])) {
    return SAMPLE_RESPONSES.experience;
  }

  if (includesAny(lowerMessage, ['hire', 'why', 'candidate', 'good fit'])) {
    return SAMPLE_RESPONSES.hire;
  }

  if (includesAny(lowerMessage, ['contact', 'reach', 'email'])) {
    return `You can reach Joseph through:

- **GitHub**: github.com/YosefHayim
- **WhatsApp**: Available on the website
- **LinkedIn**: Link available in the sidebar

Feel free to download his resume for more details!`;
  }

  if (includesAny(lowerMessage, ['education', 'degree', 'bootcamp'])) {
    return `**Education**

- **Open University of Israel** - B.Sc Computer Science (Oct 2025 - Present)
- **IITC College** - Full Stack Development (Jul 2024 - Mar 2025)
 - 795-hour intensive program
 - Graduated with Excellence
 - Covered JavaScript, React, Node.js, Python, and more`;
  }

  if (includesAny(lowerMessage, ['military', 'idf'])) {
    return `**Military Service**

Joseph served as an Infantry Commander in the IDF (Nov 2018 - Jul 2021):

- **Unit**: Gdud 931
- **Role**: Infantry Commander
- **Achievements**: 2x Excellence Awards

This experience shaped his discipline, leadership skills, and ability to perform under pressure - qualities he brings to software development.`;
  }

  return `I can help you learn about Joseph! Here are some things I can tell you about:

- **Technical skills** and proficiencies
- **Projects** he's built
- **Work experience** and career journey
- **Education** and certifications
- **Military background**
- **Why he'd be a great hire**

What would you like to know?`;
};

/**
 * Selects the best local fallback reply for a user message.
 *
 * @param userMessage - User message text.
 * @param language - Active UI language.
 * @returns Offline assistant reply.
 * @example
 * getOfflineResponse('Tell me about projects', 'en')
 */
export const getOfflineResponse = (userMessage: string, language = 'en'): string => {
  const lowerMessage = userMessage.toLowerCase();

  if (normalizeLanguage(language) === 'he') {
    return getHebrewOfflineResponse(lowerMessage);
  }

  return getEnglishOfflineResponse(lowerMessage);
};
