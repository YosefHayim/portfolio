import { memo } from "react";
import {
  FiBriefcase,
  FiCode,
  FiDownload,
} from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { QUICK_ACTIONS } from "@/data/chatContext";

type IconKey = "skills" | "projects" | "experience" | "contact" | "resume";

const ICON_MAP: Record<IconKey, React.ComponentType<{ size?: number }>> = {
  skills: FiCode,
  projects: FiCode,
  experience: FiBriefcase,
  contact: FiCode,
  resume: FiDownload,
};

type QuickActionsProps = {
  onAction: (prompt: string) => void;
  disabled: boolean;
  isMobile: boolean;
};

export const QuickActions = memo(
  ({ onAction, disabled, isMobile }: QuickActionsProps) => {
    const actionsToShow = QUICK_ACTIONS.slice(0, isMobile ? 2 : 3);

    return (
      <div className="mb-2 flex flex-wrap gap-1.5 sm:mb-3 sm:gap-2">
        {actionsToShow.map((action) => {
          const Icon = ICON_MAP[action.icon as IconKey];
          return (
            <Tooltip key={action.label}>
              <TooltipTrigger asChild>
                <button
                  className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-transparent px-2 py-1 text-[11px] whitespace-nowrap text-[var(--text-muted)] transition-colors hover:border-[#05df72]/50 hover:text-[#05df72] disabled:opacity-50 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
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
  },
);

QuickActions.displayName = "QuickActions";
