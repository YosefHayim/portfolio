import type { ComponentType } from 'react';
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

interface ProblemAnimationsProps {
  language: Language;
  activeProblem: number;
}

export const ProblemAnimations = ({ language, activeProblem }: ProblemAnimationsProps) => (
  <>
    {problemAnimations.map(({ name, Animation }, problem) => (
      <Animation key={name} isActive={problem === activeProblem} language={language} />
    ))}
  </>
);
