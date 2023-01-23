import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@loophealth/api";

import { HomeRoute } from "routes/HomeRoute";
import { LoginRoute } from "routes/LoginRoute";
import { RootLayout } from "components/RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute component={<HomeRoute />} />,
      },
      {
        path: "/login",
        element: <LoginRoute />,
      },
    ],
  },
]);
