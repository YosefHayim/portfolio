import { motion } from 'framer-motion';
import type { TFunction } from 'i18next';
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ExternalLink,
  FileText,
  FolderGit2,
  GitCommitHorizontal,
  Github,
  Mail,
  Smartphone,
  Star,
  Users,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import { BlogCover } from '@/Components/Blog/BlogCover';
import { SEO } from '@/Components/SEO/SEO';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import {
  coreTechStack,
  experienceItems,
  featuredOffGitHubProjects,
  recruiterProfile,
} from '@/content/profile';
import { getRecentPosts } from '@/data/blog';
import { useChromeExtensionUsers } from '@/hooks/useChromeExtensionUsers';
import { useGitHubProjects } from '@/hooks/useGitHubProjects';
import { useGitHubStats } from '@/hooks/useGitHubStats';
import { useLocale } from '@/i18n/localized';
import { cn } from '@/lib/utils';
import { getTechIcon } from '@/utils/techIcons';

const sectionTitleClass = 'text-2xl font-semibold tracking-tight md:text-3xl';

