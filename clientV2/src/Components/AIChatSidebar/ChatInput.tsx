import { memo, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMic, FiSend, FiSquare, FiVolume2 } from "react-icons/fi";
import {
  AudioVisualizer,
  SpeakingIndicator,
} from "@/Components/ui/ai-voice-input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { cn } from "@/lib/utils";

type SpeechState = "idle" | "loading" | "playing" | "paused";

type ChatInputProps = {
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
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onVoiceRecord: () => void;
  onSpeechPause: () => void;
  onSpeechResume: () => void;
  onSpeechStop: () => void;
  onSpeakLastMessage: () => void;
};

export const ChatInput = memo(
  forwardRef<HTMLInputElement, ChatInputProps>(
    (
      {
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
      },
      ref,
    ) => {
      const isInputDisabled = isStreaming || isTyping || isTranscribing || isRecording;

      return (
        <div className="border-t border-[var(--border-subtle)] p-2 sm:p-3">
          <AnimatePresence>
            {(speechIsPlaying || speechState === "paused") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-2"
              >
                <SpeakingIndicator
                  isPlaying={speechIsPlaying}
                  isPaused={speechState === "paused"}
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
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 flex flex-col items-center gap-2 rounded-xl bg-[var(--bg-surface)] p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff6467]" />
                  <span className="font-mono text-sm text-[#ff6467]">
                    {Math.floor(recordingDuration / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {(recordingDuration % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <AudioVisualizer
                  levels={audioLevels}
                  isActive={isRecording}
                  barCount={32}
                  color="#ff6467"
                />
                <span className="text-xs text-[var(--text-muted)]">
                  Recording... Tap mic to stop
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            className="flex items-center gap-1.5 py-1 sm:gap-2 sm:py-2"
            onSubmit={onSubmit}
          >
            <div className="relative flex-1">
              <input
                type="text"
                className={cn(
                  "h-10 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] pr-4 pl-3 text-sm text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] sm:h-11 sm:pl-4",
                  "focus:border-[#05df72] focus:ring-1 focus:ring-[#05df72]/30 focus:outline-none",
                  isRecording && "opacity-50",
                )}
                disabled={isInputDisabled}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={
                  isTranscribing
                    ? "Transcribing..."
                    : isRecording
                      ? "Recording..."
                      : "Ask anything..."
                }
                ref={ref}
                value={inputValue}
              />
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  type="button"
                  onClick={onVoiceRecord}
                  disabled={isStreaming || isTyping}
                  className={cn(
                    isRecording
                      ? "bg-[#ff6467] text-white"
                      : "rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                    (isStreaming || isTyping) && "cursor-not-allowed opacity-50",
                  )}
                  whileHover={{
                    scale: isStreaming || isTyping ? 1 : 1.02,
                  }}
                  whileTap={{ scale: isStreaming || isTyping ? 1 : 0.98 }}
                >
                  {isTranscribing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="h-4 w-4 rounded-md border-2 border-current border-t-transparent"
                    />
                  ) : isRecording ? (
                    <FiSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <FiMic className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                {isTranscribing
                  ? "Processing voice..."
                  : isRecording
                    ? "Stop recording"
                    : "Record voice message"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim() || isInputDisabled}
                  className={cn(
                    "rounded-md hover:bg-[#04c566]",
                    (!inputValue.trim() || isInputDisabled) &&
                      "cursor-not-allowed opacity-50",
                  )}
                  whileHover={{
                    scale: !inputValue.trim() || isInputDisabled ? 1 : 1.02,
                  }}
                  whileTap={{
                    scale: !inputValue.trim() || isInputDisabled ? 1 : 0.98,
                  }}
                >
                  <FiSend size={isMobile ? 16 : 18} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                Send message
              </TooltipContent>
            </Tooltip>
          </form>

          {hasMessages && !isRecording && !speechIsPlaying && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onSpeakLastMessage}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg py-1 text-[11px] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[#05df72] sm:mt-2 sm:py-1.5 sm:text-xs"
                >
                  <FiVolume2 size={12} />
                  Play last response
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                Listen to the AI's last reply
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
  ),
);

ChatInput.displayName = "ChatInput";
