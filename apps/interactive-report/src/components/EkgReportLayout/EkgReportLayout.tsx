import { SimpleMeasurementTile } from "components/SimpleMeasurementTile";
import { Measurement } from "lib/commonTypes";
import { findMeasurementByName } from "lib/measurement";

import "./EkgReportLayout.css";

export const EkgReportLayout = ({
  measurements,
}: {
  measurements: Measurement[];
}) => {
  const ekgImages = ["EKG1", "EKG2", "EKG3", "EKG4"].map((name) => {
    return (findMeasurementByName(measurements, name)?.value || "") as string;
  });

  return (
    <div className="EkgReportLayout">
      <div className="EkgReportLayout__Measurements">
        <div className="EkgReportLayout__Determination__Container">
          <SimpleMeasurementTile
            measurement={findMeasurementByName(measurements, "Determination")}
            className="EkgReportLayout__Determination"
          />
        </div>
        <SimpleMeasurementTile
          measurement={findMeasurementByName(measurements, "Heart Rate")}
        />
        <SimpleMeasurementTile
          measurement={findMeasurementByName(measurements, "Duration")}
        />
      </div>
      <div className="EkgReportLayout__Ekg">
        <img src={ekgImages[0]} alt="EKG 1" />
        <img src={ekgImages[1]} alt="EKG 2" />
        <img src={ekgImages[2]} alt="EKG 3" />
        <img src={ekgImages[3]} alt="EKG 4" />
      </div>
    </div>
  );
};
