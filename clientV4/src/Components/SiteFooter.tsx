import { brand, navLinks } from '@/data/content';
import { VersionPills } from '@/Components/VersionPills';
import { asset } from '@/lib/utils';

/** 3D glass mark for each footer nav option, keyed by nav id. GitHub reuses the hero logo. */
const navIcons: Record<string, string> = {
  work: 'images-of-me/nav-work-3d.webp',
  github: 'images-of-me/github-3d-logo.webp',
  services: 'images-of-me/nav-services-3d.webp',
  journal: 'images-of-me/nav-journal-3d.webp',
  studio: 'images-of-me/nav-studio-3d.webp',
  contact: 'images-of-me/nav-contact-3d.webp',
};

/** Small transparent glass icon used inline beside a footer link label. */
const GlassIcon = ({ src }: { src: string }) => (
  <img
    alt=""
    aria-hidden="true"
    className="size-6 shrink-0 object-contain opacity-90 drop-shadow-[0_2px_5px_rgba(0,0,0,0.55)] transition duration-300 group-hover:scale-110 group-hover:opacity-100"
    decoding="async"
    height={24}
    loading="lazy"
    src={asset(src)}
    width={24}
  />
);

export const SiteFooter = () => (
  <footer className="relative overflow-hidden border-t border-white/10 px-5 pt-16 pb-32 sm:px-8">
    <div className="relative z-10 mx-auto grid max-w-7xl gap-10 sm:grid-cols-3">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
          Navigate
        </p>
        <ul className="mt-4 space-y-2 text-sm text-zinc-400">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                className="group inline-flex items-center gap-3 transition hover:text-white"
                href={link.href}
              >
                <GlassIcon src={navIcons[link.id] ?? navIcons.work} />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
          Connect
        </p>
        <ul className="mt-4 space-y-2 text-sm text-zinc-400">
          <li>
            <a
              className="group inline-flex items-center gap-3 transition hover:text-white"
              href={brand.github}
              rel="noreferrer"
              target="_blank"
            >
              <GlassIcon src="images-of-me/github-3d-logo.webp" />
              GitHub
            </a>
          </li>
          <li>
            <a
              className="group inline-flex items-center gap-3 transition hover:text-white"
              href={brand.linkedin}
              rel="noreferrer"
              target="_blank"
            >
              <GlassIcon src="images-of-me/nav-linkedin-3d.webp" />
              LinkedIn
            </a>
          </li>
          <li>
            <a
              className="group inline-flex items-center gap-3 transition hover:text-white"
              href={`mailto:${brand.email}`}
            >
              <GlassIcon src="images-of-me/nav-email-3d.webp" />
              Email
            </a>
          </li>
        </ul>
      </div>
      <div className="sm:text-right">
        <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">Eras</p>
        <div className="mt-4 flex sm:justify-end">
          <VersionPills />
        </div>
        <p className="mt-6 text-xs text-zinc-600">
          {brand.name} · {brand.founder}
        </p>
      </div>
    </div>

    <div className="pointer-events-none relative mt-16 flex justify-center overflow-hidden">
      <p className="ghost-wordmark whitespace-nowrap">{brand.short}</p>
    </div>
  </footer>
);
