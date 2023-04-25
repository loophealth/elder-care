import { LoadingSpinner } from "components/LoadingSpinner";
import { lazy, Suspense } from "react";

const ReportDetails = lazy(() => import("./ReportDetailsRoute"));

export const ReportDetailsRoute = () => {
  return (
    <Suspense>
      <ReportDetails />
    </Suspense>
  );
};