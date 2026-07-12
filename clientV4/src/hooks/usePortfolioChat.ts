import { useCallback, useRef, useState } from 'react';
import {
  appendAssistantChunk,
  createAssistantMessage,
  createAssistantPlaceholder,
  createUserMessage,
  createWelcomeMessage,
  DOWNLOAD_RESUME_ACTION,
  getOfflineResponse,
  RESUME_URL,
  toRequestMessages,
  type ChatMessage,
} from '@/data/chat';
import { fetchStreamingResponse } from '@/lib/chatApi';

const OFFLINE_TYPING_MS = 500;

/**
 * Owns AI dock conversation state and streaming against the portfolio API.
 *
 * @returns Messages, input state, and send handlers for the chat UI.
 * @example
 * const chat = usePortfolioChat()
 */
export const usePortfolioChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (rawContent: string) => {
      const content = rawContent.trim();
      if (!content || isStreaming || isTyping) {
        return;
      }

      if (content === DOWNLOAD_RESUME_ACTION) {
        window.open(RESUME_URL, '_blank', 'noopener,noreferrer');
        return;
      }

      const userMessage = createUserMessage(content);
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setError(null);

      if (!useAI) {
        setIsTyping(true);
        window.setTimeout(() => {
          const offline = getOfflineResponse(content);
          setMessages((prev) => [...prev, createAssistantMessage(offline)]);
          setIsTyping(false);
        }, OFFLINE_TYPING_MS);
        return;
      }

      setIsStreaming(true);
      const placeholder = createAssistantPlaceholder();
      setMessages((prev) => [...prev, placeholder]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await fetchStreamingResponse(
          toRequestMessages([...messages, userMessage]),
          (chunk) => {
            setMessages((prev) => appendAssistantChunk(prev, placeholder.id, chunk));
          },
          controller.signal,
        );
      } catch (caught) {
        if (caught instanceof Error && caught.name === 'AbortError') {
          return;
        }

        setUseAI(false);
        const offline = getOfflineResponse(content);
        setMessages((prev) =>
          prev.map((message) =>
            message.id === placeholder.id
              ? { ...message, content: offline || message.content }
              : message,
          ),
        );
        setError('Live AI unavailable — switched to offline answers.');
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, isTyping, messages, useAI],
  );

  const resetChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([createWelcomeMessage()]);
    setInputValue('');
    setError(null);
    setIsStreaming(false);
    setIsTyping(false);
    setUseAI(true);
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    isStreaming,
    isTyping,
    error,
    useAI,
    isBusy: isStreaming || isTyping,
    sendMessage,
    resetChat,
  };
};
