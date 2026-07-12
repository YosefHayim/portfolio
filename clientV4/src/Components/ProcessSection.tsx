import { motion } from 'framer-motion';
import { fadeUp, staggerChildren } from '@/animations/variants';
import { processSteps } from '@/data/content';

export const ProcessSection = () => (
  <section className="relative px-5 py-24 sm:px-8 sm:py-32">
    <div className="mx-auto max-w-7xl">
      <motion.div
        className="mb-14 max-w-2xl"
        initial="hidden"
        variants={fadeUp}
        viewport={{ once: true }}
        whileInView="visible"
      >
        <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
          How we work
        </p>
        <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Discover → Scope → Ship → Iterate
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500">
          Clear rails. No rewrite theater after go-live. We reduce the hard work — we do not
          replace your judgment on what to launch.
        </p>
      </motion.div>

      <motion.ol
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        variants={staggerChildren}
        viewport={{ once: true, margin: '-10%' }}
        whileInView="visible"
      >
        {processSteps.map((step, index) => (
          <motion.li
            className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            key={step.id}
            variants={fadeUp}
          >
            {index < processSteps.length - 1 ? (
              <span className="pointer-events-none absolute top-1/2 -right-3 hidden h-px w-6 bg-white/15 lg:block" />
            ) : null}
            <p className="text-[11px] tracking-[0.18em] text-zinc-500">{step.index}</p>
            <h3 className="mt-3 text-lg font-medium text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step.description}</p>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  </section>
);
