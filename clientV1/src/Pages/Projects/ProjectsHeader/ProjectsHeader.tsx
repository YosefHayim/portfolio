import LastTimeUpdatedBy from "@/Components/LastTimeUpdatedBy/LastTimeUpdatedBy";

const ProjectsHeader = () => {
  return (
    <div className="flex w-full items-center justify-center pt-[10%] text-center text-3xl flex flex-col gap-2">
      <h1 className="w-full text-center">
        Explore my latest work and personal projects
      </h1>
      <LastTimeUpdatedBy />
    </div>
  );
};

export default ProjectsHeader;
