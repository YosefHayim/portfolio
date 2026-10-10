import './missedDeadlineAnimation.css';
import { CheckIcon } from './CheckIcon';
import { type ProblemAnimationProps, problemAnimationClassName } from './problemAnimation';
import { problemAnimationsText } from './problemAnimations.text';

export const MissedDeadlineAnimation = ({ isActive, language }: ProblemAnimationProps) => {
  const text = problemAnimationsText[language].missedDeadline;
  return (
    <div className={problemAnimationClassName('missed-deadline-animation', isActive)}>
      <div className="slipping-dates problem-state">
        <span className="deadline-label">{text.launchDate}</span>
        <div className="date-list">
          {text.slippingDates.map((date, order) => (
            <span key={date} className="slipping-date" style={{ '--order': order }}>
              {date}
            </span>
          ))}
          <span className="slipping-date is-unknown" style={{ '--order': 3 }}>
            {text.unknownDate}
          </span>
        </div>
        <div className="excuse-bubble" style={{ '--order': 1 }}>
          {text.firstExcuse}
        </div>
        <div className="excuse-bubble" style={{ '--order': 2 }}>
          {text.secondExcuse}
        </div>
      </div>
      <div className="weekly-timeline fix-state">
        <span className="deadline-label">
          {text.launchDate} · <b className="is-good">{text.lockedDate}</b>
        </span>
        <div className="timeline-row">
          <i className="timeline-track">
            <i className="timeline-progress" />
          </i>
          {text.weeks.map((week) => (
            <span key={week} className="timeline-step">
              <span className="timeline-dot">
                <CheckIcon />
              </span>
              <b>{week}</b>
              <span>{text.demo}</span>
            </span>
          ))}
          <span className="timeline-step is-launch">
            <span className="timeline-dot">⚑</span>
            <b>{text.launch}</b>
            <span>{text.launchDay}</span>
          </span>
        </div>
        <p className="timeline-note">{text.weeklyNote}</p>
      </div>
    </div>
  );
};
