import { motion } from 'framer-motion';
import { fadeUp, staggerChildren } from '@/animations/variants';
import { realityPoints } from '@/data/content';

export const ManifestoSection = () => (
  <section className="relative px-5 py-24 sm:px-8 sm:py-32">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-16 lg:grid-cols-[1.35fr_0.9fr]">
        <motion.div
          initial="hidden"
          variants={fadeUp}
          viewport={{ once: true, margin: '-15%' }}
          whileInView="visible"
        >
          <p className="mb-6 text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
            The reality
          </p>
          <h2 className="max-w-3xl text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-white">
            Most builds stall after the demo.
            <span className="mt-3 block text-zinc-500">
              Demos are easy. Users, payments, AI in production, and staying live are the hard
              middle — that is what JTS ships.
            </span>
          </h2>
        </motion.div>

        <motion.ul
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1"
          initial="hidden"
          variants={staggerChildren}
          viewport={{ once: true, margin: '-10%' }}
          whileInView="visible"
        >
          {realityPoints.map((point) => (
            <motion.li
              className="border-t border-white/10 pt-4"
              key={point.index}
              variants={fadeUp}
            >
              <p className="text-[11px] tracking-[0.18em] text-zinc-500">{point.index}</p>
              <p className="mt-2 text-base font-medium text-white">{point.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">{point.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  </section>
);
