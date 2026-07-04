import React from "react";
import { cx } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbProps {
  dimension?: string;
  className?: string;
  tones?: {
    base?: string;
    accent1?: string;
    accent2?: string;
    accent3?: string;
  };
  spinDuration?: number;
}

export const ColorOrb: React.FC<OrbProps> = ({
  dimension = "192px",
  className,
  tones,
  spinDuration = 20,
}) => {
  const fallbackTones = {
    base: "oklch(10% 0.02 264.695)",
    accent1: "oklch(75% 0.2 145)",
    accent2: "oklch(70% 0.15 195)",
    accent3: "oklch(78% 0.14 280)",
  };

  const palette = { ...fallbackTones, ...tones };

  const dimValue = Number.parseInt(dimension.replace("px", ""), 10);

  const blurStrength =
    dimValue < 50
      ? Math.max(dimValue * 0.008, 1)
      : Math.max(dimValue * 0.015, 4);

  const contrastStrength =
    dimValue < 50
      ? Math.max(dimValue * 0.004, 1.2)
      : Math.max(dimValue * 0.008, 1.5);

  const pixelDot =
    dimValue < 50
      ? Math.max(dimValue * 0.004, 0.05)
      : Math.max(dimValue * 0.008, 0.1);

  const shadowRange =
    dimValue < 50
      ? Math.max(dimValue * 0.004, 0.5)
      : Math.max(dimValue * 0.008, 2);

  const maskRadius =
    dimValue < 30
      ? "0%"
      : dimValue < 50
        ? "5%"
        : dimValue < 100
          ? "15%"
          : "25%";

  const adjustedContrast =
    dimValue < 30
      ? 1.1
      : dimValue < 50
        ? Math.max(contrastStrength * 1.2, 1.3)
        : contrastStrength;

  return (
    <div
      className={cn("color-orb", className)}
      style={
        {
          width: dimension,
          height: dimension,
          "--base": palette.base,
          "--accent1": palette.accent1,
          "--accent2": palette.accent2,
          "--accent3": palette.accent3,
          "--spin-duration": `${spinDuration}s`,
          "--blur": `${blurStrength}px`,
          "--contrast": adjustedContrast,
          "--dot": `${pixelDot}px`,
          "--shadow": `${shadowRange}px`,
          "--mask": maskRadius,
        } as React.CSSProperties
      }
    />
  );
};

const SPEED_FACTOR = 1;
const FORM_WIDTH = 360;
const FORM_HEIGHT = 240;

interface MorphPanelContextShape {
  showForm: boolean;
  successFlag: boolean;
  triggerOpen: () => void;
  triggerClose: () => void;
}

const FormContext = React.createContext({} as MorphPanelContextShape);
const useFormContext = () => React.useContext(FormContext);

interface MorphPanelProps {
  onSubmit?: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  title?: string;
}

export function MorphPanel({
  onSubmit,
  isLoading = false,
  placeholder = "Ask me anything about Joseph...",
  title = "Ask AI",
}: MorphPanelProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const [showForm, setShowForm] = React.useState(false);
  const [successFlag, setSuccessFlag] = React.useState(false);

  const triggerClose = React.useCallback(() => {
    setShowForm(false);
    textareaRef.current?.blur();
  }, []);

  const triggerOpen = React.useCallback(() => {
    setShowForm(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }, []);

  const handleSuccess = React.useCallback(() => {
    triggerClose();
    setSuccessFlag(true);
    setTimeout(() => setSuccessFlag(false), 1500);
  }, [triggerClose]);

  React.useEffect(() => {
    function clickOutsideHandler(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        showForm
      ) {
        triggerClose();
      }
    }
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => document.removeEventListener("mousedown", clickOutsideHandler);
  }, [showForm, triggerClose]);

  const ctx = React.useMemo(
    () => ({ showForm, successFlag, triggerOpen, triggerClose }),
    [showForm, successFlag, triggerOpen, triggerClose],
  );

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: FORM_WIDTH, height: FORM_HEIGHT }}
    >
      <motion.div
        ref={wrapperRef}
        data-panel
        className={cx(
          "relative z-3 flex flex-col items-center overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl max-sm:bottom-5",
        )}
        initial={false}
        animate={{
          width: showForm ? FORM_WIDTH : "auto",
          height: showForm ? FORM_HEIGHT : 48,
          borderRadius: showForm ? 16 : 24,
        }}
        transition={{
          type: "spring",
          stiffness: 550 / SPEED_FACTOR,
          damping: 45,
          mass: 0.7,
          delay: showForm ? 0 : 0.08,
        }}
      >
        <FormContext.Provider value={ctx}>
          <DockBar title={title} />
          <InputForm
            ref={textareaRef}
            onSubmit={onSubmit}
            onSuccess={handleSuccess}
            isLoading={isLoading}
            placeholder={placeholder}
          />
        </FormContext.Provider>
      </motion.div>
    </div>
  );
}

