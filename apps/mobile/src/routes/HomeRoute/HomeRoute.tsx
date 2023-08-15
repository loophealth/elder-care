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
import { ReactComponent as EmptyCarePlanImage } from "images/empty-care-plan.svg";

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
      const { followUps, riskFactors } = patient?.profile;

      return !(
        diet?.length > 0 ||
        physicalActivity?.length > 0 ||
        medication?.length > 0 ||
        suggestedContent?.length > 0 ||
        others?.length > 0 ||
        prescription?.length > 0 ||
        physioPrescription?.length > 0 ||
        (followUps && followUps?.length > 0) ||
        (riskFactors && riskFactors?.length > 0)
      );
    }
  }, [patient]);

  if (patient && isCarePlanEmpty && !state?.from) {
    return <Navigate to="/report" />;
  }

  const onLogOut = async () => {
    logCustomEvent("ClickedOn_Logout", {
      name: "logout",
      category: "Home",
      user_name: patient?.profile?.fullName,
      platform: "Elder_Care",
    });
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
      {/* {!isCarePlanEmpty ? (
        <div className="HomeRoute__Timeline">
          <div className="HomeRoute__Timeline__TimelineTicks" />
        </div>
      ) : null} */}
      <div
        className={
          !isCarePlanEmpty
            ? "HomeRoute__Content__Container"
            : "HomeRoute__Content__Container HomeRoute__Empty__Content__Container"
        }
      >
        {!isCarePlanEmpty ? (
          <div className="HomeRoute__Content">
            <div className="HomeRoute__CarePlan">
              {/* <div className="HomeRoute__Dot HomeRoute__Dot--Active" /> */}
              <CarePlanChecklist />
            </div>
            {futureFollowUps && futureFollowUps?.length !== 0 ? (
              <div className="HomeRoute__FollowUps">
                <div className="CarePlanChecklist__Title Upcoming__Title">
                  Upcoming
                </div>

                <div className="HomeRoute__Timeline__TimelineTicks" />

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
                  <RiskFactorTile
                    key={riskFactor.name}
                    riskFactor={riskFactor}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="EmptyCarePlan__Container">
            <EmptyCarePlanImage className="EmptyCarePlan__Image" />
            <div className="HomeRoute__Empty__Content">
              <p>View the care plan here after your doctor consult.</p>
              <p className="Empty__Content__Line__2">We'll schedule it soon!</p>
            </div>
          </div>
        )}
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
