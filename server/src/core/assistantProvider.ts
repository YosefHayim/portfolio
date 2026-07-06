import type { CompleteAssistantResponse, StreamAssistantResponse } from './assistantRuntime.js';
import type { TextToSpeechInput } from './requestValidation.js';

export type SpeechToTextInput = {
  file: File;
  language?: string;
};

export type TextToSpeechOutput = {
  audio: ArrayBuffer;
  contentType: 'audio/mpeg';
  cacheControl: string;
};

export type PortfolioAssistantProvider = {
  complete: CompleteAssistantResponse;
  stream: StreamAssistantResponse;
  textToSpeech: (input: TextToSpeechInput) => Promise<TextToSpeechOutput>;
  speechToText: (input: SpeechToTextInput) => Promise<string>;
};

export const DEFAULT_SPEECH_LANGUAGE = 'en';
export const TEXT_TO_SPEECH_CACHE_CONTROL = 'private, max-age=3600';
