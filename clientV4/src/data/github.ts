import {
  cleanHeroImage,
  fetchReadmeHero,
  GITHUB_USERNAME,
} from '@/data/githubHero';

export type GitHubStats = {
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  lastUpdated: string;
};

export type GitHubRepoPreview = {
  id: string;
  name: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  repoUrl: string;
  homepage: string | null;
  updatedAt: string;
  /** First non-badge image from README (hero/cover), or null. */
  heroImage: string | null;
  defaultBranch: string;
};

export type GitHubSnapshotSource = 'cache' | 'live' | 'fallback';

export type GitHubSnapshot = {
  stats: GitHubStats;
  repos: GitHubRepoPreview[];
  source: GitHubSnapshotSource;
  error: string | null;
};

export { GITHUB_USERNAME };

const GITHUB_API = 'https://api.github.com';
/** Bump when snapshot shape changes so stale localStorage is ignored. */
const CACHE_KEY = 'v4_github_snapshot_v5';
const CACHE_TTL_MS = 1000 * 60 * 15;
const MAX_REPOS = 9;
const EXCLUDED = new Set(['yosefhayim', 'template', 'portfolio']);
// Raw row example: '<https://api.github.com/repos/x/y/commits?page=12>; rel="last"'
const LAST_PAGE_REGEX = /page=(\d+)>; rel="last"/;

const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
};

export const fallbackGitHubStats: GitHubStats = {
  totalCommits: 4800,
  totalRepos: 12,
  totalStars: 103,
  lastUpdated: new Date().toISOString(),
};

export const fallbackGitHubRepos: GitHubRepoPreview[] = [
  {
    id: 'fresh-squeezy',
    name: 'fresh-squeezy',
    description: 'CLI and TypeScript library for validating Lemon Squeezy webhooks and catalogs.',
    language: 'TypeScript',
    stars: 0,
    forks: 0,
    repoUrl: 'https://github.com/YosefHayim/fresh-squeezy',
    homepage: null,
    updatedAt: '2026-07-11T00:00:00.000Z',
    heroImage:
      'https://raw.githubusercontent.com/YosefHayim/fresh-squeezy/main/public/fresh-squeezy-hero.png',
    defaultBranch: 'main',
  },
  {
    id: 'launch-store',
    name: 'launch-store',
    description: 'Self-hosted CLI for building, signing, and shipping store-ready releases.',
    language: 'TypeScript',
    stars: 1,
    forks: 0,
    repoUrl: 'https://github.com/YosefHayim/launch-store',
    homepage: null,
    updatedAt: '2026-07-11T00:00:00.000Z',
    heroImage:
      'https://raw.githubusercontent.com/YosefHayim/launch-store/main/assets/launch-v4.png',
    defaultBranch: 'main',
  },
  {
    id: 'dufflebag',
    name: 'dufflebag',
    description: 'TypeScript CLI for installing agent skills, hooks, and personal bags.',
    language: 'TypeScript',
    stars: 2,
    forks: 0,
    repoUrl: 'https://github.com/YosefHayim/dufflebag',
    homepage: null,
    updatedAt: '2026-07-09T00:00:00.000Z',
    heroImage: 'https://raw.githubusercontent.com/YosefHayim/dufflebag/main/public/hero.png',
    defaultBranch: 'main',
  },
  {
    id: 'planpage',
    name: 'planpage',
    description: 'TypeScript CLI and Preact render kit for interactive HTML plan pages.',
    language: 'TypeScript',
    stars: 2,
    forks: 0,
    repoUrl: 'https://github.com/YosefHayim/planpage',
    homepage: null,
    updatedAt: '2026-07-07T00:00:00.000Z',
    heroImage: 'https://raw.githubusercontent.com/YosefHayim/planpage/main/public/hero.png',
    defaultBranch: 'main',
  },
  {
    id: 'ebay-mcp',
    name: 'ebay-mcp',
    description: 'Local MCP server that exposes eBay Sell APIs to AI assistants. 322 tools.',
    language: 'TypeScript',
    stars: 98,
    forks: 0,
    repoUrl: 'https://github.com/YosefHayim/ebay-mcp',
    homepage: 'https://www.npmjs.com/package/ebay-mcp',
    updatedAt: '2026-07-07T00:00:00.000Z',
    heroImage:
      'https://raw.githubusercontent.com/YosefHayim/ebay-mcp/main/public/ebay-mcp-hero.png',
    defaultBranch: 'main',
  },
  {
    id: 'ai-browser-bridge',
    name: 'ai-browser-bridge',
    description: 'Terminal bridge that drives browser AI chats and exposes sandboxed repo tools.',
    language: 'TypeScript',
    stars: 0,
    forks: 0,
    repoUrl: 'https://github.com/YosefHayim/ai-browser-bridge',
    homepage: null,
    updatedAt: '2026-07-07T00:00:00.000Z',
    heroImage:
      'https://raw.githubusercontent.com/YosefHayim/ai-browser-bridge/main/assets/hero.png',
    defaultBranch: 'main',
  },
];

type GitHubApiRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  default_branch?: string;
  topics?: string[];
};

type CachedSnapshot = {
  version: 5;
  stats: GitHubStats;
  repos: GitHubRepoPreview[];
  savedAt: number;
};

/**
 * Formats a pushed-at ISO string as a short month + year label.
 *
 * @param value - ISO date string from GitHub.
 * @returns Short locale label, or "Unknown".
 * @example
 * formatRepoUpdatedAt('2026-07-07T12:00:00Z') // "Jul 2026"
 */
export const formatRepoUpdatedAt = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
};

/**
 * Formats large counters for the 3D stat tiles.
 *
 * @param value - Raw integer.
 * @returns Compact display string (e.g. 4.8k).
 * @example
 * formatStatValue(4800) // "4.8k"
 */
export const formatStatValue = (value: number): string => {
  if (value >= 1000) {
    const rounded = Math.round((value / 1000) * 10) / 10;
    return `${rounded}k`;
  }
  return String(value);
};

/**
 * Drops versioned and legacy cache keys so stale repo lists cannot stick around.
 */
export const clearGitHubCache = (): void => {
  const staleKeys = [
    'v4_github_snapshot',
    'v4_github_snapshot_v2',
    'v4_github_snapshot_v3',
    'v4_github_snapshot_v4',
    CACHE_KEY,
  ];
  try {
    for (const key of staleKeys) {
      localStorage.removeItem(key);
    }
  } catch {
    // Private mode / quota — nothing to clear.
  }
};

const readCache = (): CachedSnapshot | null => {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) {
      return null;
    }

    const cached = JSON.parse(stored) as CachedSnapshot;
    if (cached.version !== 5) {
      return null;
    }
    if (!cached.savedAt || Date.now() - cached.savedAt > CACHE_TTL_MS) {
      return null;
    }
    if (!cached.stats || !Array.isArray(cached.repos) || cached.repos.length === 0) {
      return null;
    }

    // Reject caches that never stored heroes (broken older shapes).
    const hasAnyHero = cached.repos.some((repo) => Boolean(repo.heroImage));
    if (!hasAnyHero) {
      return null;
    }

    return cached;
  } catch {
    // Corrupt cache → treat as miss.
    return null;
  }
};

