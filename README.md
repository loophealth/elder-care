# Loop Health Prototype

This repository contains several prototypes for future Loop Health services. Our goal is to rapidly test different offerings and gather feedback for the design team to iterate on. Once we have collected enough data, these apps will be re-written as native applications. Therefore, rapid iteration is more important than a perfect implementation.

Becausse of this, some applications in this monorepo may be incomplete or broken, whereas others may be fully functional and deployed in production.

## Goals

- Explore and test various prototypes for future services.
- Iterate quickly and gather feedback for the design team.
- Develop a working set of services that will later be converted into native applications.

## Tech Stack

- The monorepo structure is managed using [Turborepo](https://turbo.build/repo), which was chosen due to the complexity of setting up plain NPM workspaces with TypeScript and React.
- The project is built using React and web technologies.
- We use Firebase for auth and as our data store. We also plan to use it for analytics.
- We use Netlify for continuous deployment.

## Apps

The `apps` directory contains separate applications, each deployed to a different domain. These apps share the same API and UI components. They include:

- `interactive-report`: an app designed for running on large screens in clinics, helping users visualize and understand what their doctors tell them. It also features an admin interface for doctors, medical assistants, and designers to view and edit data stored in Firebase.
- `mobile`: an early prototype of the user-facing mobile app. We initially used Capacitor for turning this into a native app, but we abandoned this approach due to the complexities of releasing to the App Store and Play Store.
- `elder-care`: the current user-facing mobile app, which is a simple shell with limited functionality at the moment. It's designed to be installed as a PWA on user devices, which will allow us to release updates without going through the App Store or Play Store.

All React apps are set up using `create-react-app` and extended with `craco` to enable imports from outside the application's source tree. This allows importing libraries stored in the `packages` directory.

## Shared Code

The `packages` directory houses shared code, including:

- `api`: Common functions, utilities, and Firebase wrappers.
- `craco-shared-config`: A shared `craco` configuration used by all apps.
- `ui`: Shared UI components.

## Firebase

An `.env.local` file containing Firebase environment variables must be present in each app directory for proper Firebase access. The file should look like this:

```text
REACT_APP_FIREBASE_API_KEY="your-api-key"
REACT_APP_FIREBASE_AUTH_DOMAIN="your-auth-domain"
REACT_APP_FIREBASE_PROJECT_ID="your-project-id"
REACT_APP_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
REACT_APP_FIREBASE_APP_ID="your-app-id"
REACT_APP_FIREBASE_MEASUREMENT_ID="your-measurement-id"
```

You can find these values in the Firebase console.

## Running Locally

To run the apps locally, you must have Node.js and NPM installed. The app is tested with the current LTS version of Node.js, which is 18.15.0 at the time of this writing.

Then, run the following commands:

```bash
# Install dependencies in the root directory
npm install

# Change to an app directory and start the app
cd apps/interactive-report
npm start

# Or, change to an app directory and build the app
cd apps/interactive-report
npm run build
```

To build all apps at once, you can run `turbo build` in the root directory.
