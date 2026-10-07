export const problemCount = 8;

export type ProblemRotation = {
  activeProblem: number;
  listPosition: number;
  animateList: boolean;
  isWrapping: boolean;
  isShowingFix: boolean;
  playCount: number;
  fixTextProblem: number | undefined;
  isFixTextVisible: boolean;
  isFinished: boolean;
};

export type ProblemRotationAction =
  | { type: 'play'; problem: number; isFirst: boolean }
  | { type: 'showFixText' }
  | { type: 'showFix' }
  | { type: 'finish' }
  | { type: 'wrap' }
  | { type: 'wrapDone' };

export const initialProblemRotation: ProblemRotation = {
  activeProblem: 0,
  listPosition: problemCount,
  animateList: false,
  isWrapping: false,
  isShowingFix: false,
  playCount: 0,
  fixTextProblem: undefined,
  isFixTextVisible: false,
  isFinished: false,
};

export const needsWrap = (listPosition: number) => listPosition >= problemCount * 2;

export const nextListPosition = (listPosition: number, problem: number) => {
  const stepsAhead = (problem - listPosition - 1) % problemCount;
  return listPosition + 1 + ((stepsAhead + problemCount) % problemCount);
};

export const randomOtherProblem = (currentProblem: number, random: () => number) => {
  const pick = Math.floor(random() * (problemCount - 1));
  return pick >= currentProblem ? pick + 1 : pick;
};

const playProblem = (rotation: ProblemRotation, problem: number, isFirst: boolean) => {
  const listPosition = isFirst
    ? rotation.listPosition
    : nextListPosition(rotation.listPosition, problem);
  return {
    ...rotation,
    activeProblem: problem,
    listPosition,
    animateList: !isFirst,
    isWrapping: false,
    isShowingFix: false,
    playCount: rotation.playCount + 1,
    isFixTextVisible: false,
    isFinished: false,
  };
};

export const problemRotationReducer = (
  rotation: ProblemRotation,
  action: ProblemRotationAction,
): ProblemRotation => {
  switch (action.type) {
    case 'play':
      return playProblem(rotation, action.problem, action.isFirst);
    case 'showFixText':
      return { ...rotation, fixTextProblem: rotation.activeProblem, isFixTextVisible: true };
    case 'showFix':
      return { ...rotation, isShowingFix: true };
    case 'finish':
      return { ...rotation, isFinished: true };
    case 'wrap':
      if (!needsWrap(rotation.listPosition)) return rotation;
      return {
        ...rotation,
        listPosition: problemCount + (rotation.listPosition % problemCount),
        animateList: false,
        isWrapping: true,
      };
    case 'wrapDone':
      return { ...rotation, isWrapping: false };
  }
};
