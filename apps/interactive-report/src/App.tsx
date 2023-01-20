import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { router } from "router";
import { IRequestStatus, useAuth } from "@loophealth/api";
import { auth } from "lib/firebaseHelpers";

import "reset.css";
import "utopia.css";
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
