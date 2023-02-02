import clsx from "clsx";

import { usePatient } from "@loophealth/api";
import { CategoryTile } from "@loophealth/ui";

import "./ReportOverviewGrid.css";

export const ReportOverviewGrid = ({ className }: { className: string }) => {
  const { patient } = usePatient();

  const appliedClassName = clsx("ReportOverviewGrid", className);

  return (
    <div className={appliedClassName}>
      {patient?.report.categories.map((category) => (
        <CategoryTile key={category.name} category={category} />
      ))}
    </div>
  );
};
