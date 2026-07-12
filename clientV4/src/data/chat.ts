import {
  portfolioKnowledge,
  portfolioOfflineResponses,
} from '@shared/portfolio/portfolioKnowledge.js';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type QuickAction = {
  id: string;
  label: string;
  prompt: string;
};

export const DOWNLOAD_RESUME_ACTION = '__ACTION_DOWNLOAD_RESUME__';
export const RESUME_URL = portfolioKnowledge.links.resume;

export const CHAT_WELCOME =
  "Ask me about Joseph's stack, shipped projects, work experience, or why he is a strong hire. I can also open his resume.";

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'skills',
    label: 'Skills',
    prompt: "What are Joseph's main technical skills and proficiencies?",
  },
  {
    id: 'projects',
    label: 'Projects',
    prompt: "Tell me about Joseph's most impressive recent projects.",
  },
  {
    id: 'experience',
    label: 'Experience',
    prompt: "What is Joseph's professional work experience?",
  },
  {
    id: 'hire',
    label: 'Why hire',
    prompt: 'What makes Joseph a good candidate for a software developer role?',
  },
  {
    id: 'resume',
    label: 'Resume',
    prompt: DOWNLOAD_RESUME_ACTION,
  },
];

const ID_START = 2;
const ID_END = 9;
const RADIX = 36;

/**
 * Creates a short browser-local chat message id.
 *
 * @returns Random base36 id segment.
 */
export const createChatMessageId = (): string =>
  Math.random().toString(RADIX).substring(ID_START, ID_END);

/**
 * Creates the welcome assistant message shown when the dock opens.
 *
 * @returns Welcome chat message.
 */
export const createWelcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: CHAT_WELCOME,
  timestamp: new Date(),
});

/**
 * Creates a user-authored chat message.
 *
 * @param content - Raw user input.
 * @returns User chat message.
 */
export const createUserMessage = (content: string): ChatMessage => ({
  id: createChatMessageId(),
  role: 'user',
  content: content.trim(),
  timestamp: new Date(),
});

/**
 * Creates an empty assistant placeholder for streaming chunks.
 *
 * @returns Empty assistant message.
 */
export const createAssistantPlaceholder = (): ChatMessage => ({
  id: createChatMessageId(),
  role: 'assistant',
  content: '',
  timestamp: new Date(),
});

/**
 * Creates a completed assistant message.
 *
 * @param content - Full assistant text.
 * @returns Assistant chat message.
 */
export const createAssistantMessage = (content: string): ChatMessage => ({
  id: createChatMessageId(),
  role: 'assistant',
  content,
  timestamp: new Date(),
});

/**
 * Maps UI messages into the API payload (drops local welcome).
 *
 * @param messages - Current dock messages.
 * @returns Request message list.
 */
export const toRequestMessages = (messages: readonly ChatMessage[]) =>
  messages
    .filter((message) => message.id !== 'welcome')
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

/**
 * Appends a streamed chunk onto one assistant message.
 *
 * @param messages - Current dock messages.
 * @param messageId - Assistant message receiving the chunk.
 * @param chunk - Streamed fragment.
 * @returns Updated message list.
 */
export const appendAssistantChunk = (
  messages: readonly ChatMessage[],
  messageId: string,
  chunk: string,
): ChatMessage[] =>
  messages.map((message) =>
    message.id === messageId ? { ...message, content: message.content + chunk } : message,
  );

const includesAny = (message: string, needles: string[]): boolean =>
  needles.some((needle) => message.includes(needle));

/**
 * Selects a local offline reply when the live API is unavailable.
 *
 * @param content - User message text.
 * @returns Offline assistant response.
 * @example
 * getOfflineResponse('show me projects')
 */
export const getOfflineResponse = (content: string): string => {
  const lower = content.toLowerCase();

  if (includesAny(lower, ['skill', 'tech', 'stack', 'language', 'framework'])) {
    return portfolioOfflineResponses.skills;
  }
  if (includesAny(lower, ['project', 'build', 'ship', 'portfolio', 'ebay', 'mcp'])) {
    return portfolioOfflineResponses.projects;
  }
  if (includesAny(lower, ['experience', 'work', 'job', 'career', 'role', 'company'])) {
    return portfolioOfflineResponses.experience;
  }
  if (includesAny(lower, ['hire', 'why', 'candidate', 'strength', 'fit'])) {
    return portfolioOfflineResponses.hire;
  }

  return `I can cover Joseph's skills, projects, experience, or why he is a strong hire. Live AI is offline right now — try one of those topics, or email ${portfolioKnowledge.person.displayName} via the contact section.`;
};

/** Custom event name used by bottom chrome to open the AI dock. */
export const OPEN_AI_CHAT_EVENT = 'v4-open-ai-chat';

/** Broadcast when the AI dock open state changes (hides mobile chrome while open). */
export const AI_CHAT_STATE_EVENT = 'v4-ai-chat-state';

/**
 * Opens the AI chat dock from outside React (bottom chrome, CTAs).
 */
export const openAiChat = (): void => {
  window.dispatchEvent(new CustomEvent(OPEN_AI_CHAT_EVENT));
};

/**
 * Publishes AI dock open/closed so bottom chrome can yield the mobile stack.
 *
 * @param open - Whether the AI panel is visible.
 */
export const publishAiChatState = (open: boolean): void => {
  window.dispatchEvent(new CustomEvent(AI_CHAT_STATE_EVENT, { detail: { open } }));
};
