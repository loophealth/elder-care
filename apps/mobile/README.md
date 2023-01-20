# Loop Health Prototype App

This is a Capacitor application built for rapidly iterating on the Loop Health app. It's not intended for production use, but for prototyping and user testing features currently being designed by the Prophecy team.

This is a standard React application that uses Capacitor to build native apps for iOS and Android.

## Configuring Firebase

This app uses Firebase for authentication and cloud storage. Before you can run it, you need to make sure you have a Firebase project set up and configured. See the [Firebase documentation](https://firebase.google.com/docs/) for more information.

Within the project, create new apps for web, iOS, and Android. For each app, download the configuration file and place it in the directory corresponding to that project. The files should be placed at:

- Web: `src/lib/firebaseConfig.js`
- iOS: `ios/App/App/GoogleService-Info.plist`
- Android: `android/app/google-services.json`

## Running the App Locally

To run a development server locally:

```bash
npm install
npm start
```

To create a production build locally:

```bash
npm install
npm run build
```

## Running the App on a Device Simulator

Before running the app in the iOS Simulator or Android Emulator, you'll need to make sure your computer is set up to run Capacitor apps. See the [Capacitor environment setup documentation](https://capacitorjs.com/docs/getting-started/environment-setup) for more information.

To run the app in the iOS Simulator:

```bash
npm install
npm run build
npx cap run ios
```

To run the app in the Android Emulator:

```bash
npm install
npm run build
npx cap run android
```

## Running the App on a Physical Device

To be determined.
