import { MiniBrowser } from './MiniBrowser';
import type { WorkExampleProps } from './workExample';
import { workExamplesText } from './workExamples.text';

const queueIcon = (
  <span className="mini-extension-badge">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 8h12M6 12h12M6 16h7" />
    </svg>
  </span>
);

export const ExtensionExample = ({ language }: WorkExampleProps) => {
  const text = workExamplesText[language].extension;
  return (
    <MiniBrowser address={text.address} toolbarIcon={queueIcon}>
      <div className="extension-popup">
        <span className="extension-popup-title">{text.promptQueue}</span>
        <span className="queue-progress">
          <i />
        </span>
        <span className="example-tag is-done">{text.runningAlone}</span>
      </div>
    </MiniBrowser>
  );
};
