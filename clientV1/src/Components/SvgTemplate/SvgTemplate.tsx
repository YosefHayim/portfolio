import { ReactNode } from 'react';

const SvgTemplate: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export default SvgTemplate;
