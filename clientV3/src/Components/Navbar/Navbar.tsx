import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { recruiterProfile } from '@/content/profile';
import { NavMobileDrawer } from './NavMobileDrawer.tsx';
import { SECTION_LINKS } from './navLinks.ts';
import { VersionSwitch } from './VersionSwitch.tsx';

export const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-void)]/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-3 sm:px-4">
          <Link className="flex items-center gap-2 font-semibold" to="/">
            <span className="truncate text-sm">{recruiterProfile.name}</span>
          </Link>

          {isHome && (
            <nav className="hidden items-center gap-1 md:flex">
              {SECTION_LINKS.map((section) => (
                <a
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  href={`#${section.id}`}
                  key={section.id}
                >
                  {section.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <VersionSwitch />
            <button
              aria-label="Open menu"
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
