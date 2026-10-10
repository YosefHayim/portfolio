import { type RefObject, useEffect, useState } from 'react';

export const useIsOnScreen = (elementRef: RefObject<Element | null>, threshold: number) => {
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          setIsOnScreen(entry.isIntersecting);
        }),
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, threshold]);

  return isOnScreen;
};
