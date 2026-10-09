import { useCallback, useEffect, useReducer } from 'react';
import {
  initialProblemRotation,
  needsWrap,
  problemRotationReducer,
  randomOtherProblem,
} from './problemRotation';

const fixTextDelay = 250;
const wrapDelay = 1000;

export const useProblemRotation = (isVisible: boolean, prefersReducedMotion: boolean) => {
  const [rotation, dispatch] = useReducer(problemRotationReducer, initialProblemRotation);
  const problemDuration = prefersReducedMotion ? 600 : 3800;
  const fixDuration = prefersReducedMotion ? 6000 : 6800;

  useEffect(() => {
    if (!isVisible) return;
    if (rotation.playCount === 0) {
      dispatch({ type: 'play', problem: 0, isFirst: true });
      return;
    }
    if (!rotation.isFinished) return;
    const nextProblem = randomOtherProblem(rotation.activeProblem, Math.random);
    dispatch({ type: 'play', problem: nextProblem, isFirst: false });
  }, [isVisible, rotation.playCount, rotation.isFinished, rotation.activeProblem]);

  useEffect(() => {
    if (rotation.playCount === 0) return;
    const fixTextTimer = setTimeout(() => dispatch({ type: 'showFixText' }), fixTextDelay);
    const fixTimer = setTimeout(() => dispatch({ type: 'showFix' }), problemDuration);
    const finishTimer = setTimeout(
      () => dispatch({ type: 'finish' }),
      problemDuration + fixDuration,
    );
    return () => {
      clearTimeout(fixTextTimer);
      clearTimeout(fixTimer);
      clearTimeout(finishTimer);
    };
  }, [rotation.playCount, problemDuration, fixDuration]);

  useEffect(() => {
    if (!needsWrap(rotation.listPosition)) return;
    const wrapTimer = setTimeout(() => dispatch({ type: 'wrap' }), wrapDelay);
    return () => clearTimeout(wrapTimer);
  }, [rotation.listPosition]);

  const playProblem = (problem: number) => {
    if (problem === rotation.activeProblem) return;
    dispatch({ type: 'play', problem, isFirst: false });
  };

  const finishWrap = useCallback(() => dispatch({ type: 'wrapDone' }), []);

  return {
    rotation,
    cycleSeconds: (problemDuration + fixDuration) / 1000,
    playProblem,
    finishWrap,
  };
};
