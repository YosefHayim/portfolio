import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  FIRST_VISIT: 'portfolio_first_visit',
  DIALOG_DISMISSED: 'portfolio_dialog_dismissed_until',
} as const;

const COOLDOWN_DAYS = 7;
const DIALOG_DELAY_MS = 2000;
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const MS_PER_DAY =
  HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND;

type VisitorState = {
  isReturningVisitor: boolean;
  shouldShowDialog: boolean;
  dismissDialog: () => void;
};

export const useReturnVisitor = (): VisitorState => {
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [shouldShowDialog, setShouldShowDialog] = useState(false);

  useEffect(() => {
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
    const dismissedUntil = localStorage.getItem(STORAGE_KEYS.DIALOG_DISMISSED);
    const now = Date.now();

    if (!firstVisit) {
      localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, now.toString());
      setIsReturningVisitor(false);
      setShouldShowDialog(false);
      return;
    }

    setIsReturningVisitor(true);

    if (dismissedUntil) {
      const dismissedDate = Number.parseInt(dismissedUntil, 10);
      if (now < dismissedDate) {
        setShouldShowDialog(false);
        return;
      }
    }

    const delay = setTimeout(() => {
      setShouldShowDialog(true);
    }, DIALOG_DELAY_MS);

    return () => clearTimeout(delay);
  }, []);

  const dismissDialog = useCallback(() => {
    const futureDate = Date.now() + COOLDOWN_DAYS * MS_PER_DAY;
    localStorage.setItem(STORAGE_KEYS.DIALOG_DISMISSED, futureDate.toString());
    setShouldShowDialog(false);
  }, []);

  return {
    isReturningVisitor,
    shouldShowDialog,
    dismissDialog,
  };
};
