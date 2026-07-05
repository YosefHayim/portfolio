import NavigationButton from './NavigationButton/NavigationButton';
import Logo from '../Logo/Logo';
import { AppSidebar } from '../Sidebar/Sidebar';
import { SidebarTrigger } from '../ui/sidebar';

const Navbar = () => {
  return (
    <header className="fixed left-0 z-20 flex w-full items-center justify-between gap-2 border-b border-gray-800 p-3 backdrop-blur-3xl">
      <div className="flex w-full items-center justify-between gap-2">
        <Logo />
        <AppSidebar />
        <SidebarTrigger className="bg-transparent hover:bg-gray-700 md:hidden" />
      </div>
      <nav className="hidden w-full items-center md:flex">
        <NavigationButton to="/" pageName="Home" />
        <NavigationButton to="/about" pageName="About" />
        <NavigationButton to="/techStack" pageName="Tech Stack" />
        <NavigationButton to="/projects" pageName="Projects" />
        <NavigationButton to="/certifications" pageName="Certifications" />
      </nav>
    </header>
  );
};

export default Navbar;
