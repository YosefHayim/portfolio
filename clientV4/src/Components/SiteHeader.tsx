import { Link, useLocation } from 'react-router-dom';
import { brand, navLinks } from '@/data/content';
import { VersionPills } from '@/Components/VersionPills';

/**
 * Resolves home-section anchors so they work from blog routes too.
 *
 * @param href - Nav href (`#work` or `/blog`).
 * @param pathname - Current location pathname (basename-stripped).
 * @returns Final href for Link or anchor.
 */
const resolveNavHref = (href: string, pathname: string): string => {
  if (href.startsWith('#')) {
    return pathname === '/' ? href : `/${href}`;
  }
  return href;
};

export const SiteHeader = () => {
  const { pathname } = useLocation();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30">
      <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link className="group flex items-center gap-3" to="/">
          <span className="inline-flex size-8 items-center justify-center rounded-md border border-white/15 bg-white/[0.03] text-[11px] font-bold tracking-wider text-white">
            {brand.short}
          </span>
          <span className="hidden text-sm font-medium tracking-tight text-zinc-300 transition group-hover:text-white sm:inline">
            {brand.name}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 text-sm text-zinc-400 md:flex"
        >
          {navLinks.map((link) => {
            const href = resolveNavHref(link.href, pathname);
            if (href.startsWith('#')) {
              return (
                <a className="transition hover:text-white" href={href} key={link.id}>
                  {link.label}
                </a>
              );
            }
            return (
              <Link className="transition hover:text-white" key={link.id} to={href}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <VersionPills />
          <Link
            className="btn-solid hidden px-4 py-2 text-xs tracking-wide sm:inline-flex"
            to="/#contact"
          >
            Start a project
          </Link>
        </div>
      </div>
    </header>
  );
};
