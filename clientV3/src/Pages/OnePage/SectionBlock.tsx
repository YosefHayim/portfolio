import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const sectionTitleClass = 'text-2xl font-semibold tracking-tight md:text-3xl';

interface SectionBlockProps {
  id: string;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

export const SectionBlock = ({
  id,
  title,
  description,
  className,
  children,
}: SectionBlockProps) => (
  <section className={cn('w-full max-w-6xl scroll-mt-24', className)} id={id}>
    <header className="space-y-1.5 pb-3 sm:space-y-2">
      <h2 className={sectionTitleClass}>{title}</h2>
      {description && (
        <p className="max-w-3xl text-[var(--text-secondary)] text-sm md:text-base">{description}</p>
      )}
    </header>
    {children}
  </section>
);
