import { usePatient } from "@loophealth/api";
import { ColorTheme, ReportOverviewGrid } from "@loophealth/ui";

import "./ReportOverviewRoute.css";

export const ReportOverviewRoute = () => {
  const { patient } = usePatient();

  return (
    <main className="ReportOverviewRoute">
      <ReportOverviewGrid
        colorTheme={ColorTheme.Light}
        categories={patient?.report.categories || []}
      />
    </main>
  );
};
