import './stuckOnLocalhostAnimation.css';
import { type ProblemAnimationProps, problemAnimationClassName } from './problemAnimation';
import { problemAnimationsText } from './problemAnimations.text';

const notifications = [
  { name: 'proPlan', icon: '$', iconClassName: 'notification-icon', fixDelay: '.7s' },
  { name: 'teamPlan', icon: '₪', iconClassName: 'notification-icon', fixDelay: '1.5s' },
  { name: 'feedback', icon: '★', iconClassName: 'notification-icon is-feedback', fixDelay: '2.3s' },
] as const;

export const StuckOnLocalhostAnimation = ({ isActive, language }: ProblemAnimationProps) => {
  const text = problemAnimationsText[language].stuckOnLocalhost;
  return (
    <div className={problemAnimationClassName('stuck-on-localhost-animation', isActive)}>
      <div className="browser-window">
        <div className="browser-toolbar">
          <i />
          <i />
          <i />
          <span className="browser-address">
            <span className="problem-state">localhost:3000</span>
            <span className="fix-state is-good">https://yourstartup.com</span>
          </span>
        </div>
        <div className="browser-page">
          <div className="page-line is-title" style={{ width: '46%' }} />
          <div className="page-line" style={{ width: '88%' }} />
          <div className="page-line" style={{ width: '72%' }} />
          <div className="page-block" />
          <div className="page-block-row">
            <div className="page-block" />
            <div className="page-block" />
          </div>
        </div>
        <span className="status-badge is-bad problem-state">{text.problemBadge}</span>
        <span className="status-badge is-good fix-state" style={{ '--fix-delay': '.2s' }}>
          <i />
          {text.fixBadge}
        </span>
      </div>
      <div className="notification-list">
        {notifications.map((notification) => (
          <div
            key={notification.name}
            className="notification-card fix-state"
            style={{ '--fix-delay': notification.fixDelay }}
          >
            <span className={notification.iconClassName}>{notification.icon}</span>
            <span>
              <b className="notification-title">{text[notification.name].title}</b>
              <span className="notification-detail">{text[notification.name].detail}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="customer-avatars fix-state" style={{ '--fix-delay': '1s' }}>
        <i>D</i>
        <i>M</i>
        <i>R</i>
        <i>+128</i>
      </div>
    </div>
  );
};
