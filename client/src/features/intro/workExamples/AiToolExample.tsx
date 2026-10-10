import type { WorkExampleProps } from './workExample';
import { workExamplesText } from './workExamples.text';

export const AiToolExample = ({ language }: WorkExampleProps) => {
  const text = workExamplesText[language].aiTool;
  return (
    <div className="example-chat">
      <span className="example-chat-message is-question slide-in" style={{ '--order': 0 }}>
        {text.question}
      </span>
      <span className="example-chat-message is-answer slide-in" style={{ '--order': 3 }}>
        {text.answer}
      </span>
    </div>
  );
};
