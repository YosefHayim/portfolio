import { createAssistantStreamParser } from '../../../shared/portfolio/assistantStream.js';
import { API_BASE_URL } from './apiBaseUrl.ts';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/chat/stt`, {
    method: 'POST',
    headers: { 'Content-Type': audioBlob.type },
    body: audioBlob,
  });

  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }

  const data: { text: string } = await response.json();
  return data.text;
}

export async function fetchStreamingResponse(
  userMessages: Array<{ role: string; content: string }>,
  onChunk: (chunk: string) => void,
  abortSignal?: AbortSignal,
): Promise<string> {
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
}

export async function sendEmail(emailData: {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/email/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const data: { error?: string } = await response.json();
    throw new Error(data.error || 'Failed to send email');
  }
}
