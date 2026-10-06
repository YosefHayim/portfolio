import { copy, type Language } from './copy';
import { Icon } from './Icon';
import { contactUrl } from './language';

interface ContactLinkProps {
  language: Language;
  variant?: 'blue' | 'dark' | 'white';
  long?: boolean;
}
export const ContactLink = ({ language, variant = 'blue', long = false }: ContactLinkProps) => {
  const words = copy[language];
  const label = long ? words.contactLong : words.contact;
  return (
    <a className={`contact contact-${variant}`} href={contactUrl(language)}>
      <span>{label}</span>
      <Icon name="arrow" />
    </a>
  );
};
