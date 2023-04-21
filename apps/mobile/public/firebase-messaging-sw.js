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
    icon: "https://global-uploads.webflow.com/619b33946e0527b5a12bec15/61f8edaecca71a1ae15ec68b_loop-logo-moss.svg",
    actions: [{action:'ok', title: 'Done'},{action:'dismiss', title: 'Dismiss'}]
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.onnotificationclick = (event) => {
  let url = 'https://elder-care-mobile.web.app';
  event.notification.close();
  switch (event.action) {
    case 'ok':
        // This looks to see if the current is already open and
        // focuses if it is
        event.waitUntil(
          clients
            .matchAll({
              type: "window",
            })
            .then((clientList) => {
              for (const client of clientList) {
                if (client.url === url && "focus" in client) return client.focus();
              }
              if (clients.openWindow) return clients.openWindow(url);
            })
        );
        break;
    case 'dismiss':
        console.log('dismissed')
        break;
  }
};