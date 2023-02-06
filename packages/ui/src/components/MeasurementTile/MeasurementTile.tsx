import { isRangedMeasurement, Measurement } from "@loophealth/api";

import { RangedMeasurementTile } from "../RangedMeasurementTile";
import { SimpleMeasurementTile } from "../SimpleMeasurementTile";
import { ColorTheme } from "../../types";

interface MeasurementTileProps {
  measurement: Measurement;
  className?: string;
  colorTheme?: ColorTheme;
}

export const MeasurementTile = ({
  measurement,
  className = "",
  colorTheme = ColorTheme.Dark,
}: MeasurementTileProps) => {
  if (isRangedMeasurement(measurement)) {
    return (
      <RangedMeasurementTile
        measurement={measurement}
        className={className}
        colorTheme={colorTheme}
      />
    );
  }

  return (
    <SimpleMeasurementTile
      measurement={measurement}
      className={className}
      colorTheme={colorTheme}
    />
  );
};
