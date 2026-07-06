import {
  createPortfolioSystemPromptBase,
  portfolioOfflineResponses,
} from '@shared/portfolio/portfolioKnowledge.js';

export const JOSEPH_SYSTEM_PROMPT = createPortfolioSystemPromptBase();

export type QuickAction = {
  id: 'technicalSkills' | 'recentProjects' | 'workExperience' | 'whyHire' | 'viewResume';
  prompt: string;
  icon: 'skills' | 'projects' | 'experience' | 'contact' | 'resume';
};

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'technicalSkills',
    prompt: "What are Joseph's main technical skills and proficiencies?",
    icon: 'skills',
  },
  {
    id: 'recentProjects',
    prompt: "Tell me about Joseph's most impressive recent projects.",
    icon: 'projects',
  },
  {
    id: 'workExperience',
    prompt: "What is Joseph's professional work experience?",
    icon: 'experience',
  },
  {
    id: 'whyHire',
    prompt: 'What makes Joseph a good candidate for a software developer role?',
    icon: 'contact',
  },
  {
    id: 'viewResume',
    prompt: '__ACTION_DOWNLOAD_RESUME__',
    icon: 'resume',
  },
];

export const SAMPLE_RESPONSES: Record<string, string> = {
  ...portfolioOfflineResponses,
};
