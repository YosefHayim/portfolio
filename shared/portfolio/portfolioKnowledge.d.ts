export type PortfolioExperience = {
  id: string;
  company: string;
  role: string;
  companyUrl?: string;
  logoUrl?: string;
  logoMonogram?: string;
  /** ISO month "YYYY-MM" — used to derive months-on-the-job alongside `dateRange`. */
  startDate?: string;
  /** ISO month "YYYY-MM"; omit for ongoing roles. */
  endDate?: string;
  dateRange: string;
  promptDateRange: string;
  bullets: string[];
};

export type FeaturedPortfolioProduct = {
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
  promptSummary: string;
};

export declare const portfolioKnowledge: {
  person: {
    displayName: string;
    role: string;
    positioning: string;
    shortBio: string;
    currentProfileFocus: string;
  };
  links: {
    githubUsername: string;
    github: string;
    linkedin: string;
    whatsapp: string;
    resume: string;
    contactEmail: string;
  };
  proofPoints: string[];
  education: string[];
  military: string;
  coreTechStack: string[];
  skills: Record<string, string[]>;
  experience: PortfolioExperience[];
  featuredProducts: FeaturedPortfolioProduct[];
};
export declare function createPortfolioSystemPromptBase(): string;
export declare const portfolioOfflineResponses: Record<string, string>;
