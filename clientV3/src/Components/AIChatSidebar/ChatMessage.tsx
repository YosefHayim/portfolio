import { motion } from 'framer-motion';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';
import { useLocale } from '@/i18n/localized';
import { cn } from '@/lib/utils';
import { type Message, stripEmailMarker } from '@/utils/chatUtils';

// Raw row example: "**text**" becomes a strong tag.
const BOLD_ASTERISK_PATTERN = /\*\*(.*?)\*\*/g;
// Raw row example: "__text__" becomes a strong tag.
const BOLD_UNDERSCORE_PATTERN = /__(.*?)__/g;
// Raw row example: "`code`" becomes an inline code tag.
const INLINE_CODE_PATTERN = /`([^`]+)`/g;
// Raw row example: "[Joseph](https://example.com)" becomes an external link.
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

type RelativeTimeThreshold = {
  unit: Intl.RelativeTimeFormatUnit;
  unitMs: number;
  maxUnits: number;
};

const RELATIVE_TIME_THRESHOLDS: RelativeTimeThreshold[] = [
  { unit: 'second', unitMs: SECOND_MS, maxUnits: 60 },
  { unit: 'minute', unitMs: MINUTE_MS, maxUnits: 60 },
  { unit: 'hour', unitMs: HOUR_MS, maxUnits: 24 },
  { unit: 'day', unitMs: DAY_MS, maxUnits: 30 },
  { unit: 'month', unitMs: MONTH_MS, maxUnits: 12 },
];

const renderMarkdown = (text: string): string =>
  stripEmailMarker(text)
    .replace(
      BOLD_ASTERISK_PATTERN,
      '<strong className="font-semibold text-[var(--text-primary)]">$1</strong>',
    )
    .replace(
      BOLD_UNDERSCORE_PATTERN,
      '<strong className="font-semibold text-[var(--text-primary)]">$1</strong>',
    )
    .replace(
      INLINE_CODE_PATTERN,
      '<code className="bg-[var(--bg-elevated)] p-2 p-2 rounded text-brand-secondary font-mono text-xs">$1</code>',
    )
    .replace(
      MARKDOWN_LINK_PATTERN,
      '<a href="$2" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">$1</a>',
    );

/**
 * Formats a message timestamp relative to now in the active UI language.
 *
 * @param date - Message timestamp.
 * @param language - Normalized app language.
 * @returns Localized relative time label.
 * @example
 * formatTimeAgo(new Date(), 'he')
 */
const formatTimeAgo = (date: Date, language: string): string => {
  const diffMs = date.getTime() - Date.now();
  const absoluteDiff = Math.abs(diffMs);
  const locale = language === 'he' ? 'he-IL' : 'en-US';
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  for (const threshold of RELATIVE_TIME_THRESHOLDS) {
    if (absoluteDiff < threshold.unitMs * threshold.maxUnits) {
      return formatter.format(Math.round(diffMs / threshold.unitMs), threshold.unit);
    }
  }

  return formatter.format(Math.round(diffMs / YEAR_MS), 'year');
};

type ChatMessageProps = {
  message: Message;
  isStreaming: boolean;
  isLastMessage: boolean;
};

export const ChatMessage = memo(
  ({ message, isStreaming, isLastMessage }: ChatMessageProps) => {
    const { t } = useTranslation();
    const { language } = useLocale();

    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={cn('flex flex-col', message.role === 'user' ? 'items-end' : 'items-start')}
        initial={{ opacity: 0, y: 8 }}
        key={message.id}
      >
        <div
          className={cn(
            'max-w-[85%] rounded-xl p-2 p-2 text-[13px] leading-relaxed',
            message.role === 'user'
              ? 'bg-brand text-black'
              : 'bg-[var(--bg-surface)] text-(--text-secondary)',
          )}
        >
          <div className="whitespace-pre-wrap">
            {message.isVoice && message.role === 'user' && (
              <span className="mr-1 text-black/60">🎤</span>
            )}
            {message.role === 'assistant' ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(message.content),
                }}
              />
            ) : (
              message.content
            )}
            {isStreaming && message.role === 'assistant' && isLastMessage && (
              <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-[var(--text-muted)]" />
            )}
          </div>
          {message.emailStatus && (
            <div
              className={cn(
                ' flex items-center gap-2 rounded-md p-2 p-2 text-[11px] font-medium',
                message.emailStatus === 'sending' && 'bg-brand-accent/20 text-brand-accent',
                message.emailStatus === 'sent' && 'bg-brand/20 text-brand',
                message.emailStatus === 'failed' && 'bg-brand-danger/20 text-brand-danger',
              )}
            >
              {message.emailStatus === 'sending' && (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'linear',
                    }}
                    className="h-3 w-3 rounded-full border-[1.5px] border-current border-t-transparent"
                  />
                  {t('chat.emailSending')}
                </>
              )}
              {message.emailStatus === 'sent' && (
                <>
                  <FiCheck size={12} />
                  {t('chat.emailSent')}
                </>
              )}
              {message.emailStatus === 'failed' && (
                <>
                  <FiAlertCircle size={12} />
                  {t('chat.emailFailed')}
                </>
              )}
            </div>
          )}
        </div>
        <span
          className={cn(
            ' text-[10px]',
            message.role === 'user' ? 'text-[var(--text-muted)]' : 'text-[var(--text-dim)]',
          )}
        >
          {formatTimeAgo(message.timestamp, language)}
        </span>
      </motion.div>
    );
  },
  // Custom comparison for memoization
  (prevProps, nextProps) =>
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.emailStatus === nextProps.message.emailStatus &&
    prevProps.isStreaming === nextProps.isStreaming &&
    prevProps.isLastMessage === nextProps.isLastMessage,
);

ChatMessage.displayName = 'ChatMessage';

// Typing indicator component
export const TypingIndicator = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex flex-col items-start"
      initial={{ opacity: 0 }}
    >
      <div className="flex items-center gap-2 rounded-xl bg-[var(--bg-surface)] p-2 p-2">
        <div className="flex gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand" />
        </div>
        <span className="text-xs text-[var(--text-muted)]">{t('chat.thinking')}</span>
      </div>
    </motion.div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';
