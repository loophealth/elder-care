import clsx from "clsx";

import "./ValuePill.css";

interface ValuePillProps {
  value: string | number;
  unit: string;
  className?: string;
  hasArrow?: boolean;
}

export const ValuePill = ({
  value,
  unit,
  className,
  hasArrow,
}: ValuePillProps) => {
  const appliedClasses = clsx("ValuePill", className);

  return (
    <div className={appliedClasses}>
      <div className="ValuePill__Value">{value}</div>
      <div className="ValuePill__Unit">{unit}</div>
      {hasArrow && <div className="ValuePill__Arrow" />}
    </div>
  );
};
