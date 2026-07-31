import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { recruiterProfile } from '@/content/profile';
import { LanguageSwitch } from './LanguageSwitch.tsx';
import { NavMobileDrawer } from './NavMobileDrawer.tsx';
import { SECTION_LINKS } from './navLinks.ts';
import { VersionSwitch } from './VersionSwitch.tsx';

<<<<<<< HEAD
const initials = recruiterProfile.name
  // Raw row example: "Joseph Sabag" splits into ["Joseph", "Sabag"].
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part.charAt(0).toUpperCase())
  .join('');

=======
>>>>>>> refs/heads/mac-reset-backup/2026-07-30/stash/000-afbb755efb3e
export const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-void)]/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-3 sm:px-4">
          <Link className="flex items-center gap-2 font-semibold" to="/">
<<<<<<< HEAD
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand text-xs font-bold text-black">
              {initials}
            </span>
            <span className="hidden truncate text-sm sm:inline">{recruiterProfile.name}</span>
=======
            <span className="truncate text-sm">{recruiterProfile.name}</span>
>>>>>>> refs/heads/mac-reset-backup/2026-07-30/stash/000-afbb755efb3e
          </Link>

          {isHome && (
            <nav className="hidden items-center gap-1 md:flex">
              {SECTION_LINKS.map((section) => (
                <a
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  href={`#${section.id}`}
                  key={section.id}
                >
                  {t(`nav.${section.id}`)}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <VersionSwitch />
            <button
              aria-label={t('nav.openMenu')}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] md:hidden"
              onClick={() => setIsMenuOpen(true)}
              type="button"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <NavMobileDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        sections={SECTION_LINKS}
        showSections={isHome}
      />
    </>
  );
};
