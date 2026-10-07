import { PhoneIcon } from '../../components/PhoneIcon';
import { RollingLabel } from '../../components/RollingLabel';
import type { Language } from '../language/savedLanguage';
import { whatsappLink } from '../whatsapp/whatsappLink';
import { topBarText } from './topBar.text';

export const TopBarCallButton = ({ language }: { language: Language }) => {
  const text = topBarText[language];
  return (
    <a className="top-bar-call-button" href={whatsappLink(language)} target="_blank" rel="noopener">
      <span className="online-dot" aria-hidden="true" />
      <RollingLabel label={text.callLabel} hoverLabel={text.callHoverLabel} />
      <span className="phone-icon" aria-hidden="true">
        <PhoneIcon />
      </span>
    </a>
  );
};
