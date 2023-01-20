import { MeasurementTile } from "components/MeasurementTile";
import { SummaryItem } from "lib/commonTypes";
import { findMeasurementByName } from "lib/measurement";
import { usePatient } from "lib/PatientProvider";

import "./SummaryCard.css";

export const SummaryCard = ({
  summary,
  iconPath,
  onClick,
  headerElt,
}: {
  summary: SummaryItem | null;
  iconPath?: string;
  onClick?: () => void;
  headerElt?: JSX.Element;
}) => {
  const { patient } = usePatient();

  if (!summary) {
    return (
      <div className="SummaryCard SummaryCard--Dummy" onClick={onClick}>
        {iconPath && (
          <img
            className="SummaryCard--Dummy__Icon"
            src={iconPath}
            alt="Summary card icon"
          />
        )}
      </div>
    );
  }

  return (
    <div className="SummaryCard">
      {headerElt}
      <h2 className="SummaryCard__Title">{summary.title}</h2>
      <p className="SummaryCard__Details">{summary.details}</p>
      {summary.relatedMeasurements.map((measurementName) => {
        const measurement = findMeasurementByName(
          patient?.report.measurements || [],
          measurementName
        );

        if (!measurement) {
          return null;
        }

        return (
          <MeasurementTile
            key={measurementName}
            measurement={measurement}
            className="SummaryCard__MeasurementTile"
          />
        );
      })}
    </div>
  );
};
