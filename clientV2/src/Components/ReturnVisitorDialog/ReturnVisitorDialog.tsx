import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react"; // Changed icon to Lightbulb for creativity
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router";
import { Button } from "../ui/button";

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
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog Container */}
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed right-4 bottom-4 left-4 z-50 sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2"
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl">
              {/* Flex Container */}
              <div className="flex flex-col sm:h-[340px] sm:flex-row">
                {/* Image Section - Top on mobile, Left on desktop */}
                <div className="h-32 w-full shrink-0 sm:h-auto sm:w-48">
                  <img
                    alt="Joseph Sabag"
                    className="h-full w-full object-cover object-top sm:object-center"
                    height={340}
                    src="/images-of-me/hero-image.svg"
                    width={192}
                  />
                </div>

                {/* Text Content - Right */}
                {/* 'justify-center' aligns content vertically in the middle */}
                <div className="relative flex flex-1 flex-col justify-center p-6 pt-10 sm:p-8 sm:pt-8">
                  {/* Close Button */}
                  <Button
                    aria-label="Close dialog"
                    className="absolute top-2 right-2 h-8 w-8 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    onClick={onClose}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="text-[var(--text-muted)]" size={16} />
                  </Button>

                  {/* Header */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.1 }}
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
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 pb-2 text-sm leading-relaxed text-[var(--text-secondary)]"
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.2 }}
                  >
                    The t-shirt story wasn't a stunt it was a <b>UX decision</b>
                    . I saw a friction point (paper resumes) and built a better
                    interface (QR code).
                    <br className="mb-2 block" />I bring that same creative
                    energy and product love to every team I join.
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#05df72] px-5 py-3 font-semibold text-black transition-all hover:bg-[#04c566] hover:shadow-lg hover:shadow-green-500/20"
                      onClick={onClose}
                      target="_blank"
                      to="https://wa.me/546187549"
                    >
                      <FaWhatsapp size={18} />
                      <span>Let's talk</span>
                      <ArrowRight
                        className="transition-transform group-hover:translate-x-0.5"
                        size={16}
                      />
                    </Link>

                    <button
                      className="w-full text-center text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)] hover:underline"
                      onClick={onClose}
                      type="button"
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
