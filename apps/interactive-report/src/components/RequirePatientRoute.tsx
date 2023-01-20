import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { usePatient } from "lib/PatientProvider";

export const RequirePatientRoute = ({
  component,
}: {
  component: ReactElement;
}) => {
  const { patient } = usePatient();

  if (!patient) {
    return <Navigate to="/" />;
  }

  return component;
};
