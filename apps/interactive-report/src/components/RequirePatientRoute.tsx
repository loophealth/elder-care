import { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { Patient, usePatient } from "@loophealth/api";
import { useLocalStorage } from "lib/useLocalStorage";
import { PATIENT_PHONE_NUMBER_KEY } from "routes/HomeRoute";

export const RequirePatientRoute = ({
  component,
}: {
  component: ReactElement;
}) => {
  const { patient, setPatient } = usePatient();
  const [loading, setLoading] = useState<boolean>(false);
  const [storedValue] = useLocalStorage(PATIENT_PHONE_NUMBER_KEY, "");

  useEffect(() => {
    const getPatientFromPhoneNumber = async (phoneNumber: string, relation: string) => {
      const phoneNumberWithCountryCode = `+91${phoneNumber}`;
      const newPatient = await Patient.fromPhoneNumber(phoneNumberWithCountryCode, relation);
      setPatient(newPatient);
      setLoading(false);
    };
    if (!patient && storedValue && !loading) {
      setLoading(true);
      const {phoneNumber, relation} = JSON.parse(storedValue);
      getPatientFromPhoneNumber(phoneNumber, relation);
    }
    // eslint-disable-next-line
  }, [storedValue]);

  if (!patient && !storedValue) {
    return <Navigate to="/" />;
  }

  return component;
};
