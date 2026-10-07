import './slowSiteAnimation.css';
import { type ProblemAnimationProps, problemAnimationClassName } from './problemAnimation';
import { problemAnimationsText } from './problemAnimations.text';

const leavingVisitors = [
  { order: 0, reason: 'visitorLeft' },
  { order: 1, reason: 'cartAbandoned' },
  { order: 2, reason: 'visitorLeft' },
] as const;

const gaugeArc = 'M20 110 A80 80 0 0 1 180 110';

export const SlowSiteAnimation = ({ isActive, language }: ProblemAnimationProps) => {
  const text = problemAnimationsText[language].slowSite;
  return (
    <div className={problemAnimationClassName('slow-site-animation', isActive)}>
      <div className="load-gauge">
        <svg viewBox="0 0 200 120" aria-hidden="true">
          <defs>
            <linearGradient id="load-gauge-gradient" x1="0" x2="1">
              <stop offset="0" stopColor="#34C759" />
              <stop offset=".55" stopColor="#FFD54A" />
              <stop offset="1" stopColor="#E5484D" />
            </linearGradient>
          </defs>
          <path className="gauge-track" d={gaugeArc} />
          <path className="gauge-arc" d={gaugeArc} />
        </svg>
        <i className="gauge-needle" />
        <div className="gauge-value">
          <span className="problem-state is-bad">8.2s</span>
          <span className="fix-state is-good">0.9s</span>
        </div>
        <div className="gauge-label">{text.loadTime}</div>
      </div>
      <div className="leaving-visitors problem-state">
        {leavingVisitors.map((visitor) => (
          <span key={visitor.order} style={{ '--order': visitor.order }}>
            {text[visitor.reason]}
          </span>
        ))}
      </div>
      <div className="staying-visitors fix-state" style={{ '--fix-delay': '.9s' }}>
        <i />
        {text.visitorsStay}
      </div>
    </div>
  );
};
