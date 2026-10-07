import './features/scrollEffects/scrollEffects.css';
import { useRef } from 'react';
import { AboutSection } from './features/about/AboutSection';
import { ContactSection } from './features/contact/ContactSection';
import { IntroSection } from './features/intro/IntroSection';
import { useLanguage } from './features/language/useLanguage';
import { ProblemsSection } from './features/problems/ProblemsSection';
import { useRevealOnScroll } from './features/scrollEffects/useRevealOnScroll';
import { useStackOnScroll } from './features/scrollEffects/useStackOnScroll';
import { TopBar } from './features/topBar/TopBar';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { pageTitleText } from './pageTitle.text';

export const App = () => {
  const { language, toggleLanguage } = useLanguage();
  const prefersReducedMotion = usePrefersReducedMotion();
  const stackRef = useRef<HTMLElement>(null);
  const coveredSectionCount = useStackOnScroll(stackRef, prefersReducedMotion);
  useRevealOnScroll(stackRef);

  return (
    <>
      <title>{pageTitleText[language].title}</title>
      <TopBar language={language} onToggleLanguage={toggleLanguage} />
      <main ref={stackRef} className="section-stack">
        <IntroSection
          language={language}
          prefersReducedMotion={prefersReducedMotion}
          isCovered={coveredSectionCount >= 1}
        />
        <ProblemsSection
          language={language}
          prefersReducedMotion={prefersReducedMotion}
          isCovered={coveredSectionCount >= 2}
        />
        <AboutSection
          language={language}
          prefersReducedMotion={prefersReducedMotion}
          isCovered={coveredSectionCount >= 3}
        />
        <ContactSection language={language} prefersReducedMotion={prefersReducedMotion} />
      </main>
    </>
  );
};
