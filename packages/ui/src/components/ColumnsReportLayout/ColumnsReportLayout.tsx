import { isRangedMeasurement, Measurement } from "@loophealth/api";

import { MeasurementTile } from "../MeasurementTile";
import { ColorTheme } from "../../types";

import "./ColumnsReportLayout.css";

interface ColumnsReportLayoutProps {
  measurements: Measurement[];
  colorTheme?: ColorTheme;
}

export const ColumnsReportLayout = ({
  measurements,
  colorTheme = ColorTheme.Dark,
}: ColumnsReportLayoutProps) => {
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
            colorTheme={colorTheme}
          />
        );
      })}
    </div>
  );
};
