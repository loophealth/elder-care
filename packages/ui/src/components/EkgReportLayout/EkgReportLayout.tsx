import clsx from "clsx";

import { findMeasurementByName, Measurement } from "@loophealth/api";

import { SimpleMeasurementTile } from "../SimpleMeasurementTile";
import { ColorTheme } from "../../types";

import "./EkgReportLayout.css";

interface EkgReportLayoutProps {
  measurements: Measurement[];
  colorTheme?: ColorTheme;
}

export const EkgReportLayout = ({
  measurements,
  colorTheme = ColorTheme.Dark,
}: EkgReportLayoutProps) => {
  const ekgImages = ["EKG1", "EKG2", "EKG3", "EKG4"].map((name) => {
    return (findMeasurementByName(measurements, name)?.value || "") as string;
  });

  const appliedClassNames = clsx("EkgReportLayout", {
    "EkgReportLayout--Light": colorTheme === ColorTheme.Light,
    "EkgReportLayout--Dark": colorTheme === ColorTheme.Dark,
  });

  return (
    <div className={appliedClassNames}>
      <div className="EkgReportLayout__Measurements">
        <div className="EkgReportLayout__Determination__Container">
          <SimpleMeasurementTile
            measurement={findMeasurementByName(measurements, "Determination")}
            className="EkgReportLayout__Determination"
            colorTheme={colorTheme}
          />
        </div>
        <SimpleMeasurementTile
          measurement={findMeasurementByName(measurements, "Heart Rate")}
          colorTheme={colorTheme}
        />
        <SimpleMeasurementTile
          measurement={findMeasurementByName(measurements, "Duration")}
          colorTheme={colorTheme}
        />
      </div>
      <div className="EkgReportLayout__Ekg">
        {ekgImages[0] && <img src={ekgImages[0]} alt="EKG 1" />}
        {ekgImages[1] && <img src={ekgImages[1]} alt="EKG 2" />}
        {ekgImages[2] && <img src={ekgImages[2]} alt="EKG 3" />}
        {ekgImages[3] && <img src={ekgImages[3]} alt="EKG 4" />}
      </div>
    </div>
  );
};
