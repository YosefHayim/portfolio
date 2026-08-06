import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { getTechIcon } from '@/utils/techIcons';

// Raw row example: "React Query/Node" -> ["React", "Query", "Node"]
const FALLBACK_INITIAL_SPLIT_PATTERN = /[\s/-]+/;

/**
 * Builds compact initials for technology chips without known icons.
 *
 * @param label - Technology or project label from profile/project data.
 * @returns Up to two uppercase initials, or an empty string when the label is empty.
 * @example
 * getFallbackInitials('React Query') // 'RQ'
 */
const getFallbackInitials = (label: string): string => {
  const trimmedLabel = label.trim();

  if (trimmedLabel.length === 0) {
    return '';
  }

  const parts = trimmedLabel.split(FALLBACK_INITIAL_SPLIT_PATTERN);
  const initials: string[] = [];

  for (const part of parts.slice(0, 2)) {
    const [firstLetter] = part;

    if (firstLetter !== undefined) {
      initials.push(firstLetter.toUpperCase());
    }
  }

  return initials.join('');
};

export const TechIconChip = ({ tech }: { tech: string }) => {
  const icon = getTechIcon(tech);
  const fallbackLabel = getFallbackInitials(tech);

  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <span
          aria-label={tech}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-void)]/50 text-[var(--text-secondary)]"
        >
          {icon ?? <span className="font-semibold text-[10px]">{fallbackLabel || '?'}</span>}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        {tech}
      </TooltipContent>
    </Tooltip>
  );
};
