import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router";

type CertificationCardProps = {
  icon: ReactNode;
  certificateTitle: string;
  yearEarnedCertificate: string;
  certificateLink: string;
};

const CertificationCard: React.FC<CertificationCardProps> = ({
  icon,
  yearEarnedCertificate,
  certificateTitle,
  certificateLink,
}) => {
  return (
    <motion.article
      className="group w-full"
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01, y: -2 }}
    >
      <Link
        className="flex w-full items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 transition-all duration-300 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
        rel="noopener noreferrer"
        target="_blank"
        to={certificateLink}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-surface)] text-[#05df72] transition-all duration-300 group-hover:bg-[#05df72]/10 group-hover:shadow-[0_0_20px_rgba(5,223,114,0.2)]">
          {icon}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="truncate font-medium text-[var(--text-primary)] transition-colors group-hover:text-[#05df72]">
            {certificateTitle}
          </h3>
          <span className="text-sm text-[#00d9ff]">
            {yearEarnedCertificate}
          </span>
        </div>

        <FiExternalLink
          className="shrink-0 text-[var(--text-muted)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#05df72]"
          size={18}
        />
      </Link>
    </motion.article>
  );
};

export default CertificationCard;
