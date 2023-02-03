import {
  findMeasurementByName,
  SummaryItem,
  usePatient,
} from "@loophealth/api";
import { MeasurementTile } from "@loophealth/ui";

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
