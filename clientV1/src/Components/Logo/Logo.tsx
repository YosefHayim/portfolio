import { Link } from 'react-router';
import { ChevronRight, Minus } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="group flex items-center gap-1">
      <div className="relative flex h-7 w-8 items-center justify-center">
        <ChevronRight
          size={20}
          strokeWidth={2.5}
          className="absolute left-0 text-[#05df72] transition-transform duration-300 group-hover:translate-x-0.5"
        />
        <Minus
          size={16}
          strokeWidth={3}
          className="absolute right-0 bottom-0.5 text-[var(--text-muted)] transition-all duration-300 group-hover:text-[#05df72]"
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
