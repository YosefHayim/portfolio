import { motion } from 'framer-motion';
import { FiBriefcase, FiAward, FiBook, FiShield } from 'react-icons/fi';
import { IoSchoolOutline } from 'react-icons/io5';

const ICON_SIZE = 16;
const STAGGER_DELAY = 0.1;

const journeyData = [
  {
    year: '2025 - Present',
    title: 'Predicto AI',
    role: 'Frontend & Automation Developer',
    description:
      'Building the frontend with React, Zod, Tailwind. CI/CD pipelines with Jest and RTL. Leading QA efforts.',
    icon: FiBriefcase,
    color: '#05df72',
  },
  {
    year: 'Feb - Apr 2025',
    title: 'Wotch Health Startup',
    role: 'Internship',
    description:
      'Built real-time debugger, E2E tests with Playwright. WebSocket automation infrastructure.',
    icon: FiBriefcase,
    color: '#05df72',
  },
  {
    year: '2025 - Present',
    title: 'Open University of Israel',
    role: 'B.Sc. Computer Science',
    description: 'Pursuing degree while working full-time.',
    icon: IoSchoolOutline,
    color: '#00d9ff',
  },
  {
    year: '2024 - 2025',
    title: 'IITC College',
    role: 'Fullstack Bootcamp',
    description:
      'Graduated with excellence. 796-hour program. GPA 93. React, Node.js, MongoDB.',
    icon: FiAward,
    color: '#fdc700',
    highlight: true,
  },
  {
    year: '2021 - 2024',
    title: 'IDF - 931st Battalion',
    role: 'Combat Commander',
    description:
      'Top 10 in training. Excellence awards in both basic training and Commanders Course.',
    icon: FiShield,
    color: '#fdc700',
    highlight: true,
  },
  {
    year: '2012 - 2018',
    title: 'Peres Campus',
    role: 'High School Diploma',
    description: 'High-tech oriented program. Full Bagrut Certificate.',
    icon: FiBook,
    color: '#71717a',
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
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const MyJourney = () => {
  return (
    <section className="w-full">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center text-2xl font-medium text-[var(--text-primary)]"
      >
        My Journey
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="relative"
      >
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-[#05df72] via-[var(--border-default)] to-transparent md:left-1/2" />

        {journeyData.map((item, index) => {
          const Icon = item.icon;
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className={`relative mb-8 flex w-full ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
            >
              <div
                className={`w-full pl-8 md:w-[45%] md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}
              >
                <div
                  className={`group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 transition-all hover:border-[var(--border-hover)] ${item.highlight ? 'ring-1 ring-[#fdc700]/20' : ''}`}
                >
                  <div
                    className={`mb-3 flex items-center gap-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}
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
                className="absolute top-6 left-0 -ml-1 size-2 rounded-full md:left-1/2 md:ml-0 md:-translate-x-1/2"
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
