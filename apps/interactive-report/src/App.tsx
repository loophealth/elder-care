import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { IRequestStatus, useAuth, auth } from "@loophealth/api";
import "@loophealth/ui/src/styles/reset.css";
import "@loophealth/ui/src/styles/utopia.css";

import { router } from "router";

import "globals.css";
import "utils.css";
import "fonts/ApercuPro/ApercuPro.css";

export const App = () => {
  const { setUser, setRequestStatus } = useAuth();

  useEffect(() => {
    setRequestStatus(IRequestStatus.Loading);
    onAuthStateChanged(auth, (user) => {
      setRequestStatus(IRequestStatus.Loaded);
      setUser(user);
    });
  }, [setUser, setRequestStatus]);

  return <RouterProvider router={router} />;
};
