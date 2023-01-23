import { useAuth } from "@loophealth/api";

export const HomeRoute = () => {
  const { user } = useAuth();

  return (
    <>
      <h2>Home</h2>
      <p>You are currently logged in as: {user?.phoneNumber ?? "unknown"}</p>
    </>
  );
};
