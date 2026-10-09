import { useLayoutEffect, useState } from 'react';
import { loadLanguage, saveLanguage } from './savedLanguage';

export const useLanguage = () => {
  const [language, setLanguage] = useState(loadLanguage);

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    const nextLanguage = language === 'he' ? 'en' : 'he';
    setLanguage(nextLanguage);
    saveLanguage(nextLanguage);
  };

  return { language, toggleLanguage };
};
