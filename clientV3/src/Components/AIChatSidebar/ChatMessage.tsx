import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { type Message, stripEmailMarker } from '@/utils/chatUtils';

// Simple markdown renderer for assistant messages
function renderMarkdown(text: string): string {
  return (
    stripEmailMarker(text)
      // Bold: **text** or __text__
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong className="font-semibold text-[var(--text-primary)]">$1</strong>',
      )
      .replace(
        /__(.*?)__/g,
        '<strong className="font-semibold text-[var(--text-primary)]">$1</strong>',
      )
      // Inline code: `code`
      .replace(
        /`([^`]+)`/g,
        '<code className="bg-[var(--bg-elevated)] p-2 p-2 rounded text-[#00d9ff] font-mono text-xs">$1</code>',
      )
      // Links: [text](url)
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" className="text-[#05df72] hover:underline">$1</a>',
      )
  );
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

type ChatMessageProps = {
  message: Message;
  isStreaming: boolean;
  isLastMessage: boolean;
};

export const ChatMessage = memo(
  ({ message, isStreaming, isLastMessage }: ChatMessageProps) => (
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
            ? 'bg-[#05df72] text-black'
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
              message.emailStatus === 'sending' && 'bg-[#fdc700]/20 text-[#fdc700]',
              message.emailStatus === 'sent' && 'bg-[#05df72]/20 text-[#05df72]',
              message.emailStatus === 'failed' && 'bg-[#ff6467]/20 text-[#ff6467]',
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
                Sending email...
              </>
            )}
            {message.emailStatus === 'sent' && (
              <>
                <FiCheck size={12} />
                Email sent successfully
              </>
            )}
            {message.emailStatus === 'failed' && (
              <>
                <FiAlertCircle size={12} />
                Failed to send email
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
        {formatTimeAgo(message.timestamp)}
      </span>
    </motion.div>
  ),
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
export const TypingIndicator = memo(() => (
  <motion.div
    animate={{ opacity: 1 }}
    className="flex flex-col items-start"
    initial={{ opacity: 0 }}
  >
    <div className="flex items-center gap-2 rounded-xl bg-[var(--bg-surface)] p-2 p-2">
      <div className="flex gap-2">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#05df72] [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#05df72] [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#05df72]" />
      </div>
      <span className="text-xs text-[var(--text-muted)]">AI is thinking...</span>
    </div>
  </motion.div>
));

TypingIndicator.displayName = 'TypingIndicator';
