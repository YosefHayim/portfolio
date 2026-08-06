import { describe, expect, it } from '@effect/vitest';
import { HTTP_ERROR_MESSAGE } from './httpErrors.js';
import {
  isRecord,
  parseChatRequest,
  parsePortfolioEmailInput,
  parseTextToSpeechRequest,
  requireAudioContentType,
} from './requestValidation.js';

const expectOperationalError = (run: () => unknown, message: string): void => {
  try {
    run();
    throw new Error(`expected Error: ${message}`);
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    if (!(error instanceof Error)) {
      throw error;
    }
    expect(error.message).toBe(message);
  }
};

describe('parseChatRequest', () => {
  it('accepts user and assistant roles and trims content', () => {
    expect(
      parseChatRequest({
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
    expectOperationalError(
      () => parseChatRequest({ messages: [] }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
    );
    expectOperationalError(() => parseChatRequest({}), HTTP_ERROR_MESSAGE.invalidRequestBody);
    expectOperationalError(
      () => parseChatRequest({ messages: [{ role: 'system', content: 'nope' }] }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
    );
    expectOperationalError(
      () =>
        parseChatRequest({
          messages: [{ role: 'user', content: 'x'.repeat(2001) }],
        }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
    );
    expectOperationalError(
      () => parseChatRequest({ messages: [{ role: 'user', content: '   ' }] }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
    );
  });
});

describe('parseTextToSpeechRequest', () => {
  it('defaults voice to nova and trims text', () => {
    expect(parseTextToSpeechRequest({ text: '  Hello there  ' })).toEqual({
      text: 'Hello there',
      voice: 'nova',
    });
  });

  it('accepts each supported voice', () => {
    const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;
    for (const voice of voices) {
      expect(parseTextToSpeechRequest({ text: 'Say this', voice })).toEqual({
        text: 'Say this',
        voice,
      });
    }
  });

  it('rejects empty text, unknown voice, and overlong text', () => {
    expectOperationalError(
      () => parseTextToSpeechRequest({ text: '' }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
    );
    expectOperationalError(
      () => parseTextToSpeechRequest({ text: 'ok', voice: 'robot' }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
    );
    expectOperationalError(
      () => parseTextToSpeechRequest({ text: 'x'.repeat(4097) }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
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
    expectOperationalError(
      () => parsePortfolioEmailInput({ ...validEmail, senderEmail: 'not-an-email' }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
    );
    expectOperationalError(
      () => parsePortfolioEmailInput({ ...validEmail, message: 'too short' }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
    );
    expectOperationalError(
      () => parsePortfolioEmailInput({ ...validEmail, senderName: '' }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
    );
    expectOperationalError(
      () => parsePortfolioEmailInput({ ...validEmail, subject: 'x'.repeat(201) }),
      HTTP_ERROR_MESSAGE.invalidRequestBody,
    );
  });
});

describe('requireAudioContentType', () => {
  it('accepts audio/* content types', () => {
    expect(requireAudioContentType('audio/webm')).toBe('audio/webm');
    expect(requireAudioContentType('audio/mpeg')).toBe('audio/mpeg');
  });

  it('rejects non-audio content types', () => {
    expectOperationalError(
      () => requireAudioContentType('application/json'),
      HTTP_ERROR_MESSAGE.invalidAudioContentType,
    );
    expectOperationalError(
      () => requireAudioContentType('text/plain'),
      HTTP_ERROR_MESSAGE.invalidAudioContentType,
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
