import { motion } from "framer-motion";
import {
  Binary,
  Code2,
  Database,
  Github,
  Globe,
  LayoutGrid,
  List,
  Server,
  Smartphone,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { FaPython } from "react-icons/fa";
import { staggerContainer, staggerItem } from "@/animations/variants";
import { Awards } from "@/Components/ui/awards";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

type Certification = {
  id: string;
  icon: ReactNode;
  title: string;
  date: string;
  link: string;
  platform: string;
  category: "devops" | "frontend" | "backend" | "mobile" | "fundamentals";
};

const ICON_SIZE = 22;

const certifications: Certification[] = [
  {
    id: "github-actions",
    icon: <Github size={ICON_SIZE} />,
    title: "GitHub Actions - The Complete Guide",
    date: "Sep 2025",
    link: "https://www.udemy.com/certificate/UC-6da4399d-15db-4b8c-84ec-3b56953a0766/",
    platform: "Udemy",
    category: "devops",
  },
  {
    id: "nextjs",
    icon: <Globe size={ICON_SIZE} />,
    title: "Next.js App Router Fundamentals",
    date: "Sep 2025",
    link: "https://www.linkedin.com/in/yosef-hayim-sabag/details/certifications/1758366776092/single-media-viewer/?profileId=ACoAADtj-18BDUMzABOGjZh335dfWV5OYcgy63g",
    platform: "Vercel",
    category: "frontend",
  },
  {
    id: "pre-programming",
    icon: <Binary size={ICON_SIZE} />,
    title: "Pre-Programming: Everything before you code",
    date: "Jul 2025",
    link: "https://www.udemy.com/certificate/UC-89fff14a-926b-4b95-ac36-683830f2c1ef/",
    platform: "Udemy",
    category: "fundamentals",
  },
  {
    id: "react-native",
    icon: <Smartphone size={ICON_SIZE} />,
    title: "React Native - The Practical Guide [2025]",
    date: "Jun 2025",
    link: "https://www.udemy.com/certificate/UC-fb20f1dd-ba51-4300-b378-b46c170f30b8/",
    platform: "Udemy",
    category: "mobile",
  },
  {
    id: "socketio",
    icon: <Zap size={ICON_SIZE} />,
    title: "SocketIO v4, with websockets - the details",
    date: "May 2025",
    link: "https://www.udemy.com/certificate/UC-af93b5ef-9560-4c05-83ee-fa66c34ef2f0/",
    platform: "Udemy",
    category: "backend",
  },
  {
    id: "js-algorithms",
    icon: <Code2 size={ICON_SIZE} />,
    title: "JavaScript Algorithms & Data Structures",
    date: "May 2025",
    link: "https://www.udemy.com/certificate/UC-5c06abf7-d52f-4978-8031-4cf492d8b549/",
    platform: "Udemy",
    category: "fundamentals",
  },
  {
    id: "nodejs-bootcamp",
    icon: <Server size={ICON_SIZE} />,
    title: "Node.js, Express, MongoDB & More Bootcamp",
    date: "Feb 2025",
    link: "https://www.udemy.com/certificate/UC-830343b5-2bb6-44ae-baf3-af70748ea84c/",
    platform: "Udemy",
    category: "backend",
  },
  {
    id: "fullstack-bootcamp",
    icon: <Database size={ICON_SIZE} />,
    title: "Complete Full-Stack Web Development Bootcamp",
    date: "Nov 2024",
    link: "https://www.udemy.com/certificate/UC-2bc9ed93-536f-4dd1-9aeb-45821941d8bc/",
    platform: "Udemy",
    category: "frontend",
  },
  {
    id: "python-bootcamp",
    icon: <FaPython size={ICON_SIZE} />,
    title: "100 Days of Code: Complete Python Pro Bootcamp",
    date: "Oct 2024",
    link: "https://www.udemy.com/certificate/UC-65f92c9d-6851-4700-9ced-8cfa8d192b41/",
    platform: "Udemy",
    category: "backend",
  },
];

const categoryColors: Record<Certification["category"], string> = {
  devops: "#fdc700",
  frontend: "#05df72",
  backend: "#00d9ff",
  mobile: "#ff6467",
  fundamentals: "#a78bfa",
};

const categories = [
  { key: "all", label: "All" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "mobile", label: "Mobile" },
  { key: "devops", label: "DevOps" },
  { key: "fundamentals", label: "Fundamentals" },
] as const;

const CertificationCards = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredCertifications =
    activeCategory === "all"
      ? certifications
      : certifications.filter((cert) => cert.category === activeCategory);

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                activeCategory === cat.key
                  ? "bg-[#05df72] text-[var(--bg-void)]"
                  : "bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
              )}
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 py-2">
          <button
            aria-label="Grid view"
            className={cn(
              "rounded-md p-2 transition-all duration-200",
              viewMode === "grid"
                ? "bg-[#05df72] text-[var(--bg-void)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            )}
            onClick={() => setViewMode("grid")}
            type="button"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            aria-label="List view"
            className={cn(
              "rounded-md p-2 transition-all duration-200",
              viewMode === "list"
                ? "bg-[#05df72] text-[var(--bg-void)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            )}
            onClick={() => setViewMode("list")}
            type="button"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <motion.div
        animate="visible"
        className={cn(
          "grid gap-4 pt-4",
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1",
        )}
        initial="hidden"
        variants={staggerContainer}
      >
        {filteredCertifications.map((cert) => (
          <motion.div key={cert.id} layout variants={staggerItem}>
            <Awards
              className="h-full"
              customIcon={
                <span style={{ color: categoryColors[cert.category] }}>
                  {cert.icon}
                </span>
              }
              date={cert.date}
              link={cert.link}
              platform={cert.platform}
              title={cert.title}
              variant="modern-card"
            />
          </motion.div>
        ))}
      </motion.div>

      {filteredCertifications.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-[var(--text-muted)]">
            No certifications found in this category.
          </p>
        </div>
      )}

      <motion.div
        animate={{ opacity: 1 }}
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-[var(--text-muted)]">
          <span className="text-[#05df72]">{certifications.length}</span>{" "}
          certifications earned •{" "}
          <span className="text-[#00d9ff]">Always learning</span>
        </p>
      </motion.div>
    </div>
  );
};

export default CertificationCards;
