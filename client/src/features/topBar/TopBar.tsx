import './topBar.css';
import { LanguageFlagButton } from '../language/LanguageFlagButton';
import type { Language } from '../language/savedLanguage';
import { TopBarCallButton } from './TopBarCallButton';
import { topBarText } from './topBar.text';

interface TopBarProps {
  language: Language;
  onToggleLanguage: () => void;
}

export const TopBar = ({ language, onToggleLanguage }: TopBarProps) => (
  <nav className="top-bar" aria-label={topBarText[language].navigationLabel}>
    <LanguageFlagButton language={language} onToggle={onToggleLanguage} />
    <TopBarCallButton language={language} />
  </nav>
);
