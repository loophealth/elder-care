import { useAuth } from "@loophealth/api";
import { signOut } from "lib/firebaseHelpers";

export const HomeRoute = () => {
  const { user } = useAuth();

  const onLogOut = async () => {
    await signOut();
  };

  return (
    <>
      <h2>Home</h2>
      <p>You are currently logged in as: {user?.phoneNumber ?? "unknown"}</p>
      <button onClick={onLogOut}>Log Out</button>
    </>
  );
};
