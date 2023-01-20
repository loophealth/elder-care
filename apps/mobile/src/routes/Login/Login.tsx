import { FormEvent, useCallback, useState } from "react";
import {
  isLoggedIn,
  signIn,
  useCurrentUser,
  verifyPhoneNumber,
} from "lib/firebaseHelpers";
import { useNavigate } from "react-router-dom";

import { Button } from "components/Button/Button";
import { Input } from "components/Input/Input";

import "./Login.css";

enum LoginStep {
  PhoneNumber,
  VerificationCode,
}

export const Login = () => {
  const navigate = useNavigate();

  const user = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");

  let loginStep = LoginStep.PhoneNumber;
  if (isLoggedIn(user)) {
    navigate("/protected");
  } else if (verificationId.length > 0) {
    loginStep = LoginStep.VerificationCode;
  }

  const onSubmitPhoneNumber = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
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
    },
    [phoneNumber]
  );

  const onSubmitVerificationCode = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await signIn(verificationId, verificationCode);
        navigate("/protected");
      } catch (e) {
        console.error(e);
      }
    },
    [verificationId, verificationCode, navigate]
  );

  return (
    <>
      <h1 className="Login__Heading">Login</h1>

      {loginStep === LoginStep.PhoneNumber && (
        <form className="Login__form" onSubmit={onSubmitPhoneNumber}>
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <Button type="submit" disabled={isLoading}>
            Get verification code
          </Button>
        </form>
      )}

      {loginStep === LoginStep.VerificationCode && (
        <form className="Login__form" onSubmit={onSubmitVerificationCode}>
          <label htmlFor="verificationCode">Verification code: </label>
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
    </>
  );
};
