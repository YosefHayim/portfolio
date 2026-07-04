import { AnimatePresence, motion } from "framer-motion";
import { FiMic, FiSquare, FiVolume2, FiPause, FiPlay } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface AudioVisualizerProps {
  levels: number[];
  isActive: boolean;
  className?: string;
  barCount?: number;
  color?: string;
}

export function AudioVisualizer({
  levels,
  isActive,
  className,
  barCount = 24,
  color = "#05df72",
}: AudioVisualizerProps) {
  const displayLevels = levels.slice(0, barCount);

  return (
    <div className={cn("flex h-8 items-center justify-center gap-0.5", className)}>
      {displayLevels.map((level, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ backgroundColor: isActive ? color : "var(--text-muted)" }}
          initial={{ height: 4 }}
          animate={{
            height: isActive ? Math.max(4, level * 32) : 4,
            opacity: isActive ? 0.5 + level * 0.5 : 0.3,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />
      ))}
    </div>
  );
}

interface VoiceRecordButtonProps {
  isRecording: boolean;
  isProcessing?: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function VoiceRecordButton({
  isRecording,
  isProcessing,
  onClick,
  disabled,
  size = "md",
}: VoiceRecordButtonProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-colors",
        sizeClasses[size],
        isRecording
          ? "bg-[#ff6467] text-white hover:bg-[#ff5457]"
          : "bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[#05df72]",
        (disabled || isProcessing) && "cursor-not-allowed opacity-50",
      )}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ rotate: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" } }}
            className="h-4 w-4 rounded-sm border-2 border-current border-t-transparent"
          />
        ) : isRecording ? (
          <motion.div
            key="stop"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <FiSquare size={iconSizes[size]} />
          </motion.div>
        ) : (
          <motion.div
            key="mic"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <FiMic size={iconSizes[size]} />
          </motion.div>
        )}
      </AnimatePresence>

      {isRecording && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#ff6467]"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </motion.button>
  );
}

interface SpeakingIndicatorProps {
  isPlaying: boolean;
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
}

export function SpeakingIndicator({
  isPlaying,
  isPaused,
  onPause,
  onResume,
  onStop,
}: SpeakingIndicatorProps) {
  if (!isPlaying && !isPaused) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-2 rounded-lg bg-[var(--bg-surface)] px-3 py-1.5"
    >
      <motion.div
        animate={{ scale: isPaused ? 1 : [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: isPaused ? 0 : Number.POSITIVE_INFINITY }}
      >
        <FiVolume2 size={14} className="text-[#05df72]" />
      </motion.div>

      <span className="text-xs text-[var(--text-muted)]">
        {isPaused ? "Paused" : "Speaking..."}
      </span>

      <div className="flex gap-1">
        {isPaused ? (
          <button
            type="button"
            onClick={onResume}
            className="rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[#05df72]"
          >
            <FiPlay size={12} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onPause}
            className="rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[#05df72]"
          >
            <FiPause size={12} />
          </button>
        )}
        <button
          type="button"
          onClick={onStop}
          className="rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[#ff6467]"
        >
          <FiSquare size={12} />
        </button>
      </div>
    </motion.div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

interface AIVoiceInputProps {
  isRecording: boolean;
  isProcessing?: boolean;
  duration: number;
  audioLevels: number[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
  className?: string;
}

export function AIVoiceInput({
  isRecording,
  isProcessing,
  duration,
  audioLevels,
  onStartRecording,
  onStopRecording,
  disabled,
  className,
}: AIVoiceInputProps) {
  const handleClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <VoiceRecordButton
        isRecording={isRecording}
        isProcessing={isProcessing}
        onClick={handleClick}
        disabled={disabled}
        size="lg"
      />

      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-mono text-sm text-[#ff6467]">
              {formatDuration(duration)}
            </span>

            <AudioVisualizer
              levels={audioLevels}
              isActive={isRecording}
              barCount={32}
              color="#ff6467"
            />

            <span className="text-xs text-[var(--text-muted)]">
              Recording... Click to stop
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isRecording && !isProcessing && (
        <span className="text-xs text-[var(--text-muted)]">
          Click to speak
        </span>
      )}

      {isProcessing && (
        <span className="text-xs text-[var(--text-muted)]">
          Processing audio...
        </span>
      )}
    </div>
  );
}

export default AIVoiceInput;
