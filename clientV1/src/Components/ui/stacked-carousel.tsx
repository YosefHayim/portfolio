import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type StackedCarouselProps = {
  images: string[];
  interval?: number;
  className?: string;
};

const DEFAULT_INTERVAL_MS = 4000;
const STACK_OFFSET = 12;
const STACK_SCALE_DECREMENT = 0.05;
const STACK_OPACITY_DECREMENT = 0.15;
const VISIBLE_CARDS = 3;
const SPRING_STIFFNESS = 300;
const SPRING_DAMPING = 30;
const EXIT_Y_OFFSET = -50;
const ENTER_Y_OFFSET = 50;
const ENTER_SCALE = 0.9;
const EXIT_SCALE = 1.05;

export const StackedCarousel = ({
  images,
  interval = DEFAULT_INTERVAL_MS,
  className,
}: StackedCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [nextSlide, interval, images.length]);

  const getCardStyle = (position: number) => {
    const isActive = position === 0;
    const offset = position * STACK_OFFSET;
    const scale = 1 - position * STACK_SCALE_DECREMENT;
    const opacity = 1 - position * STACK_OPACITY_DECREMENT;

    return {
      zIndex: VISIBLE_CARDS - position,
      y: offset,
      scale,
      opacity: isActive ? 1 : opacity,
    };
  };

  const getVisibleIndices = () => {
    const indices: number[] = [];
    for (let i = 0; i < Math.min(VISIBLE_CARDS, images.length); i++) {
      indices.push((currentIndex + i) % images.length);
    }
    return indices;
  };

  return (
    <div className={cn('relative h-80 w-full max-w-md', className)}>
      <AnimatePresence mode="popLayout">
        {getVisibleIndices().map((imageIndex, position) => (
          <motion.div
            key={`slide-${images[imageIndex]}`}
            initial={{ y: ENTER_Y_OFFSET, scale: ENTER_SCALE, opacity: 0 }}
            animate={getCardStyle(position)}
            exit={{ y: EXIT_Y_OFFSET, scale: EXIT_SCALE, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: SPRING_STIFFNESS,
              damping: SPRING_DAMPING,
            }}
            className="absolute inset-0 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl"
          >
            <picture>
              <source srcSet={images[imageIndex]} type="image/webp" />
              <img
                src={images[imageIndex]}
                alt={`Slide ${imageIndex + 1}`}
                width={400}
                height={320}
                className="h-full w-full object-cover"
              />
            </picture>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((imageSrc) => {
          const isActive = images[currentIndex] === imageSrc;
          return (
            <button
              key={`dot-${imageSrc}`}
              type="button"
              onClick={() => setCurrentIndex(images.indexOf(imageSrc))}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                isActive
                  ? 'w-6 bg-[#05df72]'
                  : 'w-2 bg-[var(--border-subtle)] hover:bg-[var(--text-muted)]'
              )}
              aria-label={`Go to slide ${images.indexOf(imageSrc) + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};
