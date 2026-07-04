export const GITHUB_API_BASE = "https://api.github.com";
export const GITHUB_USERNAME = "YosefHayim";
export const MAX_PROJECT_PREVIEWS = 8;

const MAX_PROJECTS_IN_CONTEXT = 6;
const CACHE_TTL_MS = 1000 * 60 * 10;
const EXCLUDED_REPO_NAMES = new Set(["yosefhayim", "template", "portfolio"]);

/**
 * Regex to find the first image in a README markdown file.
 * Matches both `![alt](url)` and `<img src="url"` patterns.
 * Only accepts .png, .svg, .jpg, .jpeg, .gif, .webp extensions.
 */
const MD_IMAGE_REGEX =
  /!\[[^\]]*\]\(([^)]+\.(?:png|svg|jpg|jpeg|gif|webp)[^)]*)\)|<img[^>]+src=["']([^"']+\.(?:png|svg|jpg|jpeg|gif|webp)[^"']*)["']/i;

/**
 * Common logo file paths to check in the repo root when README has no image.
 */
const LOGO_FILE_CANDIDATES = [
  "logo.png",
  "logo.svg",
  "icon.png",
  "icon.svg",
  "assets/logo.png",
  "assets/logo.svg",
  "assets/icon.png",
  "assets/icon.svg",
  "public/logo.png",
  "public/logo.svg",
  "public/icon.png",
  "public/icon.svg",
  ".github/logo.png",
  ".github/logo.svg",
];

/**
 * Fetches a repo's README, extracts the first image URL (PNG/SVG/JPG/GIF/WebP).
 * Falls back to probing common logo file paths in the repo.
 * Returns null if no logo is found.
 */
export async function fetchRepoLogoUrl(fetcher, owner, repoName) {
  try {
    // Step 1: Try README
    const readmeUrl = `${GITHUB_API_BASE}/repos/${owner}/${repoName}/readme`;
    const readmeResponse = await fetcher(readmeUrl, {
      headers: {
        Accept: "application/vnd.github.raw+json",
        "User-Agent": "portfolio",
      },
    });

    if (readmeResponse.ok) {
      const readmeContent = await readmeResponse.text();
      const match = readmeContent.match(MD_IMAGE_REGEX);
      if (match) {
        const rawUrl = match[1] || match[2];
        return resolveGitHubImageUrl(rawUrl, owner, repoName);
      }
    }

    // Step 2: Probe common logo file paths
    for (const candidate of LOGO_FILE_CANDIDATES) {
      const fileUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/main/${candidate}`;
      const probeResponse = await fetcher(fileUrl, {
        method: "HEAD",
        headers: { "User-Agent": "portfolio" },
      });
      if (probeResponse.ok) {
        return fileUrl;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Resolves a potentially relative image URL from a README into an absolute URL.
 */
function resolveGitHubImageUrl(url, owner, repoName) {
  if (!url) return null;

  // Already absolute
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Relative path — resolve to raw.githubusercontent.com
  const cleanPath = url.replace(/^\.?\//, "");
  return `https://raw.githubusercontent.com/${owner}/${repoName}/main/${cleanPath}`;
}

let contextCache = null;

export function isExcludedRepoName(repoName) {
  return EXCLUDED_REPO_NAMES.has(repoName.trim().toLowerCase());
}

export function formatUpdatedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function sanitizeDescription(description) {
  if (!description) {
    return "No description provided.";
  }

  const compact = description.replace(/\s+/g, " ").trim();
  return compact.length > 140 ? `${compact.slice(0, 137)}...` : compact;
}

export async function fetchGitHubRepos(
  fetcher = fetch,
  username = GITHUB_USERNAME,
) {
  const response = await fetcher(
    `${GITHUB_API_BASE}/users/${username}/repos?type=owner&sort=updated&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }

  return response.json();
}

export function getRankedPortfolioRepos(repos) {
  return repos
    .filter(
      (repo) => !repo.fork && !repo.archived && !isExcludedRepoName(repo.name),
    )
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return Date.parse(b.pushed_at) - Date.parse(a.pushed_at);
    });
}

export function createGitHubPortfolioSnapshot(repos) {
  return getRankedPortfolioRepos(repos).map((repo) => ({
    name: repo.name,
    url: repo.html_url,
    description: sanitizeDescription(repo.description),
    stars: repo.stargazers_count,
    updatedAt: repo.pushed_at,
  }));
}

export function createGitHubProjectPreviews(
  repos,
  maxProjects = MAX_PROJECT_PREVIEWS,
) {
  return getRankedPortfolioRepos(repos)
    .map((repo) => {
      const techStack = [repo.language, ...(repo.topics ?? [])]
        .filter((value) => Boolean(value))
        .slice(0, 6);
      const homepage = repo.homepage?.trim();

      return {
        id: repo.name.toLowerCase(),
        name: repo.name,
        description: repo.description ?? "No repository description provided.",
        techStack: techStack.length > 0 ? techStack : ["Software Engineering"],
        repoUrl: repo.html_url,
        deployedUrl: homepage || repo.html_url,
        status: homepage ? "live" : "completed",
        stars: repo.stargazers_count,
        updatedAt: repo.pushed_at,
      };
    })
    .slice(0, maxProjects);
}

/**
 * Enriches project previews with auto-detected avatar URLs by fetching each
 * repo's README for its first image. Runs all fetches in parallel.
 * Non-destructive: projects that fail detection keep avatarUrl undefined.
 */
export async function enrichProjectsWithLogos(
  fetcher,
  owner,
  projects,
) {
  const results = await Promise.allSettled(
    projects.map(async (project) => {
      const repoName = project.name;
      const logoUrl = await fetchRepoLogoUrl(fetcher, owner, repoName);
      return { ...project, avatarUrl: logoUrl ?? undefined };
    }),
  );

  return results.map((result, index) =>
    result.status === "fulfilled" ? result.value : projects[index],
  );
}

export function createGitHubStatsSnapshot({
  repos,
  totalCommits,
  now = new Date(),
}) {
  return {
    totalCommits,
    totalRepos: repos.length,
    totalStars: repos.reduce(
      (sum, repo) => sum + (repo.stargazers_count || 0),
      0,
    ),
    lastUpdated: now.toISOString(),
  };
}

export function formatGitHubProjectsContext(projects) {
  const topProjects = projects.slice(0, MAX_PROJECTS_IN_CONTEXT);
  const totalStars = projects.reduce((sum, repo) => sum + repo.stars, 0);
  const projectsList =
    topProjects.length > 0
      ? topProjects
          .map(
            (repo) =>
              `- ${repo.name} (${repo.stars} stars, updated ${formatUpdatedAt(repo.updatedAt)}): ${repo.description} (${repo.url})`,
          )
          .join("\n")
      : "- No repositories found.";

  return `## Live GitHub Projects Snapshot
Source: GitHub API for ${GITHUB_USERNAME}, auto-fetched by server.
Public repositories: ${projects.length}
Total stars: ${totalStars}

Top active projects:
${projectsList}

When users ask about recent repos/projects, prioritize this live snapshot over generic examples.`;
}

export async function getDynamicGitHubProjectsContext() {
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
}
