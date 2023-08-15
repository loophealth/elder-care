import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@loophealth/api";

import { RootLayout } from "components/RootLayout";
import { LoginRoute } from "routes/LoginRoute";
import { SummaryRoute } from "routes/SummaryRoute";
import { HomeRoute } from "routes/HomeRoute";
import { CareRoute } from "routes/CareRoute";
import { ReportOverviewRoute } from "routes/ReportOverviewRoute";
import { ReportDetailsRoute } from "routes/ReportDetailsRoute";
import { PrescriptionRoute } from "routes/PrescriptionRoute";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <LoginRoute />,
      },
      {
        path: "/summary",
        element: <ProtectedRoute component={<SummaryRoute />} />,
      },
      {
        path: "/prescriptions",
        element: <ProtectedRoute component={<PrescriptionRoute />} />,
      },
    ],
  },
  {
    element: <RootLayout shouldShowNavbar={true} />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute component={<HomeRoute />} />,
      },
      {
        path: "/care",
        element: <ProtectedRoute component={<CareRoute />} />,
      },
      {
        path: "/report",
        element: <ProtectedRoute component={<ReportOverviewRoute />} />,
      },
      {
        path: "/report/:slug",
        element: <ProtectedRoute component={<ReportDetailsRoute />} />,
      },
    ],
  },
]);
