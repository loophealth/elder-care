import { format } from "date-fns";

import { logCustomEvent, useAuth, usePatient } from "@loophealth/api";

import { Button, ButtonVariant } from "components/Button";
import { RiskFactorTile } from "components/RiskFactorTile";
import { CarePlanChecklist } from "components/CarePlanChecklist";
import { signOut } from "lib/firebaseHelpers";

import "./HomeRoute.css";
import { resetLocalStorageOnLogout } from "lib/useCarePlanTodoList";
import { LoadingSpinner } from "@loophealth/ui";
import { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { PageHeader } from "components/PageHeader";

export const HomeRoute = () => {
  const { user, setUser } = useAuth();
  const { patient, setPatient } = usePatient();
  const location = useLocation();
  const { state } = location;

  const isCarePlanEmpty = useMemo(() => {
    if (patient) {
      const {
        diet,
        physicalActivity,
        medication,
        suggestedContent,
        others,
        prescription,
        physioPrescription,
      } = patient?.carePlan;

      return !(
        diet?.length > 0 ||
        physicalActivity?.length > 0 ||
        medication?.length > 0 ||
        suggestedContent?.length > 0 ||
        others?.length > 0 ||
        prescription?.length > 0 ||
        physioPrescription?.length > 0
      );
    }
  }, [patient]);

  if (patient && isCarePlanEmpty && !state?.from) {
    return <Navigate to="/report" />;
  }

  const onLogOut = async () => {
    logCustomEvent("click_event", { name: "logout", category: "Home" });
    setUser(null);
    setPatient(null);
    resetLocalStorageOnLogout();
    await signOut();
  };

  const futureFollowUps = patient?.profile?.followUps?.filter(
    (followUp) => followUp.date.toDate() >= new Date()
  );

  if (!patient) {
    return (
      <div className="LoaderContainer">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="HomeRoute">
      <PageHeader label="Home" showProfile={true} />
      <div className="HomeRoute__Timeline">
        <div className="HomeRoute__Timeline__TimelineTicks" />
      </div>
      <div className="HomeRoute__Content">
        <div className="HomeRoute__CarePlan">
          <div className="HomeRoute__Dot HomeRoute__Dot--Active" />
          <CarePlanChecklist />
        </div>
        {futureFollowUps && futureFollowUps?.length !== 0 ? (
          <div className="HomeRoute__FollowUps">
            <div className="CarePlanChecklist__Title">Upcoming</div>
            {/* TODO: extract this list into a separate component */}
            {futureFollowUps?.map((followUp) => (
              <div
                key={followUp.title}
                className="HomeRoute__FollowUps__FollowUp"
              >
                <div className="HomeRoute__Dot HomeRoute__Dot--Inactive" />
                <div className="Utils__Label HomeRoute__FollowUps__FollowUp__Date">
                  {format(followUp.date.toDate(), "do MMMM, yyyy")}
                </div>
                <div className="HomeRoute__FollowUps__FollowUp__Reason">
                  {followUp.title}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {patient?.profile?.riskFactors &&
        patient?.profile?.riskFactors?.length !== 0 ? (
          <div className="HomeRoute__RiskFactors">
            <div className="Utils__Label">Your future risk factors</div>
            {patient?.profile?.riskFactors?.map((riskFactor) => (
              <RiskFactorTile key={riskFactor.name} riskFactor={riskFactor} />
            ))}
          </div>
        ) : null}

        <div className="HomeRoute__Logout">
          <Button
            className="HomeRoute__Logout__Button"
            variant={ButtonVariant.Danger}
            onClick={onLogOut}
          >
            Log out of the app
          </Button>
          <p>You are logged in as: {user?.phoneNumber ?? "unknown"}</p>
        </div>
      </div>
    </main>
  );
};
