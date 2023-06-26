import { initializeApp } from "firebase/app";
import {
  getAnalytics,
  logEvent,
  setUserProperties,
  CustomEventName,
} from "firebase/analytics";
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
import {
  getStorage,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { firebaseConfig, notificationKeys } from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(app);
export const segmentAnalytics = (window as any)?.analytics;

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
        // console.log("current token for client: ", currentToken);
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
export const storage = getStorage(app, "gs://elder-care-mvp.appspot.com");

export const logCustomEvent = (
  eventName: CustomEventName<string>,
  eventParams?: {
    [key: string]: any;
  }
) => {
  if (eventName) {
    logEvent(firebaseAnalytics, formatEventName(eventName), eventParams);
    if (segmentAnalytics) {
      segmentAnalytics.track(formatEventName(eventName), {
        ...eventParams,
        platform: "Elder_Care",
      });
    }
  }
};

export const logCurrentScreen = (
  screenName: string,
  eventParams?: {
    [key: string]: any;
  }
) => {
  if (screenName) {
    logEvent(firebaseAnalytics, formatEventName("Viewed_" + screenName), {
      screen_name: screenName,
      ...eventParams,
    });
    if (segmentAnalytics) {
      segmentAnalytics.track(formatEventName("Viewed_" + screenName), {
        ...eventParams,
        screen_name: screenName,
        platform: "Elder_Care",
      });
    }
  }
};

export const logUser = (userData: { [key: string]: any }) => {
  setUserProperties(firebaseAnalytics, userData, { global: true });

  if (segmentAnalytics) {
    segmentAnalytics.identify(userData?.user_name, {
      name: userData?.user_name,
      platform: "Elder_Care",
    });
  }
};

// Upload file to Firebase storage
export const getUrlFromFile = async (
  file: File,
  metadata?: any,
  limit: number = 2048,
  folderName: string = "prescription"
): Promise<string | undefined> => {
  const fileSize = file?.size ? Math.round(file.size / 1024) : 0;

  const metaData = {
    customMetadata: { ...metadata },
    contentType: file?.type,
  };

  if (file && fileSize <= limit) {
    const ext = file.name.split(".").reverse()[0];
    const storageRef = ref(
      storage,
      `${folderName}/${new Date().getTime()}.${ext}`
    );

    await uploadBytes(storageRef, file, metaData);
    const url = await getDownloadURL(storageRef);
    return url;
  } else {
    alert(`File too Big, please select a file less than ${limit / 1024} Mb`);
  }
};

// Delete file to Firebase storage
export const deleteFileFromUrl = (urlStr: string) => {
  return new Promise((res, rej) => {
    const filePath = decodeURIComponent(
      urlStr.split("/").reverse().join("").split("?")[0]
    );
    // Create a reference to the file to delete
    const desertRef = ref(storage, filePath);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        res("Deleted Successfully");
      })
      .catch((error) => {
        rej(error);
      });
  });
};

const formatEventName = (str: string) => {
  str = str.replace(/[- ]/g, "_");
  const arr = str.split("_");

  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  const str2 = arr.join("_");
  return str2;
};
