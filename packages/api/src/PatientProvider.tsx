import { createContext, ReactNode, useContext, useState } from "react";

import { Patient } from "./Patient";
import { UserProfile } from "./types";

interface PatientContextValue {
  patient: Patient | null;
  foundPatient: UserProfile[] | null;
  setPatient: (healthReport: Patient | null) => void;
  setFoundPatient: (profiles: UserProfile[] | null) => void;
}

const PatientContext = createContext<PatientContextValue>({
  patient: null,
  foundPatient: null,
  setPatient: () => {},
  setFoundPatient: () => {},
});

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [foundPatient, setFoundPatient] = useState<UserProfile[] | null>(null);
  return (
    <PatientContext.Provider value={{ patient, foundPatient, setPatient, setFoundPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
