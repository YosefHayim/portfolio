const ERAS = [
  { id: 'v1', href: '/v1/', current: false },
  { id: 'v2', href: '/v2/', current: false },
  { id: 'v3', href: '/', current: false },
  { id: 'v4', href: '/v4/', current: true },
] as const;

export const VersionPills = () => (
  <nav
    aria-label="Portfolio version"
    className="inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-0.5"
  >
    {ERAS.map((era) =>
      era.current ? (
        <span
          aria-current="page"
          className="btn-solid rounded-full px-2.5 py-1 text-[11px] tracking-wide"
          key={era.id}
        >
          {era.id}
        </span>
      ) : (
        <a
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide text-zinc-400 transition hover:text-white"
          href={era.href}
          key={era.id}
        >
          {era.id}
        </a>
      ),
    )}
  </nav>
);
