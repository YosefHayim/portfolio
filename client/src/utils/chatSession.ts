import {
  createContactEmailPreview,
  findPendingContactEmailRequest,
  markContactEmailStatus,
} from '../../../shared/portfolio/contactEmail.js';
import { portfolioKnowledge } from '../../../shared/portfolio/portfolioKnowledge.js';
import type { EmailData, Message } from './chatUtils.ts';

const ID_START = 2;
const ID_END = 9;
const RADIX = 36;

export const DOWNLOAD_RESUME_ACTION = '__ACTION_DOWNLOAD_RESUME__';
export const RESUME_URL = portfolioKnowledge.links.resume;

export function createChatMessageId(): string {
  return Math.random().toString(RADIX).substring(ID_START, ID_END);
}

export function createWelcomeMessage(): Message {
  return {
    id: 'welcome',
    role: 'assistant',
    content:
      "Hi! I'm Joseph's AI assistant. Ask me about his skills, projects, or experience. You can also use voice!",
    timestamp: new Date(),
  };
}

export function createUserChatMessage(content: string, isVoiceMessage = false): Message {
  return {
    id: createChatMessageId(),
    role: 'user',
    content: content.trim(),
    timestamp: new Date(),
    isVoice: isVoiceMessage,
  };
}

export function createAssistantPlaceholder(messageId = createChatMessageId()): Message {
  return {
    id: messageId,
    role: 'assistant',
    content: '',
    timestamp: new Date(),
  };
}

export function createAssistantMessage(content: string): Message {
  return {
    id: createChatMessageId(),
    role: 'assistant',
    content,
    timestamp: new Date(),
  };
}

export function toAssistantRequestMessages(messages: readonly Message[]) {
  return messages
    .filter((message) => message.id !== 'welcome')
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

export function appendAssistantChunk(
  messages: readonly Message[],
  messageId: string,
  chunk: string,
): Message[] {
  return messages.map((message) =>
    message.id === messageId ? { ...message, content: message.content + chunk } : message,
  );
}

export function markMessageEmailStatus(
  messages: readonly Message[],
  messageId: string,
  emailStatus: NonNullable<Message['emailStatus']>,
): Message[] {
  return markContactEmailStatus(messages, messageId, emailStatus);
}

export function findPendingEmailRequest(
  messages: readonly Message[],
  isStreaming: boolean,
): { messageId: string; emailData: EmailData } | null {
  return findPendingContactEmailRequest(messages, isStreaming);
}

export function createResponsePreview(response: string, maxLength = 80): string {
  return createContactEmailPreview(response, maxLength);
}
