import { type RefObject, useEffect } from 'react';

const revealOffsets = [
  [-70, 0],
  [70, 0],
  [0, -50],
  [0, 60],
] as const;

const randomDirectionAfter = (previousDirection: number | undefined, random: () => number) => {
  if (previousDirection === undefined) return Math.floor(random() * revealOffsets.length);
  const pick = Math.floor(random() * (revealOffsets.length - 1));
  return pick >= previousDirection ? pick + 1 : pick;
};

const revealEntries = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-revealed');
    observer.unobserve(entry.target);
  });
};

export const useRevealOnScroll = (stackRef: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const observer = new IntersectionObserver(revealEntries, { threshold: 0.15 });
    const sections = stack.querySelectorAll<HTMLElement>(':scope > section');
    const directions: number[] = [];

    sections.forEach((section) => {
      const previousDirection = directions.at(-1);
      const direction = randomDirectionAfter(previousDirection, Math.random);
      directions.push(direction);
      const [offsetX, offsetY] = revealOffsets[direction];
      const revealedElements = section.querySelectorAll<HTMLElement>('.reveal-on-scroll');
      revealedElements.forEach((element, order) => {
        element.style.setProperty('--reveal-x', `${offsetX}px`);
        element.style.setProperty('--reveal-y', `${offsetY}px`);
        if (!element.style.transitionDelay) element.style.transitionDelay = `${order * 90}ms`;
        observer.observe(element);
      });
    });

    return () => observer.disconnect();
  }, [stackRef]);
};
