import { LoadingSpinner } from "components/LoadingSpinner";
import { lazy, Suspense } from "react";

const EditRiskFactors = lazy(() => import("./EditRiskFactorsRoute"));

export const EditRiskFactorsRoute = () => {
  return (
    <Suspense>
      <EditRiskFactors />
    </Suspense>
  );
};
