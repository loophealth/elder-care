import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { IRequestStatus, useAuth } from "@loophealth/api";

import { Button } from "components/Button";
import { Input } from "components/Input";
import { auth } from "lib/firebaseHelpers";

import "./LoginRoute.css";

export const LoginRoute = () => {
  const { user, requestStatus } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onEmailChange = (e: FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const onPasswordChange = (e: FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      alert(
        "Login failed. Please check your email and password and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (requestStatus === IRequestStatus.Loaded && user !== null) {
    return <Navigate to="/" />;
  } else if (requestStatus === IRequestStatus.Loading) {
    return null;
  }

  return (
    <main className="LoginRoute">
      <form className="LoginRoute__Form Utils__VerticalForm" onSubmit={onLogin}>
        <div className="Utils__VerticalForm__Group">
          <label className="Utils__Label" htmlFor="email">
            Email
          </label>
          <Input
            type="email"
            placeholder="ashok.kumar@example.com"
            id="email"
            value={email}
            onChange={onEmailChange}
            disabled={isLoading}
          />
        </div>
        <div className="Utils__VerticalForm__Group">
          <label className="Utils__Label" htmlFor="password">
            Password
          </label>
          <Input
            type="password"
            placeholder="password"
            id="password"
            value={password}
            onChange={onPasswordChange}
            disabled={isLoading}
          />
        </div>
        <div className="Utils__VerticalForm__ButtonsContainer">
          <Button isPrimary type="submit" disabled={isLoading}>
            Login
          </Button>
        </div>
      </form>
    </main>
  );
};
