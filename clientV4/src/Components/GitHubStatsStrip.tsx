import { motion } from 'framer-motion';
import { fadeUp, staggerChildren } from '@/animations/variants';
import { brand } from '@/data/content';
import { formatStatValue, type GitHubStats } from '@/data/github';
import { asset } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  iconSrc: string;
  /** Card column offset for the staggered strip. */
  tilt: string;
  /** Icon yaw/pitch so each tile feels carved, not flat. */
  iconRotate: string;
  delay: number;
}

const StatCard = ({
  label,
  value,
  hint,
  iconSrc,
  tilt,
  iconRotate,
  delay,
}: StatCardProps) => (
  <motion.div className={`group relative ${tilt}`} variants={fadeUp}>
    <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition duration-500 group-hover:-translate-y-1.5 group-hover:border-mint/30 sm:flex-col sm:items-start sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent" />

      <div
        className="relative flex size-16 shrink-0 items-center justify-center sm:mb-5 sm:size-20"
        style={{ perspective: 600 }}
      >
        <span
          aria-hidden="true"
          className="icon-3d-halo pointer-events-none absolute -inset-3 rounded-full opacity-80 blur-lg transition duration-500 group-hover:opacity-100"
        />
        <img
          alt=""
          aria-hidden="true"
          className="icon-3d size-[3.5rem] object-contain transition duration-500 group-hover:scale-110 sm:size-[4.5rem]"
          decoding="async"
          height={88}
          src={asset(iconSrc)}
          style={{ transform: iconRotate, animationDelay: `${delay}ms` }}
          width={88}
        />
      </div>

      <div className="min-w-0">
        <p className="text-[clamp(2.2rem,10vw,3.25rem)] leading-none font-semibold tracking-[-0.05em] text-white tabular-nums sm:text-[clamp(2.4rem,4vw,3.5rem)]">
          {value}
        </p>
        <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">
          {label}
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-600">{hint}</p>
      </div>
    </div>
  </motion.div>
);

interface GitHubStatsStripProps {
  stats: GitHubStats;
  isLoading: boolean;
  source: string;
}

export const GitHubStatsStrip = ({ stats, isLoading, source }: GitHubStatsStripProps) => {
  const cards = [
    {
      label: 'Repos',
      value: isLoading ? '—' : formatStatValue(stats.totalRepos),
      hint: 'Public repos on GitHub',
      iconSrc: 'images-of-me/stat-repos-3d.webp',
      tilt: 'md:mt-0',
      iconRotate: 'rotateY(-18deg) rotateX(12deg) rotateZ(-4deg)',
      delay: 0,
    },
    {
      label: 'Stars',
      value: isLoading ? '—' : formatStatValue(stats.totalStars),
      hint: 'Across all public work',
      iconSrc: 'images-of-me/stat-star-3d.webp',
      tilt: 'md:mt-6',
      iconRotate: 'rotateY(16deg) rotateX(14deg) rotateZ(6deg)',
      delay: 80,
    },
    {
      label: 'Commits',
      value: isLoading ? '—' : formatStatValue(stats.totalCommits),
      hint: 'Approx. across top repos',
      iconSrc: 'images-of-me/stat-commits-3d.webp',
      tilt: 'md:mt-3',
      iconRotate: 'rotateY(-14deg) rotateX(10deg) rotateZ(-8deg)',
      delay: 160,
    },
  ];

  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20" id="github">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(94,234,212,0.07),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
          initial="hidden"
          variants={fadeUp}
          viewport={{ once: true, margin: '-10%' }}
          whileInView="visible"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <a
              aria-label="GitHub profile"
              className="group relative shrink-0"
              href={brand.github}
              rel="noreferrer"
              target="_blank"
            >
              <span className="pointer-events-none absolute inset-0 scale-125 rounded-full bg-mint/10 opacity-0 blur-xl transition group-hover:opacity-100" />
              <img
                alt=""
                className="relative size-16 object-contain drop-shadow-[0_0_28px_rgba(94,234,212,0.35)] sm:size-20 md:size-[5rem]"
                decoding="async"
                height={80}
                src={asset('images-of-me/github-3d-logo.webp')}
                style={{ transform: 'rotateY(-12deg) rotateX(8deg)' }}
                width={80}
              />
            </a>
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
                Live signal
              </p>
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.04em] text-white">
                GitHub, up to date
              </h2>
              <p className="mt-2 max-w-md text-sm text-zinc-500">
                Repos, stars, and commit volume pulled live from{' '}
                <a
                  className="text-zinc-300 underline-offset-4 transition hover:text-mint hover:underline"
                  href={brand.github}
                  rel="noreferrer"
                  target="_blank"
                >
                  @{brand.github.replace('https://github.com/', '')}
                </a>
                .
              </p>
            </div>
          </div>
          <p className="text-[11px] tracking-[0.16em] text-zinc-600 uppercase">
            {isLoading
              ? 'Syncing…'
              : source === 'live'
                ? 'Live'
                : source === 'cache'
                  ? 'Cached'
                  : 'Fallback'}
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-3 sm:gap-5"
          initial="hidden"
          variants={staggerChildren}
          viewport={{ once: true, margin: '-8%' }}
          whileInView="visible"
        >
          {cards.map((card) => (
            <StatCard
              delay={card.delay}
              hint={card.hint}
              iconRotate={card.iconRotate}
              iconSrc={card.iconSrc}
              key={card.label}
              label={card.label}
              tilt={card.tilt}
              value={card.value}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
