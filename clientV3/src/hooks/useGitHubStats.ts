import { Effect } from 'effect';
import { loadGitHubStatsSnapshot } from '@/data/githubPortfolioSnapshot';
import type { GitHubStats } from '@/db/types';
import { useEffectQuery } from './useEffectQuery.ts';

type UseGitHubStatsResult = {
  stats: GitHubStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useGitHubStats = (): UseGitHubStatsResult => {
  const query = useEffectQuery({
    queryKey: ['github-stats'],
    program: Effect.promise(() => loadGitHubStatsSnapshot()),
  });

  const snapshot = query.data;
  const stats = snapshot ? snapshot.value : null;
  const error = snapshot ? snapshot.error : null;

  return {
    stats,
    isLoading: query.isLoading,
    error,
    refetch: async () => {
      await query.refetch();
    },
  };
};
