import type { WorkExampleProps } from './workExample';
import { workExamplesText } from './workExamples.text';

const bodyJoints = [
  { x: 20, y: 26 },
  { x: 40, y: 26 },
  { x: 24, y: 56 },
  { x: 36, y: 56 },
  { x: 23, y: 74 },
  { x: 37, y: 74 },
  { x: 22, y: 92 },
  { x: 38, y: 92 },
];

export const AppExample = ({ language }: WorkExampleProps) => {
  const text = workExamplesText[language].app;
  return (
    <div className="mini-phone">
      <span className="camera-frame" />
      <svg className="pose-skeleton" viewBox="0 0 60 100" aria-hidden="true">
        <path
          className="pose-bone"
          d="M30 22v32M20 26h20M24 56h12M24 56l-1 18-1 18M36 56l1 18 1 18M30 54l-6 2M30 54l6 2"
        />
        <g className="pose-arm is-left">
          <path className="pose-bone" d="m20 26-6 14-2 14" />
          <circle className="pose-joint" cx="14" cy="40" r="2.6" />
          <circle className="pose-joint" cx="12" cy="54" r="2.6" />
        </g>
        <g className="pose-arm is-right">
          <path className="pose-bone" d="m40 26 6 14 2 14" />
          <circle className="pose-joint" cx="46" cy="40" r="2.6" />
          <circle className="pose-joint" cx="48" cy="54" r="2.6" />
        </g>
        <circle className="pose-bone" cx="30" cy="12" r="7" />
        {bodyJoints.map((joint) => (
          <circle
            key={`${joint.x} ${joint.y}`}
            className="pose-joint"
            cx={joint.x}
            cy={joint.y}
            r="2.6"
          />
        ))}
      </svg>
      <span className="example-tag is-done">{text.onDeviceAi}</span>
    </div>
  );
};
