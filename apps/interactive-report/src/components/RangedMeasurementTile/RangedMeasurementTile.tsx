import clsx from "clsx";

import { ValuePill } from "components/ValuePill";
import { Measurement } from "lib/commonTypes";

import "./RangedMeasurementTile.css";

/**
 * Displays a health measurement that should fall within a range to be
 * considered healthy. The value is displayed using a visual indicator of safe
 * zones.
 */
export const RangedMeasurementTile = ({
  measurement,
  className,
}: {
  measurement: Measurement;
  className?: string;
}) => {
  const measurementValueOffset = getMeasurementValueOffset(measurement);
  const appliedClasses = clsx("RangedMeasurementTile", className);

  return (
    <div className={appliedClasses}>
      <div className="RangedMeasurementTile__Name">{measurement.name}</div>
      <div
        className="RangedMeasurementTile__ValuePill"
        style={{ left: `${measurementValueOffset}%` || "50%" }}
      >
        <ValuePill
          value={measurement.value}
          unit={measurement.unit}
          hasArrow={true}
        />
      </div>
      <RangedMeasurementTileZones
        measurement={measurement}
        measurementValueOffset={measurementValueOffset}
      />
    </div>
  );
};

const RangedMeasurementTileZones = ({
  measurement,
  measurementValueOffset,
}: {
  measurement: Measurement;
  measurementValueOffset: number | null;
}) => {
  const linearGradient = getLinearGradient(measurement);

  const dotOffsets = [
    measurement.range?.lowerDanger,
    measurement.range?.lowerWarning,
    measurement.range?.upperWarning,
    measurement.range?.upperDanger,
  ].map((value) => {
    if (typeof value === "number" && measurement.range !== null) {
      return {
        offsetPercent: getOffsetPercent(
          measurement.range.lower,
          measurement.range.upper,
          value
        ),
        value: value,
      };
    }

    return null;
  });

  return (
    <div className="RangedMeasurementTileZones">
      {typeof measurementValueOffset !== "undefined" && (
        <div className="RangedMeasurementTileZones__MeasurementDot">
          <div
            className="RangedMeasurementTileZones__MeasurementDot__Foreground"
            style={{ left: `${measurementValueOffset}%` }}
          />
          <div
            className="RangedMeasurementTileZones__MeasurementDot__Background"
            style={{ left: `${measurementValueOffset}%` }}
          />
        </div>
      )}
      <div className="RangedMeasurementTileZones__Dots">
        {dotOffsets.map((offset, i) => {
          if (!offset) {
            return null;
          }

          const { offsetPercent, value } = offset;

          return (
            <>
              <div
                key={`RangedMeasurementTileZones__Dots__Dot__${i}`}
                className="RangedMeasurementTileZones__Dots__Dot"
                style={{ left: `${offsetPercent}%` }}
              />
              <div
                key={`RangedMeasurementTileZones__Dots__DotTick__${i}`}
                className="RangedMeasurementTileZones__Dots__DotTick"
                style={{ left: `${offsetPercent}%` }}
              />
              <div
                key={`RangedMeasurementTileZones__Dots__DotValue__${i}`}
                className="RangedMeasurementTileZones__Dots__DotValue"
                style={{ left: `${offsetPercent}%` }}
              >
                {value}
              </div>
            </>
          );
        })}
      </div>
      <div
        className="RangedMeasurementTileZones__Scale"
        style={{ background: linearGradient }}
      />
    </div>
  );
};

const getMeasurementValueOffset = (measurement: Measurement): number | null => {
  if (typeof measurement.value === "number" && measurement.range !== null) {
    return getOffsetPercent(
      measurement.range?.lower,
      measurement.range?.upper,
      measurement.value
    );
  }

  return null;
};

const getOffsetPercent = (
  lower: number,
  upper: number,
  value: number
): number => {
  return ((value - lower) / (upper - lower)) * 100;
};

