import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { fetchStreamingResponse, sendEmail, transcribeAudio } from '@/utils/chatApi';
import {
  createWelcomeMessage,
  findPendingEmailRequest,
  markMessageEmailStatus,
} from '@/utils/chatSession';
import {
  notifyHiddenChatResponse,
  runChatSessionMessage,
  runVoiceChatInput,
  speakLastAssistantMessage,
} from '@/utils/chatSessionRuntime';
import type { EmailData, Message } from '@/utils/chatUtils';
import { getOfflineResponse } from '@/utils/offlineResponses';
import { useSpeechSynthesis } from './useSpeechSynthesis.ts';
import { useVoiceRecorder } from './useVoiceRecorder.ts';

type UsePortfolioChatSessionOptions = {
  isOpen: boolean;
  openPanel: () => void;
};

export function usePortfolioChatSession({ isOpen, openPanel }: UsePortfolioChatSessionOptions) {
  const [messages, setMessages] = useState<Message[]>([createWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const processedEmailsRef = useRef<Set<string>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);
  const isOpenRef = useRef(isOpen);

  const voiceRecorder = useVoiceRecorder({
    onError: (err) => setError(err.message),
  });

  const speechSynthesis = useSpeechSynthesis({
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const notifyResponseReady = useCallback(
    (response: string) => {
      notifyHiddenChatResponse({
        isOpen: isOpenRef.current,
        openPanel,
        response,
        notify: toast.success,
      });
    },
    [openPanel],
  );

  const sendMessage = useCallback(
    async (content: string, isVoiceMessage = false) => {
      await runChatSessionMessage({
        content,
        isVoiceMessage,
        snapshot: {
          messages,
          useAI,
          autoSpeak,
        },
        actions: {
          updateMessages: setMessages,
          clearInput: () => setInputValue(''),
          setError,
          setUseAI,
          setIsTyping,
          setIsStreaming,
        },
        adapters: {
          createAbortSignal: () => {
            abortControllerRef.current = new AbortController();
            return abortControllerRef.current.signal;
          },
          openResume: (url) => {
            window.open(url, '_blank', 'noopener,noreferrer');
          },
          fetchStreamingResponse,
          getOfflineResponse,
          notifyResponseReady,
          schedule: (callback, delayMs) => {
            window.setTimeout(callback, delayMs);
          },
          speak: (text) => {
            void speechSynthesis.speak(text);
          },
          speakWithBrowserTTS: speechSynthesis.speakWithBrowserTTS,
        },
      });
    },
    [autoSpeak, messages, notifyResponseReady, speechSynthesis, useAI],
  );

  const handleVoiceRecord = useCallback(async () => {
    await runVoiceChatInput({
      isRecording: voiceRecorder.isRecording,
      startRecording: voiceRecorder.startRecording,
      stopRecording: voiceRecorder.stopRecording,
      stopSpeech: speechSynthesis.stop,
      transcribeAudio,
      sendMessage,
      setError,
      setIsTranscribing,
    });
  }, [sendMessage, speechSynthesis, voiceRecorder]);

  const speakLastMessage = useCallback(() => {
    speakLastAssistantMessage({
      messages,
      speak: (content) => {
        void speechSynthesis.speak(content);
      },
    });
  }, [messages, speechSynthesis]);

  const sendEmailFromMarker = useCallback(async (messageId: string, emailData: EmailData) => {
    if (processedEmailsRef.current.has(messageId)) {
      return;
    }
    processedEmailsRef.current.add(messageId);

    setMessages((prev) => markMessageEmailStatus(prev, messageId, 'sending'));

    try {
      await sendEmail(emailData);
      setMessages((prev) => markMessageEmailStatus(prev, messageId, 'sent'));
    } catch (err) {
      setMessages((prev) => markMessageEmailStatus(prev, messageId, 'failed'));
      setError(err instanceof Error ? err.message : 'Failed to send email');
    }
  }, []);

  useEffect(() => {
    const pendingEmail = findPendingEmailRequest(messages, isStreaming);
    if (pendingEmail) {
      sendEmailFromMarker(pendingEmail.messageId, pendingEmail.emailData);
    }
  }, [messages, isStreaming, sendEmailFromMarker]);

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    isStreaming,
    error,
    useAI,
    isTranscribing,
    autoSpeak,
    setAutoSpeak,
    voiceRecorder,
    speechSynthesis,
    isInputDisabled: isStreaming || isTyping || isTranscribing || voiceRecorder.isRecording,
    sendMessage,
    handleVoiceRecord,
    speakLastMessage,
  };
}
