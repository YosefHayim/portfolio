import {
  fallbackGitHubStats,
  fallbackProjectPreviews,
  fetchGitHubProjectPreviews,
  fetchGitHubStats,
  isExcludedRepoName,
} from '@/data/githubPortfolio';
import { localDb } from '@/db/localDb';
import type { GitHubProjectPreview, GitHubStats } from '@/db/types';

export type GitHubSnapshotSource = 'cache' | 'live' | 'fallback';

export type GitHubSnapshotResult<T> = {
  value: T;
  source: GitHubSnapshotSource;
  error: string | null;
};

export type GitHubSnapshotStorage = {
  getProjects(): GitHubProjectPreview[] | null;
  setProjects(projects: GitHubProjectPreview[]): void;
  getStats(): GitHubStats | null;
  setStats(stats: GitHubStats): void;
};

export const localGitHubSnapshotStorage: GitHubSnapshotStorage = {
  getProjects: () => localDb.gitHubProjects.get(),
  setProjects: (projects) => localDb.gitHubProjects.set(projects),
  getStats: () => localDb.gitHubStats.get(),
  setStats: (stats) => localDb.gitHubStats.set(stats),
};

export async function loadGitHubProjectSnapshot({
  username,
  storage = localGitHubSnapshotStorage,
  fetchProjects = fetchGitHubProjectPreviews,
}: {
  username: string;
  storage?: GitHubSnapshotStorage;
  fetchProjects?: (username: string) => Promise<GitHubProjectPreview[]>;
}): Promise<GitHubSnapshotResult<GitHubProjectPreview[]>> {
  const normalizedUsername = username.trim();
  if (!normalizedUsername) {
    return { value: fallbackProjectPreviews, source: 'fallback', error: null };
  }

  const cachedProjects = storage.getProjects();
  if (cachedProjects && cachedProjects.length > 0) {
    return {
      value: filterPortfolioProjects(cachedProjects),
      source: 'cache',
      error: null,
    };
  }

  try {
    const freshProjects = await fetchProjects(normalizedUsername);
    if (freshProjects.length === 0) {
      return {
        value: fallbackProjectPreviews,
        source: 'fallback',
        error: null,
      };
    }

    storage.setProjects(freshProjects);
    return { value: freshProjects, source: 'live', error: null };
  } catch (error) {
    storage.setProjects(fallbackProjectPreviews);
    return {
      value: fallbackProjectPreviews,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Failed to fetch GitHub projects',
    };
  }
}

export async function loadGitHubStatsSnapshot({
  storage = localGitHubSnapshotStorage,
  fetchStats = fetchGitHubStats,
}: {
  storage?: GitHubSnapshotStorage;
  fetchStats?: () => Promise<GitHubStats>;
} = {}): Promise<GitHubSnapshotResult<GitHubStats>> {
  const cachedStats = storage.getStats();
  if (cachedStats) {
    return { value: cachedStats, source: 'cache', error: null };
  }

  try {
    const freshStats = await fetchStats();
    storage.setStats(freshStats);
    return { value: freshStats, source: 'live', error: null };
  } catch (error) {
    storage.setStats(fallbackGitHubStats);
    return {
      value: fallbackGitHubStats,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Failed to fetch stats',
    };
  }
}

function filterPortfolioProjects(
  projects: readonly GitHubProjectPreview[],
): GitHubProjectPreview[] {
  return projects.filter((project) => !isExcludedRepoName(project.name));
}
