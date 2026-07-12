import { useEffect, useRef, useState, type ReactNode } from 'react';

interface DeferMountProps {
  children: ReactNode;
  /** Intersection root margin before mounting children. */
  rootMargin?: string;
  /** Placeholder height so layout doesn't jump before mount. */
  minHeight?: number | string;
}

/**
 * Mounts children only when the placeholder nears the viewport.
 * Keeps below-the-fold chunks and motion work off the initial critical path.
 *
 * @param props - Defer configuration and children.
 * @returns Placeholder until visible, then children.
 * @example
 * <DeferMount minHeight={480}><TechStackSection /></DeferMount>
 */
export const DeferMount = ({
  children,
  rootMargin = '240px 0px',
  minHeight = 320,
}: DeferMountProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} style={visible ? undefined : { minHeight }}>
      {visible ? children : null}
    </div>
  );
};
