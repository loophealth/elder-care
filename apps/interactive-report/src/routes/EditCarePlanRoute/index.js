import { LoadingSpinner } from "components/LoadingSpinner";
import { lazy, Suspense } from "react";

const EditCarePlan = lazy(() => import("./EditCarePlanRoute"));

export const EditCarePlanRoute = () => {
  return (
    <Suspense>
      <EditCarePlan />
    </Suspense>
  );
};

