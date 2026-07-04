import { motion } from "framer-motion";
import type { ReactNode } from "react";

type CardJourneyProps = {
  title: string;
  textChildren: ReactNode;
  icon: ReactNode;
  years: string;
  colorIconHover: string;
  children?: ReactNode;
};

const SCALE_HOVER = 1.05;
const TRANSLATE_Y = -8;

const CardJourney: React.FC<CardJourneyProps> = ({
  title,
  icon,
  years,
  colorIconHover,
  children,
  textChildren,
}) => {
  return (
    <div className="group relative w-full">
      <motion.section
        className="relative z-10 w-full rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg transition-shadow hover:shadow-[0_0_30px_rgba(5,223,114,0.15)]"
        transition={{ duration: 0.3 }}
        whileHover={{ scale: SCALE_HOVER, y: TRANSLATE_Y }}
      >
        <div className="flex w-full flex-col items-center justify-start gap-2 p-5">
          <p className="w-full text-sm text-[#00d9ff] duration-300 ease-in-out group-hover:text-white">
            {years}
          </p>
          <h3 className="w-full font-semibold">{title}</h3>
          <motion.div
            className={`absolute -top-3 -left-3 rounded-full border border-gray-600 bg-gray-800 p-2.5 shadow-lg ${colorIconHover} transition delay-150 duration-300 ease-in-out group-hover:-translate-y-2 hover:scale-110`}
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            {icon}
            {children}
          </motion.div>
          {textChildren}
        </div>
      </motion.section>
    </div>
  );
};

export default CardJourney;
