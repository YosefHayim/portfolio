import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react'; // Changed icon to Lightbulb for creativity
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router';
import { Button } from '../ui/button.tsx';

type ReturnVisitorDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ReturnVisitorDialog = ({ isOpen, onClose }: ReturnVisitorDialogProps) => {
  const { t } = useTranslation();

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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
                    src="/images-of-me/hero-image.png"
                    width={192}
                  />
                </div>

                {/* Text Content - Right */}
                {/* 'justify-center' aligns content vertically in the middle */}
                <div className="relative flex flex-1 flex-col justify-center p-2 p-2 sm:p-2 sm:p-2">
                  {/* Close Button */}
                  <Button
                    aria-label={t('dialog.closeDialog')}
                    className="absolute top-2 right-2 h-8 w-8 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    onClick={onClose}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="text-[var(--text-muted)]" size={16} />
                  </Button>

                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className=" space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-xl leading-tight font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                      {t('dialog.title')} <span className="inline-block">👋</span>
                    </h2>
                  </motion.div>

                  <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    className=" p-2 text-sm leading-relaxed text-(--text-secondary)"
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.2 }}
                  >
                    {t('dialog.bodyLead')}{' '}
                    <b className="text-[var(--text-primary)]">{t('dialog.interested')}</b>{' '}
                    {t('dialog.or')}{' '}
                    <b className="text-[var(--text-primary)]">{t('dialog.hesitating')}</b>.
                    <br className=" block" />
                    {t('dialog.bodyRest')}
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand p-2 font-semibold text-black transition-all hover:bg-brand-hover hover:shadow-lg hover:shadow-green-500/20"
                      onClick={onClose}
                      target="_blank"
                      to="https://wa.me/546187549"
                    >
                      <FaWhatsapp size={18} />
                      <span>{t('dialog.letsTalk')}</span>
                      <ArrowRight
                        className="transition-transform group-hover:translate-x-0.5"
                        size={16}
                      />
                    </Link>

                    <button
                      className="w-full text-center text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-(--text-secondary) hover:underline"
                      onClick={onClose}
                      type="button"
                    >
                      {t('dialog.maybeLater')}
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
