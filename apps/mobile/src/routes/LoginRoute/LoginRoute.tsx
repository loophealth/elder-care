import { FormEvent, useState } from "react";
import { signIn, verifyPhoneNumber } from "lib/firebaseHelpers";
import { Navigate, useNavigate } from "react-router-dom";

import { IRequestStatus, useAuth } from "@loophealth/api";

import { Button } from "components/Button/Button";
import { Input } from "components/Input/Input";

import "./LoginRoute.css";

enum LoginStep {
  PhoneNumber,
  VerificationCode,
}

export const LoginRoute = () => {
  const { user, requestStatus } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");

  let loginStep = LoginStep.PhoneNumber;
  if (requestStatus === IRequestStatus.Loaded && user !== null) {
    return <Navigate to="/" />;
  } else if (verificationId.length > 0) {
    loginStep = LoginStep.VerificationCode;
  }

  const onSubmitPhoneNumber = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const id = await verifyPhoneNumber(phoneNumber);
      if (!id) {
        throw new Error("Firebase did not return a verification ID");
      }
      setVerificationId(id);
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmitVerificationCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signIn(verificationId, verificationCode);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="LoginRoute">
      <h1 className="LoginRoute__Heading">Login</h1>

      {loginStep === LoginStep.PhoneNumber && (
        <form className="LoginRoute__Form" onSubmit={onSubmitPhoneNumber}>
          <label htmlFor="phoneNumber">
            Enter your 10-digit mobile number to login.
          </label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter mobile number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            minLength={10}
            maxLength={10}
            pattern="[0-9]*"
            required
          />

          <Button type="submit" disabled={isLoading}>
            Get verification code
          </Button>
        </form>
      )}

      {loginStep === LoginStep.VerificationCode && (
        <form className="LoginRoute__Form" onSubmit={onSubmitVerificationCode}>
          <label htmlFor="verificationCode">
            Enter the verification code that was sent to your phone as an SMS
            message.
          </label>
          <Input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />

          <Button type="submit" disabled={isLoading}>
            Log in
          </Button>
        </form>
      )}
    </div>
  );
};
