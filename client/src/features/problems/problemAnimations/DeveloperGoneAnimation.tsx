import './developerGoneAnimation.css';
import { type ProblemAnimationProps, problemAnimationClassName } from './problemAnimation';
import { problemAnimationsText } from './problemAnimations.text';

export const DeveloperGoneAnimation = ({ isActive, language }: ProblemAnimationProps) => {
  const text = problemAnimationsText[language].developerGone;
  return (
    <div className={problemAnimationClassName('developer-gone-animation', isActive)}>
      <div className="chat-window">
        <div className="chat-header">
          <span className="chat-avatar">
            <span className="problem-state">{text.problemAvatar}</span>
            <span className="fix-state">{text.fixAvatar}</span>
          </span>
          <span className="chat-contact">
            <b className="state-swap">
              <span className="problem-state">{text.developerName}</span>
              <span className="fix-state">{text.josephName}</span>
            </b>
            <span className="chat-contact-status state-swap">
              <span className="problem-state">{text.lastSeen}</span>
              <span className="fix-state is-good">{text.online}</span>
            </span>
          </span>
        </div>
        <div className="chat-messages">
          {text.sentMessages.map((message, order) => (
            <div key={message.text} className="chat-message is-sent" style={{ '--order': order }}>
              {message.text}
              <small>
                {message.day}{' '}
                <span className="read-ticks">
                  <span className="problem-state">✓</span>
                  <span className="fix-state">✓✓</span>
                </span>
              </small>
            </div>
          ))}
          <div className="chat-message is-received fix-state" style={{ '--fix-delay': '.6s' }}>
            {text.fixedReply}
            <small>09:14</small>
          </div>
          <div className="chat-message is-received fix-state" style={{ '--fix-delay': '1.5s' }}>
            {text.handoverReply}
            <small>09:15</small>
          </div>
        </div>
      </div>
    </div>
  );
};
