import { useSyncExternalStore } from 'react';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const prefersReducedMotionNow = () => window.matchMedia(reducedMotionQuery).matches;

export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, prefersReducedMotionNow, () => true);
