import type { TFunction } from 'i18next';
import { Building2, CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { experienceItems } from '@/content/profile';
import { useLocale } from '@/i18n/localized';
import { LogoBadge } from './LogoBadge.tsx';
import { SectionBlock } from './SectionBlock.tsx';

/**
 * Total months between two "YYYY-MM" ISO month strings, inclusive of both
 * months matches how tenure is usually counted on a CV ("Feb–Apr 2025" is
 * three months, not two).
 */
const monthsInclusive = (startIso: string, endIso: string): number => {
  const [startY, startM] = startIso.split('-').map(Number);
  const [endY, endM] = endIso.split('-').map(Number);
  if (!(startY && startM && endY && endM)) {
    return 0;
  }
  return (endY - startY) * 12 + (endM - startM) + 1;
};

/** Human-readable tenure label like "11 mos" or "1 yr 2 mos", localized via i18n. */
const formatTenure = (months: number, t: TFunction): string => {
  if (months <= 0) {
    return '';
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const monthPart = t('tenure.month', { count: remainingMonths });
  if (years === 0) {
    return monthPart;
  }
  const yearPart = t('tenure.year', { count: years });
  if (remainingMonths === 0) {
    return yearPart;
  }
  return `${yearPart} ${monthPart}`;
};

const tenureLabel = (item: { startDate?: string; endDate?: string }, t: TFunction): string => {
  if (!item.startDate) {
    return '';
  }
  const endIso = item.endDate ?? new Date().toISOString().slice(0, 7); // "YYYY-MM"
  return formatTenure(monthsInclusive(item.startDate, endIso), t);
};

export const ExperienceSection = () => {
  const { t } = useTranslation();
  const { localize } = useLocale();

  return (
    <SectionBlock id="experience" title={t('sections.experience')}>
      <div className="grid gap-2 md:grid-cols-2">
        {experienceItems.map((item) => {
          const tenure = tenureLabel(item, t);

          return (
            <article
              className="flex min-w-0 flex-col gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 sm:p-4"
              key={item.id}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <LogoBadge
                    alt={`${item.company} logo`}
                    icon={<Building2 size={14} />}
                    monogram={item.logoMonogram}
                    src={item.logoUrl}
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base leading-tight">
                      {item.companyUrl ? (
                        <a
                          className="inline-flex max-w-full items-center gap-2 hover:text-brand-readable"
                          href={item.companyUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <span className="truncate">{item.company}</span>
                        </a>
                      ) : (
                        <span className="truncate">{item.company}</span>
                      )}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-xs">{localize(item.role)}</p>
                  </div>
                </div>
                <p className="inline-flex shrink-0 items-center gap-2 text-[var(--text-secondary)] text-xs">
                  <CalendarDays size={12} />
                  <span>{localize(item.dateRange)}</span>
                  {tenure && (
                    <span className="text-[10px] text-[var(--text-secondary)]/80">({tenure})</span>
                  )}
                </p>
              </div>
              <ul className="grid gap-2 text-[var(--text-secondary)] text-sm leading-relaxed">
                {localize(item.bullets).map((bullet) => (
                  <li className="line-clamp-3" key={`${item.id}-${bullet}`}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </SectionBlock>
  );
};
