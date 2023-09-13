import { Fragment, useEffect, useState } from "react";
import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import {
  IRequestStatus,
  useAuth,
  auth,
  usePatient,
  Patient,
  logUser,
  findLinkedUserProfile,
  ProtectedRoute,
} from "@loophealth/api";
import "@loophealth/ui/src/styles/reset.css";
import "@loophealth/ui/src/styles/utopia.css";
import "@loophealth/ui/src/styles/globals.css";
import "@loophealth/ui/src/styles/utils.css";

import { router } from "router";

import "fonts/ApercuPro/ApercuPro.css";
import "utils.css";
import "index.css";
import { NotificationView } from "./components/NotificationView";
import { InstallPWADialog } from "components/InstallDialog";

import { RootLayout } from "components/RootLayout";
import { LoginRoute } from "routes/LoginRoute";
import { SummaryRoute } from "routes/SummaryRoute";
import { HomeRoute } from "routes/HomeRoute";
import { CareRoute } from "routes/CareRoute";
import { ReportOverviewRoute } from "routes/ReportOverviewRoute";
import { ReportDetailsRoute } from "routes/ReportDetailsRoute";
import { PrescriptionRoute } from "routes/PrescriptionRoute";
import { Wrapper } from "components/Wrapper/Wrapper";

export const App = () => {
  const { user, setUser, setRequestStatus } = useAuth();
  const { setPatient, setFoundPatient } = usePatient();
  const [isOpen, setIsOpen] = useState(true);

  // Handle auth state changes. Doing it here lets us call sign in and sign out
  // from anywhere else in the app, and be sure that any components that depend
  // on the auth state will get re-rendered.
  useEffect(() => {
    setRequestStatus(IRequestStatus.Loading);
    onAuthStateChanged(auth, (user) => {
      setRequestStatus(IRequestStatus.Loaded);
      setUser(user);
    });
  }, [setUser, setRequestStatus]);

  // Get the current patient profile using the user's phone number.
  useEffect(() => {
    const findPatient = async () => {
      // This phone number comes from Firebase, so it will already have the
      // country code.
      const foundPatient = await Patient.fromPhoneNumber(
        user?.phoneNumber || ""
      );
      setPatient(foundPatient);
      const logUserData = {
        user_name: foundPatient?.profile?.fullName,
        user_phone_number: foundPatient?.profile?.phoneNumber,
        is_subscriber: true,
      };
      logUser(logUserData);
    };

    const findLinkedProfile = async () => {
      if (user?.phoneNumber) {
        const { data } = await findLinkedUserProfile(user?.phoneNumber);
        setFoundPatient(data);
      }
    };

    if (user) {
      findPatient();
      findLinkedProfile();
    }
    // eslint-disable-next-line
  }, [user, setPatient]);

  return (
    <>
      {/* <RouterProvider router={router} /> */}
      <BrowserRouter>
        <Wrapper>
          <Routes>
            <Route
              path="/login"
              element={
                <Fragment>
                  <RootLayout />
                  <LoginRoute />
                </Fragment>
              }
            />
            <Route
              path="/summary"
              element={
                <Fragment>
                  <RootLayout />
                  <ProtectedRoute component={<SummaryRoute />} />
                </Fragment>
              }
            />
            <Route
              path="/prescriptions"
              element={
                <Fragment>
                  <RootLayout />
                  <ProtectedRoute component={<PrescriptionRoute />} />
                </Fragment>
              }
            />
            <Route
              path="/"
              element={
                <Fragment>
                  <RootLayout shouldShowNavbar={true} />
                  <ProtectedRoute component={<HomeRoute />} />
                </Fragment>
              }
            />
            <Route
              path="/care"
              element={
                <Fragment>
                  <RootLayout shouldShowNavbar={true} />
                  <ProtectedRoute component={<CareRoute />} />
                </Fragment>
              }
            />
            <Route
              path="/report"
              element={
                <Fragment>
                  <RootLayout shouldShowNavbar={true} />
                  <ProtectedRoute component={<ReportOverviewRoute />} />
                </Fragment>
              }
            />
            <Route
              path="/report/:slug"
              element={
                <Fragment>
                  <RootLayout shouldShowNavbar={true} />
                  <ProtectedRoute component={<ReportDetailsRoute />} />
                </Fragment>
              }
            />
          </Routes>
        </Wrapper>
      </BrowserRouter>
      <NotificationView />
      {isOpen && <InstallPWADialog setIsOpen={setIsOpen} />}
    </>
  );
};
