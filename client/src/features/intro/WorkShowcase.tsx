import './workShowcase.css';
import { useRef } from 'react';
import { useIsOnScreen } from '../../hooks/useIsOnScreen';
import type { Language } from '../language/savedLanguage';
import { introText } from './intro.text';
import { useWorkTypeRotation } from './useWorkTypeRotation';
import { workTypeNames } from './workTypes';
import { workTypeVisuals } from './workTypeVisuals';

interface WorkShowcaseProps {
  language: Language;
  prefersReducedMotion: boolean;
  isCovered: boolean;
}

export const WorkShowcase = ({ language, prefersReducedMotion, isCovered }: WorkShowcaseProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useIsOnScreen(panelRef, 0.3);
  const isVisible = isOnScreen && !isCovered;
  const { activeWorkType, chooseWorkType } = useWorkTypeRotation(
    isVisible && !prefersReducedMotion,
  );
  const text = introText[language];

  return (
    <figure className="work-showcase reveal-on-scroll" aria-label={text.showcaseLabel}>
      <div
        ref={panelRef}
        className={isVisible ? 'work-showcase-panel is-visible' : 'work-showcase-panel'}
      >
        <div className="work-type-buttons">
          {workTypeNames.map((workType) => (
            <button
              key={workType}
              type="button"
              className="work-type-button"
              aria-pressed={workType === activeWorkType}
              onClick={() => chooseWorkType(workType)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {workTypeVisuals[workType].iconShapes}
              </svg>
              {text.workTypes[workType].label}
            </button>
          ))}
        </div>
        <div className="work-examples" aria-hidden="true">
          {workTypeNames.map((workType) => {
            const { Example } = workTypeVisuals[workType];
            return (
              <div
                key={workType}
                className={workType === activeWorkType ? 'work-example is-active' : 'work-example'}
              >
                <Example language={language} />
              </div>
            );
          })}
        </div>
        <p key={activeWorkType} className="work-showcase-caption">
          {text.workTypes[activeWorkType].caption}
        </p>
      </div>
    </figure>
  );
};
