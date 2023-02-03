import { isRangedMeasurement, Measurement } from "@loophealth/api";
import { SimpleMeasurementTile } from "@loophealth/ui";

import { RangedMeasurementTile } from "../RangedMeasurementTile";

export const MeasurementTile = ({
  measurement,
  className = "",
}: {
  measurement: Measurement;
  className?: string;
}) => {
  if (isRangedMeasurement(measurement)) {
    return (
      <RangedMeasurementTile measurement={measurement} className={className} />
    );
  }

  return (
    <SimpleMeasurementTile measurement={measurement} className={className} />
  );
};
