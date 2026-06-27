import { projects as fallbackProjects } from '@/data/projects';
import type { GitHubProjectPreview, GitHubStats } from '@/db/types';
import {
  createGitHubProjectPreviews,
  createGitHubStatsSnapshot,
  fetchGitHubRepos,
  GITHUB_API_BASE,
  GITHUB_USERNAME,
  isExcludedRepoName,
} from '../../../shared/portfolio/githubPortfolio.js';

const MAX_PROJECTS = 8;
const LAST_PAGE_REGEX = /page=(\d+)>; rel="last"/;
const RATE_LIMIT_STATUS = 403;

export { GITHUB_USERNAME, isExcludedRepoName };

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
    status: project.status ?? 'completed',
    stars: 0,
    updatedAt: new Date().toISOString(),
  }));

export async function fetchGitHubProjectPreviews(
  username: string,
): Promise<GitHubProjectPreview[]> {
  const repos = await fetchGitHubRepos(fetch, username);
  return createGitHubProjectPreviews(repos, MAX_PROJECTS);
}

export async function fetchGitHubStats(): Promise<GitHubStats> {
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
          totalCommits += Number.parseInt(match[1], 10);
        }
      } else {
        const commitsData = await fetch(
          `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=100`,
        );
        if (commitsData.ok) {
          const commits = (await commitsData.json()) as unknown[];
          totalCommits += commits.length;
        }
      }
    } catch {
      break;
    }
  }

  return createGitHubStatsSnapshot({
    totalCommits: totalCommits || fallbackGitHubStats.totalCommits,
    repos,
  });
}
