import './disconnectedToolsAnimation.css';
import { type ProblemAnimationProps, problemAnimationClassName } from './problemAnimation';
import { problemAnimationsText } from './problemAnimations.text';

const hubCenter = { x: 50, y: 35.75 };

const toolLinkEnds = [
  { x: 50, y: 20.75 },
  { x: 71, y: 31.15 },
  { x: 63, y: 47.75 },
  { x: 37, y: 47.75 },
  { x: 29, y: 31.15 },
];

const toolTiles = [
  { name: 'crm', icon: 'C', x: -34, y: -16, linkedX: 0, linkedY: -15, tilt: -4, color: '#1E86FF' },
  {
    name: 'sheets',
    icon: 'S',
    x: 24,
    y: -21,
    linkedX: 21,
    linkedY: -4.6,
    tilt: 5,
    color: '#1F9D55',
  },
  { name: 'email', icon: 'E', x: -20, y: 15, linkedX: 13, linkedY: 12, tilt: -6, color: '#E5484D' },
  { name: 'shop', icon: 'S', x: 30, y: 12, linkedX: -13, linkedY: 12, tilt: 7, color: '#9B7BFF' },
  {
    name: 'invoices',
    icon: 'I',
    x: -6,
    y: -3,
    linkedX: -21,
    linkedY: -4.6,
    tilt: -8,
    color: '#F59E0B',
  },
] as const;

export const DisconnectedToolsAnimation = ({ isActive, language }: ProblemAnimationProps) => {
  const text = problemAnimationsText[language].disconnectedTools;
  return (
    <div className={problemAnimationClassName('disconnected-tools-animation', isActive)}>
      <svg
        className="tool-links"
        viewBox="0 0 100 68.75"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {toolLinkEnds.map((end) => (
          <line key={`${end.x}-${end.y}`} x1={hubCenter.x} y1={hubCenter.y} x2={end.x} y2={end.y} />
        ))}
      </svg>
      <div className="automation-hub fix-state" style={{ '--fix-delay': '.2s' }}>
        <i />
        <span>{text.hub}</span>
      </div>
      {toolTiles.map((tile) => (
        <div
          key={tile.name}
          className="tool-tile"
          style={{
            '--tile-x': `${tile.x}cqw`,
            '--tile-y': `${tile.y}cqw`,
            '--linked-x': `${tile.linkedX}cqw`,
            '--linked-y': `${tile.linkedY}cqw`,
            '--tile-tilt': `${tile.tilt}deg`,
            '--tile-color': tile.color,
          }}
        >
          <span className="tool-tile-icon">{tile.icon}</span>
          <b>{text[tile.name]}</b>
          <span className="tool-tile-error problem-state">✕</span>
        </div>
      ))}
      <p className="tools-caption">
        <span className="problem-state is-bad">{text.problemCaption}</span>
        <span className="fix-state is-good" style={{ '--fix-delay': '1s' }}>
          {text.fixCaption}
        </span>
      </p>
    </div>
  );
};
