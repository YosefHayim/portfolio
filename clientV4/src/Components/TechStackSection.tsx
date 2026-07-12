import { motion } from 'framer-motion';
import { fadeUp, staggerChildren } from '@/animations/variants';
import { techStack } from '@/data/content';
import { asset } from '@/lib/utils';

/** Subtle per-tile yaw so the strip feels carved, not flat. */
const iconRotates = [
  'rotateY(-16deg) rotateX(10deg) rotateZ(-3deg)',
  'rotateY(14deg) rotateX(12deg) rotateZ(4deg)',
  'rotateY(-12deg) rotateX(8deg) rotateZ(-6deg)',
  'rotateY(18deg) rotateX(11deg) rotateZ(3deg)',
  'rotateY(-14deg) rotateX(9deg) rotateZ(5deg)',
  'rotateY(12deg) rotateX(13deg) rotateZ(-4deg)',
  'rotateY(-18deg) rotateX(10deg) rotateZ(2deg)',
  'rotateY(15deg) rotateX(8deg) rotateZ(-5deg)',
  'rotateY(-11deg) rotateX(12deg) rotateZ(4deg)',
  'rotateY(16deg) rotateX(9deg) rotateZ(-3deg)',
] as const;

export const TechStackSection = () => (
  <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20" id="stack">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(94,234,212,0.05),transparent_55%)]" />

    <div className="relative mx-auto max-w-7xl">
      <motion.div
        className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        initial="hidden"
        variants={fadeUp}
        viewport={{ once: true, margin: '-10%' }}
        whileInView="visible"
      >
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
            Stack
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.04em] text-white">
            What I ship with
          </h2>
          <p className="mt-2 max-w-md text-sm text-zinc-500">
            The rails under production AI products, full-stack apps, and the tools that stay live.
          </p>
        </div>
        <p className="text-[11px] tracking-[0.16em] text-zinc-600 uppercase">
          {techStack.length} marks from the projects
        </p>
      </motion.div>

      <motion.ul
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6"
        initial="hidden"
        variants={staggerChildren}
        viewport={{ once: true, margin: '-8%' }}
        whileInView="visible"
      >
        {techStack.map((item, index) => (
          <motion.li
            className="group relative"
            key={item.id}
            style={{ perspective: 900 }}
            variants={fadeUp}
          >
            <div
              className="flex h-full flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] px-3 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition duration-500 group-hover:-translate-y-1 group-hover:border-mint/30 sm:py-6"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(8deg) rotateY(-5deg)',
              }}
            >
              <div className="relative flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="icon-3d-halo pointer-events-none absolute -inset-4 rounded-full opacity-80 blur-lg transition duration-500 group-hover:opacity-100"
                />
                <img
                  alt=""
                  aria-hidden="true"
                  className="icon-3d relative size-14 object-contain transition duration-500 group-hover:scale-110 sm:size-16 md:size-[4.25rem]"
                  decoding="async"
                  height={68}
                  loading="lazy"
                  src={asset(item.icon)}
                  style={{
                    transform: iconRotates[index % iconRotates.length],
                    transformStyle: 'preserve-3d',
                  }}
                  width={68}
                />
              </div>
              <span className="relative text-center text-[11px] font-medium tracking-[0.08em] text-zinc-400 uppercase">
                {item.label}
              </span>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  </section>
);
