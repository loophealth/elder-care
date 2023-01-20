import clsx from "clsx";

import { ValuePill } from "components/ValuePill";
import { Measurement } from "lib/commonTypes";

import "./SimpleMeasurementTile.css";

export const SimpleMeasurementTile = ({
  measurement,
  className,
}: {
  measurement?: Measurement;
  className?: string;
}) => {
  if (!measurement) {
    return null;
  }

  const appliedClasses = clsx("SimpleMeasurementTile", className);

  return (
    <div className={appliedClasses}>
      <div className="SimpleMeasurementTile__Name">{measurement.name}</div>
      <ValuePill value={measurement.value} unit={measurement.unit} />
    </div>
  );
};
