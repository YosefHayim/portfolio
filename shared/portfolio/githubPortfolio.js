export const GITHUB_API_BASE = 'https://api.github.com';
export const GITHUB_USERNAME = 'YosefHayim';
export const MAX_PROJECT_PREVIEWS = 8;

const MAX_PROJECTS_IN_CONTEXT = 6;
const CACHE_TTL_MS = 1000 * 60 * 10;
const EXCLUDED_REPO_NAMES = new Set(['yosefhayim', 'template', 'portfolio']);
// Raw row example: "hello   world" becomes "hello world".
const WHITESPACE_PATTERN = /\s+/g;

let contextCache = null;

export const isExcludedRepoName = (repoName) =>
  EXCLUDED_REPO_NAMES.has(repoName.trim().toLowerCase());

export const formatUpdatedAt = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const sanitizeDescription = (description) => {
  if (!description) {
    return 'No description provided.';
  }

  const compact = description.replace(WHITESPACE_PATTERN, ' ').trim();
  return compact.length > 140 ? `${compact.slice(0, 137)}...` : compact;
};

export const fetchGitHubRepos = async (
  fetcher = fetch,
  username = GITHUB_USERNAME,
) => {
  const response = await fetcher(
    `${GITHUB_API_BASE}/users/${username}/repos?type=owner&sort=updated&per_page=100`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'portfolio',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }

  return response.json();
};

export const getRankedPortfolioRepos = (repos) =>
  repos
    .filter(
      (repo) => !repo.fork && !repo.archived && !isExcludedRepoName(repo.name),
    )
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return Date.parse(b.pushed_at) - Date.parse(a.pushed_at);
    });

export const createGitHubPortfolioSnapshot = (repos) =>
  getRankedPortfolioRepos(repos).map((repo) => ({
    name: repo.name,
    url: repo.html_url,
    description: sanitizeDescription(repo.description),
    stars: repo.stargazers_count,
    updatedAt: repo.pushed_at,
  }));

export const createGitHubProjectPreviews = (
  repos,
  maxProjects = MAX_PROJECT_PREVIEWS,
) =>
  getRankedPortfolioRepos(repos)
    .map((repo) => {
      const repoTopics = Array.isArray(repo.topics) ? repo.topics : [];
      const language = typeof repo.language === 'string' ? repo.language : null;
      const techStack = [language, ...repoTopics]
        .filter((value) => Boolean(value))
        .slice(0, 6);
      const homepage = typeof repo.homepage === 'string' ? repo.homepage.trim() : '';
      const hasHomepage = homepage.length > 0;
      const description =
        typeof repo.description === 'string'
          ? repo.description
          : 'No repository description provided.';

      return {
        id: repo.name.toLowerCase(),
        name: repo.name,
        description,
        techStack: techStack.length > 0 ? techStack : ['Software Engineering'],
        repoUrl: repo.html_url,
        deployedUrl: hasHomepage ? homepage : repo.html_url,
        status: hasHomepage ? 'live' : 'completed',
        stars: repo.stargazers_count,
        updatedAt: repo.pushed_at,
      };
    })
    .slice(0, maxProjects);

export const createGitHubStatsSnapshot = ({
  repos,
  totalCommits,
  now = new Date(),
}) => ({
    totalCommits,
    totalRepos: repos.length,
    totalStars: repos.reduce(
      (sum, repo) => sum + (repo.stargazers_count || 0),
      0,
    ),
    lastUpdated: now.toISOString(),
  });

export const formatGitHubProjectsContext = (projects) => {
  const topProjects = projects.slice(0, MAX_PROJECTS_IN_CONTEXT);
  const totalStars = projects.reduce((sum, repo) => sum + repo.stars, 0);
  const projectsList =
    topProjects.length > 0
      ? topProjects
          .map(
            (repo) =>
              `- ${repo.name} (${repo.stars} stars, updated ${formatUpdatedAt(repo.updatedAt)}): ${repo.description} (${repo.url})`,
          )
          .join('\n')
      : '- No repositories found.';

  return `## Live GitHub Projects Snapshot
Source: GitHub API for ${GITHUB_USERNAME}, auto-fetched by server.
Public repositories: ${projects.length}
Total stars: ${totalStars}

Top active projects:
${projectsList}

When users ask about recent repos/projects, prioritize this live snapshot over generic examples.`;
};

export const getDynamicGitHubProjectsContext = async () => {
  const now = Date.now();
  if (contextCache && contextCache.expiresAt > now) {
    return contextCache.value;
  }

  try {
    const repos = await fetchGitHubRepos();
    const context = formatGitHubProjectsContext(
      createGitHubPortfolioSnapshot(repos),
    );
    contextCache = { value: context, expiresAt: now + CACHE_TTL_MS };
    return context;
  } catch {
    const fallbackContext = `## Live GitHub Projects Snapshot
GitHub live snapshot is temporarily unavailable. If asked for recent repos/projects, direct the user to https://github.com/${GITHUB_USERNAME} and avoid inventing specifics.`;

    contextCache = { value: fallbackContext, expiresAt: now + CACHE_TTL_MS };
    return fallbackContext;
  }
};
