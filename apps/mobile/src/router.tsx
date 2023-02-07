import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@loophealth/api";

import { RootLayout } from "components/RootLayout";
import { LoginRoute } from "routes/LoginRoute";
import { HomeRoute } from "routes/HomeRoute";
import { CareRoute } from "routes/CareRoute";
import { ReportOverviewRoute } from "routes/ReportOverviewRoute";
import { ReportDetailsRoute } from "routes/ReportDetailsRoute";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <LoginRoute />,
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
        path: "/insurance",
        element: <ProtectedRoute component={<h1>Insurance</h1>} />,
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
