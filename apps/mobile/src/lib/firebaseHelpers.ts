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

/**
 * Use the native SDK to verify the user's phone number. This is the primary
 * reason we need the native SDK and the Capacitor plugin. Most things can be
 * done with the Web SDK, but signing in with a phone number requires the native
 * SDK.
 */
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

/**
 * Sign in with a phone number on the web layer. We never use the native layer
 * for anything except verifying the phone number, so we don't need to worry
 * about signing in with the native layer.
 */
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

/**
 * Sign out of Firebase on the web layer. We never sign into the native layer,
 * so we don't need to sign out of it.
 */
export const signOut = () => signOutWeb(auth);
