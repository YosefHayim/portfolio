import { type RefObject, useEffect, useState } from 'react';

type ToggleTimer = { id: number };

export const useIcebergToggle = (
  icebergRef: RefObject<HTMLElement | null>,
  prefersReducedMotion: boolean,
  isCovered: boolean,
) => {
  const [isShowingUnderwater, setIsShowingUnderwater] = useState(false);

  useEffect(() => {
    const iceberg = icebergRef.current;
    if (!iceberg || isCovered) return;
    const surfaceDuration = prefersReducedMotion ? 1200 : 3000;
    const underwaterDuration = prefersReducedMotion ? 8000 : 6400;
    const timer: ToggleTimer = { id: 0 };

    const showSurface = () => {
      setIsShowingUnderwater(false);
      timer.id = window.setTimeout(showUnderwater, surfaceDuration);
    };

    const showUnderwater = () => {
      setIsShowingUnderwater(true);
      timer.id = window.setTimeout(showSurface, underwaterDuration);
    };

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          clearTimeout(timer.id);
          if (entry.isIntersecting) showSurface();
        }),
      { threshold: 0.3 },
    );
    observer.observe(iceberg);

    return () => {
      observer.disconnect();
      clearTimeout(timer.id);
    };
  }, [icebergRef, prefersReducedMotion, isCovered]);

  return isShowingUnderwater;
};
