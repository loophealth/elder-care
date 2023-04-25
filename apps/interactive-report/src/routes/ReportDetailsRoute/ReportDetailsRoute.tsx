import { Link, useParams } from "react-router-dom";

import { findMeasurementsByCategorySlug, usePatient } from "@loophealth/api";
import {
  ColumnsReportLayout,
  EkgReportLayout,
  UrineReportLayout,
} from "@loophealth/ui";

import "./ReportDetailsRoute.css";

export const ReportDetailsRoute = () => {
  const { patient } = usePatient();
  const { slug = "" } = useParams();
  const measurements =
    findMeasurementsByCategorySlug(patient?.report.measurements || [], slug) ||
    [];
  const categoryName = measurements[0]?.category || "";

  let layoutElt = null;
  if (slug === "urine-routine") {
    layoutElt = <UrineReportLayout measurements={measurements} />;
  } else if (slug === "6-lead-ekg") {
    layoutElt = <EkgReportLayout measurements={measurements} />;
  } else {
    layoutElt = <ColumnsReportLayout measurements={measurements} />;
  }

  return (
    <>
      <div className="ReportDetailsRoute__Header">
        <Link className="ReportDetailsRoute__Header__Button" to="/report">
          <img src="/img/back.svg" alt="Back button" />
        </Link>
        <h1 className="ReportDetailsRoute__Header__Title">{categoryName}</h1>
        <div className="ReportDetailsRoute__Header__Button" />
      </div>
      <main className="ReportDetailsRoute">{layoutElt}</main>
    </>
  );
};

export default ReportDetailsRoute;
