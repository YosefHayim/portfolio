import { motion } from 'framer-motion';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

export const TypingIndicator = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex flex-col items-start"
      initial={{ opacity: 0 }}
    >
      <div className="flex items-center gap-2 rounded-xl bg-[var(--bg-surface)] p-2">
        <div className="flex gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-brand" />
        </div>
        <span className="text-[var(--text-muted)] text-xs">{t('chat.thinking')}</span>
      </div>
    </motion.div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';