const getLinearGradient = (measurement: Measurement): string => {
  if (!measurement.range) {
    return "";
  }

  let previousOffsetPercent = 0;
  const linearGradientStops = [];

  if (measurement.range.lowerDanger) {
    // If we have a lower danger value.
    const lowerDangerOffsetPercent = getOffsetPercent(
      measurement.range.lower,
      measurement.range.upper,
      measurement.range.lowerDanger
    );

    linearGradientStops.push("var(--color--danger) 0%");
    linearGradientStops.push(
      `var(--color--danger) ${lowerDangerOffsetPercent}%`
    );
    previousOffsetPercent = lowerDangerOffsetPercent;
  }

  if (measurement.range.lowerWarning) {
    // If we have a lower warning value.
    const lowerWarningOffsetPercent = getOffsetPercent(
      measurement.range.lower,
      measurement.range.upper,
      measurement.range.lowerWarning
    );

    if (!measurement.range.lowerDanger) {
      // If there's no lower danger value, then the bar is yellow starting from
      // 0%.
      linearGradientStops.push(`var(--color--warning) 0%`);
      linearGradientStops.push(
        `var(--color--warning) ${lowerWarningOffsetPercent}%`
      );
    } else {
      // If there's a lower danger value, then the bar is yellow starting from
      // that value.
      linearGradientStops.push(
        `var(--color--warning) ${previousOffsetPercent}%`
      );
      linearGradientStops.push(
        `var(--color--warning) ${lowerWarningOffsetPercent}%`
      );
    }

    if (!measurement.range.upperWarning && !measurement.range.upperDanger) {
      // If there are no more warning or danger values, then we reset the bar to
      // green after the warning value.
      linearGradientStops.push(
        `var(--color--ok) ${lowerWarningOffsetPercent}%`
      );
    }

    // Store the last transition point so we can use it later.
    previousOffsetPercent = lowerWarningOffsetPercent;
  }

  if (measurement.range.upperWarning) {
    // If we have an upper warning value.
    const upperWarningOffsetPercent = getOffsetPercent(
      measurement.range?.lower,
      measurement.range?.upper,
      measurement.range?.upperWarning
    );

    // First, we reset the bar to green starting from the last transition point.
    linearGradientStops.push(`var(--color--ok) ${previousOffsetPercent}%`);
    linearGradientStops.push(`var(--color--ok) ${upperWarningOffsetPercent}%`);

    if (!measurement.range.upperDanger) {
      // If there's no upper danger value, then the bar is yellow all the way to
      // 100%.
      linearGradientStops.push(
        `var(--color--warning) ${upperWarningOffsetPercent}%`
      );
      linearGradientStops.push(`var(--color--warning) 100%`);
    } else {
      // If there's an upper danger value, then the bar is yellow only up to
      // that value.
      linearGradientStops.push(
        `var(--color--warning) ${upperWarningOffsetPercent}%`
      );
    }

    // Store the last transition point so we can use it later.
    previousOffsetPercent = upperWarningOffsetPercent;
  }

  if (measurement.range.upperDanger) {
    // If we have an upper danger value.
    const upperDangerOffsetPercent = getOffsetPercent(
      measurement.range.lower,
      measurement.range.upper,
      measurement.range.upperDanger
    );

    if (!measurement.range.upperWarning) {
      // If we saw no upper warning value, then we reset the bar to green
      // starting from the last transition point.
      linearGradientStops.push(`var(--color--ok) ${previousOffsetPercent}%`);
      linearGradientStops.push(`var(--color--ok) ${upperDangerOffsetPercent}%`);
      linearGradientStops.push(
        `var(--color--danger) ${upperDangerOffsetPercent}%`
      );
      linearGradientStops.push(`var(--color--danger) 100%`);
    } else {
      // If we saw an upper warning value, then we know we've already reset the
      // bar to green at some point before.
      linearGradientStops.push(
        `var(--color--warning) ${upperDangerOffsetPercent}%`
      );
      linearGradientStops.push(
        `var(--color--danger) ${upperDangerOffsetPercent}%`
      );
      linearGradientStops.push(`var(--color--danger) 100%`);
    }
  }

  return `linear-gradient(to right, ${linearGradientStops.join(", ")})`;
};
