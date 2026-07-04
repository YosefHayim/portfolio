import { motion } from "framer-motion";
import { FiAward, FiBook, FiBriefcase, FiShield } from "react-icons/fi";
import { IoSchoolOutline } from "react-icons/io5";

const ICON_SIZE = 16;
const STAGGER_DELAY = 0.1;

const journeyData = [
  {
    year: "Jul 2025 - Present",
    title: "Predicto AI",
    role: "Software Developer",
    description:
      "Design, develop, and maintain user-facing features. Manage QA automation, frontend development, and SQL-based data validation for AI-driven systems.",
    icon: FiBriefcase,
    color: "#05df72",
  },
  {
    year: "Feb - Apr 2025",
    title: "Wotch Health",
    role: "Full Stack Engineer Intern",
    description:
      "Built real-time debugging tool with React, TypeScript, and WebSockets. UI tests with Playwright/Storybook.",
    icon: FiBriefcase,
    color: "#05df72",
  },
  {
    year: "Oct 2025 - Present",
    title: "Open University of Israel",
    role: "B.Sc. Computer Science",
    description: "Pursuing degree while working full-time.",
    icon: IoSchoolOutline,
    color: "#00d9ff",
  },
  {
    year: "Jul 2024 - Mar 2025",
    title: "IITC College",
    role: "Fullstack Bootcamp",
    description:
      "Graduated with excellence. 795-hour program plus 5 BE courses in Python. GPA 93.",
    icon: FiAward,
    color: "#fdc700",
    highlight: true,
  },
  {
    year: "Nov 2018 - Jul 2021",
    title: "IDF - Gdud 931",
    role: "Infantry Commander",
    description:
      "Served as combat soldier, graduating top of class. Two excellence awards in basic training and Commanders Course.",
    icon: FiShield,
    color: "#fdc700",
    highlight: true,
  },
  {
    year: "2012 - 2018",
    title: "Peres Campus",
    role: "High School Diploma",
    description: "High-tech oriented program. Full Bagrut Certificate.",
    icon: FiBook,
    color: "#71717a",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const MyJourney = () => {
  return (
    <section className="w-full">
      <motion.h2
        className="py-12 text-center text-2xl font-medium text-[var(--text-primary)]"
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        My Journey
      </motion.h2>

      <motion.div
        className="relative flex flex-col gap-4"
        initial="hidden"
        variants={containerVariants}
        viewport={{ once: true, margin: "-50px" }}
        whileInView="visible"
      >
        <div className="absolute top-0 left-[3px] h-full w-px bg-gradient-to-b from-[#05df72] via-[var(--border-default)] to-transparent md:left-1/2" />

        {journeyData.map((item, index) => {
          const Icon = item.icon;
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              className={`relative mb-8 flex w-full ${isLeft ? "md:justify-start" : "md:justify-end"}`}
              key={item.title}
              variants={itemVariants}
            >
              <div
                className={`w-full pl-8 md:w-[45%] md:pl-0 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}
              >
                <div
                  className={`group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 transition-all hover:border-[var(--border-hover)] ${item.highlight ? "ring-1 ring-[#fdc700]/20" : ""}`}
                >
                  <div
                    className={`mb-3 flex items-center gap-3 ${isLeft ? "md:flex-row-reverse" : ""}`}
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon size={ICON_SIZE} style={{ color: item.color }} />
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="mb-1 font-medium text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mb-2 text-sm" style={{ color: item.color }}>
                    {item.role}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </div>
              </div>

              <div
                className="absolute top-6 left-0 size-2 rounded-full md:left-1/2 md:-translate-x-1/2"
                style={{ backgroundColor: item.color }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default MyJourney;
