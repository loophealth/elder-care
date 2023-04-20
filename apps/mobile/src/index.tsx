import React from "react";
import ReactDOM from "react-dom/client";

import { AuthProvider, PatientProvider } from "@loophealth/api";

import { App } from "App";
import reportWebVitals from "reportWebVitals";
import { registerServiceWorker } from "./register-sw";

registerServiceWorker();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PatientProvider>
        <App />
      </PatientProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
