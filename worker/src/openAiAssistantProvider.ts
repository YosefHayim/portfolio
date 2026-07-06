import {
  CoreHttpError,
  DEFAULT_SPEECH_LANGUAGE,
  TEXT_TO_SPEECH_CACHE_CONTROL,
  isRecord,
  readOpenAiCompletionText,
  readOpenAiTextStream,
  type PortfolioAssistantProvider,
} from '../../shared/portfolio/portfolioRuntime.js';

export type OpenAiWorkerEnv = {
  OPENAI_API_KEY?: string;
};

export const createFetchOpenAiAssistantProvider = (
  env: OpenAiWorkerEnv,
): PortfolioAssistantProvider => ({
  complete: async (input) => {
    const completion = await fetchOpenAiJson(env, '/v1/chat/completions', {
      model: input.model,
      messages: input.messages,
      max_tokens: input.maxTokens,
      temperature: input.temperature,
    });

    return readOpenAiCompletionText(completion);
  },
  stream: async (input) => {
    const response = await fetchOpenAi(env, '/v1/chat/completions', {
      model: input.model,
      messages: input.messages,
      max_tokens: input.maxTokens,
      temperature: input.temperature,
      stream: true,
    });

    if (!response.ok || !response.body) {
      throw new CoreHttpError('AI provider unavailable', 502);
    }

    return readOpenAiTextStream(response.body);
  },
  textToSpeech: async ({ text, voice }) => {
    const response = await fetchOpenAi(env, '/v1/audio/speech', {
      model: 'tts-1',
      voice,
      input: text,
      response_format: 'mp3',
      speed: 1,
    });

    if (!response.ok) {
      throw new CoreHttpError('Text-to-speech provider unavailable', 502);
    }

    return {
      audio: await response.arrayBuffer(),
      contentType: 'audio/mpeg',
      cacheControl: TEXT_TO_SPEECH_CACHE_CONTROL,
    };
  },
  speechToText: async ({ file, language = DEFAULT_SPEECH_LANGUAGE }) => {
    requireOpenAiKey(env);

    const form = new FormData();
    form.append('file', file);
    form.append('model', 'whisper-1');
    form.append('language', language);

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: form,
    });

    if (!response.ok) {
      throw new CoreHttpError('Speech-to-text provider unavailable', 502);
    }

    const data = await response.json();
    return isRecord(data) && typeof data.text === 'string' ? data.text : '';
  },
});

const fetchOpenAiJson = async (
  env: OpenAiWorkerEnv,
  path: string,
  body: unknown,
): Promise<unknown> => {
  const response = await fetchOpenAi(env, path, body);
  if (!response.ok) {
    throw new CoreHttpError('AI provider unavailable', 502);
  }
  return response.json();
};

const fetchOpenAi = (
  env: OpenAiWorkerEnv,
  path: string,
  body: unknown,
): Promise<Response> => {
  requireOpenAiKey(env);
  return fetch(`https://api.openai.com${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

const requireOpenAiKey = (env: OpenAiWorkerEnv): void => {
  if (!env.OPENAI_API_KEY) {
    throw new CoreHttpError('OPENAI_API_KEY is not configured', 503);
  }
};
