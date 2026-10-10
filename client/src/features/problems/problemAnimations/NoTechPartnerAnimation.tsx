import './noTechPartnerAnimation.css';
import { type ProblemAnimationProps, problemAnimationClassName } from './problemAnimation';
import { problemAnimationsText } from './problemAnimations.text';

const dealOptions = [
  { name: 'paidProject', fixDelay: '.9s' },
  { name: 'equityPartner', fixDelay: '1.25s' },
  { name: 'creativeMix', fixDelay: '1.6s' },
] as const;

export const NoTechPartnerAnimation = ({ isActive, language }: ProblemAnimationProps) => {
  const text = problemAnimationsText[language].noTechPartner;
  return (
    <div className={problemAnimationClassName('no-tech-partner-animation', isActive)}>
      <div className="idea-sketch problem-state">
        <svg viewBox="0 0 120 80" aria-hidden="true">
          <path
            d="M12 60c10-24 22-30 30-14s20 10 26-6 18-22 28-4"
            fill="none"
            stroke="#1A1F27"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect
            x="14"
            y="14"
            width="30"
            height="18"
            rx="3"
            fill="none"
            stroke="#9AA3AF"
            strokeWidth="1.6"
            strokeDasharray="3 3"
          />
          <circle cx="96" cy="20" r="8" fill="#FFF4D6" stroke="#F59E0B" strokeWidth="1.6" />
        </svg>
        <span>{text.idea}</span>
      </div>
      <div className="cofounder-post problem-state">
        <b>{text.postTitle}</b>
        <span>{text.postAge}</span>
        <span className="is-bad">{text.replies}</span>
      </div>
      <div className="partner-pair fix-state">
        <span className="partner-avatar is-visitor">{text.visitor}</span>
        <span className="partner-plus">+</span>
        <span className="partner-avatar is-joseph">{text.joseph}</span>
      </div>
      <div className="deal-options">
        {dealOptions.map((option) => (
          <span key={option.name} className="fix-state" style={{ '--fix-delay': option.fixDelay }}>
            {text[option.name]}
          </span>
        ))}
      </div>
    </div>
  );
};
