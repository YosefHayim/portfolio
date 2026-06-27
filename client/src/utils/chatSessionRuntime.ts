import {
  appendAssistantChunk,
  createAssistantMessage,
  createAssistantPlaceholder,
  createResponsePreview,
  createUserChatMessage,
  DOWNLOAD_RESUME_ACTION,
  RESUME_URL,
  toAssistantRequestMessages,
} from './chatSession.ts';
import type { Message } from './chatUtils.ts';

const TYPING_DELAY = 800;

export type ChatSessionSnapshot = {
  messages: Message[];
  useAI: boolean;
  autoSpeak: boolean;
};

export type ChatSessionActions = {
  updateMessages: (update: (messages: Message[]) => Message[]) => void;
  clearInput: () => void;
  setError: (error: string | null) => void;
  setUseAI: (useAI: boolean) => void;
  setIsTyping: (isTyping: boolean) => void;
  setIsStreaming: (isStreaming: boolean) => void;
};

export type ChatSessionAdapters = {
  createAbortSignal: () => AbortSignal;
  openResume: (url: string) => void;
  fetchStreamingResponse: (
    messages: Array<{ role: string; content: string }>,
    onChunk: (chunk: string) => void,
    abortSignal?: AbortSignal,
  ) => Promise<string>;
  getOfflineResponse: (content: string) => string;
  notifyResponseReady: (response: string) => void;
  schedule: (callback: () => void, delayMs: number) => void;
  speak: (text: string) => void;
  speakWithBrowserTTS: (text: string) => void;
};

export async function runChatSessionMessage({
  content,
  isVoiceMessage = false,
  snapshot,
  actions,
  adapters,
}: {
  content: string;
  isVoiceMessage?: boolean;
  snapshot: ChatSessionSnapshot;
  actions: ChatSessionActions;
  adapters: ChatSessionAdapters;
}): Promise<void> {
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return;
  }

  if (content === DOWNLOAD_RESUME_ACTION) {
    adapters.openResume(RESUME_URL);
    return;
  }

  const userMessage = createUserChatMessage(trimmedContent, isVoiceMessage);

  actions.updateMessages((messages) => [...messages, userMessage]);
  actions.clearInput();
  actions.setError(null);

  if (!snapshot.useAI) {
    actions.setIsTyping(true);
    adapters.schedule(() => {
      const response = adapters.getOfflineResponse(trimmedContent);
      actions.updateMessages((messages) => [...messages, createAssistantMessage(response)]);
      actions.setIsTyping(false);
      adapters.notifyResponseReady(response);

      if (snapshot.autoSpeak && isVoiceMessage) {
        adapters.speakWithBrowserTTS(response);
      }
    }, TYPING_DELAY);
    return;
  }

  actions.setIsStreaming(true);
  const assistantMessage = createAssistantPlaceholder();
  actions.updateMessages((messages) => [...messages, assistantMessage]);

  try {
    const requestMessages = toAssistantRequestMessages([...snapshot.messages, userMessage]);
    const fullResponse = await adapters.fetchStreamingResponse(
      requestMessages,
      (chunk) => {
        actions.updateMessages((messages) =>
          appendAssistantChunk(messages, assistantMessage.id, chunk),
        );
      },
      adapters.createAbortSignal(),
    );

    adapters.notifyResponseReady(fullResponse);

    if (snapshot.autoSpeak && isVoiceMessage && fullResponse) {
      adapters.speak(fullResponse);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return;
    }

    actions.updateMessages((messages) =>
      messages.filter((message) => message.id !== assistantMessage.id),
    );

    const fallbackResponse = adapters.getOfflineResponse(trimmedContent);
    actions.updateMessages((messages) => [...messages, createAssistantMessage(fallbackResponse)]);
    actions.setError('AI unavailable. Using offline responses.');
    actions.setUseAI(false);
    adapters.notifyResponseReady(fallbackResponse);

    if (snapshot.autoSpeak && isVoiceMessage) {
      adapters.speakWithBrowserTTS(fallbackResponse);
    }
  } finally {
    actions.setIsStreaming(false);
  }
}

export async function runVoiceChatInput({
  isRecording,
  startRecording,
  stopRecording,
  stopSpeech,
  transcribeAudio,
  sendMessage,
  setError,
  setIsTranscribing,
}: {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  stopSpeech: () => void;
  transcribeAudio: (audioBlob: Blob) => Promise<string>;
  sendMessage: (content: string, isVoiceMessage: boolean) => Promise<void>;
  setError: (error: string | null) => void;
  setIsTranscribing: (isTranscribing: boolean) => void;
}): Promise<void> {
  if (!isRecording) {
    stopSpeech();
    await startRecording();
    return;
  }

  setIsTranscribing(true);
  try {
    const audioBlob = await stopRecording();
    if (!audioBlob) {
      return;
    }

    const transcribedText = await transcribeAudio(audioBlob);
    if (transcribedText.trim()) {
      await sendMessage(transcribedText, true);
    }
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Failed to process voice');
  } finally {
    setIsTranscribing(false);
  }
}

export function speakLastAssistantMessage({
  messages,
  speak,
}: {
  messages: readonly Message[];
  speak: (content: string) => void;
}): void {
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'assistant' && message.content);

  if (lastAssistantMessage) {
    speak(lastAssistantMessage.content);
  }
}

export function notifyHiddenChatResponse({
  isOpen,
  openPanel,
  response,
  notify,
}: {
  isOpen: boolean;
  openPanel: () => void;
  response: string;
  notify: (
    message: string,
    options: {
      description: string;
      action: { label: string; onClick: () => void };
      duration: number;
    },
  ) => void;
}): void {
  if (isOpen || !response) {
    return;
  }

  notify('AI Response Ready', {
    description: createResponsePreview(response),
    action: {
      label: 'View',
      onClick: openPanel,
    },
    duration: 5000,
  });
}
