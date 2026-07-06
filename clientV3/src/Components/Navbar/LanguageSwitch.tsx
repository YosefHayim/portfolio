import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/i18n/config';
import { LANGUAGES, type Language, normalizeLanguage } from '@/i18n/localized';
import { cn } from '@/lib/utils';

const LABELS: Record<Language, string> = {
  en: 'EN',
  he: 'עב',
};

const tabClass = (isActive: boolean): string =>
  cn(
    'rounded-full px-2.5 py-1 text-xs font-semibold transition-colors',
    isActive
      ? 'bg-brand text-black'
      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  );

export const LanguageSwitch = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation();
  const active = normalizeLanguage(i18n.language);

  return (
    <nav
      aria-label={t('language.label')}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] p-0.5',
        className,
      )}
    >
      {LANGUAGES.map((language) => (
        <button
          aria-label={t('language.switchTo', { language: t(`language.${language}`) })}
          aria-pressed={language === active}
          className={tabClass(language === active)}
          key={language}
          onClick={() => changeLanguage(language)}
          type="button"
        >
          {LABELS[language]}
        </button>
      ))}
    </nav>
  );
};
