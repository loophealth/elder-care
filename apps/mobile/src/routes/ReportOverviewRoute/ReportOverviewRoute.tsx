import { usePatient } from "@loophealth/api";
import { ColorTheme, ReportOverviewGrid } from "@loophealth/ui";

import { LinkThatLooksLikeAButton } from "components/LinkThatLooksLikeAButton";
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
      <LinkThatLooksLikeAButton
        to="/summary"
        className="ReportOverviewRoute__Link"
      >
        View last report summary
      </LinkThatLooksLikeAButton>
    </main>
  );
};
