import { LoadingSpinner } from "components/LoadingSpinner";
import { lazy, Suspense } from "react";

const ReportOverview = lazy(() => import("./ReportOverviewRoute"));

export const ReportOverviewRoute = () => {
  return (
    <Suspense>
      <ReportOverview />
    </Suspense>
  );
};

