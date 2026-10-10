import { Effect } from 'effect';

export const copyText = (text: string, onCopied: () => void) => {
  const writeText = Effect.tryPromise(() => navigator.clipboard.writeText(text));
  const writeThenNotify = Effect.andThen(writeText, onCopied);
  const copyOrWarn = Effect.catchAll(writeThenNotify, (error) =>
    Effect.logWarning('clipboard_unavailable', error),
  );
  Effect.runFork(copyOrWarn);
};
