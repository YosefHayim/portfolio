import {
  createContactEmailPreview,
  findPendingContactEmailRequest,
  markContactEmailStatus,
} from '@shared/portfolio/contactEmail.js';
import { portfolioKnowledge } from '@shared/portfolio/portfolioKnowledge.js';
import type { EmailData, Message } from './chatUtils.ts';

const ID_START = 2;
const ID_END = 9;
const RADIX = 36;

export const DOWNLOAD_RESUME_ACTION = '__ACTION_DOWNLOAD_RESUME__';
export const RESUME_URL = portfolioKnowledge.links.resume;

/**
 * Creates a short browser-local chat message id.
 *
 * @returns Random base36 id segment.
 * @example
 * createChatMessageId()
 */
export const createChatMessageId = (): string =>
  Math.random().toString(RADIX).substring(ID_START, ID_END);

/**
 * Creates the initial assistant welcome message.
 *
 * @param content - Localized welcome copy.
 * @returns Welcome message shown when the chat opens.
 * @example
 * createWelcomeMessage('Hi!')
 */
export const createWelcomeMessage = (content: string): Message => ({
  id: 'welcome',
  role: 'assistant',
  content,
  timestamp: new Date(),
});

/**
 * Creates a user-authored chat message.
 *
 * @param content - Raw user input.
 * @param isVoiceMessage - Whether the message came from voice transcription.
 * @returns User chat message.
 * @example
 * createUserChatMessage('Tell me about Joseph')
 */
export const createUserChatMessage = (content: string, isVoiceMessage = false): Message => ({
  id: createChatMessageId(),
  role: 'user',
  content: content.trim(),
  timestamp: new Date(),
  isVoice: isVoiceMessage,
});

/**
 * Creates the empty assistant message that streaming chunks append to.
 *
 * @param messageId - Optional stable message id for the placeholder.
 * @returns Empty assistant message.
 * @example
 * createAssistantPlaceholder('assistant-1')
 */
export const createAssistantPlaceholder = (messageId = createChatMessageId()): Message => ({
  id: messageId,
  role: 'assistant',
  content: '',
  timestamp: new Date(),
});

/**
 * Creates a completed assistant message.
 *
 * @param content - Assistant response text.
 * @returns Assistant chat message.
 * @example
 * createAssistantMessage('Joseph builds AI tools.')
 */
export const createAssistantMessage = (content: string): Message => ({
  id: createChatMessageId(),
  role: 'assistant',
  content,
  timestamp: new Date(),
});

/**
 * Converts UI messages into the assistant request payload.
 *
 * @param messages - Current UI chat messages.
 * @returns Request messages without the local welcome message.
 * @example
 * toAssistantRequestMessages([createWelcomeMessage(), createUserChatMessage('Hi')])
 */
export const toAssistantRequestMessages = (messages: readonly Message[]) =>
  messages
    .filter((message) => message.id !== 'welcome')
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

/**
 * Appends a streamed chunk to one assistant message.
 *
 * @param messages - Current UI chat messages.
 * @param messageId - Assistant message id receiving the chunk.
 * @param chunk - Streamed content chunk.
 * @returns Updated messages.
 * @example
 * appendAssistantChunk(messages, 'assistant-1', 'hello')
 */
export const appendAssistantChunk = (
  messages: readonly Message[],
  messageId: string,
  chunk: string,
): Message[] =>
  messages.map((message) =>
    message.id === messageId ? { ...message, content: message.content + chunk } : message,
  );

/**
 * Marks an assistant email marker message with delivery status.
 *
 * @param messages - Current UI chat messages.
 * @param messageId - Message id containing the marker.
 * @param emailStatus - New email delivery state.
 * @returns Updated messages.
 * @example
 * markMessageEmailStatus(messages, 'assistant-1', 'sent')
 */
export const markMessageEmailStatus = (
  messages: readonly Message[],
  messageId: string,
  emailStatus: NonNullable<Message['emailStatus']>,
): Message[] => markContactEmailStatus(messages, messageId, emailStatus);

/**
 * Finds an unprocessed email marker in the latest assistant message.
 *
 * @param messages - Current UI chat messages.
 * @param isStreaming - Whether the assistant is still streaming.
 * @returns Pending email request or null.
 * @example
 * findPendingEmailRequest(messages, false)
 */
export const findPendingEmailRequest = (
  messages: readonly Message[],
  isStreaming: boolean,
): { messageId: string; emailData: EmailData } | null =>
  findPendingContactEmailRequest(messages, isStreaming);

/**
 * Creates a compact notification preview from an assistant response.
 *
 * @param response - Assistant response text.
 * @param maxLength - Maximum preview length.
 * @returns Preview without email marker metadata.
 * @example
 * createResponsePreview('Long assistant response', 12)
 */
export const createResponsePreview = (response: string, maxLength = 80): string =>
  createContactEmailPreview(response, maxLength);
