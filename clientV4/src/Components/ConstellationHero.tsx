import { brand, constellationTiles } from '@/data/content';
import { FloatingTile } from '@/Components/FloatingTile';

/**
 * Above-the-fold hero — zero framer-motion so LCP paints without the motion chunk.
 */
export const ConstellationHero = () => (
  <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pt-24 pb-28 sm:px-8">
    <div className="pointer-events-none absolute inset-0 vignette" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(94,234,212,0.06),transparent_55%)]" />

    <div className="relative mx-auto w-full max-w-7xl">
      <div className="mb-10 flex items-center gap-4">
        <span className="h-px w-10 bg-white/30 sm:w-16" />
        <h1 className="text-[clamp(3.25rem,12vw,8.5rem)] leading-[0.85] font-semibold tracking-[-0.06em] text-white">
          {brand.short}
        </h1>
        <span className="h-px flex-1 bg-white/30" />
      </div>

      <div className="relative mx-auto h-[46vh] min-h-[320px] w-full max-w-5xl sm:h-[52vh] sm:min-h-[400px]">
        <div className="pointer-events-none absolute top-1/2 left-1/2 size-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.12),transparent_65%)] blur-2xl" />
        {constellationTiles.map((tile) => (
          <FloatingTile
            alt={tile.alt}
            className={tile.className}
            floatDelay={tile.floatDelay}
            isCharacter={tile.isCharacter}
            key={tile.id}
            priority={tile.id === 'hero'}
            rotate={tile.rotate}
            src={tile.src}
          />
        ))}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <p className="max-w-xl text-2xl leading-tight font-medium tracking-tight text-white sm:text-3xl md:text-4xl">
            {brand.tagline}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">
            Boutique studio for founders who need AI products, full-stack systems, and
            automations that leave the demo and stay live.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="btn-solid h-11 px-5 text-sm" href="#contact">
              Start a project
            </a>
            <a
              className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:text-white"
              href="#work"
            >
              See work
            </a>
          </div>
        </div>

        <p className="max-w-xs text-right text-xs leading-relaxed text-zinc-500 md:justify-self-end">
          Built by {brand.founder}. Shipped for clients who care about production — not
          pitch-deck slides.
        </p>
      </div>
    </div>
  </section>
);
