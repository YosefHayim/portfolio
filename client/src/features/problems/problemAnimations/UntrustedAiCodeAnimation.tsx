import './untrustedAiCodeAnimation.css';
import type { ReactNode } from 'react';
import { CheckIcon } from './CheckIcon';
import { type ProblemAnimationProps, problemAnimationClassName } from './problemAnimation';
import { problemAnimationsText } from './problemAnimations.text';

type CodeIssueName = 'exposedSecret' | 'missingAuth' | 'typeError';

type CodeLine = {
  number: number;
  code: ReactNode;
  issue?: { name: CodeIssueName; fixDelay: string };
};

const indent = '  ';

const codeLines: CodeLine[] = [
  {
    number: 1,
    code: (
      <>
        <b className="code-keyword">import</b> {'{ db }'} <b className="code-keyword">from</b>{' '}
        <em>"./db"</em>
      </>
    ),
  },
  {
    number: 2,
    code: (
      <>
        <b className="code-keyword">const</b> key = <em>"sk_live_51Hx…"</em>
      </>
    ),
    issue: { name: 'exposedSecret', fixDelay: '.5s' },
  },
  {
    number: 3,
    code: (
      <>
        <b className="code-keyword">export async function</b> {'checkout(req) {'}
      </>
    ),
  },
  {
    number: 4,
    code: (
      <>
        {indent}
        <i>{'// TODO: check user is logged in'}</i>
      </>
    ),
    issue: { name: 'missingAuth', fixDelay: '.9s' },
  },
  {
    number: 5,
    code: (
      <>
        {indent}
        <b className="code-keyword">const</b> total = req.body.cart.total
      </>
    ),
  },
  {
    number: 6,
    code: (
      <>
        {indent}
        <b className="code-keyword">const</b> name = user.profile.name
      </>
    ),
    issue: { name: 'typeError', fixDelay: '1.3s' },
  },
  {
    number: 7,
    code: (
      <>
        {indent}
        <b className="code-keyword">return</b> db.charge(total)
      </>
    ),
  },
  { number: 8, code: '}' },
];

export const UntrustedAiCodeAnimation = ({ isActive, language }: ProblemAnimationProps) => {
  const text = problemAnimationsText[language].untrustedAiCode;
  return (
    <div className={problemAnimationClassName('untrusted-ai-code-animation', isActive)}>
      <div className="code-editor">
        <div className="code-editor-header">
          <i />
          <i />
          <i />
          <span>app/api/checkout.ts</span>
        </div>
        <div className="code-lines">
          {codeLines.map((line) => (
            <div key={line.number} className="code-line">
              <span className="line-number">{line.number}</span>
              <code>{line.code}</code>
              {line.issue && (
                <span className="code-issue">
                  <span className="problem-state is-bad">{text[line.issue.name].problem}</span>
                  <span
                    className="fix-state is-good"
                    style={{ '--fix-delay': line.issue.fixDelay }}
                  >
                    {text[line.issue.name].fix} <CheckIcon />
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="code-scan" />
        <div className="code-status-bar">
          <span className="state-swap">
            <span className="problem-state is-bad">{text.problemStatus}</span>
            <span className="fix-state is-good" style={{ '--fix-delay': '1.6s' }}>
              {text.fixStatus}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
