import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadGitHubProjectSnapshot } from '@/data/githubPortfolioSnapshot';
import type { GitHubProjectPreview } from '@/db/types';

type UseGitHubProjectsResult = {
  projects: GitHubProjectPreview[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useGitHubProjects = (username: string): UseGitHubProjectsResult => {
  const [projects, setProjects] = useState<GitHubProjectPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizedUsername = useMemo(() => username.trim(), [username]);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const snapshot = await loadGitHubProjectSnapshot({
      username: normalizedUsername,
    });
    setProjects(snapshot.value);
    setError(snapshot.error);
    setIsLoading(false);
  }, [normalizedUsername]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, normalizedUsername]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  };
};
