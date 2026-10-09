import './contact.css';
import type { Language } from '../language/savedLanguage';
import { whatsappLink } from '../whatsapp/whatsappLink';
import { CopiedNotice } from './CopiedNotice';
import { contactText } from './contact.text';
import { SocialLinks } from './SocialLinks';
import { StarrySkyCanvas } from './StarrySkyCanvas';
import { useCopiedNotice } from './useCopiedNotice';

const sunsetClouds = [
  {
    width: '60%',
    height: '28%',
    left: '-10%',
    bottom: '8%',
    background: '#FF8A4C',
    animationDuration: '28s',
    animationDelay: '-8s',
  },
  {
    width: '50%',
    height: '22%',
    right: '-8%',
    bottom: '20%',
    background: '#F35E62',
    animationDuration: '34s',
    animationDelay: '-14s',
  },
  {
    width: '70%',
    height: '20%',
    left: '20%',
    bottom: '-6%',
    background: '#FFC074',
    animationDuration: '25s',
    animationDelay: '-4s',
  },
  { width: '40%', height: '18%', left: '30%', top: '38%', background: '#7B2D8A', opacity: 0.55 },
];

interface ContactSectionProps {
  language: Language;
  prefersReducedMotion: boolean;
}

export const ContactSection = ({ language, prefersReducedMotion }: ContactSectionProps) => {
  const text = contactText[language];
  const { copiedCount, isNoticeVisible, showNotice } = useCopiedNotice();
  const [firstHeadingLine, secondHeadingLine] = text.headingLines;

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="moving-sky" aria-hidden="true" />
      {sunsetClouds.map((cloud) => (
        <div key={cloud.background} className="sunset-cloud" style={cloud} />
      ))}
      <StarrySkyCanvas prefersReducedMotion={prefersReducedMotion} />
      <div className="contact-content">
        <h2 id="contact-heading" className="display-heading contact-heading reveal-on-scroll">
          {firstHeadingLine}
          <br />
          {secondHeadingLine}
          <br />
          <span className="contact-muted-line">{text.mutedLine}</span>
        </h2>
        <div className="contact-actions reveal-on-scroll" style={{ transitionDelay: '.1s' }}>
          <a
            className="contact-call-button"
            href={whatsappLink(language)}
            target="_blank"
            rel="noopener"
          >
            {text.callLabel}
          </a>
        </div>
      </div>
      <footer className="site-footer">
        <SocialLinks language={language} onHandleCopied={showNotice} />
      </footer>
      <CopiedNotice
        copiedCount={copiedCount}
        isVisible={isNoticeVisible}
        message={text.copiedNotice}
      />
    </section>
  );
};
