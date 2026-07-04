import { Link } from 'react-router';
import { cn } from '@/lib/utils';

type VersionSwitchProps = {
  className?: string;
};

type Era = {
  id: string;
  hint: string;
  href: string;
  external: boolean;
};

// v1/v2 are frozen snapshots served by the same worker at /v1/ and /v2/ (full
// page loads); v3 is the app you're already in, so it routes with react-router.
const ERAS: Era[] = [
  { id: 'v1', hint: 'First edition where it started', href: '/v1/', external: true },
  { id: 'v2', hint: 'Second edition the rebuild', href: '/v2/', external: true },
  { id: 'v3', hint: "Current you're here", href: '/', external: false },
];

const CURRENT_ERA = 'v3';

const tabClass = (isCurrent: boolean): string =>
  cn(
    'rounded-full px-2.5 py-1 text-xs font-semibold transition-colors',
    isCurrent
      ? 'bg-[#05df72] text-black'
      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  );

export const VersionSwitch = ({ className }: VersionSwitchProps) => (
  <nav
    aria-label="Portfolio version"
    className={cn(
      'inline-flex items-center gap-0.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] p-0.5',
      className,
    )}
  >
    {ERAS.map((era) => {
      if (era.external) {
        return (
          <a className={tabClass(false)} href={era.href} key={era.id} title={era.hint}>
            {era.id}
          </a>
        );
      }

      return (
        <Link
          aria-current="page"
          className={tabClass(era.id === CURRENT_ERA)}
          key={era.id}
          title={era.hint}
          to={era.href}
        >
          {era.id}
        </Link>
      );
    })}
  </nav>
);
