import { createBrowserRouter } from "react-router-dom";

import { Root } from "routes/BaseLayout";
import { LoginRoute } from "routes/LoginRoute";
import { HomeRoute } from "routes/HomeRoute";
import { TimelineRoute } from "routes/TimelineRoute";
import { ReportOverviewRoute } from "routes/ReportOverviewRoute";
import { ReportDetailsRoute } from "routes/ReportDetailsRoute";
import { SummaryRoute } from "routes/SummaryRoute";
import { CarePlanRoute } from "routes/CarePlanRoute";
import { AdminRoute } from "routes/AdminRoute";
import { EditTimelineRoute } from "routes/EditTimelineRoute";
import { EditCarePlanRoute } from "routes/EditCarePlanRoute";

import { ProtectedRoute } from "@loophealth/api";
import { RequirePatientRoute } from "components/RequirePatientRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/login",
        element: <LoginRoute />,
      },
      {
        path: "/",
        element: <ProtectedRoute component={<HomeRoute />} />,
      },
      {
        path: "/timeline",
        element: (
          <ProtectedRoute
            component={<RequirePatientRoute component={<TimelineRoute />} />}
          />
        ),
      },
      {
        path: "/report",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute
                component={
                  <RequirePatientRoute component={<ReportOverviewRoute />} />
                }
              />
            ),
          },
          {
            path: ":slug",
            element: (
              <ProtectedRoute
                component={
                  <RequirePatientRoute component={<ReportDetailsRoute />} />
                }
              />
            ),
          },
        ],
      },
      {
        path: "/summary",
        element: (
          <ProtectedRoute
            component={<RequirePatientRoute component={<SummaryRoute />} />}
          />
        ),
      },
      {
        path: "/care-plan",
        element: (
          <ProtectedRoute
            component={<RequirePatientRoute component={<CarePlanRoute />} />}
          />
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute
            component={<RequirePatientRoute component={<AdminRoute />} />}
          />
        ),
      },
      {
        path: "/admin/timeline",
        element: (
          <ProtectedRoute
            component={
              <RequirePatientRoute component={<EditTimelineRoute />} />
            }
          />
        ),
      },
      {
        path: "/admin/care-plan",
        element: (
          <ProtectedRoute
            component={
              <RequirePatientRoute component={<EditCarePlanRoute />} />
            }
          />
        ),
      },
    ],
  },
]);
