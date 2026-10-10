import './rollingLabel.css';

interface RollingLabelProps {
  label: string;
  hoverLabel: string;
}

export const RollingLabel = ({ label, hoverLabel }: RollingLabelProps) => (
  <span className="rolling-label">
    <span>{label}</span>
    <span aria-hidden="true">{hoverLabel}</span>
  </span>
);
