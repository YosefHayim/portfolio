export type Collaborator = {
  name: string;
  githubProfileLink: string;
};

export type ProjectStatus = "live" | "development" | "completed";

export type Project = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  deployedUrl: string;
  repoUrl: string;
  image: string;
  collaborators?: Collaborator[];
  status?: ProjectStatus | ProjectStatus[];
  highlights?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  link: string;
  iconType: string;
  createdAt?: string;
};

export type GitHubStats = {
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  lastUpdated: string;
};

export type VisitorStats = {
  totalVisits: number;
  uniqueVisitors: number;
  returningVisitors: number;
  lastUpdated: string;
};

export type SiteConfig = {
  ownerName: string;
  ownerTitle: string;
  ownerBio: string;
  contactEmail: string;
  whatsappNumber: string;
  githubUsername: string;
  linkedinUrl: string;
  resumeUrl: string;
};
