import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FiVolume2, FiX } from 'react-icons/fi';
import { ColorOrb } from '@/Components/ui/AIInput';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  useAI: boolean;
  autoSpeak: boolean;
  isMobile: boolean;
  onAutoSpeakToggle: () => void;
  onClose: () => void;
}

export const ChatHeader = memo(
  ({ useAI, autoSpeak, isMobile, onAutoSpeakToggle, onClose }: ChatHeaderProps) => {
    const { t } = useTranslation();
    const autoSpeakLabel = autoSpeak ? t('chat.disableAutoSpeak') : t('chat.enableAutoSpeak');

    return (
      <div className="flex items-center justify-between border-[var(--border-subtle)] border-b p-2 sm:p-2">
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
            <h3 className="font-medium text-[var(--text-primary)] text-xs sm:text-sm">
              {t('chat.askAboutJoseph')}
            </h3>
            <p className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] sm:gap-2 sm:text-xs">
              {useAI ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {t('chat.aiPowered')}
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" />
                  {t('chat.offline')}
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
                aria-label={autoSpeakLabel}
                onClick={onAutoSpeakToggle}
                className={cn(
                  'rounded-lg p-2 transition-colors sm:p-2',
                  autoSpeak
                    ? 'bg-brand/20 text-brand'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]',
                )}
              >
                <FiVolume2 size={isMobile ? 14 : 16} aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {autoSpeakLabel}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild={true}>
              <button
                type="button"
                aria-label={t('chat.closeChat')}
                className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] sm:p-2"
                onClick={onClose}
              >
                <FiX size={isMobile ? 16 : 18} aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {t('chat.closeChat')}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  },
);

ChatHeader.displayName = 'ChatHeader';
