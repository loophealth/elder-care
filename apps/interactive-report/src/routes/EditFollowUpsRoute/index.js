import { LoadingSpinner } from "components/LoadingSpinner";
import { lazy, Suspense } from "react";

const EditFollowUps = lazy(() => import("./EditFollowUpsRoute"));

export const EditFollowUpsRoute = () => {
  return (
    <Suspense>
      <EditFollowUps />
    </Suspense>
  );
};
