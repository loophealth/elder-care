import { useParams } from "react-router-dom";

import { findMeasurementsByCategorySlug, usePatient } from "@loophealth/api";
import {
  ColorTheme,
  ColumnsReportLayout,
  EkgReportLayout,
  UrineReportLayout,
} from "@loophealth/ui";

import { PageHeader } from "components/PageHeader";

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
    layoutElt = (
      <UrineReportLayout
        measurements={measurements}
        colorTheme={ColorTheme.Light}
      />
    );
  } else if (slug === "6-lead-ekg") {
    layoutElt = (
      <EkgReportLayout
        measurements={measurements}
        colorTheme={ColorTheme.Light}
      />
    );
  } else {
    layoutElt = (
      <ColumnsReportLayout
        measurements={measurements}
        colorTheme={ColorTheme.Light}
      />
    );
  }

  return (
    <main className="ReportDetailsRoute">
      <PageHeader label={categoryName} backHref="/report" />
      {layoutElt}
    </main>
  );
};
