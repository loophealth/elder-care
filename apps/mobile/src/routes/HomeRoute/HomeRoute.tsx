import { useAuth } from "@loophealth/api";

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
      <p>You are currently logged in as: {user?.phoneNumber ?? "unknown"}</p>
      <button onClick={onLogOut}>Log Out</button>
    </div>
  );
};
