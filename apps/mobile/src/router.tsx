import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@loophealth/api";

import { HomeRoute } from "routes/HomeRoute";
import { LoginRoute } from "routes/LoginRoute";
import { RootLayout } from "components/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute component={<HomeRoute />} />,
      },
      {
        path: "/care",
        element: <ProtectedRoute component={<h1>Care</h1>} />,
      },
      {
        path: "/insurance",
        element: <ProtectedRoute component={<h1>Insurance</h1>} />,
      },
      {
        path: "/you",
        element: <ProtectedRoute component={<h1>You</h1>} />,
      },
    ],
  },
]);
