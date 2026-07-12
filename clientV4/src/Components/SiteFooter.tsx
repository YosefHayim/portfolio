import { brand, navLinks } from '@/data/content';
import { VersionPills } from '@/Components/VersionPills';
import { asset } from '@/lib/utils';

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
              <a className="transition hover:text-white" href={link.href}>
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
              className="inline-flex items-center gap-2 transition hover:text-white"
              href={brand.github}
              rel="noreferrer"
              target="_blank"
            >
              <img
                alt=""
                className="size-4 object-contain opacity-80"
                decoding="async"
                height={16}
                src={asset('images-of-me/github-3d-logo.webp')}
                width={16}
              />
              GitHub
            </a>
          </li>
          <li>
            <a
              className="transition hover:text-white"
              href={brand.linkedin}
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a className="transition hover:text-white" href={`mailto:${brand.email}`}>
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
