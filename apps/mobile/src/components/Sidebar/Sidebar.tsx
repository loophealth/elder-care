import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { Patient, UserProfile, usePatient } from "@loophealth/api";
import { ReactComponent as UserIcon } from "images/user-circle.svg";

export const Sidebar = () => {
  const { patient, setPatient, foundPatient } = usePatient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggleSidebar = () => {
    const el = document.getElementsByClassName("Navbar")[0];
    el.classList.toggle("hide");
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const setSelectedProfile = async () => {
      if (patient?.profile?.relation) {
        const activeUserIndex =
          foundPatient &&
          foundPatient.findIndex(
            (data) => data.relation === patient.profile.relation
          );
        setSelectedIndex(activeUserIndex || 0);
      }
    };
    if (patient) setSelectedProfile();
    // eslint-disable-next-line
  }, [patient]);

  const onProfileSelected = async (profile: UserProfile, index: number) => {
    setSelectedIndex(index);
    const newPatient = await Patient.fromPhoneNumber(
      profile.phoneNumber,
      profile?.relation
    );
    if (!newPatient) {
      return;
    }
    setPatient(newPatient);
    toggleSidebar();
  };

  if (foundPatient && foundPatient.length > 1) {
    return (
      <div className="sidebar">
        <div className="sidebar_icon" onClick={toggleSidebar}>
          <UserIcon className="User_Icon" />
        </div>
        {sidebarOpen ? (
          <div className="">
            <div
              className={sidebarOpen ? "blur" : ""}
              onClick={toggleSidebar}
            />

            <div className="sidebar_items">
              {foundPatient.map((patient, index) => (
                <div
                  key={index.toString()}
                  className={
                    selectedIndex === index
                      ? "sidebar_item selected_item"
                      : "sidebar_item"
                  }
                  onClick={() => onProfileSelected(patient, index)}
                >
                  <UserIcon className="User_Icon" />
                  <div className="Profile_Container">
                    <p className="User_Full_Name">{patient.fullName}</p>
                    <p className="User_Relation">
                      {patient.relation ? `${patient.relation}` : ``}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  } else {
    return null;
  }
};

export default React.memo(Sidebar);
