import { motion } from "framer-motion";
import { Award, FolderKanban, Home, Layers, User } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

type NavItem = {
  path: string;
  icon: ReactNode;
  label: string;
};

const ICON_SIZE = 20;
const ANIMATION_DELAY = 0.3;
const ANIMATION_DURATION = 0.5;
const SCALE_ACTIVE = 1.1;
const SCALE_INACTIVE = 1;
const DURATION_FAST = 0.2;
const EASE_1 = 0.16;
const EASE_2 = 1;
const EASE_3 = 0.3;
const SPRING_STIFFNESS = 500;
const SPRING_DAMPING = 30;
const FONT_WEIGHT_ACTIVE = 600;
const FONT_WEIGHT_INACTIVE = 400;

const navItems: NavItem[] = [
  { path: "/", icon: <Home size={ICON_SIZE} />, label: "Home" },
  { path: "/about", icon: <User size={ICON_SIZE} />, label: "About" },
  { path: "/techStack", icon: <Layers size={ICON_SIZE} />, label: "Stack" },
  {
    path: "/projects",
    icon: <FolderKanban size={ICON_SIZE} />,
    label: "Projects",
  },
  { path: "/certifications", icon: <Award size={ICON_SIZE} />, label: "Certs" },
];

const springTransition = {
  type: "spring" as const,
  stiffness: SPRING_STIFFNESS,
  damping: SPRING_DAMPING,
};

export function BottomNav() {
  const location = useLocation();

  return (
    <motion.nav
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 z-50 w-full border-t border-[var(--border-subtle)] bg-[var(--bg-void)]/95 backdrop-blur-xl md:hidden"
      initial={{ y: 100, opacity: 0 }}
      transition={{
        delay: ANIMATION_DELAY,
        duration: ANIMATION_DURATION,
        ease: [EASE_1, EASE_2, EASE_3, EASE_2],
      }}
    >
      <div className="flex h-16 w-full items-center justify-around px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              className="relative flex flex-1 flex-col items-center justify-center py-2"
              key={item.path}
              to={item.path}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-t from-[#05df72]/20 to-transparent"
                  layoutId="bottomNavIndicator"
                  transition={springTransition}
                />
              )}
              <motion.div
                animate={{
                  scale: isActive ? SCALE_ACTIVE : SCALE_INACTIVE,
                  color: isActive ? "#05df72" : "var(--text-muted)",
                }}
                className="relative z-10"
                transition={{ duration: DURATION_FAST }}
              >
                {item.icon}
              </motion.div>
              <motion.span
                animate={{
                  color: isActive ? "#05df72" : "var(--text-muted)",
                  fontWeight: isActive
                    ? FONT_WEIGHT_ACTIVE
                    : FONT_WEIGHT_INACTIVE,
                }}
                className="relative z-10 mt-1 text-[10px]"
                transition={{ duration: DURATION_FAST }}
              >
                {item.label}
              </motion.span>
              {isActive && (
                <motion.div
                  className="absolute -top-0.5 h-0.5 w-6 rounded-full bg-[#05df72]"
                  layoutId="bottomNavDot"
                  transition={springTransition}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

export default BottomNav;
