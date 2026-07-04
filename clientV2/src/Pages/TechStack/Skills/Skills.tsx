import { FaGitAlt } from "react-icons/fa";
import { GrDocker } from "react-icons/gr";
import { SiJira, SiPostman } from "react-icons/si";
import TechRow from "../TechRow/TechRow";

const langaugesStack = [
  { name: "Jira", icon: <SiJira size={20} /> },
  { name: "Git", icon: <FaGitAlt size={20} /> },
  { name: "Postman", icon: <SiPostman size={20} /> },
  { name: "Docker", icon: <GrDocker size={20} /> },
  { name: "Monday Work Management", icon: <></> },
];

const Skills = () => {
  return (
    <div>
      <h2 className="pb-2">Skills</h2>
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

export default Skills;
