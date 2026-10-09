import { type KeyboardEvent, useLayoutEffect, useRef } from 'react';
import type { Language } from '../language/savedLanguage';
import { problemCount } from './problemRotation';
import { problemsText } from './problems.text';

const carouselTabs = Array.from({ length: problemCount * 3 }, (_, position) => ({
  position,
  problem: position % problemCount,
  isMiddleCopy: position >= problemCount && position < problemCount * 2,
}));

const arrowSteps = new Map([
  ['ArrowDown', 1],
  ['ArrowRight', 1],
  ['ArrowUp', problemCount - 1],
  ['ArrowLeft', problemCount - 1],
]);

const listTransition = 'transform .95s cubic-bezier(.22,1,.36,1)';
const narrowScreen = '(max-width: 900px)';

const forceStyleFlush = (element: HTMLElement) => element.getBoundingClientRect();

interface ProblemCarouselProps {
  language: Language;
  activeProblem: number;
  listPosition: number;
  animateList: boolean;
  isWrapping: boolean;
  prefersReducedMotion: boolean;
  panelHeight: number;
  onPlay: (problem: number) => void;
  onWrapDone: () => void;
}

export const ProblemCarousel = ({
  language,
  activeProblem,
  listPosition,
  animateList,
  isWrapping,
  prefersReducedMotion,
  panelHeight,
  onPlay,
  onWrapDone,
}: ProblemCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const text = problemsText[language];

  useLayoutEffect(() => {
    const carousel = carouselRef.current;
    const list = listRef.current;
    if (!carousel || !list) return;
    const tabs = list.querySelectorAll<HTMLElement>('[role="tab"]');

    const placeList = (shouldAnimate: boolean) => {
      const isNarrow = window.matchMedia(narrowScreen).matches;
      const usesPanelHeight = !isNarrow && panelHeight > 0;
      carousel.style.height = usesPanelHeight ? `${panelHeight}px` : '';
      const spacing = tabs[1].offsetTop - tabs[0].offsetTop;
      const offset = (carousel.clientHeight - tabs[0].offsetHeight) / 2;
      list.style.transition = shouldAnimate && !prefersReducedMotion ? listTransition : 'none';
      list.style.transform = `translateY(${offset - listPosition * spacing}px)`;
    };

    const placeListAfterResize = () => placeList(false);

    placeList(animateList);
    window.addEventListener('resize', placeListAfterResize);
    return () => window.removeEventListener('resize', placeListAfterResize);
  }, [listPosition, animateList, prefersReducedMotion, panelHeight]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!isWrapping || !list) return;
    forceStyleFlush(list);
    onWrapDone();
  }, [isWrapping, onWrapDone]);

  const moveWithArrows = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = arrowSteps.get(event.key);
    const list = listRef.current;
    if (step === undefined || !list) return;
    event.preventDefault();
    const nextProblem = (activeProblem + step) % problemCount;
    onPlay(nextProblem);
    const tabs = list.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs[problemCount + nextProblem].focus({ preventScroll: true });
  };

  return (
    <div
      ref={carouselRef}
      className={isWrapping ? 'problem-carousel is-wrapping' : 'problem-carousel'}
    >
      <div
        ref={listRef}
        className="problem-list"
        role="tablist"
        aria-label={text.tablistLabel}
        onKeyDown={moveWithArrows}
      >
        {carouselTabs.map((tab) => {
          const problem = text.problems[tab.problem];
          return (
            <button
              key={tab.position}
              type="button"
              role="tab"
              className={tab.position === listPosition ? 'problem-tab is-active' : 'problem-tab'}
              aria-controls="problem-animation-panel"
              aria-selected={tab.position === problemCount + activeProblem}
              aria-hidden={tab.isMiddleCopy ? undefined : true}
              tabIndex={tab.isMiddleCopy ? undefined : -1}
              onClick={() => onPlay(tab.problem)}
            >
              <span>
                <b className="problem-tab-title">{problem.title}</b>
                <span className="problem-tab-subtitle">{problem.subtitle}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
