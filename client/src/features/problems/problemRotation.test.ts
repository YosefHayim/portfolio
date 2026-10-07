import { describe, expect, it } from 'vitest';
import {
  initialProblemRotation,
  nextListPosition,
  problemRotationReducer,
  randomOtherProblem,
} from './problemRotation';

describe('problem rotation', () => {
  it('moves the list forward to the next copy of a problem', () => {
    expect(nextListPosition(8, 1)).toBe(9);
    expect(nextListPosition(8, 0)).toBe(16);
    expect(nextListPosition(13, 2)).toBe(18);
  });

  it('never picks the problem that is already playing', () => {
    expect(randomOtherProblem(3, () => 0)).toBe(0);
    expect(randomOtherProblem(0, () => 0)).toBe(1);
    expect(randomOtherProblem(3, () => 0.5)).toBe(4);
    expect(randomOtherProblem(7, () => 0.99)).toBe(6);
  });

  it('plays the first problem in place without animating the list', () => {
    const rotation = problemRotationReducer(initialProblemRotation, {
      type: 'play',
      problem: 0,
      isFirst: true,
    });
    expect(rotation).toMatchObject({ activeProblem: 0, listPosition: 8, animateList: false });
    expect(rotation.playCount).toBe(1);
  });

  it('shows the fix, then finishes', () => {
    const playing = problemRotationReducer(initialProblemRotation, {
      type: 'play',
      problem: 2,
      isFirst: false,
    });
    const withFixText = problemRotationReducer(playing, { type: 'showFixText' });
    const showingFix = problemRotationReducer(withFixText, { type: 'showFix' });
    const finished = problemRotationReducer(showingFix, { type: 'finish' });
    expect(withFixText).toMatchObject({ fixTextProblem: 2, isFixTextVisible: true });
    expect(showingFix.isShowingFix).toBe(true);
    expect(finished.isFinished).toBe(true);
  });

  it('hides the old fix text when the next problem starts', () => {
    const playing = problemRotationReducer(initialProblemRotation, {
      type: 'play',
      problem: 2,
      isFirst: false,
    });
    const withFixText = problemRotationReducer(playing, { type: 'showFixText' });
    const next = problemRotationReducer(withFixText, { type: 'play', problem: 5, isFirst: false });
    expect(next).toMatchObject({ fixTextProblem: 2, isFixTextVisible: false, isShowingFix: false });
  });

  it('jumps back to the middle copy once the list passes it', () => {
    const pastMiddle = { ...initialProblemRotation, listPosition: 16, animateList: true };
    expect(problemRotationReducer(pastMiddle, { type: 'wrap' })).toMatchObject({
      listPosition: 8,
      animateList: false,
      isWrapping: true,
    });
    const farPast = { ...initialProblemRotation, listPosition: 22 };
    expect(problemRotationReducer(farPast, { type: 'wrap' }).listPosition).toBe(14);
  });

  it('does not wrap while the list is still in the middle copy', () => {
    const inMiddle = { ...initialProblemRotation, listPosition: 15 };
    expect(problemRotationReducer(inMiddle, { type: 'wrap' })).toBe(inMiddle);
  });
});
