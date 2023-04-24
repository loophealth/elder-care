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
import {
  getMessaging,
  getToken,
  onMessage,
  MessagePayload,
  Messaging,
} from "firebase/messaging";

import { firebaseConfig, notificationKeys } from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

let messaging: Messaging;

export const requestPermissionAndToken = (
  setTokenFound: React.Dispatch<React.SetStateAction<string>>
) => {
  console.log("Requesting permission...");
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    console.log("Permission has already been granted.");
    if (!messaging) {
      messaging = getMessaging(app);
    }
    requestForToken(setTokenFound);
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        if (!messaging) {
          messaging = getMessaging(app);
        }
        requestForToken(setTokenFound);
      }
    });
  }
};

export const requestForToken = (
  setTokenFound: React.Dispatch<React.SetStateAction<string>>
) => {
  return getToken(messaging, { vapidKey: notificationKeys?.webPushKey })
    .then((currentToken) => {
      if (currentToken) {
        // Perform any other neccessary action with the token
        console.log("current token for client: ", currentToken);
        setTokenFound(currentToken);
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound("");
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = (): Promise<MessagePayload> =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export const sendNotification = (notificationData: any) => {
  const { title, body, fcmToken, image } = notificationData;
  const message = {
    notification: {
      title,
      body,
      image,
    },
    to: fcmToken,
  };
  fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    body: JSON.stringify(message),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `key=${notificationKeys?.fcmServerKey}`,
    },
  })
    .then((response) => response.json())
    .then((json) => console.log("sendNotification response => ", json))
    .catch((err) => console.log(err));
};

export let auth: Auth;
if (Capacitor.isNativePlatform()) {
  auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
  });
} else {
  auth = getAuth(app);
}

export const db = getFirestore(app);
