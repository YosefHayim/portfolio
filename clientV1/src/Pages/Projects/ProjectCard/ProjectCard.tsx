import { type ReactNode, useRef } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import CustomProjectLogo from '../CustomProjectLogo/CustomProjectLogo';
import ProjectImg from '../ProjectImg/ProjectImg';
import TechOfProject from './TechOfProject/TechOfProject';

const ProjectCard: React.FC<{
  projectImg: string;
  projectName: string;
  visitRepoUrl: string;
  deployedUrl: string;
  techStackForProject: string[];
  childrenProjectIcon: ReactNode;
  children?: ReactNode;
}> = ({
  techStackForProject,
  projectImg,
  children,
  childrenProjectIcon,
  projectName,
  deployedUrl,
  visitRepoUrl,
}) => {
    const projectCardRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
      if (projectCardRef.current && projectCardRef.current.scrollTop === 0) {
        // Only execute animation if not already scrolled
        const scrollElement = projectCardRef.current;
        const start = scrollElement.scrollTop;
        const end = scrollElement.scrollHeight - scrollElement.clientHeight; // Scroll to the bottom
        const duration = 6000; // milliseconds
        let startTime: number | null = null;

        const animateScroll = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const progress = (currentTime - startTime) / duration;
          const easeInOutQuad = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2; // Easing function
          if (scrollElement) {
            scrollElement.scrollTop = start + (end - start) * easeInOutQuad;
          }
          if (progress < 1) requestAnimationFrame(animateScroll);
        };
        requestAnimationFrame(animateScroll);
      }
    };

    const handleMouseLeave = () => {
      if (projectCardRef.current) {
        projectCardRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };


    return (
      <div
        className="flex h-[620px] flex-col overflow-auto rounded-lg bg-gray-800"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={projectCardRef}
      >

        <ProjectImg path={projectImg} to={deployedUrl} />
        <div className="flex flex-col items-start justify-start gap-4 rounded-b-lg bg-gray-700 p-5">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center justify-start gap-2">
              <CustomProjectLogo>{childrenProjectIcon}</CustomProjectLogo>
              <h2 className="text-2xl">{projectName}</h2>
            </div>
            <Link
              className="w text-gray-400 hover:text-white"
              target="_blank"
              to={visitRepoUrl}
            >
              <FiExternalLink size={25} />
            </Link>
          </div>
          {children}
          <div className="flex flex-col items-start justify-start gap-2">
            <b>Tech Stack</b>
            <TechOfProject techStackForProject={techStackForProject} />
          </div>
        </div>
      </div>
    );
  };

export default ProjectCard;
