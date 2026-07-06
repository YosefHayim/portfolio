import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiMic, FiPause, FiPlay, FiSquare, FiVolume2 } from 'react-icons/fi';
import { cn } from '@/lib/utils';

type AudioVisualizerProps = {
  levels: number[];
  isActive: boolean;
  className?: string;
  barCount?: number;
  color?: string;
};

export const AudioVisualizer = ({
  levels,
  isActive,
  className,
  barCount = 24,
  color = 'var(--brand-primary)',
}: AudioVisualizerProps) => {
  const displayLevels = levels.slice(0, barCount);

  return (
    <div className={cn('flex h-8 items-center justify-center gap-2', className)}>
      {displayLevels.map((level, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ backgroundColor: isActive ? color : 'var(--text-muted)' }}
          initial={{ height: 4 }}
          animate={{
            height: isActive ? Math.max(4, level * 32) : 4,
            opacity: isActive ? 0.5 + level * 0.5 : 0.3,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        />
      ))}
    </div>
  );
};

type VoiceRecordButtonProps = {
  isRecording: boolean;
  isProcessing?: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export const VoiceRecordButton = ({
  isRecording,
  isProcessing,
  onClick,
  disabled,
  size = 'md',
}: VoiceRecordButtonProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const stopIcon = (
    <motion.div
      key="stop"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <FiSquare size={iconSizes[size]} />
    </motion.div>
  );
  const idleIcon = (
    <motion.div
      key="mic"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <FiMic size={iconSizes[size]} />
    </motion.div>
  );
  const processingIcon = (
    <motion.div
      key="processing"
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: 360 }}
      exit={{ opacity: 0 }}
      transition={{
        rotate: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
      }}
      className="h-4 w-4 rounded-sm border-2 border-current border-t-transparent"
    />
  );
  const recordingStateIcon = isRecording ? stopIcon : idleIcon;
  const voiceStateIcon = isProcessing ? processingIcon : recordingStateIcon;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={cn(
        'relative flex items-center justify-center rounded-full transition-colors',
        sizeClasses[size],
        isRecording
          ? 'bg-brand-danger text-white hover:bg-brand-danger-hover'
          : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-brand',
        (disabled || isProcessing) && 'cursor-not-allowed opacity-50',
      )}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <AnimatePresence mode="wait">{voiceStateIcon}</AnimatePresence>

      {isRecording && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-danger"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </motion.button>
  );
};

type SpeakingIndicatorProps = {
  isPlaying: boolean;
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
};

export const SpeakingIndicator = ({
  isPlaying,
  isPaused,
  onPause,
  onResume,
  onStop,
}: SpeakingIndicatorProps) => {
  const { t } = useTranslation();

  if (!(isPlaying || isPaused)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-2 rounded-lg bg-[var(--bg-surface)] p-2 p-2"
    >
      <motion.div
        animate={{ scale: isPaused ? 1 : [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: isPaused ? 0 : Number.POSITIVE_INFINITY }}
      >
        <FiVolume2 size={14} className="text-brand" />
      </motion.div>

      <span className="text-xs text-[var(--text-muted)]">
        {isPaused ? t('chat.paused') : t('chat.speaking')}
      </span>

      <div className="flex gap-2">
        {isPaused ? (
          <button
            type="button"
            onClick={onResume}
            className="rounded p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-brand"
          >
            <FiPlay size={12} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onPause}
            className="rounded p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-brand"
          >
            <FiPause size={12} />
          </button>
        )}
        <button
          type="button"
          onClick={onStop}
          className="rounded p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-brand-danger"
        >
          <FiSquare size={12} />
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Formats recorder duration as a compact timer label.
 *
 * @param seconds - Whole seconds elapsed while recording.
 * @returns Timer label in `mm:ss` format.
 * @example
 * formatDuration(65) // '01:05'
 */
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

type AIVoiceInputProps = {
  isRecording: boolean;
  isProcessing?: boolean;
  duration: number;
  audioLevels: number[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
  className?: string;
};

export const AIVoiceInput = ({
  isRecording,
  isProcessing,
  duration,
  audioLevels,
  onStartRecording,
  onStopRecording,
  disabled,
  className,
}: AIVoiceInputProps) => {
  const { t } = useTranslation();

  const handleRecordToggle = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <VoiceRecordButton
        isRecording={isRecording}
        isProcessing={isProcessing}
        onClick={handleRecordToggle}
        disabled={disabled}
        size="lg"
      />

      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-mono text-sm text-brand-danger">{formatDuration(duration)}</span>

            <AudioVisualizer
              levels={audioLevels}
              isActive={isRecording}
              barCount={32}
              color="var(--brand-danger)"
            />

            <span className="text-xs text-[var(--text-muted)]">
              {t('chat.recordingClickToStop')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!(isRecording || isProcessing) && (
        <span className="text-xs text-[var(--text-muted)]">{t('chat.clickToSpeak')}</span>
      )}

      {isProcessing && (
        <span className="text-xs text-[var(--text-muted)]">{t('chat.processingAudio')}</span>
      )}
    </div>
  );
};
