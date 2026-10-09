const sectionGap = 8;

type CoveredSectionStyle = {
  transform: string;
  transformOrigin: string;
  coverDim: string;
};

export const stickyTop = (viewportHeight: number, sectionHeight: number) =>
  Math.min(sectionGap, viewportHeight - sectionHeight - sectionGap);

export const coveredProgress = (viewportHeight: number, nextSectionTop: number) => {
  const progress = (viewportHeight - nextSectionTop) / (viewportHeight - sectionGap);
  return Math.min(1, Math.max(0, progress));
};

export const coveredSectionStyle = (
  progress: number,
  viewportHeight: number,
  top: number,
  prefersReducedMotion: boolean,
): CoveredSectionStyle => {
  if (prefersReducedMotion) {
    return { transform: '', transformOrigin: '', coverDim: (progress * 0.25).toFixed(3) };
  }
  const scale = (1 - 0.05 * progress).toFixed(4);
  return {
    transform: progress > 0 ? `scale(${scale})` : '',
    transformOrigin: `50% ${viewportHeight / 2 - top}px`,
    coverDim: (progress * 0.3).toFixed(3),
  };
};
