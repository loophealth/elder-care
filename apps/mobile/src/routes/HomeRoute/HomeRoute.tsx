import { useAuth } from "@loophealth/api";

import { Button, ButtonVariant } from "components/Button";

import { signOut } from "lib/firebaseHelpers";
import { useSafeArea } from "lib/useSafeArea";

import "./HomeRoute.css";

export const HomeRoute = () => {
  const { user } = useAuth();
  const { isLoadingSafeAreaInsets, safeAreaInsets } = useSafeArea();

  const onLogOut = async () => {
    await signOut();
  };

  if (isLoadingSafeAreaInsets || !safeAreaInsets) {
    return null;
  }

  return (
    <div
      className="HomeRoute"
      style={{ paddingTop: `${safeAreaInsets.top}px` }}
    >
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
