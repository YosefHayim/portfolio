import { FaJs } from 'react-icons/fa';
import { SiPython } from 'react-icons/si';
import TechRow from '../TechRow/TechRow';

const langaugesStack = [
  { name: 'JavaScript', icon: <FaJs size={20} /> },
  { name: 'Python', icon: <SiPython size={20} /> },
];

const Languages = () => {
  return (
    <div>
      <h2 className="pb-2">Programming Languages</h2>
      <div className="flex flex-wrap items-center justify-start gap-2 rounded-sm bg-gray-800 p-4">
        {langaugesStack.map((tech) => (
          <TechRow key={tech.name} techName={tech.name}>
            {tech.icon}
          </TechRow>
        ))}
      </div>
    </div>
  );
};

export default Languages;
