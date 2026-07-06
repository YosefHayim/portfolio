import { Effect } from 'effect';
import { fallbackProjectPreviews } from '@/data/githubPortfolio';
import { loadGitHubProjectSnapshot } from '@/data/githubPortfolioSnapshot';
import type { GitHubProjectPreview } from '@/db/types';
import { useEffectQuery } from './useEffectQuery.ts';

type UseGitHubProjectsResult = {
  projects: GitHubProjectPreview[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useGitHubProjects = (username: string): UseGitHubProjectsResult => {
  const normalizedUsername = username.trim();
  const query = useEffectQuery({
    queryKey: ['github-projects', normalizedUsername],
    program: Effect.promise(() =>
      loadGitHubProjectSnapshot({
        username: normalizedUsername,
      }),
    ),
  });

  const snapshot = query.data;
  const projects = snapshot ? snapshot.value : fallbackProjectPreviews;
  const error = snapshot ? snapshot.error : null;

  return {
    projects,
    isLoading: query.isLoading,
    error,
    refetch: async () => {
      await query.refetch();
    },
  };
};
