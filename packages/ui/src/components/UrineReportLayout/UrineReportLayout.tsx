import { findMeasurementByName, Measurement } from "@loophealth/api";
import { SimpleMeasurementTile } from "@loophealth/ui";

import "./UrineReportLayout.css";

export const UrineReportLayout = ({
  measurements,
}: {
  measurements: Measurement[];
}) => {
  return (
    <div className="UrineReportLayout">
      <div>
        <h2 className="UrineReportLayout__SectionTitle Utils__Label">
          Physical Examination
        </h2>
        <div className="UrineReportLayout__Section">
          {["Volume", "Colour", "Appearance"].map((name) => (
            <SimpleMeasurementTile
              measurement={findMeasurementByName(measurements, name)}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="UrineReportLayout__SectionTitle Utils__Label">
          Chemical Examination
        </h2>
        <div className="UrineReportLayout__Section">
          {[
            "pH",
            "Specific Gravity",
            "Blood",
            "Urobiligen",
            "Leucocyte Esterase",
            "Nitrites",
          ].map((name) => (
            <SimpleMeasurementTile
              measurement={findMeasurementByName(measurements, name)}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="UrineReportLayout__SectionTitle Utils__Label">
          Microscopy Examination
        </h2>
        <div className="UrineReportLayout__Section">
          {["Plus Cells", "Epithelial Cells"].map((name) => (
            <SimpleMeasurementTile
              measurement={findMeasurementByName(measurements, name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
