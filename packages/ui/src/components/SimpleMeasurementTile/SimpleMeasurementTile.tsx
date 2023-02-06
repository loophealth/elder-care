import clsx from "clsx";

import { Measurement } from "@loophealth/api";

import { ValuePill } from "../ValuePill";
import { ColorTheme } from "../../types";

import "./SimpleMeasurementTile.css";

interface SimpleMeasurementTileProps {
  measurement?: Measurement;
  className?: string;
  colorTheme?: ColorTheme;
}

export const SimpleMeasurementTile = ({
  measurement,
  className,
  colorTheme = ColorTheme.Dark,
}: SimpleMeasurementTileProps) => {
  if (!measurement) {
    return null;
  }

  const appliedClassNames = clsx("SimpleMeasurementTile", className, {
    "SimpleMeasurementTile--Light": colorTheme === ColorTheme.Light,
    "SimpleMeasurementTile--Dark": colorTheme === ColorTheme.Dark,
  });

  return (
    <div className={appliedClassNames}>
      <div className="SimpleMeasurementTile__Name">{measurement.name}</div>
      <ValuePill
        value={measurement.value}
        unit={measurement.unit}
        colorTheme={colorTheme}
      />
    </div>
  );
};
