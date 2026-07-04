import TechnologyBubble from "../TechBubble/TechBubble";

const TechOfProject: React.FC<{ techStackForProject: string[] }> = ({
  techStackForProject,
}) => {
  return (
    <div className="flex w-full flex-wrap items-center justify-start gap-2 font-(family-name:--code-font)">
      {techStackForProject.map((techName) => (
        <TechnologyBubble key={techName} techName={techName} />
      ))}
    </div>
  );
};

export default TechOfProject;
