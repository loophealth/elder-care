import { useAuth } from "@loophealth/api";
import { Link } from "react-router-dom";

export const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <h2>Home</h2>
      <p>Welcome!</p>
      <p>
        Do you want to look at the <Link to="/protected">protected page</Link>?
      </p>
      <p>
        You might want to go to the <Link to="/login">login page</Link> first,
        though.
      </p>
      <p>You are currently logged in as: {user?.phoneNumber ?? "unknown"}</p>
    </>
  );
};
