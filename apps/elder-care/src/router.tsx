import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "components/RootLayout";
import { LoginRoute } from "routes/LoginRoute";
import { HomeRoute } from "routes/HomeRoute";
import { CareRoute } from "routes/CareRoute";
import { ReportRoute } from "routes/ReportRoute";

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
        element: <HomeRoute />,
      },
      {
        path: "/care",
        element: <CareRoute />,
      },
      {
        path: "/report",
        element: <ReportRoute />,
      },
    ],
  },
]);
