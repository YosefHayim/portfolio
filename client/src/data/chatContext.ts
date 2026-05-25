import {
  createPortfolioSystemPromptBase,
  portfolioOfflineResponses,
} from "../../../shared/portfolio/portfolioKnowledge.js";

export const JOSEPH_SYSTEM_PROMPT = createPortfolioSystemPromptBase();

export type QuickAction = {
  label: string;
  prompt: string;
  icon: "skills" | "projects" | "experience" | "contact" | "resume";
};

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Technical Skills",
    prompt: "What are Joseph's main technical skills and proficiencies?",
    icon: "skills",
  },
  {
    label: "Recent Projects",
    prompt: "Tell me about Joseph's most impressive recent projects.",
    icon: "projects",
  },
  {
    label: "Work Experience",
    prompt: "What is Joseph's professional work experience?",
    icon: "experience",
  },
  {
    label: "Why Hire Joseph?",
    prompt: "What makes Joseph a good candidate for a software developer role?",
    icon: "contact",
  },
  {
    label: "View Resume",
    prompt: "__ACTION_DOWNLOAD_RESUME__",
    icon: "resume",
  },
];

export const SAMPLE_RESPONSES: Record<string, string> = {
  ...portfolioOfflineResponses,
};
