import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  Auth,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Capacitor } from "@capacitor/core";

import { firebaseConfig } from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export let auth: Auth;
if (Capacitor.isNativePlatform()) {
  auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
  });
} else {
  auth = getAuth(app);
}

export const db = getFirestore(app);
