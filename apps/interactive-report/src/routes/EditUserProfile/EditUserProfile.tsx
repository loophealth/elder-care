import { useEffect, useState } from "react";
import { onSnapshot, updateDoc } from "firebase/firestore";

import {
  DoctorsProfile,
  getDoctors,
  usePatient,
  UserProfile,
} from "@loophealth/api";

import { AdminEditorLayout, Button, Input, Select } from "components";

import "./EditUserProfile.css";
import { groupBy } from "lodash";

export const EditUserProfile = () => {
  const { patient } = usePatient();

  // const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [doctors, setDoctors] = useState<any>([]);
  const [selDoctor, setSelDoctor] = useState("");
  const [selPhysio, setSelPhysio] = useState("");
  const [selCoach, setSelCoach] = useState("");
  const [editEnabled, setEditEnabled] = useState(false);

  useEffect(() => {
    getDoctors().then((data) => {
      setDoctors(groupBy(data, "speciality"));
    });
  }, []);
  // Subscribe to UserProfile updates.
  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.profileRef, (snapshot) => {
      const profile = (snapshot.data() ?? []) as UserProfile;
      // setUserProfile(profile);
      setName(profile?.fullName || "");
      setAge(profile?.age || null);
      setSelDoctor(profile?.doctorId || "");
      setSelCoach(profile?.coachId || "");
      setSelPhysio(profile?.physioId || "");
    });

    return () => {
      unsub();
    };
  }, [patient]);

  const onSubmit = async () => {
    if (!patient) {
      return;
    }
    try {
      await updateDoc(patient.profileRef, {
        ...patient.profile,
        fullName: name,
        age: age,
        doctorId: selDoctor,
        coachId: selCoach,
        physioId: selPhysio,
      });
      setEditEnabled(false);
    } catch (e) {
      alert(
        "There was an error while updating user profile, please contact support"
      );
      console.error(e);
    }
  };
  const onReset = () => {
    setEditEnabled(false);
  };

  return (
    <AdminEditorLayout
      title="User Profile"
      renderLeft={() => (
        <form
          className="Utils__VerticalForm EditCarePlanRoute__Form"
          onSubmit={onSubmit}
        >
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              disabled={!editEnabled}
            />
          </div>
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="age">
              Age
            </label>
            <Input
              id="age"
              type="number"
              value={age ? age : ""}
              onChange={(e) => setAge(parseInt(e.target.value))}
              placeholder="Age"
              required
              disabled={!editEnabled}
            />
          </div>
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="number">
              Phone Number
            </label>
            <label id="number">{patient?.profile?.phoneNumber}</label>
          </div>
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="plan">
              Plan
            </label>
            <label id="plan">{patient?.profile?.plan}</label>
          </div>
          {!editEnabled ? (
            <Input
              id="edit_button"
              className="Edit_Button"
              type="button"
              value="Edit Profile"
              onClick={() => setEditEnabled(true)}
            />
          ) : (
            <div className="Utils__VerticalForm__ButtonsContainer">
              <Input
                id="submit_button"
                className="Button Button--Primary"
                type="button"
                value="Done"
                onClick={onSubmit}
              />
              <Input
                id="cancel_button"
                className="Button"
                type="button"
                value="Cancel"
                onClick={onReset}
              />
            </div>
          )}
        </form>
      )}
      renderRight={() => (
        <div className="Utils__VerticalForm EditCarePlanRoute__Form">
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="doctor">
              Doctor
            </label>
            <Select
              name="doctor"
              id="doctor"
              value={selDoctor}
              onChange={(e) => setSelDoctor(e.target.value)}
              required
              disabled={!editEnabled}
            >
              <option value="">Select Doctor</option>
              {doctors?.["doctor"]?.map((data: DoctorsProfile) => (
                <option value={data.id} key={data.id.toString()}>
                  {data?.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="coach">
              Coach
            </label>
            <Select
              name="coach"
              id="coach"
              value={selCoach}
              onChange={(e) => setSelCoach(e.target.value)}
              required
              disabled={!editEnabled}
            >
              <option value="">Select Coach</option>
              {doctors?.["coach"]?.map((data: DoctorsProfile) => (
                <option value={data.id} key={data.id.toString()}>
                  {data?.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="physiotherapist">
              Physiotherapist
            </label>
            <Select
              name="physiotherapist"
              id="physiotherapist"
              value={selPhysio}
              onChange={(e) => setSelPhysio(e.target.value)}
              required
              disabled={!editEnabled}
            >
              <option value="">Select Physiotherapist</option>
              {doctors?.["physiotherapist"]?.map((data: DoctorsProfile) => (
                <option value={data.id} key={data.id.toString()}>
                  {data?.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}
    />
  );
};
