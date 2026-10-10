import './intro.css';
import { useRef } from 'react';
import profilePhoto from '../../assets/profilePhoto.webp';
import type { Language } from '../language/savedLanguage';
import { IntroCallButton } from './IntroCallButton';
import { introText } from './intro.text';
import { PixelRippleCanvas } from './PixelRippleCanvas';
import { WorkShowcase } from './WorkShowcase';

const lightStreaks = [
  { top: '20%', animationDelay: '0s' },
  { top: '48%', animationDelay: '3.2s', animationDuration: '11s' },
  { top: '72%', animationDelay: '6.1s', animationDuration: '8s' },
  { top: '34%', animationDelay: '8.4s', animationDuration: '12s' },
];

interface IntroSectionProps {
  language: Language;
  prefersReducedMotion: boolean;
  isCovered: boolean;
}

export const IntroSection = ({ language, prefersReducedMotion, isCovered }: IntroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const text = introText[language];

  return (
    <section
      ref={sectionRef}
      className="stacking-section intro-section"
      id="intro"
      aria-label={text.sectionLabel}
    >
      <div className="light-streaks" aria-hidden="true">
        {lightStreaks.map((streak) => (
          <i key={streak.top} style={streak} />
        ))}
      </div>
      <PixelRippleCanvas
        areaRef={sectionRef}
        prefersReducedMotion={prefersReducedMotion}
        isCovered={isCovered}
      />
      <div className="section-content">
        <h1 className="display-heading intro-headline reveal-on-scroll">
          {text.greeting}{' '}
          <span className="headline-photo">
            <img
              className="headline-photo-image"
              src={profilePhoto}
              alt={text.photoAlt}
              width="320"
              height="320"
            />
          </span>
          <br />
          {text.headline}
          <br />
          <span className="muted-line">{text.mutedLine}</span>
        </h1>
        <p className="intro-summary reveal-on-scroll">{text.summary}</p>
        <div className="reveal-on-scroll" style={{ transitionDelay: '.15s' }}>
          <IntroCallButton language={language} />
        </div>
        <WorkShowcase
          language={language}
          prefersReducedMotion={prefersReducedMotion}
          isCovered={isCovered}
        />
      </div>
    </section>
  );
};