function DockBar({ title }: { title: string }) {
  const { showForm, triggerOpen } = useFormContext();
  return (
    <footer className="mt-auto flex h-[48px] items-center justify-center whitespace-nowrap select-none">
      <div className="flex items-center justify-center gap-2 px-3 max-sm:h-10 max-sm:px-2">
        <div className="flex w-fit items-center gap-2">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="blank"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className="h-6 w-6"
              />
            ) : (
              <motion.div
                key="orb"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ColorOrb
                  dimension="28px"
                  tones={{
                    base: "oklch(10% 0.02 145)",
                    accent1: "oklch(80% 0.25 145)",
                    accent2: "oklch(70% 0.2 195)",
                    accent3: "oklch(75% 0.18 280)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="flex h-fit flex-1 justify-end rounded-full px-3 py-1 text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[#05df72]"
          onClick={triggerOpen}
        >
          <span className="truncate text-sm font-medium">{title}</span>
        </button>
      </div>
    </footer>
  );
}

interface InputFormProps {
  ref: React.Ref<HTMLTextAreaElement>;
  onSubmit?: (message: string) => void;
  onSuccess: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

function InputForm({
  ref,
  onSubmit,
  onSuccess,
  isLoading,
  placeholder,
}: InputFormProps) {
  const { triggerClose, showForm } = useFormContext();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onSubmit?.(message.trim());
    setMessage("");
    onSuccess();
  }

  function handleKeys(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") triggerClose();
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      btnRef.current?.click();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-0"
      style={{
        width: FORM_WIDTH,
        height: FORM_HEIGHT,
        pointerEvents: showForm ? "all" : "none",
      }}
    >
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 550 / SPEED_FACTOR,
              damping: 45,
              mass: 0.7,
            }}
            className="flex h-full flex-col p-2"
          >
            <div className="flex items-center justify-between py-1 px-1">
              <p className="z-2 ml-[38px] flex items-center gap-[6px] text-sm font-medium text-[var(--text-primary)] select-none">
                AI Assistant
              </p>
              <button
                type="submit"
                ref={btnRef}
                disabled={!message.trim() || isLoading}
                className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#05df72] px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-[#04c566] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <KeyHint>Enter</KeyHint>
              </button>
            </div>
            <textarea
              ref={ref}
              placeholder={placeholder}
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-full w-full resize-none scroll-py-2 rounded-lg bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:ring-1 focus:ring-[#05df72]/50"
              required
              onKeyDown={handleKeys}
              spellCheck={false}
              disabled={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-3 left-3"
          >
            <ColorOrb
              dimension="28px"
              tones={{
                base: "oklch(10% 0.02 145)",
                accent1: "oklch(80% 0.25 145)",
                accent2: "oklch(70% 0.2 195)",
                accent3: "oklch(75% 0.18 280)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function KeyHint({ children, className }: { children: string; className?: string }) {
  return (
    <kbd
      className={cx(
        "flex h-5 w-fit items-center justify-center rounded-sm border border-black/20 px-1.5 font-sans text-[10px]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export default MorphPanel;
