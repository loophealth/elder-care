import clsx from "clsx";

import { findMeasurementByName, Measurement } from "@loophealth/api";

import { SimpleMeasurementTile } from "../SimpleMeasurementTile";
import { ColorTheme } from "../../types";

import "./UrineReportLayout.css";

interface UrineReportLayoutProps {
  measurements: Measurement[];
  colorTheme?: ColorTheme;
}

export const UrineReportLayout = ({
  measurements,
  colorTheme = ColorTheme.Dark,
}: UrineReportLayoutProps) => {
  const appliedClassNames = clsx("UrineReportLayout", {
    "UrineReportLayout--Light": colorTheme === ColorTheme.Light,
    "UrineReportLayout--Dark": colorTheme === ColorTheme.Dark,
  });

  return (
    <div className={appliedClassNames}>
      <div>
        <h2 className="UrineReportLayout__SectionTitle Utils__Label">
          Physical Examination
        </h2>
        <div className="UrineReportLayout__Section">
          {["Volume", "Colour", "Appearance"].map((name) => (
            <SimpleMeasurementTile
              measurement={findMeasurementByName(measurements, name)}
              colorTheme={colorTheme}
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
              colorTheme={colorTheme}
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
              colorTheme={colorTheme}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
