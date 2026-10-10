import type { ReactNode } from 'react';

interface MiniBrowserProps {
  address: string;
  toolbarIcon?: ReactNode;
  children: ReactNode;
}

export const MiniBrowser = ({ address, toolbarIcon, children }: MiniBrowserProps) => (
  <div className="mini-browser">
    <div className="mini-browser-bar">
      <i />
      <i />
      <i />
      <span className="mini-browser-address">{address}</span>
      {toolbarIcon}
    </div>
    {children}
  </div>
);
