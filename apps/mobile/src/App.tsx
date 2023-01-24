import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { IRequestStatus, useAuth } from "@loophealth/api";

import { router } from "router";
import { auth } from "lib/firebaseHelpers";

import "fonts/ApercuPro/ApercuPro.css";
import "utopia.css";
import "index.css";

export const App = () => {
  const { setUser, setRequestStatus } = useAuth();

  // Handle auth state changes. Doing it here lets us call sign in and sign out
  // from anywhere else in the app, and be sure that any components that depend
  // on the auth state will get re-rendered.
  useEffect(() => {
    setRequestStatus(IRequestStatus.Loading);
    onAuthStateChanged(auth, (user) => {
      setRequestStatus(IRequestStatus.Loaded);
      setUser(user);
    });
  }, [setUser, setRequestStatus]);

  return <RouterProvider router={router} />;
};
