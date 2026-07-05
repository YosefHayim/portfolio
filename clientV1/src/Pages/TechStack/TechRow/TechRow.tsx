import { ReactNode } from 'react';

const TechRow: React.FC<{ techName: string; children: ReactNode }> = ({
  techName,
  children,
}) => {
  return (
    <div className="flex items-center justify-start gap-2 rounded-full bg-gray-700 p-2">
      {children}
      <p>{techName}</p>
    </div>
  );
};

export default TechRow;
