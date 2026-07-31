import {
  createGitHubProjectPreviews,
  createGitHubStatsSnapshot,
  enrichProjectsWithLogos,
  fetchGitHubRepos,
  GITHUB_API_BASE,
  GITHUB_USERNAME,
} from '@shared/portfolio/githubPortfolio.js';
import { projects as fallbackProjects } from '@/data/projects';
import type { GitHubProjectPreview, GitHubStats } from '@/db/types';

const MAX_PROJECTS = 8;
// Raw row example: '<https://api.github.com/repos/x/y/commits?page=12>; rel="last"'.
const LAST_PAGE_REGEX = /page=(\d+)>; rel="last"/;
const RATE_LIMIT_STATUS = 403;

export const fallbackGitHubStats: GitHubStats = {
  totalCommits: 4500,
  totalRepos: 10,
  totalStars: 8,
  lastUpdated: new Date().toISOString(),
};

export const fallbackProjectPreviews: GitHubProjectPreview[] = fallbackProjects
  .slice(0, MAX_PROJECTS)
  .map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    techStack: project.techStack.slice(0, 5),
    repoUrl: project.repoUrl,
    deployedUrl: project.deployedUrl,
    status: project.status === undefined ? 'completed' : project.status,
    stars: 0,
    updatedAt: new Date().toISOString(),
  }));

/**
 * Fetches public GitHub repositories and maps them to portfolio previews.
 *
 * @param username - GitHub username to load.
 * @returns Portfolio-ready GitHub project previews.
 * @example
 * await fetchGitHubProjectPreviews('YosefHayim')
 */
export const fetchGitHubProjectPreviews = async (
  username: string,
): Promise<GitHubProjectPreview[]> => {
  const repos = await fetchGitHubRepos(fetch, username);
<<<<<<< HEAD
  return createGitHubProjectPreviews(repos, MAX_PROJECTS);
};
=======
  const previews = createGitHubProjectPreviews(repos, MAX_PROJECTS);
  return enrichProjectsWithLogos(fetch, username, previews);
}
>>>>>>> refs/heads/mac-reset-backup/2026-07-30/stash/000-afbb755efb3e

/**
 * Fetches GitHub stats used by the portfolio hero.
 *
 * @returns Repository, star, and approximate commit totals.
 * @example
 * await fetchGitHubStats()
 */
export const fetchGitHubStats = async (): Promise<GitHubStats> => {
  const repos = await fetchGitHubRepos(fetch, GITHUB_USERNAME);
  let totalCommits = 0;

  for (const repo of repos) {
    try {
      const commitsResponse = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=1`,
        { method: 'HEAD' },
      );

      if (commitsResponse.status === RATE_LIMIT_STATUS) {
        break;
      }

      const linkHeader = commitsResponse.headers.get('Link');
      if (linkHeader) {
        const match = linkHeader.match(LAST_PAGE_REGEX);
        if (match) {
          // Raw row example: match[1] contains "12" from page=12.
          const pageCount = match.at(1);
          if (pageCount !== undefined) {
            totalCommits += Number.parseInt(pageCount, 10);
          }
        }
      } else {
        const commitsData = await fetch(
          `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=100`,
        );
        if (commitsData.ok) {
          const commits: unknown = await commitsData.json();
          if (Array.isArray(commits)) {
            totalCommits += commits.length;
          }
        }
      }
    } catch {
      break;
    }
  }

  return createGitHubStatsSnapshot({
    totalCommits: totalCommits > 0 ? totalCommits : fallbackGitHubStats.totalCommits,
    repos,
  });
};
