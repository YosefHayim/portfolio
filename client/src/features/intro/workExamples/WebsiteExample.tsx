import { MiniBrowser } from './MiniBrowser';
import type { WorkExampleProps } from './workExample';
import { workExamplesText } from './workExamples.text';

const donationRows = [
  { nameWidth: '38%', amountWidth: '22%', status: 'received' },
  { nameWidth: '46%', amountWidth: '18%', status: 'received' },
  { nameWidth: '30%', amountWidth: '24%', status: 'monthlyReport' },
] as const;

export const WebsiteExample = ({ language }: WorkExampleProps) => {
  const text = workExamplesText[language].website;
  return (
    <MiniBrowser address={text.address}>
      <div className="mini-browser-body">
        {donationRows.map((donation, order) => (
          <div
            key={donation.nameWidth}
            className="example-row slide-in"
            style={{ '--order': order }}
          >
            <span className="example-bar" style={{ width: donation.nameWidth }} />
            <span className="example-bar is-at-end" style={{ width: donation.amountWidth }} />
            <span
              className={donation.status === 'received' ? 'example-tag is-done' : 'example-tag'}
            >
              {text[donation.status]}
            </span>
          </div>
        ))}
        <div className="example-row slide-in" style={{ '--order': donationRows.length }}>
          <span className="example-bar" style={{ width: '52%' }} />
        </div>
      </div>
    </MiniBrowser>
  );
};
