import { Link } from "react-router-dom";
import clsx from "clsx";

import {
  MeasurementCategory,
  MeasurementCategoryStatus,
} from "@loophealth/api";

import { slugifyCategoryName } from "../../lib/slugify_category_name";

import hypertensionIcon from "../../images/hypertension.svg";
import measurementIcon from "../../images/measurement.svg";
import bloodIcon from "../../images/blood.svg";
import kidneysIcon from "../../images/kidneys.svg";
import sugarIcon from "../../images/sugar.svg";
import heartIcon from "../../images/heart.svg";
import electrolytesIcon from "../../images/electrolytes.svg";
import thyroidIcon from "../../images/thyroid.svg";
import liverIcon from "../../images/liver.svg";
import vitaminsIcon from "../../images/vitamins.svg";
import ironIcon from "../../images/iron.svg";
import urineIcon from "../../images/urine.svg";
import ekgIcon from "../../images/ekg.svg";

import "./CategoryTile.css";

export const CategoryTile = ({
  category,
}: {
  category: MeasurementCategory;
}) => {
  const slug = slugifyCategoryName(category.name);
  return (
    <Link className="CategoryTile" to={`/report/${slug}`}>
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
  ["vitals", hypertensionIcon],
  ["measurements", measurementIcon],
  ["blood", bloodIcon],
  ["kidney-function", kidneysIcon],
  ["sugar", sugarIcon],
  ["lipid-profile", heartIcon],
  ["electrolytes", electrolytesIcon],
  ["thyroid-function", thyroidIcon],
  ["liver-function", liverIcon],
  ["vitamins", vitaminsIcon],
  ["iron-profile", ironIcon],
  ["urine-routine", urineIcon],
  ["6-lead-ekg", ekgIcon],
]);

const CategoryTileIcon = ({ name, slug }: { name: string; slug: string }) => {
  const iconPath = categoryIcons.get(slug) || measurementIcon;

  return (
    <div className="CategoryTileIcon">
      <img src={iconPath} alt={`Icon for report category "${name}"`} />
    </div>
  );
};
