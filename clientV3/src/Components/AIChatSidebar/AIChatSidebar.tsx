import { cx } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle } from 'react-icons/fi';
import { ColorOrb } from '@/Components/ui/AIInput';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { usePortfolioChatSession } from '@/hooks/usePortfolioChatSession';
import { cn } from '@/lib/utils';
import { ChatHeader } from './ChatHeader.tsx';
import { ChatInput } from './ChatInput.tsx';
import { ChatMessage } from './ChatMessage.tsx';
import { QuickActions } from './QuickActions.tsx';
import { TypingIndicator } from './TypingIndicator.tsx';

const SPEED_FACTOR = 1;
const PANEL_WIDTH = 380;
const PANEL_HEIGHT_COLLAPSED = 52;
const PANEL_HEIGHT_EXPANDED = 520;
const PANEL_HEIGHT_EXPANDED_MOBILE = 450;

export const AIChatSidebar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const openPanel = useCallback(() => setIsOpen(true), []);
  const {
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
    isInputDisabled,
    sendMessage,
    handleVoiceRecord,
    speakLastMessage,
  } = usePortfolioChatSession({ isOpen, openPanel });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current && !voiceRecorder.isRecording) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, voiceRecorder.isRecording]);

  useEffect(() => {
    const handleSidebarOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !(event.target instanceof Node && wrapperRef.current.contains(event.target)) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleSidebarOutsideClick);
    return () => document.removeEventListener('mousedown', handleSidebarOutsideClick);
  }, [isOpen]);

  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      void sendMessage(inputValue);
    },
    [inputValue, sendMessage],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void sendMessage(inputValue);
      }
    },
    [inputValue, sendMessage],
  );

  const handleAutoSpeakToggle = useCallback(() => setAutoSpeak((prev) => !prev), [setAutoSpeak]);

  const mobileDock = isOpen ? 'right-3 bottom-6 left-3' : 'right-3 bottom-6';
  const dockPosition = isMobile ? mobileDock : 'right-4 bottom-6';
  const panelWidth = isMobile ? '100%' : PANEL_WIDTH;
  const animateWidth = isOpen ? panelWidth : 'auto';
  const expandedHeight = isMobile ? PANEL_HEIGHT_EXPANDED_MOBILE : PANEL_HEIGHT_EXPANDED;
  const animateHeight = isOpen ? expandedHeight : PANEL_HEIGHT_COLLAPSED;
  const expandedRadius = isMobile ? 12 : 16;
  const animateRadius = isOpen ? expandedRadius : 26;

  return (
    <div
      className={cn('fixed z-50 flex items-end justify-end', dockPosition)}
      style={{ width: isMobile ? 'auto' : PANEL_WIDTH }}
    >
      <motion.div
        ref={wrapperRef}
        data-panel={true}
        className={cx(
          'relative flex flex-col overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl',
          isMobile && isOpen && 'w-full',
        )}
        initial={false}
        animate={{
          width: animateWidth,
          height: animateHeight,
          borderRadius: animateRadius,
        }}
        transition={{
          type: 'spring',
          stiffness: 550 / SPEED_FACTOR,
          damping: 45,
          mass: 0.7,
          delay: isOpen ? 0 : 0.08,
        }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-[52px] select-none items-center justify-center whitespace-nowrap"
            >
              <Tooltip>
                <TooltipTrigger asChild={true}>
                  <button
                    type="button"
                    aria-label={t('chat.askAi')}
                    className="flex cursor-pointer items-center justify-center gap-2 p-2 text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-brand"
                    onClick={openPanel}
                  >
                    <ColorOrb
                      dimension="28px"
                      tones={{
                        base: 'oklch(10% 0.02 145)',
                        accent1: 'oklch(80% 0.25 145)',
                        accent2: 'oklch(70% 0.2 195)',
                        accent3: 'oklch(75% 0.18 280)',
                      }}
                    />
                    <span className="rounded-full p-2 font-medium text-sm">{t('chat.askAi')}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8}>
                  {t('chat.collapsedTooltip')}
                </TooltipContent>
              </Tooltip>
            </motion.footer>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex h-full flex-col"
            >
              <ChatHeader
                useAI={useAI}
                autoSpeak={autoSpeak}
                isMobile={isMobile}
                onAutoSpeakToggle={handleAutoSpeakToggle}
                onClose={() => setIsOpen(false)}
              />

              {error && (
                <div className="flex items-center gap-2 border-[var(--border-subtle)] border-b bg-brand-accent/10 p-2 text-brand-accent text-xs">
                  <FiAlertCircle size={12} aria-hidden="true" />
                  {error}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-2 sm:p-2">
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isStreaming={isStreaming}
                      isLastMessage={index === messages.length - 1}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-[var(--border-subtle)] border-t p-2 sm:p-2">
                {!voiceRecorder.isRecording && (
                  <QuickActions
                    onAction={sendMessage}
                    disabled={isInputDisabled}
                    isMobile={isMobile}
                  />
                )}

                <ChatInput
                  ref={inputRef}
                  inputValue={inputValue}
                  isStreaming={isStreaming}
                  isTyping={isTyping}
                  isTranscribing={isTranscribing}
                  isRecording={voiceRecorder.isRecording}
                  recordingDuration={voiceRecorder.duration}
                  audioLevels={voiceRecorder.audioLevels}
                  isMobile={isMobile}
                  speechIsPlaying={speechSynthesis.isPlaying}
                  speechState={speechSynthesis.state}
                  hasMessages={messages.length > 1}
                  onInputChange={setInputValue}
                  onSubmit={handleSubmit}
                  onKeyDown={handleKeyDown}
                  onVoiceRecord={handleVoiceRecord}
                  onSpeechPause={speechSynthesis.pause}
                  onSpeechResume={speechSynthesis.resume}
                  onSpeechStop={speechSynthesis.stop}
                  onSpeakLastMessage={speakLastMessage}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
