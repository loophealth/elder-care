import { LoadingSpinner } from "components/LoadingSpinner";
import { lazy, Suspense } from "react";

const EditTimeline = lazy(() => import("./EditTimelineRoute"));

export const EditTimelineRoute = () => {
  return (
    <Suspense>
      <EditTimeline />
    </Suspense>
  );
};
