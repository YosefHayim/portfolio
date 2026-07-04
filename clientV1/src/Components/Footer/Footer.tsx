import { motion } from 'framer-motion';
import { Link } from 'react-router';
import Logo from '../Logo/Logo';
import { SocialIcons } from '../ui/social-icons';

const CURRENT_YEAR = new Date().getFullYear();
const ANIMATION_DELAY_STEP = 0.1;
const ANIMATION_Y_OFFSET = 20;

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/techStack', label: 'Tech Stack' },
  { to: '/projects', label: 'Projects' },
  { to: '/certifications', label: 'Certifications' },
];

const Footer = () => {
  return (
    <footer className="w-full max-w-full overflow-hidden border-t border-[var(--border-subtle)] bg-gradient-to-b from-transparent to-[var(--bg-card)]/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <motion.section
            initial={{ opacity: 0, y: ANIMATION_Y_OFFSET }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start gap-4"
          >
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
              Just trying to get better{' '}
              <span className="font-semibold text-[#05df72]">everyday.</span>
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: ANIMATION_Y_OFFSET }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ANIMATION_DELAY_STEP }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-[var(--text-muted)] transition-colors hover:text-[#05df72]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: ANIMATION_Y_OFFSET }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ANIMATION_DELAY_STEP * 2 }}
            className="flex flex-col gap-4"
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
