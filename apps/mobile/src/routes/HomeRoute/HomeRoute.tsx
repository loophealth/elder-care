import { format } from "date-fns";

import { useAuth, usePatient } from "@loophealth/api";

import { Button, ButtonVariant } from "components/Button";
import { RiskFactorTile } from "components/RiskFactorTile";
import { CarePlanChecklist } from "components/CarePlanChecklist";
import { signOut } from "lib/firebaseHelpers";

import "./HomeRoute.css";

export const HomeRoute = () => {
  const { user } = useAuth();
  const { patient } = usePatient();

  const onLogOut = async () => {
    await signOut();
  };

  const futureFollowUps = patient?.profile?.followUps?.filter(
    (followUp) => followUp.date.toDate() >= new Date()
  );

  if (!patient) {
    return null;
  }

  return (
    <main className="HomeRoute">
      <div className="HomeRoute__Timeline">
        <div className="HomeRoute__Timeline__TimelineTicks" />
      </div>
      <div className="HomeRoute__Content">
        <div className="HomeRoute__CarePlan">
          <div className="HomeRoute__Dot HomeRoute__Dot--Active" />
          <CarePlanChecklist />
        </div>

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

        <div className="HomeRoute__RiskFactors">
          <div className="Utils__Label">Your future risk factors</div>
          {patient?.profile?.riskFactors?.map((riskFactor) => (
            <RiskFactorTile key={riskFactor.name} riskFactor={riskFactor} />
          ))}
        </div>

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
