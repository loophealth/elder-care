import { LoadingSpinner } from "components/LoadingSpinner";
import { lazy, Suspense } from "react";

const Timeline = lazy(() => import("./TimelineRoute"));

export const TimelineRoute = () => {
  return (
    <Suspense>
      <Timeline />
    </Suspense>
  );
};
