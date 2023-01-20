import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  User,
  signOut as signOutWeb,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { redirect } from "react-router-dom";

import { firebaseConfig } from "lib/firebaseConfig";

// Initialize Firebase.
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth.
let auth: Auth;
if (Capacitor.isNativePlatform()) {
  auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
  });
} else {
  auth = getAuth(app);
}

/**
 * Get currently logged-in user from the Web SDK.
 */
export const getCurrentUser = (): Promise<User | null> =>
  new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });

export const isLoggedIn = (user: User | null) => {
  return user !== null;
};

export const useCurrentUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };

    getUser();
  }, []);

  return user;
};

export const authLoader = async () => {
  const user = await getCurrentUser();

  if (!isLoggedIn(user)) {
    return redirect("/login");
  } else {
    return user;
  }
};

const verifyPhoneNumberNative = async (
  phoneNumber: string
): Promise<string | null> => {
  const { verificationId } = await FirebaseAuthentication.signInWithPhoneNumber(
    { phoneNumber }
  );

  return verificationId ?? null;
};

const verifyPhoneNumberWeb = async (
  phoneNumber: string,
  recaptchaContainerId: string
): Promise<string | null> => {
  const provider = new PhoneAuthProvider(auth);
  const applicationVerifier = new RecaptchaVerifier(
    recaptchaContainerId,
    { size: "invisible" },
    auth
  );

  const verificationId = await provider.verifyPhoneNumber(
    phoneNumber,
    applicationVerifier
  );

  applicationVerifier.clear();

  return verificationId ?? null;
};

export const verifyPhoneNumber = async (
  phoneNumber: string,
  recaptchaContainerId?: string
): Promise<string | null> => {
  if (Capacitor.isNativePlatform()) {
    return verifyPhoneNumberNative(phoneNumber);
  }

  if (!recaptchaContainerId) {
    throw new Error(
      "A recaptchaContainerId is required for authentication on the web"
    );
  }

  return verifyPhoneNumberWeb(phoneNumber, recaptchaContainerId);
};

export const signIn = async (
  verificationId: string,
  verificationCode: string
): Promise<User> => {
  const credential = PhoneAuthProvider.credential(
    verificationId || "",
    verificationCode || ""
  );
  // Always sign in on the web layer, because that's what we care about.
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
};

export const signOut = () => signOutWeb(auth);
