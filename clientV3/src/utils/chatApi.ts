import { createAssistantStreamParser } from '@shared/portfolio/assistantStream.js';
import { Schema } from 'effect';
import { API_BASE_URL } from './apiBaseUrl.ts';

const TranscriptionReplySchema = Schema.Struct({
  text: Schema.String,
});

const EmailSendErrorSchema = Schema.Struct({
  error: Schema.optional(Schema.String),
});

/**
 * Sends recorded audio to the speech-to-text API.
 *
 * @param audioBlob - Browser-recorded audio blob.
 * @returns Transcribed text from the server.
 * @example
 * await transcribeAudio(audioBlob)
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const sttResponse = await fetch(`${API_BASE_URL}/api/chat/stt`, {
    method: 'POST',
    headers: { 'Content-Type': audioBlob.type },
    body: audioBlob,
  });

  if (!sttResponse.ok) {
    throw new Error('Failed to transcribe audio');
  }

  const unknownBody: unknown = await sttResponse.json();

  try {
    const transcription = Schema.decodeUnknownSync(TranscriptionReplySchema)(unknownBody);
    return transcription.text;
  } catch {
    throw new Error('Invalid transcription response');
  }
};

/**
 * Reads the assistant SSE response and emits content chunks.
 *
 * @param userMessages - Assistant request messages.
 * @param onChunk - Callback for each streamed content chunk.
 * @param abortSignal - Optional cancellation signal.
 * @returns Full assistant reply text.
 * @example
 * await fetchStreamingResponse([{ role: 'user', content: 'Hi' }], console.log)
 */
export const fetchStreamingResponse = async (
  userMessages: Array<{ role: string; content: string }>,
  onChunk: (chunk: string) => void,
  abortSignal?: AbortSignal,
): Promise<string> => {
  let fullReply = '';

  const streamResponse = await fetch(`${API_BASE_URL}/api/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: userMessages }),
    signal: abortSignal,
  });

  if (!streamResponse.ok) {
    throw new Error('Failed to get AI response');
  }

  const reader = streamResponse.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  const parser = createAssistantStreamParser();

  while (true) {
    const { done, value } = await reader.read();
    const chunk = value ? decoder.decode(value, { stream: !done }) : '';
    const parseOutcome = done ? parser.flush() : parser.push(chunk);

    for (const event of parseOutcome.events) {
      if (event.type === 'error') {
        throw new Error(event.error);
      }

      fullReply += event.content;
      onChunk(event.content);
    }

    if (done || parseOutcome.done) {
      break;
    }
  }

  return fullReply;
};

/**
 * Sends a portfolio contact email.
 *
 * @param emailData - Validated email marker fields.
 * @returns Promise that settles after a successful send.
 * @example
 * await sendEmail({ senderName: 'Joseph', senderEmail: 'joseph@example.com', subject: 'Hi', message: 'Long enough message.' })
 */
export const sendEmail = async (emailData: {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}): Promise<void> => {
  const emailResponse = await fetch(`${API_BASE_URL}/api/email/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData),
  });

  if (!emailResponse.ok) {
    const unknownBody: unknown = await emailResponse.json();
    let failureMessage = 'Failed to send email';

    try {
      const emailError = Schema.decodeUnknownSync(EmailSendErrorSchema)(unknownBody);
      if (emailError.error) {
        failureMessage = emailError.error;
      }
    } catch {
      // Keep the generic failure message when the error body is not structured.
    }

    throw new Error(failureMessage);
  }
};
