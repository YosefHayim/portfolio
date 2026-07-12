import { motion } from 'framer-motion';
import { fadeUp, staggerChildren } from '@/animations/variants';
import { services } from '@/data/content';
import { asset } from '@/lib/utils';

const cascadeImages = [
  { src: 'screenshots/ebay-mcp.webp', alt: 'eBay MCP', rotate: -6 },
  { src: 'screenshots/auto-bay-saas.webp', alt: 'AutoBay', rotate: 4 },
  { src: 'screenshots/sora-extension.webp', alt: 'Sora', rotate: -3 },
  { src: 'screenshots/tim-trailer.webp', alt: 'Tim Trailers', rotate: 7 },
  { src: 'images-of-me/hero-3d-full.webp', alt: 'Joseph', rotate: -2, character: true },
] as const;

export const ServicesSection = () => (
  <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32" id="services">
    <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <motion.div
        className="space-y-10"
        initial="hidden"
        variants={staggerChildren}
        viewport={{ once: true, margin: '-12%' }}
        whileInView="visible"
      >
        <motion.div variants={fadeUp}>
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
            Services
          </p>
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            What we build
          </h2>
        </motion.div>

        {services.map((service) => (
          <motion.article
            className="border-l border-white/15 pl-5"
            key={service.id}
            variants={fadeUp}
          >
            <p className="text-[11px] tracking-[0.18em] text-zinc-500">
              ({service.index}) {service.title}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
              {service.description}
            </p>
          </motion.article>
        ))}
      </motion.div>

      <div className="relative mx-auto h-[420px] w-full max-w-lg sm:h-[480px]">
        {cascadeImages.map((image, index) => (
          <motion.div
            className="absolute overflow-hidden rounded-lg border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 40, rotate: image.rotate }}
            key={image.src}
            style={{
              width: index === cascadeImages.length - 1 ? '42%' : '48%',
              height: index === cascadeImages.length - 1 ? '48%' : '36%',
              left: `${8 + index * 9}%`,
              top: `${8 + index * 14}%`,
              zIndex: index + 1,
            }}
            transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: '-10%' }}
            whileInView={{ opacity: 1, y: 0, rotate: image.rotate }}
          >
            <img
              alt={image.alt}
              className={
                'character' in image && image.character
                  ? 'h-full w-full object-contain object-bottom bg-zinc-950'
                  : 'h-full w-full object-cover'
              }
              decoding="async"
              loading="lazy"
              src={asset(image.src)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
