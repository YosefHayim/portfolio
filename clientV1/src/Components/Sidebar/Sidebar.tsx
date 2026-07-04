import { HiOutlineHome } from 'react-icons/hi2';
import { GrTechnology } from 'react-icons/gr';
import { PiCertificateThin } from 'react-icons/pi';
import { CiSquareInfo } from 'react-icons/ci';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/Components/ui/sidebar';
import { Link } from 'react-router';
import { FaProjectDiagram } from 'react-icons/fa';
import GithubSocialButton from '../GithubSocialButton/GithubSocialButton';
import DiscordSocialButton from '../Discord/DiscordSocialButton';
import LinkedinSocialButton from '../LinkedinSocialButton/LinkedinSocialButton';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: <HiOutlineHome />,
  },
  {
    title: 'About',
    url: '/about',
    icon: <CiSquareInfo />,
  },
  {
    title: 'Tech Stack',
    url: '/techStack',
    icon: <GrTechnology />,
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: <FaProjectDiagram />,
  },
  {
    title: 'Certifications',
    url: '/certifications',
    icon: <PiCertificateThin />,
  },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={toggleSidebar}
                    asChild
                    className="text-white transition delay-150 duration-300 ease-in-out hover:bg-gray-700 hover:text-white"
                  >
                    <Link to={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <hr className="border-gray-700 py-1" />
              <section className="flex w-full flex-col items-start justify-start gap-2 text-white">
                <nav className="flex w-full items-start justify-start gap-4 pl-[0.5em]">
                  <LinkedinSocialButton />
                  <GithubSocialButton />
                  <DiscordSocialButton />
                </nav>
              </section>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
