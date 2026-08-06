import { describe, expect, it } from '@effect/vitest';
import {
  CoreHttpError,
  isRecord,
  parseChatRequestBody,
  parsePortfolioEmailInput,
  parseTextToSpeechRequestBody,
  requireAudioContentType,
} from './requestValidation.js';

const expectHttpError = (run: () => unknown, status: number, message: string): void => {
  try {
    run();
    throw new Error('expected CoreHttpError');
  } catch (error) {
    expect(error).toBeInstanceOf(CoreHttpError);
    if (!(error instanceof CoreHttpError)) {
      throw error;
    }
    expect(error.status).toBe(status);
    expect(error.message).toBe(message);
  }
};

describe('parseChatRequestBody', () => {
  it('accepts user and assistant roles and trims content', () => {
    expect(
      parseChatRequestBody({
        messages: [
          { role: 'user', content: '  hi  ' },
          { role: 'assistant', content: 'hello' },
        ],
      }),
    ).toEqual({
      messages: [
        { role: 'user', content: 'hi' },
        { role: 'assistant', content: 'hello' },
      ],
    });
  });

  it('rejects empty messages, missing fields, system role, and overlong content', () => {
    expectHttpError(() => parseChatRequestBody({ messages: [] }), 400, 'Invalid request body');
    expectHttpError(() => parseChatRequestBody({}), 400, 'Invalid request body');
    expectHttpError(
      () => parseChatRequestBody({ messages: [{ role: 'system', content: 'nope' }] }),
      400,
      'Invalid request body',
    );
    expectHttpError(
      () =>
        parseChatRequestBody({
          messages: [{ role: 'user', content: 'x'.repeat(2001) }],
        }),
      400,
      'Invalid request body',
    );
    expectHttpError(
      () => parseChatRequestBody({ messages: [{ role: 'user', content: '   ' }] }),
      400,
      'Invalid request body',
    );
  });
});

describe('parseTextToSpeechRequestBody', () => {
  it('defaults voice to nova and trims text', () => {
    expect(parseTextToSpeechRequestBody({ text: '  Hello there  ' })).toEqual({
      text: 'Hello there',
      voice: 'nova',
    });
  });

  it('accepts each supported voice', () => {
    const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;
    for (const voice of voices) {
      expect(parseTextToSpeechRequestBody({ text: 'Say this', voice })).toEqual({
        text: 'Say this',
        voice,
      });
    }
  });

  it('rejects empty text, unknown voice, and overlong text', () => {
    expectHttpError(() => parseTextToSpeechRequestBody({ text: '' }), 400, 'Invalid request body');
    expectHttpError(
      () => parseTextToSpeechRequestBody({ text: 'ok', voice: 'robot' }),
      400,
      'Invalid request body',
    );
    expectHttpError(
      () => parseTextToSpeechRequestBody({ text: 'x'.repeat(4097) }),
      400,
      'Invalid request body',
    );
  });
});

describe('parsePortfolioEmailInput', () => {
  const validEmail = {
    senderName: 'Joseph',
    senderEmail: 'joseph@example.com',
    subject: 'Hello',
    message: 'This is a long enough message.',
  };

  it('trims all fields on success', () => {
    expect(
      parsePortfolioEmailInput({
        senderName: '  Joseph  ',
        senderEmail: '  joseph@example.com  ',
        subject: '  Hello  ',
        message: '  This is a long enough message.  ',
      }),
    ).toEqual(validEmail);
  });

  it('rejects invalid email shapes and short messages', () => {
    expectHttpError(
      () => parsePortfolioEmailInput({ ...validEmail, senderEmail: 'not-an-email' }),
      400,
      'Invalid request body',
    );
    expectHttpError(
      () => parsePortfolioEmailInput({ ...validEmail, message: 'too short' }),
      400,
      'Invalid request body',
    );
    expectHttpError(
      () => parsePortfolioEmailInput({ ...validEmail, senderName: '' }),
      400,
      'Invalid request body',
    );
    expectHttpError(
      () => parsePortfolioEmailInput({ ...validEmail, subject: 'x'.repeat(201) }),
      400,
      'Invalid request body',
    );
  });
});

describe('requireAudioContentType', () => {
  it('accepts audio/* content types', () => {
    expect(requireAudioContentType('audio/webm')).toBe('audio/webm');
    expect(requireAudioContentType('audio/mpeg')).toBe('audio/mpeg');
    expect(requireAudioContentType('application/json; audio/wav')).toBe(
      'application/json; audio/wav',
    );
  });

  it('rejects non-audio content types', () => {
    expectHttpError(
      () => requireAudioContentType('application/json'),
      400,
      'Invalid content type. Expected audio file.',
    );
    expectHttpError(
      () => requireAudioContentType('text/plain'),
      400,
      'Invalid content type. Expected audio file.',
    );
  });
});

describe('isRecord', () => {
  it('returns true only for plain non-null objects', () => {
    expect(isRecord({ ok: true })).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
    expect(isRecord([])).toBe(false);
    expect(isRecord('string')).toBe(false);
    expect(isRecord(1)).toBe(false);
  });
});

describe('CoreHttpError', () => {
  it('stores status and optional cause', () => {
    const cause = new Error('schema failed');
    const error = new CoreHttpError('Invalid request body', 400, { cause });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Invalid request body');
    expect(error.status).toBe(400);
    expect(error.cause).toBe(cause);
  });
});
