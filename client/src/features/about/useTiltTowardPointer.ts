import { type RefObject, useEffect } from 'react';

const maxTurnSideways = 14;
const maxTurnUpDown = 10;

export const useTiltTowardPointer = (
  areaRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  prefersReducedMotion: boolean,
) => {
  useEffect(() => {
    const area = areaRef.current;
    const target = targetRef.current;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!area || !target || prefersReducedMotion || !hasFinePointer) return;

    const tiltTowardPointer = (event: MouseEvent) => {
      const bounds = target.getBoundingClientRect();
      const pointerX = (event.clientX - (bounds.left + bounds.width / 2)) / window.innerWidth;
      const pointerY = (event.clientY - (bounds.top + bounds.height / 2)) / window.innerHeight;
      const turnSideways = (pointerX * maxTurnSideways).toFixed(2);
      const turnUpDown = (-pointerY * maxTurnUpDown).toFixed(2);
      target.style.transform = `rotateY(${turnSideways}deg) rotateX(${turnUpDown}deg)`;
    };

    const resetTilt = () => {
      target.style.transform = '';
    };

    area.addEventListener('mousemove', tiltTowardPointer);
    area.addEventListener('mouseleave', resetTilt);

    return () => {
      area.removeEventListener('mousemove', tiltTowardPointer);
      area.removeEventListener('mouseleave', resetTilt);
      resetTilt();
    };
  }, [areaRef, targetRef, prefersReducedMotion]);
};
