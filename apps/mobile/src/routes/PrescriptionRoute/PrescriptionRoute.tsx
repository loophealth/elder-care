import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  CarePlanItem,
  DoctorsProfile,
  getDoctors,
  usePatient,
} from "@loophealth/api";
import { ReactComponent as BackIcon } from "images/back.svg";

import "./PrescriptionRoute.css";
import { format } from "date-fns";

export const PrescriptionRoute = () => {
  const { patient } = usePatient();
  const location = useLocation();
  const { prescriptionData, prescriptionType } = location.state;
  const [selected, setSelected] = useState(0);
  const [doctorDetails, setDoctorDetails] = useState<DoctorsProfile[] | []>([]);
  const [filteredData, setFilteredData] = useState<CarePlanItem[] | []>(
    prescriptionData[prescriptionType[0]] || []
  );

  useEffect(() => {
    const presType = prescriptionType[selected];
    const getDocData = async (presType: string) => {
      let data;
      switch (presType) {
        case "physician": {
          data = await getDoctors(patient?.profile?.doctorId);
          setDoctorDetails(data);
          break;
        }
        case "physiotherapist": {
          data = await getDoctors(patient?.profile?.physioId);
          setDoctorDetails(data);
          break;
        }
        case "coach": {
          data = await getDoctors(patient?.profile?.coachId);
          setDoctorDetails(data);
          break;
        }
      }
    };
    getDocData(presType);
    // eslint-disable-next-line
  }, [selected]);

  return (
    <main className="PrescriptionRoute">
      <div className="headerContainer">
        <Link to={"/"} className="PageHeader__Icon">
          {<BackIcon />}
        </Link>
        <div className="headerLabel">{"Prescription History"}</div>
      </div>
      <div className="filterButtonContainer">
        {prescriptionType.map((data: any, index: any) => (
          <div
            className={
              selected === index ? "filterButton selected" : "filterButton"
            }
            key={index.toString()}
            onClick={() => {
              setSelected(index);
              setFilteredData(prescriptionData[prescriptionType[index]]);
            }}
          >
            <div>{data}</div>
          </div>
        ))}
      </div>
      {doctorDetails && doctorDetails.length === 1 ? (
        <div className="Doctor__Container">
          <div className="Doctor__Image__Container">
            <img
              src={doctorDetails[0]?.profilePic || ""}
              alt="Doctor Pic"
              className="Doctor__Image"
            />
          </div>
          <div className="Doctor__Info__Container">
            <label className="Doctor__Name">{doctorDetails[0]?.name}</label>
            <label className="Doctor__Title">{doctorDetails[0]?.title}</label>
            <label className="Doctor__Title">
              {doctorDetails[0]?.qualification}
            </label>
            <label className="Doctor__Title">
              {new Date().getFullYear() -
                parseInt(doctorDetails[0]?.practiceStartYear)}{" "}
              years of experience
            </label>
          </div>
        </div>
      ) : null}
      <div className="Prescription__Container">
        <div className="HomeRoute__Timeline__TimelineTicks" />
        {filteredData?.map((data: any, index: number) => (
          <PrescriptionList key={index.toString()} data={data} />
        ))}
      </div>
    </main>
  );
};

const PrescriptionList = ({ data }: { data: CarePlanItem }) => {
  const prescDate = new Date(
    data?.createdOn?.seconds * 1000 + data?.createdOn?.nanoseconds / 1000000
  );
  return (
    <div className="Prescription__List__Container">
      <div className="HomeRoute__Dot HomeRoute__Dot--Inactive" />
      <div className="Prescription__Data">
        <label className="Prescription__Data__Title">
          <b>{data?.prescriptionWeek ? data?.prescriptionWeek + "," : ""}</b>{" "}
          {format(prescDate, "dd MMM yyyy")}
        </label>
        <div>
          <a
            href={data.link}
            className="Prescription__Link"
            target="_blank"
            rel="noreferrer"
          >
            View Prescription
          </a>
        </div>
      </div>
    </div>
  );
};
