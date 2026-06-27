import { memo } from 'react';
import { FiVolume2, FiX } from 'react-icons/fi';
import { ColorOrb } from '@/Components/ui/ai-input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';

type ChatHeaderProps = {
  useAI: boolean;
  autoSpeak: boolean;
  isMobile: boolean;
  onAutoSpeakToggle: () => void;
  onClose: () => void;
};

export const ChatHeader = memo(
  ({ useAI, autoSpeak, isMobile, onAutoSpeakToggle, onClose }: ChatHeaderProps) => (
    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-2 p-2 sm:p-2 sm:p-2">
      <div className="flex items-center gap-2 sm:gap-2">
        <ColorOrb
          dimension={isMobile ? '24px' : '28px'}
          tones={{
            base: 'oklch(10% 0.02 145)',
            accent1: 'oklch(80% 0.25 145)',
            accent2: 'oklch(70% 0.2 195)',
            accent3: 'oklch(75% 0.18 280)',
          }}
        />
        <div>
          <h3 className="text-xs font-medium text-[var(--text-primary)] sm:text-sm">
            Ask about Joseph
          </h3>
          <p className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] sm:gap-2 sm:text-xs">
            {useAI ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-[#05df72]" />
                AI-powered
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" />
                Offline
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-2">
        <Tooltip>
          <TooltipTrigger asChild={true}>
            <button
              type="button"
              onClick={onAutoSpeakToggle}
              className={cn(
                'rounded-lg p-2 transition-colors sm:p-2',
                autoSpeak
                  ? 'bg-[#05df72]/20 text-[#05df72]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]',
              )}
            >
              <FiVolume2 size={isMobile ? 14 : 16} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            {autoSpeak ? 'Disable auto-speak' : 'Enable auto-speak for voice replies'}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild={true}>
            <button
              className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] sm:p-2"
              onClick={onClose}
              type="button"
            >
              <FiX size={isMobile ? 16 : 18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            Close chat
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
);

ChatHeader.displayName = 'ChatHeader';
