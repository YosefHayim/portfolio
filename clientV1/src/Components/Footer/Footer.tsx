import DiscordSocialButton from '../Discord/DiscordSocialButton';
import GithubSocialButton from '../GithubSocialButton/GithubSocialButton';
import LinkedinSocialButton from '../LinkedinSocialButton/LinkedinSocialButton';
import Logo from '../Logo/Logo';
import NavigationButton from '../Navbar/NavigationButton/NavigationButton';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="w-full">
      <footer className="relative flex w-full flex-col items-start justify-start gap-8 p-5 md:flex-row">
        <section className="flex w-full flex-col items-start justify-center md:items-center">
          <Logo />
          <p className="w-full text-sm text-gray-400 md:text-center">
            Just trying to get better{' '}
            <span className="font-bold text-green-400">everyday.</span>
          </p>
        </section>
        <section className="flex w-full flex-col items-center justify-center gap-2">
          <h2 className="w-full sm:text-start md:text-center">
            Navigation menu
          </h2>
          <nav className="flex w-full flex-col items-center justify-center gap-2">
            <NavigationButton to="/" pageName="Home" />
            <NavigationButton to="/about" pageName="About" />
            <NavigationButton to="/techStack" pageName="Tech Stack" />
            <NavigationButton to="/projects" pageName="Projects" />
            <NavigationButton to="/certifications" pageName="Certifications" />
          </nav>
        </section>
        <section className="flex w-full flex-col gap-4">
          <h2 className="w-full md:text-center">Get in touch</h2>
          <nav className="flex w-full items-center gap-4 sm:justify-start md:justify-center">
            <LinkedinSocialButton />
            <GithubSocialButton />
            <DiscordSocialButton />
          </nav>
        </section>
      </footer>
      <section className="flex w-full items-center justify-center border-t border-gray-800 p-3">
        <p className="text-center text-sm text-gray-400">
          © {year} - Yosef Portfolio. All rights reserved
        </p>
      </section>
    </div>
  );
};

export default Footer;
