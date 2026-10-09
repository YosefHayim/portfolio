import { type RefObject, useLayoutEffect, useState } from 'react';

export const usePanelHeight = (panelRef: RefObject<HTMLElement | null>) => {
  const [panelHeight, setPanelHeight] = useState(0);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const measurePanel = () => setPanelHeight(panel.offsetHeight);
    const observer = new ResizeObserver(measurePanel);
    observer.observe(panel);
    measurePanel();
    return () => observer.disconnect();
  }, [panelRef]);

  return panelHeight;
};
