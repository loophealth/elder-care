import clsx from "clsx";

import { MeasurementCategory } from "@loophealth/api";

import { CategoryTile } from "../CategoryTile";
import { ColorTheme } from "../../types";

import "./ReportOverviewGrid.css";

interface ReportOverviewGridProps {
  categories: MeasurementCategory[];
  colorTheme?: ColorTheme;
  className?: string;
}

export const ReportOverviewGrid = ({
  categories,
  colorTheme = ColorTheme.Dark,
  className,
}: ReportOverviewGridProps) => {
  const appliedClassName = clsx("ReportOverviewGrid", className);

  return (
    <div className={appliedClassName}>
      {categories.map((category) => (
        <CategoryTile
          key={category.name}
          colorTheme={colorTheme}
          category={category}
        />
      ))}
    </div>
  );
};
