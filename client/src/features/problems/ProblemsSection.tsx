import './problems.css';
import { useRef } from 'react';
import { useIsOnScreen } from '../../hooks/useIsOnScreen';
import type { Language } from '../language/savedLanguage';
import { ProblemAnimationPanel } from './ProblemAnimationPanel';
import { ProblemCarousel } from './ProblemCarousel';
import { problemsText } from './problems.text';
import { usePanelHeight } from './usePanelHeight';
import { useProblemRotation } from './useProblemRotation';

interface ProblemsSectionProps {
  language: Language;
  prefersReducedMotion: boolean;
  isCovered: boolean;
}

export const ProblemsSection = ({
  language,
  prefersReducedMotion,
  isCovered,
}: ProblemsSectionProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useIsOnScreen(panelRef, 0.3);
  const isVisible = isOnScreen && !isCovered;
  const panelHeight = usePanelHeight(panelRef);
  const { rotation, cycleSeconds, playProblem, finishWrap } = useProblemRotation(
    isVisible,
    prefersReducedMotion,
  );
  const text = problemsText[language];
  const fixTextProblem = rotation.fixTextProblem;

  return (
    <section className="stacking-section" id="problems" aria-labelledby="problems-heading">
      <div className="section-content">
        <div className="problems-heading reveal-on-scroll">
          <h2 id="problems-heading" className="display-heading">
            {text.heading}
            <br />
            <span className="muted-line">{text.mutedHeading}</span>
          </h2>
        </div>
        <div className="problems-layout reveal-on-scroll">
          <ProblemCarousel
            language={language}
            activeProblem={rotation.activeProblem}
            listPosition={rotation.listPosition}
            animateList={rotation.animateList}
            isWrapping={rotation.isWrapping}
            prefersReducedMotion={prefersReducedMotion}
            panelHeight={panelHeight}
            onPlay={playProblem}
            onWrapDone={finishWrap}
          />
          <div>
            <ProblemAnimationPanel
              ref={panelRef}
              language={language}
              activeProblem={rotation.activeProblem}
              isShowingFix={rotation.isShowingFix}
              playCount={rotation.playCount}
              cycleSeconds={cycleSeconds}
            />
            <div className="problem-fix">
              <p
                className="problem-fix-text"
                style={{ opacity: rotation.isFixTextVisible ? 1 : 0 }}
              >
                {fixTextProblem !== undefined && (
                  <>
                    <b className="problem-fix-label">{text.fixLabel}</b>{' '}
                    {text.problems[fixTextProblem].fix}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
