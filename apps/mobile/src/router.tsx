import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@loophealth/api";

import { Root } from "routes/Root";
import { Home } from "routes/Home";
import { Login } from "routes/Login/Login";
import { Protected } from "routes/Protected";

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/protected",
        element: <ProtectedRoute component={<Protected />} />,
      },
    ],
  },
]);
