import { type RefObject, useEffect, useState } from 'react';
import { coveredProgress, coveredSectionStyle, stickyTop } from './coveredSectionStyle';

type StackPlacement = {
  tops: number[];
  frame: number;
};

export const useStackOnScroll = (
  stackRef: RefObject<HTMLElement | null>,
  prefersReducedMotion: boolean,
) => {
  const [coveredSectionCount, setCoveredSectionCount] = useState(0);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const sections = Array.from(stack.querySelectorAll<HTMLElement>(':scope > section'));
    const placement: StackPlacement = { tops: [], frame: 0 };

    const pinSections = () => {
      const viewportHeight = window.innerHeight;
      placement.tops = sections.map((section) => stickyTop(viewportHeight, section.offsetHeight));
      sections.forEach((section, index) => {
        if (!section.classList.contains('stacking-section')) return;
        section.style.top = `${placement.tops[index]}px`;
      });
    };

    const coverSections = () => {
      const viewportHeight = window.innerHeight;
      const coveredSections: HTMLElement[] = [];
      sections.forEach((section, index) => {
        const nextSection = sections[index + 1];
        if (!nextSection || !section.classList.contains('stacking-section')) return;
        const nextSectionTop = nextSection.getBoundingClientRect().top;
        const progress = coveredProgress(viewportHeight, nextSectionTop);
        const top = placement.tops[index];
        const style = coveredSectionStyle(progress, viewportHeight, top, prefersReducedMotion);
        section.style.transform = style.transform;
        section.style.transformOrigin = style.transformOrigin;
        section.style.setProperty('--cover-dim', style.coverDim);
        if (progress === 1) coveredSections.push(section);
      });
      setCoveredSectionCount(coveredSections.length);
    };

    const placeSections = () => {
      pinSections();
      coverSections();
    };

    const coverOnNextFrame = () => {
      if (placement.frame) return;
      placement.frame = requestAnimationFrame(() => {
        placement.frame = 0;
        coverSections();
      });
    };

    const resizeObserver = new ResizeObserver(placeSections);
    sections.forEach((section) => {
      resizeObserver.observe(section);
    });
    window.addEventListener('resize', placeSections);
    window.addEventListener('scroll', coverOnNextFrame, { passive: true });
    placeSections();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', placeSections);
      window.removeEventListener('scroll', coverOnNextFrame);
      cancelAnimationFrame(placement.frame);
    };
  }, [stackRef, prefersReducedMotion]);

  return coveredSectionCount;
};
