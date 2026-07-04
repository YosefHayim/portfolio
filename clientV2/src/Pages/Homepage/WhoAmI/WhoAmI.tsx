import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiArrowRight, FiTerminal } from "react-icons/fi";
import { Link } from "react-router";
import { useInView } from "@/hooks/useInView";

const TYPING_DELAY = 100;
const LINE_STAGGER = 0.12;
const LINE_STAGGER_MS_MULTIPLIER = 1000;
const CURSOR_BLINK_DURATION = 0.8;

const lines = [
  { label: "name", value: "Joseph Sabag" },
  { label: "role", value: "Software Developer @Predicto AI" },
  { label: "focus", value: "Backend architecture & API integrations" },
  {
    label: "stack",
    value: "React, Node, TypeScript, JavaScript",
    link: "/techStack",
  },
  { label: "motto", value: "Trying to get better", highlight: "everyday" },
];

const WhoAmI = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  useEffect(() => {
    if (isInView && visibleLines < lines.length) {
      const timer = setTimeout(
        () => setVisibleLines((prev) => prev + 1),
        TYPING_DELAY + visibleLines * LINE_STAGGER * LINE_STAGGER_MS_MULTIPLIER,
      );
      return () => clearTimeout(timer);
    }
  }, [isInView, visibleLines]);

  return (
    <motion.div
      className="w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      ref={ref}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
          <FiTerminal className="text-[#05df72]" size={14} />
          <span className="text-xs text-[var(--text-muted)]">about.js</span>
        </div>

        <div className="space-y-1 p-4 font-mono text-sm">
          <div className="text-[var(--text-muted)]">
            {"const"} <span className="text-[#05df72]">joseph</span> {"= {"}
          </div>

          {lines.map((line, index) => (
            <motion.div
              animate={index < visibleLines ? { opacity: 1, x: 0 } : {}}
              className="pl-4"
              initial={{ opacity: 0, x: -10 }}
              key={line.label}
              transition={{ duration: 0.3, delay: index * LINE_STAGGER }}
            >
              <span className="text-[var(--text-secondary)]">{line.label}</span>
              <span className="text-[var(--text-muted)]">: </span>
              <span className="text-[var(--text-primary)]">
                "{line.value}
                {line.highlight && (
                  <span className="font-semibold text-[#05df72]">
                    {" "}
                    {line.highlight}
                  </span>
                )}
                "
              </span>
              {line.link && (
                <Link
                  className="ml-2 inline-flex items-center gap-1 text-[var(--text-muted)] transition-colors hover:text-[#05df72]"
                  to={line.link}
                >
                  <FiArrowRight size={12} />
                </Link>
              )}
              <span className="text-[var(--text-muted)]">,</span>
            </motion.div>
          ))}

          <div className="text-[var(--text-muted)]">{"};"}</div>

          {visibleLines >= lines.length && (
            <motion.div
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0 }}
            >
              <span className="text-[var(--text-muted)]">{">"}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                className="h-4 w-1.5 bg-[#05df72]"
                transition={{
                  duration: CURSOR_BLINK_DURATION,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WhoAmI;
