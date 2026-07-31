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
  /** First non-badge image from README (hero/cover), or OG fallback. */
  heroImage: string | null;
  defaultBranch: string;
};

export const GITHUB_USERNAME = 'YosefHayim';
const GITHUB_API = 'https://api.github.com';
/** Bump when snapshot shape changes so stale localStorage is ignored. */
const CACHE_KEY = 'v4_github_snapshot_v5';
const CACHE_TTL_MS = 1000 * 60 * 15;
const MAX_REPOS = 9;
const EXCLUDED = new Set(['yosefhayim', 'template', 'portfolio']);
// Raw row example: '<https://api.github.com/repos/x/y/commits?page=12>; rel="last"'
const LAST_PAGE_REGEX = /page=(\d+)>; rel="last"/;
// Raw row example: '![alt](public/hero.png)' captures "public/hero.png".
const MD_IMAGE_REGEX = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
// Raw row example: '<img src="assets/cover.png">' captures "assets/cover.png".
const HTML_IMAGE_REGEX = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi;
const BADGE_HOST_HINTS = [
  'img.shields.io',
  'shields.io',
  'badge.',
  'badgen.net',
  'github.com/badges',
  'camo.githubusercontent.com',
];
const HERO_NAME_HINTS = ['hero', 'cover', 'banner', 'og', 'social', 'preview', 'logo'];

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
    heroImage: 'https://raw.githubusercontent.com/YosefHayim/fresh-squeezy/main/public/fresh-squeezy-hero.png',
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
    heroImage: 'https://raw.githubusercontent.com/YosefHayim/launch-store/main/assets/launch-v4.png',
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
    heroImage: 'https://raw.githubusercontent.com/YosefHayim/ebay-mcp/main/public/ebay-mcp-hero.png',
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
    heroImage: 'https://raw.githubusercontent.com/YosefHayim/ai-browser-bridge/main/assets/hero.png',
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

