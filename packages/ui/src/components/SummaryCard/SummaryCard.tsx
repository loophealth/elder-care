import { ReactNode } from "react";
import clsx from "clsx";

import {
  findMeasurementByName,
  SummaryItem,
  usePatient,
} from "@loophealth/api";

import { MeasurementTile } from "../MeasurementTile";
import { ColorTheme } from "../../types";

import "./SummaryCard.css";

interface SummaryCardProps {
  summary: SummaryItem | null;
  iconPath?: string;
  onClick?: () => void;
  headerElt?: ReactNode;
  className?: string;
  colorTheme?: ColorTheme;
}

export const SummaryCard = ({
  summary,
  iconPath,
  onClick,
  headerElt,
  className,
  colorTheme = ColorTheme.Dark,
}: SummaryCardProps) => {
  const { patient } = usePatient();

  const appliedClassNames = clsx("SummaryCard", className, {
    "SummaryCard--Dark": colorTheme === ColorTheme.Dark,
    "SummaryCard--Light": colorTheme === ColorTheme.Light,
  });

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
    <div className={appliedClassNames}>
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
            colorTheme={
              colorTheme === ColorTheme.Dark
                ? ColorTheme.Dark
                : ColorTheme.Sepia
            }
          />
        );
      })}
    </div>
  );
};
