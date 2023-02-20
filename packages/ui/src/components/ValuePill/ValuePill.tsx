import clsx from "clsx";

import { ColorTheme } from "../../types";

import "./ValuePill.css";

interface ValuePillProps {
  value: string | number;
  unit: string;
  className?: string;
  hasArrow?: boolean;
  colorTheme?: ColorTheme;
}

export const ValuePill = ({
  value,
  unit,
  className,
  hasArrow,
  colorTheme = ColorTheme.Dark,
}: ValuePillProps) => {
  const appliedClassNames = clsx("ValuePill", className, {
    "ValuePill--Light": colorTheme === ColorTheme.Light,
    "ValuePill--Dark": colorTheme === ColorTheme.Dark,
    "ValuePill--Sepia": colorTheme === ColorTheme.Sepia,
  });

  return (
    <div className={appliedClassNames}>
      <div className="ValuePill__Value">{value}</div>
      <div className="ValuePill__Unit">{unit}</div>
      {hasArrow && <div className="ValuePill__Arrow" />}
    </div>
  );
};
