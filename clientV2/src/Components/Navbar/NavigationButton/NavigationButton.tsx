import type { ReactNode } from "react";
import { Link } from "react-router";

type NavigationButtonProps = {
  pageName: string;
  to: string;
  icon?: ReactNode;
};

const NavigationButton: React.FC<NavigationButtonProps> = ({
  pageName,
  to,
  icon,
}) => {
  return (
    <div className="flex w-full items-start justify-start gap-2">
      <Link
        className="flex w-full items-center justify-center gap-1.5 text-gray-400 transition delay-150 duration-300 ease-in-out hover:text-white"
        to={to}
      >
        {icon}
        {pageName}
      </Link>
    </div>
  );
};

export default NavigationButton;
