import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type TechRowProps = {
  techName: string;
  children: ReactNode;
};

const SCALE_HOVER = 1.1;
const TRANSLATE_Y = -2;

const TechRow: React.FC<TechRowProps> = ({ techName, children }) => {
  return (
    <motion.div
      whileHover={{ scale: SCALE_HOVER, y: TRANSLATE_Y }}
      transition={{ duration: 0.2 }}
      className="flex cursor-default items-center justify-start gap-2 rounded-full border border-gray-600/50 bg-gradient-to-r from-gray-700 to-gray-800 p-2 shadow-md transition-shadow hover:shadow-[0_0_15px_rgba(5,223,114,0.2)]"
    >
      {children}
      <p className="text-sm">{techName}</p>
    </motion.div>
  );
};

export default TechRow;
