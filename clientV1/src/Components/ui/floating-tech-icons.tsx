import {
  useRef,
  useEffect,
  forwardRef,
  type MouseEvent,
  type HTMLAttributes,
} from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { IconType } from 'react-icons';

export type TechIconData = {
  id: number;
  name: string;
  icon: IconType;
  color: string;
  className: string;
};

export type FloatingTechIconsProps = {
  title: string;
  subtitle: string;
  icons: TechIconData[];
};

const REPEL_DISTANCE = 150;
const REPEL_FORCE_MULTIPLIER = 50;
const SPRING_STIFFNESS = 300;
const SPRING_DAMPING = 20;
const FLOAT_DURATION_BASE = 5;
const FLOAT_DURATION_RANDOM = 5;
const FLOAT_Y_RANGE = 8;
const FLOAT_X_RANGE = 6;
const FLOAT_ROTATION_RANGE = 5;

type IconComponentProps = {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  iconData: TechIconData;
  index: number;
};

const FloatingIcon = ({
  mouseX,
  mouseY,
  iconData,
  index,
}: IconComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, {
    stiffness: SPRING_STIFFNESS,
    damping: SPRING_DAMPING,
  });
  const springY = useSpring(y, {
    stiffness: SPRING_STIFFNESS,
    damping: SPRING_DAMPING,
  });

  useEffect(() => {
    const handleMouseMove = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          (mouseX.current - centerX) ** 2 + (mouseY.current - centerY) ** 2
        );

        if (distance < REPEL_DISTANCE) {
          const angle = Math.atan2(
            mouseY.current - centerY,
            mouseX.current - centerX
          );
          const force =
            (1 - distance / REPEL_DISTANCE) * REPEL_FORCE_MULTIPLIER;
          x.set(-Math.cos(angle) * force);
          y.set(-Math.sin(angle) * force);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, mouseX, mouseY]);

  const Icon = iconData.icon;
  const animationDelay = index * 0.08;
  const floatDuration =
    FLOAT_DURATION_BASE + Math.random() * FLOAT_DURATION_RANDOM;

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: animationDelay,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('absolute', iconData.className)}
    >
      <motion.div
        className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/80 p-2.5 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[var(--border-hover)] hover:shadow-2xl md:h-16 md:w-16 md:p-3"
        animate={{
          y: [0, -FLOAT_Y_RANGE, 0, FLOAT_Y_RANGE, 0],
          x: [0, FLOAT_X_RANGE, 0, -FLOAT_X_RANGE, 0],
          rotate: [0, FLOAT_ROTATION_RANGE, 0, -FLOAT_ROTATION_RANGE, 0],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <Icon
          className="h-7 w-7 transition-transform duration-300 group-hover:scale-110 md:h-8 md:w-8"
          style={{ color: iconData.color }}
        />
      </motion.div>
      <motion.span
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-[var(--text-secondary)] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
      >
        {iconData.name}
      </motion.span>
    </motion.div>
  );
};

const FloatingTechIcons = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & FloatingTechIconsProps
>(({ className, title, subtitle, icons, ...props }, ref) => {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    mouseX.current = event.clientX;
    mouseY.current = event.clientY;
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-[var(--bg-void)] md:min-h-[700px]',
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(5,223,114,0.08),transparent_70%)]" />

      <div className="absolute inset-0 h-full w-full">
        {icons.map((iconData, index) => (
          <FloatingIcon
            key={iconData.id}
            mouseX={mouseX}
            mouseY={mouseY}
            iconData={iconData}
            index={index}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-primary)]/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-base text-[var(--text-muted)] md:text-lg"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
});

FloatingTechIcons.displayName = 'FloatingTechIcons';

export { FloatingTechIcons };
