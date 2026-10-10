import { lazy, type Ref, Suspense } from 'react';
import type { Language } from '../language/savedLanguage';

const loadAnimations = async () => {
  const animationModule = await import('./ProblemAnimations');
  return { default: animationModule.ProblemAnimations };
};

const ProblemAnimations = lazy(loadAnimations);

interface ProblemAnimationPanelProps {
  ref: Ref<HTMLDivElement>;
  language: Language;
  activeProblem: number;
  isShowingFix: boolean;
  playCount: number;
  cycleSeconds: number;
}

export const ProblemAnimationPanel = ({
  ref,
  language,
  activeProblem,
  isShowingFix,
  playCount,
  cycleSeconds,
}: ProblemAnimationPanelProps) => (
  <div
    ref={ref}
    id="problem-animation-panel"
    className={isShowingFix ? 'problem-animation-panel is-showing-fix' : 'problem-animation-panel'}
    role="tabpanel"
    aria-live="polite"
  >
    <i
      key={playCount}
      className={playCount > 0 ? 'problem-progress-bar is-running' : 'problem-progress-bar'}
      style={{ '--duration': `${cycleSeconds}s` }}
      aria-hidden="true"
    />
    <Suspense fallback={null}>
      {playCount > 0 && <ProblemAnimations language={language} activeProblem={activeProblem} />}
    </Suspense>
  </div>
);
