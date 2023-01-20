import { createContext, ReactNode, useContext, useState } from "react";

import { Patient } from "lib/Patient";

interface PatientContextValue {
  patient: Patient | null;
  setPatient: (healthReport: Patient | null) => void;
}

const PatientContext = createContext<PatientContextValue>({
  patient: null,
  setPatient: () => {},
});

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  return (
    <PatientContext.Provider value={{ patient, setPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
