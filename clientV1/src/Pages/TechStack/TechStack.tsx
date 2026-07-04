import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import {
  FloatingTechIcons,
  type TechIconData,
} from '@/Components/ui/floating-tech-icons';
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaGithub,
  FaHtml5,
  FaCss3Alt,
  FaAws,
  FaPaypal,
} from 'react-icons/fa';
import { RiTailwindCssFill } from 'react-icons/ri';
import {
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiExpress,
  SiJest,
  SiGithubactions,
  SiFirebase,
  SiSupabase,
  SiAxios,
  SiReactquery,
  SiRedux,
  SiMui,
  SiStorybook,
  SiZod,
  SiJsonwebtokens,
  SiMongoose,
  SiEjs,
  SiJira,
  SiPostman,
  SiSocketdotio,
  SiShadcnui,
  SiReactrouter,
  SiGoogleauthenticator,
} from 'react-icons/si';
import { VscDebugAlt } from 'react-icons/vsc';
import { TbBrandReactNative } from 'react-icons/tb';
import { BsFiletypeSql } from 'react-icons/bs';

const STAGGER_DELAY = 0.05;

type TechCategory = {
  name: string;
  color: string;
  techs: {
    name: string;
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  }[];
};

const categories: TechCategory[] = [
  {
    name: 'Programming Languages',
    color: '#fdc700',
    techs: [
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Python', icon: FaPython },
      { name: 'TypeScript', icon: SiTypescript },
    ],
  },
  {
    name: 'Frontend',
    color: '#05df72',
    techs: [
      { name: 'React', icon: FaReact },
      { name: 'React Native', icon: TbBrandReactNative },
      { name: 'HTML5', icon: FaHtml5 },
      { name: 'CSS3', icon: FaCss3Alt },
      { name: 'TailwindCSS', icon: RiTailwindCssFill },
      { name: 'Axios', icon: SiAxios },
      { name: 'Shadcn', icon: SiShadcnui },
      { name: 'React Router', icon: SiReactrouter },
      { name: 'Zustand', icon: FaReact },
      { name: 'React Query', icon: SiReactquery },
      { name: 'Redux', icon: SiRedux },
      { name: 'MUI', icon: SiMui },
      { name: 'Storybook', icon: SiStorybook },
      { name: 'Playwright', icon: VscDebugAlt },
      { name: 'Zod', icon: SiZod },
    ],
  },
  {
    name: 'Backend',
    color: '#00d9ff',
    techs: [
      { name: 'Node.js', icon: FaNodeJs },
      { name: 'Express', icon: SiExpress },
      { name: 'JWT', icon: SiJsonwebtokens },
      { name: 'Mongoose', icon: SiMongoose },
      { name: 'PayPal API', icon: FaPaypal },
      { name: 'Google Auth', icon: SiGoogleauthenticator },
      { name: 'EJS', icon: SiEjs },
      { name: 'Socket.io', icon: SiSocketdotio },
    ],
  },
  {
    name: 'Databases',
    color: '#a855f7',
    techs: [
      { name: 'SQL', icon: BsFiletypeSql },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'PostgreSQL', icon: SiPostgresql },
    ],
  },
  {
    name: 'Backend Platforms',
    color: '#f97316',
    techs: [
      { name: 'Firebase', icon: SiFirebase },
      { name: 'Supabase', icon: SiSupabase },
    ],
  },
  {
    name: 'DevOps',
    color: '#ec4899',
    techs: [
      { name: 'GitHub Actions', icon: SiGithubactions },
      { name: 'AWS', icon: FaAws },
      { name: 'Docker', icon: FaDocker },
    ],
  },
  {
    name: 'Skills & Tools',
    color: '#8b5cf6',
    techs: [
      { name: 'Jira', icon: SiJira },
      { name: 'Git', icon: FaGithub },
      { name: 'Postman', icon: SiPostman },
      { name: 'Jest', icon: SiJest },
    ],
  },
];

