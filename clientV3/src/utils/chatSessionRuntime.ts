import {
  appendAssistantChunk,
  assistantRequestMessages,
  createAssistantMessage,
  createAssistantPlaceholder,
  createResponsePreview,
  createUserChatMessage,
  DOWNLOAD_RESUME_ACTION,
  RESUME_URL,
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
  notifyResponseReady: (reply: string) => void;
  schedule: (callback: () => void, delayMs: number) => void;
  speak: (text: string) => void;
  speakWithBrowserTTS: (text: string) => void;
};

type RunChatSessionMessageInput = {
  content: string;
  isVoiceMessage?: boolean;
  snapshot: ChatSessionSnapshot;
  actions: ChatSessionActions;
  adapters: ChatSessionAdapters;
};

type RunVoiceChatInputArgs = {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  stopSpeech: () => void;
  transcribeAudio: (audioBlob: Blob) => Promise<string>;
  sendMessage: (content: string, isVoiceMessage: boolean) => Promise<void>;
  setError: (error: string | null) => void;
  setIsTranscribing: (isTranscribing: boolean) => void;
};

type SpeakLastAssistantMessageInput = {
  messages: readonly Message[];
  speak: (content: string) => void;
};

type NotifyHiddenChatResponseInput = {
  isOpen: boolean;
  openPanel: () => void;
  reply: string;
  labels: {
    ready: string;
    view: string;
  };
  notify: (
    message: string,
    options: {
      description: string;
      action: { label: string; onClick: () => void };
      duration: number;
    },
  ) => void;
};

const scheduleOfflineReply = ({
  trimmedContent,
  isVoiceMessage,
  snapshot,
  actions,
  adapters,
}: {
  trimmedContent: string;
  isVoiceMessage: boolean;
  snapshot: ChatSessionSnapshot;
  actions: ChatSessionActions;
  adapters: ChatSessionAdapters;
}): void => {
  actions.setIsTyping(true);
  adapters.schedule(() => {
    const offlineReply = adapters.getOfflineResponse(trimmedContent);
    actions.updateMessages((messages) => [...messages, createAssistantMessage(offlineReply)]);
    actions.setIsTyping(false);
    adapters.notifyResponseReady(offlineReply);

    if (snapshot.autoSpeak && isVoiceMessage) {
      adapters.speakWithBrowserTTS(offlineReply);
    }
  }, TYPING_DELAY);
};

const streamAssistantReply = async ({
  trimmedContent,
  isVoiceMessage,
  snapshot,
  userMessage,
  actions,
  adapters,
}: {
  trimmedContent: string;
  isVoiceMessage: boolean;
  snapshot: ChatSessionSnapshot;
  userMessage: Message;
  actions: ChatSessionActions;
  adapters: ChatSessionAdapters;
}): Promise<void> => {
  actions.setIsStreaming(true);
  const assistantMessage = createAssistantPlaceholder();
  actions.updateMessages((messages) => [...messages, assistantMessage]);

  try {
    const requestMessages = assistantRequestMessages([...snapshot.messages, userMessage]);
    const fullReply = await adapters.fetchStreamingResponse(
      requestMessages,
      (chunk) => {
        actions.updateMessages((messages) =>
          appendAssistantChunk(messages, assistantMessage.id, chunk),
        );
      },
      adapters.createAbortSignal(),
    );

    adapters.notifyResponseReady(fullReply);

    if (snapshot.autoSpeak && isVoiceMessage && fullReply) {
      adapters.speak(fullReply);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return;
    }

    actions.updateMessages((messages) =>
      messages.filter((message) => message.id !== assistantMessage.id),
    );

    const fallbackReply = adapters.getOfflineResponse(trimmedContent);
    actions.updateMessages((messages) => [...messages, createAssistantMessage(fallbackReply)]);
    actions.setError('AI unavailable. Using offline responses.');
    actions.setUseAI(false);
    adapters.notifyResponseReady(fallbackReply);

    if (snapshot.autoSpeak && isVoiceMessage) {
      adapters.speakWithBrowserTTS(fallbackReply);
    }
  } finally {
    actions.setIsStreaming(false);
  }
};

/**
 * Runs one chat message through offline or streaming assistant mode.
 *
 * @param input - Message content, state snapshot, actions, and external adapters.
 * @returns Promise that settles after state updates and side effects complete.
 * @example
 * await runChatSessionMessage({ content, snapshot, actions, adapters })
 */
export const runChatSessionMessage = async ({
  content,
  isVoiceMessage = false,
  snapshot,
  actions,
  adapters,
}: RunChatSessionMessageInput): Promise<void> => {
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
    scheduleOfflineReply({ trimmedContent, isVoiceMessage, snapshot, actions, adapters });
    return;
  }

  await streamAssistantReply({
    trimmedContent,
    isVoiceMessage,
    snapshot,
    userMessage,
    actions,
    adapters,
  });
};

/**
 * Toggles voice recording or submits the stopped recording to transcription.
 *
 * @param input - Voice recorder state, callbacks, and UI state setters.
 * @returns Promise that settles after recording/transcription work completes.
 * @example
 * await runVoiceChatInput({ isRecording, startRecording, stopRecording, stopSpeech, transcribeAudio, sendMessage, setError, setIsTranscribing })
 */
export const runVoiceChatInput = async ({
  isRecording,
  startRecording,
  stopRecording,
  stopSpeech,
  transcribeAudio,
  sendMessage,
  setError,
  setIsTranscribing,
}: RunVoiceChatInputArgs): Promise<void> => {
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
};

/**
 * Speaks the newest assistant message with the provided speech callback.
 *
 * @param input - Messages and speech callback.
 * @returns Nothing.
 * @example
 * speakLastAssistantMessage({ messages, speak })
 */
export const speakLastAssistantMessage = ({
  messages,
  speak,
}: SpeakLastAssistantMessageInput): void => {
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'assistant' && message.content);

  if (lastAssistantMessage) {
    speak(lastAssistantMessage.content);
  }
};

/**
 * Notifies the user when a reply arrives while the chat panel is closed.
 *
 * @param input - Panel state, reply text, and notifier callback.
 * @returns Nothing.
 * @example
 * notifyHiddenChatResponse({ isOpen: false, openPanel, reply, notify, labels })
 */
export const notifyHiddenChatResponse = ({
  isOpen,
  openPanel,
  reply,
  notify,
  labels,
}: NotifyHiddenChatResponseInput): void => {
  if (isOpen || !reply) {
    return;
  }

  notify(labels.ready, {
    description: createResponsePreview(reply),
    action: {
      label: labels.view,
      onClick: openPanel,
    },
    duration: 5000,
  });
};
