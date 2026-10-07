import type { ComponentType, Ref } from 'react';
import type { Language } from '../language/savedLanguage';
import { DeveloperGoneAnimation } from './problemAnimations/DeveloperGoneAnimation';
import { DisconnectedToolsAnimation } from './problemAnimations/DisconnectedToolsAnimation';
import { ManualDataEntryAnimation } from './problemAnimations/ManualDataEntryAnimation';
import { MissedDeadlineAnimation } from './problemAnimations/MissedDeadlineAnimation';
import { NoTechPartnerAnimation } from './problemAnimations/NoTechPartnerAnimation';
import type { ProblemAnimationProps } from './problemAnimations/problemAnimation';
import { SlowSiteAnimation } from './problemAnimations/SlowSiteAnimation';
import { StuckOnLocalhostAnimation } from './problemAnimations/StuckOnLocalhostAnimation';
import { UntrustedAiCodeAnimation } from './problemAnimations/UntrustedAiCodeAnimation';

const problemAnimations: { name: string; Animation: ComponentType<ProblemAnimationProps> }[] = [
  { name: 'stuckOnLocalhost', Animation: StuckOnLocalhostAnimation },
  { name: 'developerGone', Animation: DeveloperGoneAnimation },
  { name: 'untrustedAiCode', Animation: UntrustedAiCodeAnimation },
  { name: 'missedDeadline', Animation: MissedDeadlineAnimation },
  { name: 'slowSite', Animation: SlowSiteAnimation },
  { name: 'disconnectedTools', Animation: DisconnectedToolsAnimation },
  { name: 'noTechPartner', Animation: NoTechPartnerAnimation },
  { name: 'manualDataEntry', Animation: ManualDataEntryAnimation },
];

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
    {problemAnimations.map(({ name, Animation }, problem) => (
      <Animation key={name} isActive={problem === activeProblem} language={language} />
    ))}
  </div>
);
