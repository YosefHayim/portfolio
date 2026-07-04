import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router';
import type { SectionLink } from './navLinks.ts';
import { VersionSwitch } from './VersionSwitch.tsx';

type NavMobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  sections: SectionLink[];
  showSections: boolean;
};

const drawerLinkClass =
  'rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]';

export const NavMobileDrawer = ({
  isOpen,
  onClose,
  sections,
  showSections,
}: NavMobileDrawerProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.aside
          animate={{ x: 0 }}
          className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col gap-6 border-l border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 md:hidden"
          exit={{ x: '100%' }}
          initial={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
              Menu
            </span>
            <button
              aria-label="Close menu"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              onClick={onClose}
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          {showSections && (
            <nav className="flex flex-col gap-1">
              {sections.map((section) => (
                <a
                  className={drawerLinkClass}
                  href={`#${section.id}`}
                  key={section.id}
                  onClick={onClose}
                >
                  {section.label}
                </a>
              ))}
            </nav>
          )}

          {!showSections && (
            <nav className="flex flex-col gap-1">
              <Link className={drawerLinkClass} onClick={onClose} to="/">
                ← Back to portfolio
              </Link>
            </nav>
          )}

          <div className="mt-auto flex flex-col gap-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">Portfolio version</span>
            <VersionSwitch />
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);
