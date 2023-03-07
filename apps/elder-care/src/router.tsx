import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "components/RootLayout";
import { LoginRoute } from "routes/LoginRoute";
import { HomeRoute } from "routes/HomeRoute";

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
    ],
  },
]);
