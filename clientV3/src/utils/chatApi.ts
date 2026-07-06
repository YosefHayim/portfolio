import { createAssistantStreamParser } from '@shared/portfolio/assistantStream.js';
import { API_BASE_URL } from './apiBaseUrl.ts';

/**
 * Sends recorded audio to the speech-to-text API.
 *
 * @param audioBlob - Browser-recorded audio blob.
 * @returns Transcribed text from the server.
 * @example
 * await transcribeAudio(audioBlob)
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/chat/stt`, {
    method: 'POST',
    headers: { 'Content-Type': audioBlob.type },
    body: audioBlob,
  });

  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }

  const data: unknown = await response.json();
  if (!isRecord(data) || typeof data.text !== 'string') {
    throw new Error('Invalid transcription response');
  }

  return data.text;
};

/**
 * Reads the assistant SSE response and emits content chunks.
 *
 * @param userMessages - Assistant request messages.
 * @param onChunk - Callback for each streamed content chunk.
 * @param abortSignal - Optional cancellation signal.
 * @returns Full assistant response.
 * @example
 * await fetchStreamingResponse([{ role: 'user', content: 'Hi' }], console.log)
 */
export const fetchStreamingResponse = async (
  userMessages: Array<{ role: string; content: string }>,
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
    const result = done ? parser.flush() : parser.push(chunk);

    for (const event of result.events) {
      if (event.type === 'error') {
        throw new Error(event.error);
      }

      fullResponse += event.content;
      onChunk(event.content);
    }

    if (done || result.done) {
      break;
    }
  }

  return fullResponse;
};

/**
 * Sends a portfolio contact email.
 *
 * @param emailData - Validated email marker payload.
 * @returns Promise that resolves after successful send.
 * @example
 * await sendEmail({ senderName: 'Joseph', senderEmail: 'joseph@example.com', subject: 'Hi', message: 'Long enough message.' })
 */
export const sendEmail = async (emailData: {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/email/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const data: unknown = await response.json();
    const message =
      isRecord(data) && typeof data.error === 'string' ? data.error : 'Failed to send email';
    throw new Error(message);
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);
