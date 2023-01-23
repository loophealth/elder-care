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

import { firebaseConfig } from "lib/firebaseConfig";

// Initialize Firebase.
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth.
export let auth: Auth;
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
