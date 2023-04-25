import { LoadingSpinner } from "components/LoadingSpinner";
import { lazy, Suspense } from "react";

const CarePlan = lazy(() => import("./CarePlanRoute"));

export const CarePlanRoute = () => {
  return (
    <Suspense>
      <CarePlan />
    </Suspense>
  );
};
