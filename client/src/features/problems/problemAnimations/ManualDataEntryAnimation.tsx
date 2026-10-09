import './manualDataEntryAnimation.css';
import { type ProblemAnimationProps, problemAnimationClassName } from './problemAnimation';
import { problemAnimationsText } from './problemAnimations.text';

const filledCellWidths = [
  45, 82, 74, 66, 58, 50, 87, 79, 71, 63, 55, 47, 84, 76, 68, 60, 52, 89, 81, 73, 65, 57, 49, 86,
];

const orderCells = filledCellWidths.map((width, order) => ({ order, width }));

export const ManualDataEntryAnimation = ({ isActive, language }: ProblemAnimationProps) => {
  const text = problemAnimationsText[language].manualDataEntry;
  return (
    <div className={problemAnimationClassName('manual-data-entry-animation', isActive)}>
      <div className="order-table">
        <div className="order-table-header">
          {text.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        <div className="order-table-cells">
          {orderCells.map((cell) => (
            <span key={cell.order} className="order-cell" style={{ '--order': cell.order }}>
              <b style={{ width: `${cell.width}%` }} />
            </span>
          ))}
        </div>
      </div>
      <div className="time-spent">
        <span className="problem-state is-bad">{text.problemTime}</span>
        <span className="fix-state is-good" style={{ '--fix-delay': '.6s' }}>
          {text.fixTime}
        </span>
      </div>
    </div>
  );
};
