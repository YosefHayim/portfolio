import { Schema } from 'effect';
import type {
  GitHubProjectPreview,
  GitHubStats,
  ProjectStatus,
  SiteConfig,
  VisitorStats,
} from './types.ts';

const STORAGE_KEYS = {
  GITHUB_STATS: 'portfolio_github_stats',
  GITHUB_PROJECTS: 'portfolio_github_projects',
  VISITOR_STATS: 'portfolio_visitor_stats',
  SITE_CONFIG: 'portfolio_site_config',
  CACHE_EXPIRY: 'portfolio_cache_expiry',
};

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const ONE_DAY_MS = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND;
const CACHE_DURATION_MS = ONE_DAY_MS;

const ProjectStatusSchema = Schema.Literal('live', 'development', 'completed');
const ProjectStatusValueSchema = Schema.Union(
  ProjectStatusSchema,
  Schema.Array(ProjectStatusSchema),
);

const GitHubStatsSchema: Schema.Schema<GitHubStats> = Schema.Struct({
  totalCommits: Schema.Number,
  totalRepos: Schema.Number,
  totalStars: Schema.Number,
  lastUpdated: Schema.String,
});

const GitHubProjectPreviewSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  description: Schema.String,
  techStack: Schema.Array(Schema.String),
  repoUrl: Schema.String,
  deployedUrl: Schema.String,
  status: ProjectStatusValueSchema,
  stars: Schema.Number,
  updatedAt: Schema.String,
});

const GitHubProjectPreviewsSchema = Schema.Array(GitHubProjectPreviewSchema);

type DecodedGitHubProjectPreview = {
  id: string;
  name: string;
  description: string;
  techStack: readonly string[];
  repoUrl: string;
  deployedUrl: string;
  status: ProjectStatus | readonly ProjectStatus[];
  stars: number;
  updatedAt: string;
};

const toProjectStatus = (
  status: ProjectStatus | readonly ProjectStatus[],
): ProjectStatus | ProjectStatus[] => {
  if (typeof status === 'string') {
    return status;
  }

  return [...status];
};

const toGitHubProjectPreview = (project: DecodedGitHubProjectPreview): GitHubProjectPreview => ({
  ...project,
  techStack: [...project.techStack],
  status: toProjectStatus(project.status),
});

const VisitorStatsSchema: Schema.Schema<VisitorStats> = Schema.Struct({
  totalVisits: Schema.Number,
  uniqueVisitors: Schema.Number,
  returningVisitors: Schema.Number,
  lastUpdated: Schema.String,
});

const SiteConfigSchema: Schema.Schema<SiteConfig> = Schema.Struct({
  ownerName: Schema.String,
  ownerTitle: Schema.String,
  ownerBio: Schema.String,
  contactEmail: Schema.String,
  whatsappNumber: Schema.String,
  githubUsername: Schema.String,
  linkedinUrl: Schema.String,
  resumeUrl: Schema.String,
});

const decodeLocalItem = <T, TEncoded>(
  key: string,
  schema: Schema.Schema<T, TEncoded, never>,
): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return Schema.decodeUnknownSync(schema)(JSON.parse(item));
    }
    return null;
  } catch (error) {
    console.warn('localDb.cacheReadFailed', { key, error });
    return null;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('localDb.cacheWriteFailed', { key, error });
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
      return decodeLocalItem(STORAGE_KEYS.GITHUB_STATS, GitHubStatsSchema);
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
      const projects = decodeLocalItem(STORAGE_KEYS.GITHUB_PROJECTS, GitHubProjectPreviewsSchema);
      return projects === null ? null : projects.map(toGitHubProjectPreview);
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
    get: (): VisitorStats | null => decodeLocalItem(STORAGE_KEYS.VISITOR_STATS, VisitorStatsSchema),
    set: (stats: VisitorStats): void => {
      setItem(STORAGE_KEYS.VISITOR_STATS, stats);
    },
    incrementVisit: (): void => {
      const current = localDb.visitorStats.get();
      const nextStats =
        current === null
          ? {
              totalVisits: 0,
              uniqueVisitors: 0,
              returningVisitors: 0,
              lastUpdated: new Date().toISOString(),
            }
          : current;
      nextStats.totalVisits += 1;
      nextStats.lastUpdated = new Date().toISOString();
      localDb.visitorStats.set(nextStats);
    },
  },

  siteConfig: {
    get: (): SiteConfig | null => decodeLocalItem(STORAGE_KEYS.SITE_CONFIG, SiteConfigSchema),
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
