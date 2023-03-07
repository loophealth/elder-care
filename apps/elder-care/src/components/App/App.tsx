import { RouterProvider } from "react-router-dom";

import "@loophealth/ui/src/styles/reset.css";
import "@loophealth/ui/src/styles/utopia.css";
import "@loophealth/ui/src/styles/globals.css";
import "@loophealth/ui/src/styles/utils.css";
import "@loophealth/ui/src/fonts/ApercuPro/ApercuPro.css";

import { router } from "router";

import "utils.css";
import "index.css";

export const App = () => {
  return <RouterProvider router={router} />;
};
