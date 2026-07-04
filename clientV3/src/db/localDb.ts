import type { GitHubProjectPreview, GitHubStats, SiteConfig, VisitorStats } from './types.ts';

const STORAGE_KEYS = {
  GITHUB_STATS: 'portfolio_github_stats',
  GITHUB_PROJECTS: 'portfolio_github_projects',
  VISITOR_STATS: 'portfolio_visitor_stats',
  SITE_CONFIG: 'portfolio_site_config',
  CACHE_EXPIRY: 'portfolio_cache_expiry',
} as const;

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const ONE_DAY_MS = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND;
const CACHE_DURATION_MS = ONE_DAY_MS;

const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
    return null;
  } catch {
    return null;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore: cache write is best-effort (quota / disabled storage)
  }
};

const isCacheValid = (key: string): boolean => {
  const expiryKey = `${key}_expiry`;
  const expiry = localStorage.getItem(expiryKey);
  if (!expiry) {
    return false;
  }
  return Date.now() < Number.parseInt(expiry, 10);
};

const setCacheExpiry = (key: string): void => {
  const expiryKey = `${key}_expiry`;
  const expiry = Date.now() + CACHE_DURATION_MS;
  localStorage.setItem(expiryKey, expiry.toString());
};

export const localDb = {
  gitHubStats: {
    get: (): GitHubStats | null => {
      if (!isCacheValid(STORAGE_KEYS.GITHUB_STATS)) {
        return null;
      }
      return getItem<GitHubStats>(STORAGE_KEYS.GITHUB_STATS);
    },
    set: (stats: GitHubStats): void => {
      setItem(STORAGE_KEYS.GITHUB_STATS, stats);
      setCacheExpiry(STORAGE_KEYS.GITHUB_STATS);
    },
    clear: (): void => {
      localStorage.removeItem(STORAGE_KEYS.GITHUB_STATS);
      localStorage.removeItem(`${STORAGE_KEYS.GITHUB_STATS}_expiry`);
    },
  },

  gitHubProjects: {
    get: (): GitHubProjectPreview[] | null => {
      if (!isCacheValid(STORAGE_KEYS.GITHUB_PROJECTS)) {
        return null;
      }
      return getItem<GitHubProjectPreview[]>(STORAGE_KEYS.GITHUB_PROJECTS);
    },
    set: (projects: GitHubProjectPreview[]): void => {
      setItem(STORAGE_KEYS.GITHUB_PROJECTS, projects);
      setCacheExpiry(STORAGE_KEYS.GITHUB_PROJECTS);
    },
    clear: (): void => {
      localStorage.removeItem(STORAGE_KEYS.GITHUB_PROJECTS);
      localStorage.removeItem(`${STORAGE_KEYS.GITHUB_PROJECTS}_expiry`);
    },
  },

  visitorStats: {
    get: (): VisitorStats | null => getItem<VisitorStats>(STORAGE_KEYS.VISITOR_STATS),
    set: (stats: VisitorStats): void => {
      setItem(STORAGE_KEYS.VISITOR_STATS, stats);
    },
    incrementVisit: (): void => {
      const current = localDb.visitorStats.get() || {
        totalVisits: 0,
        uniqueVisitors: 0,
        returningVisitors: 0,
        lastUpdated: new Date().toISOString(),
      };
      current.totalVisits += 1;
      current.lastUpdated = new Date().toISOString();
      localDb.visitorStats.set(current);
    },
  },

  siteConfig: {
    get: (): SiteConfig | null => getItem<SiteConfig>(STORAGE_KEYS.SITE_CONFIG),
    set: (config: SiteConfig): void => {
      setItem(STORAGE_KEYS.SITE_CONFIG, config);
    },
    getDefault: (): SiteConfig => ({
      ownerName: 'Joseph Sabag',
      ownerTitle: 'Full-Stack Developer',
      ownerBio:
        'I turn complex problems into elegant solutions. From trading bots to AI-powered tools.',
      contactEmail: '',
      whatsappNumber: '546187549',
      githubUsername: 'YosefHayim',
      linkedinUrl: 'https://www.linkedin.com/in/yosef-hayim-sabag/',
      resumeUrl: '',
    }),
  },

  clearAll: (): void => {
    const keys = Object.values(STORAGE_KEYS);
    for (const key of keys) {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_expiry`);
    }
  },
};
