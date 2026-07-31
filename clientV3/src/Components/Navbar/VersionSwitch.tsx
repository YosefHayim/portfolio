import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

type VersionSwitchProps = {
  className?: string;
};

type Era = {
  id: string;
  href: string;
  external: boolean;
};

// v1/v2/v4 are nested snapshots served by the same worker (full page loads);
// v3 is the app you're already in, so it routes with react-router.
const ERAS: Era[] = [
<<<<<<< HEAD
  { id: 'v1', href: '/v1/', external: true },
  { id: 'v2', href: '/v2/', external: true },
  { id: 'v3', href: '/', external: false },
  { id: 'v4', href: '/v4/', external: true },
=======
  { id: 'v1', hint: 'First edition where it started', href: '/v1/', external: true },
  { id: 'v2', hint: 'Second edition the rebuild', href: '/v2/', external: true },
  { id: 'v3', hint: "Current you're here", href: '/', external: false },
>>>>>>> refs/heads/mac-reset-backup/2026-07-30/stash/000-afbb755efb3e
];

const CURRENT_ERA = 'v3';

const tabClass = (isCurrent: boolean): string =>
  cn(
    'rounded-full px-2.5 py-1 text-xs font-semibold transition-colors',
    isCurrent
      ? 'bg-brand text-black'
      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  );

export const VersionSwitch = ({ className }: VersionSwitchProps) => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('nav.portfolioVersion')}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] p-0.5',
        className,
      )}
    >
      {ERAS.map((era) => {
        if (era.external) {
          return (
            <a
              className={tabClass(false)}
              href={era.href}
              key={era.id}
              title={t(`version.${era.id}`)}
            >
              {era.id}
            </a>
          );
        }

        return (
          <Link
            aria-current="page"
            className={tabClass(era.id === CURRENT_ERA)}
            key={era.id}
            title={t(`version.${era.id}`)}
            to={era.href}
          >
            {era.id}
          </Link>
        );
      })}
    </nav>
  );
};
