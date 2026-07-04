import { Award, FolderKanban, Home, Layers, User } from 'lucide-react';
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
import { SocialIcons } from '../ui/social-icons';

const ICON_SIZE = 18;

const items = [
  {
    title: 'Home',
    url: '/',
    icon: <Home size={ICON_SIZE} />,
  },
  {
    title: 'About',
    url: '/about',
    icon: <User size={ICON_SIZE} />,
  },
  {
    title: 'Tech Stack',
    url: '/techStack',
    icon: <Layers size={ICON_SIZE} />,
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: <FolderKanban size={ICON_SIZE} />,
  },
  {
    title: 'Certifications',
    url: '/certifications',
    icon: <Award size={ICON_SIZE} />,
  },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar className="border-none bg-transparent">
      <SidebarContent className="bg-[var(--bg-card)] p-3">
        <SidebarGroup className="rounded-2xl bg-[var(--bg-card)] p-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={toggleSidebar}
                    asChild
                    className="rounded-xl text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-elevated)] hover:text-[#05df72]"
                  >
                    <Link to={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SocialIcons />
      </SidebarContent>
    </Sidebar>
  );
}
