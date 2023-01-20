import { useCallback } from "react";
import { signOut, useCurrentUser } from "lib/firebaseHelpers";
import { useNavigate } from "react-router-dom";

export const Protected = () => {
  const navigate = useNavigate();
  const user = useCurrentUser();

  const onSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  }, [navigate]);

  return (
    <>
      <h2>Protected</h2>
      <p>You made it! Your phone number is: {user?.phoneNumber ?? "unknown"}</p>
      <p>
        <button onClick={onSignOut}>Sign Out</button>
      </p>
    </>
  );
};
