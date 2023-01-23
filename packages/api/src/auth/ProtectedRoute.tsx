import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";
import { IRequestStatus } from "../types";

export const ProtectedRoute = ({ component }: { component: ReactElement }) => {
  const { user, requestStatus } = useAuth();

  if (
    requestStatus === IRequestStatus.Idle ||
    requestStatus === IRequestStatus.Loading
  ) {
    return null;
  } else if (requestStatus === IRequestStatus.Loaded && user === null) {
    return <Navigate to="/login" />;
  }

  return component;
};
