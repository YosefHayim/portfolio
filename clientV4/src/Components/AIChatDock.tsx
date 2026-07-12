import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowUp,
  MessageCircle,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { OPEN_AI_CHAT_EVENT, publishAiChatState, QUICK_ACTIONS } from '@/data/chat';
import { brand } from '@/data/content';
import { usePortfolioChat } from '@/hooks/usePortfolioChat';
import { asset, cn } from '@/lib/utils';

// Raw: "**bold**" → strong; "`code`" → code; "[label](url)" → link.
const BOLD_PATTERN = /\*\*(.*?)\*\*/g;
const CODE_PATTERN = /`([^`]+)`/g;
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Light markdown → safe HTML for assistant bubbles (bold, code, links only).
 *
 * @param text - Assistant message text.
 * @returns HTML string for dangerouslySetInnerHTML.
 */
const renderLightMarkdown = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(BOLD_PATTERN, '<strong class="font-semibold text-white">$1</strong>')
    .replace(
      CODE_PATTERN,
      '<code class="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-mint">$1</code>',
    )
    .replace(
      LINK_PATTERN,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-mint underline-offset-2 hover:underline">$1</a>',
    )
    .replace(/\n/g, '<br />');

const PANEL_WIDTH = 420;

export const AIChatDock = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    inputValue,
    setInputValue,
    isStreaming,
    isTyping,
    error,
    useAI,
    isBusy,
    sendMessage,
    resetChat,
  } = usePortfolioChat();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    window.addEventListener(OPEN_AI_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_AI_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    publishAiChatState(isOpen);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 180);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = isMobile ? 'hidden' : '';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, isMobile]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      void sendMessage(inputValue);
    },
    [inputValue, sendMessage],
  );

  const handleSend = useCallback(() => {
    void sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  return (
    <>
      {/* Scrim */}
      <AnimatePresence>
        {isOpen ? (
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Close AI chat"
            className="fixed inset-0 z-[65] cursor-default border-0 bg-black/60 backdrop-blur-[2px]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="chat-scrim"
            onClick={() => setIsOpen(false)}
            type="button"
          />
        ) : null}
      </AnimatePresence>

      {/* Desktop-only floating launcher — mobile uses bottom chrome sparkles only. */}
      <AnimatePresence>
        {!isOpen && !isMobile ? (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed right-6 bottom-8 z-[60]"
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            key="chat-launcher"
          >
            <button
              aria-label="Ask AI about Joseph"
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/12 bg-zinc-950/90 px-3.5 py-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(94,234,212,0.08)] backdrop-blur-xl transition hover:border-mint/40 hover:shadow-[0_20px_60px_rgba(94,234,212,0.14)]"
              onClick={() => setIsOpen(true)}
              type="button"
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(94,234,212,0.18),transparent_55%)]" />
              <span className="relative flex size-9 items-center justify-center">
                <span className="absolute inset-0 animate-pulse rounded-full bg-mint/25 blur-md" />
                <span className="relative flex size-9 items-center justify-center rounded-full border border-mint/35 bg-gradient-to-br from-mint/30 via-mint/10 to-transparent">
                  <Sparkles className="size-3.5 text-mint" strokeWidth={1.8} />
                </span>
              </span>
              <span className="relative pr-1 text-left">
                <span className="block text-[10px] font-semibold tracking-[0.18em] text-mint uppercase">
                  {brand.short} · Ask AI
                </span>
                <span className="block text-xs text-zinc-400 transition group-hover:text-zinc-200">
                  Stack, work, hire signal
                </span>
              </span>
              <span className="relative ml-1 h-8 w-px bg-white/10" />
              <span className="relative size-2 rounded-full bg-mint shadow-[0_0_10px_rgba(94,234,212,0.8)]" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Sidebar / sheet panel */}
      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            animate={{ x: 0, y: 0, opacity: 1 }}
            aria-label="AI chat about Joseph"
            className={cn(
              'fixed z-[70] flex flex-col overflow-hidden border border-white/12 bg-zinc-950/95 shadow-[0_0_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(94,234,212,0.06)] backdrop-blur-2xl',
              isMobile
                ? 'inset-x-0 bottom-0 h-[min(92svh,720px)] rounded-t-3xl pb-[env(safe-area-inset-bottom)]'
                : 'top-0 right-0 h-full rounded-none border-y-0 border-r-0',
            )}
            exit={
              isMobile
                ? { y: '100%', opacity: 0.6 }
                : { x: PANEL_WIDTH + 24, opacity: 0.6 }
            }
            initial={isMobile ? { y: '100%', opacity: 0.6 } : { x: PANEL_WIDTH, opacity: 0.6 }}
            key="chat-panel"
            ref={panelRef}
            style={isMobile ? undefined : { width: PANEL_WIDTH }}
            transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.85 }}
          >
            {/* Mobile drag affordance */}
            {isMobile ? (
              <div className="relative z-10 flex justify-center pt-2.5 pb-0.5">
                <span className="h-1 w-10 rounded-full bg-white/20" />
              </div>
            ) : null}
            {/* Ambient mint wash */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(94,234,212,0.12),transparent_50%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />

            {/* Film crop marks */}
            <span className="pointer-events-none absolute top-3 left-3 z-10 size-2 border border-white/35" />
            <span className="pointer-events-none absolute top-3 right-3 z-10 size-2 border border-white/35" />
            <span className="pointer-events-none absolute bottom-3 left-3 z-10 size-2 border border-white/35" />
            <span className="pointer-events-none absolute right-3 bottom-3 z-10 size-2 border border-white/35" />

            {/* Header */}
            <header className="relative z-10 flex items-center gap-3 border-b border-white/10 px-4 py-3.5 sm:px-5">
              <div className="relative shrink-0">
                <img
                  alt=""
                  aria-hidden="true"
                  className="size-11 rounded-full border border-mint/30 object-cover shadow-[0_0_24px_rgba(94,234,212,0.2)]"
                  decoding="async"
                  height={44}
                  src={asset('images-of-me/linkedin-profile.webp')}
                  width={44}
                />
                <span
                  className={cn(
                    'absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2 ring-zinc-950',
                    useAI
                      ? 'bg-mint shadow-[0_0_8px_rgba(94,234,212,0.9)]'
                      : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]',
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold tracking-tight text-white">
                    Ask about Joseph
                  </p>
                  <span className="hidden rounded-full border border-mint/25 bg-mint/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.12em] text-mint uppercase sm:inline">
                    {brand.short}
                  </span>
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-zinc-500 uppercase">
                  <MessageCircle className="size-3 text-zinc-600" strokeWidth={1.8} />
                  {useAI ? 'Live concierge' : 'Offline · local answers'}
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  aria-label="Reset conversation"
                  className="inline-flex size-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
                  onClick={resetChat}
                  type="button"
                >
                  <RotateCcw className="size-3.5" strokeWidth={1.8} />
                </button>
                <button
                  aria-label="Close chat"
                  className="inline-flex size-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  <X className="size-4" strokeWidth={1.8} />
                </button>
              </div>
            </header>

            {error ? (
              <div className="relative z-10 flex items-center gap-2 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-[11px] text-amber-100">
                <AlertCircle className="size-3.5 shrink-0" />
                {error}
              </div>
            ) : null}

            {/* Messages */}
            <div className="relative z-10 flex-1 space-y-3.5 overflow-y-auto px-4 py-4 sm:px-5">
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                const isLast = index === messages.length - 1;
                const showCursor =
                  isStreaming && isLast && !isUser && message.content.length > 0;

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

            {/* Composer */}
            <div className="relative z-10 border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent p-3 sm:p-4">
              <div className="mb-3 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-zinc-400 uppercase transition hover:border-mint/35 hover:bg-mint/10 hover:text-mint disabled:opacity-40"
                    disabled={isBusy}
                    key={action.id}
                    onClick={() => void sendMessage(action.prompt)}
                    type="button"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <form
                className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition focus-within:border-mint/45 focus-within:shadow-[0_0_0_1px_rgba(94,234,212,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]"
                onSubmit={handleSubmit}
              >
                <textarea
                  className="max-h-28 min-h-[48px] w-full resize-none bg-transparent px-3.5 pt-3 pr-14 pb-3 text-sm text-white outline-none placeholder:text-zinc-600"
                  disabled={isBusy}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about stack, projects, hire fit…"
                  ref={inputRef}
                  rows={1}
                  value={inputValue}
                />
                <button
                  aria-label="Send message"
                  className="absolute right-2 bottom-2 inline-flex size-9 items-center justify-center rounded-xl bg-mint text-zinc-950 shadow-[0_0_20px_rgba(94,234,212,0.25)] transition hover:bg-mint/90 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
                  disabled={isBusy || !inputValue.trim()}
                  type="submit"
                >
                  <ArrowUp className="size-4" strokeWidth={2.2} />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] tracking-[0.08em] text-zinc-600">
                Grounded in Joseph&apos;s portfolio · not legal or career advice
              </p>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
};
