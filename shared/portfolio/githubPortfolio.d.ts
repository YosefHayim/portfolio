export type GitHubRepo = {
  id?: number;
  name: string;
  full_name?: string;
  html_url: string;
  homepage?: string | null;
  description: string | null;
  language?: string | null;
  topics?: string[];
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

export type GitHubProjectSnapshot = {
  name: string;
  url: string;
  description: string;
  stars: number;
  updatedAt: string;
};

export type GitHubProjectPreview = {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  repoUrl: string;
  deployedUrl: string;
  status: "live" | "completed";
  stars: number;
  updatedAt: string;
  avatarUrl?: string;
};

export type GitHubStatsSnapshot = {
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  lastUpdated: string;
};

export declare const GITHUB_API_BASE = "https://api.github.com";
export declare const GITHUB_USERNAME = "YosefHayim";
export declare const MAX_PROJECT_PREVIEWS = 8;
export declare function isExcludedRepoName(repoName: string): boolean;
export declare function formatUpdatedAt(value: string): string;
export declare function sanitizeDescription(description: string | null): string;
export declare function fetchGitHubRepos(
  fetcher?: typeof fetch,
  username?: string,
): Promise<GitHubRepo[]>;
export declare function getRankedPortfolioRepos(
  repos: readonly GitHubRepo[],
): GitHubRepo[];
export declare function createGitHubPortfolioSnapshot(
  repos: readonly GitHubRepo[],
): GitHubProjectSnapshot[];
export declare function createGitHubProjectPreviews(
  repos: readonly GitHubRepo[],
  maxProjects?: number,
): GitHubProjectPreview[];
export declare function createGitHubStatsSnapshot(input: {
  repos: readonly GitHubRepo[];
  totalCommits: number;
  now?: Date;
}): GitHubStatsSnapshot;
export declare function formatGitHubProjectsContext(
  projects: readonly GitHubProjectSnapshot[],
): string;
export declare function getDynamicGitHubProjectsContext(): Promise<string>;
