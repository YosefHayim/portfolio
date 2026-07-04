import { FaReact, FaJs, FaTheaterMasks } from 'react-icons/fa';
import { RiTailwindCssFill } from 'react-icons/ri';
import {
  SiTypescript,
  SiAxios,
  SiShadcnui,
  SiReactrouter,
  SiReactquery,
  SiRedux,
  SiMui,
  SiStorybook,
  SiHtml5,
  SiZod,
} from 'react-icons/si';
import TechRow from '../TechRow/TechRow';
import { IoLogoCss3 } from 'react-icons/io5';
import { GiBearFace } from 'react-icons/gi';

const TechStack = [
  { name: 'React', icon: <FaReact size={20} /> },
  { name: 'React Native', icon: <FaReact size={20} /> },
  { name: 'HTML', icon: <SiHtml5 size={20} /> },
  { name: 'CSS', icon: <IoLogoCss3 size={20} /> },
  { name: 'TypeScript', icon: <SiTypescript size={20} /> },
  { name: 'Tailwind', icon: <RiTailwindCssFill size={20} /> },
  { name: 'JavaScript', icon: <FaJs size={20} /> },
  { name: 'Axios', icon: <SiAxios size={20} /> },
  { name: 'Shadcn UI', icon: <SiShadcnui size={20} /> },
  { name: 'React Router', icon: <SiReactrouter size={20} /> },
  { name: 'Zustand', icon: <GiBearFace size={20} /> },
  { name: 'React Query', icon: <SiReactquery size={20} /> },
  { name: 'Redux', icon: <SiRedux size={20} /> },
  { name: 'Mui', icon: <SiMui size={20} /> },
  { name: 'Storybook', icon: <SiStorybook size={20} /> },
  { name: 'Playwright', icon: <FaTheaterMasks size={20} /> },
  {
    name: 'Zod', icon: <SiZod size={20} />
  }
];

const Fronted = () => {
  return (
    <div className="w-full">
      <h2 className="pb-2">Frontend</h2>
      <div className="flex flex-wrap items-center justify-start gap-2 rounded-sm bg-gray-800 p-4">
        {TechStack.map((tech, index) => (
          <TechRow key={index} techName={tech.name}>
            {tech.icon}
          </TechRow>
        ))}
      </div>
    </div>
  );
};

export default Fronted;
