import { motion } from 'framer-motion';
import { fadeUp, staggerChildren } from '@/animations/variants';
import { brand } from '@/data/content';
import { asset } from '@/lib/utils';

const portraits = [
  {
    src: 'images-of-me/linkedin-profile.webp',
    alt: brand.founder,
    label: 'Founder',
    className: 'left-[8%] top-0 h-40 w-32 sm:h-48 sm:w-36',
    contain: false,
  },
  {
    src: 'images-of-me/hero-3d-full.webp',
    alt: `${brand.founder} 3D`,
    label: '3D mark',
    className: 'right-[8%] top-4 h-48 w-36 sm:h-56 sm:w-40',
    contain: true,
  },
  {
    src: 'images-of-me/jts-badge-3d.webp',
    alt: 'JTS badge',
    label: 'Mark',
    className: 'left-[28%] bottom-2 h-28 w-28 sm:h-32 sm:w-32',
    contain: true,
  },
] as const;

export const StudioSection = () => (
  <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32" id="studio">
    <div className="mx-auto max-w-7xl">
      <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial="hidden"
          variants={fadeUp}
          viewport={{ once: true, margin: '-12%' }}
          whileInView="visible"
        >
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
            Studio
          </p>
          <h2 className="max-w-xl text-[clamp(1.75rem,4vw,3rem)] leading-tight font-medium tracking-tight text-white">
            One builder. Real production taste. A company surface for work that ships.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-zinc-500">
            {brand.founder} runs {brand.short} as a boutique studio — AI products, full-stack
            systems, extensions, and client builds. Not a hiring page. Not a generic agency
            grid. A place to start a project with someone who has already shipped the hard
            parts.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: 'Focus', value: 'AI + full-stack' },
              { label: 'Model', value: 'Scoped builds' },
              { label: 'Since', value: brand.since },
            ].map((item) => (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4" key={item.label}>
                <dt className="text-[11px] tracking-[0.16em] text-zinc-500 uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          className="relative mx-auto h-[380px] w-full max-w-md sm:h-[420px]"
          initial="hidden"
          variants={staggerChildren}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {portraits.map((portrait, index) => (
            <motion.figure
              className={`absolute overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl ${portrait.className}`}
              key={portrait.src}
              transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              variants={fadeUp}
            >
              <img
                alt={portrait.alt}
                className={
                  portrait.contain
                    ? 'h-full w-full object-contain object-center p-1'
                    : 'h-full w-full object-cover object-top'
                }
                decoding="async"
                loading="lazy"
                src={asset(portrait.src)}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-[11px] text-zinc-300">
                {portrait.label}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);
