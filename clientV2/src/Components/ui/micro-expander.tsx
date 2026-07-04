import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  type Variants,
} from "framer-motion";
import { Loader2, Plus } from "lucide-react";
import { forwardRef, type MouseEvent, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface MicroExpanderProps extends Omit<
  HTMLMotionProps<"button">,
  "children"
> {
  text: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
  isLoading?: boolean;
}

const COLLAPSED_WIDTH = "44px";
const EXPANDED_WIDTH = "auto";
const BUTTON_HEIGHT = 44;
const SPRING_STIFFNESS = 150;
const SPRING_DAMPING = 20;
const SPRING_MASS = 0.8;
const TEXT_DELAY = 0.15;
const TEXT_DURATION = 0.3;
const EXIT_DURATION = 0.1;
const ICON_DURATION = 0.2;
const INITIAL_X_OFFSET = -10;
const EXIT_X_OFFSET = -5;
const INITIAL_ROTATE = -90;
const INITIAL_SCALE = 0.5;

const containerVariants: Variants = {
  initial: { width: COLLAPSED_WIDTH },
  hover: { width: EXPANDED_WIDTH },
  loading: { width: COLLAPSED_WIDTH },
};

const textVariants: Variants = {
  initial: { opacity: 0, x: INITIAL_X_OFFSET },
  hover: {
    opacity: 1,
    x: 0,
    transition: { delay: TEXT_DELAY, duration: TEXT_DURATION, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: EXIT_X_OFFSET,
    transition: { duration: EXIT_DURATION, ease: "linear" },
  },
};

const variantStyles = {
  default:
    "bg-[#05df72] text-[var(--bg-void)] border border-[#05df72] hover:bg-[#04c966]",
  outline:
    "bg-transparent border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#05df72] hover:text-[#05df72]",
  ghost:
    "bg-[var(--bg-card)] border border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
  destructive:
    "bg-[#ff6467] text-white border border-[#ff6467] hover:bg-[#ff6467]/90",
};

const getAnimateState = (isLoading: boolean, isHovered: boolean) => {
  if (isLoading) {
    return "loading";
  }
  if (isHovered) {
    return "hover";
  }
  return "initial";
};

const MicroExpander = forwardRef<HTMLButtonElement, MicroExpanderProps>(
  (
    {
      text,
      icon,
      variant = "default",
      isLoading = false,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (isLoading) {
        return;
      }
      onClick?.(e);
    };

    return (
      <motion.button
        animate={getAnimateState(isLoading, isHovered)}
        aria-label={text}
        className={cn(
          "relative flex items-center overflow-hidden rounded-full",
          "text-xs font-medium tracking-wide whitespace-nowrap uppercase",
          "transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#05df72] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-void)] focus-visible:outline-none",
          isLoading && "cursor-not-allowed opacity-70",
          variantStyles[variant],
          className,
        )}
        disabled={isLoading}
        initial="initial"
        onBlur={() => setIsHovered(false)}
        onClick={handleClick}
        onFocus={() => setIsHovered(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={ref}
        style={{ height: BUTTON_HEIGHT }}
        transition={{
          type: "spring",
          stiffness: SPRING_STIFFNESS,
          damping: SPRING_DAMPING,
          mass: SPRING_MASS,
        }}
        type="button"
        variants={containerVariants}
        {...props}
      >
        <div
          className="z-10 grid shrink-0 place-items-center"
          style={{ height: BUTTON_HEIGHT, width: BUTTON_HEIGHT }}
        >
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: INITIAL_SCALE }}
                initial={{
                  opacity: 0,
                  scale: INITIAL_SCALE,
                  rotate: INITIAL_ROTATE,
                }}
                key="spinner"
                transition={{ duration: ICON_DURATION }}
              >
                <Loader2 className="h-5 w-5 animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: INITIAL_SCALE }}
                initial={{ opacity: 0, scale: INITIAL_SCALE }}
                key="icon"
                transition={{ duration: ICON_DURATION }}
              >
                {icon ?? <Plus className="h-5 w-5" />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div className="pr-5 pl-1" variants={textVariants}>
          {text}
        </motion.div>
      </motion.button>
    );
  },
);

MicroExpander.displayName = "MicroExpander";

export { MicroExpander };