const floatingIcons: TechIconData[] = [
  {
    id: 1,
    name: 'React',
    icon: FaReact,
    color: '#61DAFB',
    className: 'top-[8%] left-[8%]',
  },
  {
    id: 2,
    name: 'TypeScript',
    icon: SiTypescript,
    color: '#3178C6',
    className: 'top-[15%] right-[12%]',
  },
  {
    id: 3,
    name: 'Node.js',
    icon: FaNodeJs,
    color: '#339933',
    className: 'top-[75%] left-[10%]',
  },
  {
    id: 4,
    name: 'Python',
    icon: FaPython,
    color: '#3776AB',
    className: 'bottom-[12%] right-[8%]',
  },
  {
    id: 5,
    name: 'MongoDB',
    icon: SiMongodb,
    color: '#47A248',
    className: 'top-[5%] left-[35%]',
  },
  {
    id: 6,
    name: 'PostgreSQL',
    icon: SiPostgresql,
    color: '#4169E1',
    className: 'top-[8%] right-[35%]',
  },
  {
    id: 7,
    name: 'Docker',
    icon: FaDocker,
    color: '#2496ED',
    className: 'bottom-[10%] left-[25%]',
  },
  {
    id: 8,
    name: 'AWS',
    icon: FaAws,
    color: '#FF9900',
    className: 'top-[35%] left-[5%]',
  },
  {
    id: 9,
    name: 'TailwindCSS',
    icon: RiTailwindCssFill,
    color: '#06B6D4',
    className: 'top-[70%] right-[15%]',
  },
  {
    id: 10,
    name: 'Express',
    icon: SiExpress,
    color: '#ffffff',
    className: 'top-[88%] left-[60%]',
  },
  {
    id: 11,
    name: 'Firebase',
    icon: SiFirebase,
    color: '#FFCA28',
    className: 'top-[45%] right-[8%]',
  },
  {
    id: 12,
    name: 'Supabase',
    icon: SiSupabase,
    color: '#3ECF8E',
    className: 'top-[55%] left-[8%]',
  },
  {
    id: 13,
    name: 'GitHub',
    icon: FaGithub,
    color: '#ffffff',
    className: 'top-[5%] left-[55%]',
  },
  {
    id: 14,
    name: 'Redux',
    icon: SiRedux,
    color: '#764ABC',
    className: 'bottom-[8%] right-[40%]',
  },
  {
    id: 15,
    name: 'JavaScript',
    icon: SiJavascript,
    color: '#F7DF1E',
    className: 'top-[25%] left-[18%]',
  },
  {
    id: 16,
    name: 'React Native',
    icon: TbBrandReactNative,
    color: '#61DAFB',
    className: 'top-[60%] right-[30%]',
  },
  {
    id: 17,
    name: 'Jest',
    icon: SiJest,
    color: '#C21325',
    className: 'top-[20%] right-[25%]',
  },
  {
    id: 18,
    name: 'Playwright',
    icon: VscDebugAlt,
    color: '#45ba4b',
    className: 'bottom-[25%] left-[15%]',
  },
  {
    id: 19,
    name: 'Zod',
    icon: SiZod,
    color: '#3E67B1',
    className: 'top-[40%] left-[25%]',
  },
  {
    id: 20,
    name: 'Socket.io',
    icon: SiSocketdotio,
    color: '#ffffff',
    className: 'bottom-[15%] right-[20%]',
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const TechStack = () => {
  useEffect(() => {
    document.title = 'Tech Stack | Joseph Sabag';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatedPage className="flex w-full flex-col items-center pb-20">
      <FloatingTechIcons
        title="Tech Stack"
        subtitle="When I code and drink coffee, it is usually with these technologies"
        icons={floatingIcons}
        className="pt-16"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-16 grid w-full max-w-5xl gap-6 px-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map((category) => (
          <motion.section
            key={category.name}
            variants={itemVariants}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                {category.name}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 py-2">
              {category.techs.map((tech) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 transition-colors hover:border-[var(--border-hover)]"
                  >
                    <Icon size={14} style={{ color: category.color }} />
                    <span className="text-xs text-[var(--text-secondary)]">
                      {tech.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-[var(--text-dim)]">
          and always learning new tools to add to my arsenal...
        </p>
      </motion.div>
    </AnimatedPage>
  );
};

export default TechStack;
