import { AnimatePresence, motion } from 'framer-motion';
import { type FormEvent, type KeyboardEvent, memo, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMic, FiSend, FiSquare, FiVolume2 } from 'react-icons/fi';
import { AudioVisualizer, SpeakingIndicator } from '@/Components/ui/AIVoiceInput';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';

type SpeechState = 'idle' | 'loading' | 'playing' | 'paused';

interface ChatInputProps {
  inputValue: string;
  isStreaming: boolean;
  isTyping: boolean;
  isTranscribing: boolean;
  isRecording: boolean;
  recordingDuration: number;
  audioLevels: number[];
  isMobile: boolean;
  speechIsPlaying: boolean;
  speechState: SpeechState;
  hasMessages: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onVoiceRecord: () => void;
  onSpeechPause: () => void;
  onSpeechResume: () => void;
  onSpeechStop: () => void;
  onSpeakLastMessage: () => void;
  ref?: Ref<HTMLInputElement>;
}

const formatRecordingClock = (durationSeconds: number): string => {
  const minutes = Math.floor(durationSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (durationSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const ChatInput = memo(
  ({
    inputValue,
    isStreaming,
    isTyping,
    isTranscribing,
    isRecording,
    recordingDuration,
    audioLevels,
    isMobile,
    speechIsPlaying,
    speechState,
    hasMessages,
    onInputChange,
    onSubmit,
    onKeyDown,
    onVoiceRecord,
    onSpeechPause,
    onSpeechResume,
    onSpeechStop,
    onSpeakLastMessage,
    ref,
  }: ChatInputProps) => {
    const { t } = useTranslation();
    const isInputDisabled = isStreaming || isTyping || isTranscribing || isRecording;
    const isVoiceDisabled = isStreaming || isTyping;

    let inputPlaceholder = t('chat.askAnything');
    if (isTranscribing) {
      inputPlaceholder = t('chat.transcribing');
    } else if (isRecording) {
      inputPlaceholder = t('chat.recording');
    }

    let voiceTooltipLabel = t('chat.recordVoiceMessage');
    if (isTranscribing) {
      voiceTooltipLabel = t('chat.processingVoice');
    } else if (isRecording) {
      voiceTooltipLabel = t('chat.stopRecording');
    }

    let voiceButtonIcon = <FiMic className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />;
    if (isTranscribing) {
      voiceButtonIcon = (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
          className="h-4 w-4 rounded-md border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      );
    } else if (isRecording) {
      voiceButtonIcon = <FiSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />;
    }

    return (
      <div className="p-2 sm:p-2">
        <AnimatePresence>
          {(speechIsPlaying || speechState === 'paused') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <SpeakingIndicator
                isPlaying={speechIsPlaying}
                isPaused={speechState === 'paused'}
                onPause={onSpeechPause}
                onResume={onSpeechResume}
                onStop={onSpeechStop}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col items-center gap-2 rounded-xl bg-[var(--bg-surface)] p-2"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand-danger" />
                <span className="font-mono text-brand-danger text-sm">
                  {formatRecordingClock(recordingDuration)}
                </span>
              </div>
              <AudioVisualizer
                levels={audioLevels}
                isActive={isRecording}
                barCount={32}
                color="var(--brand-danger)"
              />
              <span className="text-[var(--text-muted)] text-xs">
                {t('chat.recordingTapToStop')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <form className="flex items-center gap-2 p-2 sm:gap-2 sm:p-2" onSubmit={onSubmit}>
          <div className="relative flex-1">
            <input
              type="text"
              className={cn(
                'h-10 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 text-[var(--text-primary)] text-sm transition-colors placeholder:text-[var(--text-muted)] sm:h-11 sm:p-2',
                'focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30',
                isRecording && 'opacity-50',
              )}
              disabled={isInputDisabled}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={inputPlaceholder}
              ref={ref}
              value={inputValue}
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild={true}>
              <motion.button
                type="button"
                aria-label={voiceTooltipLabel}
                onClick={onVoiceRecord}
                disabled={isVoiceDisabled}
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border-subtle)]',
                  isRecording
                    ? 'bg-brand-danger text-white'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  isVoiceDisabled && 'cursor-not-allowed opacity-50',
                )}
                whileHover={{
                  scale: isVoiceDisabled ? 1 : 1.02,
                }}
                whileTap={{ scale: isVoiceDisabled ? 1 : 0.98 }}
              >
                {voiceButtonIcon}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {voiceTooltipLabel}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild={true}>
              <motion.button
                type="submit"
                aria-label={t('chat.sendMessage')}
                disabled={!inputValue.trim() || isInputDisabled}
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand text-black hover:bg-brand-hover',
                  (!inputValue.trim() || isInputDisabled) && 'cursor-not-allowed opacity-50',
                )}
                whileHover={{
                  scale: !inputValue.trim() || isInputDisabled ? 1 : 1.02,
                }}
                whileTap={{
                  scale: !inputValue.trim() || isInputDisabled ? 1 : 0.98,
                }}
              >
                <FiSend size={isMobile ? 14 : 16} aria-hidden="true" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {t('chat.sendMessage')}
            </TooltipContent>
          </Tooltip>
        </form>

        {hasMessages && !isRecording && !speechIsPlaying && (
          <Tooltip>
            <TooltipTrigger asChild={true}>
              <button
                type="button"
                onClick={onSpeakLastMessage}
                className="flex w-full items-center justify-center gap-2 rounded-lg p-2 text-[11px] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-brand sm:p-2 sm:text-xs"
              >
                <FiVolume2 size={12} aria-hidden="true" />
                {t('chat.playLastResponse')}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {t('chat.listenToLastReply')}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  },
);

ChatInput.displayName = 'ChatInput';
