import NavigationButton from './NavigationButton/NavigationButton';
import Logo from '../Logo/Logo';
import { AppSidebar } from '../Sidebar/Sidebar';
import { useSidebar } from '../ui/sidebar';
import AnimatedHamburger from '../AnimatedHamburger/AnimatedHamburger';

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
