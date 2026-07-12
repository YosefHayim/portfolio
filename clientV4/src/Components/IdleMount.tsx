import { useEffect, useState, type ReactNode } from 'react';

interface IdleMountProps {
  children: ReactNode;
  /** Max wait before forcing mount even if the main thread stays busy. */
  timeoutMs?: number;
}

/**
 * Mounts children after the browser is idle (or after a timeout).
 * Use for chrome like the AI dock that must not compete with LCP.
 *
 * @param props - Children and optional timeout.
 * @returns null until idle, then children.
 * @example
 * <IdleMount><AIChatDock /></IdleMount>
 */
export const IdleMount = ({ children, timeoutMs = 2500 }: IdleMountProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) {
        setReady(true);
      }
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(enable, { timeout: timeoutMs });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(enable, Math.min(timeoutMs, 800));
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [timeoutMs]);

  if (!ready) {
    return null;
  }

  return children;
};
