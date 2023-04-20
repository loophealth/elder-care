// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyA_8Rqp5LLyszAVdFIWSWqVnmqfXTspbmQ",
    authDomain: "elder-care-mvp.firebaseapp.com",
    projectId: "elder-care-mvp",
    storageBucket: "elder-care-mvp.appspot.com",
    messagingSenderId: "1020932618874",
    appId: "1:1020932618874:web:155eea31476266612ed9c3",
    measurementId: "G-E8ETE16HPM"
  };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
