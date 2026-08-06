import { createAssistantStreamParser } from '@shared/portfolio/assistantStream.js';
import { API_BASE_URL } from '@/lib/apiBaseUrl';

export type ChatRequestMessage = {
  role: string;
  content: string;
};

/**
 * Streams an assistant reply from the portfolio chat API.
 *
 * @param userMessages - Conversation history for the model.
 * @param onChunk - Called for each streamed content fragment.
 * @param abortSignal - Optional cancel signal.
 * @returns Full assistant response text.
 * @example
 * await fetchStreamingResponse([{ role: 'user', content: 'Hi' }], console.log)
 */
export const fetchStreamingResponse = async (
  userMessages: ChatRequestMessage[],
  onChunk: (chunk: string) => void,
  abortSignal?: AbortSignal,
): Promise<string> => {
  let fullResponse = '';

  const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: userMessages }),
    signal: abortSignal,
  });

  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  const parser = createAssistantStreamParser();

  while (true) {
    const { done, value } = await reader.read();
    const chunk = value ? decoder.decode(value, { stream: !done }) : '';
    const parsed = done ? parser.flush() : parser.push(chunk);

    for (const event of parsed.events) {
      if (event.type === 'error') {
        throw new Error(event.error);
      }

      fullResponse += event.content;
      onChunk(event.content);
    }

    if (done || parsed.done) {
      break;
    }
  }

  return fullResponse;
};
