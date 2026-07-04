import { portfolioKnowledge } from '../../../shared/portfolio/portfolioKnowledge.js';

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
  role: string;
  companyUrl?: string;
  logoUrl?: string;
  logoMonogram?: string;
  /** ISO month "YYYY-MM" used to derive months-on-the-job alongside `dateRange`. */
  startDate?: string;
  /** ISO month "YYYY-MM"; omit for ongoing roles. */
  endDate?: string;
  dateRange: string;
  bullets: string[];
};

export type FeaturedOffGitHubProject = {
  id: string;
  name: string;
  url?: string;
  logoUrl?: string;
  logoMonogram?: string;
  /** Chrome Web Store extension id; presence triggers a live user-count fetch. */
  chromeExtensionId?: string;
  description: string;
  status: string;
  dateRange: string;
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

export const recruiterProfile = {
  name: portfolioKnowledge.person.displayName,
  role: portfolioKnowledge.person.role,
  shortBio: portfolioKnowledge.person.shortBio,
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
  .map(({ promptDateRange: _promptDateRange, ...item }) => ({ ...item }));

export const featuredOffGitHubProjects: FeaturedOffGitHubProject[] =
  portfolioKnowledge.featuredProducts
    .filter((product) => PROFILE_FEATURED_PRODUCT_IDS.has(product.id))
    .map(({ promptSummary: _promptSummary, ...product }) => ({ ...product }));

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
