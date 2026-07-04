import { Award, BookOpen, FolderKanban, Home, Layers, User } from "lucide-react";
import AnimatedHamburger from "../AnimatedHamburger/AnimatedHamburger";
import Logo from "../Logo/Logo";
import { AppSidebar } from "../Sidebar/Sidebar";
import { useSidebar } from "../ui/sidebar";
import NavigationButton from "./NavigationButton/NavigationButton";

const ICON_SIZE = 16;

const Navbar = () => {
  const { openMobile, toggleSidebar } = useSidebar();

  return (
    <header className="fixed left-0 z-20 flex w-full items-center justify-between gap-2 border-b border-gray-800 p-3 backdrop-blur-3xl">
      <div className="flex w-full items-center justify-between gap-2">
        <Logo />
        <AppSidebar />
        <div className="md:hidden">
          <AnimatedHamburger isOpen={openMobile} onClick={toggleSidebar} />
        </div>
      </div>
      <nav className="hidden w-full items-center md:flex">
        <NavigationButton
          icon={<Home size={ICON_SIZE} />}
          pageName="Home"
          to="/"
        />
        <NavigationButton
          icon={<User size={ICON_SIZE} />}
          pageName="About"
          to="/about"
        />
        <NavigationButton
          icon={<Layers size={ICON_SIZE} />}
          pageName="Tech Stack"
          to="/techStack"
        />
        <NavigationButton
          icon={<FolderKanban size={ICON_SIZE} />}
          pageName="Projects"
          to="/projects"
        />
        <NavigationButton
          icon={<Award size={ICON_SIZE} />}
          pageName="Certifications"
          to="/certifications"
        />
        <NavigationButton
          icon={<BookOpen size={ICON_SIZE} />}
          pageName="Blog"
          to="/blog"
        />
      </nav>
    </header>
  );
};

export default Navbar;
