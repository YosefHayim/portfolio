import { Menu, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { VersionPills } from '@/Components/VersionPills';
import { AI_CHAT_STATE_EVENT, openAiChat } from '@/data/chat';
import { brand, navLinks } from '@/data/content';
import { cn } from '@/lib/utils';

export const BottomChrome = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onChatState = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      const open = Boolean(detail?.open);
      setChatOpen(open);
      if (open) {
        setMenuOpen(false);
      }
    };

    window.addEventListener(AI_CHAT_STATE_EVENT, onChatState);
    return () => window.removeEventListener(AI_CHAT_STATE_EVENT, onChatState);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // While AI sheet is open, hide chrome entirely — one modal stack at a time.
  if (chatOpen) {
    return null;
  }

  const dockBottom = 'bottom-[max(1rem,env(safe-area-inset-bottom))]';
  const sheetBottom = 'bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))]';

  return (
    <>
      {menuOpen ? (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 cursor-default border-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          type="button"
        />
      ) : null}

      {/* Mobile nav sheet — sits cleanly above the dock, never under the AI pill */}
      <div
        aria-hidden={!menuOpen}
        className={cn(
          'fixed inset-x-3 z-50 mx-auto max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/96 shadow-2xl backdrop-blur-xl transition duration-300 sm:inset-x-4',
          sheetBottom,
          menuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
              {brand.short}
            </p>
            <p className="truncate text-sm text-zinc-300">{brand.name}</p>
          </div>
          <VersionPills />
        </div>
        <nav aria-label="Site" className="flex max-h-[min(60svh,28rem)] flex-col overflow-y-auto p-2">
          {navLinks.map((link) => (
            <a
              className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/5 hover:text-white"
              href={link.href}
              key={link.id}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            className="btn-solid mt-1 w-full rounded-xl px-4 py-3 text-center text-sm"
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            Start a project
          </a>
        </nav>
      </div>

      {/* Single bottom dock: Ask AI + Menu — only mobile AI entry point */}
      <div
        className={cn(
          'pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4',
          dockBottom,
        )}
      >
        <div className="pointer-events-auto flex items-center gap-0.5 rounded-2xl border border-white/10 bg-zinc-950/90 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <button
            aria-label="Ask AI about Joseph"
            className="inline-flex size-11 items-center justify-center rounded-xl text-mint transition hover:bg-mint/10"
            onClick={() => {
              setMenuOpen(false);
              openAiChat();
            }}
            type="button"
          >
            <Sparkles size={18} strokeWidth={1.6} />
          </button>
          <div className="h-6 w-px bg-white/10" />
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={cn(
              'inline-flex size-11 items-center justify-center rounded-xl transition',
              menuOpen
                ? 'bg-white/10 text-white'
                : 'text-zinc-200 hover:bg-white/10 hover:text-white',
            )}
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          >
            {menuOpen ? <X size={18} strokeWidth={1.6} /> : <Menu size={18} strokeWidth={1.6} />}
          </button>
        </div>
      </div>
    </>
  );
};
