import { useCallback, useEffect, useState } from 'react';
import {
  fallbackGitHubRepos,
  fallbackGitHubStats,
  loadGitHubSnapshot,
  type GitHubRepoPreview,
  type GitHubSnapshotSource,
  type GitHubStats,
} from '@/data/github';

type UseGitHubSnapshotResult = {
  stats: GitHubStats;
  repos: GitHubRepoPreview[];
  isLoading: boolean;
  source: GitHubSnapshotSource | 'idle';
  error: string | null;
  refetch: () => Promise<void>;
};

/**
 * Client hook for live GitHub stats + ranked public repos with README heroes.
 * Uses the versioned localStorage cache on first paint; `refetch` force-refreshes.
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
    const snapshot = await loadGitHubSnapshot({ force });
    setStats(snapshot.stats);
    setRepos(snapshot.repos);
    setSource(snapshot.source);
    setError(snapshot.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load(false);
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
