import { useAuth, usePatient } from "@loophealth/api";

import { Button, ButtonVariant } from "components/Button";
import { RiskFactorTile } from "components/RiskFactorTile";
import { signOut } from "lib/firebaseHelpers";

import "./HomeRoute.css";

export const HomeRoute = () => {
  const { user } = useAuth();
  const { patient } = usePatient();

  const onLogOut = async () => {
    await signOut();
  };

  return (
    <div className="HomeRoute">
      <div className="HomeRoute__RiskFactors">
        {patient?.profile.riskFactors.map((riskFactor) => (
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
  );
};
