import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react'; // Changed icon to Lightbulb for creativity

import { Button } from '../ui/button';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router';

type ReturnVisitorDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ReturnVisitorDialog: React.FC<ReturnVisitorDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-4 bottom-4 left-4 z-50 sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2"
          >
            <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl">
              {/* Flex Container */}
              <div className="flex flex-col sm:h-[340px] sm:flex-row">
                {/* Image Section - Left */}
                <div className="hidden shrink-0 sm:block sm:w-48">
                  <img
                    src="/images-of-me/hero-image.svg"
                    alt="Joseph Sabag"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Text Content - Right */}
                {/* 'justify-center' aligns content vertically in the middle */}
                <div className="relative flex flex-1 flex-col justify-center p-6 pt-10 sm:p-8 sm:pt-8">
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="absolute top-2 right-2 h-8 w-8 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X size={16} className="text-[var(--text-muted)]" />
                  </Button>

                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4 space-y-1"
                  >
                    <h2 className="text-xl leading-tight font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                      Code is my tool. <br />
                      <span className="text-[var(--text-secondary)]">
                        Innovation is my craft.
                      </span>
                    </h2>
                  </motion.div>

                  {/* The Story / Hook */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 pb-2 text-sm leading-relaxed text-[var(--text-secondary)]"
                  >
                    The t-shirt story wasn't a stunt it was a <b>UX decision</b>
                    . I saw a friction point (paper resumes) and built a better
                    interface (QR code).
                    <br className="mb-2 block" />I bring that same creative
                    energy and product love to every team I join.
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <Link
                      to="https://wa.me/546187549"
                      target="_blank"
                      onClick={onClose}
                      className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#05df72] px-5 py-3 font-semibold text-black transition-all hover:bg-[#04c566] hover:shadow-lg hover:shadow-green-500/20"
                    >
                      <FaWhatsapp size={18} />
                      <span>Let's talk</span>
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full text-center text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)] hover:underline"
                    >
                      Maybe later
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReturnVisitorDialog;
