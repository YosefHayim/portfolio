import { Award, FolderKanban, Home, Layers, User } from "lucide-react";

import { Link } from "react-router";
import Logo from "../Logo/Logo";
import type { ReactNode } from "react";
import { SocialIcons } from "../ui/social-icons";
import { motion } from "framer-motion";

const CURRENT_YEAR = new Date().getFullYear();
const ANIMATION_DELAY_STEP = 0.1;
const ANIMATION_Y_OFFSET = 20;
const ICON_SIZE = 14;

type NavLink = {
  to: string;
  label: string;
  icon: ReactNode;
};

const navLinks: NavLink[] = [
  { to: "/", label: "Home", icon: <Home size={ICON_SIZE} /> },
  { to: "/about", label: "About", icon: <User size={ICON_SIZE} /> },
  { to: "/techStack", label: "Tech Stack", icon: <Layers size={ICON_SIZE} /> },
  {
    to: "/projects",
    label: "Projects",
    icon: <FolderKanban size={ICON_SIZE} />,
  },
  {
    to: "/certifications",
    label: "Certifications",
    icon: <Award size={ICON_SIZE} />,
  },
];

const Footer = () => {
  return (
    <footer className="w-full max-w-full overflow-hidden border-t border-[var(--border-subtle)] bg-gradient-to-b from-transparent to-[var(--bg-card)]/30">
      <div className="mx-auto w-full p-5">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <motion.section
            className="flex flex-col items-start gap-4"
            initial={{ opacity: 0, y: ANIMATION_Y_OFFSET }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
              Just trying to get better{" "}
              <span className="font-semibold text-[#05df72]">everyday.</span>
            </p>
          </motion.section>

          <motion.section
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: ANIMATION_Y_OFFSET }}
            transition={{ delay: ANIMATION_DELAY_STEP }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-2">
              {navLinks.map((link) => (
                <Link
                  className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[#05df72]"
                  key={link.to}
                  to={link.to}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.section>

          <motion.section
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: ANIMATION_Y_OFFSET }}
            transition={{ delay: ANIMATION_DELAY_STEP * 2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
              Connect
            </h3>
            <div className="w-auto">
              <SocialIcons showLabels />
            </div>
          </motion.section>
        </div>
      </div>

      <div className="border-t border-[var(--border-subtle)] px-4 py-4 sm:px-6">
        <p className="text-center text-xs text-[var(--text-dim)]">
          © {CURRENT_YEAR} Joseph Sabag. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
