import { ChevronRight, Minus } from "lucide-react";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link className="group flex items-center gap-1" to="/">
      <div className="relative flex h-7 w-8 items-center justify-center">
        <ChevronRight
          className="absolute left-0 text-[#05df72] transition-transform duration-300 group-hover:translate-x-0.5"
          size={20}
          strokeWidth={2.5}
        />
        <Minus
          className="absolute right-0 bottom-0.5 text-[var(--text-muted)] transition-all duration-300 group-hover:text-[#05df72]"
          size={16}
          strokeWidth={3}
        />
      </div>
      <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
        Jos
        <span className="text-[#05df72]">rade</span>
      </span>
    </Link>
  );
};

export default Logo;
