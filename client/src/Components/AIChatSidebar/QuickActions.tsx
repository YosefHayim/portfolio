import { memo } from 'react';
import { FiBriefcase, FiCode, FiExternalLink } from 'react-icons/fi';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { QUICK_ACTIONS } from '@/data/chatContext';

type IconKey = 'skills' | 'projects' | 'experience' | 'contact' | 'resume';

const ICON_MAP: Record<IconKey, React.ComponentType<{ size?: number }>> = {
  skills: FiCode,
  projects: FiCode,
  experience: FiBriefcase,
  contact: FiCode,
  resume: FiExternalLink,
};

type QuickActionsProps = {
  onAction: (prompt: string) => void;
  disabled: boolean;
  isMobile: boolean;
};

export const QuickActions = memo(({ onAction, disabled, isMobile }: QuickActionsProps) => {
  const actionsToShow = QUICK_ACTIONS.slice(0, isMobile ? 2 : 3);

  return (
    <div className=" flex flex-wrap gap-2 sm:gap-2">
      {actionsToShow.map((action) => {
        const Icon = ICON_MAP[action.icon as IconKey];
        return (
          <Tooltip key={action.label}>
            <TooltipTrigger asChild={true}>
              <button
                className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-transparent p-2 p-2 text-[11px] whitespace-nowrap text-[var(--text-muted)] transition-colors hover:border-[#05df72]/50 hover:text-[#05df72] disabled:opacity-50 sm:gap-2 sm:p-2 sm:p-2 sm:text-xs"
                disabled={disabled}
                onClick={() => onAction(action.prompt)}
                type="button"
              >
                <Icon size={isMobile ? 10 : 12} />
                {action.label}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {action.prompt}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
});

QuickActions.displayName = 'QuickActions';
