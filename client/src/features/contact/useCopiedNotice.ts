import { useEffect, useRef, useState } from 'react';

const noticeDuration = 1800;

export const useCopiedNotice = () => {
  const [copiedCount, setCopiedCount] = useState(0);
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);
  const hideTimerRef = useRef(0);

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

  const showNotice = () => {
    clearTimeout(hideTimerRef.current);
    setCopiedCount((count) => count + 1);
    setIsNoticeVisible(true);
    hideTimerRef.current = window.setTimeout(() => setIsNoticeVisible(false), noticeDuration);
  };

  return { copiedCount, isNoticeVisible, showNotice };
};
