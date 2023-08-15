import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { CarePlan, usePatient } from "@loophealth/api";
import { ReactComponent as BackIcon } from "images/back.svg";

import "./PrescriptionRoute.css";
import { onSnapshot } from "firebase/firestore";

export const PrescriptionRoute = () => {
  // const navigate = useNavigate();
  const { patient } = usePatient();
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);

  // Subscribe to care plan updates.
  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.carePlanRef, (snapshot) => {
      const carePlan = (snapshot.data() ?? []) as CarePlan;
      setCarePlan(carePlan);
    });

    return () => {
      unsub();
    };
  }, [patient]);

  return (
    <main className="PrescriptionRoute">
      <Link to={"/"} className="PageHeader__Icon">
        {<BackIcon />}
      </Link>
      {carePlan?.prescription?.map((data, index) => (
        <PrescriptionList key={index.toString()} data={data} />
      ))}
      {/* {carePlan?.physioPrescription?.map((data) => (
        <PrescriptionList data={data} />
      ))} */}
    </main>
  );
};

const PrescriptionList = ({ data }: { data: any }) => {
  return (
    <div>
      <label>{data?.recommendation}</label>
      <label>{data?.details}</label>
      <a href={data.link} target="_blank" rel="noreferrer">
        View Prescription
      </a>
    </div>
  );
};
