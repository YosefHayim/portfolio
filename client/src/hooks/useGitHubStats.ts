import { useCallback, useEffect, useState } from 'react';
import { loadGitHubStatsSnapshot } from '@/data/githubPortfolioSnapshot';
import type { GitHubStats } from '@/db/types';

type UseGitHubStatsResult = {
  stats: GitHubStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useGitHubStats = (): UseGitHubStatsResult => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const snapshot = await loadGitHubStatsSnapshot();
    setStats(snapshot.value);
    setError(snapshot.error);
    setIsLoading(false);
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
