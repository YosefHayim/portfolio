import { useCallback, useEffect, useState } from 'react';
import {
  clearGitHubCache,
  fallbackGitHubRepos,
  fallbackGitHubStats,
  loadGitHubSnapshot,
  type GitHubRepoPreview,
  type GitHubStats,
} from '@/data/github';

type UseGitHubSnapshotResult = {
  stats: GitHubStats;
  repos: GitHubRepoPreview[];
  isLoading: boolean;
  source: 'cache' | 'live' | 'fallback' | 'idle';
  error: string | null;
  refetch: () => Promise<void>;
};

/**
 * Client hook for live GitHub stats + ranked public repos with README heroes.
 * Forces a one-time cache purge of legacy keys on mount.
 *
 * @returns Snapshot state with loading and refetch.
 * @example
 * const { stats, repos, isLoading } = useGitHubSnapshot()
 */
export const useGitHubSnapshot = (): UseGitHubSnapshotResult => {
  const [stats, setStats] = useState<GitHubStats>(fallbackGitHubStats);
  const [repos, setRepos] = useState<GitHubRepoPreview[]>(fallbackGitHubRepos);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<UseGitHubSnapshotResult['source']>('idle');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    setIsLoading(true);
    if (force) {
      clearGitHubCache();
    }
    const result = await loadGitHubSnapshot({ force });
    setStats(result.stats);
    setRepos(result.repos);
    setSource(result.source);
    setError(result.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Drop legacy cache keys once, then load (versioned key may still hit).
    clearGitHubCache();
    void load(true);
  }, [load]);

  return {
    stats,
    repos,
    isLoading,
    source,
    error,
    refetch: async () => {
      await load(true);
    },
  };
};
