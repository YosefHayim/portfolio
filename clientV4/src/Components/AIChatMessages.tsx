import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/data/chat';
import { renderLightMarkdown } from '@/lib/lightMarkdown';
import { cn } from '@/lib/utils';

interface AIChatMessagesProps {
  messages: readonly ChatMessage[];
  isStreaming: boolean;
  isTyping: boolean;
}

export const AIChatMessages = ({ messages, isStreaming, isTyping }: AIChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="relative z-10 flex-1 space-y-3.5 overflow-y-auto px-4 py-4 sm:px-5">
      {messages.map((message, index) => {
        const isUser = message.role === 'user';
        const isLast = index === messages.length - 1;
        const showCursor = isStreaming && isLast && !isUser && message.content.length > 0;

        return (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}
            initial={{ opacity: 0, y: 8 }}
            key={message.id}
            transition={{ duration: 0.22 }}
          >
            {!isUser ? (
              <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-mint/25 bg-mint/10">
                <Sparkles className="size-3 text-mint" strokeWidth={2} />
              </span>
            ) : null}
            <div
              className={cn(
                'max-w-[86%] px-3.5 py-2.5 text-[13px] leading-relaxed',
                isUser
                  ? 'rounded-2xl rounded-br-md bg-gradient-to-br from-mint to-teal-300 text-zinc-950 shadow-[0_8px_24px_rgba(94,234,212,0.18)]'
                  : 'rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
              )}
            >
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div
                  className="[&_a]:text-mint [&_strong]:text-white"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: light markdown only, escaped first
                  dangerouslySetInnerHTML={{
                    __html: renderLightMarkdown(
                      message.content || (isStreaming && isLast ? '…' : ''),
                    ),
                  }}
                />
              )}
              {showCursor ? (
                <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-mint align-middle" />
              ) : null}
            </div>
          </motion.div>
        );
      })}

      {isTyping ? (
        <div className="flex justify-start gap-2">
          <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-mint/25 bg-mint/10">
            <Sparkles className="size-3 text-mint" strokeWidth={2} />
          </span>
          <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3">
            <span className="size-1.5 animate-bounce rounded-full bg-mint/80 [animation-delay:0ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-mint/80 [animation-delay:120ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-mint/80 [animation-delay:240ms]" />
          </div>
        </div>
      ) : null}

      <div ref={messagesEndRef} />
    </div>
  );
};