const headers = {
  Accept: 'application/vnd.github+json',
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
 * Drops legacy cache keys so old repo lists without heroes cannot stick around.
 */
export const clearGitHubCache = (): void => {
  try {
    const staleKeys = [
      'v4_github_snapshot',
      'v4_github_snapshot_v2',
      'v4_github_snapshot_v3',
      'v4_github_snapshot_v4',
      CACHE_KEY,
    ];
    for (const key of staleKeys) {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
};

const readCache = (): CachedSnapshot | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CachedSnapshot;
    if (parsed.version !== 5) {
      return null;
    }
    if (!parsed.savedAt || Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      return null;
    }
    if (!parsed.stats || !Array.isArray(parsed.repos) || parsed.repos.length === 0) {
      return null;
    }
    // Reject caches that never stored heroes (broken older v3 shapes).
    const hasAnyHero = parsed.repos.some((repo) => Boolean(repo.heroImage));
    if (!hasAnyHero) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const writeCache = (stats: GitHubStats, repos: GitHubRepoPreview[]): void => {
  try {
    const payload: CachedSnapshot = { version: 5, stats, repos, savedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // private mode / quota — ignore
  }
};

const isExcluded = (name: string): boolean => EXCLUDED.has(name.trim().toLowerCase());

const isBadgeUrl = (url: string): boolean => {
  const lower = url.toLowerCase();
  return BADGE_HOST_HINTS.some((hint) => lower.includes(hint));
};

const isImageUrl = (url: string): boolean => {
  const clean = url.split('?')[0]?.toLowerCase() ?? '';
  return (
    clean.endsWith('.png') ||
    clean.endsWith('.jpg') ||
    clean.endsWith('.jpeg') ||
    clean.endsWith('.webp') ||
    clean.endsWith('.gif') ||
    clean.endsWith('.svg') ||
    clean.includes('/raw/') ||
    clean.includes('raw.githubusercontent.com') ||
    clean.includes('user-images.githubusercontent.com') ||
    clean.includes('opengraph.githubassets.com')
  );
};

/**
 * Resolves a README-relative image path to a raw.githubusercontent.com URL.
 *
 * @param src - Image src from markdown/HTML.
 * @param repoName - Repository name.
 * @param branch - Default branch.
 * @returns Absolute image URL, or null if unusable.
 * @example
 * resolveReadmeImageSrc('public/hero.png', 'ebay-mcp', 'main')
 */
export const resolveReadmeImageSrc = (
  src: string,
  repoName: string,
  branch: string,
): string | null => {
  // Raw row example: "<public/hero.png>" becomes "public/hero.png".
  const trimmed = src.trim().replace(/^<|>$/g, '');
  if (!trimmed || trimmed.startsWith('data:')) {
    return null;
  }

  // Decode HTML entities that show up in GitHub README HTML fragments.
  // Raw row example: "&amp;" / "&quot;" / "&#39;" → & / " / '
  const decoded = trimmed
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
    if (isBadgeUrl(decoded)) {
      return null;
    }
    return decoded;
  }

  // Skip anchors / repo-relative non-image paths that aren't files.
  // Raw row example: "./docs/hero.png" or "/docs/hero.png" → "docs/hero.png".
  const path = decoded.replace(/^\.\//, '').replace(/^\/+/, '');
  if (!path || path.startsWith('#')) {
    return null;
  }

  const absolute = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${branch}/${path}`;
  if (isBadgeUrl(absolute)) {
    return null;
  }
  return absolute;
};

/**
 * Picks the best hero image URL from a README body.
 *
 * Prefers names containing hero/cover/banner, then first non-badge image.
 *
 * @param readme - Decoded README markdown.
 * @param repoName - Repository name.
 * @param branch - Default branch.
 * @returns Hero URL or null.
 * @example
 * pickReadmeHeroImage('<img src="public/hero.png">', 'planpage', 'main')
 */
export const pickReadmeHeroImage = (
  readme: string,
  repoName: string,
  branch: string,
): string | null => {
  const candidates: string[] = [];

  for (const match of readme.matchAll(HTML_IMAGE_REGEX)) {
    const src = match[1];
    if (src) {
      candidates.push(src);
    }
  }
  for (const match of readme.matchAll(MD_IMAGE_REGEX)) {
    const src = match[1];
    if (src) {
      candidates.push(src);
    }
  }

  const resolved = candidates
    .map((src) => resolveReadmeImageSrc(src, repoName, branch))
    .filter((url): url is string => url !== null && isImageUrl(url));

  if (resolved.length === 0) {
    return null;
  }

  const preferred = resolved.find((url) => {
    const lower = url.toLowerCase();
    return HERO_NAME_HINTS.some((hint) => lower.includes(hint));
  });

  return preferred ?? resolved[0] ?? null;
};

/**
 * Reject GitHub social-preview cards — they are not product/README heroes.
 *
 * @param url - Candidate image URL.
 * @returns Whether this is a usable README-style asset.
 */
const isOpenGraphCard = (url: string): boolean =>
  url.includes('opengraph.githubassets.com') || url.includes('repository-images.githubusercontent.com');

const toPreview = (repo: GitHubApiRepo, heroImage: string | null): GitHubRepoPreview => {
  const homepage =
    typeof repo.homepage === 'string' && repo.homepage.trim().length > 0
      ? repo.homepage.trim()
      : null;
  const defaultBranch = repo.default_branch?.trim() || 'main';
  const cleanHero =
    heroImage && !isOpenGraphCard(heroImage) ? heroImage : null;
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
    // Prefer real README art only — never the white GitHub social cards.
    heroImage: cleanHero,
    defaultBranch,
  };
};

/**
 * Rank by recent push first so the grid stays up to date; stars break ties.
 */
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
    { method: 'HEAD', headers },
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
 * Known README hero paths for first-paint reliability (raw CDN — no API quota).
 * Keys are lowercased repo names.
 */
const KNOWN_HERO_PATHS: Record<string, readonly string[]> = {
  'ebay-mcp': ['public/ebay-mcp-hero.png'],
  planpage: ['public/hero.png'],
  'fresh-squeezy': ['public/fresh-squeezy-hero.png'],
  'launch-store': ['assets/launch-v4.png', 'assets/launch-v3.png'],
  dufflebag: ['public/hero.png'],
  'ai-browser-bridge': ['assets/hero.png'],
  'agent-session-pack': ['assets/hero.png', 'public/hero.png'],
  'tim-trailers': ['public/hero.png', 'assets/hero.png'],
};

const COMMON_HERO_PATHS = [
  'public/hero.png',
  'public/cover.png',
  'public/banner.png',
  'assets/hero.png',
  'assets/cover.png',
  'docs/hero.png',
  'media/hero.png',
  'images/hero.png',
] as const;

/**
 * HEAD-probes a raw.githubusercontent URL. Returns the URL when the file exists.
 *
 * @param url - Absolute raw URL.
 * @returns Same URL if HTTP 200, otherwise null.
 */
const probeRawUrl = async (url: string): Promise<string | null> => {
  try {
    const head = await fetch(url, { method: 'HEAD' });
    if (head.ok) {
      return url;
    }
    // Some CDNs reject HEAD — fall back to a tiny ranged GET.
    const get = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
    });
    if (get.ok || get.status === 206) {
      return url;
    }
    return null;
  } catch {
    return null;
  }
};

// Raw row example: path "/docs/hero.png" → "docs/hero.png" in the raw.githubusercontent URL.
const rawFileUrl = (repoName: string, branch: string, path: string): string =>
  `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${branch}/${path.replace(/^\/+/, '')}`;

/**
 * Resolves a README hero without the GitHub REST API (avoids rate limits).
 * Order: known paths → raw README parse → common hero filenames.
 *
 * @param repoName - Repository name.
 * @param branch - Default branch.
 * @returns Absolute raw image URL, or null.
 */
const fetchReadmeHero = async (repoName: string, branch: string): Promise<string | null> => {
  const key = repoName.toLowerCase();
  const known = KNOWN_HERO_PATHS[key] ?? [];
  const guessed = [
    ...known,
    `public/${repoName}-hero.png`,
    `public/${key}-hero.png`,
    `assets/${repoName}-hero.png`,
    ...COMMON_HERO_PATHS,
  ];
  // Dedupe paths while preserving order.
  const uniquePaths = [...new Set(guessed)];

  // 1) Probe likely hero paths in parallel (raw CDN — no REST quota).
  const probes = await Promise.all(
    uniquePaths.map(async (path) => probeRawUrl(rawFileUrl(repoName, branch, path))),
  );
  const firstHit = probes.find((url): url is string => Boolean(url));
  if (firstHit) {
    return firstHit;
  }

  // 2) Parse raw README.md from the CDN and resolve first real image.
  try {
    const response = await fetch(rawFileUrl(repoName, branch, 'README.md'));
    if (response.ok) {
      const body = await response.text();
      const picked = pickReadmeHeroImage(body, repoName, branch);
      if (picked && !isOpenGraphCard(picked)) {
        if (picked.startsWith('https://raw.githubusercontent.com/')) {
          const exists = await probeRawUrl(picked);
          if (exists) {
            return exists;
          }
        } else if (picked.startsWith('http')) {
          return picked;
        }
      }
    }
  } catch {
    // fall through
  }

  return null;
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
): Promise<{
  stats: GitHubStats;
  repos: GitHubRepoPreview[];
  source: 'cache' | 'live' | 'fallback';
  error: string | null;
}> => {
  if (options.force) {
    clearGitHubCache();
  } else {
    const cached = readCache();
    if (cached) {
      return { stats: cached.stats, repos: cached.repos, source: 'cache', error: null };
    }
  }

  try {
    const response = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?type=owner&sort=pushed&per_page=100`,
      { headers },
    );
    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`);
    }

    const raw = (await response.json()) as GitHubApiRepo[];
    const ranked = rankRepos(raw);
    const top = ranked.slice(0, MAX_REPOS);

    const heroes = await Promise.all(
      top.map(async (repo) => {
        const branch = repo.default_branch?.trim() || 'main';
        const hero = await fetchReadmeHero(repo.name, branch);
        return hero;
      }),
    );

    const previews = top.map((repo, index) => toPreview(repo, heroes[index] ?? null));

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
      totalRepos: raw.length,
      totalStars: raw.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
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
