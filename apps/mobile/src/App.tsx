import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { IRequestStatus, useAuth } from "@loophealth/api";

import { router } from "router";
import { auth } from "lib/firebaseHelpers";

import "./index.css";

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
