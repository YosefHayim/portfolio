import { ArrowUp } from 'lucide-react';
import { useCallback, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import { QUICK_ACTIONS } from '@/data/chat';

interface AIChatComposerProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isBusy: boolean;
  sendMessage: (content: string) => Promise<void> | void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}

export const AIChatComposer = ({
  inputValue,
  setInputValue,
  isBusy,
  sendMessage,
  inputRef,
}: AIChatComposerProps) => {
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      void sendMessage(inputValue);
    },
    [inputValue, sendMessage],
  );

  const handleSend = useCallback(() => {
    void sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
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
          onKeyDown={handleKeyDown}
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
  );
};
