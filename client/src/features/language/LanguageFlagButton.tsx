import './language.css';
import { languageText } from './language.text';
import type { Language } from './savedLanguage';

interface LanguageFlagButtonProps {
  language: Language;
  onToggle: () => void;
}

export const LanguageFlagButton = ({ language, onToggle }: LanguageFlagButtonProps) => (
  <button
    type="button"
    className="language-flag-button"
    aria-label={languageText[language].switchLabel}
    onClick={onToggle}
  >
    <span className="language-flag english-flag" title="English">
      <svg viewBox="0 0 30 30" aria-hidden="true">
        <defs>
          <clipPath id="english-flag-circle">
            <circle cx="15" cy="15" r="15" />
          </clipPath>
        </defs>
        <g clipPath="url(#english-flag-circle)">
          <rect width="30" height="30" fill="#B22234" />
          <path
            d="M0 3.5h30M0 8h30M0 12.5h30M0 17h30M0 21.5h30M0 26h30"
            stroke="#fff"
            strokeWidth="2.3"
          />
          <rect width="15" height="15" fill="#3C3B6E" />
          <g fill="#fff">
            <circle cx="4" cy="4" r=".9" />
            <circle cx="8" cy="4" r=".9" />
            <circle cx="12" cy="4" r=".9" />
            <circle cx="6" cy="7.5" r=".9" />
            <circle cx="10" cy="7.5" r=".9" />
            <circle cx="4" cy="11" r=".9" />
            <circle cx="8" cy="11" r=".9" />
            <circle cx="12" cy="11" r=".9" />
          </g>
        </g>
      </svg>
    </span>
    <span className="language-flag hebrew-flag" title="עברית">
      <svg viewBox="0 0 30 30" aria-hidden="true">
        <defs>
          <clipPath id="hebrew-flag-circle">
            <circle cx="15" cy="15" r="15" />
          </clipPath>
        </defs>
        <g clipPath="url(#hebrew-flag-circle)">
          <rect width="30" height="30" fill="#fff" />
          <rect y="4" width="30" height="3.6" fill="#0038B8" />
          <rect y="22.4" width="30" height="3.6" fill="#0038B8" />
          <path
            d="M15 9.6l4.7 8.1h-9.4zM15 20.4l-4.7-8.1h9.4z"
            fill="none"
            stroke="#0038B8"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </span>
    <i className="language-flag-ring" aria-hidden="true" />
  </button>
);
