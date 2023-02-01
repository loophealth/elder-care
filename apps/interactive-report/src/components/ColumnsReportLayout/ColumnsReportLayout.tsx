import { Measurement } from "@loophealth/api";

import { MeasurementTile } from "components/MeasurementTile";
import { isRangedMeasurement } from "lib/measurement";

import "./ColumnsReportLayout.css";

export const ColumnsReportLayout = ({
  slug,
  measurements,
}: {
  slug: string;
  measurements: Measurement[];
}) => {
  return (
    <div className="ColumnsReportLayout">
      {measurements.map((measurement) => {
        return (
          <MeasurementTile
            key={measurement.name}
            measurement={measurement}
            className={
              isRangedMeasurement(measurement)
                ? "ColumnsReportLayout__RangedMeasurementTile"
                : "ColumnsReportLayout__MeasurementTile"
            }
          />
        );
      })}
    </div>
  );
};
