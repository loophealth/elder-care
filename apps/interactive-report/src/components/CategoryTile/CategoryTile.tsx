import { Link } from "react-router-dom";
import clsx from "clsx";

import {
  MeasurementCategory,
  MeasurementCategoryStatus,
} from "@loophealth/api";

import { slugifyCategoryName } from "lib/measurement";

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
  ["vitals", "hypertension"],
  ["measurements", "measurement"],
  ["kidney-function", "kidneys"],
  ["sugar", "sugar"],
  ["lipid-profile", "heart"],
  ["electrolytes", "electrolytes"],
  ["thyroid-function", "thyroid"],
  ["liver-function", "liver"],
  ["vitamins", "vitamins"],
  ["iron-profile", "iron"],
  ["urine-routine", "urine"],
  ["6-lead-ekg", "ekg"],
]);

const CategoryTileIcon = ({ name, slug }: { name: string; slug: string }) => {
  const iconFileName = categoryIcons.get(slug) || "measurement";
  const iconPath = `/img/${iconFileName}.svg`;

  return (
    <div className="CategoryTileIcon">
      <img src={iconPath} alt={`Icon for report category "${name}"`} />
    </div>
  );
};
