import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ZodError } from "zod";
import { FirebaseError } from "firebase/app";

import {
  Patient,
  usePatient,
  ExcelHealthReportParseError,
  parseExcelHealthReport,
  isApiError,
  createHealthReportAndUserProfile,
} from "@loophealth/api";

import { Button, Input, FilePicker } from "components";

import "./HomeRoute.css";
import { useLocalStorage } from "lib/useLocalStorage";

export const PATIENT_PHONE_NUMBER_KEY = "PATIENT_PHONE_NUMBER_KEY";

export const HomeRoute = () => {
  return (
    <main className="HomeRoute">
      <OpenReportTile />
      <CreateReportTile />
    </main>
  );
};

/**
 * Opens a report for a patient by searching for their phone number.
 */
const OpenReportTile = () => {
  const navigate = useNavigate();
  const { patient, setPatient } = usePatient();

  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    patient?.report.phoneNumber || ""
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [foundPatient, setFoundPatient] = useState<Patient | null>(
    patient || null
  );

  const [, setValue] = useLocalStorage(PATIENT_PHONE_NUMBER_KEY, "")
  useEffect(() => {
    // When shouldRedirect transitions to true, and we have a healthReport,
    // redirect to the report page.
    if (shouldRedirect && patient) {
      navigate("/report");
    }
  }, [shouldRedirect, patient, navigate]);

  // Search for a report by phone number.
  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const phoneNumberWithCountryCode = `+91${phoneNumber}`;
      const newPatient = await Patient.fromPhoneNumber(
        phoneNumberWithCountryCode
      );
      setFoundPatient(newPatient);
      setValue(phoneNumber);
    } catch (e: any) {
      const message = isApiError(e)
        ? e.message
        : "An unknown error occurred, please contact support";
      setValue("");
      alert(message);
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  // Reset the search form.
  const onReset = (e: FormEvent) => {
    e.preventDefault();
    setPhoneNumber("");
    setIsSearching(false);
    setFoundPatient(null);
    setPatient(null);
    setValue("");
  };

  // Open the report for the found patient and redirect to the report page.
  const onOpenReport = async (e: FormEvent) => {
    e.preventDefault();

    if (!foundPatient) {
      return;
    }

    setPatient(foundPatient);
    setShouldRedirect(true);
  };

  return (
    <div className="HomeRoute__Tile">
      <h1 className="HomeRoute__Tile__Title">Enter patient's phone number</h1>
      <form className="HomeRoute__Tile__SearchForm" onSubmit={onSearch}>
        <div className="HomeRoute__Tile__Group">
          <label htmlFor="phoneNumber" className="Utils__Label">
            Ten digit phone number
          </label>
          <Input
            maxLength={10}
            minLength={10}
            pattern="[0-9]*"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="search"
            id="phoneNumber"
            placeholder="9999942688"
          />
        </div>
        <div className="HomeRoute__Tile__ButtonsContainer">
          {
            <Button onClick={onReset} disabled={isSearching}>
              Reset
            </Button>
          }
          {
            <Button type="submit" isPrimary disabled={isSearching}>
              Search
            </Button>
          }
        </div>
      </form>
      {foundPatient && (
        <>
          <div className="HomeRoute__Tile__Group">
            <h2 className="Utils__Label">Found patient</h2>
            <p>
              {foundPatient.profile.fullName} ({foundPatient.profile.age} years
              old)
            </p>
          </div>
          <div className="HomeRoute__Tile__ButtonsContainer">
            <Button onClick={onOpenReport} isPrimary>
              Open report
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Creates a new report by uploading an Excel file.
 */
const CreateReportTile = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const onPick = (file: File) => {
    setExcelFile(file);
  };

  const onSave = async () => {
    if (!excelFile) {
      return;
    }

    setIsCreating(true);

    let createdReport;
    try {
      const excelReport = await parseExcelHealthReport(excelFile);
      createdReport = await createHealthReportAndUserProfile(excelReport);
    } catch (e: any) {
      let message = "An unknown error occurred, please contact support";
      if (e instanceof ZodError) {
        message = "Invalid Excel file, please try again with a valid file";
      } else if (e instanceof FirebaseError) {
        message = "An error occurred while saving the report, please try again";
      } else if (e instanceof ExcelHealthReportParseError) {
        message = e.message;
      }
      alert(message);
      console.error(e);
    } finally {
      setIsCreating(false);
    }

    if (createdReport) {
      alert(
        "Report created/updated successfully. You can now search for it using the patient's phone number."
      );
      onReset();
    }
  };

  const onReset = () => {
    setExcelFile(null);
  };

  return (
    <div className="HomeRoute__Tile">
      <h1 className="HomeRoute__Tile__Title">Create new report</h1>
      <p className="HomeRoute__Tile__Description">
        Create a new report using an Excel file stored on your computer.
      </p>
      <div className="HomeRoute__Tile__ButtonsContainer">
        <FilePicker
          label="Choose file"
          onPick={onPick}
          isPrimary
          disabled={isCreating}
        />
      </div>
      {excelFile && (
        <>
          <div className="HomeRoute__Tile__Group">
            <h2 className="Utils__Label">Selected file</h2>
            <p>{excelFile.name}</p>
          </div>
          <div className="HomeRoute__Tile__ButtonsContainer">
            <Button onClick={onReset} disabled={isCreating}>
              Reset
            </Button>
            <Button isPrimary onClick={onSave} disabled={isCreating}>
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
