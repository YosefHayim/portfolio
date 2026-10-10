import type { Language } from '../language/savedLanguage';
import { whatsappText } from './whatsapp.text';

const whatsappNumber = '972546187549';

export const whatsappLink = (language: Language) => {
  const message = encodeURIComponent(whatsappText[language].message);
  return `https://wa.me/${whatsappNumber}?text=${message}`;
};
