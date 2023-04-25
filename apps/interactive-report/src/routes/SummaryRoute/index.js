import { LoadingSpinner } from "components/LoadingSpinner";
import { lazy, Suspense } from "react";

const Summary = lazy(() => import("./SummaryRoute"));

export const SummaryRoute = () => {
  return (
    <Suspense>
      <Summary />
    </Suspense>
  );
};
