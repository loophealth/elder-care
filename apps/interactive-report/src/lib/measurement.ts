import slugify from "slugify";

import { Measurement } from "lib/commonTypes";

export const RANGED_TILE_CATEGORIES = new Set([
  "Blood",
  "Sugar",
  "Kidney Function",
  "Liver Function",
  "Thyroid Function",
  "Lipid Profile",
  "Electrolytes",
  "Vitamins",
  "Iron Profile",
]);

export const isRangedMeasurement = (measurement: Measurement) => {
  return RANGED_TILE_CATEGORIES.has(measurement.category);
};

export const findMeasurementByName = (
  measurements: Measurement[],
  name: string
) => {
  return measurements.find((m) => m.name === name);
};

export const findMeasurementsByCategorySlug = (
  measurements: Measurement[],
  slugToFind: string
): Measurement[] => {
  return measurements.filter(
    (m) => slugifyCategoryName(m.category) === slugToFind
  );
};

export const slugifyCategoryName = (name: string) => {
  return slugify(name, { lower: true, strict: true, trim: true });
};
