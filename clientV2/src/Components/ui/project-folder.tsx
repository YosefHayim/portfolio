import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  X,
} from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { TechBadge } from "@/utils/techIcons";

export type ProjectStatus = "live" | "development" | "completed";

export interface FolderProject {
  id: string;
  image: string;
  title: string;
  description?: string;
  techStack?: string[];
  deployedUrl?: string;
  repoUrl?: string;
  status?: ProjectStatus | ProjectStatus[];
}

const getStatusArray = (status: ProjectStatus | ProjectStatus[] | undefined): ProjectStatus[] => {
  if (!status) return [];
  return Array.isArray(status) ? status : [status];
};

const statusConfig: Record<ProjectStatus, { label: string; className: string; dot: string }> = {
  live: {
    label: "Live",
    className: "bg-[#05df72]/20 text-[#05df72]",
    dot: "bg-[#05df72]",
  },
  development: {
    label: "In Progress",
    className: "bg-[#fdc700]/20 text-[#fdc700]",
    dot: "bg-[#fdc700]",
  },
  completed: {
    label: "Completed",
    className: "bg-[#00d9ff]/20 text-[#00d9ff]",
    dot: "bg-[#00d9ff]",
  },
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200";

const CARD_ROTATION_FACTOR = 25;
const CARD_TRANSLATION_X_FACTOR = 85;
const CARD_TRANSLATION_Y_FACTOR = 12;
const ANIMATION_DURATION = 700;
const CARD_DELAY_INCREMENT = 50;
const MAX_PREVIEW_PROJECTS = 5;

interface ProjectCardProps {
  image: string;
  title: string;
  delay: number;
  isVisible: boolean;
  index: number;
  totalCount: number;
  onClick: () => void;
  isSelected: boolean;
  techStack?: string[];
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  (
    {
      image,
      title,
      delay,
      isVisible,
      index,
      totalCount,
      onClick,
      isSelected,
      techStack,
    },
    ref,
  ) => {
    const [showTech, setShowTech] = useState(false);
    const middleIndex = (totalCount - 1) / 2;
    const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;

    const rotation = factor * CARD_ROTATION_FACTOR;
    const translationX = factor * CARD_TRANSLATION_X_FACTOR;
    const translationY = Math.abs(factor) * CARD_TRANSLATION_Y_FACTOR;

    return (
      <div
        className={cn(
          "group/card absolute h-28 w-20 cursor-pointer",
          isSelected && "opacity-0",
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setShowTech(true)}
        onMouseLeave={() => setShowTech(false)}
        ref={ref}
        style={{
          transform: isVisible
            ? `translateY(calc(-100px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all ${ANIMATION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          zIndex: 10 + index,
          left: "-40px",
          top: "-56px",
        }}
      >
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl",
            "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover/card:-translate-y-6 group-hover/card:scale-125 group-hover/card:shadow-2xl group-hover/card:ring-2 group-hover/card:shadow-[#05df72]/40 group-hover/card:ring-[#05df72]",
          )}
        >
          <img
            alt={title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
            src={image || PLACEHOLDER_IMAGE}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <p className="absolute right-1.5 bottom-1.5 left-1.5 truncate text-[9px] font-black tracking-tighter text-white uppercase drop-shadow-md">
            {title}
          </p>
        </div>

        {showTech && techStack && techStack.length > 0 && (
          <div
            className="fade-in zoom-in-95 animate-in absolute -top-20 left-1/2 z-50 -translate-x-1/2 duration-200"
            style={{ width: "max-content", maxWidth: "200px" }}
          >
            <div className="flex flex-wrap justify-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]/95 p-2 shadow-xl backdrop-blur-sm">
              {techStack.slice(0, 6).map((tech) => (
                <span
                  className="rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-[8px] font-medium text-[var(--text-secondary)]"
                  key={tech}
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 6 && (
                <span className="rounded-full bg-[#05df72]/20 px-2 py-0.5 text-[8px] font-medium text-[#05df72]">
                  +{techStack.length - 6}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-r border-b border-[var(--border-subtle)] bg-[var(--bg-card)]" />
          </div>
        )}
      </div>
    );
  },
);
ProjectCard.displayName = "ProjectCard";

interface ImageLightboxProps {
  projects: FolderProject[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
}

const ImageLightbox = ({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
}: ImageLightboxProps) => {
  const [animationPhase, setAnimationPhase] = useState<
    "initial" | "animating" | "complete"
  >("initial");
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [isSliding, setIsSliding] = useState(false);
  const [showAllTech, setShowAllTech] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalProjects = projects.length;
  const hasNext = internalIndex < totalProjects - 1;
  const hasPrev = internalIndex > 0;
  const currentProject = projects[internalIndex];

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      setIsSliding(true);
      const timer = setTimeout(() => {
        setInternalIndex(currentIndex);
        setIsSliding(false);
      }, 400);
      return () => clearTimeout(timer);
    }
    return;
  }, [currentIndex, isOpen, internalIndex, isSliding]);

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex);
      setIsSliding(false);
      setShowAllTech(false);
    }
  }, [isOpen, currentIndex]);

  useEffect(() => {
    setShowAllTech(false);
  }, [internalIndex]);

  const navigateNext = useCallback(() => {
    if (internalIndex >= totalProjects - 1 || isSliding) {
      return;
    }
    onNavigate(internalIndex + 1);
  }, [internalIndex, totalProjects, isSliding, onNavigate]);

  const navigatePrev = useCallback(() => {
    if (internalIndex <= 0 || isSliding) {
      return;
    }
    onNavigate(internalIndex - 1);
  }, [internalIndex, isSliding, onNavigate]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
    setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      setAnimationPhase("initial");
      onCloseComplete?.();
    }, 500);
  }, [onClose, onCloseComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        return;
      }
      if (e.key === "Escape") {
        handleClose();
      }
      if (e.key === "ArrowRight") {
        navigateNext();
      }
      if (e.key === "ArrowLeft") {
        navigatePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose, navigateNext, navigatePrev]);

  useLayoutEffect(() => {
    if (isOpen && sourceRect) {
      setShouldRender(true);
      setAnimationPhase("initial");
      setIsClosing(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase("animating");
        });
      });
      const timer = setTimeout(() => {
        setAnimationPhase("complete");
      }, 700);
      return () => clearTimeout(timer);
    }
    return;
  }, [isOpen, sourceRect]);

  const handleDotClick = (idx: number) => {
    if (isSliding || idx === internalIndex) {
      return;
    }
    onNavigate(idx);
  };

  if (!(shouldRender && currentProject)) {
    return null;
  }

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) {
      return {};
    }
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetWidth = Math.min(800, viewportWidth - 64);
    const targetHeight = Math.min(viewportHeight * 0.85, 600);
    const targetX = (viewportWidth - targetWidth) / 2;
    const targetY = (viewportHeight - targetHeight) / 2;
    const scaleX = sourceRect.width / targetWidth;
    const scaleY = sourceRect.height / targetHeight;
    const scale = Math.max(scaleX, scaleY);
    const translateX =
      sourceRect.left +
      sourceRect.width / 2 -
      (targetX + targetWidth / 2) +
      window.scrollX;
    const translateY =
      sourceRect.top +
      sourceRect.height / 2 -
      (targetY + targetHeight / 2) +
      window.scrollY;
    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      opacity: 0.5,
      borderRadius: "12px",
    };
  };

  const getFinalStyles = (): React.CSSProperties => ({
    transform: "translate(0, 0) scale(1)",
    opacity: 1,
    borderRadius: "24px",
  });

  const currentStyles =
    animationPhase === "initial" && !isClosing
      ? getInitialStyles()
      : getFinalStyles();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8",
      )}
      onClick={handleClose}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="absolute inset-0 bg-[var(--bg-void)]/95 backdrop-blur-2xl"
        style={{
          opacity: animationPhase === "initial" && !isClosing ? 0 : 1,
          transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <button
        className="absolute top-6 right-6 z-50 flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 text-[var(--text-primary)] shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-[var(--bg-elevated)]"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        style={{
          opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
          transform:
            animationPhase === "complete" && !isClosing
              ? "translateY(0)"
              : "translateY(-30px)",
          transition:
            "opacity 400ms ease-out 400ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 400ms",
        }}
        type="button"
      >
        <X className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <button
        className="absolute left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 text-[var(--text-primary)] shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:left-10"
        disabled={!hasPrev || isSliding}
        onClick={(e) => {
          e.stopPropagation();
          navigatePrev();
        }}
        style={{
          opacity:
            animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0,
          transform:
            animationPhase === "complete" && !isClosing
              ? "translateX(0)"
              : "translateX(-40px)",
          transition:
            "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms",
        }}
        type="button"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={3} />
      </button>

      <button
        className="absolute right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 text-[var(--text-primary)] shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-0 md:right-10"
        disabled={!hasNext || isSliding}
        onClick={(e) => {
          e.stopPropagation();
          navigateNext();
        }}
        style={{
          opacity:
            animationPhase === "complete" && !isClosing && hasNext ? 1 : 0,
          transform:
            animationPhase === "complete" && !isClosing
              ? "translateX(0)"
              : "translateX(40px)",
          transition:
            "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms",
        }}
        type="button"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={3} />
      </button>

      <div
        className="relative z-10 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
        style={{
          ...currentStyles,
          transform: isClosing
            ? "translate(0, 0) scale(0.92)"
            : currentStyles.transform,
          transition:
            animationPhase === "initial" && !isClosing
              ? "none"
              : "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-out, border-radius 700ms ease",
          transformOrigin: "center center",
        }}
      >
        <div className="relative flex max-h-[85vh] flex-col overflow-hidden rounded-[inherit] border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] md:max-h-none">
          <div className="relative min-h-0 flex-1 overflow-hidden md:aspect-[16/10] md:flex-none">
            <div
              className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `translateX(-${internalIndex * 100}%)`,
                transition: isSliding
                  ? "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)"
                  : "none",
              }}
            >
              {projects.map((project) => (
                <div className="relative h-full min-w-full" key={project.id}>
                  <img
                    alt={project.title}
                    className="h-full w-full object-contain select-none md:object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                    }}
                    src={project.image || PLACEHOLDER_IMAGE}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                </div>
              ))}
            </div>
          </div>

          <div
            className="border-t border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5 lg:px-8 lg:py-6"
            style={{
              opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
              transform:
                animationPhase === "complete" && !isClosing
                  ? "translateY(0)"
                  : "translateY(40px)",
              transition:
                "opacity 500ms ease-out 500ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 500ms",
            }}
          >
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-2 sm:mb-2 sm:gap-3">
                  <h3 className="truncate text-base font-bold tracking-tight text-[var(--text-primary)] sm:text-lg md:text-xl lg:text-2xl">
                    {currentProject?.title}
                  </h3>
                  {currentProject?.status && getStatusArray(currentProject.status).map((s) => {
                    const config = statusConfig[s];
                    return (
                      <span
                        key={s}
                        className={cn(
                          "shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-semibold uppercase sm:px-2 sm:text-[10px]",
                          config.className,
                        )}
                      >
                        {config.label}
                      </span>
                    );
                  })}
                </div>

                {currentProject?.description && (
                  <p className="mb-2 line-clamp-1 text-xs text-[var(--text-muted)] sm:mb-3 sm:line-clamp-2 sm:text-sm">
                    {currentProject.description}
                  </p>
                )}

                {currentProject?.techStack &&
                  currentProject.techStack.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1 sm:mb-3 sm:gap-1.5">
                      {(showAllTech
                        ? currentProject.techStack
                        : currentProject.techStack.slice(0, 4)
                      ).map((tech) => (
                        <TechBadge key={tech} tech={tech} />
                      ))}
                      {currentProject.techStack.length > 4 && (
                        <button
                          className="cursor-pointer rounded-full bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] transition-all hover:bg-[#05df72]/20 hover:text-[#05df72] sm:px-2 sm:text-xs"
                          onClick={() => setShowAllTech(!showAllTech)}
                          type="button"
                        >
                          {showAllTech
                            ? "Show less"
                            : `+${currentProject.techStack.length - 4}`}
                        </button>
                      )}
                    </div>
                  )}

                <div className="flex flex-wrap items-center gap-2 pt-4 sm:gap-3 md:gap-4">
                  <div className="flex flex-wrap items-center gap-1 rounded-2xl bg-[var(--bg-surface)] px-1.5 py-1 sm:gap-1.5 sm:px-2 sm:py-1 md:gap-2 md:px-2.5">
                    {projects.map((_, idx) => (
                      <button
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full transition-all duration-500 sm:h-2.5 sm:w-2.5",
                          idx === internalIndex
                            ? "bg-[#05df72]"
                            : "bg-[var(--text-muted)]/30 hover:bg-[var(--text-muted)]/60",
                        )}
                        key={`dot-${projects[idx].id}`}
                        onClick={() => handleDotClick(idx)}
                        type="button"
                      />
                    ))}
                  </div>
                  <p className="text-[8px] font-bold tracking-widest text-[var(--text-muted)]/60 uppercase sm:text-[10px] md:text-xs">
                    {internalIndex + 1} / {totalProjects}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {currentProject?.repoUrl && (
                  <a
                    className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] sm:text-sm"
                    href={currentProject.repoUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Github className="h-4 w-4" />
                    <span className="hidden sm:inline">Code</span>
                  </a>
                )}
                <Link
                  className="flex items-center gap-1.5 text-xs font-medium text-[#05df72] transition-colors hover:text-[#04c566] sm:text-sm"
                  to={`/projects/${currentProject?.id}`}
                >
                  <span>View Project</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AnimatedFolderProps {
  title: string;
  projects: FolderProject[];
  className?: string;
  gradient?: string;
  forceHover?: boolean;
}

export const AnimatedFolder = ({
  title,
  projects,
  className,
  gradient,
  forceHover = false,
}: AnimatedFolderProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const showHoverEffect = isHovered || forceHover;
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const previewProjects = projects.slice(0, MAX_PREVIEW_PROJECTS);

  const handleProjectClick = (project: FolderProject, index: number) => {
    const cardEl = cardRefs.current[index];
    if (cardEl) {
      setSourceRect(cardEl.getBoundingClientRect());
    }
    setSelectedIndex(index);
    setHiddenCardId(project.id);
  };

  const handleCloseLightbox = () => {
    setSelectedIndex(null);
    setSourceRect(null);
  };

  const handleCloseComplete = () => {
    setHiddenCardId(null);
  };

  const handleNavigate = (newIndex: number) => {
    setSelectedIndex(newIndex);
    setHiddenCardId(projects[newIndex]?.id || null);
  };

  const defaultGradient = "linear-gradient(135deg, #1a1f2e 0%, #0f1115 100%)";
  const backBg = gradient || defaultGradient;
  const tabBg = gradient || "var(--bg-elevated)";
  const frontBg =
    gradient || "linear-gradient(135deg, #1c1f26 0%, #12141a 100%)";

  return (
    <>
      <div
        className={cn(
          "group relative flex min-h-[320px] min-w-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#05df72]/40 hover:shadow-2xl hover:shadow-[#05df72]/10",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          perspective: "1200px",
          transform: showHoverEffect
            ? "scale(1.04) rotate(-1.5deg)"
            : "scale(1) rotate(0deg)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-700"
          style={{
            background: gradient
              ? `radial-gradient(circle at 50% 70%, ${gradient.match(/#[a-fA-F0-9]{3,6}/)?.[0] || "#05df72"} 0%, transparent 70%)`
              : "radial-gradient(circle at 50% 70%, #05df72 0%, transparent 70%)",
            opacity: showHoverEffect ? 0.12 : 0,
          }}
        />

        <div
          className="relative mb-4 flex items-center justify-center"
          style={{ height: "160px", width: "200px" }}
        >
          <div
            className="absolute h-24 w-32 rounded-lg border border-[var(--border-subtle)] shadow-md"
            style={{
              background: backBg,
              filter: gradient ? "brightness(0.9)" : "none",
              transformOrigin: "bottom center",
              transform: showHoverEffect
                ? "rotateX(-20deg) scaleY(1.05)"
                : "rotateX(0deg) scaleY(1)",
              transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 10,
            }}
          />

          <div
            className="absolute h-4 w-12 rounded-t-md border-x border-t border-[var(--border-subtle)]"
            style={{
              background: tabBg,
              filter: gradient ? "brightness(0.85)" : "none",
              top: "calc(50% - 48px - 12px)",
              left: "calc(50% - 64px + 16px)",
              transformOrigin: "bottom center",
              transform: showHoverEffect
                ? "rotateX(-30deg) translateY(-3px)"
                : "rotateX(0deg) translateY(0)",
              transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 10,
            }}
          />

          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
          >
            {previewProjects.map((project, index) => (
              <ProjectCard
                delay={index * CARD_DELAY_INCREMENT}
                image={project.image}
                index={index}
                isSelected={hiddenCardId === project.id}
                isVisible={showHoverEffect}
                key={project.id}
                onClick={() => handleProjectClick(project, index)}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                techStack={project.techStack}
                title={project.title}
                totalCount={previewProjects.length}
              />
            ))}
          </div>

          <div
            className="absolute h-24 w-32 rounded-lg border border-[var(--border-subtle)]/20 shadow-lg"
            style={{
              background: frontBg,
              top: "calc(50% - 48px + 4px)",
              transformOrigin: "bottom center",
              transform: showHoverEffect
                ? "rotateX(35deg) translateY(12px)"
                : "rotateX(0deg) translateY(0)",
              transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 30,
            }}
          />

          <div
            className="pointer-events-none absolute h-24 w-32 overflow-hidden rounded-lg"
            style={{
              top: "calc(50% - 48px + 4px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)",
              transformOrigin: "bottom center",
              transform: showHoverEffect
                ? "rotateX(35deg) translateY(12px)"
                : "rotateX(0deg) translateY(0)",
              transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 31,
            }}
          />
        </div>

        <div className="text-center">
          <h3
            className="mt-4 text-lg font-bold text-[var(--text-primary)] transition-all duration-500"
            style={{
              transform: showHoverEffect ? "translateY(2px)" : "translateY(0)",
              letterSpacing: showHoverEffect ? "-0.01em" : "0",
            }}
          >
            {title}
          </h3>
          <p
            className="text-sm font-medium text-[var(--text-muted)] transition-all duration-500"
            style={{ opacity: showHoverEffect ? 0.8 : 1 }}
          >
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>

        <div
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-xs font-semibold tracking-widest text-[var(--text-muted)]/50 uppercase transition-all duration-500"
          style={{
            opacity: showHoverEffect ? 0 : 1,
            transform: showHoverEffect ? "translateY(10px)" : "translateY(0)",
          }}
        >
          <span>Hover</span>
        </div>
      </div>

      <ImageLightbox
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={handleCloseLightbox}
        onCloseComplete={handleCloseComplete}
        onNavigate={handleNavigate}
        projects={projects}
        sourceRect={sourceRect}
      />
    </>
  );
};
