import { getDynamicGitHubProjectsContext } from '@shared/portfolio/githubPortfolio.js';
import { createPortfolioSystemPromptBase } from '@shared/portfolio/portfolioKnowledge.js';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const AI_CHAT_MODEL = 'gpt-4o-mini';
export const AI_CHAT_MAX_TOKENS = 400;
export const AI_CHAT_TEMPERATURE = 0.7;

const BASE_SYSTEM_PROMPT = createPortfolioSystemPromptBase();
// Raw row example: "latest github projects" should match the dynamic portfolio intent regex.
const DYNAMIC_PORTFOLIO_INTENT_PATTERN =
  /\b(github|repo|repos|project|projects|recent|latest|newest|updated)\b/i;

export const getSystemPrompt = async (): Promise<string> => {
  const githubContext = await getDynamicGitHubProjectsContext();
  return `${BASE_SYSTEM_PROMPT}\n\n${githubContext}`;
};

export const getLastUserMessage = (messages: readonly ChatMessage[]): string => {
  const lastMessage = messages.at(-1);

  if (lastMessage === undefined) {
    return '';
  }

  return lastMessage.content;
};

export const hasDynamicPortfolioIntent = (message: string): boolean =>
  DYNAMIC_PORTFOLIO_INTENT_PATTERN.test(message);

export const shouldBypassAssistantCache = (messages: readonly ChatMessage[]): boolean =>
  hasDynamicPortfolioIntent(getLastUserMessage(messages));

export const canUseAssistantResponseCache = (messages: readonly ChatMessage[]): boolean =>
  messages.length === 1 && !shouldBypassAssistantCache(messages);

export const createCachedResponseChunks = (response: string): string[] => {
  // Raw row example: "one two three four" splits into ["one", "two", "three", "four"].
  const words = response.split(' ');
  const chunks: string[] = [];

  for (let index = 0; index < words.length; index += 3) {
    chunks.push(words.slice(index, index + 3).join(' ') + (index + 3 < words.length ? ' ' : ''));
  }

  return chunks;
};
