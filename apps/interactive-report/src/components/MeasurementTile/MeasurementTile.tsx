import { RangedMeasurementTile } from "components/RangedMeasurementTile";
import { SimpleMeasurementTile } from "components/SimpleMeasurementTile";
import { Measurement } from "lib/commonTypes";
import { isRangedMeasurement } from "lib/measurement";

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
