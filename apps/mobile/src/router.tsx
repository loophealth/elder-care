import { createBrowserRouter } from "react-router-dom";

import { Root } from "routes/Root";
import { Home } from "routes/Home";
import { Login } from "routes/Login/Login";
import { Protected } from "routes/Protected";
import { authLoader } from "lib/firebaseHelpers";

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
        loader: authLoader,
        children: [
          {
            path: "/protected",
            element: <Protected />,
          },
        ],
      },
    ],
  },
]);
