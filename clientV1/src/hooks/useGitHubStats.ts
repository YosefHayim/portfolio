import { useCallback, useEffect, useState } from 'react';

import type { GitHubStats } from '@/db/types';
import { localDb } from '@/db/localDb';

const GITHUB_USERNAME = 'YosefHayim';
const GITHUB_API_BASE = 'https://api.github.com';
const LAST_PAGE_REGEX = /page=(\d+)>; rel="last"/;
const RATE_LIMIT_STATUS = 403;

type UseGitHubStatsResult = {
  stats: GitHubStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const FALLBACK_STATS: GitHubStats = {
  totalCommits: 4500,
  totalRepos: 10,
  totalStars: 8,
  lastUpdated: new Date().toISOString(),
};

const fetchGitHubStats = async (): Promise<GitHubStats> => {
  const reposResponse = await fetch(
    `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner`
  );

  if (!reposResponse.ok) {
    const errorData = await reposResponse.json().catch(() => ({}));
    if (errorData.message?.includes('rate limit')) {
      throw new Error('RATE_LIMITED');
    }
    throw new Error('Failed to fetch GitHub repositories');
  }

  const repos = await reposResponse.json();

  let totalCommits = 0;
  let totalStars = 0;

  for (const repo of repos) {
    totalStars += repo.stargazers_count || 0;

    try {
      const commitsResponse = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=1`,
        { method: 'HEAD' }
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
          `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=100`
        );
        if (commitsData.ok) {
          const commits = await commitsData.json();
          totalCommits += commits.length;
        }
      }
    } catch {
      break;
    }
  }

  return {
    totalCommits: totalCommits || FALLBACK_STATS.totalCommits,
    totalRepos: repos.length,
    totalStars,
    lastUpdated: new Date().toISOString(),
  };
};

export const useGitHubStats = (): UseGitHubStatsResult => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const cachedStats = localDb.gitHubStats.get();
    if (cachedStats) {
      setStats(cachedStats);
      setIsLoading(false);
      return;
    }

    try {
      const newStats = await fetchGitHubStats();
      localDb.gitHubStats.set(newStats);
      setStats(newStats);
    } catch (err) {
      setStats(FALLBACK_STATS);
      localDb.gitHubStats.set(FALLBACK_STATS);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};