const writeCache = (stats: GitHubStats, repos: GitHubRepoPreview[]): void => {
  try {
    const cached: CachedSnapshot = {
      version: 5,
      stats,
      repos,
      savedAt: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // Private mode / quota — skip persistence.
  }
};

const isExcluded = (name: string): boolean => EXCLUDED.has(name.trim().toLowerCase());

const repoPreview = (repo: GitHubApiRepo, heroImage: string | null): GitHubRepoPreview => {
  const homepage =
    typeof repo.homepage === 'string' && repo.homepage.trim().length > 0
      ? repo.homepage.trim()
      : null;
  const defaultBranch = repo.default_branch?.trim() || 'main';

  return {
    id: repo.name.toLowerCase(),
    name: repo.name,
    description: repo.description?.trim() || 'No description provided.',
    language: repo.language,
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    repoUrl: repo.html_url,
    homepage,
    updatedAt: repo.pushed_at,
    heroImage: cleanHeroImage(heroImage),
    defaultBranch,
  };
};

/** Rank by recent push first so the grid stays up to date; stars break ties. */
const rankRepos = (repos: GitHubApiRepo[]): GitHubApiRepo[] =>
  repos
    .filter((repo) => !repo.fork && !repo.archived && !isExcluded(repo.name))
    .sort((a, b) => {
      const pushedDiff = Date.parse(b.pushed_at) - Date.parse(a.pushed_at);
      if (pushedDiff !== 0) {
        return pushedDiff;
      }
      return b.stargazers_count - a.stargazers_count;
    });

const fetchRepoCommitCount = async (repoName: string): Promise<number> => {
  const response = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/commits?per_page=1`,
    { method: 'HEAD', headers: GITHUB_HEADERS },
  );
  if (!response.ok) {
    return 0;
  }

  const link = response.headers.get('Link');
  if (!link) {
    return 1;
  }

  const match = link.match(LAST_PAGE_REGEX);
  const page = match?.at(1);
  return page ? Number.parseInt(page, 10) : 1;
};

/**
 * Loads live GitHub stats + ranked public repos with README heroes.
 * Cache key is versioned; stale shapes are discarded.
 *
 * @param options.force - Skip cache and refresh from the API.
 * @returns Stats, repo previews, and source metadata.
 * @example
 * const { stats, repos } = await loadGitHubSnapshot({ force: true })
 */
export const loadGitHubSnapshot = async (
  options: { force?: boolean } = {},
): Promise<GitHubSnapshot> => {
  if (options.force) {
    clearGitHubCache();
  } else {
    const cached = readCache();
    if (cached) {
      return {
        stats: cached.stats,
        repos: cached.repos,
        source: 'cache',
        error: null,
      };
    }
  }

  try {
    const response = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?type=owner&sort=pushed&per_page=100`,
      { headers: GITHUB_HEADERS },
    );
    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`);
    }

    const apiRepos = (await response.json()) as GitHubApiRepo[];
    const ranked = rankRepos(apiRepos);
    const top = ranked.slice(0, MAX_REPOS);

    const heroes = await Promise.all(
      top.map(async (repo) => {
        const branch = repo.default_branch?.trim() || 'main';
        return fetchReadmeHero(repo.name, branch);
      }),
    );

    const previews = top.map((repo, index) => repoPreview(repo, heroes[index] ?? null));

    // Commit HEAD only for a few recent repos to stay under unauth rate limits.
    const commitTargets = ranked.slice(0, 8);
    const commitCounts = await Promise.all(
      commitTargets.map(async (repo) => {
        try {
          return await fetchRepoCommitCount(repo.name);
        } catch {
          return 0;
        }
      }),
    );
    const liveCommits = commitCounts.reduce((sum, n) => sum + n, 0);

    const stats: GitHubStats = {
      totalCommits: liveCommits > 0 ? liveCommits : fallbackGitHubStats.totalCommits,
      totalRepos: apiRepos.length,
      totalStars: apiRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
      lastUpdated: new Date().toISOString(),
    };

    const repos = previews.length > 0 ? previews : fallbackGitHubRepos;
    writeCache(stats, repos);
    return { stats, repos, source: 'live', error: null };
  } catch (error) {
    return {
      stats: fallbackGitHubStats,
      repos: fallbackGitHubRepos,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Failed to load GitHub data',
    };
  }
};
