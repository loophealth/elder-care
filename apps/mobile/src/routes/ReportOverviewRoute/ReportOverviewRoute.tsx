import { usePatient } from "@loophealth/api";
import { ColorTheme, ReportOverviewGrid } from "@loophealth/ui";

import { PageHeader } from "components/PageHeader";

import "./ReportOverviewRoute.css";

export const ReportOverviewRoute = () => {
  const { patient } = usePatient();

  return (
    <main className="ReportOverviewRoute">
      <PageHeader label="Your Health" />
      <ReportOverviewGrid
        colorTheme={ColorTheme.Light}
        categories={patient?.report.categories || []}
      />
    </main>
  );
};
