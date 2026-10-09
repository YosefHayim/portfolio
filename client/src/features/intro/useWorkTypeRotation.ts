import { useEffect, useState } from 'react';
import { firstWorkType, nextWorkType, type WorkTypeName } from './workTypes';

const rotationDelay = 2800;

export const useWorkTypeRotation = (canRotate: boolean) => {
  const [activeWorkType, setActiveWorkType] = useState<WorkTypeName>(firstWorkType);
  const [hasVisitorChosen, setHasVisitorChosen] = useState(false);
  const isRotating = canRotate && !hasVisitorChosen;

  useEffect(() => {
    if (!isRotating) return;
    const intervalId = setInterval(() => setActiveWorkType(nextWorkType), rotationDelay);
    return () => clearInterval(intervalId);
  }, [isRotating]);

  const chooseWorkType = (workType: WorkTypeName) => {
    setHasVisitorChosen(true);
    setActiveWorkType(workType);
  };

  return { activeWorkType, chooseWorkType };
};
