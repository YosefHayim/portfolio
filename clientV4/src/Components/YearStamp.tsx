import { motion } from 'framer-motion';
import { brand } from '@/data/content';
import { asset } from '@/lib/utils';
import { fadeUp } from '@/animations/variants';

/**
 * Era stamp between manifesto and services — shipping since 2020,
 * first ChatGPT launch generation. Glass ship emblem blends inline.
 */
export const YearStamp = () => (
  <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(94,234,212,0.06),transparent_55%)]" />

    <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
      <motion.div
        className="mb-8 flex flex-col items-center gap-5 sm:mb-10 sm:flex-row sm:gap-6"
        initial="hidden"
        variants={fadeUp}
        viewport={{ once: true }}
        whileInView="visible"
      >
        <img
          alt=""
          aria-hidden="true"
          className="size-16 object-contain drop-shadow-[0_0_32px_rgba(94,234,212,0.35)] sm:size-20"
          decoding="async"
          height={80}
          src={asset('images-of-me/ship-era-3d.webp')}
          style={{ transform: 'rotateY(-14deg) rotateX(8deg) rotateZ(-4deg)' }}
          width={80}
        />
        <p className="max-w-md text-sm leading-relaxed text-zinc-500 sm:text-left">
          Shipping practical systems since {brand.since} — from the first ChatGPT wave to
          production platforms and AI products people actually use.
        </p>
      </motion.div>

      <motion.div
        className="flex items-center gap-4 sm:gap-8"
        initial="hidden"
        variants={fadeUp}
        viewport={{ once: true }}
        whileInView="visible"
      >
        <span className="text-[clamp(3rem,12vw,7rem)] font-semibold tracking-tight text-white">
          ( 20
        </span>

        <div className="relative h-28 w-24 sm:h-36 sm:w-28">
          <img
            alt={brand.founder}
            className="relative z-10 h-full w-full rotate-[-3deg] rounded-md border border-white/10 object-cover object-top shadow-2xl"
            src={asset('images-of-me/linkedin-profile.webp')}
          />
        </div>

        <span className="text-[clamp(3rem,12vw,7rem)] font-semibold tracking-tight text-white">
          25 )
        </span>
      </motion.div>
    </div>
  </section>
);
