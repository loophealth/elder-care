import { LoadingSpinner } from "components/LoadingSpinner";
import { lazy, Suspense } from "react";

const Notification = lazy(() => import("./NotificationRoute"));

export const NotificationRoute = () => {
  return (
    <Suspense>
      <Notification />
    </Suspense>
  );
};
