import { Link } from "react-router-dom";
import clsx from "clsx";

import {
  MeasurementCategory,
  MeasurementCategoryStatus,
} from "@loophealth/api";

import { slugifyCategoryName } from "../../lib/slugify_category_name";
import { ColorTheme } from "../../types";

import { ReactComponent as HypertensionIcon } from "../../images/hypertension.svg";
import { ReactComponent as MeasurementIcon } from "../../images/measurement.svg";
import { ReactComponent as BloodIcon } from "../../images/blood.svg";
import { ReactComponent as KidneysIcon } from "../../images/kidneys.svg";
import { ReactComponent as SugarIcon } from "../../images/sugar.svg";
import { ReactComponent as HeartIcon } from "../../images/heart.svg";
import { ReactComponent as ElectrolytesIcon } from "../../images/electrolytes.svg";
import { ReactComponent as ThyroidIcon } from "../../images/thyroid.svg";
import { ReactComponent as LiverIcon } from "../../images/liver.svg";
import { ReactComponent as VitaminsIcon } from "../../images/vitamins.svg";
import { ReactComponent as IronIcon } from "../../images/iron.svg";
import { ReactComponent as UrineIcon } from "../../images/urine.svg";
import { ReactComponent as EkgIcon } from "../../images/ekg.svg";

import "./CategoryTile.css";

interface CategoryTileProps {
  category: MeasurementCategory;
  colorTheme?: ColorTheme;
}

export const CategoryTile = ({
  category,
  colorTheme = ColorTheme.Dark,
}: CategoryTileProps) => {
  const slug = slugifyCategoryName(category.name);
  const appliedClassName = clsx("CategoryTile", {
    "CategoryTile--Light": colorTheme === ColorTheme.Light,
    "CategoryTile--Dark": colorTheme === ColorTheme.Dark,
  });

  return (
    <Link className={appliedClassName} to={`/report/${slug}`}>
      <div className="CategoryTile__StatusContainer">
        <CategoryTileIcon name={category.name} slug={slug} />
        <StatusIndicator status={category.status} />
      </div>
      <div className="CategoryTile__Name">{category.name}</div>
    </Link>
  );
};

const StatusIndicator = ({ status }: { status: MeasurementCategoryStatus }) => {
  const appliedClasses = clsx("StatusIndicator", {
    "StatusIndicator--Ok": status === "Ok",
    "StatusIndicator--Warning": status === "Warning",
    "StatusIndicator--Danger": status === "Danger",
  });

  return <div className={appliedClasses} />;
};

const categoryIcons = new Map([
  ["vitals", HypertensionIcon],
  ["measurements", MeasurementIcon],
  ["blood", BloodIcon],
  ["kidney-function", KidneysIcon],
  ["sugar", SugarIcon],
  ["lipid-profile", HeartIcon],
  ["electrolytes", ElectrolytesIcon],
  ["thyroid-function", ThyroidIcon],
  ["liver-function", LiverIcon],
  ["vitamins", VitaminsIcon],
  ["iron-profile", IronIcon],
  ["urine-routine", UrineIcon],
  ["6-lead-ekg", EkgIcon],
]);

const CategoryTileIcon = ({ name, slug }: { name: string; slug: string }) => {
  const IconElt = categoryIcons.get(slug) || MeasurementIcon;

  return (
    <div className="CategoryTileIcon">
      <IconElt />
    </div>
  );
};
